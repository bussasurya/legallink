// frontend/src/pages/MyProfilePage.js

import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const MyProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const fetchProfile = useCallback(async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await api.get('/api/profile/me', {
                headers: { 'x-auth-token': token }
            });
            setProfile(res.data);
        } catch (err) {
            console.error("Failed to fetch profile", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const res = await api.put('/api/profile', profile, {
                headers: { 'x-auth-token': token }
            });
            setProfile(res.data);
            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (err) {
            toast.error('Failed to update profile.');
        }
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    if (loading) return <div>Loading profile...</div>;

    // --- STYLES ---
    const pageStyle = { padding: '2rem' };
    const cardStyle = { backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: '800px', margin: 'auto' };
    const inputStyle = { width: '100%', padding: '0.75rem', marginBottom: '1rem', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' };
    const buttonStyle = { padding: '0.75rem 1.5rem', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '4px', marginRight: '1rem' };

    return (
        <div style={pageStyle}>
            <div style={cardStyle}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h1>My Profile</h1>
                    {!isEditing && (
                        <button onClick={() => setIsEditing(true)} style={{...buttonStyle, backgroundColor: '#0A2342'}}>Edit Profile</button>
                    )}
                </div>
                <hr />
                {profile && (
                    <form onSubmit={handleUpdate}>
                        <label>First Name</label>
                        <input name="firstName" value={profile.firstName} onChange={handleChange} disabled={!isEditing} style={inputStyle} />
                        
                        <label>Last Name</label>
                        <input name="lastName" value={profile.lastName} onChange={handleChange} disabled={!isEditing} style={inputStyle} />
                        
                        <label>Email</label>
                        <input name="email" value={profile.email} disabled style={{...inputStyle, backgroundColor: '#f4f4f4'}} />
                        
                        <label>Phone</label>
                        <input name="phone" value={profile.phone} onChange={handleChange} disabled={!isEditing} style={inputStyle} />

                        {isEditing && (
                            <div>
                                <button type="submit" style={{...buttonStyle, backgroundColor: '#5cb85c'}}>Save Changes</button>
                                <button type="button" onClick={() => { setIsEditing(false); fetchProfile(); }} style={{...buttonStyle, backgroundColor: '#777'}}>Cancel</button>
                            </div>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
};

export default MyProfilePage;