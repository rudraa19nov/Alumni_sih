import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

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
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;