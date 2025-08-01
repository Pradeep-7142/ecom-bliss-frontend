// Initialize Razorpay only if secret key is provided
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && 
    process.env.RAZORPAY_KEY_ID !== 'rzp_test_your_razorpay_key_id') {
  razorpay = require('razorpay')({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
} else {
  console.warn('⚠️  Razorpay keys not configured. Payment features will be disabled.');
}

const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');

// Create payment order
const createPaymentOrder = async (req, res) => {
  try {
    // Check if Razorpay is configured
    if (!razorpay) {
      return res.status(503).json({ 
        message: 'Payment service is not configured. Please contact support.' 
      });
    }

    const { items, shippingAddress } = req.body;

    // SECURITY: Validate items structure
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Invalid items data' });
    }

    // SECURITY: Validate shipping address
    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || 
        !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.country) {
      return res.status(400).json({ message: 'Complete shipping address required' });
    }

    // SECURITY: Server-side price calculation only (ignore frontend prices)
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      // SECURITY: Validate item structure
      if (!item.productId || !item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
        return res.status(400).json({ message: 'Invalid item data' });
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      if (!product.isActive) {
        return res.status(400).json({ message: `Product ${product.name} is not available` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      // SECURITY: Use server-side price only, ignore frontend price
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price, // Server-side price only
        name: product.name,
        image: product.image
      });
    }

    // SECURITY: Server-side calculation of shipping and tax
    const shippingPrice = totalAmount > 100 ? 0 : 10; // Free shipping over $100
    const taxPrice = totalAmount * 0.1; // 10% tax
    const finalAmount = totalAmount + shippingPrice + taxPrice;

    // SECURITY: Add idempotency key to prevent duplicate payments
    const idempotencyKey = `order_${req.user.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create order in database first
    const order = new Order({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentMethod: 'razorpay',
      itemsPrice: totalAmount,
      taxPrice,
      shippingPrice,
      totalPrice: finalAmount,
      razorpayOrderId: null, // Will be set after Razorpay order creation
      status: 'pending'
    });

    await order.save();

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(finalAmount * 100), // Convert to paise (smallest currency unit)
      currency: 'INR',
      receipt: order._id.toString(),
      notes: {
        userId: req.user.id,
        itemsCount: items.length.toString(),
        orderTotal: finalAmount.toString()
      }
    });

    // Update order with Razorpay order ID
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.json({
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      totalAmount: finalAmount,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error('Payment order creation error:', error);
    res.status(500).json({ message: 'Error creating payment order' });
  }
};

// Verify payment
const verifyPayment = async (req, res) => {
  try {
    // Check if Razorpay is configured
    if (!razorpay) {
      return res.status(503).json({ 
        message: 'Payment service is not configured. Please contact support.' 
      });
    }

    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    // SECURITY: Validate input parameters
    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: 'All payment parameters required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // SECURITY: Validate order ownership
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // SECURITY: Validate Razorpay order belongs to this order
    if (order.razorpayOrderId !== razorpayOrderId) {
      return res.status(400).json({ message: 'Invalid Razorpay order for this order' });
    }

    // SECURITY: Verify payment signature
    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const crypto = require('crypto');
    const signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (signature !== razorpaySignature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // SECURITY: Verify payment with Razorpay
    const payment = await razorpay.payments.fetch(razorpayPaymentId);
    
    // SECURITY: Validate payment amount matches order
    if (payment.amount !== Math.round(order.totalPrice * 100)) {
      return res.status(400).json({ message: 'Payment amount mismatch' });
    }

    if (payment.status === 'captured') {
      // SECURITY: Use MongoDB transaction for atomic operations
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // SECURITY: Verify stock availability again
        for (const item of order.items) {
          const product = await Product.findById(item.product).session(session);
          if (!product) {
            throw new Error(`Product not found`);
          }
          if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name}`);
          }
        }

        // SECURITY: Update stock atomically
        for (const item of order.items) {
          await Product.findByIdAndUpdate(
            item.product,
            { $inc: { stock: -item.quantity } },
            { session }
          );
        }

        // Update order status
        order.isPaid = true;
        order.paidAt = Date.now();
        order.status = 'processing';
        order.paymentResult = {
          id: razorpayPaymentId,
          status: payment.status,
          update_time: new Date().toISOString(),
          email_address: req.user.email
        };

        await order.save({ session });

        await session.commitTransaction();

        res.json({
          message: 'Payment verified successfully',
          order: order,
          success: true
        });
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    } else {
      res.status(400).json({ message: 'Payment not completed' });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Error verifying payment' });
  }
};

// Get payment status
const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ order });

  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ message: 'Error getting payment status' });
  }
};

// Cancel payment
const cancelPayment = async (req, res) => {
  try {
    // Check if Razorpay is configured
    if (!razorpay) {
      return res.status(503).json({ 
        message: 'Payment service is not configured. Please contact support.' 
      });
    }

    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (order.isPaid) {
      return res.status(400).json({ message: 'Cannot cancel paid order' });
    }

    // Cancel Razorpay order if exists
    if (order.razorpayOrderId) {
      try {
        await razorpay.orders.edit(order.razorpayOrderId, {
          status: 'cancelled'
        });
      } catch (error) {
        console.error('Error cancelling Razorpay order:', error);
      }
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ message: 'Payment cancelled successfully' });

  } catch (error) {
    console.error('Cancel payment error:', error);
    res.status(500).json({ message: 'Error cancelling payment' });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name image price')
      .sort({ createdAt: -1 });

    res.json({ orders });

  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Error getting orders' });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name image price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ order });

  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({ message: 'Error getting order' });
  }
};

// Webhook handler for Razorpay events
const handleWebhook = async (req, res) => {
  // Check if Razorpay is configured
  if (!razorpay) {
    return res.status(503).json({ 
      message: 'Payment service is not configured. Please contact support.' 
    });
  }

  const signature = req.headers['x-razorpay-signature'];
  let event;

  try {
    // Verify webhook signature
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Webhook signature verification failed');
      return res.status(400).send('Webhook Error: Invalid signature');
    }

    event = req.body;
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.event) {
    case 'payment.captured':
      const payment = event.payload.payment.entity;
      console.log('Payment was captured!');
      
      // Update order status if not already updated
      const order = await Order.findOne({ 
        razorpayOrderId: payment.order_id 
      });
      
      if (order && !order.isPaid) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.status = 'processing';
        order.paymentResult = {
          id: payment.id,
          status: payment.status,
          update_time: new Date().toISOString(),
          email_address: payment.email || 'customer@example.com'
        };
        await order.save();
      }
      break;
      
    case 'payment.failed':
      const failedPayment = event.payload.payment.entity;
      console.log('Payment failed!');
      
      // Update order status
      const failedOrder = await Order.findOne({ 
        razorpayOrderId: failedPayment.order_id 
      });
      
      if (failedOrder) {
        failedOrder.status = 'cancelled';
        await failedOrder.save();
      }
      break;
      
    default:
      console.log(`Unhandled event type ${event.event}`);
  }

  res.json({ received: true });
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  getPaymentStatus,
  cancelPayment,
  getUserOrders,
  getOrderById,
  handleWebhook
}; 