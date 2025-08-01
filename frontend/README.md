# Ecom Bliss - MERN E-commerce Platform

A modern, full-stack e-commerce application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring secure payment integration with Razorpay.

## 🚀 Features

### Core Features
- **User Authentication**: JWT-based authentication with Google OAuth
- **Product Management**: Complete CRUD operations for products
- **Shopping Cart**: Persistent cart with real-time updates
- **Wishlist**: Save favorite products for later
- **Search & Filter**: Advanced product search and filtering
- **Responsive Design**: Mobile-first, modern UI

### Payment Integration
- **Secure Payments**: Razorpay integration with PCI compliance
- **Order Management**: Complete order lifecycle tracking
- **Payment Status**: Real-time payment status updates
- **Webhook Support**: Automatic order status synchronization
- **Order History**: Complete order tracking for users
- **Checkout Flow**: Seamless payment processing
- **India-Focused**: Optimized for Indian payment methods

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **Razorpay Checkout** for payment processing

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Passport.js** for OAuth
- **Razorpay** for payment processing
- **bcryptjs** for password hashing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Razorpay account

### Backend Setup

```bash
# Navigate to backend directory
cd ecom-bliss-frontend/backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Configure environment variables (see RAZORPAY_SETUP.md)
# Start the server
npm run dev
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd ecom-bliss-frontend/frontend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Configure environment variables
# Start the development server
npm run dev
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
MONGO_URI=mongodb://localhost:27017/ecom-bliss

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Server
PORT=5000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:8080

# Razorpay (Required for payments)
RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

#### Frontend (.env)
```env
# API
VITE_API_URL=http://localhost:5000/api

# App
VITE_APP_NAME=Ecom Bliss
VITE_APP_VERSION=1.0.0

# Razorpay (Required for payments)
VITE_RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id
```

## 💳 Payment Setup

The application includes a complete Razorpay payment integration. For detailed setup instructions, see [RAZORPAY_SETUP.md](./RAZORPAY_SETUP.md).

### Quick Payment Setup
1. Create a Razorpay account at [razorpay.com](https://razorpay.com)
2. Get your API keys from the Razorpay Dashboard
3. Configure webhooks for order status updates
4. Update environment variables with your Razorpay keys
5. Test with Razorpay's test card numbers

## 🚀 Usage

### Development
```bash
# Backend (Terminal 1)
cd ecom-bliss-frontend/backend
npm run dev

# Frontend (Terminal 2)
cd ecom-bliss-frontend/frontend
npm run dev
```

### Production
```bash
# Build frontend
cd ecom-bliss-frontend/frontend
npm run build

# Start backend
cd ecom-bliss-frontend/backend
npm start
```

## 📱 User Flow

1. **Browse Products**: Users can browse and search products
2. **Add to Cart**: Add items to shopping cart
3. **Authentication**: Login/register to proceed to checkout
4. **Checkout**: Complete payment with Razorpay
5. **Order Tracking**: View order history and status

## 🔒 Security Features

- **PCI Compliance**: Razorpay handles all sensitive payment data
- **JWT Authentication**: Secure user sessions
- **Input Validation**: Server-side validation
- **CORS Protection**: Proper cross-origin configuration
- **HTTPS Ready**: Production-ready security
- **Payment Signature Verification**: Ensures payment authenticity

## 🧪 Testing

### Payment Testing
Use Razorpay's test card numbers:
- **Success**: `4111 1111 1111 1111`
- **Failure**: `4000 0000 0000 0002`
- **Test UPI**: `success@razorpay` (success), `failure@razorpay` (failure)

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get specific product
- `GET /api/products/search` - Search products

### Payments
- `POST /api/payments/create-payment-order` - Create payment order
- `POST /api/payments/verify-payment` - Verify payment
- `GET /api/payments/orders` - Get user orders

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For payment integration support, see [RAZORPAY_SETUP.md](./RAZORPAY_SETUP.md).

For general issues:
1. Check the browser console for errors
2. Verify environment variables are set correctly
3. Ensure MongoDB is running
4. Test with Razorpay's test cards

## 🔗 Links

- [Razorpay Documentation](https://razorpay.com/docs)
- [React Documentation](https://react.dev)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Express.js Documentation](https://expressjs.com)
