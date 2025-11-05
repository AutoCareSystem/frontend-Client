import React, { useState } from 'react';
import { Wrench, Trash2 } from 'lucide-react';
import ServiceCard from '../../components/customer/ServiceCard';
import BookingSummary from '../../components/customer/BookingSummary';
import Sidebar from '../../components/Sidebar';


interface Service {
  id: number;
  name: string;
  price: string;
  description: string;
  category?: string;
}

// EDIT YOUR SERVICES HERE - Add, remove, or modify services
const DEFAULT_SERVICES: Service[] = [
  {
    id: 1,
    name: 'Oil Change',
    price: 'Rs 49.99',
    description: 'Complete oil and filter change',
    category: 'Maintenance'
  },
  {
    id: 2,
    name: 'Tire Rotation',
    price: 'Rs 29.99',
    description: 'Rotate all four tires for even wear',
    category: 'Maintenance'
  },
  {
    id: 3,
    name: 'Brake Inspection',
    price: 'Rs 39.99',
    description: 'Complete brake system check',
    category: 'Safety'
  },
  {
    id: 4,
    name: 'Battery Check',
    price: 'Rs 19.99',
    description: 'Battery health and charging test',
    category: 'Maintenance'
  },
  {
    id: 5,
    name: 'Air Filter Replacement',
    price: 'Rs 34.99',
    description: 'Replace engine air filter',
    category: 'Maintenance'
  },
  {
    id: 6,
    name: 'Wheel Alignment',
    price: 'Rs 79.99',
    description: 'Four-wheel alignment service',
    category: 'Maintenance'
  },
  {
    id: 7,
    name: 'Transmission Service',
    price: 'Rs 129.99',
    description: 'Transmission fluid change and inspection',
    category: 'Major Service'
  },
  {
    id: 8,
    name: 'Full Vehicle Inspection',
    price: 'Rs 89.99',
    description: 'Comprehensive vehicle health check',
    category: 'Inspection'
  },
  {
    id: 9,
    name: 'Coolant Flush',
    price: 'Rs 69.99',
    description: 'Complete cooling system flush',
    category: 'Maintenance'
  },
  {
    id: 10,
    name: 'Wiper Blade Replacement',
    price: 'Rs 24.99',
    description: 'Replace front wiper blades',
    category: 'Maintenance'
  },
];

// ✏️ CUSTOMIZE PAGE SETTINGS
const PAGE_CONFIG = {
  title: 'Default Vehicle Services',
  subtitle: 'Select the services you need for your vehicle',
  headerBg: 'bg-[#2a2a2a]',
  headerIcon: 'bg-[#3a3a3a]',
  titleColor: 'text-red-500',
  primaryColor: 'red',
  showCategory: false, // Set to true to show categories
  bookingButtonText: 'Book Now',
  enableMultiSelect: true, // Set to false to allow only one selection
  darkMode: true,
};


interface ServicePageProps {
  services?: Service[];
  // onBooking receives selected ids, selected service objects and optional endDate (yyyy-mm-dd)
  onBooking?: (selectedServiceIds: number[], services: Service[], endDate?: string) => void;
  config?: Partial<typeof PAGE_CONFIG>;
}

