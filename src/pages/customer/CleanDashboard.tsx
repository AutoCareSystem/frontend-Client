import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  Car,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  Wrench,
  Calendar,
  DollarSign,
  Zap,
  User,
  MapPin,
  Phone,
  Award,
  Sparkles,
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
          {/* Overview Stats - Enhanced Design */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Total Spent Card */}
            <div className="group relative bg-gradient-to-br from-emerald-500/10 via-[#2a2a2a] to-[#2a2a2a] p-6 rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <DollarSign className="h-6 w-6 text-emerald-400" />
                  </div>
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                </div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Total Spent</p>
                <p className="text-3xl font-bold text-white mb-1">
                  {utils.formatCurrency(overallStats.totalSpent)}
                </p>
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Lifetime spending
                </p>
              </div>
            </div>

            {/* Vehicles Card */}
            <div className="group relative bg-gradient-to-br from-blue-500/10 via-[#2a2a2a] to-[#2a2a2a] p-6 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Car className="h-6 w-6 text-blue-400" />
                  </div>
                  <Zap className="h-4 w-4 text-blue-400" />
                </div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">My Vehicles</p>
                <p className="text-3xl font-bold text-white mb-1">
                  {overallStats.totalVehicles}
                </p>
                <p className="text-xs text-blue-400">Registered</p>
              </div>
            </div>

            {/* Completed Card */}
            <div className="group relative bg-gradient-to-br from-green-500/10 via-[#2a2a2a] to-[#2a2a2a] p-6 rounded-xl border border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl group-hover:bg-green-500/10 transition-all"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                  <Award className="h-4 w-4 text-green-400" />
                </div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Completed</p>
                <p className="text-3xl font-bold text-white mb-1">
                  {overallStats.completedCount}
                </p>
                <p className="text-xs text-green-400">Services done</p>
              </div>
            </div>

            {/* Pending Card */}
            <div className="group relative bg-gradient-to-br from-amber-500/10 via-[#2a2a2a] to-[#2a2a2a] p-6 rounded-xl border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <Clock className="h-6 w-6 text-amber-400" />
                  </div>
                  <Wrench className="h-4 w-4 text-amber-400" />
                </div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">In Progress</p>
                <p className="text-3xl font-bold text-white mb-1">
                  {overallStats.pendingCount}
                </p>
                <p className="text-xs text-amber-400">Active services</p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile & Vehicles */}
            <div className="lg:col-span-2 space-y-8">
              {/* Customer Profile - Enhanced */}
              <div className="group relative bg-gradient-to-br from-[#2a2a2a] via-[#252525] to-[#2a2a2a] p-6 rounded-xl border border-gray-700 hover:border-gray-600 shadow-lg overflow-hidden transition-all duration-300">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
                
                <div className="relative mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-red-500/20">
                        {customerProfile?.userName?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#2a2a2a]"></div>
                    </div>
                    <div>
                      <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        Profile Information
                      </span>
                      <p className="text-xs text-gray-400 font-normal">Active member</p>
                    </div>
                  </h2>
                </div>

                {customerProfile && (
                  <div className="relative space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="group/card relative bg-[#1a1a1a] p-4 rounded-lg border border-gray-600 hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                        <div className="relative flex items-start gap-3">
                          <div className="p-2 bg-red-500/10 rounded-lg">
                            <User className="h-4 w-4 text-red-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                              Full Name
                            </p>
                            <p className="text-white font-semibold text-lg">
                              {customerProfile.userName}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="group/card relative bg-[#1a1a1a] p-4 rounded-lg border border-gray-600 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                        <div className="relative flex items-start gap-3">
                          <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Phone className="h-4 w-4 text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                              Phone Number
                            </p>
                            <p className="text-white font-semibold text-lg">
                              {customerProfile.phoneNumber || "Not provided"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="group/card relative bg-[#1a1a1a] p-4 rounded-lg border border-gray-600 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                        <div className="relative flex items-start gap-3">
                          <div className="p-2 bg-green-500/10 rounded-lg">
                            <Calendar className="h-4 w-4 text-green-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                              Member Since
                            </p>
                            <p className="text-white font-semibold text-lg">
                              {utils.formatDate(customerProfile.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {customerProfile.address && (
                      <div className="group/card relative bg-[#1a1a1a] p-4 rounded-lg border border-gray-600 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                        <div className="relative flex items-start gap-3">
                          <div className="p-2 bg-purple-500/10 rounded-lg">
                            <MapPin className="h-4 w-4 text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                              Address
                            </p>
                            <p className="text-white font-semibold text-lg">
                              {customerProfile.address}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Vehicles Section - Enhanced */}
              <div className="relative bg-gradient-to-br from-[#2a2a2a] via-[#252525] to-[#2a2a2a] p-6 rounded-xl border border-gray-700 hover:border-gray-600 shadow-lg overflow-hidden transition-all duration-300">
                <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
                
                <div className="relative mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Car className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        My Vehicles
                      </span>
                      <p className="text-xs text-gray-400 font-normal">{vehicles.length} registered</p>
                    </div>
                  </h2>
                </div>

                {vehicles.length > 0 ? (
                  <div className="relative grid grid-cols-1 gap-4">
                    {vehicles.map((vehicle) => {
                      const summary = vehicleSummaries[vehicle.vehicleID];
                      return (
                        <div
                          key={vehicle.vehicleID}
                          className="group/vehicle relative bg-[#1a1a1a] p-5 rounded-xl border border-gray-600 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-cyan-500/0 to-blue-500/5 opacity-0 group-hover/vehicle:opacity-100 transition-opacity duration-300"></div>
                          
                          <div className="relative">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-start space-x-3 flex-1">
                                <div className="p-2.5 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg group-hover/vehicle:scale-110 transition-transform duration-300">
                                  <Car className="h-6 w-6 text-blue-400" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-white font-semibold text-lg mb-1">
                                    {vehicle.company} {vehicle.model}
                                  </h3>
                                  <div className="flex flex-wrap items-center gap-3 text-sm">
                                    <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20">
                                      {vehicle.year}
                                    </span>
                                    <span className="text-gray-400">
                                      {vehicle.plateNumber}
                                    </span>
                                    <span className="text-gray-500 text-xs">
                                      VIN: {vehicle.vin}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="p-2 bg-green-500/10 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-green-400" />
                              </div>
                            </div>

                            {summary && (
                              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-700">
                                <div className="group/stat text-center p-3 bg-green-500/5 rounded-lg border border-green-500/10 hover:border-green-500/30 transition-all">
                                  <div className="flex items-center justify-center gap-1 mb-1">
                                    <DollarSign className="h-3 w-3 text-green-400" />
                                    <p className="text-green-400 font-bold text-lg">
                                      {utils.formatCurrency(summary.totalSpent)}
                                    </p>
                                  </div>
                                  <p className="text-gray-400 text-xs uppercase tracking-wide">Total Spent</p>
                                </div>
                                <div className="group/stat text-center p-3 bg-blue-500/5 rounded-lg border border-blue-500/10 hover:border-blue-500/30 transition-all">
                                  <div className="flex items-center justify-center gap-1 mb-1">
                                    <CheckCircle className="h-3 w-3 text-blue-400" />
                                    <p className="text-blue-400 font-bold text-lg">
                                      {summary.completedCount}
                                    </p>
                                  </div>
                                  <p className="text-gray-400 text-xs uppercase tracking-wide">Completed</p>
                                </div>
                                <div className="group/stat text-center p-3 bg-amber-500/5 rounded-lg border border-amber-500/10 hover:border-amber-500/30 transition-all">
                                  <div className="flex items-center justify-center gap-1 mb-1">
                                    <Clock className="h-3 w-3 text-amber-400" />
                                    <p className="text-amber-400 font-bold text-lg">
                                      {summary.pendingCount}
                                    </p>
                                  </div>
                                  <p className="text-gray-400 text-xs uppercase tracking-wide">Pending</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Car className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No vehicles registered yet</p>
                  </div>
                )}
              </div>

              {/* Available Services - Enhanced */}
              <div className="relative bg-gradient-to-br from-[#2a2a2a] via-[#252525] to-[#2a2a2a] p-6 rounded-xl border border-gray-700 hover:border-gray-600 shadow-lg overflow-hidden transition-all duration-300">
                <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-full blur-3xl"></div>
                
                <div className="relative mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg">
                      <Wrench className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        Available Services
                      </span>
                      <p className="text-xs text-gray-400 font-normal">Book your next service</p>
                    </div>
                  </h2>
                </div>

                <div className="relative space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                  {availableServices.slice(0, 8).map((service) => (
                    <div
                      key={service.serviceID}
                      className="group/service relative p-4 bg-[#1a1a1a] rounded-xl hover:bg-gray-800/50 transition-all duration-300 cursor-pointer border border-gray-600 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-emerald-500/0 to-green-500/5 opacity-0 group-hover/service:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-white text-base font-semibold mb-2 flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-400" />
                              {service.title}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-2">
                              {service.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded">
                                <Clock className="h-3 w-3" />
                                {service.duration} min
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 text-right">
                            <p className="text-green-400 font-bold text-lg">
                              {utils.formatCurrency(service.price)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {availableServices.length === 0 && (
                    <div className="text-center py-12">
                      <div className="inline-flex p-4 bg-green-500/10 rounded-full mb-4">
                        <AlertCircle className="h-8 w-8 text-green-400" />
                      </div>
                      <p className="text-gray-400 mb-2">No services available</p>
                      <p className="text-gray-500 text-sm">Check back later for new services</p>
                    </div>
                  )}
                </div>

                {availableServices.length > 0 && (
                  <div className="relative mt-6">
                    <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg shadow-green-500/20 hover:shadow-green-500/40 flex items-center justify-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Book a Service
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

              {/* Customer Projects */}
              <div className="bg-[#2a2a2a] p-6 rounded-lg border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-6">
                  My Custom Projects
                </h2>

                <div className="space-y-3">
                  {projects.map((project) => (
                    <div
                      key={project.appointmentID}
                      className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg hover:bg-gray-700/20 transition"
                    >
                      <div className="flex-1">
                        <h3 className="text-white text-sm font-medium">
                          {project.projectTitle}
                        </h3>
                        <p className="text-gray-400 text-xs mt-1">
                          {project.projectDescription}
                        </p>
                        {project.vehicle && (
                          <p className="text-gray-500 text-xs mt-1">
                            {project.vehicle.company} {project.vehicle.model} ({project.vehicle.year})
                          </p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <span
                          className={`text-xs px-2 py-1 rounded ${utils.getStatusColor(
                            project.status
                          )}`}
                        >
                          {project.status}
                        </span>
                        <p className="text-gray-400 text-xs mt-1">
                          {utils.formatDate(project.startDate)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {projects.length === 0 && (
                    <div className="text-center py-8">
                      <Wrench className="h-8 w-8 text-gray-500 mx-auto mb-2" />
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
