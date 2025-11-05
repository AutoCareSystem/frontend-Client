import Sidebar from "../../components/Sidebar";
import { useMemo, useState } from "react";

type ProjectItem = {
  id: number;
  name: string;
  customerName: string;
  start: string; // ISO
  end: string; // ISO
  description?: string;
  status: "Pending" | "Approved" | "Completed" | "Rejected";
};

const DUMMY_PROJECTS: ProjectItem[] = [
  {
    id: 1,
    name: "Engine Overhaul",
    customerName: "John Doe",
    start: "2025-11-10T09:00:00Z",
    end: "2025-11-10T12:00:00Z",
    description: "Full engine overhaul requested by customer. Expect 3-4 hours work.",
    status: "Pending",
  },
  {
    id: 2,
    name: "Custom Body Kit",
    customerName: "Alice Smith",
    start: "2025-11-10T11:00:00Z",
    end: "2025-11-10T15:00:00Z",
    description: "Install custom body kit and paint. Customer provided specifications.",
    status: "Approved",
  },
  {
    id: 3,
    name: "Brake Replacement",
    customerName: "Sam Turner",
    start: "2025-11-11T08:30:00Z",
    end: "2025-11-11T10:00:00Z",
    description: "Replace front and rear brake pads and rotors.",
    status: "Pending",
  },
];

export default function Projects() {
  const [projects, setProjects] = useState<ProjectItem[]>(DUMMY_PROJECTS);
  const [selected, setSelected] = useState<ProjectItem | null>(null);

  // Simple availability check: ensure no approved project overlaps the timeslot
  const canApprove = (proj: ProjectItem) => {
    const start = new Date(proj.start).getTime();
    const end = new Date(proj.end).getTime();
    return !projects.some(p =>
      p.status === "Approved" && p.id !== proj.id && (
        (new Date(p.start).getTime() < end && new Date(p.end).getTime() > start)
      )
    );
  };

  const approveProject = (id: number) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status: "Approved" } : p));
    setSelected(prev => prev && prev.id === id ? { ...prev, status: "Approved" } : prev);
  };

  const rejectProject = (id: number) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status: "Rejected" } : p));
    setSelected(prev => prev && prev.id === id ? { ...prev, status: "Rejected" } : prev);
  };

  const list = useMemo(() => projects, [projects]);

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
      <Sidebar role="employee" />

      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-red-500 mb-6">Projects</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {list.map((p) => (
            <div
              key={p.id}
              className="bg-[#2a2a2a] p-6 rounded-xl border border-gray-700 hover:border-red-500 transition"
            >
              <h2 className="text-xl font-semibold mb-1">{p.name}</h2>
              <div className="text-sm text-gray-300 mb-2">Customer: {p.customerName}</div>
              <div className="text-sm text-gray-400">{new Date(p.start).toLocaleString()} - {new Date(p.end).toLocaleString()}</div>
              <div className="mt-3">
                <span className={`px-2 py-1 rounded text-xs ${p.status === 'Pending' ? 'bg-yellow-600 text-black' : p.status === 'Approved' ? 'bg-green-600' : p.status === 'Completed' ? 'bg-blue-600' : 'bg-red-600'}`}>
                  {p.status}
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setSelected(p)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium">View Details</button>
                {p.status === 'Pending' && (
                  <button
                    onClick={() => {
                      if (canApprove(p)) approveProject(p.id);
                      else alert('Cannot approve: timeslot conflicts with an existing approved project.');
                    }}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium"
                  >Approve</button>
                )}
                {p.status === 'Pending' && (
                  <button onClick={() => rejectProject(p.id)} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium">Reject</button>
                )}
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <div className="mt-6 bg-[#2a2a2a] p-6 rounded-lg border border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-semibold">{selected.name}</h2>
                <div className="text-sm text-gray-300">Customer: {selected.customerName}</div>
                <div className="text-sm text-gray-300">{new Date(selected.start).toLocaleString()} - {new Date(selected.end).toLocaleString()}</div>
                <div className="mt-3 text-gray-200">{selected.description}</div>
              </div>
              <div className="flex flex-col gap-2">
                {selected.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => {
                        if (canApprove(selected)) approveProject(selected.id);
                        else alert('Cannot approve: timeslot conflicts with an existing approved project.');
                      }}
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium"
                    >Approve</button>
                    <button onClick={() => rejectProject(selected.id)} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium">Reject</button>
                  </>
                )}
                <button onClick={() => setSelected(null)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium">Close</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
