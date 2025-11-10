import { Link, useLocation } from "react-router-dom";
import {
  Home, Clock, Folder, User, Calendar, MessageCircle, LogOut, Users
} from "lucide-react";
import { Wrench } from "lucide-react";

interface SidebarProps {
  role: "Customer" | "Employee";
}

export default function Sidebar({ role }: SidebarProps) {
  const { pathname } = useLocation();

  const customerMenu = [
    { name: "Dashboard", path: "/customer/dashboard", icon: <Home size={20} /> },
    { name: "Appointments", path: "/customer/appointments", icon: <Calendar size={20} /> },
    { name: "Modifications", path: "/customer/modifications", icon: <Folder size={20} /> },
    { name: "Profile", path: "/customer/profile", icon: <User size={20} /> },
  ];

  const employeeMenu = [
    { name: "Dashboard", path: "/employee/dashboard", icon: <Home size={20} /> },
    { name: "Time Logs", path: "/employee/timelogs", icon: <Clock size={20} /> },
    { name: "Projects", path: "/employee/projects", icon: <Folder size={20} /> },
  { name: "Services", path: "/employee/services", icon: <Wrench size={20} /> },
  { name: "Users", path: "/employee/users", icon: <Users size={20} /> },
    { name: "Appointments", path: "/employee/appointments", icon: <Calendar size={20} /> },
    { name: "Profile", path: "/employee/profile", icon: <User size={20} /> },
  ];

  const menuItems = role === "Customer" ? customerMenu : employeeMenu;

  return (
    <aside className="h-screen w-64 bg-[#0a0a0a] text-gray-100 flex flex-col shadow-lg">
      <div className="p-6 text-2xl font-bold text-red-500 border-b border-gray-700">
        AutoManage
      </div>

      <nav className="flex-1 p-4 space-y-3">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              pathname === item.path ? "bg-red-600" : "hover:bg-[#2a2a2a]"
            }`}
          >
            {item.icon} {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-red-700 transition">
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
}
