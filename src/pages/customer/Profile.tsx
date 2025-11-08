import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Car, Lock } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import PersonalInfo from '../../components/profile/PersonalInfo';
import VehicleInfo from '../../components/profile/VehicleInfo';
import ChangePasswordForm from '../../components/profile/ChangePasswordForm';
import { getCustomerProfile } from '../../api/profile';

export interface ProfileData {
  userId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  loyaltyPoints: number;
  vehicle?: {
    plateNumber: string;
    model: string;
    company: string;
    year: number;
    vin: string;
  } | null;
}

type TabType = 'personal' | 'vehicle' | 'password';

export default function CustomerProfile() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('personal');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Get user ID from token or local storage
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        setIsLoading(false);
        return;
      }

      // Decode token to get user ID (basic JWT decoding)
      let userId = '';
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.userId || payload.sub || payload.id || payload.userID;
        console.log('Decoded userId from token:', userId);
      } catch (e) {
        console.error('Failed to decode token:', e);
        userId = localStorage.getItem('userId') || '';
      }

      if (!userId) {
        setError('Could not identify user. Please log in again.');
        setIsLoading(false);
        return;
      }
      const response = await getCustomerProfile(userId);
      setProfileData({
         ...response,
      });
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      
      // Show more detailed error message
      if (err.response?.data?.message) {
        setError(`Server error: ${err.response.data.message}`);
      } else if (err.response?.status === 404) {
        setError('Profile not found. Please ensure your account is set up correctly.');
      } else if (err.response?.status === 401) {
        setError('Unauthorized. Please log in again.');
      } else {
        setError('Failed to load profile data. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'personal' as TabType, label: 'Personal Information', icon: User },
    { id: 'vehicle' as TabType, label: 'Vehicle Information', icon: Car },
    { id: 'password' as TabType, label: 'Change Password', icon: Lock },
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
        <Sidebar role="Customer" />
        <main className="flex-1 p-8 overflow-y-auto flex items-center justify-center">
          <div className="text-gray-400">Loading profile...</div>
        </main>
      </div>
    );
  }

  if (error && !profileData) {
    return (
      <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
        <Sidebar role="Customer" />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="bg-red-900 text-red-200 p-4 rounded-lg">{error}</div>
          <button
            onClick={fetchProfileData}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
          >
            Retry
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
      <Sidebar role="Customer" />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-red-500 mb-8">My Profile</h1>

          {error && !isLoading && (
            <div className="bg-red-900 text-red-200 p-4 rounded-lg mb-6 border border-red-700">{error}</div>
          )}

          {profileData && (
            <div>
              {/* Tabs Navigation */}
              <div className="flex gap-2 mb-8 border-b border-gray-700">
                {tabs.map((tab) => {
                  const TabIcon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all border-b-2 ${
                        isActive
                          ? 'border-red-500 text-red-500'
                          : 'border-transparent text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      <TabIcon size={20} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="bg-[#2a2a2a] p-8 rounded-xl border border-gray-700">
                {/* Personal Information Tab */}
                {activeTab === 'personal' && (
                  <PersonalInfo
                    userId={profileData.userId}
                    initialData={{
                      name: profileData.name,
                      email: profileData.email,
                      phone: profileData.phone,
                      address: profileData.address,
                    }}
                    onSaveSuccess={fetchProfileData}
                  />
                )}

                {/* Vehicle Information Tab */}
                {activeTab === 'vehicle' && (
                  <VehicleInfo
                    userId={profileData.userId}
                    initialData={profileData.vehicle}
                    onSaveSuccess={fetchProfileData}
                    onDeleteSuccess={fetchProfileData}
                  />
                )}

                {/* Change Password Tab */}
                {activeTab === 'password' && (
                  <ChangePasswordForm onSuccess={fetchProfileData} />
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}