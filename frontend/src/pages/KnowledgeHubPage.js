// frontend/src/pages/KnowledgeHubPage.js

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import FloatingChatbot from '../components/FloatingChatbot';

// --- Minimalist SVG Icons (Line-Style) ---
const icons = {
    family: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5.9c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.3 6 2H6c.2-.7 3.3-2 6-2m0-12C9.8 3.9 7.9 5.8 7.9 8s1.9 4.1 4.1 4.1 4.1-1.9 4.1-4.1S14.2 3.9 12 3.9zm0 10c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z"/></svg>,
    criminal: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-6 0v4M9 10h6M5 10a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V10z"/></svg>,
    property: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
    corporate: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>,
    civil: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>,
    consumer: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>,
    tax: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7"></path></svg>,
    cyber: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
    arrowLeft: <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 9.5L4 6L7.5 2.5" stroke="#1d1d1f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    arrowRight: <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 2.5L8 6L4.5 9.5" stroke="#1d1d1f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
};

const KnowledgeHubPage = () => {
    const carouselRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const autoplayIntervalRef = useRef(null);

    const guides = [
        { icon: icons.family, title: "Divorce Law Guides", desc: "Understand the process of filing for divorce.", path: "/guides/divorce" },
        { icon: icons.property, title: "Property Disputes", desc: "Learn about property rights and partition suits.", path: "/guides/property" },
        { icon: icons.criminal, title: "Criminal Law Basics", desc: "Your rights when interacting with the police.", path: "/guides/criminal" },
        { icon: icons.corporate, title: "Startup & Corporate", desc: "Guides on business registration and compliance.", path: "/guides/corporate" },
        { icon: icons.civil, title: "Civil Law Guides", desc: "Learn about civil suits, recovery, and more.", path: "/guides/civil" },
        { icon: icons.consumer, title: "Consumer Court", desc: "How to file a complaint for defective products.", path: "/guides/consumer" },
        { icon: icons.tax, title: "Tax Law", desc: "Basics of GST and Income Tax compliance.", path: "/guides/tax" },
        { icon: icons.cyber, title: "Cyber Crime", desc: "What to do in case of online fraud.", path: "/guides/cyber" },
    ];
    
    const insights = [
        { title: "New Supreme Court Ruling on Bail", desc: "A new ruling changes how bail is processed..." },
        { title: "Changes to GST Filings 2025", desc: "What businesses in Kerala need to know..." },
        { title: "Digital Data Privacy Laws", desc: "How the new laws affect you..." },
        { title: "Real Estate (RERA) Updates", desc: "New protections for homebuyers..." },
        { title: "Consumer Rights in E-Commerce", desc: "What to do about fraudulent online sellers..." },
    ];

    // --- CAROUSEL LOGIC ---
    const totalSlides = insights.length;

    const handleNext = useCallback(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % totalSlides);
    }, [totalSlides]);

    const handlePrev = useCallback(() => {
        setCurrentIndex(prevIndex => (prevIndex - 1 + totalSlides) % totalSlides);
    }, [totalSlides]);

    const resetAutoplay = useCallback(() => {
        if (autoplayIntervalRef.current) {
            clearInterval(autoplayIntervalRef.current);
        }
        autoplayIntervalRef.current = setInterval(handleNext, 5000);
    }, [handleNext]);

    useEffect(() => {
        resetAutoplay();
        return () => {
            if (autoplayIntervalRef.current) {
                clearInterval(autoplayIntervalRef.current);
            }
        };
    }, [resetAutoplay]);

    useEffect(() => {
        if (carouselRef.current) {
            const card = carouselRef.current.children[currentIndex];
            if (card) {
                const scrollLeft = card.offsetLeft - (carouselRef.current.offsetWidth / 2) + (card.offsetWidth / 2);
                carouselRef.current.scroll({ left: scrollLeft, behavior: 'smooth' });
            }
        }
    }, [currentIndex]);


    // --- STYLES ---
    const pageStyle = {
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif",
        background: 'linear-gradient(to bottom, #ffffff, #f5f5f7)',
        padding: '3rem 2rem',
    };
    const containerStyle = {
        maxWidth: '1100px',
        margin: '0 auto',
    };

    // Hero Section
    const heroStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        textAlign: 'left',
        marginBottom: '3rem', // <-- CRITICAL FIX: Gap reduced from 5rem to 3rem
    };
    const leftHeroStyle = { flex: 1, paddingRight: '2rem' };
    const rightHeroStyle = { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' };
    const titleStyle = {
        fontSize: '48px',
        fontWeight: '700',
        color: '#1d1d1f',
        marginBottom: '1rem',
    };
    const subtitleStyle = {
        fontSize: '18px',
        color: '#555',
        lineHeight: '1.6',
        maxWidth: '700px',
    };

    // Card Grid
    const sectionTitleStyle = {
        fontSize: '32px',
        fontWeight: '700',
        textAlign: 'left',
        color: '#1d1d1f',
        marginBottom: '1.5rem',
    };
    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem',
    };
    const cardStyle = {
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        borderRadius: '18px',
        padding: '1.5rem',
        textAlign: 'left',
        textDecoration: 'none',
        color: '#1d1d1f',
        boxShadow: '0 6px 24px rgba(0,0,0,0.04)',
        transition: 'all 0.2s ease-in-out',
    };
    const cardIconStyle = { marginBottom: '1rem', color: '#0A2342' };
    const cardTitleStyle = { fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' };
    const cardDescStyle = { fontSize: '0.9rem', color: '#555', lineHeight: '1.5' };

    // Button
    
    
    // Insights Carousel
    const insightsSectionStyle = { background: 'linear-gradient(to bottom, #ffffff, #f3f6fb)', padding: '4rem 0', margin: '5rem 0' };
    const insightsContainerStyle = { ...containerStyle, position: 'relative' };
    const carouselContainerStyle = {
        display: 'flex',
        overflowX: 'auto',
        gap: '1.5rem',
        padding: '1rem 2rem',
        scrollSnapType: 'x mandatory',
        scrollBehavior: 'smooth',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
    };
    const insightCardStyle = {
        flex: '0 0 300px',
        scrollSnapAlign: 'center',
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.3)',
        padding: '1.5rem',
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
    };
    const carouselButtonStyle = {
        position: 'absolute',
        top: '60%',
        transform: 'translateY(-50%)',
        background: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        cursor: 'pointer',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'background-color 0.2s',
    };
    const dotsContainerStyle = {
        textAlign: 'center',
        paddingTop: '2rem',
    };
    const dotStyle = {
        display: 'inline-block',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#d2d2d7',
        border: 'none',
        padding: 0,
        margin: '0 4px',
        cursor: 'pointer',
        transition: 'background 0.2s',
    };
    const activeDotStyle = {
        ...dotStyle,
        background: '#0A2342',
    };

    return (
        <div style={pageStyle}>
            <style>{`.carousel-container::-webkit-scrollbar { display: none; }`}</style>
            
            <div style={containerStyle}>
                {/* 1. Hero Section */}
                <section style={heroStyle}>
                    <div style={leftHeroStyle}>
                        <h1 style={titleStyle}>Knowledge Hub</h1>
                        <p style={subtitleStyle}>
                            Explore simplified guides on Indian laws and rights — designed to bring clarity to complex legal matters.
                        </p>
                    </div>
                    <div style={rightHeroStyle}>
                        {/* Placeholder for image */}
                    </div>
                </section>
                
                {/* 2. "Browse Guides by Category" Section */}
                <section>
                    <h2 style={sectionTitleStyle}>Browse Guides by Category</h2>
                    <div style={gridStyle}>
                        {guides.map((guide) => (
                            <Link 
                                to={guide.path} 
                                key={guide.title} 
                                style={cardStyle}
                                onMouseOver={e => {
                                    e.currentTarget.style.transform = 'scale(1.03)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                                }}
                                onMouseOut={e => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.04)';
                                }}
                            >
                                <div style={cardIconStyle}>{guide.icon}</div>
                                <h3 style={cardTitleStyle}>{guide.title}</h3>
                                <p style={cardDescStyle}>{guide.desc}</p>
                            </Link>
                        ))}
                    </div>
                    
                </section>
            </div>

            {/* 3. "Smart Insights" Carousel Section */}
            <section style={insightsSectionStyle}>
                <div style={insightsContainerStyle}>
                    <h2 style={{...sectionTitleStyle, textAlign: 'center'}}>Smart Insights</h2>
                    <p style={{...subtitleStyle, textAlign: 'center', margin: '0 auto 2rem auto'}}>
                        AI-curated highlights from Indian law updates and reforms.
                    </p>
                    
                    <button 
                        style={{...carouselButtonStyle, left: 0}} 
                        onClick={() => { handlePrev(); resetAutoplay(); }}
                        onMouseOver={e => e.currentTarget.style.background = '#f5f5f7'}
                        onMouseOut={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'}
                    >
                        {icons.arrowLeft}
                    </button>
                    <button 
                        style={{...carouselButtonStyle, right: 0}} 
                        onClick={() => { handleNext(); resetAutoplay(); }}
                        onMouseOver={e => e.currentTarget.style.background = '#f5f5f7'}
                        onMouseOut={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'}
                    >
                        {icons.arrowRight}
                    </button>

                    <div ref={carouselRef} className="carousel-container" style={carouselContainerStyle}>
                        {insights.map((insight, index) => (
                            <div 
                                key={index} 
                                style={insightCardStyle}
                                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <h3 style={cardTitleStyle}>{insight.title}</h3>
                                <p style={cardDescStyle}>{insight.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div style={dotsContainerStyle}>
                        {insights.map((_, index) => (
                            <button
                                key={index}
                                style={index === currentIndex ? activeDotStyle : dotStyle}
                                onClick={() => { setCurrentIndex(index); resetAutoplay(); }}
                            />
                        ))}
                    </div>
                </div>
            </section>
            
            {/* 4. Floating Chatbot */}
            <FloatingChatbot />
        </div>
    );
};

export default KnowledgeHubPage;