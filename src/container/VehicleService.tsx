import React, { useState } from 'react';
import ServicePage from "../pages/customer/ServicePage";
import ProjectPage from "../pages/customer/Projectpage";
import { Car } from 'lucide-react';

type PageType = 'service' | 'project';

const VehicleService: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('service');

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
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentPage('service')}
                className={`px-6 py-2 rounded-lg font-semibold transition duration-200 ${
                  currentPage === 'service'
                    ? 'bg-red-600 text-white'
                    : 'bg-[#3a3a3a] hover:bg-[#444444] text-gray-200'
                }`}
              >
                Service Page
              </button>
              <button
                onClick={() => setCurrentPage('project')}
                className={`px-6 py-2 rounded-lg font-semibold transition duration-200 ${
                  currentPage === 'project'
                    ? 'bg-red-600 text-white'
                    : 'bg-[#3a3a3a] hover:bg-[#444444] text-gray-200'
                }`}
              >
                Project Page
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main>
        {currentPage === 'service' ? <ServicePage /> : <ProjectPage />}
      </main>
    </div>
  );
};

export default VehicleService;
