import React, { useEffect, useState } from 'react';
import { Wrench } from 'lucide-react';
import ServiceCard from '../../components/customer/ServiceCard';
import BookingSummary from '../../components/customer/BookingSummary';
import Sidebar from '../../components/Sidebar';
import { getServices } from '../../api/services';
import type { Service } from '../../api/services';
import { createAppointment, getCustomerAppointments, type Appointment } from '../../api/appointments';
import type { AppointmentDto } from '../../api/appointments';
import { useAuth } from '../../context/AuthContext';

interface Booking {
  id: number;
  services: Service[];
  total: number;
  endDate?: string;
  createdAt: string;
  status?: string;
}

const PAGE_CONFIG = {
  title: 'Default Vehicle Services',
  subtitle: 'Select the services you need for your vehicle',
  headerBg: 'bg-[#2a2a2a]',
  headerIcon: 'bg-[#3a3a3a]',
  titleColor: 'text-red-500',
  primaryColor: 'red',
  showCategory: false,
  bookingButtonText: 'Book Now',
  enableMultiSelect: true,
  darkMode: true,
};

const ServicePage: React.FC = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [serviceMode, setServiceMode] = useState<'Full' | 'Half' | 'Custom'>('Custom');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [bookingsLoading, setBookingsLoading] = useState<boolean>(true);

  const activeServices = services.filter(s => s.status === 'Active');
  
  // Simple hardcoded service selection
  const FULL_SERVICE_IDS = activeServices.slice(0, 4).map(s => s.serviceID);
  const HALF_SERVICE_IDS = activeServices.slice(0, 2).map(s => s.serviceID);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        const mapped: Service[] = data.map(s => ({
          serviceID: s.serviceID,
          name: s.title,
          price: s.price.toString(),
          description: s.description,
          code: s.code,
          duration: s.duration,
          status: s.status,
        }));
        setServices(mapped);
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Fetch existing appointments/bookings from backend
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.customerID || services.length === 0) {
        setBookingsLoading(false);
        return;
      }

      try {
        const appointments = await getCustomerAppointments(user.customerID);
        
        // Filter for Service-type appointments and map to Booking format
        const serviceAppointments = appointments.filter(
          (apt: Appointment) => apt.appointmentType === 'Service'
        );

        const mappedBookings: Booking[] = serviceAppointments.map((apt: Appointment) => {
          // Get service details for this appointment
          const appointmentServices = apt.customServiceIDs?.map(serviceId => {
            const service = services.find(s => s.serviceID === serviceId);
            return service || {
              serviceID: serviceId,
              name: 'Unknown Service',
              price: '0',
              description: '',
              code: '',
              duration: 0,
              status: 'Active'
            };
          }) || [];

          return {
            id: apt.appointmentID,
            services: appointmentServices,
            total: apt.totalPrice || 0,
            endDate: apt.endDate ? apt.endDate.split('T')[0] : undefined,
            createdAt: apt.startDate,
            status: apt.status,
          };
        });

        setBookings(mappedBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setBookingsLoading(false);
      }
    };

    fetchBookings();
  }, [user?.customerID, services]);

  const toggleService = (serviceId: number) => {
    if (PAGE_CONFIG.enableMultiSelect) {
      setSelectedServices(prev =>
        prev.includes(serviceId)
          ? prev.filter(id => id !== serviceId)
          : [...prev, serviceId]
      );
    } else {
      setSelectedServices([serviceId]);
    }
  };

  const getTotalCost = (): number => {
    return selectedServices.reduce((sum, id) => {
      const service = services.find(s => s.serviceID === id);
      if (!service) return sum;
      const priceNum =
        typeof service.price === 'string'
          ? parseFloat(service.price.replace(/[^0-9.]/g, '')) || 0
          : service.price;
      return sum + priceNum;
    }, 0);
  };

  const handleServiceModeChange = (mode: 'Full' | 'Half' | 'Custom') => {
    setServiceMode(mode);
    
    if (mode === 'Full') {
      setSelectedServices(FULL_SERVICE_IDS);
    } else if (mode === 'Half') {
      setSelectedServices(HALF_SERVICE_IDS);
    } else {
      setSelectedServices([]);
    }
  };

  const handleBooking = async (endDate?: string) => {
    if (selectedServices.length === 0) {
      alert('Select at least one service.');
      return;
    }

    if (!localStorage.getItem("userId")) {
      alert('Please log in to make a booking.');
      return;
    }

    const now = new Date();
    const startDateTime = now.toISOString();
    const timeOnly = now.toTimeString().split(' ')[0];

    const endDateTime = endDate 
      ? new Date(endDate + 'T23:59:59').toISOString() 
      : undefined;

    const dto: AppointmentDto = {
      CustomerID: localStorage.getItem("userId"),
      VehicleID: 10,
      StartDate: startDateTime,
      Time: timeOnly,
      AppointmentType: 'Service',
      ServiceOption: serviceMode,
      CustomServiceIDs: selectedServices,
      EndDate: endDateTime,
    };

    try {
      console.log('Sending booking DTO:', dto);
      const result = await createAppointment(dto);
      console.log('Booking created:', result);

      const selectedObjects = services.filter(s =>
        selectedServices.includes(s.serviceID)
      );

      // Add new booking to state
      const newBooking: Booking = {
        id: result.appointmentID,
        services: selectedObjects,
        total: result.totalPrice || getTotalCost(),
        endDate: endDate,
        createdAt: result.startDate,
        status: result.status,
      };

      setBookings(prev => [newBooking, ...prev]);
      setSelectedServices([]);
      setServiceMode('Custom');
      alert('Booking successful!');
    } catch (err: any) {
      console.error('Error creating booking:', err);
      console.error('Error response:', err.response);
      console.error('Error response data:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      const errorMessage = err.response?.data || 'Error creating booking. Check console for details.';
      alert(errorMessage);
    }
  };

  const dark = PAGE_CONFIG.darkMode;

  // Get services to display based on mode
  const getServicesToDisplay = (): Service[] => {
    if (serviceMode === 'Full') {
      // Show first 4 active services for Full Service
      return activeServices.slice(0, 4);
    } else if (serviceMode === 'Half') {
      // Show first 2 active services for Half Service
      return activeServices.slice(0, 2);
    }
    // Custom mode shows all active services
    return activeServices;
  };

  const servicesToDisplay = getServicesToDisplay();

  if (loading) return <div className="p-8 text-center text-gray-300">Loading services...</div>;

  return (
    <div className={`min-h-screen py-8 ${dark ? 'bg-[#1a1a1a]' : 'bg-gray-50'}`}>
      <div className="px-4 mx-auto max-w-7xl">
        <div className="flex gap-6">
          <Sidebar role="customer" />
          <div className="flex-1">
            {/* Header */}
            <div className={`${dark ? PAGE_CONFIG.headerBg : 'bg-white'} p-6 mb-8 rounded-lg shadow-md`}>
              <div className="flex items-center mb-2 space-x-3">
                <div className={`${PAGE_CONFIG.headerIcon} p-3 rounded-full`}>
                  <Wrench className={`w-8 h-8 ${dark ? 'text-red-500' : 'text-red-600'}`} />
                </div>
                <h1 className={`text-3xl font-bold ${dark ? PAGE_CONFIG.titleColor : 'text-gray-800'}`}>
                  {PAGE_CONFIG.title}
                </h1>
              </div>
              <p className={`${dark ? 'text-gray-300 ml-14' : 'text-gray-600 ml-14'}`}>
                {PAGE_CONFIG.subtitle}
              </p>
            </div>

            {/* Service mode buttons */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => handleServiceModeChange('Full')}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  serviceMode === 'Full' ? 'bg-red-600 text-white' : dark ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-700'
                } border`}
              >
                Full Service (4 Services)
              </button>
              <button
                onClick={() => handleServiceModeChange('Half')}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  serviceMode === 'Half' ? 'bg-red-600 text-white' : dark ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-700'
                } border`}
              >
                Half Service (2 Services)
              </button>
              <button
                onClick={() => handleServiceModeChange('Custom')}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  serviceMode === 'Custom' ? 'bg-red-600 text-white' : dark ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-700'
                } border`}
              >
                Custom Service
              </button>
            </div>

            {/* Services count display */}
            <div className="mb-4">
              <p className="text-sm text-gray-400">
                Showing {servicesToDisplay.length} services 
                {serviceMode !== 'Custom' && ` for ${serviceMode} Service`}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Service list */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {servicesToDisplay.map(service => (
                    <ServiceCard
                      key={service.serviceID}
                      service={{
                        id: service.serviceID,
                        name: service.name,
                        description: service.description,
                        price: service.price,
                        category: service.category,
                      }}
                      selected={selectedServices.includes(service.serviceID)}
                      onToggle={toggleService}
                      disabled={serviceMode !== 'Custom'}
                      showCategory={PAGE_CONFIG.showCategory}
                      primaryColor={PAGE_CONFIG.primaryColor}
                      dark={dark}
                    />
                  ))}
                </div>
              </div>

              {/* Booking summary */}
              <div className="lg:col-span-1">
                <BookingSummary
                  selectedServiceIds={selectedServices}
                  services={services.map(s => ({
                    id: s.serviceID,
                    name: s.name,
                    price: s.price,
                    description: s.description,
                  }))}
                  onBook={handleBooking}
                  primaryColor={PAGE_CONFIG.primaryColor}
                  dark={dark}
                  bookingButtonText={PAGE_CONFIG.bookingButtonText}
                  requireCompletionDate={true}
                />
              </div>
            </div>

            {/* Bookings display */}
            <div className="mt-10">
              <h2 className="mb-4 text-2xl font-bold text-gray-200">Your Bookings</h2>
              
              {bookingsLoading ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 border-4 border-red-500 rounded-full animate-spin border-t-transparent"></div>
                  <p className="text-gray-400">Loading your bookings...</p>
                </div>
              ) : bookings.length === 0 ? (
                <p className="text-gray-400">No bookings yet</p>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {bookings.map(b => (
                    <div key={b.id} className={`${dark ? 'bg-[#2a2a2a]' : 'bg-white'} p-6 rounded-lg shadow-md`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-gray-200">
                              Booking #{b.id}
                            </h3>
                            {b.status && (
                              <span className={`px-2 py-1 text-xs rounded ${
                                b.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                b.status === 'Confirmed' ? 'bg-blue-500/20 text-blue-400' :
                                b.status === 'In Progress' ? 'bg-purple-500/20 text-purple-400' :
                                b.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                                'bg-gray-500/20 text-gray-400'
                              }`}>
                                {b.status}
                              </span>
                            )}
                          </div>
                          <p className="mb-2 text-sm text-gray-400">
                            {new Date(b.createdAt).toLocaleDateString()}
                          </p>
                          {b.endDate && (
                            <p className="mb-2 text-sm text-gray-400">
                              Completion: {b.endDate}
                            </p>
                          )}
                          <div className="mb-3">
                            <p className="mb-1 text-xs font-semibold text-gray-500">Services:</p>
                            {b.services.length > 0 ? (
                              <ul className="space-y-1">
                                {b.services.map((service, idx) => (
                                  <li key={idx} className="text-sm text-gray-300">
                                    • {service.name}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-500">No services listed</p>
                            )}
                          </div>
                          <div className="pt-3 mt-3 border-t border-gray-700">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-gray-400">Total:</span>
                              <span className="text-xl font-bold text-red-400">
                                Rs {typeof b.total === 'number' ? b.total.toFixed(2) : b.total}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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

export default ServicePage;