import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { generateProjectReport } from '../../utils/pdfGenerator';

interface CustomService {
  id: number;
  name: string;
  price: string;
  description: string;
  endDate?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  createdAt?: string;
}

interface Props {
  service: CustomService;
  onEdit: (service: CustomService) => void;
  onDelete: (id: number) => void;
  showStatus?: boolean;
  showCreatedDate?: boolean;
  primaryColor?: string;
  dark?: boolean;
}

const ProjectCard: React.FC<Props> = ({ service, onEdit, onDelete, showStatus = false, showCreatedDate = false, primaryColor = 'red', dark = false }) => {
  const titleColor = dark ? 'text-gray-200' : 'text-gray-800';
  const descColor = dark ? 'text-gray-300' : 'text-gray-600';
  const metaColor = dark ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`${dark ? 'bg-[#2a2a2a]' : 'bg-white'} p-6 transition duration-200 rounded-lg shadow-md hover:shadow-lg`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className={`text-lg font-bold ${titleColor}`}>{service.name}</h3>
          {service.endDate && (
            <p className={`mt-1 text-sm ${metaColor}`}>Desired completion: {new Date(service.endDate).toLocaleDateString()}</p>
          )}
          {showCreatedDate && service.createdAt && (
            <p className={`mt-1 text-xs ${metaColor}`}>Created: {new Date(service.createdAt).toLocaleDateString()}</p>
          )}
        </div>
        <div className="flex space-x-2">
          <button onClick={() => onEdit(service)} className={`transition ${dark ? 'text-blue-300 hover:text-blue-200' : 'text-blue-400 hover:text-blue-500'}`} title="Edit service">
            <Edit2 className="w-5 h-5" />
          </button>
          <button onClick={() => onDelete(service.id)} className={`transition ${dark ? 'text-red-300 hover:text-red-200' : 'text-red-400 hover:text-red-500'}`} title="Delete service">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {service.description && (
        <p className={`mb-3 text-sm ${descColor}`}>{service.description}</p>
      )}

      {showStatus && service.status && (
        <div className="mb-3">
          <span className={`text-xs px-2 py-1 rounded ${
            service.status === 'completed' ? 'bg-green-900 text-green-300' :
            service.status === 'in-progress' ? 'bg-blue-900 text-blue-300' :
            'bg-gray-800 text-gray-300'
          }`}>{service.status.replace('-', ' ').toUpperCase()}</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-700">
        <span className={`text-xl font-bold text-${primaryColor}-400`}>{service.price}</span>
      </div>
      
      <button
        onClick={() => generateProjectReport(service)}
        className="w-full px-4 py-2 mt-3 text-sm font-medium text-gray-200 transition duration-200 bg-gray-700 rounded hover:bg-gray-600"
      >
        Generate PDF Report
      </button>
    </div>
  );
};

export default ProjectCard;
