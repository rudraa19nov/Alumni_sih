import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import Chatbot from './components/Chatbot/Chatbot';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard pages
import Dashboard from './pages/dashboard/Dashboard';

// Feature pages
import AlumniDirectory from './pages/alumni/AlumniDirectory';
import ProfilePage from './pages/profile/ProfilePage';
import EventsPage from './pages/events/EventsPage';
import MentorshipPage from './pages/mentorship/MentorshipPage';
import DonationsPage from './pages/donations/DonationsPage';
import RewardBadges from './pages/reward/rewardBadges';
import Success from './pages/success/Success'
import Feedback from './pages/feedback/Feedback';
import JobIntern from './pages/job/JobIntern';
import AnalyticsDashboard from './pages/analytic/Analytic';
import Message from './pages/message/Message';
import Linked from './pages/linked/LinkedIn';

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} 
        />
        <Route 
          path="/register" 
          element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />} 
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alumni"
          element={
            <ProtectedRoute>
              <AlumniDirectory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <EventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentorship"
          element={
            <ProtectedRoute allowedRoles={['student', 'alumni']}>
              <MentorshipPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donations"
          element={
            <ProtectedRoute allowedRoles={['alumni', 'admin']}>
              <DonationsPage />
            </ProtectedRoute>
          }
        />
         <Route
          path="/reward"
          element={
            <ProtectedRoute allowedRoles={['alumni', 'admin']}>
              < RewardBadges/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/success"
          element={
            <ProtectedRoute allowedRoles={['alumni', 'admin']}>
              < Success/>
            </ProtectedRoute>
          }
        />
         <Route
          path="/feedback"
          element={
            <ProtectedRoute allowedRoles={['alumni', 'admin']}>
              < Feedback/>
            </ProtectedRoute>
          }
        />
         <Route
          path="/analytic"
          element={
            <ProtectedRoute allowedRoles={['alumni', 'admin']}>
              < AnalyticsDashboard/>
            </ProtectedRoute>
          }
        />

         <Route
          path="/job"
          element={
            <ProtectedRoute allowedRoles={['alumni', 'admin']}>
              < JobIntern/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/linked"
          element={
            <ProtectedRoute allowedRoles={['alumni', 'admin']}>
              < Linked/>
            </ProtectedRoute>
          }
        />
         <Route
          path="/message"
          element={
            <ProtectedRoute allowedRoles={['alumni', 'admin']}>
              < Message/>
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
        />
        <Route 
          path="*" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
        />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
      <Chatbot />
    </>
  );
}

export default App;