import React, { useState } from 'react';
import axios from 'axios';
import { resetPassword } from '../../api/profile';

interface ChangePasswordFormProps {
  userId: string;
  onSuccess?: () => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ userId, onSuccess }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleChangePassword = async () => {
    setError('');
    setSuccess('');

    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('New password must be different from current password');
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(userId, {currentPassword: formData.currentPassword, newPassword: formData.newPassword});

      setSuccess('Password changed successfully!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswords({
        current: false,
        new: false,
        confirm: false,
      });
      onSuccess?.();
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Current password is incorrect');
      } else {
        setError('Failed to change password. Please try again.');
      }
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
        {/* Current Password */}
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-1">Current Password *</label>
          <div className="relative">
            <input
              type={showPasswords.current ? 'text' : 'password'}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className="w-full p-2 bg-[#1a1a1a] text-white rounded border border-gray-600 focus:border-red-500 focus:outline-none pr-10"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-2 text-gray-400 hover:text-gray-200"
            >
              {showPasswords.current ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-1">New Password *</label>
          <div className="relative">
            <input
              type={showPasswords.new ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="w-full p-2 bg-[#1a1a1a] text-white rounded border border-gray-600 focus:border-red-500 focus:outline-none pr-10"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-2 text-gray-400 hover:text-gray-200"
            >
              {showPasswords.new ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-1">Confirm New Password *</label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full p-2 bg-[#1a1a1a] text-white rounded border border-gray-600 focus:border-red-500 focus:outline-none pr-10"
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-2 text-gray-400 hover:text-gray-200"
            >
              {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        {/* Change Password Button */}
        <button
          onClick={handleChangePassword}
          disabled={isLoading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          {isLoading ? 'Changing Password...' : 'Change Password'}
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
