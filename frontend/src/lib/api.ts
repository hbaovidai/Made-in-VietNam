import axios from 'axios';

// Khởi tạo instance API gọi kết nối vào Backend NestJS
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
  withCredentials: true,
});

// Chặn Request - Tự động gắn JWT Token vào mọi API call
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mivn5_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Chặn Response - Bắt lỗi + auto-logout khi token hết hạn
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message;
    console.error('API Error:', message);

    // Nếu 401 Unauthorized → token hết hạn hoặc không hợp lệ → logout
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      // Tránh redirect loop nếu đang ở trang login/register
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('mivn5_token');
        localStorage.removeItem('mivn5_user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error.response?.data || error);
  }
);
