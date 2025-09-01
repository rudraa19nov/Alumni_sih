import React from 'react';
import { Calendar, Clock, MapPin, Users, ExternalLink } from 'lucide-react';
import { Event } from '../../types';

interface EventCardProps {
  event: Event;
  onRegister: (event: Event) => void;
  isRegistered?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, onRegister, isRegistered = false }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'networking': return 'bg-blue-100 text-blue-700';
      case 'workshop': return 'bg-emerald-100 text-emerald-700';
      case 'reunion': return 'bg-purple-100 text-purple-700';
      case 'webinar': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const isEventFull = event.maxAttendees ? event.currentAttendees >= event.maxAttendees : false;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <img
          src={event.imageUrl || 'https://images.pexels.com/photos/1181605/pexels-photo-1181605.jpeg?auto=compress&cs=tinysrgb&w=800'}
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getEventTypeColor(event.type)}`}>
            {event.type}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {event.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm">{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm">{event.time}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm">{event.location}</span>
          </div>
          {event.maxAttendees && (
            <div className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-sm">
                {event.currentAttendees} / {event.maxAttendees} attendees
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            Organized by {event.organizer}
          </span>
          {isRegistered ? (
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
              Registered
            </span>
          ) : (
            <button
              onClick={() => onRegister(event)}
              disabled={isEventFull}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1
                ${isEventFull 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                }
              `}
            >
              <ExternalLink className="h-4 w-4" />
              <span>{isEventFull ? 'Event Full' : 'Register'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;