import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isService = location.pathname.startsWith('/customer/appointments') || location.pathname === '/Servicepage';
  const isProject = location.pathname.startsWith('/customer/modifications') || location.pathname === '/Projectpage';

  return (
    <nav className="sticky top-0 z-50 text-gray-200 bg-[#2a2a2a] border-b border-gray-700">
      <div className="px-4 mx-auto max-w-7xl">
        <div className="flex items-center space-x-8">
          {/* Service Page Tab */}
          <div
            onClick={() => navigate('/customer/appointments')}
            className={`cursor-pointer px-6 py-4 -mb-px border-b-2 font-medium transition-all duration-200 ${
              isService
                ? 'border-red-500 text-red-500'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
            }`}
          >
            Service Page
          </div>

          {/* Project Page Tab */}
          <div
            onClick={() => navigate('/customer/modifications')}
            className={`cursor-pointer px-6 py-4 -mb-px border-b-2 font-medium transition-all duration-200 ${
              isProject
                ? 'border-red-500 text-red-500'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
            }`}
          >
            Project Page
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
