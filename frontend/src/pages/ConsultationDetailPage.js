// frontend/src/pages/ConsultationDetailPage.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Chat from '../components/Chat';

const ConsultationDetailPage = () => {
    const { id } = useParams();
    const [consultation, setConsultation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConsultation = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await api.get(`/api/consultations/${id}`, {
                    headers: { 'x-auth-token': token }
                });
                setConsultation(res.data);
            } catch (err) {
                console.error("Failed to fetch consultation details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchConsultation();
    }, [id]);
    
    // --- STYLES ---
    const pageStyle = { padding: '2rem', fontFamily: "'Lato', sans-serif", maxWidth: '1000px', margin: 'auto' };
    const headerStyle = { borderBottom: '1px solid #eee', paddingBottom: '1rem' };
    const gridStyle = { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '2rem' };
    const cardStyle = { backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };
    const contactCardStyle = { ...cardStyle, backgroundColor: '#e8f4fd', border: '1px solid #bde0fe', marginTop: '1rem' };

    if (loading) return <div style={pageStyle}><h2>Loading consultation details...</h2></div>;
    if (!consultation) return <div style={pageStyle}><h2>Consultation not found.</h2></div>;

    return (
        <div style={pageStyle}>
            <h1 style={headerStyle}>Consultation Details</h1>
            <div style={gridStyle}>
                {/* Left side: Case & Contact Details */}
                <div>
                    <div style={cardStyle}>
                        <h2>Case with {consultation.lawyer.firstName} {consultation.lawyer.lastName}</h2>
                        <p><strong>Status:</strong> {consultation.status}</p>
                        <h3>Your Description:</h3>
                        <p>{consultation.caseDescription}</p>
                    </div>

                    {/* THIS SECTION IS NOW CONDITIONAL */}
                    {consultation.status === 'Accepted' && (
                        <div style={contactCardStyle}>
                            <h3>Contact Information Unlocked</h3>
                            <p>You can now contact the lawyer directly to schedule your meeting.</p>
                            {/* The lawyer object populated from the backend now includes contact info */}
                            <p><strong>Email:</strong> {consultation.lawyer.email}</p>
                            <p><strong>Phone:</strong> {consultation.lawyer.phone}</p>
                        </div>
                    )}
                </div>

                {/* Right side: Chat Window */}
                <div style={cardStyle}>
                    {consultation.status === 'Accepted' ? (
                        <Chat room={consultation._id} />
                    ) : (
                        <div>
                            <h3>Communication</h3>
                            <p>The chat will be enabled once the lawyer accepts your request.</p>
                        </div>
                    )}
                </div>
            </div>
            <Link to="/client-dashboard" style={{marginTop: '2rem', display: 'inline-block'}}>&#8592; Back to Dashboard</Link>
        </div>
    );
};

export default ConsultationDetailPage;