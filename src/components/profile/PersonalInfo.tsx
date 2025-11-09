import React, { useState, useEffect } from 'react';
import { updateCutomerProfile } from '../../api/profile';

interface PersonalInfoProps {
  userId: string;
  initialData?: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  onSaveSuccess?: () => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ userId, initialData, onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await updateCutomerProfile(userId, {userName: formData.name, phoneNumber: formData.phone, address: formData.address});
      setSuccess('Personal information updated successfully!');
      onSaveSuccess?.();
    } catch (err) {
      setError('Failed to update personal information. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="bg-red-900 text-red-200 p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-900 text-green-200 p-3 rounded mb-4">{success}</div>}

      <div className="space-y-4">
        {/* Name - Editable */}
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 bg-[#1a1a1a] text-white rounded border border-gray-600 focus:border-red-500 focus:outline-none"
            placeholder="Enter your name"
          />
        </div>

        {/* Email - Display Only */}
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            disabled
            className="w-full p-2 bg-[#1a1a1a] text-gray-500 rounded border border-gray-600 cursor-not-allowed"
          />
        </div>

        {/* Phone - Editable */}
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full p-2 bg-[#1a1a1a] text-white rounded border border-gray-600 focus:border-red-500 focus:outline-none"
            placeholder="Enter your phone number"
          />
        </div>

        {/* Address - Editable */}
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full p-2 bg-[#1a1a1a] text-white rounded border border-gray-600 focus:border-red-500 focus:outline-none"
            placeholder="Enter your address"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default PersonalInfo;
