// frontend/src/components/Navbar.js

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { listenToAuthChange, postAuthChange } from '../services/BroadcastService';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [showSignup, setShowSignup] = useState(false);
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
    const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#0A2342', color: 'white', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };
    const logoStyle = { fontFamily: "'Merriweather', serif", fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: 'white' };
    const navLinksStyle = { display: 'flex', gap: '2rem', fontFamily: "'Lato', sans-serif" };
    const linkStyle = { textDecoration: 'none', color: 'white', fontSize: '1rem' };
    const authButtonsStyle = { display: 'flex', alignItems: 'center', gap: '1rem' };
    const buttonStyle = { ...linkStyle, padding: '0.5rem 1rem', border: '1px solid white', borderRadius: '5px', background: 'none', cursor: 'pointer', fontFamily: "'Lato', sans-serif" };
    const signupButtonStyle = { ...buttonStyle, backgroundColor: '#D4AF37', color: '#0A2342', fontWeight: 'bold', border: 'none' };
    
    // Dropdown Styles
    const dropdownContainerStyle = { position: 'relative' };
    const dropdownStyle = { position: 'absolute', top: '40px', right: 0, backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '150px', zIndex: 1100 };
    const dropdownLinkStyle = { display: 'block', padding: '0.75rem 1rem', textDecoration: 'none', color: '#333', fontFamily: "'Lato', sans-serif" };

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
                        {/* Standardized for both Client and Lawyer */}
                        <Link to={`/${user.role}-dashboard`} style={linkStyle}>My Dashboard</Link>
                        <button onClick={handleLogout} style={signupButtonStyle}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={buttonStyle}>Login</Link>
                        <div style={dropdownContainerStyle} onMouseLeave={() => setShowSignup(false)}>
                            <button onMouseEnter={() => setShowSignup(true)} style={signupButtonStyle}>Sign Up</button>
                            {showSignup && (
                                <div style={dropdownStyle}>
                                    <Link to="/signup" style={dropdownLinkStyle} onClick={() => setShowSignup(false)}>I'm a Client</Link>
                                    <Link to="/signup?role=lawyer" style={dropdownLinkStyle} onClick={() => setShowSignup(false)}>I'm a Lawyer</Link>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;