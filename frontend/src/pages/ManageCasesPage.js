// frontend/src/pages/ManageCasesPage.js

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const ManageCasesPage = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('meetings');
  // Availability State
  const [schedule, setSchedule] = useState({
    monday: [], tuesday: [], wednesday: [], thursday: [],
    friday: [], saturday: [], sunday: []
  });
  const [consultationFee, setConsultationFee] = useState(500);
  const navigate = useNavigate();

  // --- FETCH DATA ---
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const [consultRes, availRes] = await Promise.all([
        api.get('/api/lawyer/consultations', { headers: { 'x-auth-token': token } }),
        api.get('/api/availability', { headers: { 'x-auth-token': token } })
      ]);

      setConsultations(consultRes.data);
      setSchedule(availRes.data.schedule);
      setConsultationFee(availRes.data.consultationFee / 100);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
      toast.error("Could not load case data.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // --- AVAILABILITY HANDLERS ---
  const handleAvailabilitySubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const loadingToast = toast.loading('Saving schedule...');
    try {
      await api.post('/api/availability',
        { schedule, consultationFee: consultationFee * 100 },
        { headers: { 'x-auth-token': token } }
      );
      toast.dismiss(loadingToast);
      toast.success('Availability saved!');
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error('Failed to save availability.');
    }
  };

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

  // --- DATA FILTERS ---
  // Paid cases are "Upcoming Meetings" - Lawyer can enter Case Room here
  const upcomingMeetings = consultations.filter(c => c.status === 'Paid' && c.bookedSlot?.date);
  // Other active/historical cases
  const allOtherCases = consultations.filter(c => ['Accepted', 'Completed', 'Rejected'].includes(c.status));

  // --- STYLES (Apple-inspired, adapted to Navy theme) ---
  const pageStyle = {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif",
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
    padding: '3rem 2rem',
    color: '#1d1d1f',
  };

  const containerStyle = {
      maxWidth: '1000px',
      margin: '0 auto',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '3rem',
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#0A2342', // Navy
    margin: '0 0 0.5rem 0',
    letterSpacing: '-0.02em'
  };
  
  const subtitleStyle = {
      fontSize: '1.1rem',
      color: '#86868b'
  };

  // --- Tabs UI ---
  const tabWrapperStyle = {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'rgba(118, 118, 128, 0.12)', // Apple-style segmented control background
    padding: '4px',
    borderRadius: '999px',
    width: 'fit-content',
    margin: '0 auto 3rem auto',
  };

  const tabStyle = {
    padding: '0.6rem 2rem',
    borderRadius: '999px',
    background: 'transparent',
    border: 'none',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: '#555',
  };

  const activeTabStyle = {
    ...tabStyle,
    backgroundColor: '#FFFFFF',
    color: '#0A2342',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  };

  const sectionHeaderStyle = {
    fontWeight: '700',
    fontSize: '1.5rem',
    color: '#0A2342',
    marginBottom: '1.5rem',
  };

  const cardStyle = {
    background: '#fff',
    border: '1px solid rgba(0,0,0,0.05)',
    borderRadius: '18px', // More rounded
    padding: '1.5rem 2rem',
    marginBottom: '1rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
    transition: 'all 0.2s ease',
  };

  const emptyStateStyle = {
    textAlign: 'center',
    color: '#86868b',
    fontSize: '1.1rem',
    padding: '4rem 0',
    background: '#fff',
    borderRadius: '18px',
    border: '1px dashed #d2d2d7'
  };

  const buttonPrimary = {
    backgroundColor: '#0A2342', // Navy
    color: '#fff',
    border: 'none',
    borderRadius: '999px', // Pill shape
    padding: '0.8rem 2rem',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'opacity 0.2s ease',
    textDecoration: 'none',
    display: 'inline-block'
  };

  const inputStyle = {
    padding: '0.8rem 1rem',
    border: '1px solid #d2d2d7',
    borderRadius: '12px',
    backgroundColor: '#fff',
    outline: 'none',
    fontSize: '1rem',
    color: '#1d1d1f',
    transition: 'border-color 0.2s'
  };

  const statusStyle = (status) => ({
    display: 'inline-block',
    padding: '0.35rem 1rem',
    borderRadius: '999px',
    backgroundColor:
      status === 'Accepted' ? '#34c759' : // Apple green
      status === 'Completed' ? '#8e8e93' : // Apple gray
      '#ff3b30', // Apple red
    color: '#fff',
    fontSize: '0.85rem',
    fontWeight: '600',
  });

  // --- RENDER ---
  const renderUpcomingMeetings = () => (
    <section>
      <h2 style={sectionHeaderStyle}>Upcoming Meetings</h2>
      {upcomingMeetings.length === 0 ? (
        <div style={emptyStateStyle}>No upcoming meetings scheduled.</div>
      ) : (
        upcomingMeetings.map(c => (
          <div key={c._id} style={cardStyle}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: '700', color: '#0A2342' }}>{c.client.firstName} {c.client.lastName}</h3>
                    <p style={{ margin: 0, color: '#555', fontSize: '1.05rem' }}>
                         📅 {new Date(c.bookedSlot.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {c.bookedSlot.time}
                    </p>
                    <p style={{margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#86868b'}}>Case ID: {c.caseId}</p>
                </div>
                {/* Direct link to the Case Room (Chat) */}
                <Link
                  to={`/consultation/${c._id}`}
                  style={buttonPrimary}
                >
                  Enter Case Room
                </Link>
            </div>
          </div>
        ))
      )}
    </section>
  );

  const renderAllCases = () => (
    <section>
      <h2 style={sectionHeaderStyle}>All Cases</h2>
      {allOtherCases.length === 0 ? (
        <div style={emptyStateStyle}>No other cases found.</div>
      ) : (
        allOtherCases.map(c => (
          <div key={c._id} style={cardStyle}>
             <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: '600', fontSize: '1.2rem' }}>{c.client.firstName} {c.client.lastName}</h3>
                    <p style={{ margin: 0, color: '#555' }}>{c.caseCategory} - {c.caseId}</p>
                </div>
                <div>
                    <span style={statusStyle(c.status)}>{c.status}</span>
                </div>
            </div>
            {c.status === 'Accepted' && (
                 <p style={{marginTop: '1rem', color: '#86868b', fontSize: '0.9rem'}}>Waiting for client to complete booking and payment.</p>
            )}
          </div>
        ))
      )}
    </section>
  );

  const renderAvailability = () => (
    <section>
      <h2 style={sectionHeaderStyle}>Availability & Fee</h2>
      <form onSubmit={handleAvailabilitySubmit}>
        <div style={{...cardStyle, display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
          <h3 style={{ margin: 0, fontWeight: '600' }}>Consultation Fee (₹)</h3>
          <input
            type="number"
            value={consultationFee}
            onChange={(e) => setConsultationFee(e.target.value)}
            style={{ ...inputStyle, width: '120px', fontSize: '1.2rem', fontWeight: 'bold', color: '#0A2342' }}
          />
        </div>

        <div style={cardStyle}>
          <h3 style={{ marginBottom: '1.5rem', color: '#0A2342' }}>Weekly Schedule</h3>
          {weekDays.map(day => (
            <div key={day} style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: day !== 'sunday' ? '1px solid #f0f0f0' : 'none' }}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
                  <h4 style={{ textTransform: 'capitalize', margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>{day}</h4>
                  <button
                    type="button"
                    onClick={() => handleAddTimeSlot(day)}
                    style={{ background: 'none', border: 'none', color: '#007aff', fontWeight: '600', cursor: 'pointer' }}
                  >
                    + Add Slot
                  </button>
              </div>
              
              {schedule[day].length === 0 && <p style={{color: '#999', fontSize: '0.9rem', fontStyle: 'italic'}}>Unavailable</p>}

              {schedule[day].map((slot, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => handleTimeChange(day, index, 'startTime', e.target.value)}
                    style={inputStyle}
                  />
                  <span style={{color: '#555'}}>to</span>
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => handleTimeChange(day, index, 'endTime', e.target.value)}
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTimeSlot(day, index)}
                    style={{ background: '#ffe5e5', border: 'none', color: '#ff3b30', cursor: 'pointer', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{textAlign: 'right'}}>
             <button type="submit" style={buttonPrimary}>Save Changes</button>
        </div>
      </form>
    </section>
  );

  if (loading) return <div style={{...pageStyle, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Loading...</div>;

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <header style={headerStyle}>
          <h1 style={titleStyle}>Manage Cases</h1>
          <p style={subtitleStyle}>Organize your schedule and client meetings.</p>
        </header>

        <div style={tabWrapperStyle}>
          <button style={activeTab === 'meetings' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('meetings')}>
            Upcoming Meetings
          </button>
          <button style={activeTab === 'cases' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('cases')}>
            All Cases
          </button>
          <button style={activeTab === 'availability' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('availability')}>
            My Availability
          </button>
        </div>

        {activeTab === 'meetings' && renderUpcomingMeetings()}
        {activeTab === 'cases' && renderAllCases()}
        {activeTab === 'availability' && renderAvailability()}
      </div>
    </div>
  );
};

export default ManageCasesPage;