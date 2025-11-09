import React from 'react';
import ServicePage from "../pages/customer/ServicePage";
import ProjectPage from "../pages/customer/Projectpage";
import { useLocation } from 'react-router-dom';
import { Car } from 'lucide-react';

const VehicleService: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Header/Navigation */}
      <header className="text-gray-200 bg-[#2a2a2a] shadow-lg">
        <div className="px-4 py-4 mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#3a3a3a] rounded-full">
                <Car className="w-8 h-8 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-red-500">Vehicle Service Center</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main>
        {/* Render content based on current route so the header navigation controls routing */}
        <RouteContent />
      </main>
    </div>
  );
};

export default VehicleService;

const RouteContent: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  if (path.startsWith('/customer/modifications') || path === '/Projectpage') return <ProjectPage />;
  // default to service page for appointments path
  return <ServicePage />;
};
