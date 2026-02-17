import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor — catches 401 and clears auth
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && !error.config.url.includes('/auth/me') && window.location.pathname !== '/login') {
            const { clearUser } = useAuthStore.getState();
            clearUser();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
