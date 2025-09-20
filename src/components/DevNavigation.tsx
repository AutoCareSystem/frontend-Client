import React from "react";
import { Link } from "react-router-dom";
import { Home, Calendar, Car, Settings } from "lucide-react";

const DevNavigation: React.FC = () => {
  const devRoutes = [
    { path: "/", name: "Home", icon: Home },
    { path: "/dev/dashboard", name: "Dashboard (Dev)", icon: Calendar },
    { path: "/dev/book-service", name: "Book Service (Dev)", icon: Car },
    { path: "/login", name: "Login", icon: Settings },
    { path: "/signup", name: "Signup", icon: Settings },
  ];

  return (
    <div className="bg-gray-800 text-white p-4 mb-4">
      <h3 className="text-lg font-semibold mb-3">Development Navigation</h3>
      <div className="flex flex-wrap gap-2">
        {devRoutes.map((route) => {
          const Icon = route.icon;
          return (
            <Link
              key={route.path}
              to={route.path}
              className="inline-flex items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors"
            >
              <Icon className="h-4 w-4 mr-2" />
              {route.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default DevNavigation;
