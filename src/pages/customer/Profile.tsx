import React, { useEffect, useState } from 'react';
import { profileService } from '../../api/profileService';
import type { CustomerProfile } from '../../types/profile.types';
import ProfileHeader from '../../components/profile/ProfileHeader';
import UserInfoCard from '../../components/profile/UserInfoCard';
import VehicleCard from '../../components/profile/VehicleCard';
import ServiceHistory from '../../components/profile/ServiceHistory';
import Projects from '../../components/profile/Projects';

import Sidebar from "../../components/Sidebar";

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const loadProfile = async () => {
    if (!userId) {
      setError('No userId available. Please sign in.');
      return;
    }
    
    try {
      setLoading(true);
      const data = await profileService.getProfile(parseInt(userId));
      setProfile(data);
      setError(null);
    } catch (err: any) {
      if (err?.response) {
        const status = err.response.status;
        const body = err.response.data;
        setError(`Request failed: ${status} - ${typeof body === 'string' ? body : JSON.stringify(body).slice(0,1000)}`);
      } else {
        setError(err?.message || 'Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  function getUserIdFromToken(): string | null {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      const id = payload.userId ?? payload.userID ?? payload.sub ?? payload.nameid ?? null;
      return id == null ? null : String(id);
    } catch {
      return null;
    }
  }

  useEffect(() => {
    let mounted = true;
    const uidFromStorage = localStorage.getItem('userId');
    const uid = uidFromStorage ? uidFromStorage : getUserIdFromToken();
    
    console.log('User ID from storage:', uidFromStorage);
    console.log('User ID from token:', getUserIdFromToken());
    console.log('Access token:', localStorage.getItem('accessToken'));
    
    if (!uid) {
      setError('No userId available. Please sign in.');
      return;
    }
    setUserId(uid);

    const initialLoad = async () => {
      try {
        setLoading(true);
        const data = await profileService.getProfile(parseInt(uid));
        if (!mounted) return;
        setProfile(data);
        setError(null);
      } catch (err: any) {
        if (!mounted) return;
        // Surface detailed server error when available to help debug auth/redirects
        if (err?.response) {
          const status = err.response.status;
          const body = err.response.data;
          setError(`Request failed: ${status} - ${typeof body === 'string' ? body : JSON.stringify(body).slice(0,1000)}`);
        } else {
          setError(err?.message || 'Failed to load profile');
        }
        // expose token presence in console for quick debugging
        console.debug('accessToken present:', !!localStorage.getItem('accessToken'));
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    initialLoad();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
        <Sidebar role="customer" />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
        <Sidebar role="customer" />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">Error</div>
            <p className="text-gray-400">{error}</p>
            <button
              onClick={loadProfile}
              className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
        <Sidebar role="customer" />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400">No profile found</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
      <Sidebar role="customer" />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-red-500 mb-6">My Profile</h1>
        <div className="space-y-6">
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
      </main>
    </div>
  );
};

export default ProfilePage;