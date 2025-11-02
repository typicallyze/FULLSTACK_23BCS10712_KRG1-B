import axios from 'axios';

// Create an axios instance
const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Base URL for all requests
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        // 1. Get the token from localStorage
        const token = localStorage.getItem('jwtToken');

        // 2. If the token exists, add it to the Authorization header
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);

export default api;