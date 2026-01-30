import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Hardcoded for now
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Product API functions
export const productAPI = {
  // Get all products with filters
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get single product
  getProduct: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async (limit = 8) => {
    const response = await api.get('/products/featured', { params: { limit } });
    return response.data;
  },

  // Search products
  searchProducts: async (query: string, page = 1, limit = 12) => {
    const response = await api.get('/products/search', {
      params: { q: query, page, limit }
    });
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category: string, params = {}) => {
    const response = await api.get(`/products/category/${category}`, { params });
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get('/products/categories');
    return response.data;
  },

  // Get brands
  getBrands: async () => {
    const response = await api.get('/products/brands');
    return response.data;
  },

  // Create product (admin only)
  createProduct: async (productData: any) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update product (admin only)
  updateProduct: async (id: string, productData: any) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product (admin only)
  deleteProduct: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

// Auth API functions
export const authAPI = {
  // Manual authentication
  login: async (email: string, password: string) => {
    console.log('API: Attempting login with:', { email });
    const response = await api.post('/auth/login', { email, password });
    console.log('API: Login successful');
    return response.data;
  },

  signup: async (userData: { name: string; email: string; password: string; phone?: string }) => {
    console.log('API: Attempting signup with:', { ...userData, password: '[HIDDEN]' });
    const response = await api.post('/auth/register', userData);
    console.log('API: Signup successful');
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Profile management
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (userData: any) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/auth/change-password', { currentPassword, newPassword });
    return response.data;
  },

  // Password reset
  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  },

  // Email verification
  verifyEmail: async (token: string) => {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  // Google OAuth
  googleLogin: () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  },
};

// Cart API functions (for future implementation)
export const cartAPI = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  addToCart: async (productId: string, quantity: number) => {
    const response = await api.post('/cart/items', { productId, quantity });
    return response.data;
  },

  updateCartItem: async (itemId: string, quantity: number) => {
    const response = await api.put(`/cart/items/${itemId}`, { quantity });
    return response.data;
  },

  removeFromCart: async (itemId: string) => {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete('/cart');
    return response.data;
  },
};

// Payment API functions
export const paymentAPI = {
  // Create payment order
  createPaymentOrder: async (data: { items: any[]; shippingAddress: any }) => {
    const response = await api.post('/payments/create-payment-order', data);
    return response.data;
  },

  // Verify payment
  verifyPayment: async (data: { 
    orderId: string; 
    razorpayOrderId: string; 
    razorpayPaymentId: string; 
    razorpaySignature: string 
  }) => {
    const response = await api.post('/payments/verify-payment', data);
    return response.data;
  },

  // Get payment status
  getPaymentStatus: async (orderId: string) => {
    const response = await api.get(`/payments/status/${orderId}`);
    return response.data;
  },

  // Cancel payment
  cancelPayment: async (orderId: string) => {
    const response = await api.delete(`/payments/cancel/${orderId}`);
    return response.data;
  },

  // Get user orders
  getUserOrders: async () => {
    const response = await api.get('/payments/orders');
    return response.data;
  },

  // Get specific order
  getOrderById: async (orderId: string) => {
    const response = await api.get(`/payments/orders/${orderId}`);
    return response.data;
  },
};

export default api; 