// frontend/src/pages/BookingPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styles

// Helper function 'getNextDays' has been REMOVED

const BookingPage = () => {
    const { id } = useParams();
    const [step, setStep] = useState(1);
    const [consultation, setConsultation] = useState(null);
    const [formData, setFormData] = useState({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        whatsappNumber: '',
        contactTime: 'Morning',
        caseSubType: '',
        caseTitle: '',
        detailedDescription: '',
        caseDocuments: [],
    });
    const [consent, setConsent] = useState(false);
    const [availability, setAvailability] = useState(null);
    // const [bookableDates, setBookableDates] = useState([]); // <-- REMOVED (unused)
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availableSlots, setAvailableSlots] = useState([]);
    const [couponCode, setCouponCode] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchInitialData = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const consultRes = await api.get(`/api/consultations/${id}`, { headers: { 'x-auth-token': token } });
            setConsultation(consultRes.data);

            const profileRes = await api.get('/api/profile/me', { headers: { 'x-auth-token': token } });
            setFormData(prev => ({
                ...prev,
                clientName: `${profileRes.data.firstName} ${profileRes.data.lastName}`,
                clientEmail: profileRes.data.email,
                clientPhone: profileRes.data.phone || '',
                caseSubType: consultRes.data.bookingDetails?.caseSubType || '',
                caseTitle: consultRes.data.bookingDetails?.caseTitle || '',
                detailedDescription: consultRes.data.bookingDetails?.detailedDescription || '',
                whatsappNumber: consultRes.data.bookingDetails?.whatsappNumber || '',
            }));
        } catch (err) {
            toast.error("Could not load booking details.");
            navigate('/client-dashboard');
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setFormData({ ...formData, caseDocuments: e.target.files });

    const handleDetailsSubmit = async () => {
        if (!consent) {
            return toast.error('You must agree to the terms to proceed.');
        }
        
        const loadingToast = toast.loading('Saving details...');
        const submissionData = new FormData();
        Object.keys(formData).forEach(key => {
            if (key !== 'caseDocuments') {
                submissionData.append(key, formData[key]);
            }
        });
        for (let i = 0; i < formData.caseDocuments.length; i++) {
            submissionData.append('caseDocuments', formData.caseDocuments[i]);
        }

        try {
            const token = localStorage.getItem('token');
            await api.put(`/api/consultations/${id}/details`, submissionData, {
                headers: { 
                    'x-auth-token': token,
                    'Content-Type': 'multipart/form-data'
                }
            });

            const lawyerId = consultation.lawyer._id;
            const availabilityRes = await api.get(`/api/availability/${lawyerId}`, { headers: { 'x-auth-token': token } });
            setAvailability(availabilityRes.data);
            
            // Pre-load slots for the current date
            const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
            setAvailableSlots(availabilityRes.data.schedule[todayName] || []);
            
            toast.dismiss(loadingToast);
            toast.success('Details Saved!');
            setStep(2);
        } catch (err) {
            toast.dismiss(loadingToast);
            toast.error("Failed to save details or fetch schedule.");
        }
    };

    const handleScheduleSubmit = async () => {
        if (!selectedSlot) {
            return toast.error("Please select a time slot.");
        }
        const token = localStorage.getItem('token');
        const loadingToast = toast.loading('Confirming slot...');
        try {
            await api.put(`/api/consultations/${id}/schedule`, 
                { date: selectedSlot.date, time: selectedSlot.time },
                { headers: { 'x-auth-token': token } }
            );
            toast.dismiss(loadingToast);
            toast.success(`Slot confirmed for ${selectedSlot.formattedDate} at ${selectedSlot.time}`);
            setStep(3);
        } catch (err) {
            toast.dismiss(loadingToast);
            toast.error("Failed to confirm slot.");
        }
    };
    
    const handlePaymentSubmit = async () => {
        if (couponCode.toLowerCase() !== 'harshitha123') {
            return toast.error("Invalid coupon code.");
        }

        const token = localStorage.getItem('token');
        const loadingToast = toast.loading('Confirming your payment...');
        try {
            await api.put(`/api/consultations/${id}/confirm-payment`, {}, {
                headers: { 'x-auth-token': token }
            });
            toast.dismiss(loadingToast);
            toast.success('Payment Confirmed! Your meeting is booked.');
            navigate(`/consultation/${id}`);
        } catch (err) {
            toast.dismiss(loadingToast);
            toast.error('Payment failed. Please try again.');
        }
    };

    const subCategories = {
        "Criminal Law": ["Theft / Robbery", "Assault", "Drug Offense", "Homicide / Murder"],
        "Family Law": ["Divorce", "Child Custody", "Alimony / Maintenance", "Adoption"],
        "Corporate Law": ["Business Formation", "Contract Dispute", "Mergers & Acquisitions"],
        "Consumer Protection Law": ["Defective Product", "Service Complaint", "Online Fraud"],
    };

    const primaryCategory = consultation?.lawyer?.primaryPracticeArea;
    const availableSubTypes = subCategories[primaryCategory] || [];

    const onDateChange = (date) => {
        setSelectedDate(date);
        setSelectedSlot(null);
        if (availability && availability.schedule) {
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
            setAvailableSlots(availability.schedule[dayName] || []);
        }
    };
    
    const tileDisabled = ({ date, view }) => {
        if (view === 'month' && availability) {
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
            return date < new Date().setHours(0,0,0,0) || !availability.schedule[dayName] || availability.schedule[dayName].length === 0;
        }
    };
    
    if (loading || !consultation) return <div style={{padding: '2rem'}}>Loading...</div>;

    // --- STYLES ---
    const pageStyle = { padding: '2rem', maxWidth: '800px', margin: 'auto', fontFamily: "'Lato', sans-serif" };
    const stepIndicatorStyle = { display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' };
    const stepStyle = { flex: 1, textAlign: 'center', paddingBottom: '0.5rem', borderBottom: '4px solid #e9ecef', color: '#ccc', fontWeight: 'bold' };
    const activeStepStyle = { ...stepStyle, borderBottom: '4px solid #0A2342', color: '#0A2342' };
    const cardStyle = { backgroundColor: 'white', padding: '3rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };
    const sectionHeadingStyle = { fontFamily: "'Merriweather', serif", color: '#333', marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1.5rem' };
    const buttonGroupStyle = { display: 'flex', justifyContent: 'space-between', marginTop: '2rem' };
    const buttonStyle = { padding: '0.75rem 2rem', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '1rem', fontWeight: 'bold' };
    const primaryButtonStyle = { ...buttonStyle, backgroundColor: '#0A2342', color: 'white' };
    const secondaryButtonStyle = { ...buttonStyle, backgroundColor: '#e9ecef', color: '#333' };
    const inputStyle = { width: '100%', padding: '0.75rem', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' };
    const formSectionStyle = { marginBottom: '1.5rem' };
    const labelStyle = { display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#555' };
    const calendarContainerStyle = { display: 'flex', justifyContent: 'center' };
    const slotsContainerStyle = { marginTop: '2rem', textAlign: 'center' };
    // const slotGroupStyle = { ... }; // <-- REMOVED (unused)
    const slotButtonStyle = { padding: '0.5rem 1rem', border: '1px solid #0A2342', background: 'none', color: '#0A2342', margin: '0.25rem', borderRadius: '4px', cursor: 'pointer' };
    const selectedSlotStyle = { ...slotButtonStyle, background: '#0A2342', color: 'white' };

    // --- PROFESSIONAL CALENDAR STYLES ---
    const calendarCustomStyles = `
        .calendar-container { display: flex; justify-content: center; }
        .react-calendar { width: 100%; max-width: 450px; border: none; font-family: 'Lato', sans-serif; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); padding: 1rem; }
        .react-calendar__navigation button { color: #0A2342; font-size: 1.2rem; font-weight: bold; min-width: 44px; }
        .react-calendar__navigation button:disabled { background-color: #f8f9fa; }
        .react-calendar__month-view__weekdays__weekday { text-align: center; font-weight: bold; color: #888; text-decoration: none; padding-bottom: 0.5rem; }
        .react-calendar__month-view__days__day--weekend { color: #333; }
        .react-calendar__tile { 
            border: none; background: none; border-radius: 4px; height: 40px;
            width: 40px; margin: 4px; display: flex; justify-content: center; 
            align-items: center; font-size: 0.9rem;
        }
        .react-calendar__tile:enabled:hover, .react-calendar__tile:enabled:focus { background: #e6e6e6; }
        .react-calendar__tile--now { background: #D4AF37; color: #0A2342; font-weight: bold; }
        .react-calendar__tile--now:enabled:hover, .react-calendar__tile--now:enabled:focus { background: #c9a236; }
        .react-calendar__tile--active { background: #0A2342 !important; color: white !important; font-weight: bold; }
        .react-calendar__tile--disabled { background-color: #f8f9fa; color: #ccc; }
        .react-calendar__month-view__days { justify-content: center; }
    `;

    return (
        <div style={pageStyle}>
            <style>{calendarCustomStyles}</style>
            
            <div style={stepIndicatorStyle}>
                <div style={step >= 1 ? activeStepStyle : stepStyle}>1. Case Details</div>
                <div style={step >= 2 ? activeStepStyle : stepStyle}>2. Schedule Slot</div>
                <div style={step >= 3 ? activeStepStyle : stepStyle}>3. Payment</div>
            </div>

            <div style={cardStyle}>
                {step === 1 && (
                    <div>
                        <div style={formSectionStyle}>
                            <h3 style={sectionHeadingStyle}>Confirm Your Information</h3>
                            <label style={labelStyle}>Full Name*</label>
                            <input name="clientName" value={formData.clientName} onChange={handleChange} style={{...inputStyle, marginBottom: '1rem'}} required />
                            <label style={labelStyle}>Email Address*</label>
                            <input name="clientEmail" value={formData.clientEmail} onChange={handleChange} style={{...inputStyle, marginBottom: '1rem'}} required />
                            <label style={labelStyle}>WhatsApp Number*</label>
                            <input name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} style={{...inputStyle, marginBottom: '1rem'}} placeholder="Enter your WhatsApp number" required />
                            <label style={labelStyle}>Best Time to Contact</label>
                            <select name="contactTime" value={formData.contactTime} onChange={handleChange} style={inputStyle}>
                                <option>Morning</option><option>Afternoon</option><option>Evening</option>
                            </select>
                        </div>
                        <div style={formSectionStyle}>
                            <h3 style={sectionHeadingStyle}>Case Information</h3>
                            <p>You are booking a consultation for: <strong>{primaryCategory}</strong></p>
                            
                            {availableSubTypes.length > 0 && (
                                <>
                                    <label style={labelStyle}>Specific Area*</label>
                                    <select name="caseSubType" value={formData.caseSubType} onChange={handleChange} style={{...inputStyle, marginBottom: '1rem'}} required>
                                        <option value="">Select a specific area...</option>
                                        {availableSubTypes.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                                    </select>
                                </>
                            )}
                            
                            <label style={labelStyle}>Case Title / Subject*</label>
                            <input name="caseTitle" value={formData.caseTitle} onChange={handleChange} style={{...inputStyle, marginBottom: '1rem'}} placeholder="e.g., Property dispute with neighbor" required/>
                            <label style={labelStyle}>Detailed Description*</label>
                            <textarea name="detailedDescription" value={formData.detailedDescription} onChange={handleChange} style={{...inputStyle, minHeight: '120px'}} placeholder="Describe your issue, important dates, and parties involved." required/>
                            <label style={labelStyle}>Attach Documents (Optional)</label>
                            <input type="file" multiple onChange={handleFileChange} style={{...inputStyle, padding: '0.5rem'}} />
                        </div>
                        <div style={{marginTop: '1.5rem'}}>
                            <h3 style={sectionHeadingStyle}>Confidentiality and Consent</h3>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <input type="checkbox" id="consent" checked={consent} onChange={e => setConsent(e.target.checked)} style={{marginRight: '0.5rem', width: '1.2em', height: '1.2em'}} />
                                <label htmlFor="consent">I declare the information provided is true and consent to sharing it confidentially with the assigned lawyer.*</label>
                            </div>
                        </div>
                        <div style={{...buttonGroupStyle, justifyContent: 'flex-end'}}>
                            <button onClick={handleDetailsSubmit} style={primaryButtonStyle}>Save & Continue</button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h2 style={sectionHeadingStyle}>Step 2: Select a Consultation Slot</h2>
                        <p style={{textAlign: 'center', fontSize: '1.1rem'}}>The consultation fee is <strong>₹{availability.consultationFee / 100}</strong>.</p>
                        
                        <div style={calendarContainerStyle}>
                            <Calendar
                                onChange={onDateChange}
                                value={selectedDate}
                                minDate={new Date()}
                                tileDisabled={tileDisabled}
                                navigationAriaLive="polite"
                            />
                        </div>

                        <div style={slotsContainerStyle}>
                            <h4>Available Slots for {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h4>
                            {availableSlots.length > 0 ? (
                                <div>
                                    {availableSlots.map((slot, index) => (
                                        <button 
                                            key={index}
                                            style={selectedSlot?.date === selectedDate.toISOString().split('T')[0] && selectedSlot?.time === slot.startTime ? selectedSlotStyle : slotButtonStyle}
                                            onClick={() => setSelectedSlot({ date: selectedDate.toISOString().split('T')[0], time: slot.startTime, formattedDate: selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) })}
                                        >
                                            {slot.startTime}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p>No slots available for this day.</p>
                            )}
                        </div>

                        <div style={buttonGroupStyle}>
                            <button onClick={() => setStep(1)} style={secondaryButtonStyle}>Back</button>
                            <button onClick={handleScheduleSubmit} style={primaryButtonStyle}>Confirm Slot & Proceed</button>
                        </div>
                    </div>
                )}
                 
                {step === 3 && (
                    <div>
                        <h2 style={sectionHeadingStyle}>Step 3: Payment</h2>
                        <div style={{...formSectionStyle, padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px'}}>
                            <h4 style={{margin: 0}}>Booking Summary</h4>
                            <p style={{margin: '0.5rem 0'}}>
                                <strong>Lawyer:</strong> {consultation.lawyer.firstName} {consultation.lawyer.lastName}
                            </p>
                            <p style={{margin: '0.5rem 0'}}>
                                <strong>Date:</strong> {selectedSlot.formattedDate}
                            </p>
                            <p style={{margin: '0.5rem 0'}}>
                                <strong>Time:</strong> {selectedSlot.time}
                            </p>
                            <hr />
                            <h3 style={{margin: '0.5rem 0'}}>
                                Total Fee: ₹{availability.consultationFee / 100}
                            </h3>
                        </div>

                        <div style={formSectionStyle}>
                            <label style={labelStyle}>Apply Coupon Code:</label>
                            <input 
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                style={inputStyle}
                                placeholder="Enter 'harshitha123' for a free test booking"
                            />
                        </div>

                        <button 
                            onClick={handlePaymentSubmit} 
                            style={{...primaryButtonStyle, width: '100%', marginTop: '1rem', backgroundColor: '#5cb85c'}}
                        >
                            Confirm & Pay
                        </button>
                        
                         <div style={buttonGroupStyle}>
                            <button onClick={() => setStep(2)} style={secondaryButtonStyle}>Back</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingPage;