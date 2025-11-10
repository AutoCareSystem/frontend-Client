import React, { useState } from "react";
import type { VehicleInfo, UpdateVehicleRequest } from "../../types/profile.types";
import { profileService } from "../../api/profileService";

interface VehicleCardProps {
  vehicle: VehicleInfo | null;
  userId: number;
  onUpdate: () => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, userId, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateVehicleRequest>({
    model: vehicle?.model || "",
    year: vehicle?.year || "",
    vin: vehicle?.vin || "",
    plateNumber: vehicle?.plateNumber || "",
    company: vehicle?.company || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await profileService.updateVehicle(userId, formData);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      alert("Failed to update vehicle information");
    } finally {
      setSaving(false);
    }
  };

  if (!vehicle && !isEditing) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Vehicle Information</h2>
        <p className="text-gray-600 mb-4">No vehicle information added yet.</p>
        <button
          onClick={() => setIsEditing(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Vehicle
        </button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-bold mb-4">{vehicle ? "Edit Vehicle" : "Add Vehicle"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Model</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">VIN</label>
              <input
                type="text"
                value={formData.vin}
                onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Plate Number</label>
              <input
                type="text"
                value={formData.plateNumber}
                onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {saving ? "Saving..." : "Save Vehicle"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Vehicle Information</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Edit Vehicle
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-500">Model</label>
          <p className="mt-1">{vehicle?.model}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">Year</label>
          <p className="mt-1">{vehicle?.year}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">VIN</label>
          <p className="mt-1">{vehicle?.vin}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">Plate Number</label>
          <p className="mt-1">{vehicle?.plateNumber}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">Company</label>
          <p className="mt-1">{vehicle?.company || "Not provided"}</p>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;