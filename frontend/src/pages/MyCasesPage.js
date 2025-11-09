// frontend/src/pages/MyCasesPage.js

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const MyCasesPage = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState(null); // For modal action
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();

  const fetchConsultations = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const res = await api.get("/api/client/my-consultations", {
        headers: { "x-auth-token": token },
      });
      setConsultations(res.data);
    } catch (err) {
      console.error("Failed to fetch consultations", err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  // === Confirmation Handler ===
  const openConfirmModal = (message, onConfirm) => {
    setConfirmAction({ message, onConfirm });
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  const handleCancel = async (id) => {
    openConfirmModal(
      "Are you sure you want to cancel this consultation request? The lawyer will be notified.",
      async () => {
        const token = localStorage.getItem("token");
        try {
          await api.put(`/api/consultations/${id}/cancel`, {}, {
            headers: { "x-auth-token": token },
          });
          toast.success("Request cancelled.");
          fetchConsultations();
        } catch (err) {
          toast.error("Could not cancel the request.");
        }
      }
    );
  };

  const handleDelete = async (id) => {
    openConfirmModal(
      "Are you sure you want to permanently delete this request?",
      async () => {
        const token = localStorage.getItem("token");
        try {
          await api.delete(`/api/consultations/client/${id}`, {
            headers: { "x-auth-token": token },
          });
          toast.success("Request deleted.");
          fetchConsultations();
        } catch (err) {
          toast.error("Could not delete the request.");
        }
      }
    );
  };

  const groupedCases = {
    Active: consultations.filter((c) =>
      ["Accepted", "Paid"].includes(c.status)
    ),
    Pending: consultations.filter((c) => c.status === "Pending"),
    Closed: consultations.filter((c) =>
      ["Rejected", "Completed"].includes(c.status)
    ),
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#f0ad4e";
      case "Accepted":
        return "#5cb85c";
      case "Paid":
        return "#0A2342";
      case "Rejected":
        return "#d9534f";
      case "Completed":
        return "#6b7280";
      default:
        return "#9ca3af";
    }
  };

  if (loading)
    return (
      <div
        style={{
          fontFamily: "'SF Pro Text', 'Inter', sans-serif",
          textAlign: "center",
          padding: "4rem",
          color: "#666",
        }}
      >
        Loading your cases…
      </div>
    );

  // --- Styles ---
  const pageStyle = {
    fontFamily: "'SF Pro Text', 'Inter', sans-serif",
    background: "linear-gradient(to bottom,#fafafa,#f5f5f7)",
    minHeight: "100vh",
    padding: "3rem 2rem",
  };
  const containerStyle = { maxWidth: "950px", margin: "0 auto" };
  const headerStyle = {
    marginBottom: "2.5rem",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "1rem",
  };
  const titleStyle = {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#1d1d1f",
    marginBottom: "0.5rem",
  };
  const subtitleStyle = {
    color: "#6b7280",
    fontSize: "1.05rem",
    marginTop: 0,
  };
  const sectionHeaderStyle = {
    fontSize: "1.35rem",
    fontWeight: "600",
    margin: "2rem 0 1rem 0",
    color: "#111827",
    borderLeft: "4px solid #0A2342",
    paddingLeft: "0.75rem",
  };
  const cardStyle = {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "1.5rem 1.75rem",
    marginBottom: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
  };
  const statusStyle = (status) => ({
    padding: "0.3rem 0.85rem",
    borderRadius: "999px",
    fontWeight: "600",
    color: "#fff",
    background: getStatusColor(status),
    fontSize: "0.8rem",
  });
  const emptyStateStyle = {
    textAlign: "center",
    color: "#9ca3af",
    fontSize: "1rem",
    padding: "1.5rem 0",
  };
  const buttonContainerStyle = { display: "flex", gap: "0.5rem" };
  const actionButtonStyle = {
    background: "none",
    border: "1px solid #ccc",
    cursor: "pointer",
    color: "#555",
    padding: "0.4rem 0.8rem",
    borderRadius: "4px",
    fontSize: "0.9rem",
    transition: "all 0.2s",
  };
  const deleteButtonIconStyle = {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#9ca3af",
    padding: "0.4rem",
    transition: "all 0.2s",
  };

  // --- Modern Confirmation Modal ---
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
    borderRadius: "14px",
    width: "420px",
    maxWidth: "90%",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    textAlign: "center",
    fontFamily: "'Inter', sans-serif",
  };
  const modalButtonContainer = {
    marginTop: "1.5rem",
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
  };
  const modalButton = (bg, color) => ({
    padding: "0.7rem 1.5rem",
    border: "none",
    borderRadius: "8px",
    fontWeight: 600,
    cursor: "pointer",
    background: bg,
    color: color,
    transition: "all 0.25s",
  });

  const renderCases = (cases, categoryName) =>
    cases.length === 0 ? (
      <div style={emptyStateStyle}>No cases in this category.</div>
    ) : (
      cases.map((consultation) => (
        <div
          key={consultation._id}
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)";
          }}
        >
          <div style={{ flex: 1 }}>
            <Link
              to={
                consultation.status === "Accepted"
                  ? `/book/${consultation._id}`
                  : `/consultation/${consultation._id}`
              }
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  marginBottom: "0.4rem",
                  color: "#1d1d1f",
                }}
              >
                {consultation.lawyer
                  ? `${consultation.lawyer.firstName} ${consultation.lawyer.lastName}`
                  : "Case Request"}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#6b7280", margin: 0 }}>
                Status:{" "}
                <span style={statusStyle(consultation.status)}>
                  {consultation.status === "Accepted"
                    ? "Accepted - Awaiting Booking"
                    : consultation.status}
                </span>
              </p>
            </Link>
          </div>

          <div style={buttonContainerStyle}>
            {consultation.status === "Accepted" && (
              <button
                onClick={() => handleCancel(consultation._id)}
                style={{
                  ...actionButtonStyle,
                  color: "#ef4444",
                  borderColor: "#ef4444",
                }}
                title="Cancel Request"
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#ef4444";
                  e.currentTarget.style.color = "white";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "none";
                  e.currentTarget.style.color = "#ef4444";
                }}
              >
                Cancel Request
              </button>
            )}

            {(categoryName === "Pending" || categoryName === "Closed") && (
              <button
                onClick={() => handleDelete(consultation._id)}
                style={deleteButtonIconStyle}
                title="Delete Case"
                onMouseOver={(e) => (e.currentTarget.style.color = "#ef4444")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#9ca3af")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="22"
                  viewBox="0 0 24 24"
                  width="22"
                  fill="currentColor"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      ))
    );

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <header style={headerStyle}>
          <h1 style={titleStyle}>My Cases</h1>
          <p style={subtitleStyle}>
            A comprehensive overview of all your legal consultations.
          </p>
        </header>

        <section>
          <h2 style={sectionHeaderStyle}>Active Cases</h2>
          {renderCases(groupedCases.Active, "Active")}

          <h2 style={sectionHeaderStyle}>Pending Cases</h2>
          {renderCases(groupedCases.Pending, "Pending")}

          <h2 style={sectionHeaderStyle}>Closed Cases</h2>
          {renderCases(groupedCases.Closed, "Closed")}
        </section>
      </div>

      {/* --- Modern Confirmation Modal --- */}
      {showConfirmModal && (
        <div style={modalBackdropStyle}>
          <div style={modalStyle}>
            <h3 style={{ fontSize: "1.2rem", color: "#111827", marginBottom: "1rem" }}>
              {confirmAction?.message}
            </h3>
            <div style={modalButtonContainer}>
              <button
                onClick={() => {
                  confirmAction.onConfirm();
                  closeConfirmModal();
                }}
                style={modalButton("#0A2342", "#fff")}
              >
                Yes, Confirm
              </button>
              <button
                onClick={closeConfirmModal}
                style={modalButton("#e5e7eb", "#111")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCasesPage;
