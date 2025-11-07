import Sidebar from "../../components/Sidebar";
import { Fragment, useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAppointments, updateAppointmentStatus } from "../../api/appointments";
import type { AppointmentDto } from "../../api/appointments";

// Local fallback dataset used only when backend is unavailable
const DUMMY: AppointmentDto[] = [
  { id: 1, customer: "John Doe", startDate: "2025-10-29T10:00:00Z", endDate: "2025-10-29T11:00:00Z", type: "Service", status: "Pending", service: "Brake Replacement" },
  { id: 2, customer: "Alice Smith", startDate: "2025-10-30T14:00:00Z", endDate: "2025-10-30T16:00:00Z", type: "Project", status: "Approved", service: "Paint & Polish" },
  { id: 3, customer: "Sam Turner", startDate: "2025-10-31T09:30:00Z", endDate: "2025-10-31T10:30:00Z", type: "Service", status: "Completed", service: "Oil Change" },
  { id: 4, customer: "Linda Park", startDate: "2025-11-01T10:30:00Z", endDate: "2025-11-01T11:30:00Z", type: "Project", status: "Rejected", service: "Custom Fabrication" },
];

export default function Appointments() {
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [selected, setSelected] = useState<number | null>(null);

  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: any = {};
        if (typeFilter !== 'All') params.type = typeFilter;
        if (statusFilter !== 'All') params.status = statusFilter;
        const data = await fetchAppointments(Object.keys(params).length ? params : undefined);
        if (!mounted) return;
        setAppointments(data.map(d => ({ ...d })));
      } catch (err: any) {
        console.warn('fetchAppointments failed, falling back to local data', err?.message || err);
        if (!mounted) return;
        setError(err?.message || 'Failed to load appointments');
        setAppointments(DUMMY.map(d => ({ ...d })));
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [statusFilter, typeFilter]);

  const filteredList = useMemo(() => {
    // server-side filtered when possible; additionally allow client-side filtering if user types are 'All'
    return appointments.filter(a =>
      (statusFilter === 'All' || (a.status ?? 'Unknown') === statusFilter) &&
      (typeFilter === 'All' || (a.type ?? 'Unknown') === typeFilter)
    );
  }, [appointments, statusFilter, typeFilter]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "Approved":
        return "bg-green-500/20 text-green-400";
      case "Completed":
        return "bg-blue-500/20 text-blue-400";
      case "Rejected":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  const changeAppointmentStatus = async (appointmentId: number, status: 'Approved' | 'Rejected' | 'Completed') => {
    try {
      await updateAppointmentStatus(appointmentId, status);
      setAppointments(prev => prev.map(p => {
        const id = Number(p.id ?? p.appointmentID ?? 0);
        return id === appointmentId ? { ...p, status } : p;
      }));
    } catch (err: any) {
      alert('Failed to update appointment status: ' + (err?.message || String(err)));
    }
  };

  // Small helper: avoid rendering raw JSON objects stringified into the UI.
  const sanitize = (s?: string | undefined) => {
    if (!s) return undefined;
    const t = String(s).trim();
    if (t.startsWith('{') || t.startsWith('[')) return undefined;
    return t;
  };

  return (
    <div className="appointments-page flex h-screen bg-gradient-to-b from-[#0a0a0a] to-[#181818] text-gray-100">
      <Sidebar role="employee" />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500 mb-6 tracking-wide">
          Appointments
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-300">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#1c1c1c] border border-gray-700 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              {["All", "Pending", "Approved", "Completed", "Rejected"].map(
                (s) => (
                  <option key={s}>{s}</option>
                )
              )}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-300">Type:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[#1c1c1c] border border-gray-700 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              {["All", "Service", "Project"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#141414]/70 backdrop-blur-lg rounded-xl border border-gray-800 shadow-[0_0_15px_rgba(255,0,0,0.2)] overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#202020]/80 text-gray-300 uppercase tracking-wide">
              <tr>
                {["ID", "Customer", "Start", "Status", "Actions"].map((header) => (
                  <th key={header} className="px-5 py-3 font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-400">Loading appointments...</td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-red-500">{error}</td>
                </tr>
              )}
              {filteredList.length === 0 && !loading && !error ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-6 text-gray-400"
                  >
                    No appointments found.
                  </td>
                </tr>
              ) : (
                filteredList.map((a) => {
                  const rowId = Number(a.id ?? a.appointmentID ?? 0);
                  return (
                    <Fragment key={rowId}>
                      <motion.tr
                        layoutId={`row-${rowId}`}
                        whileHover={{ scale: 1.01 }}
                        className={`border-t border-gray-800 transition-all ${
                          selected === rowId ? "bg-[#202020]" : "hover:bg-[#1d1d1d]"
                        }`}
                      >
                        <td className="px-5 py-3">{rowId}</td>
                          <td className="px-5 py-3">
                            <div className="flex flex-col">
                              <span className="font-medium">{sanitize(a.customerDisplay) ?? sanitize(a.customer) ?? a.vehiclePlate ?? '-'}</span>
                              {a.vehiclePlate && (
                                <span className="text-xs text-gray-400">{a.vehiclePlate}</span>
                              )}
                            </div>
                          </td>
                        <td className="px-5 py-3">{a.startDate ? new Date(a.startDate).toLocaleString() : '-'}</td>
                        <td className="px-5 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(a.status)}`}>{a.status ?? '-'}</span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button
                            onClick={() => setSelected((prev) => (prev === rowId ? null : rowId))}
                            aria-expanded={selected === rowId}
                            className="px-3 py-1 bg-[#272727] hover:bg-[#2f2f2f] rounded-md text-sm"
                          >
                            {selected === rowId ? 'Hide' : 'View'}
                          </button>
                        </td>
                      </motion.tr>

                      {/* Inline Detail Row */}
                      <AnimatePresence>
                        {selected === rowId && (
                          <motion.tr
                            key={`details-${rowId}`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-[#161616]/80 border-t border-gray-800"
                          >
                            <td colSpan={7} className="px-8 py-5">
                              <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                                <div>
                                  <p>
                                    <span className="text-gray-400">Appointment ID:</span>{" "}{a.id ?? a.appointmentID}
                                  </p>
                                  <p>
                                    <span className="text-gray-400">Customer:</span>{" "}{sanitize(a.customerDisplay) ?? sanitize(a.customer) ?? a.vehiclePlate ?? '-'}
                                  </p>
                                  <p>
                                    <span className="text-gray-400">Type:</span>{" "}{a.type ?? '-'}
                                  </p>
                                  <p>
                                    <span className="text-gray-400">Service:</span>{" "}{a.serviceDisplay ?? '-'}
                                  </p>
                                  <p className="mt-2">
                                    <span className="text-gray-400">Description:</span>{" "}
                                    <span className="text-gray-300">{(a.raw?.serviceDetails?.servicePackage?.description) || (a.raw?.projectDetails?.projectDescription) || a.raw?.description || '-'}</span>
                                  </p>
                                </div>
                                <div>
                                  <p>
                                    <span className="text-gray-400">Start Time:</span>{" "}{a.startDate ? new Date(a.startDate).toLocaleString() : '-'}
                                  </p>
                                  <p>
                                    <span className="text-gray-400">End Time:</span>{" "}{a.endDate ? new Date(a.endDate).toLocaleString() : '-'}
                                  </p>
                                  <p className="mt-2">
                                    <span className="text-gray-400">Status:</span>{" "}
                                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(a.status)}`}>{a.status ?? '-'}</span>
                                  </p>
                                  <p className="mt-2">
                                    <span className="text-gray-400">Assigned To:</span>{" "}{a.raw?.employee?.user?.userName ?? a.raw?.employee?.userName ?? '-'}
                                  </p>
                                  <p className="mt-2">
                                    <span className="text-gray-400">Vehicle:</span>{" "}{a.raw?.vehicle ? `${a.raw.vehicle.model ?? ''} • ${a.raw.vehicle.plateNumber ?? a.raw.vehicle.plate ?? '-'}` : '-'}
                                  </p>
                                  <p className="mt-2">
                                    <span className="text-gray-400">Total Price:</span>{" "}{typeof a.totalPrice === 'number' ? `LKR ${a.totalPrice.toLocaleString()}` : '-'}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-4">
                                <h4 className="text-sm text-gray-300 mb-2">Service Items</h4>
                                {Array.isArray(a.raw?.appointmentServices) && a.raw.appointmentServices.length > 0 ? (
                                  <ul className="list-disc list-inside text-sm text-gray-300">
                                    {a.raw.appointmentServices.map((s: any, idx: number) => (
                                      <li key={s?.appointmentServiceID ?? idx}>
                                        {s?.service?.title ?? s?.service?.name ?? s?.serviceID ?? 'Service'} {s?.customPrice ? `— LKR ${s.customPrice}` : ''}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-sm text-gray-400">No service items listed.</p>
                                )}

                                <div className="mt-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    {a.status === 'Pending' && (
                                      <>
                                        <button
                                          onClick={() => changeAppointmentStatus(rowId, 'Approved')}
                                          className="bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded-md font-medium text-white"
                                        >
                                          Approve
                                        </button>
                                        <button
                                          onClick={() => changeAppointmentStatus(rowId, 'Rejected')}
                                          className="bg-gray-700 hover:bg-gray-600 transition px-4 py-2 rounded-md font-medium text-white"
                                        >
                                          Reject
                                        </button>
                                      </>
                                    )}
                                    {a.status === 'Approved' && (
                                      <button
                                        onClick={() => changeAppointmentStatus(rowId, 'Completed')}
                                        className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-md font-medium text-white"
                                      >
                                        Mark Complete
                                      </button>
                                    )}
                                    <button
                                      onClick={() => setSelected(null)}
                                      className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-md font-medium text-white"
                                    >
                                      Close
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
