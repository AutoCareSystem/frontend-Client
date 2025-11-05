import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ProjectCard from '../../components/customer/ProjectCard';
import ProjectForm from '../../components/customer/ProjectForm';

interface CustomService {
  id: number;
  name: string;
  price: string;
  description: string;
  endDate?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  createdAt?: string;
}

interface FormData {
  name: string;
  price: string;
  description: string;
  endDate?: string;
}

// ✏️ CUSTOMIZE PAGE SETTINGS
const PAGE_CONFIG = {
  title: 'Customized Vehicle Services',
  subtitle: 'Create and manage your custom service projects',
  // match Servicepage dark + red theme
  headerBg: 'bg-[#2a2a2a]',
  headerIcon: 'bg-[#3a3a3a]',
  titleColor: 'text-red-500',
  primaryColor: 'red',
  darkMode: true,
  addButtonText: 'Add Custom Service',
  formTitle: {
    add: 'Add New Custom Service',
    edit: 'Edit Custom Service'
  },
  emptyStateTitle: 'No custom services yet',
  emptyStateSubtitle: 'Click "Add Custom Service" to create your first service',
  showStatus: false,
  showCreatedDate: false,
  requireDescription: false,
  confirmDelete: true,
};



interface ProjectPageProps {
  initialServices?: CustomService[];
  onServiceAdd?: (service: CustomService) => void;
  onServiceUpdate?: (service: CustomService) => void;
  onServiceDelete?: (serviceId: number) => void;
  config?: Partial<typeof PAGE_CONFIG>;
  enableLocalStorage?: boolean;
}

const ProjectPage: React.FC<ProjectPageProps> = ({ 
  initialServices = [],
  onServiceAdd,
  onServiceUpdate,
  onServiceDelete,
  config = PAGE_CONFIG,
  enableLocalStorage = true,
}) => {
  const [customServices, setCustomServices] = useState<CustomService[]>(initialServices);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: '',
    description: '',
    endDate: ''
  });

  const pageConfig = { ...PAGE_CONFIG, ...config };
  const dark = !!pageConfig.darkMode;

  useEffect(() => {
    if (enableLocalStorage && initialServices.length === 0) {
      const saved = localStorage.getItem('customVehicleServices');
      if (saved) {
        try {
          setCustomServices(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading saved services:', error);
        }
      }
    }
  }, [enableLocalStorage, initialServices.length]);

  useEffect(() => {
    if (enableLocalStorage && customServices.length > 0) {
      localStorage.setItem('customVehicleServices', JSON.stringify(customServices));
    }
  }, [customServices, enableLocalStorage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name || !formData.price) {
      alert('Please fill in all required fields');
      return false;
    }

    if (pageConfig.requireDescription && !formData.description) {
      alert('Description is required');
      return false;
    }

    return true;
  };

  const handleAddService = (): void => {
    if (!validateForm()) return;

    const newService: CustomService = {
      id: Date.now(),
      name: formData.name,
      price: formData.price.startsWith('$') ? formData.price : `$${formData.price}`,
      description: formData.description,
      endDate: formData.endDate,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setCustomServices([...customServices, newService]);
    if (onServiceAdd) onServiceAdd(newService);
    resetForm();
  };

  const handleEditService = (): void => {
    if (!validateForm()) return;

    const updatedServices = customServices.map(service => 
      service.id === editingId 
        ? { ...service, ...formData, endDate: formData.endDate }
        : service
    );

    setCustomServices(updatedServices);
    if (onServiceUpdate && editingId) {
      const updatedService = updatedServices.find(s => s.id === editingId);
      if (updatedService) onServiceUpdate(updatedService);
    }
    resetForm();
  };

  const handleDeleteService = (id: number): void => {
    const shouldDelete = pageConfig.confirmDelete 
      ? window.confirm('Are you sure you want to delete this service?')
      : true;

    if (shouldDelete) {
      setCustomServices(customServices.filter(service => service.id !== id));
      if (onServiceDelete) onServiceDelete(id);
    }
  };

  const startEdit = (service: CustomService): void => {
    setEditingId(service.id);
    setIsAdding(true);
    setFormData({
      name: service.name,
      price: service.price.replace('$', ''),
      description: service.description,
      endDate: service.endDate
    });
  };

  const resetForm = (): void => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      name: '',
      price: '',
      description: '',
      endDate: ''
    });
  };

  const exportServices = (): void => {
    const dataStr = JSON.stringify(customServices, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'custom-services.json';
    link.click();
  };


  return (
    <div className={`min-h-screen py-8 ${dark ? 'bg-[#1a1a1a]' : 'bg-gray-50'}`}>
      <div className="px-4 mx-auto max-w-7xl">
        {/* Header */}
        <div className={`${dark ? pageConfig.headerBg : 'bg-white'} p-6 mb-8 rounded-lg shadow-md`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`${pageConfig.headerIcon} p-3 rounded-full`}>
                <Plus className={`w-8 h-8 ${dark ? 'text-red-500' : `text-${pageConfig.primaryColor}-400`}`} />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${dark ? pageConfig.titleColor : 'text-gray-800'}`}>{pageConfig.title}</h1>
                <p className={`${dark ? 'text-gray-300' : 'text-gray-600'}`}>{pageConfig.subtitle}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              {!isAdding && customServices.length > 0 && (
                <button
                  onClick={exportServices}
                  className={`${dark ? 'px-4 py-2 font-semibold text-gray-200 transition duration-200 bg-gray-700 rounded-lg hover:bg-gray-600' : 'px-4 py-2 font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200'}`}
                >
                  Export
                </button>
              )}
              {!isAdding && (
                <button
                  onClick={() => setIsAdding(true)}
                  className={`${dark ? `bg-${pageConfig.primaryColor}-600 text-gray-200` : `bg-${pageConfig.primaryColor}-600 text-white`} px-6 py-3 rounded-lg font-semibold hover:bg-${pageConfig.primaryColor}-700 transition duration-200 flex items-center space-x-2`}
                >
                  <Plus className="w-5 h-5" />
                  <span>{pageConfig.addButtonText}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {isAdding && (
          <ProjectForm
            formData={formData}
            onChange={handleInputChange}
            onSubmit={editingId ? handleEditService : handleAddService}
            onCancel={resetForm}
            editingId={editingId}
            formTitle={pageConfig.formTitle}
            primaryColor={pageConfig.primaryColor}
            dark={dark}
          />
        )}

        {/* Custom Services List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-200">Your Custom Services</h2>
            {customServices.length > 0 && (
              <span className="text-gray-400">
                {customServices.length} service{customServices.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          {customServices.length === 0 ? (
            <div className="p-12 text-center bg-[#2a2a2a] rounded-lg shadow-md">
              <Plus className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <p className="text-lg text-gray-400">{pageConfig.emptyStateTitle}</p>
              <p className="text-gray-500">{pageConfig.emptyStateSubtitle}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {customServices.map((service) => (
                <ProjectCard
                  key={service.id}
                  service={service}
                  onEdit={startEdit}
                  onDelete={handleDeleteService}
                  showStatus={pageConfig.showStatus}
                  showCreatedDate={pageConfig.showCreatedDate}
                  primaryColor={pageConfig.primaryColor}
                  dark={dark}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
