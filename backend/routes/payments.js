const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const paymentController = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/auth');

// SECURITY: Rate limiting for payment endpoints
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many payment attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: 'Too many order requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Payment routes (with rate limiting)
router.post('/create-payment-order', paymentLimiter, authenticateToken, paymentController.createPaymentOrder);
router.post('/verify-payment', paymentLimiter, authenticateToken, paymentController.verifyPayment);
router.get('/status/:orderId', orderLimiter, authenticateToken, paymentController.getPaymentStatus);
router.delete('/cancel/:orderId', paymentLimiter, authenticateToken, paymentController.cancelPayment);

// Order routes (with rate limiting)
router.get('/orders', orderLimiter, authenticateToken, paymentController.getUserOrders);
router.get('/orders/:id', orderLimiter, authenticateToken, paymentController.getOrderById);

// Webhook route (no auth required for Razorpay webhooks)
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

module.exports = router; 