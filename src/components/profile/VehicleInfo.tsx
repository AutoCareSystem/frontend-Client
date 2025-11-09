import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface VehicleInfoProps {
  userId: string;
  initialData?: {
    plateNumber: string;
    model: string;
    company: string;
    year: number;
    vin: string;
  } | null;
  onSaveSuccess?: () => void;
  onDeleteSuccess?: () => void;
}

const VehicleInfo: React.FC<VehicleInfoProps> = ({ userId, initialData, onSaveSuccess, onDeleteSuccess }) => {
  const [formData, setFormData] = useState({
    plateNumber: initialData?.plateNumber || '',
    model: initialData?.model || '',
    company: initialData?.company || '',
    year: initialData?.year || new Date().getFullYear(),
    vin: initialData?.vin || '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasVehicle, setHasVehicle] = useState(!!initialData);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setHasVehicle(true);
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) : value
    }));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');

    if (!formData.plateNumber || !formData.model || !formData.company || !formData.year) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      await axios.put(
        `/api/Profile/customer/${userId}/vehicle`,
        formData
      );

      setSuccess(hasVehicle ? 'Vehicle information updated successfully!' : 'Vehicle added successfully!');
      setHasVehicle(true);
      onSaveSuccess?.();
    } catch (err) {
      setError('Failed to save vehicle information. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    setError('');
    setSuccess('');
    setIsDeleting(true);

    try {
      await axios.delete(
        `/api/Profile/customer/${userId}/vehicle`
      );

      setSuccess('Vehicle deleted successfully!');
      setHasVehicle(false);
      setFormData({
        plateNumber: '',
        model: '',
        company: '',
        year: new Date().getFullYear(),
        vin: '',
      });
      onDeleteSuccess?.();
    } catch (err) {
      setError('Failed to delete vehicle. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {error && <div className="bg-red-900 text-red-200 p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-900 text-green-200 p-3 rounded mb-4">{success}</div>}

      <div className="space-y-4">
        {/* Plate Number */}
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-1">Plate Number *</label>
          <input
            type="text"
            name="plateNumber"
            value={formData.plateNumber}
            onChange={handleInputChange}
            className="w-full p-2 bg-[#1a1a1a] text-white rounded border border-gray-600 focus:border-red-500 focus:outline-none"
            placeholder="e.g., ABC-1234"
          />
        </div>

        {/* Model */}
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-1">Model *</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleInputChange}
            className="w-full p-2 bg-[#1a1a1a] text-white rounded border border-gray-600 focus:border-red-500 focus:outline-none"
            placeholder="e.g., Civic"
          />
        </div>

        {/* Company */}
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-1">Company *</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className="w-full p-2 bg-[#1a1a1a] text-white rounded border border-gray-600 focus:border-red-500 focus:outline-none"
            placeholder="e.g., Honda"
          />
        </div>

        {/* Year */}
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-1">Year *</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            className="w-full p-2 bg-[#1a1a1a] text-white rounded border border-gray-600 focus:border-red-500 focus:outline-none"
            placeholder={new Date().getFullYear().toString()}
            min="1900"
            max={new Date().getFullYear()}
          />
        </div>

        {/* VIN */}
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-1">VIN</label>
          <input
            type="text"
            name="vin"
            value={formData.vin}
            onChange={handleInputChange}
            className="w-full p-2 bg-[#1a1a1a] text-white rounded border border-gray-600 focus:border-red-500 focus:outline-none"
            placeholder="Vehicle Identification Number"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            {isLoading ? 'Saving...' : 'Save Vehicle'}
          </button>

          {hasVehicle && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 bg-red-900 hover:bg-red-950 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              {isDeleting ? 'Deleting...' : 'Delete Vehicle'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleInfo;
