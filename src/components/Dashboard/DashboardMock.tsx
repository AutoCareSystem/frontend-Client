import React from "react";
import { Link } from "react-router-dom";
import { Plus, Calendar, Car, ArrowRight, Loader2 } from "lucide-react";
import { useMockData } from "../../contexts/MockDataProvider";
import DashboardStats from "./DashboardStats";
import RecentBookings from "./RecentBookings";

const DashboardMock: React.FC = () => {
  const { dashboardStats, bookings, isLoading } = useMockData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, John! 👋
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your vehicles today.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/dev/book-service"
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg shadow-sm transition-colors flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <Plus className="h-6 w-6" />
            <span className="font-medium">Book Service</span>
          </div>
          <ArrowRight className="h-5 w-5" />
        </Link>

        <Link
          to="/dev/dashboard"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-4 rounded-lg shadow-sm transition-colors flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6" />
            <span className="font-medium">View Appointments</span>
          </div>
          <ArrowRight className="h-5 w-5" />
        </Link>

        <Link
          to="/dev/dashboard"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-4 rounded-lg shadow-sm transition-colors flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <Car className="h-6 w-6" />
            <span className="font-medium">Manage Vehicles</span>
          </div>
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      {/* Dashboard Stats */}
      <DashboardStats stats={dashboardStats} isLoading={isLoading} />

      {/* Recent Bookings */}
      <RecentBookings bookings={bookings} isLoading={isLoading} />

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Upcoming Appointments
        </h2>
        <div className="space-y-3">
          {bookings
            .filter(
              (booking) =>
                booking.status === "confirmed" || booking.status === "pending"
            )
            .slice(0, 3)
            .map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.service.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {booking.vehicle.make} {booking.vehicle.model} •{" "}
                      {booking.appointmentDate} at {booking.appointmentTime}
                    </p>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {booking.status}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardMock;
