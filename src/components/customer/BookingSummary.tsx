import React from 'react';

interface Service {
  id: number;
  name: string;
  price: string;
  duration: string;
}

interface Props {
  selectedServiceIds: number[];
  services: Service[];
  onBook: () => void;
  primaryColor?: string;
  bookingButtonText?: string;
  dark?: boolean;
}

const BookingSummary: React.FC<Props> = ({
  selectedServiceIds,
  services,
  onBook,
  primaryColor = 'blue',
  bookingButtonText = 'Book Now',
  dark = false,
}) => {
  const getTotalCost = (): string => {
    return selectedServiceIds
      .reduce((total, id) => {
        const s = services.find(x => x.id === id);
        return total + parseFloat((s?.price || '$0').toString().replace('$', ''));
      }, 0)
      .toFixed(2);
  };

  const getTotalDuration = (): number => {
    return selectedServiceIds.reduce((total, id) => {
      const s = services.find(x => x.id === id);
      return total + parseInt((s?.duration || '0').toString());
    }, 0);
  };

  const containerBg = dark ? 'bg-[#2a2a2a]' : 'bg-white';
  const titleColor = dark ? 'text-gray-200' : 'text-gray-800';
  const textColor = dark ? 'text-gray-300' : 'text-gray-700';
  const muted = dark ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`sticky p-6 ${containerBg} rounded-lg shadow-md top-8`}>
      <h2 className={`mb-4 text-xl font-bold ${titleColor}`}>Booking Summary</h2>

      {selectedServiceIds.length === 0 ? (
        <p className="py-8 text-center text-gray-400">No services selected</p>
      ) : (
        <>
          <div className="mb-6 space-y-3">
            {selectedServiceIds.map((serviceId) => {
              const service = services.find(s => s.id === serviceId);
              return (
                <div key={serviceId} className="flex items-center justify-between pb-2 border-b">
                  <span className={`${textColor}`}>{service?.name}</span>
                  <span className="font-semibold text-gray-200">{service?.price}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 mb-6 space-y-2 border-t">
            <div className="flex items-center justify-between">
              <span className={`${muted}`}>Total Duration:</span>
              <span className="font-semibold text-gray-200">{getTotalDuration()} min</span>
            </div>
            <div className="flex items-center justify-between text-lg">
              <span className="font-bold text-gray-200">Total Cost:</span>
              <span className={`font-bold text-${primaryColor}-600`}>${getTotalCost()}</span>
            </div>
          </div>

          <button
            onClick={onBook}
            className={`w-full bg-${primaryColor}-600 text-white py-3 rounded-lg font-semibold hover:bg-${primaryColor}-700 transition duration-200`}
          >
            {bookingButtonText}
          </button>
        </>
      )}
    </div>
  );
};

export default BookingSummary;
