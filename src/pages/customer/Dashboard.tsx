import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import { LogOut } from "lucide-react";

export default function CustomerDashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const services = [
    { name: "Engine Overhaul", status: "In Progress" },
    { name: "Paint & Polish", status: "Completed" },
    { name: "Brake Replacement", status: "Pending" },
  ];

  const handleLogout = () => {
    logout(); // Clear user data and tokens
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
      <Sidebar role="customer" />
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header with Logout Button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-red-500">Customer Dashboard</h1>
            {user && (
              <p className="mt-1 text-gray-400">Welcome, {user.email}</p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 font-medium transition bg-red-600 rounded-lg hover:bg-red-700"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {services.map((s, idx) => (
            <div
              key={idx}
              className="bg-[#2a2a2a] p-6 rounded-xl shadow-lg border border-gray-700 hover:border-red-500 transition"
            >
              <h2 className="mb-2 text-xl font-semibold">{s.name}</h2>
              <p className="text-gray-400">Status: {s.status}</p>
              <button className="px-4 py-2 mt-4 font-medium bg-red-600 rounded-lg hover:bg-red-700">
                View Details
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}