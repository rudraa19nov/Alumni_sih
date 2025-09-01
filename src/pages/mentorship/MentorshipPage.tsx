import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Heart, 
  Plus, 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  XCircle,
  User,
  Calendar
} from 'lucide-react';
import { MentorshipRequest } from '../../types';
import { mentorshipAPI } from '../../utils/api';
import Modal from '../../components/common/Modal';
import Notification from '../../components/common/Notification';

const MentorshipPage: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    isVisible: boolean;
  }>({ type: 'success', message: '', isVisible: false });

  const [newRequest, setNewRequest] = useState({
    subject: '',
    message: '',
    goals: '',
    duration: ''
  });

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const response = await mentorshipAPI.getMentorshipRequests(user?.id);
        if (response.success) {
          setRequests(response.data);
        }
      } catch (error) {
        console.error('Failed to load mentorship requests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, [user?.id]);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newRequest.subject.trim() || !newRequest.message.trim()) {
      setNotification({
        type: 'error',
        message: 'Please fill in all required fields',
        isVisible: true
      });
      return;
    }

    try {
      const response = await mentorshipAPI.createMentorshipRequest({
        ...newRequest,
        studentId: user?.id
      });

      if (response.success) {
        setRequests(prev => [response.data, ...prev]);
        setNewRequest({ subject: '', message: '', goals: '', duration: '' });
        setShowCreateModal(false);
        setNotification({
          type: 'success',
          message: 'Mentorship request submitted successfully!',
          isVisible: true
        });
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to submit request. Please try again.',
        isVisible: true
      });
    }
  };

  const handleUpdateRequest = async (id: string, status: string) => {
    try {
      const response = await mentorshipAPI.updateMentorshipRequest(id, { status });
      if (response.success) {
        setRequests(prev => prev.map(req => 
          req.id === id ? { ...req, status } : req
        ));
        setNotification({
          type: 'success',
          message: `Request ${status} successfully!`,
          isVisible: true
        });
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to update request. Please try again.',
        isVisible: true
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'approved': return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'active': return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'completed': return <CheckCircle className="h-5 w-5 text-gray-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'active': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mentorship</h1>
            <p className="text-gray-600">
              {user?.role === 'student' 
                ? 'Connect with experienced alumni for career guidance'
                : 'Help students achieve their career goals'
              }
            </p>
          </div>
          {user?.role === 'student' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Request Mentorship</span>
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Mentorships</p>
                <p className="text-2xl font-bold text-gray-900">
                  {requests.filter(r => r.status === 'active').length}
                </p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg">
                <Heart className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending Reviews</p>
                <p className="text-2xl font-bold text-gray-900">
                  {requests.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Requests list */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {user?.role === 'student' ? 'My Mentorship Requests' : 'Mentorship Requests'}
          </h2>
          
          <div className="space-y-4">
            {requests.map(request => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{request.subject}</h3>
                    <p className="text-gray-600 mb-3">{request.message}</p>
                    
                    {request.goals && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Goals:</h4>
                        <p className="text-sm text-gray-600">{request.goals}</p>
                      </div>
                    )}

                    {request.duration && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Duration:</h4>
                        <p className="text-sm text-gray-600">{request.duration}</p>
                      </div>
                    )}

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Created: {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        Student ID: {request.studentId}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-3">
                    <div className={`
                      flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium
                      ${getStatusColor(request.status)}
                    `}>
                      {getStatusIcon(request.status)}
                      <span className="capitalize">{request.status}</span>
                    </div>

                    {user?.role === 'alumni' && request.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdateRequest(request.id, 'approved')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateRequest(request.id, 'rejected')}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {requests.length === 0 && (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No mentorship requests</h3>
              <p className="text-gray-600">
                {user?.role === 'student' 
                  ? 'Start by creating your first mentorship request'
                  : 'No pending mentorship requests at this time'
                }
              </p>
            </div>
          )}
        </div>

        {/* Create Request Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Request Mentorship"
          size="lg"
        >
          <form onSubmit={handleCreateRequest} className="space-y-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                value={newRequest.subject}
                onChange={(e) => setNewRequest({ ...newRequest, subject: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="e.g., Career Guidance in Software Development"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                rows={4}
                value={newRequest.message}
                onChange={(e) => setNewRequest({ ...newRequest, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Describe what you're looking for in a mentor and why you'd like their guidance..."
                required
              />
            </div>

            <div>
              <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-2">
                Goals
              </label>
              <textarea
                id="goals"
                rows={3}
                value={newRequest.goals}
                onChange={(e) => setNewRequest({ ...newRequest, goals: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="What do you hope to achieve through this mentorship?"
              />
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Duration
              </label>
              <select
                id="duration"
                value={newRequest.duration}
                onChange={(e) => setNewRequest({ ...newRequest, duration: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Select duration</option>
                <option value="1 month">1 month</option>
                <option value="3 months">3 months</option>
                <option value="6 months">6 months</option>
                <option value="1 year">1 year</option>
                <option value="Ongoing">Ongoing</option>
              </select>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Submit Request
              </button>
            </div>
          </form>
        </Modal>

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

export default MentorshipPage;