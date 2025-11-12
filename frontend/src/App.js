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
import MyCasesPage from './pages/MyCasesPage';
import KnowledgeHubPage from './pages/KnowledgeHubPage';
import ManageCasesPage from './pages/ManageCasesPage';

// --- Import the 8 Guide Pages ---
import GuideDivorcePage from './pages/guides/GuideDivorcePage';
import GuidePropertyPage from './pages/guides/GuidePropertyPage';
import GuideCriminalPage from './pages/guides/GuideCriminalPage';
import GuideCorporatePage from './pages/guides/GuideCorporatePage';
import GuideCivilPage from './pages/guides/GuideCivilPage';
import GuideConsumerPage from './pages/guides/GuideConsumerPage';
import GuideTaxPage from './pages/guides/GuideTaxPage';
import GuideCyberPage from './pages/guides/GuideCyberPage';


// Placeholder pages for other sidebar links
const MeetingsPage = () => <div style={{padding: '2rem'}}><h1>Meetings</h1><p>A list of scheduled meetings with lawyers will appear here.</p></div>;

// This helper component determines which layout to render
const AppLayout = () => {
    const location = useLocation();
    
    // List of all routes that should have the Sidebar
    const dashboardRoutes = [
        '/client-dashboard', '/lawyer-dashboard', '/admin-dashboard',
        '/profile', '/meetings', '/my-cases', '/knowledge-hub',
        '/guides', '/manage-cases'
    ];

    // --- CRITICAL FIX: List of routes that should NOT have a footer ---
    const noFooterRoutes = [
        '/login',
        '/signup',
        '/admin-login'
    ];
    
    // Check if current path matches any dashboard route
    const isDashboard = dashboardRoutes.some(path => location.pathname.startsWith(path));
    // Check if current path is a no-footer page
    const isNoFooter = noFooterRoutes.some(path => location.pathname.startsWith(path));

    if (isDashboard) {
        // This layout already excludes the footer
        return (
            <DashboardLayout>
                <Outlet />
            </DashboardLayout>
        );
    }

    if (isNoFooter) {
        // This layout has no footer
        return (
            <main style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
                <Outlet />
            </main>
        );
    }

    // Standard layout for public pages (like HomePage)
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
          @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Merriweather:wght@700&display=swap');
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

                    {/* Client Dashboard Routes */}
                    <Route path="/client-dashboard" element={<ClientDashboard />} />
                    <Route path="/meetings" element={<MeetingsPage />} />
                    <Route path="/my-cases" element={<MyCasesPage />} />
                    <Route path="/knowledge-hub" element={<KnowledgeHubPage />} />

                    {/* Lawyer Dashboard Routes */}
                    <Route path="/lawyer-dashboard" element={<LawyerDashboard />} />
                    <Route path="/manage-cases" element={<ManageCasesPage />} />

                    {/* Admin Dashboard Routes */}
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />

                    {/* Shared Dashboard Routes */}
                    <Route path="/profile" element={<MyProfilePage />} />
                    
                    {/* Guide Routes */}
                    <Route path="/guides/divorce" element={<GuideDivorcePage />} />
                    <Route path="/guides/property" element={<GuidePropertyPage />} />
                    <Route path="/guides/criminal" element={<GuideCriminalPage />} />
                    <Route path="/guides/corporate" element={<GuideCorporatePage />} />
                    <Route path="/guides/civil" element={<GuideCivilPage />} />
                    <Route path="/guides/consumer" element={<GuideConsumerPage />} />
                    <Route path="/guides/tax" element={<GuideTaxPage />} />
                    <Route path="/guides/cyber" element={<GuideCyberPage />} />
                </Route>
            </Routes>
        </div>
    </Router>
  );
}

export default App;