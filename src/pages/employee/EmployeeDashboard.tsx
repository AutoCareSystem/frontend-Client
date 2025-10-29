import Sidebar from "../../components/Sidebar";

export default function EmployeeDashboard() {
  const stats = [
    { title: "Active Projects", value: 5 },
    { title: "Hours Logged", value: 140 },
    { title: "Pending Tasks", value: 3 },
  ];

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
      <Sidebar role="employee" />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-red-500 mb-6">Employee Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((s) => (
            <div
              key={s.title}
              className="bg-[#2a2a2a] p-6 rounded-xl shadow-md border border-gray-700"
            >
              <h2 className="text-gray-400">{s.title}</h2>
              <p className="text-3xl font-bold mt-2 text-red-500">{s.value}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
