// frontend/src/pages/LoginPage.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { postAuthChange } from '../services/BroadcastService';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showResend, setShowResend] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // <-- ADDED to prevent double clicks
    const navigate = useNavigate();
    const { email, password } = formData;

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // --- CRITICAL FIX 1: Implemented the resend logic ---
    const handleResendVerification = async () => {
        if (!email) {
            toast.error('Please enter your email in the field above first.');
            return;
        }
        setIsLoading(true);
        const loadingToast = toast.loading('Sending email...');
        try {
            await api.post('/api/auth/resend-verification', { email });
            toast.dismiss(loadingToast);
            toast.success('A new verification email has been sent. Please check your inbox.');
            setShowResend(false); // Hide the button after success
        } catch (err) {
            toast.dismiss(loadingToast);
            toast.error(err.response?.data?.msg || 'Failed to send email.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowResend(false);
        setIsLoading(true); // <-- ADDED
        const loadingToast = toast.loading('Logging in...');
        try {
            const response = await api.post('/api/auth/login', formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            postAuthChange();
            toast.dismiss(loadingToast);
            toast.success('Login successful!');
            const userRole = response.data.user.role;
            if (userRole === 'admin') navigate('/admin-dashboard');
            else if (userRole === 'lawyer') navigate('/lawyer-dashboard');
            else navigate('/client-dashboard');
        } catch (err) {
            toast.dismiss(loadingToast);
            const errorMessage = err.response?.data?.msg || 'A network error occurred.';
            toast.error(errorMessage);
            
            // --- CRITICAL FIX 2: Make the check more specific ---
            if (err.response?.status === 401 && errorMessage.includes('Please verify your email')) {
                setShowResend(true);
            }
        } finally {
            setIsLoading(false); // <-- ADDED
        }
    };

    // --- STYLES (Unchanged) ---
    const pageStyle = { display: 'flex', minHeight: 'calc(100vh - 70px)', fontFamily: "'Lato', sans-serif" };
    
    // Left Panel
    const leftPanelStyle = {
        flex: 1,
        backgroundImage: `url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4rem',
    };
    const overlayStyle = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(14, 15, 15, 0.8)', zIndex: 1 };
    const contentWrapperStyle = { position: 'relative', zIndex: 2 };
    const mainHeadingStyle = { fontFamily: "'Merriweather', serif", fontSize: '3rem', fontWeight: 'bold' };
    const subheadingStyle = { fontSize: '1.2rem', color: '#ccc', lineHeight: '1.6' };

    // Right Panel
    const rightPanelStyle = { flex: 1, backgroundColor: 'white', padding: '2rem 4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' };
    const formContainerStyle = { width: '100%', maxWidth: '450px', margin: 'auto' };
    const formHeaderStyle = { fontFamily: "'Merriweather', serif", fontSize: '2.5rem', color: '#333', marginBottom: '2rem' };
    const inputGroupStyle = { marginBottom: '1.5rem' };
    const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' };
    const inputStyle = { width: '100%', padding: '0.75rem', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' };
    const buttonStyle = { width: '100%', padding: '1rem', backgroundColor: '#0A2342', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold' };
    const resendButtonStyle = { ...buttonStyle, backgroundColor: '#f0ad4e', marginTop: '1rem' };
    const signupPromptStyle = { textAlign: 'center', marginTop: '1.5rem', color: '#555' };

    return (
        <div style={pageStyle}>
            {/* Left Panel */}
            <div style={leftPanelStyle}>
                <div style={overlayStyle}></div>
                <div style={contentWrapperStyle}>
                    <h1 style={mainHeadingStyle}>Welcome Back!</h1>
                    <p style={subheadingStyle}>We’re excited to have you here. Log in to manage your legal needs.</p>
                </div>
            </div>

            {/* Right Panel */}
            <div style={rightPanelStyle}>
                <div style={formContainerStyle}>
                    <h2 style={formHeaderStyle}>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Email Address</label>
                            <input style={inputStyle} type="email" name="email" value={email} onChange={handleChange} placeholder="sample@domain.com" required />
                        </div>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Password</label>
                            <input style={inputStyle} type="password" name="password" value={password} onChange={handleChange} required />
                        </div>
                        
                        {/* --- UPDATED: Added disabled state --- */}
                        <button type="submit" style={buttonStyle} disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Log In'}
                        </button>
                        {showResend && (
                            <button type="button" onClick={handleResendVerification} style={resendButtonStyle} disabled={isLoading}>
                                {isLoading ? 'Sending...' : 'Resend Verification Email'}
                            </button>
                        )}
                    </form>
                    <p style={signupPromptStyle}>
                        Don't have an account? <Link to="/signup">Register here</Link>
                    </p>
                </div>
            </div>
        </div>
    );  
};

export default LoginPage;