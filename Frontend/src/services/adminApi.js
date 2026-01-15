import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const adminApi = axios.create({
  baseURL: `${API_URL}/admin`,
});

// Add token to requests
adminApi.interceptors.request.use(
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

// Dashboard Stats
export const getDashboardStats = () => adminApi.get('/stats/');

// Sales Report
export const getSalesReport = (params) => adminApi.get('/sales-report/', { params });

// User Management
export const getUsers = (params) => adminApi.get('/users/', { params });
export const getUser = (id) => adminApi.get(`/users/${id}/`);
export const createUser = (data) => adminApi.post('/users/', data);
export const updateUser = (id, data) => adminApi.put(`/users/${id}/`, data);
export const deleteUser = (id) => adminApi.delete(`/users/${id}/`);
export const toggleUserStaff = (id) => adminApi.post(`/users/${id}/toggle_staff/`);
export const toggleUserActive = (id) => adminApi.post(`/users/${id}/toggle_active/`);

// Category Management
export const getCategories = (params) => adminApi.get('/categories/', { params });
export const getCategory = (id) => adminApi.get(`/categories/${id}/`);
export const createCategory = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  return adminApi.post('/categories/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
export const updateCategory = (id, data) => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  return adminApi.put(`/categories/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
export const deleteCategory = (id) => adminApi.delete(`/categories/${id}/`);

// Product Management
export const getProducts = (params) => adminApi.get('/products/', { params });
export const getProduct = (id) => adminApi.get(`/products/${id}/`);
export const createProduct = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  return adminApi.post('/products/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
export const updateProduct = (id, data) => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  return adminApi.put(`/products/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
export const deleteProduct = (id) => adminApi.delete(`/products/${id}/`);
export const updateProductStock = (id, stock) => 
  adminApi.post(`/products/${id}/update_stock/`, { stock });

// Order Management
export const getOrders = (params) => adminApi.get('/orders/', { params });
export const getOrder = (id) => adminApi.get(`/orders/${id}/`);
export const updateOrder = (id, data) => adminApi.put(`/orders/${id}/`, data);
export const deleteOrder = (id) => adminApi.delete(`/orders/${id}/`);
export const updateOrderStatus = (id, status) => 
  adminApi.post(`/orders/${id}/update_status/`, { status });

export default adminApi;
