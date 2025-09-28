import React from "react";
import {
  Calendar,
  Car,
  CheckCircle,
  DollarSign,
  Clock,
  AlertCircle,
} from "lucide-react";
import type { DashboardStats as DashboardStatsType } from "../../types";

interface DashboardStatsProps {
  stats: DashboardStatsType;
  isLoading?: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  stats,
  isLoading = false,
}) => {
  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      color: "bg-blue-500",
      textColor: "text-blue-600",
    },
    {
      title: "Upcoming Appointments",
      value: stats.upcomingAppointments,
      icon: Clock,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
    },
    {
      title: "Completed Services",
      value: stats.completedServices,
      icon: CheckCircle,
      color: "bg-green-500",
      textColor: "text-green-600",
    },
    {
      title: "Total Spent",
      value: `$${stats.totalSpent.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-purple-500",
      textColor: "text-purple-600",
    },
    {
      title: "Active Projects",
      value: stats.activeProjects,
      icon: Car,
      color: "bg-indigo-500",
      textColor: "text-indigo-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse"
          >
            <div className="flex items-center">
              <div className="p-2 bg-gray-200 rounded-lg">
                <div className="h-6 w-6 bg-gray-300 rounded"></div>
              </div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`p-2 ${stat.color} rounded-lg`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className={`text-2xl font-semibold ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
