// frontend/src/pages/AdminDashboard.js

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AdminDashboard = () => {
    const [lawyers, setLawyers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchLawyers = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/admin-login');
            return;
        }

        try {
            const res = await api.get('/api/admin/lawyers', {
                headers: { 'x-auth-token': token }
            });
            setLawyers(res.data);
        } catch (err) {
            console.error('Failed to fetch lawyers:', err);
            if (err.response && err.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/admin-login');
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchLawyers();
    }, [fetchLawyers]);
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // --- NEW FUNCTION TO HANDLE LAWYER VERIFICATION ---
    const handleVerification = async (lawyerId, isVerified) => {
        const token = localStorage.getItem('token');
        try {
            // Call the backend API to update the verification status
            await api.put(`/api/admin/verify-lawyer/${lawyerId}`, 
                { isVerified: isVerified },
                { headers: { 'x-auth-token': token } }
            );
            
            // Refresh the list of lawyers to show the updated status
            fetchLawyers();
            alert(`Lawyer status updated successfully!`);

        } catch (err) {
            console.error('Failed to update verification status:', err);
            alert('Failed to update status. Please try again.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    // Styles
    const dashboardStyle = { padding: '2rem', fontFamily: "'Lato', sans-serif" };
    const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' };
    const thTdStyle = { border: '1px solid #ddd', padding: '12px', textAlign: 'left' };
    const thStyle = { ...thTdStyle, backgroundColor: '#f2f2f2', fontWeight: 'bold' };
    const headerStyle = { borderBottom: '1px solid #eee', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
    const buttonStyle = { padding: '0.5rem 1rem', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '4px', marginRight: '0.5rem' };

    return (
        <div style={dashboardStyle}>
            <div style={headerStyle}>
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>Welcome, Admin! Manage and verify lawyers from this panel.</p>
                </div>
                <button onClick={handleLogout} style={{...buttonStyle, backgroundColor: '#d9534f'}}>Logout</button>
            </div>
            
            <h2 style={{ marginTop: '2rem' }}>Lawyer Verification Queue</h2>
            {lawyers.length === 0 ? (
                <p>No lawyers are currently registered.</p>
            ) : (
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Name</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Documents</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lawyers.map(lawyer => (
                            <tr key={lawyer._id}>
                                <td style={thTdStyle}>{lawyer.firstName} {lawyer.lastName}</td>
                                <td style={thTdStyle}>{lawyer.email}</td>
                                <td style={thTdStyle}>
                                    {lawyer.documents && lawyer.documents.length > 0 ? (
                                        lawyer.documents.map((doc, index) => (
                                            <a key={index} href={`http://localhost:5000/${doc.filePath.replace(/\\/g, '/')}`} target="_blank" rel="noopener noreferrer">
                                                View Doc {index + 1}
                                            </a>
                                        ))
                                    ) : 'No Docs'}
                                </td>
                                <td style={thTdStyle}>{lawyer.isVerified ? 
                                    <span style={{color: 'green', fontWeight: 'bold'}}>Verified</span> : 
                                    <span style={{color: 'orange', fontWeight: 'bold'}}>Pending</span>}
                                </td>
                                <td style={thTdStyle}>
                                    {/* --- UPDATED BUTTONS WITH ONCLICK HANDLERS --- */}
                                    {!lawyer.isVerified ? (
                                        <button onClick={() => handleVerification(lawyer._id, true)} style={{...buttonStyle, backgroundColor: '#5cb85c'}}>Approve</button>
                                    ) : (
                                        <button onClick={() => handleVerification(lawyer._id, false)} style={{...buttonStyle, backgroundColor: '#f0ad4e'}}>Reject</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminDashboard;