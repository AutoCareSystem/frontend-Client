import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  Car,
  CreditCard,
  Star,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { customerAPI, utils } from "../../utils/customerAPI";

// Type definitions based on backend DTOs
interface CustomerProfile {
  userID: string;
  userName: string;
  email: string;
  phoneNumber: string;
  role: string;
  createdAt: string;
  loyaltyPoints: number;
  address?: string;
}

interface Vehicle {
  vehicleID: number;
  model: string;
  year: string;
  vin: string;
  plateNumber: string;
  company?: string;
}

interface VehicleSummary {
  totalVehicles: number;
  totalSpent: number;
  completedCount: number;
  pendingCount: number;
}

interface ServiceHistoryItem {
  title: string;
  status: string;
  price: number;
  endDateDisplay: string;
}

interface Service {
  serviceID: number;
  code: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  status: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function NewCustomerDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [customerProfile, setCustomerProfile] =
    useState<CustomerProfile | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleSummaries, setVehicleSummaries] = useState<
    Record<number, VehicleSummary>
  >({});
  const [serviceHistory, setServiceHistory] = useState<
    Record<number, ServiceHistoryItem[]>
  >({});
  const [availableServices, setAvailableServices] = useState<Service[]>([]);

  // Get customer ID from localStorage
  const customerId =
    localStorage.getItem("customerId") ||
    localStorage.getItem("customerID") ;

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("🔄 Fetching dashboard data for customer:", customerId);

        // 1. Fetch customer profile
        const profileResponse = await fetch(
          `${API_BASE_URL}/api/Customers/${customerId}`
        );
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setCustomerProfile(profileData);
          console.log("✅ Profile loaded:", profileData);
        } else {
          console.warn("⚠️ Profile fetch failed:", profileResponse.status);
        }

        // 2. Fetch customer vehicles
        const vehiclesResponse = await fetch(
          `${API_BASE_URL}/api/Vehicles/customer/${customerId}`
        );
        if (vehiclesResponse.ok) {
          const vehiclesData = await vehiclesResponse.json();
          setVehicles(vehiclesData);
          console.log("✅ Vehicles loaded:", vehiclesData);

          // 3. For each vehicle, fetch summary and service history
          const summaries: Record<number, VehicleSummary> = {};
          const histories: Record<number, ServiceHistoryItem[]> = {};

          for (const vehicle of vehiclesData) {
            try {
              // Fetch vehicle summary
              const summaryResponse = await fetch(
                `${API_BASE_URL}/api/Appointments/customer/${customerId}/vehicle/${vehicle.vehicleID}/summary`
              );
              if (summaryResponse.ok) {
                const summaryData = await summaryResponse.json();
                summaries[vehicle.vehicleID] = summaryData;
                console.log(
                  `✅ Summary for vehicle ${vehicle.vehicleID}:`,
                  summaryData
                );
              }

              // Fetch service history
              const historyResponse = await fetch(
                `${API_BASE_URL}/api/Appointments/customer/${customerId}/vehicle/${vehicle.vehicleID}/history`
              );
              if (historyResponse.ok) {
                const historyData = await historyResponse.json();
                histories[vehicle.vehicleID] = historyData;
                console.log(
                  `✅ History for vehicle ${vehicle.vehicleID}:`,
                  historyData
                );
              }
            } catch (err) {
              console.warn(
                `⚠️ Error fetching data for vehicle ${vehicle.vehicleID}:`,
                err
              );
            }
          }

          setVehicleSummaries(summaries);
          setServiceHistory(histories);
        } else {
          console.warn("⚠️ Vehicles fetch failed:", vehiclesResponse.status);
        }

        // 4. Fetch available services
        const servicesResponse = await fetch(`${API_BASE_URL}/api/Services`);
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          setAvailableServices(
            servicesData.filter(
              (service: Service) => service.status === "Active"
            )
          );
          console.log("✅ Services loaded:", servicesData);
        } else {
          console.warn("⚠️ Services fetch failed:", servicesResponse.status);
        }
      } catch (err) {
        console.error("❌ Dashboard fetch error:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchDashboardData();
    } else {
      setError("Customer ID not found. Please log in again.");
      setLoading(false);
    }
  }, [customerId]);

  // Calculate overall stats
  const overallStats = Object.values(vehicleSummaries).reduce(
    (acc, summary) => ({
      totalVehicles: summary.totalVehicles,
      totalSpent: acc.totalSpent + summary.totalSpent,
      completedCount: acc.completedCount + summary.completedCount,
      pendingCount: acc.pendingCount + summary.pendingCount,
    }),
    { totalVehicles: 0, totalSpent: 0, completedCount: 0, pendingCount: 0 }
  );

  // Get recent service history (last 5 items across all vehicles)
  const recentServices = Object.values(serviceHistory)
    .flat()
    .sort((a, b) => {
      if (a.endDateDisplay === "Not completed yet") return -1;
      if (b.endDateDisplay === "Not completed yet") return 1;
      return (
        new Date(b.endDateDisplay).getTime() -
        new Date(a.endDateDisplay).getTime()
      );
    })
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
        <Sidebar role="customer" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
        <Sidebar role="customer" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
      <Sidebar role="customer" />
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-[#2a2a2a] border-b border-gray-700 p-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome back, {customerProfile?.userName || "Customer"}!
              </h1>
              <p className="text-gray-400 mt-1">
                Here's your automotive service overview
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Loyalty Points</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {customerProfile?.loyaltyPoints || 0}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#2a2a2a] p-6 rounded-lg border border-gray-700 hover:border-gray-600 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Total Spent</p>
                  <p className="text-3xl font-bold text-white">
                    ${overallStats.totalSpent.toLocaleString()}
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-[#2a2a2a] p-6 rounded-lg border border-gray-700 hover:border-gray-600 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Vehicles</p>
                  <p className="text-3xl font-bold text-white">
                    {overallStats.totalVehicles}
                  </p>
                </div>
                <Car className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-[#2a2a2a] p-6 rounded-lg border border-gray-700 hover:border-gray-600 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Completed</p>
                  <p className="text-3xl font-bold text-white">
                    {overallStats.completedCount}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-[#2a2a2a] p-6 rounded-lg border border-gray-700 hover:border-gray-600 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Pending</p>
                  <p className="text-3xl font-bold text-white">
                    {overallStats.pendingCount}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile & Vehicles */}
            <div className="lg:col-span-2 space-y-8">
              {/* Customer Profile */}
              <div className="bg-[#2a2a2a] p-6 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">
                    Profile Information
                  </h2>
                  <Settings className="h-5 w-5 text-gray-400 cursor-pointer hover:text-white transition" />
                </div>

                {customerProfile && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-400 text-sm">Name</p>
                        <p className="text-white font-medium">
                          {customerProfile.userName}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Email</p>
                        <p className="text-white font-medium">
                          {customerProfile.email}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-400 text-sm">Phone</p>
                        <p className="text-white font-medium">
                          {customerProfile.phoneNumber || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Member Since</p>
                        <p className="text-white font-medium">
                          {new Date(
                            customerProfile.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {customerProfile.address && (
                      <div className="md:col-span-2">
                        <p className="text-gray-400 text-sm">Address</p>
                        <p className="text-white font-medium">
                          {customerProfile.address}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Vehicles Section */}
              <div className="bg-[#2a2a2a] p-6 rounded-lg border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-6">
                  My Vehicles
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  {vehicles.map((vehicle) => {
                    const summary = vehicleSummaries[vehicle.vehicleID];
                    return (
                      <div
                        key={vehicle.vehicleID}
                        className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-600"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Car className="h-6 w-6 text-blue-500" />
                            <div>
                              <h3 className="text-white font-medium">
                                {vehicle.company} {vehicle.model} (
                                {vehicle.year})
                              </h3>
                              <p className="text-gray-400 text-sm">
                                {vehicle.plateNumber} • VIN: {vehicle.vin}
                              </p>
                            </div>
                          </div>
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        </div>

                        {summary && (
                          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-600">
                            <div className="text-center">
                              <p className="text-green-400 font-bold">
                                ${summary.totalSpent}
                              </p>
                              <p className="text-gray-400 text-xs">Spent</p>
                            </div>
                            <div className="text-center">
                              <p className="text-blue-400 font-bold">
                                {summary.completedCount}
                              </p>
                              <p className="text-gray-400 text-xs">Completed</p>
                            </div>
                            <div className="text-center">
                              <p className="text-yellow-400 font-bold">
                                {summary.pendingCount}
                              </p>
                              <p className="text-gray-400 text-xs">Pending</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Services & Activity */}
            <div className="space-y-8">
              {/* Recent Service History */}
              <div className="bg-[#2a2a2a] p-6 rounded-lg border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-6">
                  Recent Services
                </h2>

                <div className="space-y-3">
                  {recentServices.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="text-white text-sm font-medium">
                          {service.title}
                        </h3>
                        <p className="text-gray-400 text-xs">
                          {service.endDateDisplay === "Not completed yet"
                            ? "In Progress"
                            : new Date(
                                service.endDateDisplay
                              ).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-medium">
                          ${service.price}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            service.status === "Completed"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {service.status}
                        </span>
                      </div>
                    </div>
                  ))}

                  {recentServices.length === 0 && (
                    <p className="text-gray-400 text-center py-4">
                      No service history yet
                    </p>
                  )}
                </div>
              </div>

              {/* Available Services */}
              <div className="bg-[#2a2a2a] p-6 rounded-lg border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-6">
                  Available Services
                </h2>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {availableServices.slice(0, 8).map((service) => (
                    <div
                      key={service.serviceID}
                      className="p-3 bg-[#1a1a1a] rounded-lg hover:bg-gray-700/20 transition cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-white text-sm font-medium">
                            {service.title}
                          </h3>
                          <p className="text-gray-400 text-xs mt-1">
                            {service.description}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {service.duration} minutes
                          </p>
                        </div>
                        <p className="text-green-400 font-medium">
                          ${service.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition">
                  Book Service
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
