import Sidebar from "../../components/Sidebar";
import EmployeeTracking from "../../components/EmployeeTracking";
import EmployeePerformance from "../../components/EmployeePerformance";
import { Bell, Settings } from "lucide-react";

export default function EmployeeDashboard() {
  const quickStats = [
    { title: "Active Assignments", value: 3, color: "text-blue-500" },
    { title: "Completed Today", value: 2, color: "text-green-500" },
    { title: "Hours Logged", value: "8.5h", color: "text-red-500" },
  ];

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
      <Sidebar role="employee" />
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-[#2a2a2a] border-b border-gray-700 p-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Good Morning, John!
              </h1>
              <p className="text-gray-400 mt-1">
                You have 3 active assignments today
              </p>
            </div>
            <div className="flex items-center gap-4">
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
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {quickStats.map((stat) => (
              <div
                key={stat.title}
                className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-6 hover:shadow-lg hover:shadow-gray-700/20 transition group"
              >
                <p className="text-gray-400 text-sm mb-2">{stat.title}</p>
                <p
                  className={`text-3xl font-bold ${
                    stat.color
                  } group-hover:${stat.color.replace(
                    "text-",
                    "drop-shadow"
                  )} transition`}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Assignments */}
            <div className="lg:col-span-2">
              <EmployeeTracking />
            </div>

            {/* Right Column - Performance */}
            <div>
              <EmployeePerformance />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
