// frontend/src/layouts/DashboardLayout.js

import React, { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';

const DashboardLayout = ({ children }) => {
    const [isToggled, setToggled] = useState(false);
    const layoutStyle = {
        display: 'flex',
        backgroundColor: '#f8f9fa'
    };
    const mainContentStyle = {
        flex: 1,
        width: isToggled ? 'calc(100% - 80px)' : 'calc(100% - 250px)',
        transition: 'width 0.3s ease',
        padding: '2rem'
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