import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {

    // --- STYLES ---
    const footerStyle = {
        backgroundColor: '#111827',
        color: '#9ca3af',
        padding: '4rem 2rem 2rem 2rem',
        fontFamily: "'Lato', sans-serif",
    };

    const footerContainerStyle = {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '3rem',
        alignItems: 'start',        // ✅ aligns all columns from the top
    };

    const columnStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
        alignItems: 'flex-start',
    };

    const logoColumnStyle = {
        ...columnStyle,
        paddingTop: '0.25rem',      // ✅ subtle upward adjustment to align with headings
    };

    const logoStyle = {
        fontFamily: "'Merriweather', serif",
        fontSize: '1.7rem',
        fontWeight: 'bold',
        textDecoration: 'none',
        color: 'white',
        marginBottom: '0.7rem',
        display: 'flex',
        alignItems: 'center',       // ✅ keeps icon & text aligned horizontally
        gap: '0.5rem',
    };

    const linkStyle = {
        textDecoration: 'none',
        color: '#9ca3af',
        transition: 'color 0.2s ease',
        fontSize: '0.95rem',
    };

    const titleStyle = {
        fontSize: '0.95rem',
        fontWeight: 'bold',
        color: 'white',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '0.5rem',
    };

    const paragraphStyle = {
        margin: 0,
        lineHeight: 1.6,
        fontSize: '0.9rem',
        maxWidth: '220px',
    };

    const subFooterStyle = {
        backgroundColor: '#0A2342',
        color: '#e0e0e0',
        padding: '1.5rem 2rem',
        marginTop: '3rem',
        borderTop: '1px solid #374151',
        textAlign: 'center',
        fontSize: '0.9rem',
    };

    return (
        <footer style={{ width: '100%', backgroundColor: '#111827' }}>
            {/* 1. Multi-Column Footer */}
            <section style={footerStyle}>
                <div style={footerContainerStyle}>
                    {/* Column 1: Brand */}
                    <div style={logoColumnStyle}>
                        <Link to="/" style={logoStyle}>
                            ⚖️ <span>LegalLink</span>
                        </Link>
                        <p style={paragraphStyle}>
                            Connecting you with verified legal professionals across India.
                        </p>
                    </div>

                    {/* Column 2: Company */}
                    <div style={columnStyle}>
                        <h4 style={titleStyle}>Company</h4>
                        <Link to="/about" style={linkStyle} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}>About Us</Link>
                        <Link to="/find-lawyer" style={linkStyle} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}>Find Lawyers</Link>
                        <Link to="/signup?role=lawyer" style={linkStyle} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}>Become a Lawyer</Link>
                        <Link to="/contact" style={linkStyle} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}>Contact</Link>
                    </div>

                    {/* Column 3: For Clients */}
                    <div style={columnStyle}>
                        <h4 style={titleStyle}>For Clients</h4>
                        <Link to="/find-lawyer" style={linkStyle}>Find a Lawyer</Link>
                        <Link to="/submit-case" style={linkStyle}>AI Case Analysis</Link>
                        <Link to="/knowledge-hub" style={linkStyle}>Knowledge Hub</Link>
                        <Link to="/my-cases" style={linkStyle}>My Cases</Link>
                    </div>

                    {/* Column 4: For Lawyers */}
                    <div style={columnStyle}>
                        <h4 style={titleStyle}>For Lawyers</h4>
                        <Link to="/signup?role=lawyer" style={linkStyle}>Join the Network</Link>
                        <Link to="/login" style={linkStyle}>Lawyer Login</Link>
                    </div>

                    {/* Column 5: Support */}
                    <div style={columnStyle}>
                        <h4 style={titleStyle}>Support</h4>
                        <Link to="/help" style={linkStyle}>Help Center</Link>
                        <Link to="/privacy" style={linkStyle}>Privacy Policy</Link>
                        <Link to="/terms" style={linkStyle}>Terms of Service</Link>
                        <Link to="/safety" style={linkStyle}>Safety</Link>
                    </div>
                </div>
            </section>

            {/* 2. Sub-Footer */}
            <div style={subFooterStyle}>
                © {new Date().getFullYear()} LegalLink. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
