interface ActivityLog {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  type: "info" | "success" | "warning" | "error";
}

export default function ActivityFeed() {
  const activities: ActivityLog[] = [
    {
      id: "1",
      action: "Service Started",
      description: "Engine Overhaul has been initiated",
      timestamp: "2 hours ago",
      type: "info",
    },
    {
      id: "2",
      action: "Technician Assigned",
      description: "John Smith assigned to your service",
      timestamp: "3 hours ago",
      type: "success",
    },
    {
      id: "3",
      action: "Service Completed",
      description: "Paint & Polish service has been completed",
      timestamp: "1 day ago",
      type: "success",
    },
    {
      id: "4",
      action: "Payment Received",
      description: "Payment of $450 received for Paint & Polish",
      timestamp: "1 day ago",
      type: "success",
    },
  ];

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      info: "bg-blue-500",
      success: "bg-green-500",
      warning: "bg-yellow-500",
      error: "bg-red-500",
    };
    return colors[type] || colors.info;
  };

  return (
    <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 hover:shadow-lg hover:shadow-gray-700/20 transition">
      <div className="p-6 border-b border-gray-700/50">
        <h3 className="text-xl font-bold text-white">Activity Feed</h3>
      </div>

      <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
        {activities.map((activity, idx) => (
          <div
            key={activity.id}
            className="flex gap-4 pb-4 last:pb-0 last:border-b-0 border-b border-gray-700/50 hover:bg-[#333333]/30 px-2 py-2 rounded transition"
          >
            {/* Timeline indicator */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`w-3 h-3 rounded-full ${getTypeColor(
                  activity.type
                )}`}
              ></div>
              {idx !== activities.length - 1 && (
                <div className="w-0.5 h-12 bg-gray-700/50 my-2"></div>
              )}
            </div>

            {/* Activity content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white text-sm mb-1">
                {activity.action}
              </h4>
              <p className="text-gray-400 text-xs mb-1.5">
                {activity.description}
              </p>
              <p className="text-gray-500 text-xs">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full p-3 border-t border-gray-700/50 text-gray-400 hover:text-white hover:bg-[#333333]/30 transition font-medium text-sm">
        View All Activities
      </button>
    </div>
  );
}
