import Sidebar from "../../components/Sidebar";

export default function Modifications() {
  const mods = [
    { name: "Seat Upgrade", status: "Pending" },
    { name: "Custom Paint", status: "In Progress" },
  ];

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
      <Sidebar role="customer"/>
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-red-500 mb-6">Vehicle Modifications</h1>
        <ul className="space-y-4">
          {mods.map((mod, idx) => (
            <li key={idx} className="bg-[#2a2a2a] p-4 rounded-lg border border-gray-700 flex justify-between">
              <span>{mod.name}</span>
              <span className="text-gray-400">{mod.status}</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
