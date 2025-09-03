import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';


import { 
  Users, 
  Calendar, 
  MessageCircle, 
  DollarSign, 
  // TrendingUp, 
  Award,
  Building,
  Medal,
  Heart,
  ExternalLink
} from 'lucide-react';
import { eventsAPI, mentorshipAPI, donationsAPI } from '../../utils/api';
import { Event, MentorshipRequest, Donation } from '../../types';

const AlumniDashboard: React.FC = () => {
  const { user } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([]);
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [eventsRes, mentorshipRes, donationsRes] = await Promise.all([
          eventsAPI.getEvents(),
          mentorshipAPI.getMentorshipRequests(),
          donationsAPI.getDonations()
        ]);

        if (eventsRes.success) {
          setUpcomingEvents(eventsRes.data.slice(0, 3));
        }
        if (mentorshipRes.success) {
          setMentorshipRequests(mentorshipRes.data.filter(req => req.mentorId === user?.id));
        }
        if (donationsRes.success) {
          setRecentDonations(donationsRes.data.filter(d => d.donorId === user?.id));
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
      title: 'Events Registered',
      value: '5',
      icon: Calendar,
      color: 'bg-blue-500',
      change: '+2 this month'
    },
    {
      title: 'Mentorship Requests',
      value: mentorshipRequests.length.toString(),
      icon: MessageCircle,
      color: 'bg-emerald-500',
      change: `${mentorshipRequests.filter(r => r.status === 'pending').length} pending`
    },
    {
      title: 'Total Donations',
      value: `$${recentDonations.reduce((sum, d) => sum + d.amount, 0)}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      change: 'This year'
    },
    {
      title: 'Network Connections',
      value: '127',
      icon: Users,
      color: 'bg-orange-500',
      change: '+12 this month'
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
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening in your alumni network today.
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
                    {/* <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {event.time}
                    </span> */}
                  </div>
                </div>
              ))}
              {upcomingEvents.length === 0 && (
                <p className="text-gray-500 text-center py-4">No upcoming events</p>
              )}
            </div>
          </div>

          {/* Mentorship Overview */}
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
                Manage
                <ExternalLink className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-4">
              {mentorshipRequests.slice(0, 3).map(request => (
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
              {mentorshipRequests.length === 0 && (
                <p className="text-gray-500 text-center py-4">No mentorship requests</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/profile"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all"
            >
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Update Profile</h3>
                <p className="text-sm text-gray-600">Keep your information current</p>
              </div>
            </Link>

            <Link
              to="/donations"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all"
            >
              <div className="bg-purple-100 p-2 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Make Donation</h3>
                <p className="text-sm text-gray-600">Support your alma mater</p>
              </div>
            </Link>

            <Link
              to="/alumni"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 transition-all"
            >
              <div className="bg-blue-100 p-2 rounded-lg">
               <Award className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Browse Alumni</h3>
                <p className="text-sm text-gray-600">Connect with fellow graduates</p>
              </div>
            </Link>

             <Link
              to="/success"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 transition-all"
            >
              <div className="bg-emerald-100 p-2 rounded-lg">
               <Medal className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Success Stories</h3>
                <p className="text-sm text-gray-600">Journey that inspires you</p>
              </div>
            </Link>

               <Link
              to="/feedback"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 transition-all"
            >
              <div className="bg-emerald-100 p-2 rounded-lg">
              <MessageCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Feedback</h3>
                <p className="text-sm text-gray-600">Give you favorable feedback</p>
              </div>
            </Link>

          </div>
        </div>
            {/* Additional */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
              to="/job"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 transition-all"
            >
              <div className="bg-blue-100 p-2 rounded-lg">
                <Building className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Job & Internship Portal</h3>
                <p className="text-sm text-gray-600">Discover exclusive jobs, internships, and alumni referrals.</p>
              </div>
            </Link>


          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniDashboard;