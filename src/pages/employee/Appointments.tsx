import Sidebar from "../../components/Sidebar";

export default function Appointments() {
  const appointments = [
    { customer: "John Doe", date: "2025-10-29", service: "Brake Replacement" },
    { customer: "Alice Smith", date: "2025-10-30", service: "Paint & Polish" },
  ];

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
      <Sidebar role="employee"/>
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-red-500 mb-6">Appointments</h1>
        <ul className="space-y-4">
          {appointments.map((appt, idx)=>(
            <li key={idx} className="bg-[#2a2a2a] p-4 rounded-lg border border-gray-700 flex justify-between">
              <span>{appt.customer} - {appt.service}</span>
              <span className="text-gray-400">{appt.date}</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
