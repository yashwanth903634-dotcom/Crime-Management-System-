import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('crms_token');
    if (token) {
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 responses (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('crms_token');
      localStorage.removeItem('crms_user');
      // Only redirect if not already on login page
      if (!window.location.hash.includes('login') && window.location.pathname !== '/login') {
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
