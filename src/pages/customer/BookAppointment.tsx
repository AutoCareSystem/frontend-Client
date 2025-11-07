import Sidebar from "../../components/Sidebar";

export default function BookAppointment() {
  return (
    <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
      <Sidebar role="customer"/>
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="mb-6 text-3xl font-bold text-red-500">Book Appointment</h1>
        <div className="bg-[#2a2a2a] p-6 rounded-xl border border-gray-700 max-w-lg">
          <input type="text" placeholder="Vehicle Model" className="w-full mb-4 p-2 rounded bg-[#1a1a1a] text-gray-200"/>
          <input type="date" className="w-full mb-4 p-2 rounded bg-[#1a1a1a] text-gray-200"/>
          <button className="px-4 py-2 font-medium bg-red-600 rounded-lg hover:bg-red-700">Book</button>
        </div>
      </main>
    </div>
  );
}
