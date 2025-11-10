import { MapPin, Navigation, Users } from "lucide-react";

interface Assignment {
  id: string;
  serviceName: string;
  customerName: string;
  location: string;
  priority: "high" | "medium" | "low";
  startTime: string;
  estimatedDuration: string;
  status: "assigned" | "in-progress" | "completed";
}

export default function EmployeeTracking() {
  const assignments: Assignment[] = [
    {
      id: "1",
      serviceName: "Engine Overhaul",
      customerName: "John Doe",
      location: "123 Main St, New York",
      priority: "high",
      startTime: "09:00 AM",
      estimatedDuration: "3 hours",
      status: "in-progress",
    },
    {
      id: "2",
      serviceName: "Brake Replacement",
      customerName: "Jane Smith",
      location: "456 Oak Ave, New York",
      priority: "medium",
      startTime: "01:00 PM",
      estimatedDuration: "2 hours",
      status: "assigned",
    },
    {
      id: "3",
      serviceName: "Paint & Polish",
      customerName: "Robert Johnson",
      location: "789 Pine St, New York",
      priority: "low",
      startTime: "04:00 PM",
      estimatedDuration: "4 hours",
      status: "assigned",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-500 border border-red-500/30";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border border-yellow-500/30";
      case "low":
        return "bg-green-500/10 text-green-500 border border-green-500/30";
      default:
        return "bg-gray-500/10 text-gray-500 border border-gray-500/30";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20";
      case "in-progress":
        return "bg-blue-500/20";
      case "assigned":
        return "bg-purple-500/20";
      default:
        return "bg-gray-500/20";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-red-500">Your Assignments</h2>
        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium text-white transition">
          + Add Task
        </button>
      </div>

      {assignments.map((assignment) => (
        <div
          key={assignment.id}
          className={`rounded-lg p-5 border border-gray-700 hover:border-gray-600 hover:shadow-lg hover:shadow-gray-700/20 transition group ${getStatusBg(
            assignment.status
          )}`}
        >
          {/* Top Row */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-base font-bold text-white mb-1 group-hover:text-gray-200 transition">
                {assignment.serviceName}
              </h3>
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <Users size={14} />
                <span>{assignment.customerName}</span>
              </div>
            </div>
            <span
              className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${getPriorityColor(
                assignment.priority
              )}`}
            >
              {assignment.priority}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-gray-700/50">
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Start</p>
              <p className="text-white font-medium text-sm">
                {assignment.startTime}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Duration</p>
              <p className="text-white font-medium text-sm">
                {assignment.estimatedDuration}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Status</p>
              <p className="text-white font-medium text-sm capitalize">
                {assignment.status}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <MapPin className="text-red-500 flex-shrink-0" size={16} />
              <span className="text-gray-300 text-xs truncate">
                {assignment.location}
              </span>
            </div>
            <button className="p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded transition text-red-500 flex-shrink-0">
              <Navigation size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
