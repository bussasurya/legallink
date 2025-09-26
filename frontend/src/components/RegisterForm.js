// frontend/src/components/RegisterForm.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const RegisterForm = ({ role }) => {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
        phone: '', city: '', state: '', zipCode: '', govId: '', barCouncilId: '',
        primaryPracticeArea: '', additionalPracticeAreas: [], yearsOfExperience: '',
    });
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [promotionalEmails, setPromotionalEmails] = useState(false);
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handlePracticeAreaChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        if (selectedOptions.length > 5) {
            toast.error("You can select up to 5 additional practice areas.");
            return;
        }
        setFormData({ ...formData, additionalPracticeAreas: selectedOptions });
    };

    const onSubmit = async e => {
        e.preventDefault();
        if (!agreedToTerms) {
            toast.error('You must agree to the Terms & Conditions to create an account.');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }
        try {
            const registrationData = { ...formData, role, promotionalEmails };
            await api.post('/api/auth/register', registrationData);
            toast.success('Registration successful! Please check your email to verify your account.');
            navigate('/login'); 
        } catch (err) {
            toast.error(err.response?.data?.msg || 'An unknown error occurred.');
        }
    };

    const practiceAreas = [
        "Criminal Law", "Civil Law", "Corporate Law", "Family Law", "Real Estate",
        "Intellectual Property", "Immigration", "Tax Law", "Bankruptcy", "Environmental Law", "Consumer Protection Law"
    ];

    // --- STYLES ---
    const formStyle = { maxWidth: '600px', margin: '2rem auto', padding: '2rem', backgroundColor: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '8px' };
    const inputStyle = { width: '100%', padding: '0.75rem', marginBottom: '1rem', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' };
    const checkboxContainerStyle = { display: 'flex', alignItems: 'center', marginBottom: '1rem', fontSize: '0.9rem', color: '#555' };
    const checkboxStyle = { marginRight: '0.5rem', height: '1.2em', width: '1.2em' };
    const buttonStyle = { width: '100%', padding: '0.75rem', backgroundColor: '#0A2342', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '1rem', fontWeight: 'bold' };
    const flexDiv = { display: 'flex', gap: '1rem', marginBottom: '1rem' };

    return (
        <form onSubmit={onSubmit} style={formStyle}>
            <h2 style={{ textAlign: 'center', fontFamily: "'Merriweather', serif", color: '#0A2342' }}>{role.charAt(0).toUpperCase() + role.slice(1)} Registration</h2>
            
            <div style={flexDiv}>
                <input style={{...inputStyle, marginBottom: 0}} type="text" name="firstName" value={formData.firstName} onChange={onChange} placeholder="First Name" required />
                <input style={{...inputStyle, marginBottom: 0}} type="text" name="lastName" value={formData.lastName} onChange={onChange} placeholder="Last Name" required />
            </div>
            
            <input style={inputStyle} type="email" name="email" value={formData.email} onChange={onChange} placeholder="Email" required />
            
            <div style={flexDiv}>
                <input style={{...inputStyle, marginBottom: 0}} type="password" name="password" value={formData.password} onChange={onChange} placeholder="Password (min 6 chars)" required minLength="6" />
                <input style={{...inputStyle, marginBottom: 0}} type="password" name="confirmPassword" value={formData.confirmPassword} onChange={onChange} placeholder="Confirm Password" required minLength="6" />
            </div>

            <input style={inputStyle} type="tel" name="phone" value={formData.phone} onChange={onChange} placeholder="Phone Number" required />

            <div style={flexDiv}>
                <input style={{...inputStyle, marginBottom: 0}} type="text" name="city" value={formData.city} onChange={onChange} placeholder="City" required />
                <input style={{...inputStyle, marginBottom: 0}} type="text" name="state" value={formData.state} onChange={onChange} placeholder="State" required />
                <input style={{...inputStyle, marginBottom: 0}} type="text" name="zipCode" value={formData.zipCode} onChange={onChange} placeholder="Zip Code" required />
            </div>
            
            {role === 'client' && (
                <input style={inputStyle} type="text" name="govId" value={formData.govId} onChange={onChange} placeholder="Government ID" />
            )}

            {role === 'lawyer' && (
                <>
                    <input style={inputStyle} type="text" name="barCouncilId" value={formData.barCouncilId} onChange={onChange} placeholder="Bar Council Reg. Number" required />
                    <input style={inputStyle} type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={onChange} placeholder="Years of Experience" required />
                    
                    <select style={inputStyle} name="primaryPracticeArea" value={formData.primaryPracticeArea} onChange={onChange} required>
                        <option value="">Select Primary Practice Area</option>
                        {practiceAreas.map(area => (<option key={area} value={area}>{area}</option>))}
                    </select>

                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Additional Practice Areas (Max 5):</label>
                    <select style={{...inputStyle, height: '150px' }} name="additionalPracticeAreas" multiple value={formData.additionalPracticeAreas} onChange={handlePracticeAreaChange}>
                        {practiceAreas.map(area => (<option key={area} value={area}>{area}</option>))}
                    </select>
                </>
            )}

            <div style={checkboxContainerStyle}>
                <input 
                    type="checkbox" 
                    id="terms" 
                    checked={agreedToTerms} 
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    style={checkboxStyle}
                />
                <label htmlFor="terms">I agree with LegalLink <a href="/terms" target="_blank" rel="noopener noreferrer">Terms & Conditions</a>*</label>
            </div>

            <div style={checkboxContainerStyle}>
                <input 
                    type="checkbox" 
                    id="promo" 
                    checked={promotionalEmails} 
                    onChange={(e) => setPromotionalEmails(e.target.checked)}
                    style={checkboxStyle}
                />
                <label htmlFor="promo">It's ok to send me promotional emails (discounts, competitions, etc).</label>
            </div>
            
            <button type="submit" style={buttonStyle}>Register</button>
        </form>
    );
};

export default RegisterForm;