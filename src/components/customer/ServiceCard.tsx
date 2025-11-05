import React from 'react';
import { Check } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  price: string;
  description: string;
  category?: string;
}

interface Props {
  service: Service;
  selected: boolean;
  onToggle: (id: number) => void;
  showCategory?: boolean;
  primaryColor?: string;
  dark?: boolean;
}

const ServiceCard: React.FC<Props> = ({ service, selected, onToggle, showCategory = false, primaryColor = 'blue', dark = false }) => {
  const cardBg = dark ? 'bg-[#2a2a2a]' : 'bg-white';
  const titleColor = dark ? 'text-gray-200' : 'text-gray-800';
  const descColor = dark ? 'text-gray-300' : 'text-gray-600';
  const categoryBg = dark ? 'bg-[#3a3a3a]' : 'bg-gray-100';

  return (
    <div
      onClick={() => onToggle(service.id)}
      className={`${cardBg} rounded-lg shadow-md p-6 cursor-pointer transition duration-200 ${
        selected
          ? `border-2 border-${primaryColor}-500 ${primaryColor === 'red' ? 'bg-red-50/10' : `bg-${primaryColor}-50`}`
          : `border-2 border-transparent hover:border-${primaryColor}-300`
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className={`text-lg font-bold ${titleColor}`}>{service.name}</h3>
          {showCategory && service.category && (
            <span className={`inline-block px-2 py-1 mt-1 text-xs ${dark ? 'text-gray-400' : 'text-gray-500'} ${categoryBg} rounded`}>
              {service.category}
            </span>
          )}
        </div>
        {selected && <Check className={`w-6 h-6 text-${primaryColor}-600`} />}
      </div>
      <p className={`mb-3 text-sm ${descColor}`}>{service.description}</p>
      <div className="flex items-center justify-between">
        <span className={`text-xl font-bold text-${primaryColor}-600`}>{service.price}</span>
      </div>
    </div>
  );
};

export default ServiceCard;
