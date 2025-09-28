import React from "react";
import { Car, Plus, Check, Calendar, Wrench } from "lucide-react";
import type { Vehicle } from "../../types";
import { Link } from "react-router-dom";

interface VehicleSelectionProps {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  onVehicleSelect: (vehicle: Vehicle) => void;
  isLoading?: boolean;
}

const VehicleSelection: React.FC<VehicleSelectionProps> = ({
  vehicles,
  selectedVehicle,
  onVehicleSelect,
  isLoading = false,
}) => {
  const formatYear = (year: number) => {
    return year.toString();
  };

  const formatMileage = (mileage: number) => {
    return mileage.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          Select Your Vehicle
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 animate-pulse"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="h-6 bg-gray-200 rounded w-32"></div>
                <div className="h-5 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-8">
        <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No vehicles registered
        </h3>
        <p className="text-gray-500 mb-4">Add a vehicle to book a service</p>
        <Link
          to="/vehicles/add"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Select Your Vehicle
        </h3>
        <Link
          to="/vehicles/add"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 font-medium"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Vehicle
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              selectedVehicle?.id === vehicle.id
                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
            }`}
            onClick={() => onVehicleSelect(vehicle)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Car className="h-5 w-5 text-gray-600" />
                <h4 className="font-medium text-gray-900">
                  {vehicle.make} {vehicle.model}
                </h4>
              </div>
              <span className="text-sm text-gray-500">
                {formatYear(vehicle.year)}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="font-medium">VIN:</span>
                <span className="font-mono">{vehicle.vin}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="font-medium">License:</span>
                <span className="font-mono">{vehicle.licensePlate}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="font-medium">Color:</span>
                <span className="capitalize">{vehicle.color}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Wrench className="h-4 w-4" />
                <span>{formatMileage(vehicle.mileage)} miles</span>
              </div>

              {selectedVehicle?.id === vehicle.id && (
                <div className="flex items-center text-blue-600">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleSelection;
