import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Building, 
  Filter, 
  Search, 
  Bookmark,
  Share2,
  Calendar,
  GraduationCap,
  CheckCircle
} from 'lucide-react';

// Type definitions
interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary: string;
  posted: string;
  description: string;
  requirements: string[];
  benefits: string[];
  logo: string;
  featured: boolean;
  applicationDeadline?: string;
}

// interface FilterOptions {
//   jobType: string[];
//   location: string[];
//   category: string[];
// }

// Sample data
const mockJobs: Job[] = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'Google',
    location: 'Remote',
    type: 'full-time',
    salary: '$120,000 - $150,000',
    posted: '2 days ago',
    description: 'We are looking for a skilled Senior Software Engineer to join our dynamic team. You will be responsible for developing high-quality software solutions and contributing to all phases of the development lifecycle.',
    requirements: ['5+ years of software development experience', 'Proficiency in Java or Python', 'Experience with cloud platforms (AWS/GCP)', 'Strong problem-solving skills'],
    benefits: ['Health insurance', 'Flexible work hours', 'Remote work options', 'Professional development budget'],
    logo: 'https://logo.clearbit.com/google.com',
    featured: true
  },
  {
    id: 2,
    title: 'Marketing Intern',
    company: 'Microsoft',
    location: 'Redmond, WA',
    type: 'internship',
    salary: '$25 - $30/hour',
    posted: '1 week ago',
    description: 'Join our marketing team as an intern and gain hands-on experience in digital marketing strategies, campaign management, and market analysis.',
    requirements: ['Currently pursuing Marketing degree', 'Strong communication skills', 'Basic knowledge of SEO/SEM', 'Creative thinking'],
    benefits: ['Mentorship program', 'Networking opportunities', 'Potential full-time offer', 'Flexible schedule'],
    logo: 'https://logo.clearbit.com/microsoft.com',
    featured: false,
    applicationDeadline: '2023-12-15'
  },
  {
    id: 3,
    title: 'Product Manager',
    company: 'Amazon',
    location: 'Seattle, WA',
    type: 'full-time',
    salary: '$130,000 - $160,000',
    posted: '3 days ago',
    description: 'Lead product development initiatives and work with cross-functional teams to deliver innovative solutions that meet customer needs.',
    requirements: ['3+ years product management experience', 'Strong analytical skills', 'Experience with Agile methodologies', 'Excellent communication skills'],
    benefits: ['Stock options', 'Comprehensive benefits', 'Career growth opportunities', 'Relocation assistance'],
    logo: 'https://logo.clearbit.com/amazon.com',
    featured: true
  },
  {
    id: 4,
    title: 'Data Science Intern',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    type: 'internship',
    salary: '$35 - $45/hour',
    posted: '5 days ago',
    description: 'Work with our data science team to analyze user behavior and contribute to recommendation algorithms.',
    requirements: ['Pursuing degree in Data Science/Statistics', 'Python/R programming skills', 'Knowledge of machine learning', 'Strong analytical thinking'],
    benefits: ['Hands-on experience with big data', 'Mentorship from senior data scientists', 'Free lunch and snacks', 'Streaming subscription'],
    logo: 'https://logo.clearbit.com/netflix.com',
    featured: false,
    applicationDeadline: '2023-12-10'
  },
  {
    id: 5,
    title: 'UX/UI Designer',
    company: 'Apple',
    location: 'Cupertino, CA',
    type: 'full-time',
    salary: '$110,000 - $140,000',
    posted: '1 day ago',
    description: 'Create intuitive and beautiful user interfaces for our next-generation products and services.',
    requirements: ['4+ years UX/UI design experience', 'Proficiency in Figma/Sketch', 'Strong portfolio', 'Understanding of user-centered design'],
    benefits: ['Employee discount', 'Creative work environment', 'Health and wellness programs', 'Design conference budget'],
    logo: 'https://logo.clearbit.com/apple.com',
    featured: true
  },
  {
    id: 6,
    title: 'Business Development Associate',
    company: 'Tesla',
    location: 'Palo Alto, CA',
    type: 'full-time',
    salary: '$85,000 - $105,000',
    posted: '4 days ago',
    description: 'Identify new business opportunities and build relationships with potential partners in the sustainable energy sector.',
    requirements: ['2+ years business development experience', 'Strong negotiation skills', 'Knowledge of renewable energy market', 'Bachelor\'s degree in Business'],
    benefits: ['Stock options', 'Vehicle discount', 'Flexible work arrangements', 'Travel opportunities'],
    logo: 'https://logo.clearbit.com/tesla.com',
    featured: false
  }
];

const JobPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'internships'>('jobs');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    jobType: [] as string[],
    location: [] as string[],
    category: [] as string[]
  });

  const jobTypes = ['full-time', 'part-time', 'contract', 'internship'];
  const locations = ['Remote', 'New York, NY', 'San Francisco, CA', 'Seattle, WA', 'Chicago, IL', 'Austin, TX'];
  const categories = ['Engineering', 'Marketing', 'Design', 'Business', 'Data Science', 'Operations'];

  const filteredJobs = mockJobs.filter(job => {
    const matchesTab = activeTab === 'jobs' ? job.type !== 'internship' : job.type === 'internship';
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilters = (
      (filters.jobType.length === 0 || filters.jobType.includes(job.type)) &&
      (filters.location.length === 0 || filters.location.includes(job.location)) &&
      (filters.category.length === 0 || filters.category.some(cat => 
        job.title.toLowerCase().includes(cat.toLowerCase()) ||
        job.description.toLowerCase().includes(cat.toLowerCase())
      ))
    );

    return matchesTab && matchesSearch && matchesFilters;
  });

  const toggleFilter = (filterType: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const clearFilters = () => {
    setFilters({ jobType: [], location: [], category: [] });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Opportunities</h1>
              <p className="text-lg text-gray-600">
                Find your next job or internship through our alumni network
              </p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              Post a Job
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'jobs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Briefcase className="h-5 w-5 mr-2" />
              Jobs ({mockJobs.filter(job => job.type !== 'internship').length})
            </button>
            <button
              onClick={() => setActiveTab('internships')}
              className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'internships'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <GraduationCap className="h-5 w-5 mr-2" />
              Internships ({mockJobs.filter(job => job.type === 'internship').length})
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-5 w-5 mr-2 text-gray-400" />
              Filters
              {Object.values(filters).flat().length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {Object.values(filters).flat().length}
                </span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Job Type</h3>
                  <div className="space-y-2">
                    {jobTypes.map(type => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.jobType.includes(type)}
                          onChange={() => toggleFilter('jobType', type)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Location</h3>
                  <div className="space-y-2">
                    {locations.map(location => (
                      <label key={location} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.location.includes(location)}
                          onChange={() => toggleFilter('location', location)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{location}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Category</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.category.includes(category)}
                          onChange={() => toggleFilter('category', category)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'result' : 'results'}
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>

          {/* Jobs List */}
          <div className="space-y-6">
            {filteredJobs.map(job => (
              <div key={job.id} className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow ${
                job.featured ? 'border-2 border-blue-500' : 'border-gray-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="h-12 w-12 object-contain rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48';
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                        {job.featured && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-lg text-gray-600 mb-2">{job.company}</p>
                      
                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Briefcase className="h-4 w-4 mr-1" />
                          <span className="capitalize">{job.type}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {job.salary}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {job.posted}
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                      {job.applicationDeadline && (
                        <div className="flex items-center text-sm text-amber-600 mb-4">
                          <Calendar className="h-4 w-4 mr-1" />
                          Apply by {new Date(job.applicationDeadline).toLocaleDateString()}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.requirements.slice(0, 3).map((req, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {req.split(' ').slice(0, 3).join(' ')}...
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Bookmark className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-600">Alumni referral available</span>
                  </div>
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Save for Later
                    </button>
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeTab} found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Alumni Benefits Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Alumni Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Priority Consideration</h3>
              <p className="text-gray-600">Your application gets special attention from alumni recruiters</p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 mb-4">
                <Building className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Company Insights</h3>
              <p className="text-gray-600">Get insider information about companies from fellow alumni</p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 text-purple-600 mb-4">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Mentorship</h3>
              <p className="text-gray-600">Connect with alumni mentors for guidance and referrals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPortal;