import Sidebar from "../../components/Sidebar";

export default function Projects() {
  const projects = [
    { id: 1, name: "Engine Overhaul", status: "In Progress" },
    { id: 2, name: "Paint & Polish", status: "Completed" },
    { id: 3, name: "Brake Replacement", status: "Pending" },
  ];

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
      <Sidebar role="employee" />

      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-red-500 mb-6">Projects</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-[#2a2a2a] p-6 rounded-xl border border-gray-700 hover:border-red-500 transition"
            >
              <h2 className="text-xl font-semibold mb-2">{p.name}</h2>
              <p
                className={`${
                  p.status === "Completed"
                    ? "text-green-400"
                    : p.status === "In Progress"
                    ? "text-yellow-400"
                    : "text-gray-400"
                }`}
              >
                {p.status}
              </p>
              <button className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium">
                View Details
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
