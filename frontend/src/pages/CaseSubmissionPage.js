// frontend/src/pages/CaseSubmissionPage.js

import React, { useState } from 'react';
import api from '../api/axios';

const CaseSubmissionPage = () => {
    const [description, setDescription] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResults(null);
        try {
            const res = await api.post('/api/client/analyze-case', { description });
            setResults(res.data);
        } catch (err) {
            console.error("Case analysis failed:", err);
            alert("Failed to analyze your case. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // --- STYLES ---
    const pageStyle = { padding: '2rem', fontFamily: "'Lato', sans-serif" };
    const headerStyle = { textAlign: 'center', color: '#0A2342', fontFamily: "'Merriweather', serif" };
    const formStyle = { maxWidth: '800px', margin: '2rem auto', padding: '2rem', backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px' };
    const textareaStyle = { width: '100%', minHeight: '150px', padding: '1rem', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px', fontFamily: "'Lato', sans-serif", fontSize: '1rem' };
    const buttonStyle = { width: '100%', padding: '0.75rem', backgroundColor: '#0A2342', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '1rem', marginTop: '1rem' };
    const resultsHeaderStyle = { ...headerStyle, fontSize: '1.5rem', marginTop: '2rem' };
    const cardStyle = { backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', marginBottom: '1rem' };
    const nameStyle = { fontFamily: "'Merriweather', serif", color: '#0A2342', marginTop: 0 };

    return (
        <div style={pageStyle}>
            <h1 style={headerStyle}>Describe Your Legal Issue</h1>
            <div style={formStyle}>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="description" style={{ display: 'block', marginBottom: '1rem', fontSize: '1.1rem' }}>
                        Please explain your situation in detail. Our system will analyze it to find the best type of lawyer for you.
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="For example: 'I am getting a divorce and need help with child custody arrangements...'"
                        style={textareaStyle}
                        required
                    />
                    <button type="submit" disabled={loading} style={buttonStyle}>
                        {loading ? 'Analyzing...' : 'Analyze and Find Lawyers'}
                    </button>
                </form>
            </div>

            {results && (
                <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
                    <h2 style={resultsHeaderStyle}>
                        We suggest this is a <span style={{ color: '#D4AF37' }}>{results.suggestedCategory}</span> case.
                    </h2>
                    <p style={{ textAlign: 'center' }}>Here are some verified lawyers specializing in this area:</p>
                    
                    {results.matchingLawyers.length > 0 ? (
                        results.matchingLawyers.map(lawyer => (
                            <div key={lawyer._id} style={cardStyle}>
                                <h3 style={nameStyle}>{lawyer.firstName} {lawyer.lastName}</h3>
                                <p><strong>Experience:</strong> {lawyer.yearsOfExperience} years</p>
                                <p><strong>Location:</strong> {lawyer.city}, {lawyer.state}</p>
                                <button style={{...buttonStyle, width: 'auto', padding: '0.5rem 1rem'}}>View Profile</button>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', marginTop: '1rem' }}>No verified lawyers found for this category at the moment.</p>
                    )}
                </div>
            )}
        </div>
    );
};

// --- This line is crucial and was likely missing ---
export default CaseSubmissionPage;