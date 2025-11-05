import Sidebar from "../../components/Sidebar";
import { useMemo, useState } from "react";

type ServiceItem = {
  id: number;
  customerName: string;
  start: string; // ISO
  end: string; // ISO
  serviceType: "Full" | "Half" | "Custom" | "Other";
  details?: string;
  status: "Pending" | "Approved" | "Completed" | "Rejected";
};

const DUMMY_SERVICES: ServiceItem[] = [
  {
    id: 1,
    customerName: "John Doe",
    start: "2025-11-12T09:00:00Z",
    end: "2025-11-12T11:00:00Z",
    serviceType: "Full",
    details: "Full service including oil, filter, inspection.",
    status: "Pending",
  },
  {
    id: 2,
    customerName: "Alice Smith",
    start: "2025-11-12T12:00:00Z",
    end: "2025-11-12T13:30:00Z",
    serviceType: "Half",
    details: "Half service - quick check and oil top-up.",
    status: "Approved",
  },
  {
    id: 3,
    customerName: "Sam Turner",
    start: "2025-11-13T08:30:00Z",
    end: "2025-11-13T09:30:00Z",
    serviceType: "Custom",
    details: "Replace air filter, check AC system.",
    status: "Pending",
  },
];

export default function Services() {
  const [services, setServices] = useState<ServiceItem[]>(DUMMY_SERVICES);
  const [selected, setSelected] = useState<ServiceItem | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterType, setFilterType] = useState<string>("All");

  const list = useMemo(() => {
    return services.filter(s => (filterStatus === "All" || s.status === filterStatus) && (filterType === "All" || s.serviceType === filterType));
  }, [services, filterStatus, filterType]);

  const updateStatus = (id: number, status: ServiceItem['status']) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    setSelected(prev => prev && prev.id === id ? { ...prev, status } : prev);
  };

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
      <Sidebar role="employee" />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-red-500 mb-6">Services</h1>

        <div className="flex gap-4 mb-4 items-center">
          <label className="text-sm text-gray-300">Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-[#2a2a2a] p-2 rounded">
            <option>All</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Completed</option>
            <option>Rejected</option>
          </select>
          <label className="text-sm text-gray-300">Type:</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="bg-[#2a2a2a] p-2 rounded">
            <option>All</option>
            <option>Full</option>
            <option>Half</option>
            <option>Custom</option>
            <option>Other</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {list.map(s => (
            <div key={s.id} className="bg-[#2a2a2a] p-6 rounded-xl border border-gray-700 hover:border-red-500 transition">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{s.customerName}</h3>
                  <div className="text-sm text-gray-300">{new Date(s.start).toLocaleString()} - {new Date(s.end).toLocaleString()}</div>
                </div>
                <div>
                  <span className={`px-2 py-1 rounded text-xs ${s.status === 'Pending' ? 'bg-yellow-600 text-black' : s.status === 'Approved' ? 'bg-green-600' : s.status === 'Completed' ? 'bg-blue-600' : 'bg-red-600'}`}>
                    {s.status}
                  </span>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-300">Type: {s.serviceType}</div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setSelected(s)} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">View</button>
                {s.status === 'Pending' && (
                  <>
                    <button onClick={() => updateStatus(s.id, 'Approved')} className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded">Approve</button>
                    <button onClick={() => updateStatus(s.id, 'Rejected')} className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded">Reject</button>
                  </>
                )}
                {s.status === 'Approved' && (
                  <button onClick={() => updateStatus(s.id, 'Completed')} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">Mark Completed</button>
                )}
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <div className="mt-6 bg-[#2a2a2a] p-6 rounded-lg border border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-semibold">Service for {selected.customerName}</h2>
                <div className="text-sm text-gray-300">{new Date(selected.start).toLocaleString()} - {new Date(selected.end).toLocaleString()}</div>
                <div className="mt-3 text-gray-200">Type: {selected.serviceType}</div>
                <div className="mt-2 text-gray-200">{selected.details}</div>
              </div>
              <div className="flex flex-col gap-2">
                {selected.status === 'Pending' && (
                  <>
                    <button onClick={() => updateStatus(selected.id, 'Approved')} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg">Approve</button>
                    <button onClick={() => updateStatus(selected.id, 'Rejected')} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg">Reject</button>
                  </>
                )}
                {selected.status === 'Approved' && (
                  <button onClick={() => updateStatus(selected.id, 'Completed')} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">Mark Completed</button>
                )}
                <button onClick={() => setSelected(null)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg">Close</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
