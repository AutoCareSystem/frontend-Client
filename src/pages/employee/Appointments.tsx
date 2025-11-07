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
  service: string;
};

const DUMMY: DummyAppt[] = [
  {
    id: 1,
    customer: "John Doe",
    startDate: "2025-10-29T10:00:00Z",
    endDate: "2025-10-29T11:00:00Z",
    type: "Service",
    status: "Pending",
    service: "Brake Replacement",
  },
  {
    id: 2,
    customer: "Alice Smith",
    startDate: "2025-10-30T14:00:00Z",
    endDate: "2025-10-30T16:00:00Z",
    type: "Project",
    status: "Approved",
    service: "Paint & Polish",
  },
  {
    id: 3,
    customer: "Sam Turner",
    startDate: "2025-10-31T09:30:00Z",
    endDate: "2025-10-31T10:30:00Z",
    type: "Service",
    status: "Completed",
    service: "Oil Change",
  },
  {
    id: 4,
    customer: "Linda Park",
    startDate: "2025-11-01T10:30:00Z",
    endDate: "2025-11-01T11:30:00Z",
    type: "Project",
    status: "Rejected",
    service: "Custom Fabrication",
  },
];

export default function Appointments() {
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [selected, setSelected] = useState<number | null>(null);

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
                {[
                  "ID",
                  "Customer",
                  "Start",
                  "End",
                  "Type",
                  "Service",
                  "Status",
                ].map((header) => (
                  <th key={header} className="px-5 py-3 font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-6 text-gray-400"
                  >
                    No appointments found.
                  </td>
                </tr>
              ) : (
                filteredList.map((a) => (
                  <>
                    <motion.tr
                      key={a.id}
                      layoutId={`row-${a.id}`}
                      onClick={() =>
                        setSelected((prev) =>
                          prev === a.id ? null : a.id
                        )
                      }
                      whileHover={{ scale: 1.01 }}
                      className={`cursor-pointer border-t border-gray-800 hover:bg-[#1d1d1d] transition-all ${
                        selected === a.id
                          ? "bg-[#202020]"
                          : ""
                      }`}
                    >
                      <td className="px-5 py-3">{a.id}</td>
                      <td className="px-5 py-3">{a.customer}</td>
                      <td className="px-5 py-3">
                        {new Date(a.startDate).toLocaleString()}
                      </td>
                      <td className="px-5 py-3">
                        {a.endDate
                          ? new Date(a.endDate).toLocaleString()
                          : "-"}
                      </td>
                      <td className="px-5 py-3">{a.type}</td>
                      <td className="px-5 py-3">{a.service}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            a.status
                          )}`}
                        >
                          {a.status}
                        </span>
                      </td>
                    </motion.tr>

                    {/* Inline Detail Row */}
                    <AnimatePresence>
                      {selected === a.id && (
                        <motion.tr
                          key={`details-${a.id}`}
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
                                  <span className="text-gray-400">
                                    Appointment ID:
                                  </span>{" "}
                                  {a.id}
                                </p>
                                <p>
                                  <span className="text-gray-400">
                                    Customer:
                                  </span>{" "}
                                  {a.customer}
                                </p>
                                <p>
                                  <span className="text-gray-400">
                                    Type:
                                  </span>{" "}
                                  {a.type}
                                </p>
                                <p>
                                  <span className="text-gray-400">
                                    Service:
                                  </span>{" "}
                                  {a.service}
                                </p>
                              </div>
                              <div>
                                <p>
                                  <span className="text-gray-400">
                                    Start Time:
                                  </span>{" "}
                                  {new Date(
                                    a.startDate
                                  ).toLocaleString()}
                                </p>
                                <p>
                                  <span className="text-gray-400">
                                    End Time:
                                  </span>{" "}
                                  {a.endDate
                                    ? new Date(a.endDate).toLocaleString()
                                    : "-"}
                                </p>
                                <p className="mt-2">
                                  <span className="text-gray-400">
                                    Status:
                                  </span>{" "}
                                  <span
                                    className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(
                                      a.status
                                    )}`}
                                  >
                                    {a.status}
                                  </span>
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 text-right">
                              <button
                                onClick={() => setSelected(null)}
                                className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-md font-medium text-white"
                              >
                                Close
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
