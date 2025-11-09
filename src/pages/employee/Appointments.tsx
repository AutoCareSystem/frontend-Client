import Sidebar from "../../components/Sidebar";
import { useMemo, useState } from "react";

type DummyAppt = {
  id: number;
  customer: string;
  startDate: string; // ISO
  endDate?: string; // ISO
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
  const [useDummy] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [selected, setSelected] = useState<DummyAppt | null>(null);

  const list = useMemo(() => {
    const src = useDummy ? DUMMY : [];
    return src.filter(a => (statusFilter === "All" || a.status === statusFilter) && (typeFilter === "All" || a.type === typeFilter));
  }, [useDummy, statusFilter, typeFilter]);

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
      <Sidebar role="Employee" />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-red-500 mb-6">Appointments</h1>

        <div className="flex gap-4 mb-4 items-center">
          <label className="text-sm text-gray-300">Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-[#2a2a2a] p-2 rounded">
            <option>All</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Completed</option>
            <option>Rejected</option>
          </select>

          <label className="text-sm text-gray-300">Type:</label>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-[#2a2a2a] p-2 rounded">
            <option>All</option>
            <option>Service</option>
            <option>Project</option>
          </select>
        </div>

        <div className="overflow-x-auto bg-[#2a2a2a] rounded-lg border border-gray-700">
          <table className="min-w-full text-left">
            <thead className="bg-[#222] text-sm text-gray-300">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Start</th>
                <th className="px-4 py-3">End</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Service/Project</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {list.map(a => (
                <tr key={a.id} className="border-t border-gray-800 hover:bg-[#272727] cursor-pointer" onClick={() => setSelected(a)}>
                  <td className="px-4 py-3">{a.id}</td>
                  <td className="px-4 py-3">{a.customer}</td>
                  <td className="px-4 py-3">{new Date(a.startDate).toLocaleString()}</td>
                  <td className="px-4 py-3">{a.endDate ? new Date(a.endDate).toLocaleString() : '-'}</td>
                  <td className="px-4 py-3">{a.type}</td>
                  <td className="px-4 py-3">{a.service}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${a.status === 'Pending' ? 'bg-yellow-600 text-black' : a.status === 'Approved' ? 'bg-green-600' : a.status === 'Completed' ? 'bg-blue-600' : 'bg-red-600'}`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && (
          <div className="mt-6 bg-[#2a2a2a] p-4 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">Appointment Details</h2>
            <div className="text-sm text-gray-300">ID: {selected.id}</div>
            <div className="text-sm text-gray-300">Customer: {selected.customer}</div>
            <div className="text-sm text-gray-300">Start: {new Date(selected.startDate).toLocaleString()}</div>
            <div className="text-sm text-gray-300">End: {selected.endDate ? new Date(selected.endDate).toLocaleString() : '-'}</div>
            <div className="text-sm text-gray-300">Type: {selected.type}</div>
            <div className="text-sm text-gray-300">Service/Project: {selected.service}</div>
            <div className="text-sm text-gray-300">Status: {selected.status}</div>
            <div className="mt-3">
              <button onClick={() => setSelected(null)} className="bg-red-600 px-3 py-1 rounded">Close</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
