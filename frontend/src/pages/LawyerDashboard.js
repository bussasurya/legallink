// frontend/src/pages/LawyerDashboard.js

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Link has been removed
import api from '../api/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

// --- SVG Icons (Copied from ClientDashboard) ---
const icons = {
    cases: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0B1D39" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
    pending: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0B1D39" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
    meetings: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0B1D39" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
    calendar: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A2342" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
};

const LawyerDashboard = () => {
    const [user, setUser] = useState(null);
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchConsultations = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const res = await api.get('/api/lawyer/consultations', {
                headers: { 'x-auth-token': token }
            });
            setConsultations(res.data);
        } catch (err) {
            console.error("Failed to fetch consultations", err);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const checkUserStatus = useCallback(async () => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else if (token) {
            // If user is missing but token exists, refetch profile
            try {
                const profileRes = await api.get('/api/profile/me', { headers: { 'x-auth-token': token } });
                setUser(profileRes.data);
                localStorage.setItem('user', JSON.stringify(profileRes.data));
            } catch (err) {
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        checkUserStatus();
        fetchConsultations();

        const socket = io(process.env.REACT_APP_BACKEND_URL || "http://localhost:5000");
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            const userId = JSON.parse(storedUser).id;
            socket.emit('join_user_room', userId);
            
            const handleNewConsultation = (data) => {
                toast.success(data.msg, { duration: 5000 });
                fetchConsultations(); // Re-fetch the list
            };
            
            socket.on('new_consultation', handleNewConsultation);
            
            return () => {
                socket.off('new_consultation', handleNewConsultation);
                socket.disconnect();
            };
        }
    }, [checkUserStatus, fetchConsultations]);

    const handleStatusUpdate = async (id, status) => {
        const token = localStorage.getItem('token');
        try {
            await api.put(`/api/consultations/${id}`, { status }, { 
                headers: { 'x-auth-token': token } 
            });
            toast.success(`Request has been ${status}.`);
            fetchConsultations(); // Refresh list
        } catch (err) {
            toast.error('Failed to update status.');
        }
    };
    
    // --- Calculate Stats ---
    const pendingCases = consultations.filter(c => c.status === 'Pending');
    const activeCases = consultations.filter(c => ['Accepted', 'Paid'].includes(c.status));
    const nextMeeting = consultations.find(c => c.status === 'Paid' && c.bookedSlot?.date && new Date(c.bookedSlot.date) > new Date());

    if (loading || !user) return <div style={{fontFamily: "'Lato', sans-serif", padding: '2rem'}}>Loading...</div>;

    // --- STYLES (From ClientDashboard Template) ---
    const pageStyle = { fontFamily: "'Lato', sans-serif", padding: '1rem 2rem' };
    const headerStyle = { marginBottom: '2rem' };
    const welcomeMsgStyle = { fontFamily: "'Merriweather', serif", fontSize: '2.5rem', color: '#0B1D39', margin: 0 };
    const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' };
    const statCardStyle = {
        backgroundColor: '#FFFFFF',
        padding: '1.5rem',
        borderRadius: '18px',
        boxShadow: '0 6px 24px rgba(0,0,0,0.05)',
        transition: 'transform 0.3s, box-shadow 0.3s',
    };
    const timelineCardStyle = { ...statCardStyle, marginTop: '2rem' };

    // --- CRITICAL FIX: Added the missing style ---
    const timelineItemStyle = { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem', 
        padding: '1rem 0', 
        borderBottom: '1px solid #f0f0f0' 
    };
    
    // --- NEW STYLES for Request List ---
    const requestListStyle = { ...statCardStyle, marginTop: '2rem' };
    const requestItemStyle = {
        padding: '1rem 0',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };
    const requestItemInfoStyle = { flex: 1, paddingRight: '1rem' };
    const requestItemActionsStyle = { display: 'flex', gap: '0.5rem' };
    const actionButtonStyle = {
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '0.9rem',
    };
    const acceptButtonStyle = { ...actionButtonStyle, backgroundColor: '#10b981', color: 'white' };
    const rejectButtonStyle = { ...actionButtonStyle, backgroundColor: '#ef4444', color: 'white' };

    return (
        <div style={pageStyle}>
            {/* 1. Welcome Section */}
            <header style={headerStyle}>
                <h1 style={welcomeMsgStyle}>Welcome back, Advocate {user.firstName}.</h1>
                <p style={{color: '#555'}}>Manage your consultations and respond to new clients.</p>
            </header>
            
            {/* 2. Summary Stats Cards */}
            <div style={gridStyle}>
                <div style={statCardStyle}>
                    {icons.cases}
                    <h3 style={{margin: '0.5rem 0', color: '#555'}}>Active Cases</h3>
                    <p style={{fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: '#0B1D39'}}>{activeCases.length}</p>
                </div>
                <div style={statCardStyle}>
                    {icons.pending}
                    <h3 style={{margin: '0.5rem 0', color: '#555'}}>New Requests</h3>
                    <p style={{fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: '#0B1D39'}}>{pendingCases.length}</p>
                </div>
                <div style={statCardStyle}>
                    {icons.meetings}
                    <h3 style={{margin: '0.5rem 0', color: '#555'}}>Next Meeting</h3>
                    <p style={{fontSize: '1rem', fontWeight: 'bold', margin: 0, color: '#0B1D39'}}>
                        {nextMeeting ? `${new Date(nextMeeting.bookedSlot.date).toLocaleDateString()} at ${nextMeeting.bookedSlot.time}` : 'None Scheduled'}
                    </p>
                </div>
            </div>

            {/* 3. NEW: New Consultation Requests Section */}
            <div style={requestListStyle}>
                <h3 style={{margin: 0, borderBottom: '1px solid #f0f0f0', paddingBottom: '1rem'}}>New Consultation Requests</h3>
                {pendingCases.length === 0 ? (
                    <p style={{color: '#555', textAlign: 'center', padding: '2rem 0'}}>You have no new requests.</p>
                ) : (
                    pendingCases.map((c, index) => (
                        <div key={c._id} style={{...requestItemStyle, ...(index === pendingCases.length - 1 && {borderBottom: 'none'})}}>
                            <div style={requestItemInfoStyle}>
                                <strong style={{color: '#0A2342'}}>{c.caseId}</strong>
                                <p style={{margin: '0.25rem 0', color: '#333'}}>
                                    From: {c.client.firstName} {c.client.lastName}
                                </p>
                                <small style={{color: '#555'}}>{c.caseDescription}</small>
                            </div>
                            <div style={requestItemActionsStyle}>
                                <button 
                                    style={acceptButtonStyle} 
                                    onClick={() => handleStatusUpdate(c._id, 'Accepted')}
                                >
                                    Accept
                                </button>
                                <button 
                                    style={rejectButtonStyle}
                                    onClick={() => handleStatusUpdate(c._id, 'Rejected')}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            {/* 4. Upcoming Consultations (Kept from template) */}
            <div style={timelineCardStyle}>
                <h3 style={{margin: 0}}>Upcoming Consultations</h3>
                {activeCases.filter(c => c.status === 'Paid' && c.bookedSlot).length === 0 ? (
                    <p style={{color: '#555', textAlign: 'center', padding: '1rem 0'}}>No upcoming meetings.</p>
                ) : (
                    activeCases.filter(c => c.status === 'Paid' && c.bookedSlot).map((c, index, arr) => (
                        <div key={c._id} style={{...timelineItemStyle, ...(index === arr.length - 1 && {borderBottom: 'none'})}}>
                            <div style={{padding: '0.5rem', backgroundColor: '#e8f4fd', borderRadius: '50%'}}>
                                {icons.calendar}
                            </div>
                            <div>
                                <strong>{new Date(c.bookedSlot.date).toLocaleDateString()} at {c.bookedSlot.time}</strong>
                                <p style={{margin: '0.25rem 0', color: '#555'}}>With: {c.client.firstName} {c.client.lastName} (Case ID: {c.caseId})</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LawyerDashboard;