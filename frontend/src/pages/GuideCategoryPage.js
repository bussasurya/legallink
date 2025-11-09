// frontend/src/pages/GuideCategoryPage.js

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { guideData } from '../data/guideData'; // Import the static data
import toast from 'react-hot-toast';

const GuideCategoryPage = () => {
    const { categoryName } = useParams();
    // Get the data for the current category from our static file
    const categoryData = guideData[categoryName];
    const [expandedArticle, setExpandedArticle] = useState(null);

    if (!categoryData) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center', fontFamily: "'Lato', sans-serif" }}>
                <h2>Category Not Found</h2>
                <p>We are currently working on guides for this section.</p>
                <Link to="/client-dashboard" style={{ color: '#0A2342', fontWeight: 'bold' }}>&larr; Back to Dashboard</Link>
            </div>
        );
    }

    const handleArticleClick = (id) => {
        // Toggle: if clicking the same one, close it; otherwise open the new one
        setExpandedArticle(expandedArticle === id ? null : id);
    };

    // --- PROFESSIONAL APPLE-STYLE UI ---
    const pageStyle = {
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif",
        background: '#fbfbfd', // Very subtle off-white for that premium feel
        minHeight: '100vh',
        padding: '4rem 2rem',
    };

    const containerStyle = { maxWidth: '900px', margin: '0 auto' };

    // Header
    const headerStyle = { marginBottom: '4rem', textAlign: 'center' };
    const titleStyle = { fontSize: '48px', fontWeight: '800', color: '#1d1d1f', marginBottom: '1rem', letterSpacing: '-0.02em' };
    const subtitleStyle = { fontSize: '20px', color: '#86868b', lineHeight: '1.5', maxWidth: '600px', margin: '0 auto' };

    // Article Cards
    const listStyle = { display: 'flex', flexDirection: 'column', gap: '1.5rem' };
    const cardStyle = {
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)', // Very soft, luxurious shadow
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
        border: '1px solid rgba(0, 0, 0, 0.02)',
        overflow: 'hidden' // For smooth content expansion
    };
    const cardHoverStyle = {
        transform: 'scale(1.01)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.1)'
    };

    const articleTitleStyle = { fontSize: '24px', fontWeight: '700', color: '#1d1d1f', marginBottom: '0.5rem' };
    const articleSummaryStyle = { fontSize: '17px', color: '#555', lineHeight: '1.5' };
    
    // Expanded Content Area
    const expandedContentStyle = {
        marginTop: '1.5rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid #e5e5ea',
        fontSize: '17px',
        lineHeight: '1.7',
        color: '#333',
        animation: 'fadeIn 0.4s ease-out' // Smooth fade-in for content
    };

    // CTA Button inside article
    const ctaButtonStyle = {
        display: 'inline-block',
        marginTop: '2rem',
        padding: '0.8rem 2rem',
        background: '#0071e3', // Apple blue
        color: 'white',
        borderRadius: '999px',
        textDecoration: 'none',
        fontWeight: '600',
        fontSize: '16px',
        border: 'none',
        cursor: 'pointer',
        transition: 'background 0.2s ease'
    };

    return (
        <div style={pageStyle}>
             {/* Add keyframes for fade-in animation */}
            <style>
                {`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}
            </style>

            <div style={containerStyle}>
                {/* Breadcrumb-style back link */}
                <Link to="/client-dashboard" style={{ textDecoration: 'none', color: '#86868b', fontWeight: '500', marginBottom: '2rem', display: 'inline-block' }}>
                    &larr; Knowledge Hub
                </Link>

                <header style={headerStyle}>
                    <h1 style={titleStyle}>{categoryData.title}</h1>
                    <p style={subtitleStyle}>{categoryData.subtitle}</p>
                </header>

                <div style={listStyle}>
                    {categoryData.articles.map(article => (
                        <div 
                            key={article.id} 
                            style={cardStyle}
                            onClick={() => handleArticleClick(article.id)}
                            onMouseOver={e => Object.assign(e.currentTarget.style, cardHoverStyle)}
                            onMouseOut={e => Object.assign(e.currentTarget.style, cardStyle)}
                        >
                            <h2 style={articleTitleStyle}>{article.title}</h2>
                            <p style={articleSummaryStyle}>{article.summary}</p>

                            {/* Expandable Content */}
                            {expandedArticle === article.id && (
                                <div style={expandedContentStyle} onClick={e => e.stopPropagation()}>
                                    {/* Render HTML content safely */}
                                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                                    
                                    <div style={{textAlign: 'center'}}>
                                        <Link to="/find-lawyer" style={ctaButtonStyle} onMouseOver={e => e.currentTarget.style.background = '#0077ED'} onMouseOut={e => e.currentTarget.style.background = '#0071e3'}>
                                            Need advice on this? Find a Lawyer
                                        </Link>
                                    </div>
                                </div>
                            )}
                            
                            {/* Simple indicator if it's collapsed */}
                            {expandedArticle !== article.id && (
                                <div style={{ marginTop: '1rem', color: '#0071e3', fontWeight: '600', fontSize: '15px' }}>
                                    Read more ↓
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GuideCategoryPage;