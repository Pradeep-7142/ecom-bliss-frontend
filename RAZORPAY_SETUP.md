# Razorpay Payment Integration Setup Guide

This guide will help you set up the secure payment integration using Razorpay in your MERN e-commerce application.

## 🚀 Features Implemented

- **Secure Payment Processing**: Razorpay integration with PCI compliance
- **Order Management**: Complete order lifecycle management
- **Payment Status Tracking**: Real-time payment status updates
- **Webhook Support**: Automatic order status updates
- **User Order History**: Complete order tracking for users
- **Cart Integration**: Seamless checkout flow
- **Responsive Design**: Mobile-friendly payment forms
- **India-Focused**: Optimized for Indian payment methods

## 📋 Prerequisites

1. **Razorpay Account**: Sign up at [razorpay.com](https://razorpay.com)
2. **Node.js**: Version 16 or higher
3. **MongoDB**: Running instance
4. **Environment Variables**: Properly configured

## 🔧 Backend Setup

### 1. Install Dependencies

```bash
cd ecom-bliss-frontend/backend
npm install razorpay
```

### 2. Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/ecom-bliss

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS and OAuth redirects)
FRONTEND_URL=http://localhost:8080

# Backend URL (for OAuth callbacks)
BACKEND_URL=http://localhost:5000

# Session Secret
SESSION_SECRET=your-session-secret-key-change-this-in-production

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Razorpay Payment Configuration
RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

### 3. Get Razorpay Keys

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to **Settings > API Keys**
3. Copy your **Key ID** and **Key Secret**
4. For webhook secret, go to **Settings > Webhooks** and create a webhook endpoint

## 🔧 Frontend Setup

### 1. Environment Variables

Create a `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=Ecom Bliss
VITE_APP_VERSION=1.0.0

# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id
```

## 🔗 Razorpay Webhook Setup

### 1. Create Webhook Endpoint

1. Go to [Razorpay Dashboard > Webhooks](https://dashboard.razorpay.com/webhooks)
2. Click **Add New Webhook**
3. Set the following:
   - **URL**: `http://localhost:5000/api/payments/webhook` (for development)
   - **Events**: Select `payment.captured` and `payment.failed`
4. Copy the webhook secret and add it to your `.env` file

### 2. Production Webhook URL

For production, use your domain:
```
https://yourdomain.com/api/payments/webhooks
```

## 🧪 Testing

### Test Card Numbers

Use these test card numbers for testing:

- **Success**: `4111 1111 1111 1111`
- **Failure**: `4000 0000 0000 0002`
- **Expiry**: Any future date
- **CVV**: Any 3 digits

### Test UPI IDs

- **Success**: `success@razorpay`
- **Failure**: `failure@razorpay`

## 🔒 Security Features

### Backend Security
- **Server-side price calculation**: All prices calculated on server
- **Payment signature verification**: Verifies payment authenticity
- **Idempotency**: Prevents duplicate payments
- **Stock validation**: Ensures stock availability
- **Rate limiting**: Prevents abuse
- **Input validation**: Comprehensive data validation

### Frontend Security
- **No sensitive data**: Card details never touch your server
- **Secure redirect**: Users redirected to Razorpay's secure gateway
- **Payment verification**: All payments verified with backend

## 📱 Payment Flow

### 1. User Flow
1. User adds items to cart
2. User proceeds to checkout
3. User fills shipping address
4. User clicks "Proceed to Payment"
5. User redirected to Razorpay gateway
6. User completes payment
7. User redirected back to your site
8. Payment verified and order confirmed

### 2. Technical Flow
1. Frontend creates payment order via API
2. Backend creates order in database
3. Backend creates Razorpay order
4. Frontend loads Razorpay checkout
5. User completes payment on Razorpay
6. Razorpay sends payment data to frontend
7. Frontend verifies payment with backend
8. Backend verifies payment signature
9. Backend updates order status
10. Webhook confirms payment (backup)

## 🚀 API Endpoints

### Payment Endpoints
- `POST /api/payments/create-payment-order` - Create payment order
- `POST /api/payments/verify-payment` - Verify payment
- `GET /api/payments/status/:orderId` - Get payment status
- `DELETE /api/payments/cancel/:orderId` - Cancel payment

### Order Endpoints
- `GET /api/payments/orders` - Get user orders
- `GET /api/payments/orders/:id` - Get specific order

### Webhook Endpoint
- `POST /api/payments/webhook` - Razorpay webhook handler

## 🔧 Troubleshooting

### Common Issues

#### Issue 1: "Razorpay is not defined"
**Solution:** Check if `VITE_RAZORPAY_KEY_ID` is set correctly

#### Issue 2: "Payment verification failed"
**Solution:** Check if `RAZORPAY_KEY_SECRET` is correct and valid

#### Issue 3: "Webhook signature verification failed"
**Solution:** Verify `RAZORPAY_WEBHOOK_SECRET` matches webhook endpoint

#### Issue 4: "Order not found"
**Solution:** Check if order ID is correct and user is authorized

### Debug Steps

1. **Check Environment Variables**
   ```bash
   # Backend
   echo $RAZORPAY_KEY_ID
   echo $RAZORPAY_KEY_SECRET
   
   # Frontend
   echo $VITE_RAZORPAY_KEY_ID
   ```

2. **Check Network Requests**
   - Open browser dev tools
   - Go to Network tab
   - Monitor API calls during payment

3. **Check Server Logs**
   ```bash
   cd backend
   npm start
   ```

## 🚀 Production Checklist

### Before Going Live
- [ ] Replace test keys with live keys
- [ ] Update webhook URL to production domain
- [ ] Test with real payment methods
- [ ] Set up monitoring and logging
- [ ] Configure error handling
- [ ] Test webhook delivery

### Security Checklist
- [ ] Use HTTPS in production
- [ ] Validate all inputs
- [ ] Implement rate limiting
- [ ] Monitor for suspicious activity
- [ ] Keep dependencies updated
- [ ] Use environment variables

## 📚 Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay React Integration](https://razorpay.com/docs/payments/payment-gateway/react-integration/standard/)
- [Razorpay Webhooks](https://razorpay.com/docs/webhooks/)
- [Razorpay Testing](https://razorpay.com/docs/payments/payment-gateway/test-integration/)

## ⚠️ Important Notes

1. **Test Mode**: Use test keys for development
2. **Live Mode**: Use live keys for production
3. **Webhook Security**: Always verify webhook signatures
4. **Error Handling**: Implement proper error handling
5. **User Experience**: Provide clear feedback to users
6. **Compliance**: Follow Razorpay's terms of service

This payment integration is built with Razorpay and follows their security best practices. Make sure to comply with Razorpay's terms of service and PCI requirements. 