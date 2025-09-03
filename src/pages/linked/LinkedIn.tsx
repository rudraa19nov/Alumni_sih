import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Linkedin, 
  Download, 
  Users, 
  Briefcase, 
  BookOpen, 
  CheckCircle,
  RefreshCw,
  Shield,
  Globe,
  FileText,
  Calendar,
  Mail,
  MapPin
} from 'lucide-react';

const LinkedInIntegration: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connected' | 'importing'>('disconnected');
  const [importedData, setImportedData] = useState<any>(null);
  const [selectedSections, setSelectedSections] = useState({
    profile: true,
    experience: true,
    education: true,
    connections: false,
    skills: true
  });

  const handleConnect = () => {
    setConnectionStatus('importing');
    // Simulate API connection and data import
    setTimeout(() => {
      setConnectionStatus('connected');
      setImportedData({
        profile: {
          name: 'Sarah Johnson',
          headline: 'Senior Software Engineer at Google',
          location: 'San Francisco, California',
          industry: 'Computer Software',
          summary: 'Experienced software engineer with 5+ years in web development...'
        },
        experience: [
          {
            title: 'Senior Software Engineer',
            company: 'Google',
            duration: '2020 - Present',
            description: 'Developing innovative AI solutions...'
          },
          {
            title: 'Software Engineer',
            company: 'Microsoft',
            duration: '2018 - 2020',
            description: 'Worked on cloud infrastructure...'
          }
        ],
        education: [
          {
            school: 'Stanford University',
            degree: 'M.S. Computer Science',
            duration: '2016 - 2018'
          },
          {
            school: 'University of California',
            degree: 'B.S. Computer Science',
            duration: '2012 - 2016'
          }
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
        connections: 500
      });
    }, 2000);
  };

  const handleDisconnect = () => {
    setConnectionStatus('disconnected');
    setImportedData(null);
  };

  const handleImport = () => {
    // Handle the actual import of selected data
    alert('Profile data imported successfully!');
  };

  const toggleSection = (section: string) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/profile" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LinkedIn Integration</h1>
          <p className="text-lg text-gray-600">
            Import your professional profile and expand your alumni network
          </p>
        </div>

        {/* Connection Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <Linkedin className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Connect Your LinkedIn Account</h2>
                <p className="text-gray-600">Import your professional information with one click</p>
              </div>
            </div>
            
            {connectionStatus === 'disconnected' && (
              <button
                onClick={handleConnect}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center"
              >
                <Linkedin className="h-5 w-5 mr-2" />
                Connect LinkedIn
              </button>
            )}
            
            {connectionStatus === 'importing' && (
              <button
                disabled
                className="bg-blue-400 text-white px-6 py-3 rounded-lg font-medium flex items-center"
              >
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Connecting...
              </button>
            )}
            
            {connectionStatus === 'connected' && (
              <button
                onClick={handleDisconnect}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium flex items-center"
              >
                <Linkedin className="h-5 w-5 mr-2" />
                Disconnect
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-green-600 mr-2" />
              <span>Secure OAuth 2.0 connection</span>
            </div>
            <div className="flex items-center">
              <Globe className="h-4 w-4 text-blue-600 mr-2" />
              <span>Read-only access</span>
            </div>
            <div className="flex items-center">
              <Download className="h-4 w-4 text-purple-600 mr-2" />
              <span>One-time import</span>
            </div>
          </div>
        </div>

        {connectionStatus === 'connected' && importedData && (
          <>
            {/* Data Selection Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Data to Import</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">Profile Information</h3>
                      <p className="text-sm text-gray-600">Name, headline, summary</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSections.profile}
                      onChange={() => toggleSection('profile')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">Work Experience</h3>
                      <p className="text-sm text-gray-600">Current and past positions</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSections.experience}
                      onChange={() => toggleSection('experience')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-purple-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">Education</h3>
                      <p className="text-sm text-gray-600">Degrees and institutions</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSections.education}
                      onChange={() => toggleSection('education')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-amber-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">Skills</h3>
                      <p className="text-sm text-gray-600">Professional skills</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSections.skills}
                      onChange={() => toggleSection('skills')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <button
                onClick={handleImport}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Import Selected Data
              </button>
            </div>

            {/* Preview Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Preview Imported Data</h2>
              
              <div className="border border-gray-200 rounded-lg p-6">
                {/* Profile Preview */}
                <div className="flex items-start mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-blue-600">SJ</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{importedData.profile.name}</h3>
                    <p className="text-gray-600">{importedData.profile.headline}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {importedData.profile.location}
                      </span>
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {importedData.connections}+ connections
                      </span>
                    </div>
                  </div>
                </div>

                {/* Experience Preview */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Briefcase className="h-5 w-5 text-green-600 mr-2" />
                    Experience
                  </h4>
                  {importedData.experience.slice(0, 2).map((exp: any, index: number) => (
                    <div key={index} className="ml-7 mb-3">
                      <p className="font-medium text-gray-900">{exp.title}</p>
                      <p className="text-gray-600">{exp.company}</p>
                      <p className="text-sm text-gray-500">{exp.duration}</p>
                    </div>
                  ))}
                </div>

                {/* Education Preview */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <BookOpen className="h-5 w-5 text-purple-600 mr-2" />
                    Education
                  </h4>
                  {importedData.education.map((edu: any, index: number) => (
                    <div key={index} className="ml-7 mb-3">
                      <p className="font-medium text-gray-900">{edu.school}</p>
                      <p className="text-gray-600">{edu.degree}</p>
                      <p className="text-sm text-gray-500">{edu.duration}</p>
                    </div>
                  ))}
                </div>

                {/* Skills Preview */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <CheckCircle className="h-5 w-5 text-amber-600 mr-2" />
                    Skills
                  </h4>
                  <div className="ml-7 flex flex-wrap gap-2">
                    {importedData.skills.slice(0, 5).map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                      >
                        {skill}
                      </span>
                    ))}
                    {importedData.skills.length > 5 && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        +{importedData.skills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Benefits Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Benefits of Connecting</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Expand Your Network</h3>
                <p className="text-gray-600">Connect with alumni who work at your target companies</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Career Opportunities</h3>
                <p className="text-gray-600">Discover job opportunities through alumni referrals</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <RefreshCw className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Keep Profile Updated</h3>
                <p className="text-gray-600">Automatically sync your latest professional achievements</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                <Shield className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Privacy Protected</h3>
                <p className="text-gray-600">Your data is secure and never shared without permission</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInIntegration;