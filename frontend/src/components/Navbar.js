// frontend/src/components/Navbar.js

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { listenToAuthChange, postAuthChange } from '../services/BroadcastService';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const checkUserStatus = useCallback(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
    }, []);

    useEffect(() => {
        checkUserStatus();
        const unsubscribe = listenToAuthChange(checkUserStatus);
        return () => {
            unsubscribe();
        };
    }, [location.pathname, checkUserStatus]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        postAuthChange();
        navigate('/login');
    };

    // --- STYLES ---
    const navStyle = { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1rem 2rem', 
        backgroundColor: '#ffffff', // changed to white
        color: '#0A2342', 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
    };

    const logoStyle = { 
        fontFamily: "'Merriweather', serif", 
        fontSize: '1.5rem', 
        fontWeight: 'bold', 
        textDecoration: 'none', 
        color: '#0A2342' 
    };

    const authButtonsStyle = { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem' 
    };

    const linkStyle = { 
        textDecoration: 'none', 
        color: '#0A2342', 
        fontSize: '1rem' 
    };

    const buttonStyle = { 
        ...linkStyle, 
        padding: '0.5rem 1rem', 
        border: '1px solid #0A2342', 
        borderRadius: '5px', 
        background: 'none', 
        cursor: 'pointer', 
        fontFamily: "'Lato', sans-serif" 
    };

    const signupButtonStyle = { 
        ...buttonStyle, 
        backgroundColor: '#D4AF37', 
        color: '#0A2342', 
        fontWeight: 'bold', 
        border: 'none' 
    };

    return (
        <nav style={navStyle}>
            <Link to="/" style={logoStyle}>⚖️ LegalLink</Link>
            
            <div style={authButtonsStyle}>
                {user ? (
                    <>
                        <Link to={`/${user.role}-dashboard`} style={linkStyle}>My Dashboard</Link>
                        <button onClick={handleLogout} style={signupButtonStyle}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={buttonStyle}>Login</Link>
                        <Link to="/signup" style={signupButtonStyle}>Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
