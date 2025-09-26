// frontend/src/pages/SignUpPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const SignUpPage = () => {
    const [role, setRole] = useState('client');
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
        phone: '', city: '', state: '', zipCode: '', govId: '', barCouncilId: '',
        primaryPracticeArea: '', additionalPracticeAreas: [], yearsOfExperience: '',
    });
    // CRITICAL FIX: Corrected typo from 'setAgumedToTerms' to 'setAgreedToTerms'
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        if (!agreedToTerms) {
            return toast.error('You must agree to the Terms & Conditions.');
        }
        if (formData.password !== formData.confirmPassword) {
            return toast.error('Passwords do not match!');
        }
        try {
            await api.post('/api/auth/register', { ...formData, role });
            toast.success('Registration successful! Please check your email.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.msg || 'An unknown error occurred.');
        }
    };

    const practiceAreas = [ "Family Law", "Criminal Law", "Corporate Law", "Real Estate Law", "Consumer Protection Law", "General Consultation" ];

    // --- STYLES ---
    const pageStyle = { display: 'flex', minHeight: 'calc(100vh - 70px)', fontFamily: "'Lato', sans-serif" };
    
    const leftPanelStyle = { 
        flex: 1, padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        backgroundImage: `url('https://imageio.forbes.com/specials-images/imageserve/66a287879f9e730526b6f792/0x0.jpg?format=jpg&height=900&width=1600&fit=bounds')`,
        backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', color: 'white'
    };
    const overlayStyle = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(19, 20, 22, 0.7)', zIndex: 1 };
    const contentWrapperStyle = { position: 'relative', zIndex: 2 };
    const mainHeadingStyle = { fontFamily: "'Merriweather', serif", fontSize: '3rem' };
    const subheadingStyle = { fontSize: '1.2rem', color: '#ccc', lineHeight: '1.6' };
    const rightPanelStyle = { flex: 1, backgroundColor: 'white', padding: '2rem 4rem', overflowY: 'auto' };
    const formHeaderStyle = { fontFamily: "'Merriweather', serif", fontSize: '2.5rem', color: '#333' };
    const toggleContainerStyle = { display: 'flex', margin: '1.5rem 0', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' };
    const toggleButtonStyle = { flex: 1, padding: '1rem', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' };
    const activeToggleStyle = { ...toggleButtonStyle, backgroundColor: '#0A2342', color: 'white' };
    const inputStyle = { width: '100%', padding: '0.75rem', marginBottom: '1.5rem', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' };
    const flexDiv = { display: 'flex', gap: '1rem', marginBottom: '1.5rem' };
    const checkboxContainerStyle = { display: 'flex', alignItems: 'center', marginBottom: '1rem' };
    const actionButtonStyle = { width: '100%', padding: '1rem', backgroundColor: '#D4AF37', color: '#0A2342', border: 'none', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase', marginTop: '1.5rem' };

    return (
        <div style={pageStyle}>
            <div style={leftPanelStyle}>
                <div style={overlayStyle}></div>
                <div style={contentWrapperStyle}>
                    <h1 style={mainHeadingStyle}>Connecting with Top Legal Professionals</h1>
                    <p style={subheadingStyle}>Access to the best lawyers. Choose from our network of attorneys, vetted and screened for quality.</p>
                </div>
            </div>
            <div style={rightPanelStyle}>
                <h2 style={formHeaderStyle}>Create Account</h2>
                <div style={toggleContainerStyle}>
                    <button style={role === 'client' ? activeToggleStyle : toggleButtonStyle} onClick={() => setRole('client')}>I'm a Client</button>
                    <button style={role === 'lawyer' ? activeToggleStyle : toggleButtonStyle} onClick={() => setRole('lawyer')}>I'm a Lawyer</button>
                </div>
                <form onSubmit={onSubmit}>
                    <div style={{...flexDiv, marginBottom: '1.5rem'}}>
                        <input style={{...inputStyle, marginBottom: 0}} type="text" name="firstName" value={formData.firstName} onChange={onChange} placeholder="First Name" required />
                        <input style={{...inputStyle, marginBottom: 0}} type="text" name="lastName" value={formData.lastName} onChange={onChange} placeholder="Last Name" required />
                    </div>
                    <input style={inputStyle} type="email" name="email" value={formData.email} onChange={onChange} placeholder="Email" required />
                    <div style={{...flexDiv, marginBottom: '1.5rem'}}>
                        <input style={{...inputStyle, marginBottom: 0}} type="password" name="password" value={formData.password} onChange={onChange} placeholder="Password (min 6 chars)" required minLength="6" />
                        <input style={{...inputStyle, marginBottom: 0}} type="password" name="confirmPassword" value={formData.confirmPassword} onChange={onChange} placeholder="Confirm Password" required minLength="6" />
                    </div>
                    {role === 'client' && (
                        <input style={inputStyle} type="text" name="govId" value={formData.govId} onChange={onChange} placeholder="Government ID (Optional)" />
                    )}
                    {role === 'lawyer' && (
                        <>
                            <input style={inputStyle} type="text" name="barCouncilId" value={formData.barCouncilId} onChange={onChange} placeholder="Bar Council Reg. Number" required />
                            <select style={inputStyle} name="primaryPracticeArea" value={formData.primaryPracticeArea} onChange={onChange} required>
                                <option value="">Select Primary Practice Area</option>
                                {practiceAreas.map(area => (<option key={area} value={area}>{area}</option>))}
                            </select>
                        </>
                    )}
                    <div style={checkboxContainerStyle}>
                        <input type="checkbox" id="terms" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} style={{ marginRight: '0.5rem' }} />
                        <label htmlFor="terms">I agree to the <a href="/terms">Terms & Conditions</a>*</label>
                    </div>
                    <button type="submit" style={actionButtonStyle}>Create Account</button>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;