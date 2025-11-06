import Sidebar from "../../components/Sidebar";
import RealTimeTracking from "../../components/RealTimeTracking";
import ServiceHistory from "../../components/ServiceHistory";
import ActivityFeed from "../../components/ActivityFeed";
import { Bell, Settings } from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardSummary {
  totalSpent: number;
  totalVehicles: number;
  completedCount: number;
  pendingCount: number;
}

interface Appointment {
  id: number;
  serviceName: string;
  status: "Completed" | "In Progress" | "Pending";
  cost: number;
  createdDate: string;
  completedDate?: string;
}

export default function CustomerDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(
    null
  );
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Get initial values from localStorage or use defaults
  // 🔧 Change these default values here:
  const getInitialCustomerId = () => localStorage.getItem("customerId") || "2";
  const getInitialVehicleId = () => localStorage.getItem("vehicleId") || "2";

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    getInitialCustomerId()
  );
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    getInitialVehicleId()
  );

  // Fetch actual data from API
  useEffect(() => {
    console.log("🔄 useEffect triggered - dependencies changed!");
    const fetchDashboardData = async () => {
      setLoading(true); // Set loading to true at start
      try {
        const customerId = selectedCustomerId;
        const vehicleId = selectedVehicleId;
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

        console.log(
          "📊 Fetching data for Customer:",
          customerId,
          "Vehicle:",
          vehicleId
        );
        console.log("🔗 API URL:", apiUrl);
        console.log(
          "🌐 Full endpoint:",
          `${apiUrl}/api/Appointments/customer/${customerId}/vehicle/${vehicleId}/summary`
        );

        // Fetch summary data
        const summaryResponse = await fetch(
          `${apiUrl}/api/Appointments/customer/${customerId}/vehicle/${vehicleId}/summary`
        );

        if (!summaryResponse.ok) {
          console.error(
            " API Error:",
            summaryResponse.status,
            summaryResponse.statusText
          );
          throw new Error("Failed to fetch summary");
        }

        const summaryData: DashboardSummary = await summaryResponse.json();
        console.log(" Summary Data Received:", summaryData);
        setDashboardData(summaryData);

        // Fetch appointments list
        const appointmentsResponse = await fetch(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:5000"
          }/api/Appointments/customer/${customerId}`
        );

        if (appointmentsResponse.ok) {
          const appointmentsData: Appointment[] =
            await appointmentsResponse.json();
          console.log(" Appointments Received:", appointmentsData);
          setAppointments(appointmentsData);
        } else {
          console.warn(
            " Appointments API returned:",
            appointmentsResponse.status
          );
        }
      } catch (err) {
        console.error(" Dashboard data error:", err);
        console.warn(" Using fallback mock data");
        // Fallback to mock data
        setDashboardData({
          totalSpent: 20067,
          totalVehicles: 2,
          completedCount: 3,
          pendingCount: 0,
        });

        // Mock appointments as fallback
        setAppointments([
          {
            id: 1,
            serviceName: "Engine Overhaul",
            status: "In Progress",
            cost: 850,
            createdDate: "2025-11-01",
          },
          {
            id: 2,
            serviceName: "Paint & Polish",
            status: "Completed",
            cost: 450,
            createdDate: "2025-10-28",
            completedDate: "2025-10-30",
          },
          {
            id: 3,
            serviceName: "Brake Replacement",
            status: "Pending",
            cost: 320,
            createdDate: "2025-11-03",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedCustomerId, selectedVehicleId]);

  // Use real appointment data for services display
  const services =
    appointments.length > 0
      ? appointments.map((apt) => ({
          id: apt.id,
          name: apt.serviceName,
          status: apt.status,
          cost: `$${apt.cost}`,
        }))
      : [];

  // Customized projects/requests from customer (mock data)
  const projects = [
    {
      id: 1,
      name: "Custom Audio System Installation",
      status: "In Progress",
      cost: "$1200",
    },
    {
      id: 2,
      name: "Interior Leather Upgrade",
      status: "Pending",
      cost: "$2500",
    },
    { id: 3, name: "Custom Paint Job", status: "Completed", cost: "$1800" },
  ];

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
      <Sidebar role="customer" />
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-[#2a2a2a] border-b border-gray-700 p-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Welcome Back!</h1>
              <p className="text-gray-400 mt-1">
                Here's what's happening with your services today
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Status Indicator */}
              <div className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-2 rounded-lg">
                <span className="text-xs text-gray-500">Active:</span>
                <span className="text-xs font-bold text-blue-400">
                  C:{selectedCustomerId} V:{selectedVehicleId}
                </span>
              </div>

              {/* Customer/Vehicle Selector */}
              <div className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-2 rounded-lg">
                <label className="text-xs text-gray-400">Customer:</label>
                <input
                  type="text"
                  value={selectedCustomerId}
                  onChange={(e) => {
                    setSelectedCustomerId(e.target.value);
                    localStorage.setItem("customerId", e.target.value);
                  }}
                  className="w-12 bg-[#3a3a3a] text-white px-2 py-1 rounded text-xs border border-gray-600 focus:outline-none focus:border-red-500"
                />
              </div>
              <div className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-2 rounded-lg">
                <label className="text-xs text-gray-400">Vehicle:</label>
                <input
                  type="text"
                  value={selectedVehicleId}
                  onChange={(e) => {
                    setSelectedVehicleId(e.target.value);
                    localStorage.setItem("vehicleId", e.target.value);
                  }}
                  className="w-12 bg-[#3a3a3a] text-white px-2 py-1 rounded text-xs border border-gray-600 focus:outline-none focus:border-red-500"
                />
              </div>
              <button className="p-2 bg-[#1a1a1a] rounded-lg hover:bg-[#3a3a3a] transition">
                <Bell size={20} className="text-gray-400" />
              </button>
              <button className="p-2 bg-[#1a1a1a] rounded-lg hover:bg-[#3a3a3a] transition">
                <Settings size={20} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Stats Section - Using actual API data */}
          {dashboardData && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-[#2a2a2a] p-6 rounded-lg border border-gray-700 hover:border-gray-600 hover:shadow-lg hover:shadow-gray-700/20 transition">
                <p className="text-gray-400 text-sm font-medium mb-2">
                  Total Spent
                </p>
                <p className="text-3xl font-bold text-white">
                  ${dashboardData.totalSpent.toLocaleString()}
                </p>
                <p className="text-xs text-green-400 mt-2">Lifetime spending</p>
              </div>
              <div className="bg-[#2a2a2a] p-6 rounded-lg border border-gray-700 hover:border-gray-600 hover:shadow-lg hover:shadow-gray-700/20 transition">
                <p className="text-gray-400 text-sm font-medium mb-2">
                  Total Vehicles
                </p>
                <p className="text-3xl font-bold text-white">
                  {dashboardData.totalVehicles}
                </p>
                <p className="text-xs text-blue-400 mt-2">
                  Registered vehicles
                </p>
              </div>
              <div className="bg-[#2a2a2a] p-6 rounded-lg border border-gray-700 hover:border-gray-600 hover:shadow-lg hover:shadow-gray-700/20 transition">
                <p className="text-gray-400 text-sm font-medium mb-2">
                  Completed
                </p>
                <p className="text-3xl font-bold text-green-500">
                  {dashboardData.completedCount}
                </p>
                <p className="text-xs text-green-400 mt-2">
                  Services completed
                </p>
              </div>
              <div className="bg-[#2a2a2a] p-6 rounded-lg border border-gray-700 hover:border-gray-600 hover:shadow-lg hover:shadow-gray-700/20 transition">
                <p className="text-gray-400 text-sm font-medium mb-2">
                  Pending
                </p>
                <p className="text-3xl font-bold text-yellow-500">
                  {dashboardData.pendingCount}
                </p>
                <p className="text-xs text-yellow-400 mt-2">Awaiting service</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading dashboard data...</p>
            </div>
          )}

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Tracking & Services & Projects */}
            <div className="lg:col-span-2 space-y-8">
              {/* Real-Time Tracking */}
              <RealTimeTracking />

              {/* Services Section */}
              <div>
                <h2 className="text-2xl font-bold text-red-500 mb-6">
                  Standard Services
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="bg-[#2a2a2a] p-4 rounded-lg border border-gray-700 hover:border-gray-600 hover:shadow-lg hover:shadow-gray-700/20 transition group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-white text-sm flex-1 pr-2 group-hover:text-gray-200 transition">
                          {service.name}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                            service.status === "Completed"
                              ? "bg-green-500/20 text-green-400"
                              : service.status === "In Progress"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {service.status}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                          <div
                            className="bg-red-500 h-1.5 rounded-full transition-all duration-500"
                            style={{
                              width:
                                service.status === "Completed"
                                  ? "100%"
                                  : service.status === "In Progress"
                                  ? "65%"
                                  : "0%",
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Quick Info */}
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <span className="font-semibold text-red-400">
                          {service.cost}
                        </span>
                        <button className="text-red-500 hover:text-red-400 font-medium">
                          View →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects Section (Customized) */}
              <div>
                <h2 className="text-2xl font-bold text-purple-500 mb-6">
                  My Projects (Customized)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((project) => {
                    const progressMap = {
                      Completed: 100,
                      "In Progress": 65,
                      Pending: 20,
                    };
                    const progress =
                      progressMap[project.status as keyof typeof progressMap] ||
                      0;
                    return (
                      <div
                        key={project.id}
                        className="bg-[#2a2a2a] p-4 rounded-lg border border-gray-700 hover:border-gray-600 hover:shadow-lg hover:shadow-gray-700/20 transition group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-white text-sm flex-1 pr-2 group-hover:text-gray-200 transition">
                            {project.name}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                              project.status === "Completed"
                                ? "bg-green-500/20 text-green-400"
                                : project.status === "In Progress"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {project.status}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                            <div
                              className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Quick Info */}
                        <div className="flex justify-between items-center text-xs text-gray-400">
                          <span className="font-semibold text-purple-400">
                            {progress}%
                          </span>
                          <button className="text-purple-500 hover:text-purple-400 font-medium">
                            View →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Service History */}
              <ServiceHistory />
            </div>

            {/* Right Column - Activity Feed */}
            <div>
              <ActivityFeed />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
