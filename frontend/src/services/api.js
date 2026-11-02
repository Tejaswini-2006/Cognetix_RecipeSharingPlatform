import axios from 'axios';

// Detect API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SERVER_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('recipehub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthorized/expired token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, clear localStorage
      if (localStorage.getItem('recipehub_token')) {
        localStorage.removeItem('recipehub_token');
        localStorage.removeItem('recipehub_user');
      }
    }
    return Promise.reject(error);
  }
);

// Helper to resolve full image URLs
export const getImageUrl = (imagePath) => {
  if (!imagePath) return `${SERVER_BASE_URL}/uploads/default-recipe.svg`;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // Strip leading slash if present when appending
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${SERVER_BASE_URL}${cleanPath}`;
};

export default api;
