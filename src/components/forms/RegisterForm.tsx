import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../utils/api';
import { validateRegistrationForm } from '../../utils/validation';
import LoadingSpinner from '../common/LoadingSpinner';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    graduationYear: '',
    course: '',
    currentYear: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    const validation = validateRegistrationForm(
      formData.email,
      formData.password,
      formData.confirmPassword,
      formData.firstName,
      formData.lastName,
      formData.role
    );
    setErrors(validation.errors);

    if (!validation.isValid) return;

    setIsLoading(true);
    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role as 'alumni' | 'student' | 'admin',
        ...(formData.role === 'alumni' && {
          graduationYear: parseInt(formData.graduationYear),
          course: formData.course
        }),
        ...(formData.role === 'student' && {
          currentYear: parseInt(formData.currentYear),
          course: formData.course
        })
      };

      const response = await authAPI.register(userData, formData.password);
      if (response.success) {
        login(response.data.user, response.data.token);
        navigate('/dashboard');
      }
    } catch (error) {
      setApiError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const graduationYears = Array.from({ length: 30 }, (_, i) => currentYear - i);
  const courses = [
    'Computer Science',
    'Business Administration',
    'Engineering',
    'Medicine',
    'Law',
    'Arts & Humanities',
    'Economics',
    'Psychology'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Join AlumniConnect</h2>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {apiError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`
                    w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                    ${errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                  `}
                  placeholder="First name"
                />
              </div>
              {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`
                  w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                  ${errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                `}
                placeholder="Last name"
              />
              {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`
                  w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                  ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                `}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`
                w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                ${errors.role ? 'border-red-300 bg-red-50' : 'border-gray-300'}
              `}
            >
              <option value="">Select your role</option>
              <option value="student">Student</option>
              <option value="alumni">Alumni</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
          </div>

          {/* Conditional fields based on role */}
          {(formData.role === 'alumni' || formData.role === 'student') && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.role === 'alumni' ? 'Graduation Year' : 'Current Year'}
                </label>
                {formData.role === 'alumni' ? (
                  <select
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select year</option>
                    {graduationYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                ) : (
                  <select
                    name="currentYear"
                    value={formData.currentYear}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course
                </label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select course</option>
                  {courses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`
                  w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                  ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                `}
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`
                  w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                  ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                `}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" color="white" />
            ) : (
              <>
                <UserPlus className="h-5 w-5" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;