import { TrendingUp, TrendingDown, Clock, AlertCircle } from "lucide-react";

interface Stat {
  label: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
}

export default function DashboardStats() {
  const stats: Stat[] = [
    {
      label: "Active Services",
      value: 8,
      change: 12,
      icon: <Clock className="text-blue-500" size={24} />,
    },
    {
      label: "Completed Today",
      value: 12,
      change: 8,
      icon: <TrendingUp className="text-green-500" size={24} />,
    },
    {
      label: "Pending Tasks",
      value: 3,
      change: -5,
      icon: <AlertCircle className="text-yellow-500" size={24} />,
    },
    {
      label: "Total Spent",
      value: "$2,450",
      change: 15,
      icon: <TrendingDown className="text-red-500" size={24} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] border border-gray-700 rounded-lg p-6 hover:border-gray-600 hover:shadow-lg hover:shadow-gray-700/20 transition duration-300"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gray-800/50 rounded-lg backdrop-blur-sm">
              {stat.icon}
            </div>
            <div
              className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                stat.change >= 0
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {stat.change >= 0 ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              {Math.abs(stat.change)}%
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-2 font-medium">{stat.label}</p>
          <p className="text-3xl font-bold text-white">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
