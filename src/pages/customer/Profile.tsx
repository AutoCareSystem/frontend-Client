import React, { useEffect, useState } from 'react';
import { profileService } from '../../api/profileService';
import type { CustomerProfile } from '../../types/profile.types';
import ProfileHeader from '../../components/profile/ProfileHeader';
import UserInfoCard from '../../components/profile/UserInfoCard';
import VehicleCard from '../../components/profile/VehicleCard';
import ServiceHistory from '../../components/profile/ServiceHistory';
import Projects from '../../components/profile/Projects';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get userId from localStorage
  const userId = parseInt(localStorage.getItem('userId') || '0');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile(userId);
      setProfile(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={loadProfile}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">No profile found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader 
        name={profile.user.name} 
        loyaltyPoints={profile.user.loyaltyPoints} 
      />
      <div className="grid grid-cols-1 gap-6">
        <UserInfoCard 
          userInfo={profile.user} 
          onUpdate={loadProfile} 
        />
        <VehicleCard 
          vehicle={profile.vehicle}
          userId={profile.user.userID}
          onUpdate={loadProfile}
        />
        <ServiceHistory 
          history={profile.serviceHistory} 
        />
        <Projects 
          projects={profile.projects} 
        />
      </div>
    </div>
  );
};

export default ProfilePage;