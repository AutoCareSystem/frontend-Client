import Sidebar from "../../components/Sidebar";
import { useMemo, useState, useEffect } from "react";
import { useMockData } from "../../context/MockDataContext";
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
};

export default function Projects() {
  const mock = useMockData();

  const [projects, setProjects] = useState<ProjectItem[]>(() =>
    mock.projects.map((p) => ({
      id: p.id,
      name: p.title,
      customerName: p.customer,
      start: p.due ?? new Date().toISOString(),
      end: p.due ?? new Date().toISOString(),
      description: p.title,
      status: p.status as ProjectItem["status"],
    }))
  );

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

  const approveProject = (id: number) =>
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Approved" } : p))
    );
  const rejectProject = (id: number) =>
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Rejected" } : p))
    );
  const completeProject = (id: number) =>
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Completed" } : p))
    );

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
                {projects.length}
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

          {/* Project Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.length === 0 ? (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full p-6 bg-[#0b0c0d]/60 rounded-xl border border-gray-800 text-gray-400 text-center"
                >
                  No projects found. Try adjusting your filters.
                </motion.div>
              ) : (
                filtered.map((p) => (
                  <motion.article
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-[#0b0c0d]/70 p-5 rounded-2xl border border-gray-800 shadow-md hover:shadow-red-900/30 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{p.name}</h3>
                        <p className="text-sm text-gray-400">{p.customerName}</p>
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
                      {p.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelected(p)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm"
                      >
                        Details
                      </button>
                      {p.status === "Pending" && (
                        <>
                          <button
                            onClick={() =>
                              canApprove(p)
                                ? approveProject(p.id)
                                : alert(
                                    "Time conflict with an existing approved project."
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
                ))
              )}
            </AnimatePresence>
          </section>

          {/* Project Details */}
          <AnimatePresence>
            {selected && (
              <motion.aside
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 p-6 bg-[#0b0c0d]/80 rounded-2xl border border-gray-800 shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {selected.name}
                    </h2>
                    <p className="text-sm text-gray-400">
                      Customer: {selected.customerName}
                    </p>
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(selected.start).toLocaleString()} —{" "}
                      {new Date(selected.end).toLocaleString()}
                    </div>
                    <p className="text-gray-300 mt-4">{selected.description}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {selected.status === "Pending" && (
                      <>
                        <button
                          onClick={() =>
                            canApprove(selected)
                              ? approveProject(selected.id)
                              : alert(
                                  "Time conflict with existing approved project."
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
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
