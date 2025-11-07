import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ProjectCard from '../../components/customer/ProjectCard';
import ProjectForm from '../../components/customer/ProjectForm';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { createProject, getCustomerProjects, deleteAppointment, type Appointment } from '../../api/appointments';

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
  description: string;
  endDate?: string;
}

const PAGE_CONFIG = {
  title: 'Customized Vehicle Services',
  subtitle: 'Create and manage your custom service projects',
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
  showStatus: true,
  showCreatedDate: true,
  requireDescription: false,
  confirmDelete: true,
};

const ProjectPage: React.FC = () => {
  const { user } = useAuth();
  const [customServices, setCustomServices] = useState<CustomService[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    endDate: ''
  });

  const dark = PAGE_CONFIG.darkMode;

  // Fetch projects from backend on mount
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.customerID) {
        setLoading(false);
        return;
      }

      try {
        const projects = await getCustomerProjects(user.customerID);
        
        // Map backend appointments to frontend CustomService format
        const mappedProjects: CustomService[] = projects.map((apt: Appointment) => ({
          id: apt.appointmentID,
          name: apt.projectDetails?.projectTitle || 'Untitled Project',
          price: apt.totalPrice ? `Rs ${apt.totalPrice}` : 'Rs 0',
          description: apt.projectDetails?.projectDescription || '',
          endDate: apt.endDate ? apt.endDate.split('T')[0] : undefined,
          status: apt.status === 'Pending' ? 'pending' : 
                  apt.status === 'In Progress' ? 'in-progress' : 
                  apt.status === 'Completed' ? 'completed' : 'pending',
          createdAt: apt.startDate,
        }));

        setCustomServices(mappedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        alert('Failed to load projects. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user?.customerID]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name) {
      alert('Please enter a service name');
      return false;
    }

    if (PAGE_CONFIG.requireDescription && !formData.description) {
      alert('Description is required');
      return false;
    }

    return true;
  };

  // Create project on backend
  const handleAddService = async (): Promise<void> => {
    if (!validateForm()) return;

    if (!user?.customerID) {
      alert('Please log in to create a project.');
      return;
    }

    try {
      const projectDto = {
        CustomerID: user.customerID,
        ProjectTitle: formData.name,
        ProjectDescription: formData.description,
        EndDate: formData.endDate,
        VehicleID: user.vehicleID ? Number(user.vehicleID) : null,
      };

      console.log('Creating project:', projectDto);
      const result = await createProject(projectDto);
      console.log('Project created:', result);

      // Add to local state
      const newService: CustomService = {
        id: result.appointmentID,
        name: formData.name,
        price: result.totalPrice ? `Rs ${result.totalPrice}` : 'Rs 0',
        description: formData.description,
        endDate: formData.endDate,
        status: 'pending',
        createdAt: result.startDate,
      };

      setCustomServices([newService, ...customServices]);
      alert('Project created successfully!');
      resetForm();
    } catch (error: any) {
      console.error('Error creating project:', error);
      const errorMessage = error.response?.data || 'Failed to create project. Please try again.';
      alert(errorMessage);
    }
  };

  // Update project
  const handleEditService = (): void => {
    if (!validateForm()) return;

    const updatedServices = customServices.map(service => 
      service.id === editingId 
        ? { 
            ...service, 
            name: formData.name,
            description: formData.description,
            endDate: formData.endDate 
          }
        : service
    );

    setCustomServices(updatedServices);
    alert('Note: Project updates are local only. Backend update not yet implemented.');
    resetForm();
  };

  // Delete project from backend
  const handleDeleteService = async (id: number): Promise<void> => {
    const shouldDelete = PAGE_CONFIG.confirmDelete 
      ? window.confirm('Are you sure you want to delete this project?')
      : true;

    if (!shouldDelete) return;

    try {
      await deleteAppointment(id);
      setCustomServices(customServices.filter(service => service.id !== id));
      alert('Project deleted successfully!');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  const startEdit = (service: CustomService): void => {
    setEditingId(service.id);
    setIsAdding(true);
    setFormData({
      name: service.name,
      description: service.description,
      endDate: service.endDate
    });
  };

  const resetForm = (): void => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      endDate: ''
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a1a1a]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-red-500 rounded-full animate-spin border-t-transparent"></div>
          <p className="text-gray-300">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a1a1a]">
        <div className="text-center">
          <p className="text-xl text-gray-300">Please log in to view your projects.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 ${dark ? 'bg-[#1a1a1a]' : 'bg-gray-50'}`}>
      <div className="px-4 mx-auto max-w-7xl">
        <div className="flex gap-6">
          <Sidebar role="customer" />
          <div className="flex-1">
            {/* Header */}
            <div className={`${dark ? PAGE_CONFIG.headerBg : 'bg-white'} p-6 mb-8 rounded-lg shadow-md`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`${PAGE_CONFIG.headerIcon} p-3 rounded-full`}>
                    <Plus className={`w-8 h-8 ${dark ? 'text-red-500' : `text-${PAGE_CONFIG.primaryColor}-400`}`} />
                  </div>
                  <div>
                    <h1 className={`text-3xl font-bold ${dark ? PAGE_CONFIG.titleColor : 'text-gray-800'}`}>{PAGE_CONFIG.title}</h1>
                    <p className={`${dark ? 'text-gray-300' : 'text-gray-600'}`}>{PAGE_CONFIG.subtitle}</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  {!isAdding && (
                    <button
                      onClick={() => setIsAdding(true)}
                      className={`${dark ? `bg-${PAGE_CONFIG.primaryColor}-600 text-gray-200` : `bg-${PAGE_CONFIG.primaryColor}-600 text-white`} px-6 py-3 rounded-lg font-semibold hover:bg-${PAGE_CONFIG.primaryColor}-700 transition duration-200 flex items-center space-x-2`}
                    >
                      <Plus className="w-5 h-5" />
                      <span>{PAGE_CONFIG.addButtonText}</span>
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
                formTitle={PAGE_CONFIG.formTitle}
                primaryColor={PAGE_CONFIG.primaryColor}
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
                  <p className="text-lg text-gray-400">{PAGE_CONFIG.emptyStateTitle}</p>
                  <p className="text-gray-500">{PAGE_CONFIG.emptyStateSubtitle}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {customServices.map((service) => (
                    <ProjectCard
                      key={service.id}
                      service={service}
                      onEdit={startEdit}
                      onDelete={handleDeleteService}
                      showStatus={PAGE_CONFIG.showStatus}
                      showCreatedDate={PAGE_CONFIG.showCreatedDate}
                      primaryColor={PAGE_CONFIG.primaryColor}
                      dark={dark}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;