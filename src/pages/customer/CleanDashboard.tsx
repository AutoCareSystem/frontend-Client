import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  Car,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import {
  customerAPI,
  utils,
  type CustomerProfile,
  type Vehicle,
  type VehicleSummary,
  type ServiceHistoryItem,
  type Service,
  type Project,
} from "../../utils/customerAPI";

export default function NewCustomerDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

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
  const [projects, setProjects] = useState<Project[]>([]);

  const customerId = utils.getCustomerId();

  // Fetch all dashboard data
  const fetchDashboardData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      console.log("🔄 Fetching dashboard data for customer:", customerId);

      // 1. Fetch customer profile
      const profileData = await customerAPI.getProfile(customerId);
      if (profileData) {
        setCustomerProfile(profileData);
        console.log("✅ Profile loaded:", profileData);
      }

      // 2. Fetch customer vehicles
      const vehiclesData = await customerAPI.getVehicles(customerId);
      setVehicles(vehiclesData);
      console.log("✅ Vehicles loaded:", vehiclesData);

      // 3. For each vehicle, fetch summary and service history
      if (vehiclesData.length > 0) {
        const summaries: Record<number, VehicleSummary> = {};
        const histories: Record<number, ServiceHistoryItem[]> = {};

        await Promise.all(
          vehiclesData.map(async (vehicle) => {
            const [summaryData, historyData] = await Promise.all([
              customerAPI.getVehicleSummary(customerId, vehicle.vehicleID),
              customerAPI.getServiceHistory(customerId, vehicle.vehicleID),
            ]);

            if (summaryData) {
              summaries[vehicle.vehicleID] = summaryData;
              console.log(
                `✅ Summary for vehicle ${vehicle.vehicleID}:`,
                summaryData
              );
            }

            if (historyData) {
              histories[vehicle.vehicleID] = historyData;
              console.log(
                `✅ History for vehicle ${vehicle.vehicleID}:`,
                historyData
              );
            }
          })
        );

        setVehicleSummaries(summaries);
        setServiceHistory(histories);
      }

      // 4. Fetch available services
      const servicesData = await customerAPI.getServices();
      setAvailableServices(servicesData);
      console.log("✅ Services loaded:", servicesData);

      // 5. Fetch customer projects
      const projectsData = await customerAPI.getProjects(customerId);
      setProjects(projectsData);
      console.log("✅ Projects loaded:", projectsData);
    } catch (err) {
      console.error("❌ Dashboard fetch error:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
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

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

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
              onClick={() => fetchDashboardData()}
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
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw
                  className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`}
                />
              </button>
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
                    {utils.formatCurrency(overallStats.totalSpent)}
                  </p>
                  <p className="text-xs text-green-400 mt-1">
                    Lifetime spending
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
                  <p className="text-xs text-blue-400 mt-1">Registered</p>
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
                  <p className="text-xs text-green-400 mt-1">Services done</p>
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
                  <p className="text-xs text-yellow-400 mt-1">In progress</p>
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
              <div className="bg-gradient-to-br from-[#2a2a2a] to-[#252525] p-6 rounded-xl border border-gray-700 shadow-lg">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                      {customerProfile?.userName?.charAt(0).toUpperCase() ||
                        "U"}
                    </div>
                    Profile Information
                  </h2>
                </div>

                {customerProfile && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-600 hover:border-red-500/50 transition-all duration-300">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">
                          Full Name
                        </p>
                        <p className="text-white font-semibold text-lg">
                          {customerProfile.userName}
                        </p>
                      </div>

                      <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-600 hover:border-blue-500/50 transition-all duration-300">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">
                          Phone Number
                        </p>
                        <p className="text-white font-semibold text-lg">
                          {customerProfile.phoneNumber || "Not provided"}
                        </p>
                      </div>

                      <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-600 hover:border-green-500/50 transition-all duration-300">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">
                          Member Since
                        </p>
                        <p className="text-white font-semibold text-lg">
                          {utils.formatDate(customerProfile.createdAt)}
                        </p>
                      </div>
                    </div>

                    {customerProfile.address && (
                      <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-600 hover:border-purple-500/50 transition-all duration-300">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">
                          Address
                        </p>
                        <p className="text-white font-semibold text-lg">
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

                {vehicles.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {vehicles.map((vehicle) => {
                      const summary = vehicleSummaries[vehicle.vehicleID];
                      return (
                        <div
                          key={vehicle.vehicleID}
                          className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-600 hover:border-gray-500 transition"
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
                                  {utils.formatCurrency(summary.totalSpent)}
                                </p>
                                <p className="text-gray-400 text-xs">Spent</p>
                              </div>
                              <div className="text-center">
                                <p className="text-blue-400 font-bold">
                                  {summary.completedCount}
                                </p>
                                <p className="text-gray-400 text-xs">
                                  Completed
                                </p>
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
                ) : (
                  <div className="text-center py-8">
                    <Car className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No vehicles registered yet</p>
                    <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
                      Add Vehicle
                    </button>
                  </div>
                )}
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
                      className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg hover:bg-gray-700/20 transition"
                    >
                      <div className="flex-1">
                        <h3 className="text-white text-sm font-medium">
                          {service.title}
                        </h3>
                        <p className="text-gray-400 text-xs">
                          {service.endDateDisplay === "Not completed yet"
                            ? "In Progress"
                            : utils.formatDate(service.endDateDisplay)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-medium">
                          {utils.formatCurrency(service.price)}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded ${utils.getStatusColor(
                            service.status
                          )}`}
                        >
                          {service.status}
                        </span>
                      </div>
                    </div>
                  ))}

                  {recentServices.length === 0 && (
                    <div className="text-center py-8">
                      <Clock className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-400">No service history yet</p>
                    </div>
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
                          {utils.formatCurrency(service.price)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {availableServices.length === 0 && (
                    <div className="text-center py-8">
                      <AlertCircle className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-400">No services available</p>
                    </div>
                  )}
                </div>

                {availableServices.length > 0 && (
                  <button className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition">
                    Book Service
                  </button>
                )}
              </div>

              {/* Customer Projects */}
              <div className="bg-[#2a2a2a] p-6 rounded-lg border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-6">
                  My Custom Projects
                </h2>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {projects.map((project) => (
                    <div
                      key={project.appointmentID}
                      className="p-4 bg-[#1a1a1a] rounded-lg hover:bg-gray-700/20 transition border border-gray-600"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="text-white font-medium">
                            {project.projectTitle}
                          </h3>
                          <p className="text-gray-400 text-xs mt-1">
                            {project.projectDescription}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded ${utils.getStatusColor(
                            project.status
                          )}`}
                        >
                          {project.status}
                        </span>
                      </div>

                      {project.vehicle && (
                        <div className="flex items-center space-x-2 text-xs text-gray-400 mt-2">
                          <Car className="h-3 w-3" />
                          <span>
                            {project.vehicle.company} {project.vehicle.model} (
                            {project.vehicle.year})
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-600">
                        <div className="text-xs text-gray-400">
                          <span>Assigned to: </span>
                          <span className="text-blue-400">
                            {project.assignedEmployee}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {utils.formatDate(project.startDate)}
                        </div>
                      </div>
                    </div>
                  ))}

                  {projects.length === 0 && (
                    <div className="text-center py-8">
                      <AlertCircle className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-400">No custom projects yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
