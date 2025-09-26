// frontend/src/pages/LawyerProfilePage.js

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ConsultationModal from '../components/ConsultationModal';
import toast from 'react-hot-toast';

const LawyerProfilePage = () => {
    const { id } = useParams();
    const [lawyer, setLawyer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [requestSent, setRequestSent] = useState(false);
    const navigate = useNavigate();

    const checkForPendingRequest = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await api.get(`/api/consultations/check/${id}`, {
                headers: { 'x-auth-token': token }
            });
            setRequestSent(res.data.exists);
        } catch (err) {
            console.error("Failed to check for pending request", err);
        }
    }, [id]);

    useEffect(() => {
        const fetchLawyer = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/api/lawyer/${id}`);
                setLawyer(res.data);
                await checkForPendingRequest();
            } catch (err) {
                setError('Could not find the requested lawyer.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLawyer();
    }, [id, checkForPendingRequest]);

    const handleRequestConsultation = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please log in to request a consultation.');
            navigate('/login');
            return;
        }
        setShowModal(true);
    };
    
    // --- STYLES ---
    const pageStyle = { padding: '2rem', fontFamily: "'Lato', sans-serif", maxWidth: '900px', margin: 'auto' };
    const cardStyle = { backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };
    const nameStyle = { fontFamily: "'Merriweather', serif", color: '#0A2342', fontSize: '2.5rem', marginBottom: '0.5rem' };
    const specialtyStyle = { color: '#fff', backgroundColor: '#0A2342', padding: '0.25rem 0.75rem', borderRadius: '15px', display: 'inline-block' };
    const buttonStyle = { padding: '0.75rem 2rem', backgroundColor: '#D4AF37', color: '#0A2342', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '1.5rem' };
    const disabledButtonStyle = { ...buttonStyle, backgroundColor: '#ccc', cursor: 'not-allowed', color: '#666' };

    if (loading) return <div style={pageStyle}><h2>Loading Profile...</h2></div>;
    if (error) return <div style={pageStyle}><h2 style={{color: 'red'}}>{error}</h2></div>;

    return (
        <>
            <div style={pageStyle}>
                {lawyer && (
                    <div style={cardStyle}>
                        <h1 style={nameStyle}>{lawyer.firstName} {lawyer.lastName}</h1>
                        <p style={specialtyStyle}>{lawyer.primaryPracticeArea}</p>
                        
                        <div style={{ marginTop: '1.5rem' }}>
                            <h3>About</h3>
                            <p>With {lawyer.yearsOfExperience} years of experience, {lawyer.firstName} is a dedicated professional specializing in {lawyer.primaryPracticeArea}.</p>
                            {lawyer.additionalPracticeAreas && lawyer.additionalPracticeAreas.length > 0 && (
                                <p>Also practices in: {lawyer.additionalPracticeAreas.join(', ')}.</p>
                            )}
                        </div>
                        
                        <div style={{ marginTop: '1.5rem' }}>
                            <h3>Location</h3>
                            <p>{lawyer.city}, {lawyer.state}</p>
                        </div>

                        {requestSent ? (
                            <button style={disabledButtonStyle} disabled>
                                Request Sent
                            </button>
                        ) : (
                            <button onClick={handleRequestConsultation} style={buttonStyle}>
                                Request Consultation
                            </button>
                        )}
                    </div>
                )}
            </div>

            {showModal && <ConsultationModal lawyer={lawyer} onClose={() => {
                setShowModal(false);
                // CRITICAL FIX: Re-check the status immediately after the modal is closed
                checkForPendingRequest(); 
            }} />}
        </>
    );
};

export default LawyerProfilePage;