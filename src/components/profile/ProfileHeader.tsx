import React from "react";
import type { UserInfo } from "../../types/profile.types";

interface ProfileHeaderProps {
  name: string;
  loyaltyPoints: number;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, loyaltyPoints }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-lg shadow-lg mb-6">
      <h1 className="text-3xl font-bold mb-2">Welcome, {name}!</h1>
      <div className="flex items-center">
        <span className="text-yellow-300 mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </span>
        <span className="text-xl">{loyaltyPoints} Loyalty Points</span>
      </div>
    </div>
  );
};

export default ProfileHeader;