import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Briefcase, GraduationCap, Award, Filter, Search } from 'lucide-react';

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
  }
];

const allTags = Array.from(new Set(mockStories.flatMap(story => story.tags)));

const AlumniSuccessStories: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredStories = mockStories.filter(story => {
    const matchesFilter = activeFilter === 'all' || story.tags.includes(activeFilter);
    const matchesSearch = story.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.degree.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Alumni Success Stories</h1>
          <p className="text-lg text-gray-600">
            Discover inspiring journeys and achievements of our accomplished alumni
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, degree, company, or tag..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700 mr-2">Filter:</span>
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
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

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map(story => (
            <div key={story.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img 
                  src={story.image} 
                  alt={story.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Class of {story.graduationYear}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{story.name}</h2>
                    <p className="text-sm text-gray-500">{story.degree}</p>
                  </div>
                  <Award className="h-6 w-6 text-yellow-500 flex-shrink-0" />
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="h-4 w-4 mr-2" />
                    {story.currentPosition} at {story.company}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {story.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Published {new Date(story.publishedDate).toLocaleDateString()}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-3">{story.story}</p>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Key Achievements:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {story.achievements.slice(0, 2).map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {story.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Read Full Story
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredStories.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stories found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniSuccessStories;