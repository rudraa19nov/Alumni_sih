import React from 'react';
import { MapPin, Building, Calendar, ExternalLink, Heart, MessageCircle } from 'lucide-react';
import { Alumni } from '../../types';

interface AlumniCardProps {
  alumni: Alumni;
  onViewProfile: (alumni: Alumni) => void;
  onRequestMentorship?: (alumni: Alumni) => void;
  showMentorshipOption?: boolean;
}

const AlumniCard: React.FC<AlumniCardProps> = ({ 
  alumni, 
  onViewProfile, 
  onRequestMentorship,
  showMentorshipOption = false 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <img
          src={alumni.profilePicture || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'}
          alt={`${alumni.firstName} ${alumni.lastName}`}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {alumni.mentorshipAvailable && (
          <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <Heart className="h-3 w-3" />
            <span>Mentor</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {alumni.firstName} {alumni.lastName}
            </h3>
            <p className="text-blue-600 font-medium text-sm">{alumni.course}</p>
          </div>
          <span className="text-gray-500 text-sm flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {alumni.graduationYear}
          </span>
        </div>

        {alumni.company && (
          <div className="flex items-center text-gray-600 mb-2">
            <Building className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="text-sm">{alumni.position} at {alumni.company}</span>
          </div>
        )}

        {alumni.bio && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{alumni.bio}</p>
        )}

        {alumni.skills && alumni.skills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {alumni.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
              {alumni.skills.length > 3 && (
                <span className="text-gray-500 text-xs">+{alumni.skills.length - 3} more</span>
              )}
            </div>
          </div>
        )}

        <div className="flex space-x-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => onViewProfile(alumni)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
          >
            <ExternalLink className="h-4 w-4" />
            <span>View Profile</span>
          </button>
          {showMentorshipOption && alumni.mentorshipAvailable && onRequestMentorship && (
            <button
              onClick={() => onRequestMentorship(alumni)}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Request Mentorship</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlumniCard;