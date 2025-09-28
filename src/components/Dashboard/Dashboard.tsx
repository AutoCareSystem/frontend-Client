import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Calendar, Car, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { apiService } from "../../services/api";
import type {
  DashboardStats as DashboardStatsType,
  Booking,
} from "../../types";
import DashboardStats from "./DashboardStats";
import RecentBookings from "./RecentBookings";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStatsType>({
    totalBookings: 0,
    upcomingAppointments: 0,
    completedServices: 0,
    totalSpent: 0,
    activeProjects: 0,
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch dashboard stats and recent bookings in parallel
        const [statsResponse, bookingsResponse] = await Promise.all([
          apiService.getDashboardStats(),
          apiService.getBookings(),
        ]);

        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data);
        }

        if (bookingsResponse.success && bookingsResponse.data) {
          setRecentBookings(bookingsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickActions = [
    {
      title: "Book Service",
      description: "Schedule a new vehicle service",
      href: "/book-service",
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      title: "Add Vehicle",
      description: "Register a new vehicle",
      href: "/vehicles/add",
      icon: Car,
      color: "bg-green-500",
    },
    {
      title: "View Bookings",
      description: "Check your appointments",
      href: "/bookings",
      icon: Calendar,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-blue-100">
          Manage your vehicle services and track your appointments in one place.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.href}
                className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 ${action.color} rounded-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Dashboard Stats */}
      <DashboardStats stats={stats} isLoading={isLoading} />

      {/* Recent Bookings and Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentBookings bookings={recentBookings} isLoading={isLoading} />

        {/* Upcoming Appointments */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Upcoming Appointments
            </h3>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentBookings.filter(
                (booking) =>
                  booking.status === "confirmed" || booking.status === "pending"
              ).length > 0 ? (
              <div className="space-y-4">
                {recentBookings
                  .filter(
                    (booking) =>
                      booking.status === "confirmed" ||
                      booking.status === "pending"
                  )
                  .slice(0, 3)
                  .map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {booking.service?.name || "Service"}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {booking.vehicle?.make} {booking.vehicle?.model}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(
                            booking.appointmentDate
                          ).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking.appointmentTime}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  No upcoming appointments
                </h4>
                <p className="text-gray-500 mb-4">
                  Book a service to get started
                </p>
                <Link
                  to="/book-service"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Book Service
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
