// frontend/src/pages/ClientDashboard.js

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ClientDashboard = () => {
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Pending');
    const navigate = useNavigate();

    const fetchConsultations = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const res = await api.get('/api/client/my-consultations', {
                headers: { 'x-auth-token': token }
            });
            setConsultations(res.data);
        } catch (err) {
            console.error("Failed to fetch consultations", err);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchConsultations();
    }, [fetchConsultations]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to permanently delete this request?')) {
            const token = localStorage.getItem('token');
            try {
                await api.delete(`/api/consultations/client/${id}`, {
                    headers: { 'x-auth-token': token }
                });
                toast.success('Request deleted.');
                fetchConsultations();
            } catch (err) {
                toast.error('Could not delete the request.');
            }
        }
    };
    
    const filteredConsultations = consultations.filter(c => {
        if (activeTab === 'Pending') return c.status === 'Pending';
        if (activeTab === 'Accepted') return c.status === 'Accepted';
        if (activeTab === 'Archived') return ['Rejected', 'Completed'].includes(c.status);
        return false;
    });

    if (loading) return <div>Loading...</div>;

    // --- STYLES ---
    const pageStyle = { padding: '2rem' };
    const headerStyle = { borderBottom: '1px solid #ddd', paddingBottom: '1rem', marginBottom: '2rem' };
    const quickActionsStyle = { display: 'flex', gap: '1rem', marginBottom: '2rem' };
    const buttonStyle = { padding: '0.75rem 1.5rem', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '4px', textDecoration: 'none', display: 'inline-block', fontSize: '1rem' };
    const tabContainerStyle = { display: 'flex', borderBottom: '1px solid #ccc', marginBottom: '1.5rem' };
    const tabStyle = { padding: '0.75rem 1.5rem', cursor: 'pointer', border: 'none', background: 'none', fontSize: '1rem', borderBottom: '3px solid transparent' };
    const activeTabStyle = { ...tabStyle, borderBottom: '3px solid #0A2342', fontWeight: 'bold' };
    const cardStyle = { backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
    const statusStyle = { padding: '0.25rem 0.75rem', borderRadius: '15px', color: 'white', fontWeight: 'bold', fontSize: '0.9rem' };
    const deleteButtonStyle = { background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: '0.5rem' };
    const getStatusColor = (status) => { /* ... existing getStatusColor logic ... */ };

    return (
        <div style={pageStyle}>
            <div style={headerStyle}>
                <h1>Client Dashboard</h1>
                <p>Welcome! Manage your legal needs here.</p>
            </div>

            <div style={quickActionsStyle}>
                <Link to="/find-lawyer" style={{...buttonStyle, backgroundColor: '#5bc0de'}}>Find a Lawyer</Link>
                <Link to="/submit-case" style={{...buttonStyle, backgroundColor: '#0A2442'}}>Submit a Case for AI Analysis</Link>
            </div>

            <div>
                <h2>Your Consultation Requests</h2>
                <div style={tabContainerStyle}>
                    <button style={activeTab === 'Pending' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('Pending')}>Pending</button>
                    <button style={activeTab === 'Accepted' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('Accepted')}>Accepted</button>
                    <button style={activeTab === 'Archived' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('Archived')}>Archived</button>
                </div>

                <div>
                    {filteredConsultations.length === 0 ? (
                        <p>You have no requests in this category.</p>
                    ) : (
                        filteredConsultations.map(consultation => (
                            <div key={consultation._id} style={cardStyle}>
                                <Link to={`/consultation/${consultation._id}`} style={{textDecoration: 'none', color: 'inherit', flex: 1}}>
                                    <h4>Request to: {consultation.lawyer.firstName} {consultation.lawyer.lastName}</h4>
                                    <p><strong>Status:</strong> <span style={{...statusStyle, backgroundColor: getStatusColor(consultation.status)}}>{consultation.status}</span></p>
                                </Link>
                                <button onClick={() => handleDelete(consultation._id)} style={deleteButtonStyle} title="Delete Request">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#5f6368"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;