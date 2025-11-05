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

export default function EmployeeDashboard() {
  const stats: MiniStat[] = [
    { title: "Active Projects", value: 5 },
    { title: "Hours Logged", value: 140 },
    { title: "Pending Tasks", value: 3 },
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
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-red-500">Employee Dashboard</h1>
          <div className="flex gap-3">
            <Link to="/employee/appointments" className="bg-[#2a2a2a] px-4 py-2 rounded hover:bg-red-600 transition">New Appointment</Link>
            <Link to="/employee/services" className="bg-[#2a2a2a] px-4 py-2 rounded hover:bg-red-600 transition">Services</Link>
            <Link to="/employee/projects" className="bg-[#2a2a2a] px-4 py-2 rounded hover:bg-red-600 transition">Projects</Link>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((s) => (
            <div key={s.title} className="bg-[#2a2a2a] p-6 rounded-xl shadow-md border border-gray-700">
              <h3 className="text-gray-400">{s.title}</h3>
              <p className="text-3xl font-bold mt-2 text-red-500">{s.value}</p>
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
