// frontend/src/pages/FindLawyerPage.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import api from '../api/axios';

const FindLawyerPage = () => {
    const [allLawyers, setAllLawyers] = useState([]);
    const [filteredLawyers, setFilteredLawyers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const legalCategories = [
        "All", "Family Law", "Criminal Law", "Corporate Law", 
        "Real Estate Law", "General Consultation"
    ];

    useEffect(() => {
        const fetchVerifiedLawyers = async () => {
            try {
                const res = await api.get('/api/lawyer/verified');
                setAllLawyers(res.data);
                setFilteredLawyers(res.data);
            } catch (err) {
                console.error("Failed to fetch lawyers", err);
            } finally {
                setLoading(false);
            }
        };
        fetchVerifiedLawyers();
    }, []);

    const handleFilterChange = async (category) => {
        setSelectedCategory(category);
        if (category === 'All') {
            setFilteredLawyers(allLawyers);
        } else {
            try {
                setLoading(true);
                const res = await api.get(`/api/lawyer/category/${category}`);
                setFilteredLawyers(res.data);
            } catch (err) {
                console.error(`Failed to fetch lawyers for category ${category}`, err);
            } finally {
                setLoading(false);
            }
        }
    };

    // --- STYLES ---
    const pageStyle = { padding: '2rem', fontFamily: "'Lato', sans-serif" };
    const headerStyle = { textAlign: 'center', marginBottom: '2rem', color: '#0A2342', fontFamily: "'Merriweather', serif" };
    const filterContainerStyle = { display: 'flex', justifyContent: 'center', marginBottom: '2rem', alignItems: 'center', gap: '1rem' };
    const selectStyle = { padding: '0.5rem 1rem', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ccc' };
    const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' };
    const cardStyle = { backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' };
    const nameStyle = { fontFamily: "'Merriweather', serif", color: '#0A2342', marginTop: 0 };
    const specialtyStyle = { color: '#fff', backgroundColor: '#0A2342', padding: '0.25rem 0.75rem', borderRadius: '15px', display: 'inline-block', fontSize: '0.9rem' };
    const buttonStyle = { width: '100%', padding: '0.75rem', backgroundColor: '#D4AF37', color: '#0A2342', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginTop: '1rem', textAlign: 'center', display: 'inline-block', boxSizing: 'border-box' };

    return (
        <div style={pageStyle}>
            <h1 style={headerStyle}>Find a Verified Lawyer</h1>
            
            <div style={filterContainerStyle}>
                <label htmlFor="category-filter" style={{fontSize: '1.1rem'}}>Filter by Specialty:</label>
                <select id="category-filter" value={selectedCategory} onChange={(e) => handleFilterChange(e.target.value)} style={selectStyle}>
                    {legalCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>

            {loading ? (
                <p style={{textAlign: 'center'}}>Loading...</p>
            ) : filteredLawyers.length === 0 ? (
                <p style={{textAlign: 'center'}}>No verified lawyers found for this category.</p>
            ) : (
                <div style={gridStyle}>
                    {filteredLawyers.map(lawyer => (
                        <div key={lawyer._id} style={cardStyle}>
                            <h3 style={nameStyle}>{lawyer.firstName} {lawyer.lastName}</h3>
                            <p style={specialtyStyle}>{lawyer.primaryPracticeArea}</p>
                            <p><strong>Experience:</strong> {lawyer.yearsOfExperience} years</p>
                            <p><strong>Location:</strong> {lawyer.city}, {lawyer.state}</p>
                            <Link to={`/lawyer/${lawyer._id}`} style={buttonStyle}>
                                View Profile
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FindLawyerPage;