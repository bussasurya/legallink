// frontend/src/pages/EmailVerified.js

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

const EmailVerified = () => {
    const { token } = useParams();
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await api.get(`/api/auth/verify/${token}`);
                setMessage(response.data.msg);
            } catch (err) {
                // Ensure a default error message string is always set
                setMessage(err.response?.data?.msg || 'An error occurred during verification.');
            }
        };

        if (token) {
            verifyEmail();
        }
    }, [token]);

    return (
        <div style={{ textAlign: 'center', marginTop: '4rem', fontFamily: "'Lato', sans-serif" }}>
            <h2>Email Verification</h2>
            <p style={{ fontSize: '1.2rem', margin: '1rem 0' }}>{message}</p>
            
            {/* CRITICAL FIX: Check if message is a string before calling .includes() */}
            {typeof message === 'string' && message.includes('successfully') && (
                 <Link to="/login" style={{ 
                    display: 'inline-block', 
                    padding: '0.75rem 1.5rem', 
                    backgroundColor: '#0A2342', 
                    color: 'white', 
                    textDecoration: 'none', 
                    borderRadius: '5px' 
                }}>
                    Proceed to Login
                </Link>
            )}
        </div>
    );
};

export default EmailVerified;