const ServicePage: React.FC<ServicePageProps> = ({ 
  services = DEFAULT_SERVICES, 
  onBooking,
  config = PAGE_CONFIG 
}) => {
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [serviceMode, setServiceMode] = useState<'full' | 'half' | 'custom'>('custom');
  const [prevCustomSelection, setPrevCustomSelection] = useState<number[]>([]);

  const FULL_SERVICE_IDS = services.slice(0, 6).map(s => s.id);
  const HALF_SERVICE_IDS = services.slice(0, 4).map(s => s.id);
  
  interface Booking {
    id: number;
    name: string;
    services: Service[];
    total: string;
    description?: string;
    endDate?: string;
    status?: 'pending' | 'in-progress' | 'completed';
    createdAt: string;
  }

  const [bookings, setBookings] = useState<Booking[]>([]);
  
  // Merge custom config with defaults
  const pageConfig = { ...PAGE_CONFIG, ...config };

  const toggleService = (serviceId: number): void => {
    if (pageConfig.enableMultiSelect) {
      // Multi-select mode
      if (selectedServices.includes(serviceId)) {
        setSelectedServices(selectedServices.filter(id => id !== serviceId));
      } else {
        setSelectedServices([...selectedServices, serviceId]);
      }
    } else {
      // Single-select mode
      setSelectedServices([serviceId]);
    }
  };

  const getTotalCost = (): string => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      const raw = (service?.price || '0').toString();
      const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
      return total + (isNaN(num) ? 0 : num);
    }, 0).toFixed(2);
  };

  const handleBooking = (endDate?: string): void => {
    if (selectedServices.length === 0) {
      alert('Please select at least one service');
      return;
    }

    const selectedServiceObjects = services.filter(s => 
      selectedServices.includes(s.id)
    );

    // If custom onBooking handler provided, use it
    if (onBooking) {
      onBooking(selectedServices, selectedServiceObjects, endDate);
    } else {
      // Default behavior
    alert(`Booking confirmed for ${selectedServices.length} service(s)!\nTotal: Rs ${getTotalCost()}${endDate ? `\nDesired completion: ${endDate}` : ''}`);
    }

    // create a booking record so user can see it on the page
    const newBooking: Booking = {
      id: Date.now(),
      name: `Service Booking - ${new Date().toLocaleString()}`,
      services: selectedServiceObjects,
      total: getTotalCost(),
      description: selectedServiceObjects.map(s => s.name).join(', '),
      endDate,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setBookings(prev => [...prev, newBooking]);

    // clear selection and switch to custom mode
    setSelectedServices([]);
    setServiceMode('custom');
  };

  const dark = !!pageConfig.darkMode;

  return (
    <div className={`min-h-screen py-8 ${dark ? 'bg-[#1a1a1a]' : 'bg-gray-50'}`}>
      <div className="px-4 mx-auto max-w-7xl">
        <div className="flex gap-6">
          <Sidebar role="customer" />
          <div className="flex-1">
        {/* Header */}

        {/* Header */}
  <div className={`${dark ? pageConfig.headerBg : 'bg-white'} p-6 mb-8 rounded-lg shadow-md`}>
          <div className="flex items-center mb-2 space-x-3">
            <div className={`${pageConfig.headerIcon} p-3 rounded-full`}>
              <Wrench className={`w-8 h-8 ${dark ? 'text-red-500' : `text-${pageConfig.primaryColor}-600`}`} />
            </div>
            <h1 className={`text-3xl font-bold ${dark ? pageConfig.titleColor : 'text-gray-800'}`}>{pageConfig.title}</h1>
          </div>
          <p className={`${dark ? 'text-gray-300 ml-14' : 'text-gray-600 ml-14'}`}>{pageConfig.subtitle}</p>
        </div>

        {/* Service mode buttons: Full / Half / Custom */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => {
              if (serviceMode !== 'full') {
                setPrevCustomSelection(selectedServices);
                setSelectedServices(FULL_SERVICE_IDS);
                setServiceMode('full');
              }
            }}
            className={`px-4 py-2 rounded-lg font-semibold ${serviceMode === 'full' ? 'bg-red-600 text-white' : (dark ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-700')} border`}
          >
            Full Service
          </button>

          <button
            onClick={() => {
              if (serviceMode !== 'half') {
                setPrevCustomSelection(selectedServices);
                setSelectedServices(HALF_SERVICE_IDS);
                setServiceMode('half');
              }
            }}
            className={`px-4 py-2 rounded-lg font-semibold ${serviceMode === 'half' ? 'bg-red-600 text-white' : (dark ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-700')} border`}
          >
            Half Service
          </button>

          <button
            onClick={() => {
              if (serviceMode !== 'custom') {
                setSelectedServices(prevCustomSelection);
                setServiceMode('custom');
              }
            }}
            className={`px-4 py-2 rounded-lg font-semibold ${serviceMode === 'custom' ? 'bg-red-600 text-white' : (dark ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-700')} border`}
          >
            Custom Service
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Services List */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  selected={selectedServices.includes(service.id)}
                  onToggle={toggleService}
                  disabled={serviceMode !== 'custom'}
                  showCategory={pageConfig.showCategory}
                  primaryColor={pageConfig.primaryColor}
                  dark={dark}
                />
              ))}
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <BookingSummary
              selectedServiceIds={selectedServices}
              services={services}
              onBook={handleBooking}
              primaryColor={pageConfig.primaryColor}
              dark={dark}
              bookingButtonText={pageConfig.bookingButtonText}
              requireCompletionDate={true}
            />
          </div>
        </div>

        {/* Bookings section (shows bookings created from this page) */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-200">Your Bookings</h2>
            {bookings.length > 0 && (
              <span className="text-gray-400">
                {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {bookings.length === 0 ? (
            <div className="p-8 text-center bg-[#2a2a2a] rounded-lg shadow-md">
              <p className="text-lg text-gray-400">No bookings yet</p>
              <p className="text-gray-500">Select services and click "{pageConfig.bookingButtonText}" to create a booking</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bookings.map((b) => (
                <div key={b.id} className={`${dark ? 'bg-[#2a2a2a]' : 'bg-white'} p-6 rounded-lg shadow-md`}> 
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{b.name}</h3>
                      {b.endDate && (
                        <p className={`mt-1 text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Desired completion: {new Date(b.endDate).toLocaleDateString()}</p>
                      )}
                      <p className={`mt-2 text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{b.description}</p>
                    </div>
                    <div className="flex flex-col items-end ml-4 space-y-2">
                      <button
                        onClick={() => setBookings(prev => prev.filter(x => x.id !== b.id))}
                        className={`text-red-400 hover:text-red-500`}
                        title="Delete booking"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <span className={`text-xl font-bold ${pageConfig.primaryColor === 'red' ? 'text-red-400' : `text-${pageConfig.primaryColor}-400`}`}>{`Rs ${b.total}`}</span>
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
