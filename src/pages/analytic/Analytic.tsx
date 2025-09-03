import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  UserPlus,
  Eye,
  ClipboardList,
  BarChart3,
  Target
} from 'lucide-react';

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Mock data - in a real app, this would come from an API
  const dashboardData = {
    overview: {
      totalConnections: 247,
      totalEvents: 18,
      totalDonations: 12500,
      profileViews: 156
    },
    trends: {
      connections: { change: 12, isPositive: true },
      events: { change: 3, isPositive: true },
      donations: { change: -2, isPositive: false },
      engagement: { change: 8, isPositive: true }
    },
    recentActivity: [
      { id: 1, action: 'connection', user: 'Sarah Johnson', time: '2 hours ago' },
      { id: 2, action: 'donation', user: 'Michael Chen', amount: 500, time: '5 hours ago' },
      { id: 3, action: 'event', user: 'Alumni Association', event: 'Annual Gala', time: '1 day ago' },
      { id: 4, action: 'profile_view', user: 'Recruiter - Google', time: '2 days ago' }
    ],
    goals: {
      connections: { current: 247, target: 300 },
      events: { current: 18, target: 25 },
      donations: { current: 12500, target: 20000 }
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon,
    isCurrency = false 
  }: { 
    title: string; 
    value: number; 
    change?: number; 
    icon: React.ElementType;
    isCurrency?: boolean;
  }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        {change !== undefined && (
          <span className={`flex items-center text-sm font-medium ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">
        {isCurrency ? `$${value.toLocaleString()}` : value.toLocaleString()}
      </h3>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  );

  const ProgressBar = ({ current, target, label }: { current: number; target: number; label: string }) => {
    const percentage = Math.min((current / target) * 100, 100);
    return (
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{label}</span>
          <span>{current}/{target}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const ActivityIcon = ({ action }: { action: string }) => {
    switch (action) {
      case 'connection':
        return <UserPlus className="h-5 w-5 text-green-600" />;
      case 'donation':
        return <DollarSign className="h-5 w-5 text-blue-600" />;
      case 'event':
        return <Calendar className="h-5 w-5 text-purple-600" />;
      case 'profile_view':
        return <Eye className="h-5 w-5 text-amber-600" />;
      default:
        return <ClipboardList className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Insights</h1>
              <p className="text-lg text-gray-600">
                Track your alumni network engagement and impact
              </p>
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0">
              {(['week', 'month', 'year'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    timeRange === range
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Connections"
            value={dashboardData.overview.totalConnections}
            change={dashboardData.trends.connections.change}
            icon={Users}
          />
          <StatCard
            title="Events Attended"
            value={dashboardData.overview.totalEvents}
            change={dashboardData.trends.events.change}
            icon={Calendar}
          />
          <StatCard
            title="Total Donations"
            value={dashboardData.overview.totalDonations}
            change={dashboardData.trends.donations.change}
            icon={DollarSign}
            isCurrency={true}
          />
          <StatCard
            title="Profile Views"
            value={dashboardData.overview.profileViews}
            change={dashboardData.trends.engagement.change}
            icon={Eye}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Goals Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center mb-6">
                <Target className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Progress Goals</h2>
              </div>
              
              <ProgressBar
                current={dashboardData.goals.connections.current}
                target={dashboardData.goals.connections.target}
                label="Connections"
              />
              <ProgressBar
                current={dashboardData.goals.events.current}
                target={dashboardData.goals.events.target}
                label="Events"
              />
              <ProgressBar
                current={dashboardData.goals.donations.current}
                target={dashboardData.goals.donations.target}
                label="Donations ($)"
              />

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Tip:</span> Engage with 5 new connections this week to stay on track!
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                </div>
                <span className="text-sm text-gray-500">Last 30 days</span>
              </div>

              <div className="space-y-4">
                {dashboardData.recentActivity.map((item) => (
                  <div key={item.id} className="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg mr-4">
                      <ActivityIcon action={item.action} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        {item.action === 'connection' && <span><span className="font-semibold">{item.user}</span> connected with you</span>}
                        {item.action === 'donation' && <span><span className="font-semibold">{item.user}</span> donated ${item.amount?.toLocaleString()}</span>}
                        {item.action === 'event' && <span>New event: <span className="font-semibold">{item.event}</span></span>}
                        {item.action === 'profile_view' && <span><span className="font-semibold">{item.user}</span> viewed your profile</span>}
                      </p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 text-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All Activity →
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Engagement Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Network Growth</h3>
              <p className="text-2xl font-bold text-green-600">+12%</p>
              <p className="text-sm text-gray-600">From last month</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Event Participation</h3>
              <p className="text-2xl font-bold text-blue-600">75%</p>
              <p className="text-sm text-gray-600">Average attendance rate</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 text-purple-600 mb-4">
                <DollarSign className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Donation Impact</h3>
              <p className="text-2xl font-bold text-purple-600">$12.5K</p>
              <p className="text-sm text-gray-600">Total raised this year</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;