import React, { useState } from 'react';

// Type definitions
interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  earnedDate: string | null;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'engagement' | 'contribution' | 'achievement' | 'milestone';
}

interface ProgressItem {
  id: number;
  title: string;
  progress: number;
  target: number;
  unit: string;
  badgeReward: number | null;
}

interface FilterOption {
  id: string;
  label: string;
}

// Sample data
const mockBadges: Badge[] = [
  {
    id: 1,
    name: 'First Event',
    description: 'Attended your first alumni event',
    icon: '🎉',
    earnedDate: '2023-05-15',
    rarity: 'common',
    category: 'engagement'
  },
  {
    id: 2,
    name: 'Networking Pro',
    description: 'Connected with 50+ alumni members',
    icon: '🤝',
    earnedDate: '2023-08-22',
    rarity: 'rare',
    category: 'engagement'
  },
  {
    id: 3,
    name: 'Mentor',
    description: 'Mentored a current student',
    icon: '🧠',
    earnedDate: null,
    rarity: 'epic',
    category: 'contribution'
  },
  {
    id: 4,
    name: 'Fundraiser',
    description: 'Donated to the annual scholarship fund',
    icon: '💝',
    earnedDate: '2023-11-30',
    rarity: 'common',
    category: 'contribution'
  },
  {
    id: 5,
    name: 'Career Champion',
    description: 'Provided career opportunities to 5+ graduates',
    icon: '💼',
    earnedDate: null,
    rarity: 'legendary',
    category: 'achievement'
  },
  {
    id: 6,
    name: '5 Year Milestone',
    description: 'Reached 5 years as an alumnus',
    icon: '⭐',
    earnedDate: '2023-01-10',
    rarity: 'rare',
    category: 'milestone'
  },
  {
    id: 7,
    name: 'Event Organizer',
    description: 'Organized a successful alumni event',
    icon: '📋',
    earnedDate: null,
    rarity: 'epic',
    category: 'engagement'
  },
  {
    id: 8,
    name: 'Social Ambassador',
    description: 'Shared 10+ posts about alumni activities',
    icon: '📱',
    earnedDate: '2023-07-18',
    rarity: 'common',
    category: 'engagement'
  }
];

const mockProgress: ProgressItem[] = [
  {
    id: 1,
    title: 'Events Attended',
    progress: 7,
    target: 10,
    unit: 'events',
    badgeReward: 1
  },
  {
    id: 2,
    title: 'Alumni Connected',
    progress: 42,
    target: 50,
    unit: 'connections',
    badgeReward: 2
  },
  {
    id: 3,
    title: 'Mentorship Sessions',
    progress: 0,
    target: 1,
    unit: 'sessions',
    badgeReward: 3
  },
  {
    id: 4,
    title: 'Donation Streak',
    progress: 2,
    target: 3,
    unit: 'years',
    badgeReward: 4
  }
];

const filterOptions: FilterOption[] = [
  { id: 'all', label: 'All Badges' },
  { id: 'earned', label: 'Earned' },
  { id: 'not-earned', label: 'Not Earned' },
  { id: 'engagement', label: 'Engagement' },
  { id: 'contribution', label: 'Contribution' },
  { id: 'achievement', label: 'Achievement' },
  { id: 'milestone', label: 'Milestone' }
];

const rarityColors = {
  common: 'bg-gray-100 border-gray-300',
  rare: 'bg-blue-50 border-blue-200',
  epic: 'bg-purple-50 border-purple-200',
  legendary: 'bg-yellow-50 border-yellow-200'
};

const RewardsAndBadgesPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [stats] = useState({
    totalBadges: mockBadges.length,
    earnedBadges: mockBadges.filter(badge => badge.earnedDate !== null).length,
    completionPercentage: Math.round(
      (mockBadges.filter(badge => badge.earnedDate !== null).length / mockBadges.length) * 100
    )
  });

  const filteredBadges = mockBadges.filter(badge => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'earned') return badge.earnedDate !== null;
    if (activeFilter === 'not-earned') return badge.earnedDate === null;
    return badge.category === activeFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rewards & Badges</h1>
          <p className="text-lg text-gray-600">
            Celebrate your achievements and contributions to our alumni community
          </p>
        </div>

        {/* Stats Overview */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-4xl font-bold text-blue-700 mb-2">{stats.earnedBadges}</div>
              <div className="text-sm font-medium text-blue-600">Badges Earned</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-4xl font-bold text-purple-700 mb-2">{stats.totalBadges}</div>
              <div className="text-sm font-medium text-purple-600">Total Badges</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-4xl font-bold text-green-700 mb-2">{stats.completionPercentage}%</div>
              <div className="text-sm font-medium text-green-600">Collection Complete</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Progress Tracking */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Progress Tracking</h2>
              <div className="space-y-5">
                {mockProgress.map(item => (
                  <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-700">{item.title}</h3>
                      <span className="text-sm text-gray-500">
                        {item.progress}/{item.target} {item.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${(item.progress / item.target) * 100}%` }}
                      ></div>
                    </div>
                    {item.badgeReward && (
                      <p className="text-xs text-gray-500 mt-2">
                        Earn a badge at {item.target} {item.unit}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Achievements</h2>
              <div className="space-y-4">
                {mockBadges
                  .filter(badge => badge.earnedDate)
                  .sort((a, b) => new Date(b.earnedDate!).getTime() - new Date(a.earnedDate!).getTime())
                  .slice(0, 3)
                  .map(badge => (
                    <div key={badge.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-2xl bg-white rounded-full shadow-sm">
                        {badge.icon}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">{badge.name}</h3>
                        <p className="text-xs text-gray-500">
                          Earned on {new Date(badge.earnedDate!).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Right Column - Badge Collection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Your Badge Collection</h2>
                <div className="text-sm text-gray-500">
                  {stats.earnedBadges} of {stats.totalBadges} badges
                </div>
              </div>

              {/* Filter Options */}
              <div className="flex flex-wrap gap-2 mb-6">
                {filterOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setActiveFilter(option.id)}
                    className={`px-3 py-1.5 text-sm rounded-full ${
                      activeFilter === option.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Badge Grid */}
              {filteredBadges.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredBadges.map(badge => (
                    <div
                      key={badge.id}
                      className={`border rounded-lg p-4 flex flex-col items-center text-center ${
                        badge.earnedDate
                          ? rarityColors[badge.rarity]
                          : 'bg-gray-50 border-gray-200 opacity-70'
                      }`}
                    >
                      <div
                        className={`w-16 h-16 flex items-center justify-center text-3xl rounded-full mb-3 ${
                          badge.earnedDate ? 'bg-white' : 'bg-gray-100'
                        }`}
                      >
                        {badge.icon}
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">{badge.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                      <div className="mt-auto">
                        {badge.earnedDate ? (
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            Earned {new Date(badge.earnedDate).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                            Not earned yet
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="text-4xl mb-3">🎯</div>
                  <h3 className="font-medium text-gray-900 mb-1">No badges found</h3>
                  <p className="text-gray-600">Try selecting a different filter</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsAndBadgesPage;