import { useState, useEffect } from "react";
import { MapPin, Phone, Clock, AlertCircle, CheckCircle } from "lucide-react";

interface Location {
  latitude: number;
  longitude: number;
  address: string;
  timestamp: string;
}

interface TrackingStatus {
  id: string;
  serviceName: string;
  status: "arrived" | "in-progress" | "completed" | "delayed";
  progress: number;
  location: Location;
  estimatedTime: string;
  technicianName: string;
  technicianPhone: string;
}

export default function RealTimeTracking() {
  const [trackingData, setTrackingData] = useState<TrackingStatus[]>([
    {
      id: "1",
      serviceName: "Engine Overhaul",
      status: "in-progress",
      progress: 65,
      location: {
        latitude: 40.7128,
        longitude: -74.006,
        address: "123 Main St, New York, NY",
        timestamp: new Date().toLocaleTimeString(),
      },
      estimatedTime: "45 mins",
      technicianName: "John Smith",
      technicianPhone: "+1-555-0123",
    },
    {
      id: "2",
      serviceName: "Brake Replacement",
      status: "arrived",
      progress: 25,
      location: {
        latitude: 40.726,
        longitude: -74.01,
        address: "456 Oak Ave, New York, NY",
        timestamp: new Date().toLocaleTimeString(),
      },
      estimatedTime: "2 hours",
      technicianName: "Sarah Johnson",
      technicianPhone: "+1-555-0124",
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrackingData((prev) =>
        prev.map((item) => ({
          ...item,
          progress: Math.min(item.progress + Math.random() * 5, 100),
          location: {
            ...item.location,
            timestamp: new Date().toLocaleTimeString(),
          },
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500 bg-green-500/10";
      case "in-progress":
        return "text-blue-500 bg-blue-500/10";
      case "arrived":
        return "text-yellow-500 bg-yellow-500/10";
      case "delayed":
        return "text-red-500 bg-red-500/10";
      default:
        return "text-gray-500 bg-gray-500/10";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={24} />;
      case "delayed":
        return <AlertCircle size={24} />;
      default:
        return <Clock size={24} />;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-red-500 mb-6">
        Real-Time Tracking
      </h2>

      {trackingData.map((tracking) => (
        <div
          key={tracking.id}
          className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-5 hover:border-gray-600 hover:shadow-lg hover:shadow-gray-700/20 transition group"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-gray-200 transition">
                {tracking.serviceName}
              </h3>
              <div
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                  tracking.status
                )}`}
              >
                {getStatusIcon(tracking.status)}
                <span className="capitalize">
                  {tracking.status.replace("-", " ")}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs font-medium">Est. Time</p>
              <p className="text-white font-bold text-sm">
                {tracking.estimatedTime}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between mb-1.5">
              <span className="text-xs text-gray-400 font-medium">
                Progress
              </span>
              <span className="text-xs font-bold text-red-500">
                {Math.round(tracking.progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-1.5 hover:bg-gray-700 transition">
              <div
                className="bg-gradient-to-r from-red-500 to-red-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${tracking.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Technician Info */}
          <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-700/50">
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Technician</p>
              <p className="text-white font-medium text-sm">
                {tracking.technicianName}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Contact</p>
              <button className="text-red-500 hover:text-red-400 font-medium text-xs flex items-center gap-1">
                <Phone size={14} /> {tracking.technicianPhone}
              </button>
            </div>
          </div>

          {/* Location Info */}
          <div className="flex items-start gap-2">
            <MapPin className="text-red-500 mt-0.5 flex-shrink-0" size={16} />
            <div className="flex-1 min-w-0">
              <p className="text-gray-500 text-xs font-medium mb-0.5">
                Location
              </p>
              <p className="text-white font-medium text-sm">
                {tracking.location.address}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Updated: {tracking.location.timestamp}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
