// frontend/src/api/axios.js

import axios from 'axios';

// The app will now use the public URL when deployed,
// and fallback to localhost for local development.
const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000',
});

export default api;