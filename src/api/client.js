import axios from 'axios';

export const API_URL = 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (data && data.success === false) {
      return Promise.reject(new Error(data.error || 'Lỗi không xác định'));
    }
    return data;
  },
  (error) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      'Không thể kết nối máy chủ';
    return Promise.reject(new Error(message));
  }
);