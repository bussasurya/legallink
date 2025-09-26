// frontend/src/components/Footer.js

import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    // Styles
    const footerStyle = {
        backgroundColor: '#0A2342', // Navy Blue
        color: 'white',
        padding: '2rem 2rem 1rem 2rem',
        marginTop: 'auto', // Pushes footer to the bottom
        fontFamily: "'Lato', sans-serif"
    };
    const linkStyle = {
        color: '#ccc',
        textDecoration: 'none',
        margin: '0 0.5rem'
    };
    const bottomTextStyle = {
        textAlign: 'center',
        marginTop: '2rem',
        fontSize: '0.9rem',
        color: '#888'
    };

    return (
        <footer style={footerStyle}>
            <div style={{ textAlign: 'center' }}>
                <Link to="/about" style={linkStyle}>About Us</Link> |
                <Link to="/contact" style={linkStyle}>Contact</Link> |
                <Link to="/privacy-policy" style={linkStyle}>Privacy Policy</Link> |
                {/* The link for the admin login */}
                <Link to="/admin-login" style={linkStyle}>Admin Login</Link>
            </div>
            <p style={bottomTextStyle}>
                © 2025 LegalLink Portal from Kochi, Kerala. All Rights Reserved.
            </p>
        </footer>
    );
};

// --- This line is crucial and was likely missing ---
export default Footer;