import React from 'react';

type PageType = 'service' | 'project';

interface NavigationProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, setCurrentPage }) => {
  return (
    <nav className="text-white bg-indigo-600 shadow-lg">
      <div className="px-4 py-4 mx-auto max-w-7xl">
        <div className="flex space-x-4">
          <button
            onClick={() => setCurrentPage('service')}
            className={`px-6 py-2 rounded-lg font-semibold transition duration-200 ${
              currentPage === 'service'
                ? 'bg-white text-indigo-600'
                : 'bg-indigo-700 hover:bg-indigo-800'
            }`}
          >
            Service Page
          </button>
          <button
            onClick={() => setCurrentPage('project')}
            className={`px-6 py-2 rounded-lg font-semibold transition duration-200 ${
              currentPage === 'project'
                ? 'bg-white text-indigo-600'
                : 'bg-indigo-700 hover:bg-indigo-800'
            }`}
          >
            Project Page
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
