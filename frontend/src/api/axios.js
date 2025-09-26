// frontend/src/api/axios.js

import axios from 'axios';

// Create an instance of axios with a default base URL
const api = axios.create({
    baseURL: 'http://localhost:5000',
});

export default api;