import axios from 'axios';

// Khởi tạo instance API gọi kết nối vào Backend NestJS
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
});

// Chặn Response để bắt mượt các lỗi trả về từ Backend
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message;
    console.error('API Error:', message);
    return Promise.reject(error.response?.data || error);
  }
);
