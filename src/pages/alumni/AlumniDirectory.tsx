import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, MapPin, Building, Users, Heart, MessageCircle } from 'lucide-react';
import { Alumni, FilterOptions } from '../../types';
import { alumniAPI } from '../../utils/api';
import AlumniCard from '../../components/cards/AlumniCard';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';

const AlumniDirectory: React.FC = () => {
  const { user } = useAuth();
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [filteredAlumni, setFilteredAlumni] = useState<Alumni[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    year: undefined,
    course: '',
    company: '',
    location: ''
  });

  useEffect(() => {
    const loadAlumni = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await alumniAPI.getAlumni();
        
        // Handle different response structures
        const alumniData = response.data || response.alumni || [];
        
        if (Array.isArray(alumniData)) {
          setAlumni(alumniData);
          setFilteredAlumni(alumniData);
        } else {
          console.error('Invalid alumni data format:', alumniData);
          setError('Failed to load alumni data. Invalid format.');
        }
      } catch (error) {
        console.error('Failed to load alumni:', error);
        setError('Failed to load alumni. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadAlumni();
  }, []);

  useEffect(() => {
    let filtered = alumni;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(alum => {
        const fullName = `${alum.firstName || ''} ${alum.lastName || ''}`.toLowerCase();
        const company = alum.company?.toLowerCase() || '';
        const course = alum.course?.toLowerCase() || '';
        const location = alum.location?.toLowerCase() || '';
        
        return (
          fullName.includes(searchTerm.toLowerCase()) ||
          company.includes(searchTerm.toLowerCase()) ||
          course.includes(searchTerm.toLowerCase()) ||
          location.includes(searchTerm.toLowerCase())
        );
      });
    }

    // Year filter
    if (filters.year) {
      filtered = filtered.filter(alum => alum.graduationYear === filters.year);
    }

    // Course filter
    if (filters.course) {
      filtered = filtered.filter(alum => alum.course === filters.course);
    }

    // Company filter
    if (filters.company) {
      filtered = filtered.filter(alum => 
        alum.company?.toLowerCase().includes(filters.company!.toLowerCase())
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(alum => 
        alum.location?.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    setFilteredAlumni(filtered);
  }, [searchTerm, filters, alumni]);

  // Get unique values for filters with null safety
  const uniqueCourses = [...new Set(alumni.map(alum => alum.course).filter(Boolean))];
  const uniqueYears = [...new Set(alumni.map(alum => alum.graduationYear).filter(Boolean))].sort((a, b) => b - a);
  const uniqueCompanies = [...new Set(alumni.map(alum => alum.company).filter(Boolean))];
  const uniqueLocations = [...new Set(alumni.map(alum => alum.location).filter(Boolean))];

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      search: '',
      year: undefined,
      course: '',
      company: '',
      location: ''
    });
  };

  const handleSendMessage = (alumni: Alumni) => {
    // Implement message functionality
    console.log('Send message to:', alumni);
    // You would typically navigate to a chat page or open a message modal
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Alumni</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Alumni Directory</h1>
          <p className="text-gray-600">
            Connect with {alumni.length} alumni from our community
          </p>
        </div>

        {/* Search and filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search alumni by name, company, course, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-3 border rounded-lg transition-colors ${
                  showFilters 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>

              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter options */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Graduation Year
                  </label>
                  <select
                    value={filters.year || ''}
                    onChange={(e) => setFilters({ ...filters, year: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All years</option>
                    {uniqueYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course
                  </label>
                  <select
                    value={filters.course || ''}
                    onChange={(e) => setFilters({ ...filters, course: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All courses</option>
                    {uniqueCourses.map(course => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <select
                    value={filters.company || ''}
                    onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All companies</option>
                    {uniqueCompanies.map(company => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    value={filters.location || ''}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All locations</option>
                    {uniqueLocations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {filteredAlumni.length} of {alumni.length} alumni
            {searchTerm && ` for "${searchTerm}"`}
          </p>
          
          {filteredAlumni.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">View:</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Alumni grid/list */}
        {filteredAlumni.length > 0 ? (
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
            }
          `}>
            {filteredAlumni.map(alum => (
              <AlumniCard
                key={alum.id}
                alumni={alum}
                onViewProfile={setSelectedAlumni}
                showMentorshipOption={user?.role === 'student'}
                onMessage={handleSendMessage}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No alumni found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? `No results found for "${searchTerm}". Try different search terms.`
                : 'No alumni match your current filters.'
              }
            </p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Alumni Profile Modal */}
        {selectedAlumni && (
          <Modal
            isOpen={!!selectedAlumni}
            onClose={() => setSelectedAlumni(null)}
            title={`${selectedAlumni.firstName} ${selectedAlumni.lastName}`}
            size="lg"
          >
            <div className="space-y-6">
              <div className="flex items-start space-x-6">
                <img
                  src={selectedAlumni.profilePicture || '/api/placeholder/96/96'}
                  alt={`${selectedAlumni.firstName} ${selectedAlumni.lastName}`}
                  className="w-24 h-24 rounded-full object-cover bg-gray-200"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400';
                  }}
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {selectedAlumni.firstName} {selectedAlumni.lastName}
                  </h3>
                  <p className="text-blue-600 font-medium mb-4">
                    {selectedAlumni.course || 'Unknown Course'} • Class of {selectedAlumni.graduationYear || 'Unknown'}
                  </p>
                  
                  {selectedAlumni.company && selectedAlumni.position && (
                    <div className="flex items-center text-gray-600 mb-2">
                      <Building className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{selectedAlumni.position} at {selectedAlumni.company}</span>
                    </div>
                  )}

                  {selectedAlumni.location && (
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{selectedAlumni.location}</span>
                    </div>
                  )}

                  {selectedAlumni.mentorshipAvailable && (
                    <div className="inline-flex items-center bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium mt-2">
                      <Heart className="h-4 w-4 mr-1" />
                      Available for Mentorship
                    </div>
                  )}
                </div>
              </div>

              {selectedAlumni.bio && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">About</h4>
                  <p className="text-gray-600">{selectedAlumni.bio}</p>
                </div>
              )}

              {selectedAlumni.skills && selectedAlumni.skills.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Skills & Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAlumni.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedAlumni.achievements && selectedAlumni.achievements.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Achievements</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {selectedAlumni.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex space-x-4 pt-4 border-t border-gray-200">
                {selectedAlumni.linkedIn && (
                  <a
                    href={`https://linkedin.com/in/${selectedAlumni.linkedIn}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-center font-medium transition-colors flex items-center justify-center"
                  >
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                )}
                
                <button 
                  onClick={() => handleSendMessage(selectedAlumni)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Send Message
                </button>
                
                {user?.role === 'student' && selectedAlumni.mentorshipAvailable && (
                  <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Request Mentorship
                  </button>
                )}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default AlumniDirectory;