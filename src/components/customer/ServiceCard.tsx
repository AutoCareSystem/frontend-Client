import React from 'react';
import { CheckCircle, Lock } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  price: string;
  description: string;
  category?: string;
}

interface ServiceCardProps {
  service: Service;
  selected: boolean;
  onToggle: (id: number) => void;
  showCategory?: boolean;
  primaryColor?: string;
  dark?: boolean;
  disabled?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  selected,
  onToggle,
  showCategory = false,
  primaryColor = 'red',
  dark = false
  ,disabled = false
}) => {
  const getBgColor = () => {
    if (dark) {
      return selected ? 'bg-red-900/20' : 'bg-[#2a2a2a]';
    }
    return selected ? `bg-${primaryColor}-50` : 'bg-white';
  };

  const getBorderColor = () => {
    if (dark) {
      return selected ? 'border-red-500' : 'border-gray-700';
    }
    return selected ? `border-${primaryColor}-500` : 'border-gray-200';
  };

  return (
    <div
      className={`p-4 border-2 rounded-lg transition-all duration-200 ${getBgColor()} ${getBorderColor()} ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
      onClick={() => !disabled && onToggle(service.id)}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className={`text-lg font-semibold ${dark ? 'text-white' : 'text-gray-800'}`}>
          {service.name}
        </h3>
        <div className="flex items-center space-x-2">
          {selected && (
            <CheckCircle className={`w-6 h-6 ${dark ? 'text-red-500' : `text-${primaryColor}-500`}`} />
          )}
          {disabled && (
            <Lock className={`w-5 h-5 ${dark ? 'text-gray-400' : 'text-gray-500'}`} />
          )}
        </div>
      </div>
      
      {showCategory && service.category && (
        <div className={`text-sm mb-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
          Category: {service.category}
        </div>
      )}

      <p className={`text-sm mb-3 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
        {service.description}
      </p>

      <div className={`text-lg font-bold ${dark ? 'text-red-500' : `text-${primaryColor}-600`}`}>
        {service.price}
      </div>
    </div>
  );
};

export default ServiceCard;
