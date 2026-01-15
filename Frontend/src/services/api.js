import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication Services
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register/', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login/', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout/');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

// Product Services
export const productService = {
  getProducts: async (params = {}) => {
    const response = await api.get('/products/', { params });
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}/`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/categories/');
    return response.data;
  },
};

// Cart Services
export const cartService = {
  getCart: async () => {
    const response = await api.get('/cart/');
    return response.data;
  },

  addToCart: async (productId, quantity = 1) => {
    const response = await api.post('/cart/add/', {
      product_id: productId,
      quantity,
    });
    return response.data;
  },

  updateCartItem: async (productId, quantity) => {
    const response = await api.post('/cart/update/', {
      product_id: productId,
      quantity,
    });
    return response.data;
  },

  removeFromCart: async (productId) => {
    const response = await api.post('/cart/remove/', {
      product_id: productId,
    });
    return response.data;
  },
};

// Order Services
export const orderService = {
  getOrders: async () => {
    const response = await api.get('/orders/');
    return response.data;
  },

  createOrder: async (orderData) => {
    const response = await api.post('/orders/create/', orderData);
    return response.data;
  },

  processPayment: async (orderId, paymentData) => {
    const response = await api.post(`/orders/${orderId}/payment/`, paymentData);
    return response.data;
  },
};

export default api;
