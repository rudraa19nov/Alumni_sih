import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  UserCheck, 
  Activity,
  BarChart3,
  PieChart
} from 'lucide-react';
import { alumniAPI, eventsAPI, donationsAPI } from '../../utils/api';
import { Alumni, Event, Donation } from '../../types';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [alumniRes, eventsRes, donationsRes] = await Promise.all([
          alumniAPI.getAlumni(),
          eventsAPI.getEvents(),
          donationsAPI.getDonations()
        ]);

        if (alumniRes.success) setAlumni(alumniRes.data);
        if (eventsRes.success) setEvents(eventsRes.data);
        if (donationsRes.success) setDonations(donationsRes.data);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalEventAttendees = events.reduce((sum, e) => sum + e.currentAttendees, 0);

  const stats = [
    {
      title: 'Total Alumni',
      value: alumni.length.toString(),
      icon: Users,
      color: 'bg-blue-500',
      change: '+12 this month'
    },
    {
      title: 'Active Events',
      value: events.length.toString(),
      icon: Calendar,
      color: 'bg-emerald-500',
      change: `${totalEventAttendees} total attendees`
    },
    {
      title: 'Total Donations',
      value: `$${totalDonations.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      change: `${donations.length} donations`
    },
    {
      title: 'Platform Growth',
      value: '+15%',
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: 'vs last month'
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
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor and manage the AlumniConnect platform.
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
          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                Recent Activities
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full">
                  <UserCheck className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New Alumni Registration</p>
                  <p className="text-xs text-gray-500">Alice Johnson joined the platform</p>
                </div>
                <span className="text-xs text-gray-400">2 hours ago</span>
              </div>

              <div className="flex items-center space-x-4 p-3 bg-emerald-50 rounded-lg">
                <div className="bg-emerald-100 p-2 rounded-full">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Event Registration</p>
                  <p className="text-xs text-gray-500">15 new registrations for Tech Workshop</p>
                </div>
                <span className="text-xs text-gray-400">4 hours ago</span>
              </div>

              <div className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg">
                <div className="bg-purple-100 p-2 rounded-full">
                  <DollarSign className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New Donation</p>
                  <p className="text-xs text-gray-500">$500 donation for Scholarship Fund</p>
                </div>
                <span className="text-xs text-gray-400">1 day ago</span>
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Star className="h-5 w-5 mr-2 text-orange-600" />
                Top Contributors
              </h2>
            </div>
            <div className="space-y-4">
              {alumni.slice(0, 3).map((alumnus, index) => (
                <div key={alumnus.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex-shrink-0">
                    <img
                      src={alumnus.profilePicture || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100'}
                      alt={`${alumnus.firstName} ${alumnus.lastName}`}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {alumnus.firstName} {alumnus.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{alumnus.company}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white
                      ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'}
                    `}>
                      {index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Management Tools */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Management Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/alumni"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all"
            >
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Manage Alumni</h3>
                <p className="text-sm text-gray-600">View and edit profiles</p>
              </div>
            </Link>

            <Link
              to="/events"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 transition-all"
            >
              <div className="bg-emerald-100 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Manage Events</h3>
                <p className="text-sm text-gray-600">Create and organize</p>
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
                <h3 className="font-medium text-gray-900">Track Donations</h3>
                <p className="text-sm text-gray-600">Monitor contributions</p>
              </div>
            </Link>

            <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all cursor-pointer">
              <div className="bg-orange-100 p-2 rounded-lg">
                <BarChart3 className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Analytics</h3>
                <p className="text-sm text-gray-600">View reports</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;