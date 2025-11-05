import React from 'react';
import { generateServiceReport } from '../../utils/pdfGenerator';

interface Service {
  id: number;
  name: string;
  price: string;
  description: string;
  category?: string;
}

interface Props {
  selectedServiceIds: number[];
  services: Service[];
  // onBook receives an optional endDate in ISO format (yyyy-mm-dd)
  onBook: (endDate?: string) => void;
  primaryColor?: string;
  bookingButtonText?: string;
  dark?: boolean;
  requireCompletionDate?: boolean;
}

const BookingSummary: React.FC<Props> = ({
  selectedServiceIds,
  services,
  onBook,
  primaryColor = 'red',
  bookingButtonText = 'Book Now',
  dark = false,
  requireCompletionDate = false,
}) => {
  const getTotalCost = (): string => {
    return selectedServiceIds
      .reduce((total, id) => {
        const s = services.find(x => x.id === id);
        const raw = (s?.price || '0').toString();
        const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
        return total + (isNaN(num) ? 0 : num);
      }, 0)
      .toFixed(2);
  };


  const [endDate, setEndDate] = React.useState<string | undefined>(undefined);
  const [touched, setTouched] = React.useState(false);

  const containerBg = dark ? 'bg-[#2a2a2a]' : 'bg-white';
  const titleColor = dark ? 'text-gray-200' : 'text-gray-800';
  const textColor = dark ? 'text-gray-300' : 'text-gray-700';

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
            <div className="flex items-center justify-between text-lg">
              <span className="font-bold text-gray-200">Total Cost:</span>
              <span className={`font-bold text-${primaryColor}-500`}>Rs {getTotalCost()}</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm text-gray-300">Desired completion date</label>
            <input
              type="date"
              value={endDate || ''}
              onChange={(e) => setEndDate(e.target.value || undefined)}
              className={`w-full px-3 py-2 rounded border ${dark ? 'bg-[#1a1a1a] text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
            />
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setTouched(true);
                if (requireCompletionDate && !endDate) {
                  alert('Please select a desired completion date before booking');
                  return;
                }
                onBook(endDate);
              }}
              className={`w-full bg-${primaryColor}-600 text-white py-3 rounded-lg font-semibold hover:bg-${primaryColor}-700 transition duration-200`}
            >
              {bookingButtonText}
            </button>
            {selectedServiceIds.length > 0 && (
              <button
                onClick={() => {
                  const selectedServices = selectedServiceIds
                    .map(id => services.find(s => s.id === id))
                    .filter((s): s is Service => s !== undefined);
                  generateServiceReport(selectedServices, getTotalCost(), endDate);
                }}
                className="w-full py-3 text-gray-200 transition duration-200 bg-gray-700 rounded-lg hover:bg-gray-600"
              >
                Generate PDF Report
              </button>
            )}
          </div>
          {requireCompletionDate && touched && !endDate && (
            <p className="mt-2 text-sm text-red-400">Completion date is required to book services.</p>
          )}
        </>
      )}
    </div>
  );
};

export default BookingSummary;
