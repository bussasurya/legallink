// frontend/src/pages/ConsultationDetailPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import ChatInterface from '../components/ChatInterface'; // Import the new chat component

const ConsultationDetailPage = () => {
    const { id } = useParams();
    const [consultation, setConsultation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    const fetchDetails = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("You must be logged in to view this page.");
            return;
        }

        try {
            // Get both the consultation and the current user's profile
            const [consultRes, userRes] = await Promise.all([
                api.get(`/api/consultations/${id}`, { headers: { 'x-auth-token': token } }),
                api.get('/api/profile/me', { headers: { 'x-auth-token': token } })
            ]);
            
            setConsultation(consultRes.data);
            setCurrentUser(userRes.data);

        } catch (err) {
            console.error("Failed to fetch details", err);
            toast.error(err.response?.data?.msg || "Could not load consultation.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    // --- STYLES ---
    const pageStyle = { padding: '2rem', maxWidth: '1200px', margin: 'auto', fontFamily: "'Lato', sans-serif" };
    const cardStyle = { backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' };
    const titleStyle = { fontFamily: "'Merriweather', serif", color: '#0A2342', marginBottom: '0.5rem' };
    const infoBoxStyle = {
        padding: '1.5rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        textAlign: 'center',
        marginTop: '1.5rem',
    };
    const buttonStyle = { 
        display: 'inline-block',
        padding: '0.75rem 1.5rem', 
        border: 'none', 
        color: 'white', 
        backgroundColor: '#0A2342', 
        cursor: 'pointer', 
        borderRadius: '8px', 
        fontSize: '1rem', 
        fontWeight: 'bold',
        textDecoration: 'none',
        marginTop: '1rem'
    };
    
    // --- NEW STYLES for 2-Column Layout ---
    const twoColumnLayoutStyle = {
        display: 'flex',
        flexDirection: 'row',
        gap: '2rem',
    };
    const chatColumnStyle = {
        flex: 2, // Chat takes 2/3 of the space
        minWidth: '400px',
    };
    const detailsSidebarStyle = {
        flex: 1, // Details take 1/3 of the space
        minWidth: '300px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '1.5rem',
        height: 'fit-content', // So it doesn't scroll with chat
        position: 'sticky',
        top: '100px', // Adjust as needed based on your navbar height
    };
    const detailItemStyle = {
        marginBottom: '1.25rem',
    };
    const detailLabelStyle = {
        color: '#555', 
        fontSize: '0.9rem', 
        fontWeight: 'bold', 
        display: 'block', 
        marginBottom: '0.25rem'
    };
    const detailValueStyle = {
        margin: 0, 
        fontSize: '1.1rem', 
        color: '#0A2342',
        fontWeight: '600'
    };

    // --- This function decides what to show based on the status ---
    const renderContent = () => {
        if (loading || !consultation || !currentUser) {
            return <div style={pageStyle}>Loading case details...</div>;
        }

        const { status, lawyer, client, caseId, bookedSlot, caseCategory, caseSubType } = consultation;
        // The other party is whoever the current user is *not*
        const otherParty = currentUser.role === 'client' ? lawyer : client;

        switch (status) {
            case 'Pending':
                return (
                    <div style={infoBoxStyle}>
                        <h2 style={titleStyle}>Request is Pending</h2>
                        <p>You have sent your request to <strong>{lawyer.firstName} {lawyer.lastName}</strong>.</p>
                        <p>Please wait for the lawyer to review and accept your case. You will be notified once they respond.</p>
                    </div>
                );

            case 'Accepted':
                return (
                    <div style={infoBoxStyle}>
                        <h2 style={titleStyle}>Request Accepted!</h2>
                        <p><strong>{lawyer.firstName} {lawyer.lastName}</strong> has accepted your consultation request.</p>
                        <p>Your next step is to book a time slot and complete the payment to begin your consultation.</p>
                        <Link to={`/book/${consultation._id}`} style={buttonStyle}>
                            Book Your Slot Now
                        </Link>
                    </div>
                );

            case 'Paid':
                return (
                    <div>
                        <h2 style={titleStyle}>Case Room: {caseId}</h2>
                        
                        <div style={twoColumnLayoutStyle}>
                            {/* --- LEFT COLUMN (CHAT) --- */}
                            <div style={chatColumnStyle}>
                                <h3 style={{...titleStyle, fontSize: '1.5rem', marginTop: 0}}>Communication</h3>
                                <ChatInterface consultation={consultation} currentUser={currentUser} />
                            </div>

                            {/* --- RIGHT COLUMN (DETAILS) --- */}
                            <div style={detailsSidebarStyle}>
                                <h3 style={{...titleStyle, fontSize: '1.5rem', marginTop: 0}}>Case Details</h3>
                                <hr style={{margin: '1rem 0'}} />
                                <div style={detailItemStyle}>
                                    <span style={detailLabelStyle}>Lawyer:</span>
                                    <p style={detailValueStyle}>{lawyer.firstName} {lawyer.lastName}</p>
                                </div>
                                <div style={detailItemStyle}>
                                    <span style={detailLabelStyle}>Client:</span>
                                    <p style={detailValueStyle}>{client.firstName} {client.lastName}</p>
                                </div>
                                <div style={detailItemStyle}>
                                    <span style={detailLabelStyle}>Category:</span>
                                    <p style={detailValueStyle}>{caseCategory} ({caseSubType})</p>
                                </div>
                                
                                <hr style={{margin: '1rem 0'}} />
                                
                                <h3 style={{...titleStyle, fontSize: '1.5rem', marginTop: 0}}>Booking Details</h3>
                                <div style={detailItemStyle}>
                                    <span style={detailLabelStyle}>Scheduled Date:</span>
                                    <p style={detailValueStyle}>{bookedSlot.date}</p>
                                </div>
                                <div style={detailItemStyle}>
                                    <span style={detailLabelStyle}>Scheduled Time:</span>
                                    <p style={detailValueStyle}>{bookedSlot.time}</p>
                                </div>

                                {/* --- CRITICAL FIX: Use currentUser.role to determine the label --- */}
                                <div style={detailItemStyle}>
                                    <span style={detailLabelStyle}>
                                        {currentUser.role === 'client' ? "Lawyer's Email:" : "Client's Email:"}
                                    </span>
                                    <p style={detailValueStyle}>{otherParty.email}</p>
                                </div>
                                <div style={detailItemStyle}>
                                    <span style={detailLabelStyle}>
                                        {currentUser.role === 'client' ? "Lawyer's Phone:" : "Client's Phone:"}
                                    </span>
                                    <p style={detailValueStyle}>{otherParty.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            
            case 'Rejected':
            case 'Completed':
                return (
                    <div style={infoBoxStyle}>
                        <h2 style={titleStyle}>Case Closed</h2>
                        <p>This consultation ({caseId}) is now closed.</p>
                    </div>
                );

            default:
                return <p>Unknown consultation status.</p>;
        }
    };

    return (
        <div style={pageStyle}>
            <div style={cardStyle}>
                <Link to="/my-cases" style={{ textDecoration: 'none', color: '#0A2342', fontWeight: 'bold' }}>&#8592; Back to My Cases</Link>
                {renderContent()}
            </div>
        </div>
    );
};

export default ConsultationDetailPage;