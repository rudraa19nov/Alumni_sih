import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, MapPin, Building } from 'lucide-react';
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
  
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    year: undefined,
    course: '',
    company: ''
  });

  useEffect(() => {
    const loadAlumni = async () => {
      try {
        const response = await alumniAPI.getAlumni();
        if (response.success) {
          setAlumni(response.data);
          setFilteredAlumni(response.data);
        }
      } catch (error) {
        console.error('Failed to load alumni:', error);
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
      filtered = filtered.filter(alum =>
        `${alum.firstName} ${alum.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alum.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alum.course.toLowerCase().includes(searchTerm.toLowerCase())
      );
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

    setFilteredAlumni(filtered);
  }, [searchTerm, filters, alumni]);

  const uniqueCourses = [...new Set(alumni.map(alum => alum.course))];
  const uniqueYears = [...new Set(alumni.map(alum => alum.graduationYear))].sort((a, b) => b - a);

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      search: '',
      year: undefined,
      course: '',
      company: ''
    });
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
                placeholder="Search alumni by name, company, or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>

              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter options */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <input
                    type="text"
                    placeholder="Filter by company"
                    value={filters.company || ''}
                    onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
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
          </p>
        </div>

        {/* Alumni grid/list */}
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
            />
          ))}
        </div>

        {filteredAlumni.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No alumni found</h3>
            <p className="text-gray-600">Try adjusting your search criteria.</p>
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
                  src={selectedAlumni.profilePicture || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={`${selectedAlumni.firstName} ${selectedAlumni.lastName}`}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {selectedAlumni.firstName} {selectedAlumni.lastName}
                  </h3>
                  <p className="text-blue-600 font-medium mb-4">{selectedAlumni.course} • Class of {selectedAlumni.graduationYear}</p>
                  
                  {selectedAlumni.company && (
                    <div className="flex items-center text-gray-600 mb-2">
                      <Building className="h-4 w-4 mr-2" />
                      <span>{selectedAlumni.position} at {selectedAlumni.company}</span>
                    </div>
                  )}

                  {selectedAlumni.mentorshipAvailable && (
                    <div className="inline-flex items-center bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
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
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-center font-medium transition-colors"
                  >
                    Connect on LinkedIn
                  </a>
                )}
                {user?.role === 'student' && selectedAlumni.mentorshipAvailable && (
                  <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
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