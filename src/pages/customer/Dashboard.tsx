import Sidebar from "../../components/Sidebar";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function CustomerDashboard() {
  const services = [
    { name: "Engine Overhaul", status: "In Progress" },
    { name: "Paint & Polish", status: "Completed" },
    { name: "Brake Replacement", status: "Pending" },
  ];

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
      <Sidebar role="customer" />
      <main className="flex-1 p-8 overflow-y-auto">
        <Breadcrumbs className="mb-4" />
        <h1 className="text-3xl font-bold text-red-500 mb-6">Customer Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s, idx) => (
            <div key={idx} className="bg-[#2a2a2a] p-6 rounded-xl shadow-lg border border-gray-700 hover:border-red-500 transition">
              <h2 className="text-xl font-semibold mb-2">{s.name}</h2>
              <p className="text-gray-400">Status: {s.status}</p>
              <button className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium">View Details</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
