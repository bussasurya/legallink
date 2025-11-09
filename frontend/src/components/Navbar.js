// frontend/src/components/Navbar.js

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { listenToAuthChange, postAuthChange } from '../services/BroadcastService';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [consultations, setConsultations] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const fetchConsultations = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await api.get('/api/lawyer/consultations', { headers: { 'x-auth-token': token } });
            setConsultations(res.data);
        } catch (err) {
            console.error("Failed to fetch consultations", err);
        }
    }, []);

    const checkUserStatus = useCallback(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            if (parsedUser.role === 'lawyer') {
                fetchConsultations();
            }
        } else {
            setUser(null);
            setConsultations([]);
        }
    }, [fetchConsultations]);

    useEffect(() => {
        checkUserStatus();
        const unsubscribe = listenToAuthChange(checkUserStatus);
        const socket = io.connect(process.env.REACT_APP_BACKEND_URL || "http://localhost:5000");
        const storedUser = localStorage.getItem('user');
        socket.off('new_consultation');

        if (storedUser && JSON.parse(storedUser).role === 'lawyer') {
            socket.emit('join_user_room', JSON.parse(storedUser).id);
            const handleNewConsultation = () => fetchConsultations();
            socket.on('new_consultation', handleNewConsultation);
        }
        return () => {
            unsubscribe();
            socket.disconnect();
        };
    }, [location.pathname, checkUserStatus, fetchConsultations]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        postAuthChange();
        navigate('/login');
    };

    const handleStatusUpdate = async (id, status) => {
        const token = localStorage.getItem('token');
        try {
            await api.put(`/api/consultations/${id}`, { status }, { headers: { 'x-auth-token': token } });
            toast.success(`Request has been ${status}.`);
            fetchConsultations();
        } catch (err) {
            toast.error('Failed to update status.');
        }
    };

    const handleDismiss = async (id) => {
        const token = localStorage.getItem('token');
        if (window.confirm('Dismiss this notification? The client will still see the record.')) {
            try {
                await api.put(`/api/consultations/dismiss/${id}`, {}, { headers: { 'x-auth-token': token } });
                toast.success('Notification dismissed.');
                fetchConsultations();
            } catch (err) {
                toast.error('Failed to dismiss request.');
            }
        }
    };
    
    const unreadCount = consultations.filter(c => c.status === 'Pending').length;

    // --- STYLES ---
    const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#0A2342', color: 'white', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };
    const logoStyle = { fontFamily: "'Merriweather', serif", fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: 'white' };
    const navLinksStyle = { display: 'flex', gap: '2rem', fontFamily: "'Lato', sans-serif" };
    const linkStyle = { textDecoration: 'none', color: 'white', fontSize: '1rem' };
    const authButtonsStyle = { display: 'flex', alignItems: 'center', gap: '1rem' };
    const buttonStyle = { ...linkStyle, padding: '0.5rem 1rem', border: '1px solid white', borderRadius: '5px', background: 'none', cursor: 'pointer', fontFamily: "'Lato', sans-serif" };
    const signupButtonStyle = { ...buttonStyle, backgroundColor: '#D4AF37', color: '#0A2342', fontWeight: 'bold', border: 'none' };
    const notificationContainerStyle = { position: 'relative' };
    const notificationIconStyle = { cursor: 'pointer', ...linkStyle };
    const badgeStyle = { position: 'absolute', top: '-8px', right: '-12px', backgroundColor: 'red', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.8rem', border: '2px solid #0A2342' };
    const dropdownStyle = { position: 'absolute', top: '40px', right: 0, backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '350px', maxHeight: '400px', overflowY: 'auto', zIndex: 1100, color: 'black' };
    const dropdownItemStyle = { padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
    const itemContentStyle = { flex: 1 };
    const actionButtonStyle = { padding: '0.3rem 0.6rem', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '4px', marginRight: '0.5rem', fontSize: '0.8rem' };
    const dismissButtonStyle = { background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#aaa', padding: '0 0.5rem' };

    return (
        <nav style={navStyle}>
            <Link to="/" style={logoStyle}>⚖️ LegalLink</Link>
            
            <div style={navLinksStyle}>
                <Link to="/" style={linkStyle}>Home</Link>
                <Link to="/blog" style={linkStyle}>Blog</Link>
                <Link to="/contact" style={linkStyle}>Contact</Link>
            </div>
            
            <div style={authButtonsStyle}>
                {user ? (
                    <>
                        {user.role === 'lawyer' && (
                            <div style={notificationContainerStyle}>
                                <div style={notificationIconStyle} onClick={() => setShowNotifications(!showNotifications)}>
                                    Notifications
                                    {unreadCount > 0 && <span style={badgeStyle}>{unreadCount}</span>}
                                </div>
                                {showNotifications && (
                                    <div style={dropdownStyle}>
                                        <h4 style={{padding: '1rem', margin: 0, borderBottom: '1px solid #eee'}}>Consultation Requests</h4>
                                        {consultations.length > 0 ? (
                                            consultations.map(c => (
                                                <div key={c._id} style={dropdownItemStyle}>
                                                    <div style={itemContentStyle}>
                                                        <p style={{margin: 0}}><strong>From:</strong> {c.client.firstName} {c.client.lastName}</p>
                                                        <p style={{margin: '0.5rem 0'}}><strong>Status:</strong> {c.status}</p>
                                                        <small style={{color: '#555'}}>{c.caseDescription.substring(0, 50)}...</small>
                                                        {c.status === 'Pending' && (
                                                            <div style={{marginTop: '0.5rem'}}>
                                                                <button onClick={() => handleStatusUpdate(c._id, 'Accepted')} style={{...actionButtonStyle, backgroundColor: '#5cb85c'}}>Accept</button>
                                                                <button onClick={() => handleStatusUpdate(c._id, 'Rejected')} style={{...actionButtonStyle, backgroundColor: '#d9534f'}}>Reject</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {c.status !== 'Pending' && (
                                                         <button onClick={() => handleDismiss(c._id)} style={dismissButtonStyle} title="Dismiss Notification">🗑️</button>
                                                    )}
                                                </div>
                                            ))
                                        ) : <p style={{padding: '1rem'}}>No requests yet.</p>}
                                    </div>
                                )}
                            </div>
                        )}
                        <Link to={`/${user.role}-dashboard`} style={linkStyle}>My Dashboard</Link>
                        <button onClick={handleLogout} style={signupButtonStyle}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={buttonStyle}>Login</Link>
                        {/* --- CRITICAL FIX: Reverted to a direct link --- */}
                        <Link to="/signup" style={signupButtonStyle}>Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;