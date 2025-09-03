import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, MessageCircle, ThumbsUp, ThumbsDown, Send, Smile, Frown, Meh } from 'lucide-react';

const FeedbackPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('suggestion');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    anonymous: false
  });

  const feedbackCategories = [
    { id: 'suggestion', label: 'Suggestion', icon: MessageCircle },
    { id: 'compliment', label: 'Compliment', icon: ThumbsUp },
    { id: 'issue', label: 'Report Issue', icon: ThumbsDown },
    { id: 'testimonial', label: 'Testimonial', icon: Star }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Feedback submitted:', { ...formData, rating, category: activeCategory });
    alert('Thank you for your feedback! We appreciate your input.');
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '', anonymous: false });
    setRating(0);
  };

  const renderSmiley = (index: number) => {
    if (index <= 2) return <Frown className="h-8 w-8" />;
    if (index === 3) return <Meh className="h-8 w-8" />;
    return <Smile className="h-8 w-8" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Share Your Feedback</h1>
          <p className="text-lg text-gray-600">
            We value your input! Help us improve the alumni experience.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          {/* Feedback Categories */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">What type of feedback would you like to share?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {feedbackCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                      activeCategory === category.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rating Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">How would you rate your overall experience?</h2>
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((index) => (
                  <button
                    key={index}
                    onClick={() => setRating(index)}
                    onMouseEnter={() => setHoverRating(index)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="flex flex-col items-center transition-transform hover:scale-110"
                  >
                    <div className={`p-2 rounded-full ${
                      (hoverRating || rating) >= index 
                        ? 'bg-yellow-100 text-yellow-500' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {renderSmiley(index)}
                    </div>
                    <span className="text-xs mt-1 text-gray-600">{index}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-600">
                {rating === 0 ? 'Select a rating' : 
                 rating <= 2 ? 'Poor' : 
                 rating === 3 ? 'Average' : 
                 rating === 4 ? 'Good' : 'Excellent'}
              </span>
            </div>
          </div>

          {/* Feedback Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief summary of your feedback"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Your Feedback
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Please share your detailed feedback, suggestions, or experience..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="anonymous"
                name="anonymous"
                checked={formData.anonymous}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
                Submit anonymously
              </label>
            </div>

            <button
              type="submit"
              disabled={!formData.message || (!formData.anonymous && !formData.name && !formData.email)}
              className="w-full md:w-auto flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5 mr-2" />
              Submit Feedback
            </button>
          </form>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">How is my feedback used?</h3>
              <p className="text-gray-600">Your feedback helps us improve the alumni platform, events, and services. We regularly review suggestions and implement the most requested features.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Will my feedback be anonymous?</h3>
              <p className="text-gray-600">If you select the anonymous option, your personal information will not be shared. Otherwise, we may follow up with you for clarification.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">When can I expect a response?</h3>
              <p className="text-gray-600">We try to respond to all feedback within 3-5 business days. For urgent issues, please contact our support team directly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;