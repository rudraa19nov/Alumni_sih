import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  DollarSign, 
  Plus, 
  TrendingUp, 
  Heart, 
  Calendar,
  CreditCard,
  Users,
  Gift
} from 'lucide-react';
import { Donation } from '../../types';
import { donationsAPI } from '../../utils/api';
import Modal from '../../components/common/Modal';
import Notification from '../../components/common/Notification';

const DonationsPage: React.FC = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    isVisible: boolean;
  }>({ type: 'success', message: '', isVisible: false });

  const [newDonation, setNewDonation] = useState({
    amount: '',
    purpose: '',
    isRecurring: false,
    frequency: '',
    message: '',
    isAnonymous: false
  });

  useEffect(() => {
    const loadDonations = async () => {
      try {
        const response = await donationsAPI.getDonations();
        if (response.success) {
          setDonations(response.data);
        }
      } catch (error) {
        console.error('Failed to load donations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDonations();
  }, []);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newDonation.amount || !newDonation.purpose) {
      setNotification({
        type: 'error',
        message: 'Please fill in all required fields',
        isVisible: true
      });
      return;
    }

    try {
      const response = await donationsAPI.createDonation({
        ...newDonation,
        amount: parseFloat(newDonation.amount),
        donorId: user?.id,
        donorName: newDonation.isAnonymous ? undefined : `${user?.firstName} ${user?.lastName}`
      });

      if (response.success) {
        setDonations(prev => [response.data, ...prev]);
        setNewDonation({
          amount: '',
          purpose: '',
          isRecurring: false,
          frequency: '',
          message: '',
          isAnonymous: false
        });
        setShowDonateModal(false);
        setNotification({
          type: 'success',
          message: 'Thank you for your generous donation!',
          isVisible: true
        });
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to process donation. Please try again.',
        isVisible: true
      });
    }
  };

  const totalDonated = donations
    .filter(d => d.donorId === user?.id)
    .reduce((sum, d) => sum + d.amount, 0);

  const totalRaised = donations.reduce((sum, d) => sum + d.amount, 0);

  const stats = [
    {
      title: user?.role === 'admin' ? 'Total Raised' : 'Your Contributions',
      value: user?.role === 'admin' ? `$${totalRaised.toLocaleString()}` : `$${totalDonated.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Total Donors',
      value: new Set(donations.map(d => d.donorId)).size.toString(),
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'This Month',
      value: `$${donations
        .filter(d => new Date(d.createdAt).getMonth() === new Date().getMonth())
        .reduce((sum, d) => sum + d.amount, 0)
        .toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ];

  const donationPurposes = [
    'Scholarship Fund',
    'Infrastructure Development',
    'Student Activities',
    'Faculty Development',
    'Research Programs',
    'General Fund'
  ];

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Donations</h1>
            <p className="text-gray-600">
              Support your alma mater and help future generations succeed
            </p>
          </div>
          {(user?.role === 'alumni' || user?.role === 'admin') && (
            <button
              onClick={() => setShowDonateModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Heart className="h-5 w-5" />
              <span>Make Donation</span>
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Donations list */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Donations</h2>
          
          <div className="space-y-4">
            {donations.map(donation => (
              <div key={donation.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Gift className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {donation.isAnonymous ? 'Anonymous Donor' : donation.donorName}
                      </h3>
                      <p className="text-sm text-gray-600">{donation.purpose}</p>
                      {donation.message && (
                        <p className="text-sm text-gray-500 italic mt-1">"{donation.message}"</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">
                      ${donation.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </p>
                    {donation.isRecurring && (
                      <span className="inline-block mt-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        {donation.frequency}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {donations.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No donations yet</h3>
              <p className="text-gray-600">Be the first to support your alma mater!</p>
            </div>
          )}
        </div>

        {/* Donation Modal */}
        <Modal
          isOpen={showDonateModal}
          onClose={() => setShowDonateModal(false)}
          title="Make a Donation"
          size="lg"
        >
          <form onSubmit={handleDonate} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Amount *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    id="amount"
                    min="1"
                    step="0.01"
                    value={newDonation.amount}
                    onChange={(e) => setNewDonation({ ...newDonation, amount: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose *
                </label>
                <select
                  id="purpose"
                  value={newDonation.purpose}
                  onChange={(e) => setNewDonation({ ...newDonation, purpose: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select purpose</option>
                  {donationPurposes.map(purpose => (
                    <option key={purpose} value={purpose}>{purpose}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                id="message"
                rows={3}
                value={newDonation.message}
                onChange={(e) => setNewDonation({ ...newDonation, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Leave a message with your donation..."
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isRecurring"
                  checked={newDonation.isRecurring}
                  onChange={(e) => setNewDonation({ ...newDonation, isRecurring: e.target.checked })}
                  className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="isRecurring" className="ml-2 text-sm text-gray-700">
                  Make this a recurring donation
                </label>
              </div>

              {newDonation.isRecurring && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency
                  </label>
                  <select
                    value={newDonation.frequency}
                    onChange={(e) => setNewDonation({ ...newDonation, frequency: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select frequency</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAnonymous"
                  checked={newDonation.isAnonymous}
                  onChange={(e) => setNewDonation({ ...newDonation, isAnonymous: e.target.checked })}
                  className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="isAnonymous" className="ml-2 text-sm text-gray-700">
                  Make this donation anonymous
                </label>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">Donation Summary</h4>
              <div className="space-y-1 text-sm text-green-700">
                <p>Amount: ${newDonation.amount || '0'}</p>
                <p>Purpose: {newDonation.purpose || 'Not selected'}</p>
                {newDonation.isRecurring && (
                  <p>Frequency: {newDonation.frequency || 'Not selected'}</p>
                )}
                <p>Anonymous: {newDonation.isAnonymous ? 'Yes' : 'No'}</p>
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setShowDonateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <CreditCard className="h-5 w-5" />
                <span>Donate ${newDonation.amount || '0'}</span>
              </button>
            </div>
          </form>
        </Modal>

        <Notification
          type={notification.type}
          message={notification.message}
          isVisible={notification.isVisible}
          onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
        />
      </div>
    </div>
  );
};

export default DonationsPage;