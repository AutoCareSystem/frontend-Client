import { Link, useLocation } from "react-router-dom";
import type { ReactElement } from "react";
import {
  Home,
  Clock,
  Folder,
  User,
  Calendar,
  MessageCircle,
  LogOut,
  Users,
  Wrench,
  Home, Clock, Folder, User, Calendar, MessageCircle, LogOut, Users
} from "lucide-react";

interface SidebarProps {
  role: "Customer" | "Employee";
}
type MenuItem = {
  name: string;
  path: string;
  icon: ReactElement;
};

export default function Sidebar({ role }: SidebarProps) {
  const { pathname } = useLocation();

  const customerMenu: MenuItem[] = [
    {
      name: "Dashboard",
      path: "/customer/dashboard",
      icon: <Home size={20} />,
    },
    {
      name: "Services",
      path: "/customer/appointments",
      icon: <Calendar size={20} />,
    },
    {
      name: "Modifications",
      path: "/customer/modifications",
      icon: <Folder size={20} />,
    },
    {
      name: "Profile",
      path: "/customer/profile",
      icon: <User size={20} />,
    },
  ];

  // const employeeMenu: MenuItem[] = [
  //   {
  //     name: "Dashboard",
  //     path: "/employee/dashboard",
  //     icon: <Home size={20} />,
  //   },
  //   {
  //     name: "Manage",
  //     path: "/employee/manage",
  //     icon: <Wrench size={20} />,
  //   },
  //   {
  //     name: "Appointments",
  //     path: "/employee/appointments",
  //     icon: <Clock size={20} />,
  //   },
  //   {
  //     name: "Customers",
  //     path: "/employee/customers",
  //     icon: <Users size={20} />,
  //   },
  //   {
  //     name: "Messages",
  //     path: "/employee/messages",
  //     icon: <MessageCircle size={20} />,
  //   },
  // ];

  const menuItems = customerMenu;

  return (
    <aside className="h-screen w-64 bg-[#0a0a0a] text-gray-100 flex flex-col shadow-lg">
      <div className="p-4 border-b border-gray-700">
        <div className="text-lg font-semibold">AutoManage</div>
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
        <button className="flex items-center w-full gap-3 p-3 transition rounded-lg hover:bg-red-700">
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
}
