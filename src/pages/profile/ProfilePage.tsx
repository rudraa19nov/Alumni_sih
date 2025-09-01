import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  Mail, 
  Building, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save, 
  X,
  Camera,
  ExternalLink,
  Award
} from 'lucide-react';
import { validateProfileForm } from '../../utils/validation';
import Notification from '../../components/common/Notification';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    isVisible: boolean;
  }>({ type: 'success', message: '', isVisible: false });

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    bio: user?.bio || '',
    company: user?.company || '',
    position: user?.position || '',
    linkedIn: user?.linkedIn || '',
    skills: user?.skills ? user.skills.join(', ') : ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const validation = validateProfileForm(formData);
    setErrors(validation.errors);

    if (!validation.isValid) return;

    try {
      const updates = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      };

      updateUser(updates);
      setIsEditing(false);
      setNotification({
        type: 'success',
        message: 'Profile updated successfully!',
        isVisible: true
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to update profile. Please try again.',
        isVisible: true
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      bio: user?.bio || '',
      company: user?.company || '',
      position: user?.position || '',
      linkedIn: user?.linkedIn || '',
      skills: user?.skills ? user.skills.join(', ') : ''
    });
    setIsEditing(false);
    setErrors({});
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Edit3 className="h-5 w-5" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <X className="h-5 w-5" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Save className="h-5 w-5" />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Cover photo and profile picture */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="absolute bottom-0 left-8 transform translate-y-1/2">
              <div className="relative">
                <img
                  src={user.profilePicture || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white object-cover"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile content */}
          <div className="pt-16 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                      ) : (
                        <p className="text-gray-900 py-3">{user.firstName}</p>
                      )}
                      {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                      ) : (
                        <p className="text-gray-900 py-3">{user.lastName}</p>
                      )}
                      {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 py-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900">{user.email}</span>
                      </div>
                    )}
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Course
                      </label>
                      <div className="flex items-center space-x-2 py-3">
                        <Award className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900">{user.course}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {user.role === 'alumni' ? 'Graduation Year' : 'Current Year'}
                      </label>
                      <div className="flex items-center space-x-2 py-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900">
                          {user.role === 'alumni' ? user.graduationYear : `Year ${(user as any).currentYear}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-700 py-3">{user.bio || 'No bio provided'}</p>
                  )}
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Information</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Your current company"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 py-3">
                        <Building className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900">{user.company || 'Not specified'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your job title"
                      />
                    ) : (
                      <p className="text-gray-900 py-3">{user.position || 'Not specified'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn Username
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <ExternalLink className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="linkedIn"
                          value={formData.linkedIn}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.linkedIn ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="your-linkedin-username"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 py-3">
                        <ExternalLink className="h-5 w-5 text-gray-400" />
                        {user.linkedIn ? (
                          <a
                            href={`https://linkedin.com/in/${user.linkedIn}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            linkedin.com/in/{user.linkedIn}
                          </a>
                        ) : (
                          <span className="text-gray-500">Not connected</span>
                        )}
                      </div>
                    )}
                    {errors.linkedIn && <p className="mt-1 text-sm text-red-600">{errors.linkedIn}</p>}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills & Expertise
                  </label>
                  {isEditing ? (
                    <textarea
                      name="skills"
                      rows={3}
                      value={formData.skills}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js)"
                    />
                  ) : (
                    <div className="py-3">
                      {user.skills && user.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {user.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">No skills listed</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Account Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Role</span>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium capitalize">
                        {user.role}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Member since</span>
                      <span className="text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-600">Profile completion</span>
                      <span className="text-emerald-600 font-medium">85%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Notification
          type={notification.type}
          message={notification.message}
          isVisible={notification.isVisible}
          onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
        />
      </div>
    </div>
  );
};

export default ProfilePage;