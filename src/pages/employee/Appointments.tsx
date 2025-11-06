import Sidebar from "../../components/Sidebar";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type DummyAppt = {
  id: number;
  customer: string;
  startDate: string;
  endDate?: string;
  type: "Service" | "Project";
  status: "Pending" | "Approved" | "Completed" | "Rejected";
  service?: string;
};

const DUMMY: DummyAppt[] = [
  { id: 1, customer: "John Doe", startDate: "2025-10-29T10:00:00Z", endDate: "2025-10-29T11:00:00Z", type: "Service", status: "Pending", service: "Brake Replacement" },
  { id: 2, customer: "Alice Smith", startDate: "2025-10-30T14:00:00Z", endDate: "2025-10-30T16:00:00Z", type: "Project", status: "Approved", service: "Paint & Polish" },
  { id: 3, customer: "Sam Turner", startDate: "2025-10-31T09:30:00Z", endDate: "2025-10-31T10:30:00Z", type: "Service", status: "Completed", service: "Oil Change" },
  { id: 4, customer: "Linda Park", startDate: "2025-11-01T10:30:00Z", endDate: "2025-11-01T11:30:00Z", type: "Project", status: "Rejected", service: "Custom Fabrication" },
];

export default function Appointments() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selected, setSelected] = useState<DummyAppt | null>(null);

  const filteredList = useMemo(() => {
    return DUMMY.filter(
      (a) =>
        (statusFilter === "All" || a.status === statusFilter) &&
        (typeFilter === "All" || a.type === typeFilter)
    );
  }, [statusFilter, typeFilter]);

  const getStatusColor = (status: DummyAppt["status"]) => {
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

  return (
    <div className="flex h-screen bg-[#111] text-gray-100">
      <Sidebar role="employee" />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-red-500 mb-6 tracking-wide">
          Appointments
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-300">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#222] border border-gray-700 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
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
              className="bg-[#222] border border-gray-700 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              {["All", "Service", "Project"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-[#1b1b1b] rounded-lg border border-gray-800 shadow-md">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#222] text-gray-300 uppercase tracking-wide">
              <tr>
                {["ID", "Customer", "Start", "End", "Type", "Service", "Status"].map(
                  (header) => (
                    <th key={header} className="px-4 py-3 font-semibold">
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-400">
                    No appointments found.
                  </td>
                </tr>
              ) : (
                filteredList.map((a) => (
                  <motion.tr
                    key={a.id}
                    layoutId={`appt-${a.id}`}
                    className="border-t border-gray-800 hover:bg-[#252525] transition-all cursor-pointer"
                    onClick={() => setSelected(a)}
                    whileHover={{ scale: 1.01 }}
                  >
                    <td className="px-4 py-3">{a.id}</td>
                    <td className="px-4 py-3">{a.customer}</td>
                    <td className="px-4 py-3">
                      {new Date(a.startDate).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      {a.endDate ? new Date(a.endDate).toLocaleString() : "-"}
                    </td>
                    <td className="px-4 py-3">{a.type}</td>
                    <td className="px-4 py-3">{a.service}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          a.status
                        )}`}
                      >
                        {a.status}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Details panel */}
        <AnimatePresence>
          {selected && (
            <motion.div
              layoutId={`appt-${selected.id}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="mt-8 bg-[#1b1b1b] p-6 rounded-xl border border-gray-700 shadow-lg"
            >
              <h2 className="text-2xl font-semibold mb-3 text-red-400">
                Appointment Details
              </h2>
              <div className="space-y-1 text-sm text-gray-300">
                <div>ID: {selected.id}</div>
                <div>Customer: {selected.customer}</div>
                <div>
                  Start: {new Date(selected.startDate).toLocaleString()}
                </div>
                <div>
                  End:{" "}
                  {selected.endDate
                    ? new Date(selected.endDate).toLocaleString()
                    : "-"}
                </div>
                <div>Type: {selected.type}</div>
                <div>Service/Project: {selected.service}</div>
                <div>
                  Status:{" "}
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(
                      selected.status
                    )}`}
                  >
                    {selected.status}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="mt-4 bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-md font-medium text-white"
              >
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
