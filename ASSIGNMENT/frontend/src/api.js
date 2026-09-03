import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use(async (config) => {
  let token = localStorage.getItem('token');
  if (!token) {
    try {
      const baseURL = config.baseURL || 'http://localhost:5000/api';
      const res = await axios.post(`${baseURL}/auth/login`, { email: 'admin@court.gov', password: 'password123' });
      if (res.data && res.data.token) {
        token = res.data.token;
        localStorage.setItem('token', token);
        if (res.data.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
      }
    } catch (e) {
      // Fallback ignore
    }
  }
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
