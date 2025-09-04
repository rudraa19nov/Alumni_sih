import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Briefcase, GraduationCap, Award, Filter, Search, ChevronUp, ExternalLink } from 'lucide-react';

// Type definitions
interface AlumniStory {
  id: number;
  name: string;
  graduationYear: number;
  degree: string;
  currentPosition: string;
  company: string;
  location: string;
  image: string;
  story: string;
  achievements: string[];
  tags: string[];
  publishedDate: string;
}

// Sample data
const mockStories: AlumniStory[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    graduationYear: 2015,
    degree: 'Computer Science',
    currentPosition: 'Senior Software Engineer',
    company: 'Google',
    location: 'San Francisco, CA',
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300',
    story: 'After graduating in 2015, Sarah joined a startup where she developed her skills in machine learning. Her work on natural language processing caught the attention of Google recruiters, and she now leads a team developing innovative AI solutions.',
    achievements: ['Published 5 research papers', 'Keynote speaker at AI Conference 2022', 'Founded TechWomen initiative'],
    tags: ['Technology', 'Leadership', 'Women in Tech'],
    publishedDate: '2023-09-15'
  },
  {
    id: 2,
    name: 'Michael Chen',
    graduationYear: 2010,
    degree: 'Business Administration',
    currentPosition: 'CEO',
    company: 'GreenTech Innovations',
    location: 'New York, NY',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
    story: 'Michael started his career in finance but always had a passion for sustainability. In 2015, he founded GreenTech Innovations, which develops renewable energy solutions. The company has since grown to over 200 employees and received numerous awards.',
    achievements: ['Forbes 30 Under 30', 'Green Business Award 2021', 'TEDx Speaker on Sustainability'],
    tags: ['Entrepreneurship', 'Sustainability', 'Finance'],
    publishedDate: '2023-08-22'
  },
  {
    id: 3,
    name: 'Priya Sharma',
    graduationYear: 2018,
    degree: 'Medicine',
    currentPosition: 'Medical Researcher',
    company: 'Mayo Clinic',
    location: 'Rochester, MN',
    image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=300',
    story: 'Dr. Sharma has been at the forefront of medical research, focusing on innovative treatments for rare diseases. Her groundbreaking work has been published in leading medical journals and has influenced treatment protocols worldwide.',
    achievements: ['Young Researcher Award 2022', 'Published in New England Journal of Medicine', 'Research Grant Recipient'],
    tags: ['Healthcare', 'Research', 'Medicine'],
    publishedDate: '2023-10-05'
  },
  {
    id: 4,
    name: 'David Martinez',
    graduationYear: 2012,
    degree: 'Electrical Engineering',
    currentPosition: 'CTO',
    company: 'Space Innovations Inc.',
    location: 'Los Angeles, CA',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
    story: 'David combined his passion for engineering and space exploration to co-found Space Innovations Inc. The company specializes in satellite technology and has launched over 50 satellites to date, with contracts from NASA and SpaceX.',
    achievements: ['NASA Innovation Award', 'Patent holder for satellite technology', 'Featured in TechCrunch'],
    tags: ['Engineering', 'Space Technology', 'Innovation'],
    publishedDate: '2023-07-30'
  },
  {
    id: 5,
    name: 'Emily Watson',
    graduationYear: 2016,
    degree: 'Journalism',
    currentPosition: 'Senior Correspondent',
    company: 'CNN',
    location: 'Washington, D.C.',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
    story: 'Emily began her career as a local news reporter and quickly rose through the ranks with her investigative journalism. Her coverage of international affairs has earned her several awards and recognition in the journalism community.',
    achievements: ['Pulitzer Prize Finalist', 'Emmy Award for Investigative Journalism', 'Author of bestselling book'],
    tags: ['Journalism', 'Media', 'Writing'],
    publishedDate: '2023-09-01'
  },
  {
    id: 6,
    name: 'James Wilson',
    graduationYear: 2008,
    degree: 'Architecture',
    currentPosition: 'Principal Architect',
    company: 'Wilson & Associates',
    location: 'Chicago, IL',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
    story: 'James established his own architecture firm in 2015, focusing on sustainable design. His projects have received LEED certifications and have been featured in architectural magazines worldwide.',
    achievements: ['AIA Design Award', 'Sustainable Architecture Prize', 'Featured in Architectural Digest'],
    tags: ['Architecture', 'Design', 'Sustainability'],
    publishedDate: '2023-08-10'
  },
  {
    id: 7,
    name: 'Lisa Zhang',
    graduationYear: 2017,
    degree: 'Graphic Design',
    currentPosition: 'Creative Director',
    company: 'Apple Inc.',
    location: 'Cupertino, CA',
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300',
    story: 'Lisa joined Apple as a junior designer and quickly made a name for herself with her innovative approach to user interface design. She now leads a team of designers working on next-generation products.',
    achievements: ['Apple Design Award 2021', 'Featured in Design Weekly', 'Keynote speaker at WWDC'],
    tags: ['Design', 'Technology', 'Innovation'],
    publishedDate: '2023-10-20'
  },
  {
    id: 8,
    name: 'Ryan Thompson',
    graduationYear: 2014,
    degree: 'Environmental Science',
    currentPosition: 'Conservation Director',
    company: 'World Wildlife Fund',
    location: 'Seattle, WA',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
    story: 'Ryan has dedicated his career to wildlife conservation, leading initiatives to protect endangered species across the globe. His work has been instrumental in establishing several new protected areas.',
    achievements: ['Environmental Leadership Award', 'National Geographic Explorer', 'Published 3 books on conservation'],
    tags: ['Conservation', 'Environment', 'Leadership'],
    publishedDate: '2023-09-30'
  },
  {
    id: 9,
    name: 'Maria Rodriguez',
    graduationYear: 2019,
    degree: 'Psychology',
    currentPosition: 'Clinical Psychologist',
    company: 'Harvard Medical School',
    location: 'Boston, MA',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
    story: 'Dr. Rodriguez specializes in trauma therapy and has developed innovative treatment methods that are now used in clinics worldwide. She also teaches at Harvard Medical School.',
    achievements: ['American Psychological Association Award', 'Developed new trauma therapy techniques', 'Best Selling Author'],
    tags: ['Psychology', 'Healthcare', 'Research'],
    publishedDate: '2023-10-15'
  }
];

