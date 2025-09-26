// frontend/src/pages/LawyerDashboard.js

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const LawyerDashboard = () => {
    const [user, setUser] = useState(null);
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchLawyerData = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const profilePromise = api.get('/api/lawyer/profile', { headers: { 'x-auth-token': token } });
            const consultationsPromise = api.get('/api/lawyer/consultations', { headers: { 'x-auth-token': token } });
            const [profileRes, consultationsRes] = await Promise.all([profilePromise, consultationsPromise]);
            
            setUser(profileRes.data);
            setConsultations(consultationsRes.data);
        } catch (err) {
            console.error(err.response ? err.response.data : err.message);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        // CRITICAL FIX: Corrected typo from fetchLawywerData to fetchLawyerData
        fetchLawyerData();
    }, [fetchLawyerData]);

    const acceptedConsultations = consultations.filter(c => c.status === 'Accepted');

    if (loading || !user) return <div>Loading...</div>;

    // --- STYLES ---
    const dashboardStyle = { padding: '2rem', fontFamily: "'Lato', sans-serif" };
    const headerStyle = { borderBottom: '1px solid #eee', paddingBottom: '1rem' };
    const sectionStyle = { marginTop: '2rem', backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };
    const cardStyle = { border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem' };
    const verificationNoticeStyle = { ...sectionStyle, backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeeba' };

    return (
        <div style={dashboardStyle}>
            <div style={headerStyle}>
                <h1>Lawyer Dashboard</h1>
                <p>Welcome, {user.firstName} {user.lastName}!</p>
            </div>

            {user.isVerified ? (
                <div style={sectionStyle}>
                    <h2>Accepted Cases</h2>
                    {acceptedConsultations.length > 0 ? (
                        acceptedConsultations.map(consultation => (
                            <div key={consultation._id} style={cardStyle}>
                                <h4>Case with: {consultation.client.firstName} {consultation.client.lastName}</h4>
                                <p><strong>Status:</strong> <span style={{color: 'green', fontWeight: 'bold'}}>Accepted</span></p>
                                <p><strong>Description:</strong> {consultation.caseDescription}</p>
                            </div>
                        ))
                    ) : (
                        <p>You have no accepted cases yet. Check your notifications for new, pending requests.</p>
                    )}
                </div>
            ) : (
                <div style={verificationNoticeStyle}>
                    <h2>Account Verification</h2>
                    <p>Your account is currently **pending admin approval**. You will be able to manage cases and appear in search results once your profile is verified.</p>
                </div>
            )}
        </div>
    );
};

export default LawyerDashboard;