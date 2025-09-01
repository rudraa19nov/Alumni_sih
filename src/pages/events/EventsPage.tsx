import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Plus, Filter, Search } from 'lucide-react';
import { Event } from '../../types';
import { eventsAPI } from '../../utils/api';
import EventCard from '../../components/cards/EventCard';
import Notification from '../../components/common/Notification';

const EventsPage: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    isVisible: boolean;
  }>({ type: 'success', message: '', isVisible: false });

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await eventsAPI.getEvents();
        if (response.success) {
          setEvents(response.data);
          setFilteredEvents(response.data);
        }
      } catch (error) {
        console.error('Failed to load events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  useEffect(() => {
    let filtered = events;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (selectedType) {
      filtered = filtered.filter(event => event.type === selectedType);
    }

    setFilteredEvents(filtered);
  }, [searchTerm, selectedType, events]);

  const handleEventRegistration = async (event: Event) => {
    if (!user) return;

    try {
      const response = await eventsAPI.registerForEvent(event.id, user.id);
      if (response.success) {
        setNotification({
          type: 'success',
          message: `Successfully registered for ${event.title}!`,
          isVisible: true
        });
        
        // Update local state
        setEvents(prev => prev.map(e => 
          e.id === event.id 
            ? { ...e, currentAttendees: e.currentAttendees + 1, registeredUsers: [...e.registeredUsers, user.id] }
            : e
        ));
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to register for event. Please try again.',
        isVisible: true
      });
    }
  };

  const eventTypes = ['networking', 'workshop', 'reunion', 'webinar'];

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
            <p className="text-gray-600">
              Discover and register for upcoming alumni events
            </p>
          </div>
          {user?.role === 'admin' && (
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Create Event</span>
            </button>
          )}
        </div>

        {/* Search and filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Type filter */}
            <div className="lg:w-48">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All types</option>
                {eventTypes.map(type => (
                  <option key={type} value={type} className="capitalize">
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Events grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onRegister={handleEventRegistration}
              isRegistered={event.registeredUsers.includes(user?.id || '')}
            />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">Try adjusting your search criteria.</p>
          </div>
        )}

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

export default EventsPage;