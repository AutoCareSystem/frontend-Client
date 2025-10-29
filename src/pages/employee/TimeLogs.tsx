// Example: TimeLogs.tsx
import Sidebar from "../../components/Sidebar";

export default function TimeLogs() {
  const logs = [
    { id: 1, project: "Engine Overhaul", date: "2025-10-28", hours: 4, status: "Approved" },
    { id: 2, project: "Paint & Polish", date: "2025-10-27", hours: 3, status: "Pending" },
  ];

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
      <Sidebar role="employee"/>
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-red-500 mb-6">Time Logs</h1>
        <table className="w-full border border-gray-700 rounded-xl overflow-hidden">
          <thead className="bg-[#0a0a0a] text-left text-gray-300">
            <tr><th className="p-3">Project</th><th className="p-3">Date</th><th className="p-3">Hours</th><th className="p-3">Status</th></tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} className="border-t border-gray-700 hover:bg-[#2a2a2a]">
                <td className="p-3">{log.project}</td>
                <td className="p-3">{log.date}</td>
                <td className="p-3">{log.hours}</td>
                <td className={`p-3 font-medium ${log.status==="Approved"?"text-green-400":"text-yellow-400"}`}>{log.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
