import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
};

// Property API
export const propertyAPI = {
  getAll: (params) => api.get('/property', { params }),
  getById: (id) => api.get(`/property/${id}`),
  create: (formData) => api.post('/property/add', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/property/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/property/${id}`),
};

// Admin API
export const adminAPI = {
  uploadLogo: (formData) => api.post('/admin/upload-logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getLogo: () => api.get('/admin/logo'),
};

export default api;
