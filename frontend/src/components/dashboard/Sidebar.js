// frontend/src/components/dashboard/Sidebar.js

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// --- SVG Icons (Defined as functions) ---
const icons = {
    dashboard: (color) => <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill={color}><path d="M0 0h24v24H0z" fill="none"/><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>,
    profile: (color) => <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill={color}><path d="M0 0h24v24H0z" fill="none"/><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>,
    availability: (color) => <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill={color}><path d="M0 0h24v24H0z" fill="none"/><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>,
    cases: (color) => <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill={color}><path d="M0 0h24v24H0z" fill="none"/><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V6h5.17l2 2H20v10z"/></svg>,
   knowledge: (color) => <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill={color}><path d="M0 0h24v24H0z" fill="none"/><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/></svg>,
};

const Sidebar = ({ isToggled, setToggled }) => {
    const [userRole, setUserRole] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUserRole(JSON.parse(storedUser).role);
        }
    }, []);

    // --- STYLES ---
    const sidebarStyle = {
        minWidth: isToggled ? '80px' : '250px',
        width: isToggled ? '80px' : '250px',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #e9ecef',
        padding: '1.5rem 0',
        fontFamily: "'Lato', sans-serif",
        transition: 'width 0.3s ease, min-width 0.3s ease',
        position: 'sticky',
        top: '74px',
        height: 'calc(100vh - 74px)',
        overflowY: 'auto'
    };

    const navLinkBaseStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        color: '#555',
        textDecoration: 'none',
        padding: '1rem 1.5rem',
        fontSize: '1rem',
        whiteSpace: 'nowrap',
        margin: '0 0.5rem',
        borderRadius: '8px',
        transition: 'background-color 0.2s, color 0.2s'
    };

    const linkTextStyle = {
        opacity: isToggled ? 0 : 1,
        transition: 'opacity 0.2s ease',
        display: isToggled ? 'none' : 'inline'
    };

    // ✅ FIXED TOGGLE BUTTON STYLE
    const toggleButtonStyle = {
        position: 'fixed',
        top: '90px',
        left: isToggled ? '65px' : '235px',
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        transition: 'left 0.3s ease'
    };

    const navItems = {
        client: [
            { path: "/client-dashboard", icon: icons.dashboard, label: "Dashboard" },
            { path: "/profile", icon: icons.profile, label: "My Profile" },
            { path: "/my-cases", icon: icons.cases, label: "My Cases" },
            { path: "/knowledge-hub", icon: icons.knowledge, label: "Knowledge Hub" },
        ],
        lawyer: [
            { path: "/lawyer-dashboard", icon: icons.dashboard, label: "Dashboard" },
            { path: "/profile", icon: icons.profile, label: "My Profile" },
            { path: "/availability", icon: icons.availability, label: "My Availability" },
        ],
        admin: [
            { path: "/admin-dashboard", icon: icons.dashboard, label: "Dashboard" },
            { path: "/profile", icon: icons.profile, label: "My Profile" },
        ]
    };

    const currentNavItems = userRole ? navItems[userRole] : [];

    return (
        <div style={sidebarStyle}>
            <button style={toggleButtonStyle} onClick={() => setToggled(!isToggled)}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 5H17" stroke="#0A2342" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M3 10H17" stroke="#0A2342" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M3 15H17" stroke="#0A2342" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            </button>

            <div style={{ marginTop: '2rem' }}>
                <nav>
                    {currentNavItems.map(item => {
                        const isActive = location.pathname === item.path;
                        const activeStyle = {
                            backgroundColor: '#e8f4fd',
                            color: '#0A2342',
                            fontWeight: 'bold'
                        };
                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                style={isActive ? { ...navLinkBaseStyle, ...activeStyle } : navLinkBaseStyle}
                            >
                                <span>{item.icon(isActive ? '#0A2342' : '#555')}</span>
                                <span style={linkTextStyle}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
