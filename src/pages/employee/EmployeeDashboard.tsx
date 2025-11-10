import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Breadcrumbs from "../../components/Breadcrumbs";
import { BarChart2, CalendarDays, ClipboardList, Users } from "lucide-react";
import SimpleBarChart from "../../components/charts/SimpleBarChart";
import SimpleLineChart from "../../components/charts/SimpleLineChart";
import { useToast } from '../../components/ToastProvider';
import { getEmployeeProfile } from '../../api/profile';
import { fetchAppointments } from '../../api/appointments';
import { fetchProjects } from '../../api/projects';
import { fetchServices } from '../../api/services';
import { getAllUsers } from '../../api/users';

type MiniStat = { title: string; value: number; icon?: any; color?: string; subtitle?: string };

export default function EmployeeDashboard() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        // Prefer EmployeeID in localStorage (newer key)
        const uidFromStorage = localStorage.getItem('EmployeeID') ?? localStorage.getItem('employeeID') ?? localStorage.getItem('employeeId') ?? localStorage.getItem('userId') ?? null;
        const profilePromise = uidFromStorage ? getEmployeeProfile(uidFromStorage) : Promise.resolve(null);

        const [p, appts, projs, svcs, usrs] = await Promise.all([
          profilePromise,
          fetchAppointments(),
          fetchProjects(),
          fetchServices(),
          getAllUsers(),
        ]);

        if (!mounted) return;
        if (p) setProfile(p);
        setAppointments(Array.isArray(appts) ? appts : []);
        setProjects(Array.isArray(projs) ? projs : []);
        setServices(Array.isArray(svcs) ? svcs : []);
        setUsers(Array.isArray(usrs) ? usrs : []);
      } catch (err: any) {
        console.error('[EmployeeDashboard] load failed', err);
        toast.show(err?.message || 'Failed to load dashboard data', 'error');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [toast]);

  // Derived counts
  const activeProjects = projects.filter(p => (p.status || '').toString().toLowerCase() === 'approved').length;
  const upcomingCount = appointments.filter(a => new Date(a.startDate ?? a.date ?? a.start) > new Date()).length;
  const completedCount = appointments.filter(a => (a.status || '').toString().toLowerCase() === 'completed').length;
  const employeeCount = users.filter(u => ((u.role || '') as string).toLowerCase().includes('employee') || ((u.source || '') as string).toLowerCase().includes('employee')).length;
  const customerCount = users.filter(u => ((u.role || '') as string).toLowerCase().includes('customer') || ((u.source || '') as string).toLowerCase().includes('customer')).length;
  const activeUsers = users.filter(u => u.isActive).length;

  const stats: MiniStat[] = [
    { title: "Active Projects", value: activeProjects, icon: ClipboardList, color: "from-yellow-400 to-yellow-600", subtitle: `${activeProjects} active` },
    { title: "Upcoming Appointments", value: upcomingCount, icon: CalendarDays, color: "from-green-400 to-green-600", subtitle: `${upcomingCount} scheduled` },
    { title: "Completed Appointments", value: completedCount, icon: BarChart2, color: "from-blue-400 to-blue-600", subtitle: `${completedCount} completed` },
    { title: "Team Members", value: employeeCount, icon: Users, color: "from-purple-400 to-purple-600", subtitle: `${employeeCount} employees` },
  ];

  // Short lists for tables
  const topProjects = projects.slice(0, 6);
  const topAppointments = appointments.slice(0, 6);
  const topServices = services.slice(0, 6);
  const recentUsers = users.slice(0, 6);

  const getInitials = (name?: string) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const statusColor = (status?: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('pending') || s.includes('requested')) return 'bg-yellow-500/10 text-yellow-400 border-yellow-700/30';
    if (s.includes('approved') || s.includes('completed') || s.includes('done')) return 'bg-green-500/10 text-green-400 border-green-700/30';
    if (s.includes('cancel') || s.includes('rejected') || s.includes('declined')) return 'bg-red-500/10 text-red-400 border-red-700/30';
    return 'bg-gray-700/10 text-gray-300 border-gray-700/30';
  };

  return (
    <div className="employee-dashboard flex h-screen bg-gradient-to-br from-[#0a0a0b] via-[#101113] to-[#16181b] text-gray-100 overflow-hidden">
      <Sidebar role="employee" />

  <main className="flex-1 p-6 md:p-8 overflow-y-auto overflow-x-hidden relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(255,0,0,0.06),transparent_40%)] blur-3xl"></div>

  <div className="max-w-7xl mx-auto space-y-8 rounded-xl">
    <Breadcrumbs className="mb-2" />
          {/* Header */}
          <motion.header
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent drop-shadow-lg">
                Welcome back{profile ? `, ${profile.userName ?? profile.name ?? ''}` : ''}
              </h1>
              <p className="text-sm text-gray-400 mt-2">
                {profile?.position ?? 'Technician'} • Hourly Rate: <span className="text-red-400 font-semibold">{profile?.hourlyRate ?? '12000'} LKR</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Total Users tiles */}
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-[#0f1112]/80 border border-[#1f2124] rounded-xl p-3 text-center min-w-[95px]">
                  <div className="text-xs text-gray-400">Total Users</div>
                  <div className="text-lg font-semibold mt-1">{users.length}</div>
                </div>
                <div className="bg-[#0f1112]/80 border border-[#1f2124] rounded-xl p-3 text-center min-w-[95px]">
                  <div className="text-xs text-gray-400">Employees</div>
                  <div className="text-lg font-semibold mt-1">{employeeCount}</div>
                </div>
                <div className="bg-[#0f1112]/80 border border-[#1f2124] rounded-xl p-3 text-center min-w-[95px]">
                  <div className="text-xs text-gray-400">Customers</div>
                  <div className="text-lg font-semibold mt-1">{customerCount}</div>
                </div>
                <div className="bg-[#0f1112]/80 border border-[#1f2124] rounded-xl p-3 text-center min-w-[95px]">
                  <div className="text-xs text-gray-400">Active Users</div>
                  <div className="text-lg font-semibold mt-1">{activeUsers}</div>
                </div>
              </div>
            </div>
          </motion.header>

          {/* Profile + Stats Row */}
          <motion.section className="grid grid-cols-1 lg:grid-cols-3 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            {/* Profile card */}
            <div className="lg:col-span-1 bg-[#111214]/90 border border-[#2a2b30] rounded-2xl p-6 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                  {profile?.userName ? (profile.userName[0] || '').toUpperCase() : 'S'}
                </div>
                <div>
                  <div className="text-xl font-semibold">{profile?.userName ?? profile?.name ?? '—'}</div>
                  <div className="text-sm text-gray-400">{profile?.position ?? 'Technician'}</div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-300">
                  <div>Total Appointments</div>
                  <div className="font-medium">{appointments.length}</div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-300">
                  <div>Completed</div>
                  <div className="font-medium">{completedCount}</div>
                </div>

                <div className="mt-2">
                  <div className="h-2 bg-[#0b0b0c] rounded-full overflow-hidden">
                    <div style={{ width: `${appointments.length ? Math.round((completedCount / appointments.length) * 100) : 0}%` }} className="h-full bg-gradient-to-r from-green-400 to-green-600" />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{appointments.length ? `${Math.round((completedCount / appointments.length) * 100)}% completed` : 'No data'}</div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Link to="/employee/profile" className="flex-1 bg-[#1f2226] px-3 py-2 rounded-md text-sm text-white border border-[#2a2b30] text-center">Edit Profile</Link>
                  <Link to="/employee/appointments" className="flex-1 bg-gradient-to-r from-red-500 to-red-700 px-3 py-2 rounded-md text-sm text-white text-center">View Schedule</Link>
                </div>
              </div>
            </div>

            {/* Stats cards */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={s.title} className={`p-[1px] rounded-2xl bg-gradient-to-br ${s.color} shadow-[0_8px_20px_rgba(0,0,0,0.6)]`}>
                  <div className="bg-gradient-to-br from-[#0f1112] to-[#0b0c0d] rounded-2xl p-4 h-full flex flex-col justify-between border border-black/30">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide">{s.title}</div>
                        <div className="text-3xl font-extrabold mt-1">{s.value}</div>
                        <div className="text-xs text-gray-400 mt-2">{s.subtitle}</div>
                      </div>
                      <div className="p-3 bg-black/30 rounded-lg shadow-inner">
                        <s.icon size={22} />
                      </div>
                    </div>
                    <div className="mt-3 opacity-90"><SimpleLineChart data={[2,4,3,6,5,7]} color="#f97373" /></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Recent team members */}
          <motion.section className="bg-[#111214]/90 border border-[#2a2b30] rounded-2xl p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold">Recent Team Members</h4>
              <Link to="/employee/users" className="text-xs text-gray-300 underline">Manage team</Link>
            </div>
            <div className="flex items-center gap-3 overflow-x-hidden py-2 flex-wrap">
              {recentUsers.length ? recentUsers.map((u:any) => (
                <div key={u.id} className="flex items-center gap-2 bg-[#0d0e10]/60 border border-[#1a1b1d] rounded-full px-3 py-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white font-semibold">{getInitials(u.userName ?? u.name ?? u.email)}</div>
                  <div className="text-sm">
                    <div className="font-medium">{u.userName ?? u.name ?? u.email}</div>
                    <div className="text-xs text-gray-400">{(u.role ?? u.source ?? 'Customer')}</div>
                  </div>
                </div>
              )) : (
                <div className="text-sm text-gray-400">No team members found</div>
              )}
            </div>
          </motion.section>

          {/* Charts */}
          <motion.section className="grid grid-cols-1 lg:grid-cols-3 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="lg:col-span-2 bg-[#111214]/90 border border-[#2a2b30] rounded-2xl p-6 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Appointments Trend</h2>
                <span className="text-sm text-gray-400">Last 6 months</span>
              </div>
              <SimpleBarChart data={[12, 18, 10, 22, 28, 16]} labels={["Jun","Jul","Aug","Sep","Oct","Nov"]} height={150} color="#ef4444" />
            </div>

            <div className="bg-[#111214]/90 border border-[#2a2b30] rounded-2xl p-6 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Monthly Revenue</h2>
                <span className="text-sm text-gray-400">LKR</span>
              </div>
              <SimpleBarChart data={[80,120,90,140,165,130]} labels={["Jun","Jul","Aug","Sep","Oct","Nov"]} height={150} color="#6366f1" />
            </div>
          </motion.section>

          {/* Summary Tables */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-[#111214]/90 border border-[#2a2b30] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Projects</h3>
                <Link to="/employee/projects" className="text-sm text-gray-300 underline">View all</Link>
              </div>
              <div className="overflow-x-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs text-gray-400 border-b border-[#2a2b30]">
                      <th className="py-2">Title</th>
                      <th className="py-2">Customer</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProjects.map((p:any) => (
                      <tr key={p.id} className="hover:bg-[#1a1b1d]">
                        <td className="py-2 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-black font-semibold text-sm">{getInitials(p.customer ?? p.customerName)}</div>
                            <div className="font-medium">{p.title}</div>
                          </div>
                        </td>
                        <td className="py-2 pr-4 text-gray-300">{p.customer ?? p.customerName}</td>
                        <td className="py-2 pr-4"><span className={`px-2 py-1 text-xs rounded-full font-semibold border ${statusColor(p.status)}`}>{p.status ?? '-'}</span></td>
                        <td className="py-2 pr-4 text-gray-300">{p.due ?? p.endDate ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-[#111214]/90 border border-[#2a2b30] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recent Appointments</h3>
                <Link to="/employee/appointments" className="text-sm text-gray-300 underline">View all</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs text-gray-400 border-b border-[#2a2b30]">
                      <th className="py-2">Service</th>
                      <th className="py-2">Customer</th>
                      <th className="py-2">Date</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topAppointments.map((a:any) => (
                      <tr key={a.id} className="hover:bg-[#1a1b1d]">
                        <td className="py-2 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">{getInitials(a.customer ?? a.customerName)}</div>
                            <div className="font-medium">{a.title ?? a.serviceName}</div>
                          </div>
                        </td>
                        <td className="py-2 pr-4 text-gray-300">{a.customer ?? a.customerName}</td>
                        <td className="py-2 pr-4">{a.date ? new Date(a.date).toLocaleString() : a.startDate ? new Date(a.startDate).toLocaleString() : '-'}</td>
                        <td className="py-2 pr-4"><span className={`px-2 py-1 text-xs rounded-full font-semibold border ${statusColor(a.status)}`}>{a.status ?? '-'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-[#111214]/90 border border-[#2a2b30] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Services</h3>
                <Link to="/employee/services" className="text-sm text-gray-300 underline">View all</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs text-gray-400 border-b border-[#2a2b30]">
                      <th className="py-2">Service</th>
                      <th className="py-2">Customer</th>
                      <th className="py-2">Date</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topServices.map((s:any) => (
                      <tr key={s.id} className="hover:bg-[#1a1b1d]">
                        <td className="py-2 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">{getInitials(s.customer ?? s.customerName)}</div>
                            <div className="font-medium">{s.title}</div>
                          </div>
                        </td>
                        <td className="py-2 pr-4 text-gray-300">{s.customer}</td>
                        <td className="py-2 pr-4">{s.date ? new Date(s.date).toLocaleString() : '-'}</td>
                        <td className="py-2 pr-4"><span className={`px-2 py-1 text-xs rounded-full font-semibold border ${statusColor(s.status)}`}>{s.status ?? '-'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-[#111214]/90 border border-[#2a2b30] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Users</h3>
                <Link to="/employee/users" className="text-sm text-gray-300 underline">Manage</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs text-gray-400 border-b border-[#2a2b30]">
                      <th className="py-2">Name</th>
                      {/* <th className="py-2">Email</th> */}
                      <th className="py-2">Role</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((u:any) => (
                      <tr key={u.id} className="hover:bg-[#1a1b1d]">
                        <td className="py-2 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">{getInitials(u.userName ?? u.name ?? u.email)}</div>
                            <div className="font-medium">{u.userName ?? u.name ?? u.email}</div>
                          </div>
                        </td>
                        {/* <td className="py-2 pr-4 text-gray-300">{u.email}</td> */}
                        <td className="py-2 pr-4">{u.role ?? u.source ?? 'Customer'}</td>
                        <td className="py-2 pr-4"><span className={`px-2 py-1 text-xs rounded-full font-semibold border ${u.isActive ? 'bg-green-500/10 text-green-400 border-green-700/30' : 'bg-red-500/10 text-red-400 border-red-700/30'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Floating Add Button */}
          <motion.div className="fixed bottom-8 right-8" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
            <Link to="/employee/services/add" className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-700 px-6 py-3 rounded-full shadow-lg shadow-red-800/40 hover:shadow-red-600/60 text-white font-semibold">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="hidden md:inline">Add Service</span>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
