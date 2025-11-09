// frontend/src/pages/guides/GuidePageLayout.js

import React from 'react';
import { Link } from 'react-router-dom';

const GuidePageLayout = ({ title, children }) => {

    // --- STYLES (Simplified and matched to your project) ---
    const pageStyle = {
        fontFamily: "'Lato', sans-serif",
        background: 'linear-gradient(to bottom, #ffffff, #f5f5f7)',
        minHeight: '100vh',
        padding: '3rem 2rem',
    };

    const cardStyle = {
        maxWidth: '900px',
        margin: '0 auto',
        backgroundColor: '#FFFFFF',
        borderRadius: '18px',
        padding: '3rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
    };

    const backLinkStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        textDecoration: 'none',
        color: '#555',
        fontWeight: '600',
        marginBottom: '1.5rem',
        transition: 'color 0.2s ease',
    };

    const titleStyle = {
        fontFamily: "'Merriweather', serif",
        fontSize: '2.8rem',
        fontWeight: '700',
        color: '#1d1d1f', // Professional dark text
        margin: 0,
        lineHeight: 1.2,
    };

    const dividerStyle = {
        border: 'none',
        borderTop: '1px solid #e9ecef', // Light divider
        margin: '2rem 0',
    };

    const contentStyle = {
        fontSize: '1.1rem',
        color: '#333',
        lineHeight: '1.8',
    };

    // Style for <h3> and <h4> tags inside the content
    const contentGlobalStyles = `
        .guide-content h3, .guide-content h4 {
            color: #0A2342;
            font-family: 'Merriweather', serif;
            margin-top: 2.5rem;
            margin-bottom: 1rem;
            font-weight: 700;
        }
        .guide-content p {
            margin-bottom: 1.5rem;
        }
        .guide-content ul, .guide-content ol {
            padding-left: 1.5rem;
        }
        .guide-content li {
            margin-bottom: 0.75rem;
        }
    `;

    return (
        <>
            <style>{contentGlobalStyles}</style>
            <div style={pageStyle}>
                <div style={cardStyle}>
                    {/* Back Button */}
                    <Link 
                        to="/knowledge-hub" 
                        style={backLinkStyle}
                        onMouseOver={e => e.currentTarget.style.color = '#007aff'}
                        onMouseOut={e => e.currentTarget.style.color = '#555'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 18l-6-6 6-6"/>
                        </svg>
                        Back to Knowledge Hub
                    </Link>

                    {/* Title */}
                    <h1 style={titleStyle}>
                        {title}
                    </h1>

                    <hr style={dividerStyle} />

                    {/* Content */}
                    <div className="guide-content" style={contentStyle}>
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
};

export default GuidePageLayout;