import React, { useState } from 'react';
import { Wrench } from 'lucide-react';
import ServiceCard from '../../components/customer/ServiceCard';
import BookingSummary from '../../components/customer/BookingSummary';

// ============================================
// 🎨 CUSTOMIZATION SECTION - CHANGE THESE!
// ============================================

interface Service {
  id: number;
  name: string;
  price: string;
  description: string;
  category?: string;
}

// ✏️ EDIT YOUR SERVICES HERE - Add, remove, or modify services
const DEFAULT_SERVICES: Service[] = [
  {
    id: 1,
    name: 'Oil Change',
    price: '$49.99',
    description: 'Complete oil and filter change',
    category: 'Maintenance'
  },
  {
    id: 2,
    name: 'Tire Rotation',
    price: '$29.99',
    description: 'Rotate all four tires for even wear',
    category: 'Maintenance'
  },
  {
    id: 3,
    name: 'Brake Inspection',
    price: '$39.99',
    description: 'Complete brake system check',
    category: 'Safety'
  },
  {
    id: 4,
    name: 'Battery Check',
    price: '$19.99',
    description: 'Battery health and charging test',
    category: 'Maintenance'
  },
  {
    id: 5,
    name: 'Air Filter Replacement',
    price: '$34.99',
    description: 'Replace engine air filter',
    category: 'Maintenance'
  },
  {
    id: 6,
    name: 'Wheel Alignment',
    price: '$79.99',
    description: 'Four-wheel alignment service',
    category: 'Maintenance'
  },
  {
    id: 7,
    name: 'Transmission Service',
    price: '$129.99',
    description: 'Transmission fluid change and inspection',
    category: 'Major Service'
  },
  {
    id: 8,
    name: 'Full Vehicle Inspection',
    price: '$89.99',
    description: 'Comprehensive vehicle health check',
    category: 'Inspection'
  },
  {
    id: 9,
    name: 'Coolant Flush',
    price: '$69.99',
    description: 'Complete cooling system flush',
    category: 'Maintenance'
  },
  {
    id: 10,
    name: 'Wiper Blade Replacement',
    price: '$24.99',
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

// ============================================
// 💡 COMPONENT - You can use props for dynamic data
// ============================================

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
      return total + parseFloat(service?.price.replace('$', '') || '0');
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
      alert(`Booking confirmed for ${selectedServices.length} service(s)!\nTotal: $${getTotalCost()}${endDate ? `\nDesired completion: ${endDate}` : ''}`);
    }
  };

  const dark = !!pageConfig.darkMode;

  return (
    <div className={`min-h-screen py-8 ${dark ? 'bg-[#1a1a1a]' : 'bg-gray-50'}`}>
      <div className="px-4 mx-auto max-w-7xl">
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
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePage;
