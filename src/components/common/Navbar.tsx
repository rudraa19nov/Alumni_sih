import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  Settings,
  Award,
  Search,
  Bell
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavigationItems = () => {
    if (!user) return [];

    const commonItems = [
       { label: 'Dashboard', path: '/dashboard', icon: Settings },
      { label: 'Alumni Directory', path: '/alumni', icon: Users },
     // { label: 'Rewards & Badges', path: '/reward', icon: Award }, 
      { label: 'Events', path: '/events', icon: Calendar },
      { label: 'Mentorship', path: '/mentorship', icon: Heart }
    ];

    if (user.role === 'alumni' || user.role === 'admin') {
      commonItems.push({ label: 'Donations', path: '/donations', icon: DollarSign });
    }

    commonItems.push({ label: 'Profile', path: '/profile', icon: User });

    return commonItems;
  };

  const navigationItems = getNavigationItems();

  if (!isAuthenticated) {
    return (
      <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                  <GraduationCap className="h-8 w-8 text-blue-600 relative transform group-hover:scale-110 transition-transform duration-200" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AlumniConnect
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
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
    <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                <GraduationCap className="h-8 w-8 text-blue-600 relative transform group-hover:scale-110 transition-transform duration-200" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AlumniConnect
              </span>
            </Link>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 items-center">
            <div className={`relative w-full rounded-full transition-all duration-300 ${isSearchFocused ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-gray-100'}`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search alumni, events..."
                className="block w-full pl-10 pr-3 py-2 bg-transparent border-0 focus:ring-0   focus:outline-none  text-sm"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 group relative ${
                    isActive 
                      ? 'text-blue-600' 
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs">{item.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent opacity-0 group-hover:opacity-100 rounded-md transition-opacity duration-200 -z-10"></div>
                </Link>
              );
            })}
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            {/* Notification bell */}
            <button className="hidden md:block relative p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors duration-200">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 block h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="hidden md:flex items-center space-x-3 bg-gray-100 rounded-full pl-1 pr-3 py-1">
              <img
                src={user.profilePicture || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100'}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-gray-900 leading-none">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-xs text-blue-600 px-2 py-0.5 bg-blue-100 rounded-full capitalize mt-1">
                  {user.role}
                </span>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center space-x-1 text-gray-600 hover:text-red-600 p-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-red-50"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 bg-white shadow-lg rounded-b-lg">
            {/* User info */}
            <div className="flex items-center space-x-3 px-4 py-3 border-b border-gray-100 bg-blue-50 rounded-lg mx-2">
              <img
                src={user.profilePicture || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100'}
                alt="Profile"
                className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-xs text-blue-600 px-2 py-0.5 bg-blue-100 rounded-full capitalize inline-block mt-1">
                  {user.role}
                </div>
              </div>
            </div>
            
            {/* Mobile search */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="relative rounded-lg bg-gray-100">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search alumni, events..."
                  className="block w-full pl-10 pr-3 py-2 bg-transparent border-0 focus:ring-0 text-sm"
                />
              </div>
            </div>
            
            {/* Navigation items */}
            <div className="space-y-1 px-2 py-3">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </Link>
                );
              })}
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 text-gray-700 hover:text-red-600 px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200 hover:bg-red-50 w-full text-left"
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