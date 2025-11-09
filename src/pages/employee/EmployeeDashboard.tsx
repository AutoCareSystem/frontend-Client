import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useMemo, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getEmployeeProfile } from "../../api/profile";
import { fetchProjects } from "../../api/projects";
import { fetchServices } from "../../api/services";
import type { EmployeeProfileDto } from "../../api/profile";

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
  const [profile, setProfile] = useState<EmployeeProfileDto | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // derived stats
  const stats: MiniStat[] = [
    { title: "Active Projects", value: projects.length },
    { title: "Total Appointments", value: profile?.totalAppointments ?? 0 },
    { title: "Completed Appointments", value: profile?.completedAppointments ?? 0 },
    { title: "Upcoming Services", value: profile?.recentAppointments ? profile.recentAppointments.filter((r: any) => r.appointmentType?.toLowerCase?.() === 'service').length : 0 },
  ];

  const upcoming = useMemo(() => (profile?.recentAppointments ?? []).slice(0, 5), [profile]);

  // derive pending services from recent appointments (backend shape may vary)
  const pendingServices = useMemo(() => {
    const items = profile?.recentAppointments ?? [];
    return items.filter((r: any) => (r.appointmentType?.toLowerCase?.() === 'service' || (r.AppointmentType && String(r.AppointmentType).toLowerCase() === 'service')) && (String(r.status || r.Status || '').toLowerCase() === 'pending'));
  }, [profile]);

  // quickStats used by the quick stats cards in the UI (includes a color field used in classNames)
  const quickStats = [
    { title: "Active Projects", value: projects.length, color: "text-red-500" },
    { title: "Pending Services", value: pendingServices.length, color: "text-yellow-500" },
    { title: "Completed Appointments", value: profile?.completedAppointments ?? 0, color: "text-green-500" },
  ];

  useEffect(() => {
    let mounted = true;

    function getUserIdFromToken(): string | null {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) return null;
        const parts = token.split('.');
        if (parts.length < 2) return null;
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        const id = payload.userId ?? payload.userID ?? payload.sub ?? payload.nameid ?? null;
        return id == null ? null : String(id);
      } catch {
        return null;
      }
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const uidFromStorage = localStorage.getItem('userId');
        const uid = uidFromStorage ? uidFromStorage : getUserIdFromToken();
        if (!uid) {
          throw new Error('No userId available. Please sign in.');
        }

        const [prof, projs, servs] = await Promise.all([
          getEmployeeProfile(uid),
          fetchProjects().catch(() => []),
          fetchServices().catch(() => []),
        ]);

        if (!mounted) return;
        setProfile(prof as EmployeeProfileDto);
        setProjects(projs ?? []);
        setServices(servs ?? []);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || 'Failed to load dashboard data');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
      <Sidebar role="Employee" />
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

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#2a2a2a] p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
            <ul className="space-y-3">
              {upcoming.map((a: any, idx: number) => {
                const customerName = a.customerName || a.CustomerName || (a.customer && a.customer.user && a.customer.user.name) || 'Unknown';
                const dateStr = a.date || a.Date || a.startDate || a.start || null;
                const endStr = a.endDate || a.EndDate || a.end || null;
                const status = a.status || a.Status || 'Pending';

                return (
                  <li key={a.appointmentID ?? a.AppointmentID ?? idx} className="flex items-center justify-between p-3 bg-[#161616] rounded">
                    <div>
                      <div className="font-medium">{customerName}</div>
                      <div className="text-sm text-gray-400">{dateStr ? `${new Date(dateStr).toLocaleString()}${endStr ? ' - ' + new Date(endStr).toLocaleString() : ''}` : 'No date'}</div>
                    </div>
                    <div className="text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${String(status).toLowerCase() === 'pending' ? 'bg-yellow-600 text-black' : String(status).toLowerCase() === 'approved' ? 'bg-green-600' : 'bg-gray-600'}`}>{status}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="bg-[#2a2a2a] p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Pending Services</h2>
            <ul className="space-y-3">
              {pendingServices.map((s: any, i: number) => {
                const customerName = s.customerName || s.CustomerName || (s.customer && s.customer.user && s.customer.user.name) || 'Unknown';
                const type = s.appointmentType || s.AppointmentType || s.appointmentType || 'Service';
                const dateStr = s.date || s.Date || s.startDate || null;
                return (
                  <li key={s.appointmentID ?? s.AppointmentID ?? i} className="flex items-center justify-between p-3 bg-[#161616] rounded">
                    <div>
                      <div className="font-medium">{customerName}</div>
                      <div className="text-sm text-gray-400">{type} • {dateStr ? new Date(dateStr).toLocaleString() : 'No date'}</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link to="/employee/services" className="text-sm bg-green-600 px-2 py-1 rounded">View</Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
