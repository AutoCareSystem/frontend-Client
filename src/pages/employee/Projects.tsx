import Sidebar from "../../components/Sidebar";
import { useMemo, useState, useEffect } from "react";
import { fetchProjects, type ProjectDto } from "../../api/projects";
import { updateAppointmentStatus } from "../../api/appointments";
import { useToast } from '../../components/ToastProvider';
import { CalendarDays, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ProjectItem = {
  id: number;
  name: string;
  customerName: string;
  start: string;
  end: string;
  description?: string;
  status: "Pending" | "Approved" | "Completed" | "Rejected";
  raw?: any;
};

export default function Projects() {
  const toast = useToast();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const clean = (v: any) => {
    if (v == null) return "";
    const s = String(v).trim();
    if (s.toLowerCase() === "string") return "";
    return s;
  };

  const [selected, setSelected] = useState<ProjectItem | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "completed" | "rejected"
  >("all");

  const canApprove = (proj: ProjectItem) => {
    const start = new Date(proj.start).getTime();
    const end = new Date(proj.end).getTime();
    return !projects.some(
      (p) =>
        p.status === "Approved" &&
        p.id !== proj.id &&
        new Date(p.start).getTime() < end &&
        new Date(p.end).getTime() > start
    );
  };

  const approveProject = async (id: number) => {
    try {
      await updateAppointmentStatus(id, 'Approved');
      setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'Approved' } : p)));
    } catch (err: any) {
      toast.show('Failed to approve project: ' + (err?.message || String(err)), 'error');
    }
  };

  const rejectProject = async (id: number) => {
    try {
      await updateAppointmentStatus(id, 'Rejected');
      setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'Rejected' } : p)));
    } catch (err: any) {
      toast.show('Failed to reject project: ' + (err?.message || String(err)), 'error');
    }
  };

  const completeProject = async (id: number) => {
    try {
      await updateAppointmentStatus(id, 'Completed');
      setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'Completed' } : p)));
    } catch (err: any) {
      toast.show('Failed to complete project: ' + (err?.message || String(err)), 'error');
    }
  };

  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        if (filter !== "all" && p.status.toLowerCase() !== filter) return false;
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.customerName.toLowerCase().includes(q) ||
          (p.description ?? "").toLowerCase().includes(q)
        );
      }),
    [projects, query, filter]
  );

  useEffect(() => {
    if (selected) {
      const found = projects.find((p) => p.id === selected.id) || null;
      setSelected(found);
    }
  }, [projects]);

  // Load projects from backend
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchProjects();
        if (!mounted) return;
        const mapped: ProjectItem[] = res.map((p: ProjectDto, idx) => {
          const statusStr = (p.status ?? "").toString().toLowerCase();
          const status: ProjectItem["status"] = statusStr.includes("pending")
            ? "Pending"
            : statusStr.includes("approved")
            ? "Approved"
            : statusStr.includes("complete")
            ? "Completed"
            : statusStr.includes("reject")
            ? "Rejected"
            : "Pending";

          return {
            id: (p.raw && (p.raw.id ?? p.raw.projectId)) ?? p.appointmentID ?? idx,
            name: p.projectTitle ?? p.raw?.projectTitle ?? p.raw?.title ?? "Untitled Project",
            customerName: p.customerDisplay ?? p.raw?.customer ?? "Unknown",
            start: p.startDate ?? new Date().toISOString(),
            end: p.endDate ?? p.raw?.due ?? new Date().toISOString(),
            description: p.projectDescription ?? p.raw?.projectDescription ?? "",
            status,
            raw: p.raw ?? p,
          };
        });

        setProjects(mapped);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message ?? String(err) ?? "Failed to load projects");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    load();

    // expose simple reload via window for quick manual retry during dev
    (window as any).__reloadProjects = load;

    return () => {
      mounted = false;
      (window as any).__reloadProjects = undefined;
    };
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#0c0e10] to-[#161a1d] text-gray-100">
      <Sidebar role="employee" />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-red-400 tracking-tight">
                Projects
              </h1>
              <p className="text-sm text-gray-400">
                Manage and track work orders efficiently.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-[#0b0c0d]/70 px-4 py-2 rounded-lg border border-gray-800">
              <span className="text-gray-400 text-sm">Total</span>
              <span className="text-xl font-semibold text-red-400">
                {loading ? "Loading..." : projects.length}
              </span>
            </div>
          </header>

          {/* Search + Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects or customers"
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-[#0b0c0d]/60 border border-gray-800 focus:ring-1 focus:ring-red-500 outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(["all", "pending", "approved", "completed", "rejected"] as const)
                .map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 text-sm rounded-full transition-all border ${
                      filter === f
                        ? "bg-red-500 text-white border-red-500"
                        : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-500"
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
            </div>
          </div>

          {error && (
            <div className="col-span-full p-4 bg-red-700/10 border border-red-800 text-red-300 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <strong className="mr-2">Failed to load projects:</strong>
                  <span className="text-sm">{error}</span>
                </div>
                <div>
                  <button
                    onClick={() => (window as any).__reloadProjects?.()}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md text-sm"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Project Cards - full width stacked list */}
          <div className="space-y-6">
            <AnimatePresence>
              {loading ? (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full p-6 bg-[#0b0c0d]/60 rounded-xl border border-gray-800 text-gray-400 text-center"
                >
                  Loading projects...
                </motion.div>
              ) : filtered.length === 0 ? (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full p-6 bg-[#0b0c0d]/60 rounded-xl border border-gray-800 text-gray-400 text-center"
                >
                  No projects found. Try adjusting your filters.
                </motion.div>
              ) : (
                filtered.map((p) => (
                  <div key={p.id}>
                    <motion.article
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="w-full bg-[#0b0c0d]/70 p-5 rounded-2xl border border-gray-800 shadow-md hover:shadow-red-900/30 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{p.name}</h3>
                          <p className="text-sm text-gray-400">{clean(p.customerName) || p.customerName}</p>
                          <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                            <CalendarDays size={14} />
                            {new Date(p.start).toLocaleString()} —{" "}
                            {new Date(p.end).toLocaleString()}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            p.status === "Pending"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : p.status === "Approved"
                              ? "bg-green-500/20 text-green-400"
                              : p.status === "Completed"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>

                      <p className="text-sm text-gray-300 mt-3 line-clamp-3">
                        {clean(p.description) || p.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          onClick={() => setSelected(p)}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm"
                        >
                          View
                        </button>
                        {p.status === "Pending" && (
                          <>
                            <button
                              onClick={() =>
                                canApprove(p)
                                  ? approveProject(p.id)
                                  : toast.show(
                                      "Time conflict with an existing approved project.",
                                      'warning'
                                    )
                              }
                              className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectProject(p.id)}
                              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {p.status === "Approved" && (
                          <button
                            onClick={() => completeProject(p.id)}
                            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm"
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </motion.article>

                    {/* Inline details rendered only under the selected project */}
                    {selected && selected.id === p.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="mt-4 p-6 bg-[#0b0c0d]/80 rounded-2xl border border-gray-800 shadow-md"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h2 className="text-2xl font-semibold">
                              {selected.name}
                            </h2>
                            <p className="text-sm text-gray-400">
                              Customer: {clean(selected.customerName) || selected.customerName}
                            </p>
                            {clean(selected.raw?.customer?.user?.email) || clean(selected.raw?.customer?.email) ? (
                              <p className="text-sm text-gray-400">Contact: {clean(selected.raw?.customer?.user?.email) || clean(selected.raw?.customer?.email)}</p>
                            ) : null}
                            <div className="text-xs text-gray-500 mt-2">
                              {new Date(selected.start).toLocaleString()} —{" "}
                              {new Date(selected.end).toLocaleString()}
                            </div>
                            <p className="text-gray-300 mt-4">{clean(selected.description) || selected.description}</p>

                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-3 bg-[#0b0c0d]/70 rounded">
                                <h4 className="text-sm text-gray-300 mb-2">Appointment & Project</h4>
                                <div className="text-sm text-gray-400">
                                  <div><strong>Type:</strong> {clean(selected.raw?.appointmentType) || clean(selected.raw?.appointmentType) || '—'}</div>
                                  <div><strong>Status:</strong> {clean(selected.raw?.status) || selected.status}</div>
                                  <div><strong>Start:</strong> {selected.raw?.startDate ? new Date(selected.raw.startDate).toLocaleString() : new Date(selected.start).toLocaleString()}</div>
                                  <div><strong>End:</strong> {selected.raw?.endDate ? new Date(selected.raw.endDate).toLocaleString() : new Date(selected.end).toLocaleString()}</div>
                                  <div className="mt-2"><strong>Project Title:</strong> {clean(selected.raw?.projectDetails?.projectTitle) || clean(selected.raw?.projectTitle) || selected.name}</div>
                                  <div className="mt-1 text-gray-300"><strong>Description:</strong> {clean(selected.raw?.projectDetails?.projectDescription) || clean(selected.description) || '—'}</div>
                                </div>
                              </div>

                              <div className="p-3 bg-[#0b0c0d]/70 rounded">
                                <h4 className="text-sm text-gray-300 mb-2">Customer / Vehicle / Employee</h4>
                                <div className="text-sm text-gray-400 space-y-2">
                                  <div>
                                    <strong>Customer:</strong>
                                    <div className="text-gray-300">{clean(selected.raw?.customer?.user?.userName) || clean(selected.raw?.customer?.user?.fullName) || selected.customerName}</div>
                                    {clean(selected.raw?.customer?.user?.email) && <div className="text-xs text-gray-400">Email: {clean(selected.raw?.customer?.user?.email)}</div>}
                                    {clean(selected.raw?.customer?.address) && <div className="text-xs text-gray-400">Address: {clean(selected.raw?.customer?.address)}</div>}
                                    {selected.raw?.customer?.loyaltyPoints != null && (<div className="text-xs text-gray-400">Loyalty Points: {selected.raw.customer.loyaltyPoints}</div>)}
                                  </div>

                                  <div>
                                    <strong>Vehicle:</strong>
                                    <div className="text-gray-300">{clean(selected.raw?.vehicle?.plateNumber) || clean(selected.raw?.vehicle?.plate) || '—'}</div>
                                    <div className="text-xs text-gray-400">{clean(selected.raw?.vehicle?.model) || ''} {clean(selected.raw?.vehicle?.year) ? `• ${clean(selected.raw.vehicle.year)}` : ''}</div>
                                    {clean(selected.raw?.vehicle?.vin) && <div className="text-xs text-gray-400">VIN: {clean(selected.raw.vehicle.vin)}</div>}
                                  </div>

                                  <div>
                                    <strong>Assigned To:</strong>
                                    <div className="text-gray-300">{clean(selected.raw?.employee?.user?.userName) || clean(selected.raw?.employee?.user?.fullName) || clean(selected.raw?.employee?.position) || '—'}</div>
                                    {clean(selected.raw?.employee?.user?.email) && <div className="text-xs text-gray-400">Email: {clean(selected.raw?.employee?.user?.email)}</div>}
                                    {clean(selected.raw?.employee?.position) && <div className="text-xs text-gray-400">Position: {clean(selected.raw.employee.position)}</div>}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 p-3 bg-[#0b0c0d]/70 rounded">
                              <h4 className="text-sm text-gray-300 mb-2">Services & Pricing</h4>
                              <div className="text-sm text-gray-400 space-y-2">
                                {selected.raw?.serviceDetails?.servicePackage ? (
                                  <div>
                                    <div className="text-gray-300 font-semibold">Package: {clean(selected.raw.serviceDetails.servicePackage.name)}</div>
                                    <div className="text-xs text-gray-400">{clean(selected.raw.serviceDetails.servicePackage.description)}</div>
                                    <div className="text-xs text-gray-400">Price: {selected.raw.serviceDetails.servicePackage.price ?? selected.raw.totalPrice ?? '—'}</div>
                                    <div className="mt-2 space-y-1">
                                      {(selected.raw.serviceDetails.servicePackage.items || []).map((it: any, i: number) => (
                                        <div key={i} className="text-xs text-gray-300">• {clean(it.service?.title) || clean(it.service?.code) || 'Unknown Service'} — {it.service?.price ?? it.service?.price ?? '—'}</div>
                                      ))}
                                    </div>
                                  </div>
                                ) : null}

                                {Array.isArray(selected.raw?.appointmentServices) && selected.raw.appointmentServices.length > 0 ? (
                                  <div>
                                    <div className="text-gray-300 font-semibold">Appointment Services</div>
                                    <div className="mt-2 space-y-1">
                                      {selected.raw.appointmentServices.map((as: any, i: number) => (
                                        <div key={i} className="text-xs text-gray-300">• {clean(as.service?.title) || clean(as.service?.code) || 'Service'} — Price: {as.customPrice ?? as.service?.price ?? '—'}</div>
                                      ))}
                                    </div>
                                  </div>
                                ) : null}

                                <div className="pt-2 border-t border-gray-800 text-gray-300">
                                  <strong>Total Price:</strong> {selected.raw?.totalPrice ?? selected.raw?.serviceDetails?.servicePackage?.price ?? '—'}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            {selected.status === "Pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    canApprove(selected)
                                      ? approveProject(selected.id)
                                        : toast.show(
                                            "Time conflict with existing approved project.",
                                            'warning'
                                          )
                                  }
                                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => rejectProject(selected.id)}
                                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {selected.status === "Approved" && (
                              <button
                                onClick={() => completeProject(selected.id)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
                              >
                                Mark Complete
                              </button>
                            )}
                            <button
                              onClick={() => setSelected(null)}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md flex items-center gap-1"
                            >
                              <X size={16} /> Close
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Project details are rendered inline under selected project now */}
        </div>
      </main>
    </div>
  );
}
