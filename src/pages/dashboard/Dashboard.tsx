import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AlumniDashboard from './AlumniDashboard';
import StudentDashboard from './StudentDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'alumni':
      return <AlumniDashboard />;
    case 'student':
      return <StudentDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <div>Invalid user role</div>;
  }
};

export default Dashboard;