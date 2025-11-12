// frontend/src/pages/ManageCasesPage.js

import React, { useEffect, useState, useCallback, useMemo } from 'react'; // <-- useRef has been removed
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import calendar styles

const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// Default empty schedule
const defaultSchedule = {
  monday: [], tuesday: [], wednesday: [], thursday: [],
  friday: [], saturday: [], sunday: []
};

const ManageCasesPage = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('availability');
  
  const [schedule, setSchedule] = useState(defaultSchedule);
  const [consultationFee, setConsultationFee] = useState(500);
  const [selectedDate, setSelectedDate] = useState(new Date());
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
           .catch(err => {
               console.warn("No availability set for this lawyer. Using default.");
               return { data: null };
           })
      ]);

      setConsultations(consultRes.data || []);

      if (availRes.data) {
        setSchedule(availRes.data.schedule || defaultSchedule);
        setConsultationFee(availRes.data.consultationFee / 100);
      } else {
        setSchedule(defaultSchedule);
        setConsultationFee(500);
      }

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

  // --- Socket.IO Listener ---
  useEffect(() => {
    const socket = io(process.env.REACT_APP_BACKEND_URL || "http://localhost:5000");
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userId = JSON.parse(storedUser).id;
      socket.emit('join_user_room', userId);

      const handleNewConsultation = (data) => {
        toast.success(data.msg, { duration: 5000 });
        fetchAllData();
      };

      socket.on('new_consultation', handleNewConsultation);

      return () => {
        socket.off('new_consultation', handleNewConsultation);
        socket.disconnect();
      };
    }
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

  const getDayString = (date) => weekDays[date.getDay()];

  const handleAddTimeSlot = () => {
    const day = getDayString(selectedDate);
    const newSchedule = { ...schedule };
    newSchedule[day] = newSchedule[day] || [];
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
  const upcomingMeetings = useMemo(() =>
    consultations.filter(c => c.status === 'Paid' && c.bookedSlot?.date),
    [consultations]
  );

  const allOtherCases = useMemo(() =>
    consultations.filter(c => ['Accepted', 'Completed', 'Rejected'].includes(c.status)),
    [consultations]
  );

  const todaysBookings = useMemo(() =>
    consultations.filter(c =>
      c.status === 'Paid' && c.bookedSlot?.date === selectedDate.toISOString().split('T')[0]
    ),
    [consultations, selectedDate]
  );

  // --- STYLES ---
  const pageStyle = {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif",
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
    padding: '3rem 2rem',
    color: '#1d1d1f',
  };
  const containerStyle = { maxWidth: '1200px', margin: '0 auto' };
  const headerStyle = { textAlign: 'left', marginBottom: '2.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' };
  const titleStyle = { fontSize: '2.5rem', fontWeight: '700', color: '#0A2342', margin: 0 };
  const subtitleStyle = { fontSize: '1.1rem', color: '#86868b', marginTop: '0.5rem' };
  const tabWrapperStyle = {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#e9eef5',
    padding: '6px',
    borderRadius: '999px',
    width: 'fit-content',
    margin: '0 auto 3rem auto',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  };
  const tabStyle = {
    padding: '0.7rem 2rem',
    borderRadius: '999px',
    background: 'transparent',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    color: '#555',
    transition: 'all 0.25s ease'
  };
  const activeTabStyle = {
    ...tabStyle,
    backgroundColor: '#FFFFFF',
    color: '#0A2342',
    boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
  };
  const sectionHeaderStyle = { fontWeight: '700', fontSize: '1.5rem', color: '#0A2342', marginBottom: '1.5rem' };
  const cardStyle = { background: '#fff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '16px', padding: '1.5rem 2rem', marginBottom: '1rem', boxShadow: '0 6px 18px rgba(0,0,0,0.04)' };
  const emptyStateStyle = { textAlign: 'center', color: '#86868b', fontSize: '1.1rem', padding: '3rem 0', background: '#fff', borderRadius: '16px', border: '1px dashed #d2d2d7' };
  const buttonPrimary = { backgroundColor: '#0A2342', color: '#fff', border: 'none', borderRadius: '999px', padding: '0.8rem 2rem', cursor: 'pointer', fontWeight: '600', fontSize: '1rem', textDecoration: 'none' };
  const inputStyle = { padding: '0.7rem 1rem', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#fff', outline: 'none', fontSize: '1rem', color: '#1d1d1f' };
  const statusStyle = (status) => ({
    display: 'inline-block',
    padding: '0.35rem 1rem',
    borderRadius: '999px',
    backgroundColor: status === 'Accepted' ? '#34c759' : (status === 'Completed' ? '#8e8e93' : '#ff3b30'),
    color: '#fff',
    fontSize: '0.85rem',
    fontWeight: '600'
  });
  const availabilityLayout = { display: 'flex', gap: '2rem', flexWrap: 'wrap' };
  const calendarColumn = { flex: '1.5 1 350px' };
  const slotsColumn = { flex: '1 1 300px' };
  const bookedColumn = { flex: '1 1 300px' };
  const subCardStyle = { ...cardStyle, padding: '1.5rem' };
  const subCardTitle = { fontSize: '1.2rem', fontWeight: '600', color: '#0A2342', marginBottom: '1rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.75rem' };

  // --- CALENDAR STYLES (Copied from BookingPage.js) ---
  const calendarCustomStyles = `
    .react-calendar { 
        width: 100%; 
        border: none; 
        font-family: 'Lato', sans-serif; 
        border-radius: 12px; 
        box-shadow: 0 8px 24px rgba(0,0,0,0.08); 
        padding: 1rem; 
    }
    .react-calendar__navigation button { 
        color: #0A2342; 
        font-size: 1.2rem; 
        font-weight: bold; 
        min-width: 44px; 
    }
    .react-calendar__navigation button:disabled { background-color: #f8f9fa; }
    .react-calendar__month-view__weekdays__weekday { 
        text-align: center; 
        font-weight: bold; 
        color: #888; 
        text-decoration: none; 
        padding-bottom: 0.5rem; 
    }
    .react-calendar__month-view__days__day--weekend { color: #333; }
    .react-calendar__tile { 
        border: none; 
        background: none; 
        border-radius: 4px; 
        height: 40px;
        width: 40px; 
        margin: 4px auto; 
        display: flex; 
        justify-content: center; 
        align-items: center; 
        font-size: 0.9rem;
    }
    .react-calendar__tile:enabled:hover, .react-calendar__tile:enabled:focus { 
        background: #e6e6e6; 
    }
    .react-calendar__tile--now { 
        background: #D4AF37; 
        color: #0A2342; 
        font-weight: bold; 
    }
    .react-calendar__tile--now:enabled:hover, .react-calendar__tile--now:enabled:focus { 
        background: #c9a236; 
    }
    .react-calendar__tile--active { 
        background: #0A2342 !important; 
        color: white !important; 
        font-weight: bold; 
    }
    .react-calendar__tile--disabled { 
        background-color: #f8f9fa; 
        color: #ccc; 
    }
    
    /* --- NEW CLASSES TO REPLACE DOTS --- */
    .day-has-availability:not(.react-calendar__tile--active) {
        background: #e6f7f0; /* Soft green */
        color: #065f46;
        font-weight: 500;
    }
    .day-has-booking:not(.react-calendar__tile--active) {
        background: #e8f4fd; /* Soft blue */
        color: #0A2342;
        font-weight: bold;
    }
  `;

  // --- RENDER FUNCTIONS FOR TABS ---

  const renderUpcomingMeetings = () => (
    <section>
      <h2 style={sectionHeaderStyle}>Upcoming Meetings</h2>
      {upcomingMeetings.length === 0 ? (
        <div style={emptyStateStyle}>No meetings scheduled.</div>
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
              <Link to={`/consultation/${c._id}`} style={buttonPrimary}>Enter Case Room</Link>
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
              <span style={statusStyle(c.status)}>{c.status}</span>
            </div>
            {c.status === 'Accepted' && (
              <p style={{marginTop: '1rem', color: '#86868b', fontSize: '0.9rem'}}>Waiting for client to complete booking and payment.</p>
            )}
          </div>
        ))
      )}
    </section>
  );

  const renderAvailability = () => {
    const selectedDayString = getDayString(selectedDate);
    const slotsForSelectedDay = (schedule && schedule[selectedDayString]) ? schedule[selectedDayString] : [];

    // --- UPDATED: Function to add CSS classes instead of dots ---
    const getTileClassName = ({ date, view }) => {
        if (view === 'month' && schedule) {
            const dayString = getDayString(date);
            const dateString = date.toISOString().split('T')[0];
            let classNames = [];
            
            const hasBooking = upcomingMeetings.some(c => c.bookedSlot.date === dateString);
            if (hasBooking) {
                classNames.push('day-has-booking');
            }
            
            const hasAvailability = schedule[dayString] && schedule[dayString].length > 0;
            if (hasAvailability && !hasBooking) {
                classNames.push('day-has-availability');
            }
            
            return classNames.join(' ');
        }
    };

    return (
      <section>
        <style>{calendarCustomStyles}</style>
        <h2 style={sectionHeaderStyle}>Availability & Fee</h2>

        <form onSubmit={handleAvailabilitySubmit}>
          <div style={{...cardStyle, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', justifyContent: 'space-between'}}>
            <div style={{flex: 1}}>
              <h3 style={{ margin: 0, fontWeight: '600' }}>Consultation Fee (₹)</h3>
              <p style={{color: '#555', fontSize: '0.9rem', margin: '0.5rem 0 0 0'}}>This is the price a client pays for a single consultation.</p>
            </div>
            <input
              type="number"
              value={consultationFee}
              onChange={(e) => setConsultationFee(e.target.value)}
              style={{ ...inputStyle, width: '120px', fontSize: '1.2rem', fontWeight: 'bold', color: '#0A2342' }}
            />
          </div>

          <div style={availabilityLayout}>
            <div style={calendarColumn}>
              <div style={cardStyle}>
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  tileClassName={getTileClassName} // <-- UPDATED from tileContent
                  minDate={new Date()}
                />
              </div>
            </div>

            <div style={slotsColumn}>
              <div style={subCardStyle}>
                <h3 style={subCardTitle}>Set Hours for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
                {slotsForSelectedDay.length === 0 && <p style={{color: '#999', fontSize: '0.9rem', fontStyle: 'italic'}}>Unavailable</p>}
                {slotsForSelectedDay.map((slot, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                    <input type="time" value={slot.startTime} onChange={(e) => handleTimeChange(selectedDayString, index, 'startTime', e.target.value)} style={inputStyle} />
                    <span style={{color: '#555'}}>to</span>
                    <input type="time" value={slot.endTime} onChange={(e) => handleTimeChange(selectedDayString, index, 'endTime', e.target.value)} style={inputStyle} />
                    <button
                      type="button"
                      onClick={() => handleRemoveTimeSlot(selectedDayString, index)}
                      style={{ background: '#ffe5e5', border: 'none', color: '#ff3b30', cursor: 'pointer', width: '30px', height: '30px', borderRadius: '50%', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button type="button" onClick={handleAddTimeSlot} style={{...buttonPrimary, background: '#f3f6fb', color: '#0A2342', width: '100%', marginTop: '0.5rem'}}>
                  + Add Slot
                </button>
              </div>
            </div>

            <div style={bookedColumn}>
              <div style={subCardStyle}>
                <h3 style={subCardTitle}>Bookings for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</h3>
                {todaysBookings.length === 0 ? (
                  <p style={{...emptyStateStyle, padding: '1rem 0'}}>No bookings for this day.</p>
                ) : (
                  todaysBookings.map(c => (
                    <div key={c._id} style={{borderBottom: '1px solid #f0f0f0', paddingBottom: '0.75rem', marginBottom: '0.75rem'}}>
                      <strong style={{color: '#0A2342'}}>{c.bookedSlot.time}</strong>
                      <p style={{margin: '0.25rem 0 0 0', color: '#555'}}>with {c.client.firstName} {c.client.lastName}</p>
                      <p style={{margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#86868b'}}>Case ID: {c.caseId}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div style={{textAlign: 'right', marginTop: '2rem'}}>
            <button type="submit" style={buttonPrimary}>Save All Changes</button>
          </div>
        </form>
      </section>
    );
  };
  
  if (loading) return <div style={{...pageStyle, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Loading...</div>;

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <header style={headerStyle}>
          <h1 style={titleStyle}>Manage Cases</h1>
          <p style={subtitleStyle}>Organize your schedule and client meetings.</p>
        </header>

        <div style={tabWrapperStyle}>
          <button style={activeTab === 'availability' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('availability')}>
            My Availability
          </button>
          <button style={activeTab === 'meetings' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('meetings')}>
            Upcoming Meetings ({upcomingMeetings.length})
          </button>
          <button style={activeTab === 'cases' ? activeTabStyle : tabStyle} onClick={() => setActiveTab('cases')}>
            All Cases
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