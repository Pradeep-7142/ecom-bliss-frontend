import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';

interface PaymentFormProps {
  items: Array<{
    productId: string;
    quantity: number;
    name: string;
    price: number;
    image: string;
  }>;
  onSuccess: (orderId: string) => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ items, onSuccess, onCancel }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [razorpayOrderId, setRazorpayOrderId] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  // SECURITY: Don't calculate totals on frontend - server will calculate
  // Only send productId and quantity to server
  const itemsForServer = items.map(item => ({
    productId: item.productId,
    quantity: item.quantity
  }));

  // Create payment order
  useEffect(() => {
    const createPaymentOrder = async () => {
      try {
        setLoading(true);
        const response = await api.post('/payments/create-payment-order', {
          items: itemsForServer, // SECURITY: Only send productId and quantity
          shippingAddress
        });
        
        setOrderId(response.data.orderId);
        setRazorpayOrderId(response.data.razorpayOrderId);
        setTotalAmount(response.data.totalAmount);
      } catch (error) {
        console.error('Error creating payment order:', error);
        toast({
          title: 'Error',
          description: 'Failed to initialize payment. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    if (items.length > 0) {
      createPaymentOrder();
    }
  }, [items, shippingAddress]);

  const handlePayment = async () => {
    if (!razorpayOrderId || !orderId) {
      toast({
        title: 'Error',
        description: 'Payment order not initialized. Please try again.',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: Math.round(totalAmount * 100), // Convert to paise
          currency: 'INR',
          name: 'Ecom Bliss',
          description: 'Order Payment',
          order_id: razorpayOrderId,
          handler: async function (response: any) {
            try {
              // Verify payment with backend
              await api.post('/payments/verify-payment', {
                orderId,
                razorpayOrderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              });

              toast({
                title: 'Payment Successful',
                description: 'Your payment has been processed successfully!',
              });

              onSuccess(orderId);
            } catch (error) {
              console.error('Payment verification error:', error);
              toast({
                title: 'Payment Failed',
                description: 'Payment verification failed. Please contact support.',
                variant: 'destructive'
              });
            }
          },
          prefill: {
            name: 'Customer Name', // You can get this from user context
            email: 'customer@example.com', // You can get this from user context
            contact: '' // You can get this from user context
          },
          notes: {
            orderId: orderId
          },
          theme: {
            color: '#3B82F6'
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      };

      script.onerror = () => {
        toast({
          title: 'Error',
          description: 'Failed to load payment gateway. Please try again.',
          variant: 'destructive'
        });
        setLoading(false);
      };

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Error',
        description: 'Payment failed. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }} className="space-y-6">
          {/* Shipping Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Shipping Address</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="street">Street</Label>
                <Input
                  id="street"
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, street: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={shippingAddress.zipCode}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={shippingAddress.country}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, country: e.target.value }))}
                  required
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>{items.length} products</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total:</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Info */}
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <div className="border rounded-md p-3 bg-gray-50">
              <p className="text-sm text-gray-600">
                You will be redirected to Razorpay's secure payment gateway to complete your payment.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !razorpayOrderId}
              className="flex-1"
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm; 