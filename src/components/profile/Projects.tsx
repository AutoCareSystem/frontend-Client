import React from 'react';
import type { ProjectInfo } from '../../types/profile.types';

interface ProjectsProps {
  projects: ProjectInfo[];
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'awaiting approval':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (projects.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6 text-center">
        <h2 className="text-2xl font-bold mb-4">My Projects</h2>
        <p className="text-gray-600">No projects available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <h2 className="text-2xl font-bold mb-6">My Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.projectID} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{project.projectTitle}</h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              {project.projectDescription || 'No description available'}
            </p>
            <div className="text-sm text-gray-500">
              <p>Started: {formatDate(project.requestedAt)}</p>
              {project.assignedEmployee && (
                <p className="mt-1">Assigned to: {project.assignedEmployee}</p>
              )}
              {project.totalPrice && (
                <p className="mt-1">Total Cost: ${project.totalPrice.toFixed(2)}</p>
              )}
            </div>
            <button className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              View Progress
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;