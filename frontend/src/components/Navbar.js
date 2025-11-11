// frontend/src/components/Navbar.js

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// The io, api, and toast imports are no longer needed here
import { listenToAuthChange, postAuthChange } from '../services/BroadcastService';

const Navbar = () => {
    const [user, setUser] = useState(null);
    // Removed consultations and showNotifications state
    const navigate = useNavigate();
    const location = useLocation();

    // Simplified checkUserStatus, no longer fetches consultations
    const checkUserStatus = useCallback(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
    }, []);

    // Simplified useEffect, no longer handles sockets or fetching
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

    // Removed handleStatusUpdate and handleDismiss
    // Removed unreadCount

    // --- STYLES ---
    const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#0A2342', color: 'white', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };
    const logoStyle = { fontFamily: "'Merriweather', serif", fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: 'white' };
    const navLinksStyle = { display: 'flex', gap: '2rem', fontFamily: "'Lato', sans-serif" };
    const linkStyle = { textDecoration: 'none', color: 'white', fontSize: '1rem' };
    const authButtonsStyle = { display: 'flex', alignItems: 'center', gap: '1rem' };
    const buttonStyle = { ...linkStyle, padding: '0.5rem 1rem', border: '1px solid white', borderRadius: '5px', background: 'none', cursor: 'pointer', fontFamily: "'Lato', sans-serif" };
    const signupButtonStyle = { ...buttonStyle, backgroundColor: '#D4AF37', color: '#0A2342', fontWeight: 'bold', border: 'none' };
    
    // Removed all dropdown and notification styles

    return (
        <nav style={navStyle}>
            <Link to="/" style={logoStyle}>⚖️ LegalLink</Link>
            
            <div style={navLinksStyle}>
                <Link to="/" style={linkStyle}>Home</Link>
                <Link to="/blog" style={linkStyle}>Blog</Link>
                <Link to="/contact" style={linkStyle}>Contact</Link>
            </div>
            
            <div style={authButtonsStyle}>
                {user ? (
                    <>
                        {/* Notification bell is removed */}
                        <Link to={`/${user.role}-dashboard`} style={linkStyle}>My Dashboard</Link>
                        <button onClick={handleLogout} style={signupButtonStyle}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={buttonStyle}>Login</Link>
                        {/* --- CRITICAL FIX: Reverted to a direct link --- */}
                        <Link to="/signup" style={signupButtonStyle}>Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;