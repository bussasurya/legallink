// frontend/src/api/axios.js

import axios from 'axios';

// 1. We get the backend URL from an environment variable
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// 2. We create a "bridge" (an axios instance)
const api = axios.create({
    baseURL: API_URL
});

// 3. We use this to automatically add your login token (x-auth-token)
//    to every single request you send from the frontend.
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default api;