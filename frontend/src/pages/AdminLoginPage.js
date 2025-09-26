// frontend/src/pages/AdminLoginPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { postAuthChange } from '../services/BroadcastService'; // Import the broadcast function

const AdminLoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    const { email, password } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/auth/login', formData);
            
            const userRole = response.data.user.role;

            if (userRole !== 'admin') {
                alert('Access Denied: This login is for administrators only.');
                return;
            }

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            postAuthChange(); // Notify other tabs of the login

            alert('Admin login successful!');
            navigate('/admin-dashboard');

        } catch (err) {
            console.error('Login failed:', err.response ? err.response.data.msg : err.message);
            alert('Login failed: ' + (err.response ? err.response.data.msg : 'A network error occurred.'));
        }
    };

    // Styling
    const formStyle = { maxWidth: '400px', margin: '2rem auto', padding: '2rem', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '8px' };
    const inputStyle = { width: '100%', padding: '0.75rem', marginBottom: '1rem', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' };
    const buttonStyle = { width: '100%', padding: '0.75rem', backgroundColor: '#d9534f', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '1rem' };

    return (
        <div style={formStyle}>
            <h2 style={{ textAlign: 'center', fontFamily: "'Merriweather', serif" }}>Admin Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Email Address</label>
                    <input
                        style={{...inputStyle, marginBottom: 0}}
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Password</label>
                    <input
                        style={{...inputStyle, marginBottom: 0}}
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" style={buttonStyle}>
                    Login as Admin
                </button>
            </form>
        </div>
    );
};

export default AdminLoginPage;