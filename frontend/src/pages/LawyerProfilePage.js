// frontend/src/pages/LawyerProfilePage.js

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

// --- Data for dynamic sub-categories ---
const subCategories = {
    "Criminal Law": ["Theft / Robbery", "Assault", "Drug Offense", "Homicide / Murder", "Other"],
    "Family Law": ["Divorce", "Child Custody", "Alimony / Maintenance", "Adoption", "Other"],
    "Corporate Law": ["Business Formation", "Contract Dispute", "Mergers & Acquisitions", "Other"],
    "Consumer Protection Law": ["Defective Product", "Service Complaint", "Online Fraud", "Other"],
    "Property Law": ["Property Dispute", "Tenant Eviction", "Land Registration", "Other"],
    "Civil Law": ["Recovery Suit", "Injunction", "Damages", "Other"],
    // Add more categories as needed
};

const LawyerProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lawyer, setLawyer] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [user, setUser] = useState(null);

  // --- Modal State Updated ---
  const [showModal, setShowModal] = useState(false);
  const [caseSubType, setCaseSubType] = useState('');
  const [caseDescription, setCaseDescription] = useState('');
  const [agreed, setAgreed] = useState(false);
  
  // Get available sub-types, default to empty array if main category not found
  const availableSubTypes = lawyer ? subCategories[lawyer.primaryPracticeArea] || [] : [];

  const fetchLawyerData = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    try {
      const [profileRes, availRes] = await Promise.all([
        api.get(`/api/lawyer/${id}`),
        api
          .get(`/api/availability/${id}`, { headers: { "x-auth-token": token } })
          .catch(() => ({ data: null })),
      ]);

      setLawyer(profileRes.data);
      setAvailability(availRes.data);

      // Set the default sub-type if available
      if (profileRes.data && subCategories[profileRes.data.primaryPracticeArea]) {
        setCaseSubType(subCategories[profileRes.data.primaryPracticeArea][0]);
      }

      if (storedUser && JSON.parse(storedUser).role === "client") {
        const pendingRes = await api.get(`/api/consultations/check/${id}`, {
          headers: { "x-auth-token": token },
        });
        setIsPending(pendingRes.data.exists);
      }
    } catch (err) {
      console.error("Failed to fetch lawyer data", err);
      toast.error("Could not load lawyer details.");
      navigate("/find-lawyer");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchLawyerData();
  }, [fetchLawyerData]);

  // --- UPDATED: Booking submission logic ---
  const handleRequestConsultation = async (e) => {
    e.preventDefault();

    if (!agreed) return toast.error("Please acknowledge the consultation fee.");
    if (!caseDescription.trim()) return toast.error("Please provide a brief case description.");

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to make a request.");
      return navigate("/login");
    }

    const loadingToast = toast.loading("Sending your request...");

    // We don't need FormData anymore, just a simple JSON object
    const requestData = {
        lawyerId: id,
        caseCategory: lawyer.primaryPracticeArea,
        caseSubType: caseSubType || 'General',
        caseDescription: caseDescription
    };

    try {
      await api.post("/api/consultations", requestData, {
        headers: {
          "x-auth-token": token,
          // Content-Type is 'application/json' by default with axios post
        },
      });
      toast.dismiss(loadingToast);
      toast.success("Request sent! You will be notified when the lawyer accepts.");
      setShowModal(false);
      setIsPending(true);
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.msg || "Failed to send request.");
    }
  };

  // --- Styles ---
  const pageStyle = {
    fontFamily: "'SF Pro Display', 'Inter', sans-serif",
    background: "linear-gradient(to bottom, #f8fafc, #eef2f6)",
    minHeight: "100vh",
    padding: "3rem 1.5rem",
  };
  const containerStyle = {
    maxWidth: "1150px",
    margin: "auto",
    display: "flex",
    flexDirection: "row",
    gap: "2rem",
    flexWrap: "wrap",
  };
  const mainCardStyle = {
    flex: 2,
    background: "#fff",
    borderRadius: "18px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    overflow: "hidden",
  };
  const sidebarCardStyle = {
    flex: 1,
    background: "#fff",
    borderRadius: "18px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    padding: "2rem",
    alignSelf: "start",
    // Make sidebar sticky
    position: "sticky",
    top: "100px", 
  };
  const heroStyle = {
    padding: "2.5rem 2rem",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
  };
  const avatarStyle = {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "#0A2342",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "1.8rem",
    letterSpacing: "1px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  };
  const nameStyle = { fontSize: "1.8rem", fontWeight: 700, color: "#0A2342" };
  const specialtyStyle = {
    color: "#D4AF37",
    fontWeight: 600,
    marginTop: "0.25rem",
  };
  const infoStyle = { color: "#555", fontSize: "0.95rem", marginTop: "0.25rem" };
  const bodyStyle = { padding: "2rem" };
  const sectionTitleStyle = {
    fontWeight: 700,
    fontSize: "1.2rem",
    color: "#0A2342",
    marginBottom: "0.75rem",
  };
  //const tagListStyle = {
  //listStyle: "none",
  //paddingLeft: 0,
 // display: "flex",
 // flexWrap: "wrap",
  //gap: "0.5rem",
//};
  //const tagStyle = {
  //  background: "#f1f5f9",
   // borderRadius: "999px",
    //padding: "0.35rem 0.75rem",
   // fontSize: "0.9rem",
   // color: "#333",
  //};
  const buttonStyle = {
    width: "100%",
    padding: "1rem",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#0A2342",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "1rem",
    transition: "all 0.3s ease",
  };
  const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#cbd5e1",
    cursor: "not-allowed",
  };
  const modalBackdropStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.55)",
    backdropFilter: "blur(6px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };
  const modalStyle = {
    background: "#fff",
    padding: "2rem",
    borderRadius: "16px",
    width: "520px",
    maxWidth: "90%",
    boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
    animation: "fadeIn 0.25s ease-in-out",
  };
  // --- NEW Styles ---
  const modalLabelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#334155' };
  const modalInputStyle = { 
    width: '100%', 
    padding: '0.75rem', 
    boxSizing: 'border-box', 
    border: '1px solid #ccc', 
    borderRadius: '8px',
    fontFamily: "'Lato', sans-serif",
    backgroundColor: '#f9fafb',
    fontSize: '1rem',
  };
  const modalTextareaStyle = { ...modalInputStyle, height: '120px', resize: 'none' };
  const howItWorksStyle = {
      marginTop: '2rem',
      padding: '1.5rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
  };
  const howItWorksTitleStyle = {
      fontFamily: "'Merriweather', serif",
      color: '#0A2342',
      fontSize: '1.1rem',
      margin: '0 0 1rem 0'
  };
  const stepListStyle = { listStyle: 'none', paddingLeft: 0, margin: 0 };
  const stepItemStyle = {
      position: 'relative',
      paddingLeft: '30px',
      marginBottom: '0.75rem',
      color: '#475569',
      fontSize: '0.95rem',
  };
  const stepNumberStyle = {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      backgroundColor: '#0A2342',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '0.85rem',
  };

  if (loading) return <div style={pageStyle}>Loading lawyer profile...</div>;
  if (!lawyer) return <div style={pageStyle}>Lawyer not found.</div>;

  const initials =
    lawyer.firstName?.charAt(0).toUpperCase() +
    (lawyer.lastName ? lawyer.lastName.charAt(0).toUpperCase() : "");

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* --- Main Profile --- */}
        <div style={mainCardStyle}>
          <div style={heroStyle}>
            <div style={avatarStyle}>{initials}</div>
            <div>
              <h1 style={nameStyle}>
                {lawyer.firstName} {lawyer.lastName}
              </h1>
              <p style={specialtyStyle}>{lawyer.primaryPracticeArea}</p>
              <p style={infoStyle}>
                {lawyer.city}, {lawyer.state}
              </p>
            </div>
          </div>

          <div style={bodyStyle}>
            <h3 style={sectionTitleStyle}>About</h3>
            <p style={{ lineHeight: 1.7, color: "#444" }}>
              With {lawyer.yearsOfExperience} years of experience, {lawyer.firstName} is a
              dedicated professional specializing in {lawyer.primaryPracticeArea}.
            </p>
            {lawyer.additionalPracticeAreas &&
              lawyer.additionalPracticeAreas.length > 0 && (
                <p style={{ color: "#444" }}>
                  Also practices in: {lawyer.additionalPracticeAreas.join(', ')}.
                </p>
              )}
          </div>
        </div>

        {/* --- Sidebar --- */}
        <aside style={sidebarCardStyle}>
          <h3
            style={{
              ...nameStyle,
              fontSize: '1.25rem',
              marginBottom: '1rem',
            }}
          >
            Consultation Fee
          </h3>
          <p
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.75rem',
            }}
          >
            {availability ? `₹${availability.consultationFee / 100}` : 'Not available'}
          </p>
          <p style={{ color: '#555', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Covers one detailed consultation session with the lawyer.
          </p>

          {user && user.role === 'client' ? (
            <button
              style={
                isPending
                  ? disabledButtonStyle
                  : availability
                  ? buttonStyle
                  : disabledButtonStyle
              }
              onClick={() => setShowModal(true)}
              disabled={isPending || !availability}
            >
              {isPending ? 'Request Pending' : 'Request Consultation'}
            </button>
          ) : (
            <Link
              to="/login?role=client"
              style={{
                ...buttonStyle,
                textAlign: 'center',
                textDecoration: 'none',
                display: 'block',
              }}
            >
              Login as Client to Book
            </Link>
          )}

          {/* --- NEW "HOW IT WORKS" SECTION --- */}
          <div style={howItWorksStyle}>
              <h4 style={howItWorksTitleStyle}>How It Works</h4>
              <ul style={stepListStyle}>
                  <li style={stepItemStyle}><span style={stepNumberStyle}>1</span>Send a brief request to the lawyer.</li>
                  <li style={stepItemStyle}><span style={{...stepNumberStyle, left: '0px'}}>2</span>The lawyer will review and accept it.</li>
                  <li style={stepItemStyle}><span style={stepNumberStyle}>3</span>Once accepted, you'll be prompted to book a time and pay.</li>
              </ul>
          </div>

        </aside>
      </div>

      {/* --- Booking Modal --- */}
      {showModal && (
        <div style={modalBackdropStyle}>
          <div style={modalStyle}>
            <h2 style={{ ...nameStyle, fontSize: "1.5rem" }}>
              Request Consultation with {lawyer.firstName} {lawyer.lastName}
            </h2>
            <form onSubmit={handleRequestConsultation}>
              
              {/* --- UPDATED: Case Category --- */}
              <div style={{ margin: "1.25rem 0" }}>
                <label style={modalLabelStyle}>Case Category</label>
                <input 
                    type="text"
                    style={{...modalInputStyle, backgroundColor: '#f8fafc', color: '#64748b'}}
                    value={lawyer.primaryPracticeArea}
                    disabled 
                />
              </div>

              {/* --- UPDATED: Specific Area Dropdown --- */}
              {availableSubTypes.length > 0 && (
                <div style={{ margin: "1.25rem 0" }}>
                  <label htmlFor="subType" style={modalLabelStyle}>Specific Area*</label>
                  <select
                    id="subType"
                    value={caseSubType}
                    onChange={(e) => setCaseSubType(e.target.value)}
                    style={modalInputStyle}
                    required
                  >
                    {availableSubTypes.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                  </select>
                </div>
              )}

              {/* --- UPDATED: Case Description --- */}
              <div style={{ margin: "1.25rem 0" }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                    <label htmlFor="description" style={modalLabelStyle}>Briefly describe your case*</label>
                    <span style={{fontSize: '0.85rem', color: caseDescription.length > 500 ? '#ef4444' : '#94a3b8'}}>
                        {caseDescription.length}/500
                    </span>
                </div>
                <textarea
                  id="description"
                  value={caseDescription}
                  onChange={(e) => setCaseDescription(e.target.value)}
                  style={modalTextareaStyle}
                  maxLength={500}
                  placeholder="E.g., Seeking legal guidance on property dispute..."
                  required
                />
              </div>

              {/* File upload section REMOVED */}

              <div style={{ margin: "1.25rem 0" }}>
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <label htmlFor="agree" style={{ marginLeft: "0.5rem" }}>
                  I acknowledge the consultation fee of{" "}
                  <strong>
                    ₹{availability ? availability.consultationFee / 100 : "..."}
                  </strong>{" "}
                  and agree to proceed.
                </label>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "1rem",
                  marginTop: "1.5rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ ...buttonStyle, background: "#9ca3af" }}
                >
                  Cancel
                </button>
                <button type="submit" style={buttonStyle}>
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LawyerProfilePage;