const allTags = Array.from(new Set(mockStories.flatMap(story => story.tags)));

const AlumniSuccessStories: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [selectedStory, setSelectedStory] = useState<AlumniStory | null>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Add scroll event listener to show/hide scroll-to-top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const filteredStories = mockStories.filter(story => {
    const matchesFilter = activeFilter === 'all' || story.tags.includes(activeFilter);
    const matchesSearch = story.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.degree.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const openStoryModal = (story: AlumniStory) => {
    setSelectedStory(story);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeStoryModal = () => {
    setSelectedStory(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-6 group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Home
          </Link>
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
            <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Alumni Success Stories
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover inspiring journeys and achievements of our accomplished alumni community
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, degree, company, or tag..."
                className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center bg-gray-50 rounded-xl p-2">
              <Filter className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-700 mr-3 hidden sm:block">Filter by:</span>
              <select 
                className="border-0 bg-transparent rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredStories.length}</span> of <span className="font-semibold">{mockStories.length}</span> stories
          </p>
          {activeFilter !== 'all' && (
            <button 
              onClick={() => setActiveFilter('all')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredStories.map(story => (
            <div 
              key={story.id} 
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="relative">
                <img 
                  src={story.image} 
                  alt={story.name}
                  className="w-full h-52 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 shadow-sm">
                    Class of {story.graduationYear}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-gray-900 truncate">{story.name}</h2>
                    <p className="text-sm text-gray-500 truncate">{story.degree}</p>
                  </div>
                  <Award className="h-6 w-6 text-yellow-500 flex-shrink-0 ml-2" />
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                    <span className="truncate">{story.currentPosition} at {story.company}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                    <span className="truncate">{story.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                    <span>Published {new Date(story.publishedDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-3 text-sm leading-relaxed">{story.story}</p>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                    <Award className="h-4 w-4 mr-1 text-yellow-500" />
                    Key Achievements:
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1 pl-2">
                    {story.achievements.slice(0, 2).map((achievement, index) => (
                      <li key={index} className="flex">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-5">
                  {story.tags.map(tag => (
                    <span 
                      key={tag} 
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        tag === activeFilter 
                          ? 'bg-blue-100 text-blue-800 ring-1 ring-blue-500' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                      onClick={() => setActiveFilter(tag)}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <button 
                  onClick={() => openStoryModal(story)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center"
                >
                  Read Full Story
                  <ExternalLink className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredStories.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
            <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No stories found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Try adjusting your search or filter criteria to find what you're looking for
            </p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Scroll to top button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-10"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
        )}

        {/* Story Modal */}
        {selectedStory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <img 
                  src={selectedStory.image} 
                  alt={selectedStory.name}
                  className="w-full h-64 object-cover"
                />
                <button 
                  onClick={closeStoryModal}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute bottom-4 right-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 shadow-sm">
                    Class of {selectedStory.graduationYear}
                  </span>
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{selectedStory.name}</h2>
                    <p className="text-lg text-gray-500">{selectedStory.degree}</p>
                  </div>
                  <Award className="h-8 w-8 text-yellow-500 flex-shrink-0" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex items-center text-gray-700">
                    <Briefcase className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Position</p>
                      <p>{selectedStory.currentPosition} at {selectedStory.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <MapPin className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p>{selectedStory.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Published</p>
                      <p>{new Date(selectedStory.publishedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start text-gray-700">
                    <Award className="h-5 w-5 mr-3 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Achievements</p>
                      <p>{selectedStory.achievements.length} notable achievements</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Success Story</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedStory.story}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Achievements</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 pl-2">
                    {selectedStory.achievements.map((achievement, index) => (
                      <li key={index} className="pl-2">{achievement}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStory.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button 
                  onClick={closeStoryModal}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl transition-colors duration-200"
                >
                  Close Story
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniSuccessStories;