import { MoreVertical, Calendar, MapPin } from "lucide-react";

interface Service {
  id: string;
  name: string;
  status: "pending" | "in-progress" | "completed";
  date: string;
  location: string;
  cost: string;
}

export default function ServiceHistory() {
  const services: Service[] = [
    {
      id: "1",
      name: "Engine Overhaul",
      status: "in-progress",
      date: "2024-01-15",
      location: "Main Service Center",
      cost: "$850",
    },
    {
      id: "2",
      name: "Paint & Polish",
      status: "completed",
      date: "2024-01-14",
      location: "Downtown Branch",
      cost: "$450",
    },
    {
      id: "3",
      name: "Brake Replacement",
      status: "completed",
      date: "2024-01-12",
      location: "Main Service Center",
      cost: "$320",
    },
    {
      id: "4",
      name: "Transmission Service",
      status: "pending",
      date: "2024-01-20",
      location: "Main Service Center",
      cost: "$650",
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string }> = {
      pending: { bg: "bg-yellow-500/10", text: "text-yellow-500" },
      "in-progress": { bg: "bg-blue-500/10", text: "text-blue-500" },
      completed: { bg: "bg-green-500/10", text: "text-green-500" },
    };
    const style = statusMap[status];
    return (
      <span
        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${style.bg} ${style.text}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
      </span>
    );
  };

  return (
    <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 hover:shadow-lg hover:shadow-gray-700/20 transition">
      <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
        <h3 className="text-xl font-bold text-white">Service History</h3>
        <button className="text-gray-400 hover:text-white transition">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="divide-y divide-gray-700/50">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-center justify-between p-4 hover:bg-[#333333]/50 transition group"
          >
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white mb-2 group-hover:text-gray-200 transition">
                {service.name}
              </h4>
              <div className="flex items-center gap-4 text-gray-400 text-xs">
                <div className="flex items-center gap-1">
                  <Calendar size={14} className="text-gray-500" />
                  {service.date}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={14} className="text-gray-500" />
                  {service.location}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 ml-4">
              {getStatusBadge(service.status)}
              <span className="text-sm font-bold text-red-500">
                {service.cost}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full p-3 text-center border-t border-gray-700/50 text-gray-400 hover:text-white hover:bg-[#333333]/30 transition font-medium text-sm">
        View All Services
      </button>
    </div>
  );
}
