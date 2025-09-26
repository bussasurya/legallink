// frontend/src/components/ConsultationModal.js

import React, { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ConsultationModal = ({ lawyer, onClose }) => {
    const [caseDescription, setCaseDescription] = useState('');
    const [agreedToFee, setAgreedToFee] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!agreedToFee) {
            return toast.error('You must acknowledge the consultation fee to proceed.');
        }
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('lawyerId', lawyer._id);
        formData.append('caseDescription', caseDescription);
        
        try {
            const token = localStorage.getItem('token');
            await api.post('/api/consultations', formData, {
                headers: { 'x-auth-token': token },
            });
            toast.success('Consultation request sent successfully!');
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to send request.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // --- STYLES ---
    const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' };
    const modalContentStyle = { backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '600px', position: 'relative' };
    const closeButtonStyle = { position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' };
    const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' };
    const textareaStyle = { width: '100%', minHeight: '150px', padding: '0.75rem', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', resize: 'vertical' };
    const checkboxContainerStyle = { display: 'flex', alignItems: 'center', marginTop: '1rem', fontSize: '0.9rem' };
    const buttonStyle = { width: '100%', padding: '0.75rem', backgroundColor: '#0A2342', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '1rem', marginTop: '1.5rem' };

    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <button onClick={onClose} style={closeButtonStyle}>&times;</button>
                <form onSubmit={handleSubmit}>
                    <h2 style={{ fontFamily: "'Merriweather', serif", color: '#0A2342' }}>Request Consultation with {lawyer.firstName} {lawyer.lastName}</h2>
                    
                    <div style={{marginTop: '1.5rem'}}>
                        <label htmlFor="caseDescription" style={labelStyle}>Detailed Description</label>
                        <textarea 
                            id="caseDescription" 
                            value={caseDescription} 
                            onChange={(e) => setCaseDescription(e.target.value)} 
                            style={textareaStyle} 
                            placeholder="Please explain your situation in detail." 
                            required 
                        />
                    </div>

                    <div style={checkboxContainerStyle}>
                        <input type="checkbox" id="fee-ack" checked={agreedToFee} onChange={(e) => setAgreedToFee(e.target.checked)} style={{ marginRight: '0.5rem' }} />
                        <label htmlFor="fee-ack">I acknowledge the consultation fee of ₹{lawyer.consultationFee / 100} and agree to pay if the lawyer accepts.*</label>
                    </div>

                    <button type="submit" disabled={isSubmitting} style={buttonStyle}>
                        {isSubmitting ? 'Sending...' : 'Send Request'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ConsultationModal;