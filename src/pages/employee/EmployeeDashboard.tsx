import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";

type MiniStat = { title: string; value: number; icon?: ReactNode };

type Appointment = {
  id: number;
  customer: string;
  start: string;
  end: string;
  status: string;
};
import EmployeeTracking from "../../components/EmployeeTracking";
import EmployeePerformance from "../../components/EmployeePerformance";
import { Bell, Settings } from "lucide-react";

export default function EmployeeDashboard() {
  const quickStats: MiniStat[] = [
    { title: "Active Assignments", value: 3, color: "text-blue-500" },
    { title: "Completed Today", value: 2, color: "text-green-500" },
    { title: "Hours Logged", value: "8.5h", color: "text-red-500" },
    { title: "Upcoming Services", value: 2 },
  ];

  const [appointments] = useState<Appointment[]>([
    { id: 1, customer: "John Doe", start: "2025-11-12T09:00:00Z", end: "2025-11-12T11:00:00Z", status: "Pending" },
    { id: 2, customer: "Alice Smith", start: "2025-11-12T12:00:00Z", end: "2025-11-12T13:30:00Z", status: "Approved" },
    { id: 3, customer: "Sam Turner", start: "2025-11-13T08:30:00Z", end: "2025-11-13T09:30:00Z", status: "Pending" },
  ]);

  const [pendingServices] = useState([
    { id: 1, customer: "John Doe", type: "Full", start: "2025-11-12T09:00:00Z" },
    { id: 3, customer: "Sam Turner", type: "Custom", start: "2025-11-13T08:30:00Z" },
  ]);

  const upcoming = useMemo(() => appointments.slice(0, 5), [appointments]);

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
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#2a2a2a] p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
            <ul className="space-y-3">
              {upcoming.map(a => (
                <li key={a.id} className="flex items-center justify-between p-3 bg-[#161616] rounded">
                  <div>
                    <div className="font-medium">{a.customer}</div>
                    <div className="text-sm text-gray-400">{new Date(a.start).toLocaleString()} - {new Date(a.end).toLocaleString()}</div>
                  </div>
                  <div className="text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${a.status === 'Pending' ? 'bg-yellow-600 text-black' : a.status === 'Approved' ? 'bg-green-600' : 'bg-gray-600'}`}>{a.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#2a2a2a] p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Pending Services</h2>
            <ul className="space-y-3">
              {pendingServices.map(s => (
                <li key={s.id} className="flex items-center justify-between p-3 bg-[#161616] rounded">
                  <div>
                    <div className="font-medium">{s.customer}</div>
                    <div className="text-sm text-gray-400">{s.type} • {new Date(s.start).toLocaleString()}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link to="/employee/services" className="text-sm bg-green-600 px-2 py-1 rounded">View</Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
