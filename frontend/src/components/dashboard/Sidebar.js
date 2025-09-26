// frontend/src/components/dashboard/Sidebar.js

import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isToggled, setToggled }) => {
    // Styles
    const sidebarStyle = {
        minWidth: isToggled ? '80px' : '250px',
        width: isToggled ? '80px' : '250px',
        backgroundColor: '#43607cff', // Changed to white
        borderRight: '1px solid #e9ecef',
        color: '#333',
        minHeight: 'calc(100vh - 74px)', // Full height minus main navbar
        padding: '1.5rem 0',
        fontFamily: "'Lato', sans-serif",
        transition: 'width 0.3s ease, min-width 0.3s ease',
        position: 'relative'
    };
    const navLinkStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        color: '#333',
        textDecoration: 'none',
        padding: '1rem 1.5rem',
        fontSize: '1.1rem',
        whiteSpace: 'nowrap'
    };
    const linkTextStyle = {
        opacity: isToggled ? 0 : 1,
        transition: 'opacity 0.2s ease',
        display: isToggled ? 'none' : 'inline'
    };
    const toggleButtonStyle = {
        position: 'absolute',
        top: '20px',
        right: '-15px',
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        backgroundColor: 'white',
        border: '1px solid #ebebebff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1200
    };

    const navItems = [
        { path: "/client-dashboard", icon: "🏠", label: "Dashboard" },
        { path: "/profile", icon: "👤", label: "My Profile" },
        { path: "/meetings", icon: "📅", label: "Meetings" },
        { path: "/case-management", icon: "💼", label: "Case Management" },
        { path: "/knowledge-hub", icon: "📚", label: "Knowledge Hub" },
        { path: "/my-consultations", icon: "💬", label: "My Consultations" },
    ];

    return (
        <div style={sidebarStyle}>
            <button style={toggleButtonStyle} onClick={() => setToggled(!isToggled)}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 5H17" stroke="#0A2342" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M3 10H17" stroke="#0A2342" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M3 15H17" stroke="#0A2342" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            </button>

            <div style={{marginTop: '2rem'}}>
                <nav>
                    {navItems.map(item => (
                        <Link key={item.label} to={item.path} style={navLinkStyle}>
                            <span>{item.icon}</span>
                            <span style={linkTextStyle}>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;