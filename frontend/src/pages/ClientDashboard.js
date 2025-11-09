// frontend/src/pages/ClientDashboard.js

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

// --- SVG Icons (Defined as JSX elements) ---
const icons = {
    cases: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0B1D39" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
    pending: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0B1D39" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
    meetings: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0B1D39" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
    calendar: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A2342" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
    read: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0B1D39" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
};

const ClientDashboard = () => {
    const [user, setUser] = useState(null);
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchDashboardData = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const profilePromise = api.get('/api/profile/me', { headers: { 'x-auth-token': token } });
            const consultPromise = api.get('/api/client/my-consultations', { headers: { 'x-auth-token': token } });
            
            const [profileRes, consultRes] = await Promise.all([profilePromise, consultPromise]);
            
            setUser(profileRes.data);
            setConsultations(consultRes.data);
        } catch (err) {
            console.error("Failed to fetch dashboard data", err);
            toast.error("Could not load dashboard data.");
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    if (loading || !user) return <div>Loading...</div>;

    // Calculate stats
    const pendingCount = consultations.filter(c => c.status === 'Pending').length;
    const activeCount = consultations.filter(c => ['Accepted', 'Paid'].includes(c.status)).length;
    const nextMeeting = consultations.find(c => c.status === 'Paid' && new Date(c.bookedSlot?.date) > new Date());

    // --- STYLES ---
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
    const finderSectionStyle = { display: 'flex', gap: '1.5rem', marginTop: '2rem' };
    const finderCardStyle = { ...statCardStyle, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' };
    const buttonStyle = {
        padding: '0.75rem 1.5rem',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        cursor: 'pointer',
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '0.9rem',
        marginTop: '1rem'
    };
    const primaryButtonStyle = { ...buttonStyle, backgroundColor: '#0B1D39', color: 'white' };
    const accentButtonStyle = { ...buttonStyle, backgroundColor: 'transparent', color: '#0B1D39', border: `2px solid ${'#FFD700'}` };
    const timelineCardStyle = { ...statCardStyle, marginTop: '2rem' };
    const timelineItemStyle = { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid #f0f0f0' };
    const sectionStyle = { ...statCardStyle, marginTop: '2rem' };
    const knowledgeCardStyle = { ...statCardStyle, flex: 1, textDecoration: 'none', color: 'inherit' };
    const readMoreStyle = { display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#0B1D39', fontWeight: 'bold', textDecoration: 'none', marginTop: '1rem' };
    
    return (
        <div style={pageStyle}>
            {/* 1. Welcome Section */}
            <header style={headerStyle}>
                <h1 style={welcomeMsgStyle}>Welcome back, {user.firstName}.</h1>
                <p style={{color: '#555'}}>Here’s your legal journey overview.</p>
            </header>
            
            {/* 2. Summary Stats Cards */}
            <div style={gridStyle}>
                <div style={statCardStyle}>
                    {icons.cases}
                    <h3 style={{margin: '0.5rem 0', color: '#555'}}>Active Cases</h3>
                    <p style={{fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: '#0B1D39'}}>{activeCount}</p>
                </div>
                <div style={statCardStyle}>
                    {icons.pending}
                    <h3 style={{margin: '0.5rem 0', color: '#555'}}>Pending Consults</h3>
                    <p style={{fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: '#0B1D39'}}>{pendingCount}</p>
                </div>
                <div style={statCardStyle}>
                    {icons.meetings}
                    <h3 style={{margin: '0.5rem 0', color: '#555'}}>Next Meeting</h3>
                    <p style={{fontSize: '1rem', fontWeight: 'bold', margin: 0, color: '#0B1D39'}}>
                        {nextMeeting ? `${new Date(nextMeeting.bookedSlot.date).toLocaleDateString()} at ${nextMeeting.bookedSlot.time}` : 'None Scheduled'}
                    </p>
                </div>
            </div>

            {/* 3. AI & Lawyer Finder Section */}
            <div style={finderSectionStyle}>
                <div style={finderCardStyle}>
                    <div>
                        <h3>Find a Lawyer</h3>
                        <p style={{color: '#555'}}>Search our network of verified professionals by specialty and location.</p>
                    </div>
                    <Link to="/find-lawyer" style={{...primaryButtonStyle, background: 'linear-gradient(to right, #5bc0de, #7e57c2)'}}>Find a Lawyer</Link>
                </div>
                <div style={finderCardStyle}>
                    <div>
                        <h3>AI Smart Match</h3>
                        <p style={{color: '#555'}}>Not sure where to start? Let our AI find lawyers for you.</p>
                    </div>
                    <Link to="/submit-case" style={accentButtonStyle}>Submit Case</Link>
                </div>
            </div>
            
            {/* 4. Upcoming Consultations */}
            <div style={timelineCardStyle}>
                <h3 style={{margin: 0}}>Upcoming Consultations</h3>
                <div style={timelineItemStyle}>
                    <div style={{padding: '0.5rem', backgroundColor: '#e8f4fd', borderRadius: '50%'}}>
                        {icons.calendar}
                    </div>
                    <div>
                        <strong>{nextMeeting ? `${nextMeeting.bookedSlot.date} at ${nextMeeting.bookedSlot.time}` : 'No upcoming meetings'}</strong>
                        <span style={{marginLeft: '1rem', background: '#e8f4fd', color: '#0A2342', padding: '0.2rem 0.5rem', borderRadius: '10px', fontSize: '0.8rem'}}>
                            {nextMeeting ? 'Confirmed' : 'N/A'}
                        </span>
                    </div>
                </div>
            </div>

            {/* 5. Knowledge Hub */}
            <div style={sectionStyle}>
                <h3 style={{marginTop: 0}}>Knowledge Hub</h3>
                <div style={{display: 'flex', gap: '1rem'}}>
                    <Link to="/knowledge-hub" style={knowledgeCardStyle}>
                        <strong>Your Rights in Civil Cases</strong>
                        <p style={{fontSize: '0.9rem', color: '#555'}}>Learn the basics of civil law...</p>
                        <span style={readMoreStyle}>Read More {icons.read}</span>
                    </Link>
                     <Link to="/knowledge-hub" style={knowledgeCardStyle}>
                        <strong>How to Prepare for a Consultation</strong>
                        <p style={{fontSize: '0.9rem', color: '#555'}}>Get the most out of your meeting...</p>
                        <span style={readMoreStyle}>Read More {icons.read}</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;