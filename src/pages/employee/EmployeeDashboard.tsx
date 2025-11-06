import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { BarChart2, CalendarDays, ClipboardList, Users } from "lucide-react";
import StatsCard from "../../components/StatsCard";
import SimpleBarChart from "../../components/charts/SimpleBarChart";
import SimpleLineChart from "../../components/charts/SimpleLineChart";

type MiniStat = { title: string; value: number; icon?: any; color?: string };

export default function EmployeeDashboard() {
  const [profile] = useState({
    name: "Shireen Shamil",
    position: "Senior Technician",
    hourlyRate: 1200,
    totalAppointments: 128,
    completedAppointments: 110,
  });

  const mockProjects = [
    { id: 1, title: "Engine Overhaul - Project A", customer: "John Doe", status: "Approved", due: "2025-11-05" },
    { id: 2, title: "Paint & Polish - Job 12", customer: "Acme Corp", status: "Pending", due: "2025-11-10" },
    { id: 3, title: "Brake Replacement", customer: "Sarah Fernando", status: "Approved", due: "2025-11-02" },
  ];

  const mockAppointments = [
    { id: 101, title: "Full Car Service", customer: "Kevin Perera", date: "2025-11-12T09:00:00Z", status: "Approved" },
    { id: 102, title: "Brake Inspection", customer: "Sarah Fernando", date: "2025-11-13T11:00:00Z", status: "Pending" },
    { id: 103, title: "Engine Diagnostics", customer: "John Doe", date: "2025-11-14T14:00:00Z", status: "Approved" },
  ];

  const mockServices = [
    { id: 201, title: "Full Car Service", customer: "Kevin Perera", date: "2025-11-12T09:00:00Z", status: "Approved" },
    { id: 202, title: "Interior Cleaning", customer: "Sara Lee", date: "2025-11-15T10:00:00Z", status: "Pending" },
  ];

  const stats: MiniStat[] = [
    { title: "Active Projects", value: mockProjects.filter(p => p.status === "Approved").length, icon: ClipboardList, color: "from-yellow-400 to-yellow-600" },
    { title: "Upcoming Appointments", value: mockAppointments.filter(a => new Date(a.date) > new Date()).length, icon: CalendarDays, color: "from-green-400 to-green-600" },
    { title: "Completed Appointments", value: profile.completedAppointments, icon: BarChart2, color: "from-blue-400 to-blue-600" },
    { title: "Team Members", value: 6, icon: Users, color: "from-purple-400 to-purple-600" },
  ];

  const upcoming = useMemo(() => mockAppointments.slice(0, 5), []);
  const pendingServices = useMemo(() => mockServices.filter(s => s.status === "Pending"), []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0a0a0b] via-[#101113] to-[#16181b] text-gray-100 overflow-hidden">
      <Sidebar role="employee" />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto relative">
        {/* Glow background */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(255,0,0,0.08),transparent_50%)] blur-3xl"></div>

        <div className="max-w-7xl mx-auto space-y-10">
          {/* Header */}
          <motion.header
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent drop-shadow-lg">
                Welcome back, {profile.name}
              </h1>
              <p className="text-sm text-gray-400 mt-2">
                {profile.position} • Hourly Rate:{" "}
                <span className="text-red-400 font-semibold">{profile.hourlyRate} LKR</span>
              </p>
            </div>

            <div className="flex gap-3">
              {["Services", "Projects", "Appointments"].map((label) => (
                <Link
                  key={label}
                  to={`/employee/${label.toLowerCase()}`}
                  className="bg-[#1e1f24]/60 backdrop-blur-md border border-[#2a2b30] px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white hover:shadow-red-600/40 transition-all"
                >
                  {label}
                </Link>
              ))}
            </div>
          </motion.header>

          {/* Stats Section */}
          <motion.section
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.title}
                className={`p-[1px] rounded-2xl bg-gradient-to-br ${s.color} shadow-lg hover:shadow-xl transition-transform hover:scale-[1.03]`}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div className="bg-[#111214]/90 rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm text-gray-400">{s.title}</h3>
                      <div className="text-3xl font-semibold mt-1">{s.value}</div>
                    </div>
                    <div className="p-3 bg-black/40 rounded-xl">
                      <s.icon size={22} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <SimpleLineChart
                      data={[2, 3, 4, 6, 5, 7]}
                      color={
                        (s.color ?? "").includes("blue")
                          ? "#3b82f6"
                          : (s.color ?? "").includes("green")
                          ? "#22c55e"
                          : (s.color ?? "").includes("yellow")
                          ? "#eab308"
                          : "#a855f7"
                      }
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.section>

          {/* Charts */}
          <motion.section
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <div className="lg:col-span-2 bg-[#111214]/90 border border-[#2a2b30] rounded-2xl p-6 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Appointments Trend</h2>
                <span className="text-sm text-gray-400">Last 6 months</span>
              </div>
              <SimpleBarChart
                data={[12, 18, 10, 22, 28, 16]}
                labels={["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"]}
                height={150}
                color="#ef4444"
              />
            </div>

            <div className="bg-[#111214]/90 border border-[#2a2b30] rounded-2xl p-6 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Monthly Revenue</h2>
                <span className="text-sm text-gray-400">LKR</span>
              </div>
              <SimpleBarChart
                data={[80, 120, 90, 140, 165, 130]}
                labels={["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"]}
                height={150}
                color="#6366f1"
              />
            </div>
          </motion.section>

          {/* Upcoming & Pending */}
          <motion.section
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <div className="lg:col-span-2 bg-[#111214]/90 border border-[#2a2b30] rounded-2xl p-6 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
                <Link to="/employee/appointments" className="text-sm text-gray-300 underline">
                  View all
                </Link>
              </div>

              <ul className="space-y-3">
                {upcoming.map((a) => (
                  <motion.li
                    key={a.id}
                    className="flex items-center justify-between p-4 bg-[#16181b]/80 rounded-xl hover:bg-[#1e2024] transition-all"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div>
                      <div className="font-medium">{a.title}</div>
                      <div className="text-sm text-gray-400">
                        {a.customer} • {new Date(a.date).toLocaleString()}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        a.status === "Pending"
                          ? "bg-yellow-400/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {a.status}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="bg-[#111214]/90 border border-[#2a2b30] rounded-2xl p-6 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Pending Services</h2>
                <Link to="/employee/services" className="text-sm text-gray-300 underline">
                  Manage
                </Link>
              </div>

              <ul className="space-y-3">
                {pendingServices.map((s) => (
                  <motion.li
                    key={s.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-4 bg-[#16181b]/80 rounded-xl hover:bg-[#1e2024] transition"
                  >
                    <div>
                      <div className="font-medium">{s.title}</div>
                      <div className="text-sm text-gray-400">
                        {s.customer} • {new Date(s.date).toLocaleString()}
                      </div>
                    </div>
                    <button className="bg-gradient-to-r from-green-500 to-green-700 px-4 py-1 rounded-md text-sm font-semibold hover:scale-105 transition">
                      Assign
                    </button>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.section>

          {/* Floating Add Button */}
          <motion.div
            className="fixed bottom-8 right-8"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/employee/services/add"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-700 px-6 py-3 rounded-full shadow-lg shadow-red-800/40 hover:shadow-red-600/60 text-white font-semibold"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="hidden md:inline">Add Service</span>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
