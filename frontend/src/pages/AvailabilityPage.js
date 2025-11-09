// frontend/src/pages/AvailabilityPage.js

import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const AvailabilityPage = () => {
    const [schedule, setSchedule] = useState({
        monday: [], tuesday: [], wednesday: [], thursday: [],
        friday: [], saturday: [], sunday: []
    });
    const [consultationFee, setConsultationFee] = useState(500); // Store as rupees
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchAvailability = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // Redirect if not logged in
            return;
        }
        try {
            const res = await api.get('/api/availability', {
                headers: { 'x-auth-token': token }
            });
            setSchedule(res.data.schedule);
            setConsultationFee(res.data.consultationFee / 100); // Convert from paisa to rupees
        } catch (err) {
            toast.error("Could not fetch availability.");
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchAvailability();
    }, [fetchAvailability]);

    const handleAddTimeSlot = (day) => {
        const newSchedule = { ...schedule };
        newSchedule[day].push({ startTime: '10:00', endTime: '11:00' });
        setSchedule(newSchedule);
    };

    const handleTimeChange = (day, index, field, value) => {
        const newSchedule = { ...schedule };
        newSchedule[day][index][field] = value;
        setSchedule(newSchedule);
    };

    const handleRemoveTimeSlot = (day, index) => {
        const newSchedule = { ...schedule };
        newSchedule[day].splice(index, 1);
        setSchedule(newSchedule);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const loadingToast = toast.loading('Saving schedule...');
        try {
            await api.post('/api/availability', 
                { 
                    schedule, 
                    consultationFee: consultationFee * 100 // Convert back to paisa
                }, 
                { headers: { 'x-auth-token': token } }
            );
            toast.dismiss(loadingToast);
            toast.success('Availability saved successfully!');
        } catch (err) {
            toast.dismiss(loadingToast);
            toast.error('Failed to save availability.');
        }
    };

    if (loading) return <div>Loading...</div>;

    // --- STYLES ---
    const pageStyle = { padding: '2rem' };
    const headerStyle = { borderBottom: '1px solid #ddd', paddingBottom: '1rem', marginBottom: '2rem' };
    const cardStyle = { backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '2rem' };
    const inputStyle = { padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', marginRight: '0.5rem' };
    const buttonStyle = { padding: '0.75rem 1.5rem', border: 'none', color: 'white', backgroundColor: '#0A2342', cursor: 'pointer', borderRadius: '4px' };
    
    return (
        <div style={pageStyle}>
            <div style={headerStyle}><h1>My Availability</h1></div>
            
            <form onSubmit={handleSubmit}>
                <div style={cardStyle}>
                    <h3>Consultation Fee (in ₹)</h3>
                    <input 
                        type="number" 
                        value={consultationFee}
                        onChange={(e) => setConsultationFee(e.target.value)}
                        style={{...inputStyle, width: '100px'}}
                    />
                </div>
                
                <div style={cardStyle}>
                    <h3>Set Your Weekly Schedule</h3>
                    {weekDays.map(day => (
                        <div key={day} style={{marginBottom: '1.5rem'}}>
                            <h4>{day.charAt(0).toUpperCase() + day.slice(1)}</h4>
                            {schedule[day].map((slot, index) => (
                                <div key={index} style={{display: 'flex', alignItems: 'center', marginBottom: '0.5rem'}}>
                                    <input 
                                        type="time" 
                                        value={slot.startTime} 
                                        onChange={(e) => handleTimeChange(day, index, 'startTime', e.target.value)}
                                        style={inputStyle}
                                    />
                                    <span>to</span>
                                    <input 
                                        type="time" 
                                        value={slot.endTime} 
                                        onChange={(e) => handleTimeChange(day, index, 'endTime', e.target.value)}
                                        style={inputStyle}
                                    />
                                    <button type="button" onClick={() => handleRemoveTimeSlot(day, index)} style={{background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '1.2rem'}}>&times;</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => handleAddTimeSlot(day)}>+ Add Slot</button>
                        </div>
                    ))}
                </div>
                <button type="submit" style={buttonStyle}>Save Schedule</button>
            </form>
        </div>
    );
};

export default AvailabilityPage;