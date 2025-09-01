import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  GraduationCap, 
  Users, 
  Calendar, 
  Heart, 
  DollarSign,
  Settings
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavigationItems = () => {
    if (!user) return [];

    const commonItems = [
      { label: 'Dashboard', path: '/dashboard', icon: Settings },
      { label: 'Alumni Directory', path: '/alumni', icon: Users },
      { label: 'Events', path: '/events', icon: Calendar },
      { label: 'Profile', path: '/profile', icon: User }
    ];

    if (user.role === 'student' || user.role === 'alumni') {
      commonItems.splice(3, 0, { label: 'Mentorship', path: '/mentorship', icon: Heart });
    }

    if (user.role === 'alumni' || user.role === 'admin') {
      commonItems.push({ label: 'Donations', path: '/donations', icon: DollarSign });
    }

    return commonItems;
  };

  const navigationItems = getNavigationItems();

  if (!isAuthenticated) {
    return (
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <GraduationCap className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">AlumniConnect</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">AlumniConnect</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <img
                src={user.profilePicture || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100'}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-gray-700">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize">
                {user.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center space-x-1 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-700 hover:text-blue-600"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex items-center space-x-3 px-4 py-3 border-b border-gray-100">
              <img
                src={user.profilePicture || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100'}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-xs text-gray-500 capitalize">{user.role}</div>
              </div>
            </div>
            <div className="space-y-1 px-4 py-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium transition-colors w-full text-left"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;