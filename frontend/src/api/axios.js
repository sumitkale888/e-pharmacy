import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api'
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        
        // FIX: Strict check. Only attach if token exists and is NOT the string "null" or "undefined"
        if (token && token !== "null" && token !== "undefined") {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const IMAGE_BASE_URL = 'http://localhost:8080/uploads/';
export default api;