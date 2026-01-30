# Ecom Bliss Backend API

A robust Node.js/Express backend for the Ecom Bliss e-commerce platform with comprehensive authentication system.

## Features

- 🔐 **JWT Authentication** - Secure token-based authentication
- 🌐 **Google OAuth** - Social login with Google
- 👤 **User Management** - Registration, login, profile management
- 🔒 **Password Security** - Bcrypt password hashing
- 📧 **Email Verification** - Email verification system (ready for implementation)
- 🔄 **Password Reset** - Forgot password functionality
- 👮‍♂️ **Role-based Access** - Customer, Admin, Moderator roles
- 🛡️ **Input Validation** - Comprehensive request validation
- 🚨 **Error Handling** - Detailed error responses

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the example environment file and configure your variables:

```bash
cp env.example .env
```

**Required Environment Variables:**

```env
# Database
MONGO_URI=mongodb://localhost:27017/ecom-bliss

# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS and OAuth redirects)
FRONTEND_URL=http://localhost:5173

# Backend URL (for OAuth callbacks)
BACKEND_URL=http://localhost:5000

# Session Secret
SESSION_SECRET=your-session-secret-key-change-this-in-production

# Google OAuth (Optional - for social login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. Google OAuth Setup (Optional)

To enable Google OAuth login:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure OAuth consent screen
6. Set authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)
7. Copy Client ID and Client Secret to your `.env` file

### 4. Database Setup

Make sure MongoDB is running:

```bash
# Start MongoDB (if not running as service)
mongod

# Or if using MongoDB Atlas, use your connection string
```

### 5. Seed Data (Optional)

Populate the database with sample data:

```bash
npm run seed
```

### 6. Start the Server

```bash
# Development
npm run dev

# Production
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/google` | Google OAuth login |
| GET | `/api/auth/google/callback` | Google OAuth callback |
| GET | `/api/auth/profile` | Get user profile |
| PUT | `/api/auth/profile` | Update user profile |
| PUT | `/api/auth/change-password` | Change password |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |
| GET | `/api/auth/verify-email/:token` | Verify email |

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| GET | `/api/products/search` | Search products |
| GET | `/api/products/categories` | Get categories |
| GET | `/api/products/brands` | Get brands |

## Authentication Flow

### Manual Registration/Login

1. **Register**: `POST /api/auth/register`
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123",
     "phone": "+1234567890"
   }
   ```

2. **Login**: `POST /api/auth/login`
   ```json
   {
     "email": "john@example.com",
     "password": "password123"
   }
   ```

3. **Response**: Server returns JWT token
   ```json
   {
     "message": "Login successful",
     "user": { ... },
     "token": "eyJhbGciOiJIUzI1NiIs..."
   }
   ```

### Google OAuth Flow

1. **Initiate**: User clicks "Login with Google"
2. **Redirect**: Frontend redirects to `/api/auth/google`
3. **Google**: User authenticates with Google
4. **Callback**: Google redirects to `/api/auth/google/callback`
5. **Token**: Server generates JWT and redirects to frontend
6. **Complete**: Frontend stores token and logs user in

## Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configured for frontend domain
- **Rate Limiting**: Ready for implementation
- **SQL Injection Protection**: Mongoose ODM protection

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "details": ["Additional error details"] // Optional
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Project Structure

```
backend/
├── config/
│   └── passport.js          # Google OAuth configuration
├── controllers/
│   ├── authController.js     # Authentication logic
│   └── productController.js  # Product management
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   └── errorHandler.js      # Error handling middleware
├── models/
│   ├── User.js              # User model
│   ├── Product.js           # Product model
│   ├── Category.js          # Category model
│   └── Brand.js             # Brand model
├── routes/
│   ├── auth.js              # Authentication routes
│   └── products.js          # Product routes
├── server.js                # Express server setup
└── seedData.js              # Database seeding
```

### Adding New Features

1. **Models**: Create in `models/` directory
2. **Controllers**: Add business logic in `controllers/` directory
3. **Routes**: Define API endpoints in `routes/` directory
4. **Middleware**: Add custom middleware in `middleware/` directory

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **JWT Secret Error**
   - Set a strong JWT_SECRET in `.env`
   - Generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

3. **Google OAuth Error**
   - Verify Google Cloud Console setup
   - Check redirect URIs match exactly
   - Ensure Client ID/Secret are correct

4. **CORS Error**
   - Verify FRONTEND_URL in `.env`
   - Check if frontend is running on correct port

### Debug Mode

Enable debug logging:

```bash
DEBUG=* npm run dev
```

## Production Deployment

1. **Environment Variables**: Set all production environment variables
2. **Database**: Use MongoDB Atlas or production MongoDB instance
3. **HTTPS**: Enable HTTPS for production
4. **Rate Limiting**: Implement rate limiting
5. **Logging**: Add proper logging (Winston/Morgan)
6. **Monitoring**: Add health checks and monitoring

## License

MIT License - see LICENSE file for details. 