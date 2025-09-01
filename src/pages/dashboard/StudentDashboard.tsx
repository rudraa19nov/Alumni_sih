import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Heart, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Star,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { eventsAPI, mentorshipAPI } from '../../utils/api';
import { Event, MentorshipRequest } from '../../types';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [myMentorshipRequests, setMyMentorshipRequests] = useState<MentorshipRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [eventsRes, mentorshipRes] = await Promise.all([
          eventsAPI.getEvents(),
          mentorshipAPI.getMentorshipRequests(user?.id)
        ]);

        if (eventsRes.success) {
          setUpcomingEvents(eventsRes.data.slice(0, 3));
        }
        if (mentorshipRes.success) {
          setMyMentorshipRequests(mentorshipRes.data);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.id]);

  const stats = [
    {
      title: 'Events Attended',
      value: '3',
      icon: Calendar,
      color: 'bg-blue-500',
      change: '+1 this month'
    },
    {
      title: 'Mentorship Requests',
      value: myMentorshipRequests.length.toString(),
      icon: MessageCircle,
      color: 'bg-emerald-500',
      change: `${myMentorshipRequests.filter(r => r.status === 'pending').length} pending`
    },
    {
      title: 'Alumni Connections',
      value: '24',
      icon: Users,
      color: 'bg-purple-500',
      change: '+6 this month'
    },
    {
      title: 'Career Score',
      value: '85%',
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+5% this week'
    }
  ];

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
        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hello {user?.firstName}!
          </h1>
          <p className="text-gray-600">
            Ready to advance your career and connect with amazing alumni?
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Upcoming Events
              </h2>
              <Link
                to="/events"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                View all
                <ExternalLink className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map(event => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <h3 className="font-medium text-gray-900 mb-2">{event.title}</h3>
                  <div className="flex items-center text-gray-600 text-sm space-x-4">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {event.currentAttendees} attending
                    </span>
                  </div>
                </div>
              ))}
              {upcomingEvents.length === 0 && (
                <p className="text-gray-500 text-center py-4">No upcoming events</p>
              )}
            </div>
          </div>

          {/* Mentorship Status */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Heart className="h-5 w-5 mr-2 text-emerald-600" />
                Mentorship
              </h2>
              <Link
                to="/mentorship"
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center"
              >
                View all
                <ExternalLink className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-4">
              {myMentorshipRequests.slice(0, 3).map(request => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-1">{request.subject}</h3>
                  <p className="text-gray-600 text-sm mb-2">{request.message}</p>
                  <div className="flex items-center justify-between">
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium capitalize
                      ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                        request.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                        'bg-gray-100 text-gray-700'}
                    `}>
                      {request.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              {myMentorshipRequests.length === 0 && (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No mentorship requests yet</p>
                  <Link
                    to="/mentorship"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Find a Mentor
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/alumni"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all"
            >
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Browse Alumni</h3>
                <p className="text-sm text-gray-600">Find and connect</p>
              </div>
            </Link>

            <Link
              to="/mentorship"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 transition-all"
            >
              <div className="bg-emerald-100 p-2 rounded-lg">
                <Heart className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Find Mentor</h3>
                <p className="text-sm text-gray-600">Get career guidance</p>
              </div>
            </Link>

            <Link
              to="/events"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all"
            >
              <div className="bg-purple-100 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Join Events</h3>
                <p className="text-sm text-gray-600">Network and learn</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;