// frontend/src/layouts/DashboardLayout.js

import React, { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';

const DashboardLayout = ({ children }) => {
    const [isToggled, setToggled] = useState(false);
    
    const layoutStyle = {
        display: 'flex',
        backgroundColor: '#f8f9fa' // Light grey background for the content area
    };
    
    const mainContentStyle = {
        flex: 1,
        width: isToggled ? 'calc(100% - 80px)' : 'calc(100% - 250px)',
        transition: 'width 0.3s ease',
        padding: '2rem',
        minHeight: 'calc(100vh - 74px)' // Full height minus main navbar
    };
    
    return (
        <div style={layoutStyle}>
            <Sidebar isToggled={isToggled} setToggled={setToggled} />
            <main style={mainContentStyle}>
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;