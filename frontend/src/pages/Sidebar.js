// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import DashboardLayout from './layouts/DashboardLayout';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page Imports
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import EmailVerified from './pages/EmailVerified';
import LawyerDashboard from './pages/LawyerDashboard';
import LoginPage from './pages/LoginPage';
import ClientDashboard from './pages/ClientDashboard';
import AdminLoginPage from './pages/AdminLoginPage';
import FindLawyerPage from './pages/FindLawyerPage';
import CaseSubmissionPage from './pages/CaseSubmissionPage';
import LawyerProfilePage from './pages/LawyerProfilePage';
import ConsultationDetailPage from './pages/ConsultationDetailPage';
import MyProfilePage from './pages/MyProfilePage';
import SignUpPage from './pages/SignUpPage';
import BookingPage from './pages/BookingPage';
import AvailabilityPage from './pages/AvailabilityPage';
import MyCasesPage from './pages/MyCasesPage';
// KnowledgeHubPage and ArticleDetailPage imports are removed

// Placeholder pages for other sidebar links
const MeetingsPage = () => <div style={{padding: '2rem'}}><h1>Meetings</h1><p>A list of scheduled meetings with lawyers will appear here.</p></div>;

// This helper component determines which layout to render
const AppLayout = () => {
    const location = useLocation();
    // Updated list of dashboard routes
    const dashboardRoutes = [
        '/client-dashboard', '/lawyer-dashboard', '/admin-dashboard',
        '/profile', '/meetings', '/my-cases', 
        '/availability'
    ];
    const isDashboard = dashboardRoutes.some(path => location.pathname.startsWith(path));

    if (isDashboard) {
        return (
            <DashboardLayout>
                <Outlet />
            </DashboardLayout>
        );
    }

    // Standard layout for public pages
    return (
        <>
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

function App() {
  return (
    <Router>
        <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Merriweather:wght@700&display.swap');
          body { margin: 0; overflow-x: hidden; }
        `}
        </style>
        <Toaster position="top-center" />
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Routes>
                <Route element={<AppLayout />}>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/admin-login" element={<AdminLoginPage />} />
                    <Route path="/find-lawyer" element={<FindLawyerPage />} />
                    <Route path="/verify-email/:token" element={<EmailVerified />} />
                    <Route path="/submit-case" element={<CaseSubmissionPage />} />
                    <Route path="/lawyer/:id" element={<LawyerProfilePage />} />
                    <Route path="/consultation/:id" element={<ConsultationDetailPage />} />
                    <Route path="/book/:id" element={<BookingPage />} />

                    {/* Dashboard Routes */}
                    <Route path="/client-dashboard" element={<ClientDashboard />} />
                    <Route path="/lawyer-dashboard" element={<LawyerDashboard />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/profile" element={<MyProfilePage />} />
                    <Route path="/meetings" element={<MeetingsPage />} />
                    <Route path="/my-cases" element={<MyCasesPage />} />
                    <Route path="/availability" element={<AvailabilityPage />} />
                    {/* knowledge-hub and article routes are removed */}
                </Route>
            </Routes>
        </div>
    </Router>
  );
}

export default App;