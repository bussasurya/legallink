// frontend/src/pages/HomePage.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    // State to manage hover effects for buttons
    const [isSearchHovered, setIsSearchHovered] = useState(false);
    const [isJoinHovered, setIsJoinHovered] = useState(false);

    // --- STYLES ---
    const pageStyle = { fontFamily: "'Lato', sans-serif" };
    const sectionStyle = { padding: '4rem 2rem', maxWidth: '1200px', margin: 'auto', textAlign: 'center' };
    const sectionTitleStyle = { fontFamily: "'Merriweather', serif", fontSize: '2.5rem', color: '#0A2342', marginBottom: '2rem' };
    const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' };

    // Hero Section
    const heroStyle = { ...sectionStyle, padding: '5rem 2rem', backgroundColor: '#f8f9fa', borderBottom: '1px solid #e9ecef' };
    const headlineStyle = { fontFamily: "'Merriweather', serif", fontSize: '3.5rem', color: '#0A2342', marginBottom: '1rem' };
    const subheadlineStyle = { fontSize: '1.2rem', color: '#555', maxWidth: '700px', margin: '0 auto 2rem auto', lineHeight: '1.6' };
    const searchBarStyle = { display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' };
    const searchInputStyle = { padding: '1rem', fontSize: '1rem', width: '300px', border: '1px solid #ccc', borderRadius: '5px' };
    const searchButtonStyle = {
        padding: '1rem 2rem', fontSize: '1rem', backgroundColor: '#D4AF37', color: '#0A2342',
        border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold',
        transition: 'background-color 0.3s',
        transform: isSearchHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isSearchHovered ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
    };

    // Card Styles with Hover Effect
    const cardStyle = {
        backgroundColor: 'white', padding: '2rem', borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e9ecef',
        transition: 'transform 0.3s, box-shadow 0.3s',
    };
    const cardHoverStyle = { transform: 'translateY(-5px)', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' };

    // "For Lawyers" Section
    const forLawyersSectionStyle = { ...sectionStyle, backgroundColor: '#0A2342', color: 'white', borderRadius: '8px' };
    const forLawyersTitleStyle = { ...sectionTitleStyle, color: 'white' };
    const forLawyersButtonStyle = {
        padding: '1rem 2rem', fontSize: '1rem', backgroundColor: 'white', color: '#0A2342',
        border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginTop: '1rem',
        textDecoration: 'none',
        transition: 'background-color 0.3s, transform 0.3s',
        display: 'inline-block',
        transform: isJoinHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isJoinHovered ? '0 4px 12px rgba(0,0,0,0.2)' : 'none'
    };

    const practiceAreas = ["Family Law", "Criminal Law", "Corporate Law", "Real Estate Law", "Consumer Protection Law", "General Consultation"];

    return (
        <div style={pageStyle}>
            {/* Hero Section */}
            <section style={heroStyle}>
                <h1 style={headlineStyle}>Find Your Trusted Lawyer in India</h1>
                <p style={subheadlineStyle}>Expert legal guidance starts here. Describe your issue or search by specialty to connect with a verified professional near you.</p>
                <div style={searchBarStyle}>
                    <input type="text" placeholder="What is your legal issue? (e.g., 'divorce')" style={searchInputStyle} />
                    <input type="text" placeholder="Location (e.g., 'Kochi')" style={searchInputStyle} />
                    <button 
                        style={searchButtonStyle}
                        onMouseEnter={() => setIsSearchHovered(true)}
                        onMouseLeave={() => setIsSearchHovered(false)}
                    >Search</button>
                </div>
            </section>

            {/* How It Works Section */}
            <section style={sectionStyle}>
                <h2 style={sectionTitleStyle}>How It Works</h2>
                <div style={gridStyle}>
                    <div style={cardStyle} onMouseOver={e => Object.assign(e.currentTarget.style, cardHoverStyle)} onMouseOut={e => Object.assign(e.currentTarget.style, cardStyle)}>
                        <h3>1. Describe Your Needs</h3>
                        <p>Tell us about your case through our secure portal or browse lawyers by their area of expertise.</p>
                    </div>
                    <div style={cardStyle} onMouseOver={e => Object.assign(e.currentTarget.style, cardHoverStyle)} onMouseOut={e => Object.assign(e.currentTarget.style, cardStyle)}>
                        <h3>2. Connect with Lawyers</h3>
                        <p>We provide a curated list of verified, top-rated legal professionals tailored to your specific needs.</p>
                    </div>
                    <div style={cardStyle} onMouseOver={e => Object.assign(e.currentTarget.style, cardHoverStyle)} onMouseOut={e => Object.assign(e.currentTarget.style, cardStyle)}>
                        <h3>3. Request a Consultation</h3>
                        <p>Review lawyer profiles and securely request a consultation to get the expert help you need.</p>
                    </div>
                </div>
            </section>

            {/* Practice Areas Section */}
            <section style={{...sectionStyle, backgroundColor: '#f8f9fa'}}>
                <h2 style={sectionTitleStyle}>Browse by Practice Area</h2>
                <div style={gridStyle}>
                    {practiceAreas.map(area => (
                        <div key={area} style={cardStyle} onMouseOver={e => Object.assign(e.currentTarget.style, cardHoverStyle)} onMouseOut={e => Object.assign(e.currentTarget.style, cardStyle)}>
                            <p style={{fontWeight: 'bold', margin: 0}}>{area}</p>
                        </div>
                    ))}
                </div>
            </section>
            
            {/* For Lawyers Section */}
            <section style={forLawyersSectionStyle}>
                <h2 style={forLawyersTitleStyle}>Are You a Lawyer?</h2>
                <p>Join our network of verified legal professionals. Connect with new clients in your area and manage your cases efficiently with our powerful dashboard tools.</p>
                <Link 
                    to="/register-lawyer" 
                    style={forLawyersButtonStyle}
                    onMouseEnter={() => setIsJoinHovered(true)}
                    onMouseLeave={() => setIsJoinHovered(false)}
                >Join Our Network</Link>
            </section>
        </div>
    );
};

export default HomePage;