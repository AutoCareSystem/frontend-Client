import React, { useState, useEffect } from "react";
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  addDays,
  isToday,
  isTomorrow,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import type { AvailableSlots, TimeSlot } from "../../types";

interface DateTimeSelectionProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
  availableSlots: AvailableSlots | null;
  isLoading?: boolean;
  serviceId?: string;
}

const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  availableSlots,
  isLoading = false,
  serviceId,
}) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  // Generate week days
  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentWeek, { weekStartsOn: 1 }), // Start week on Monday
    end: endOfWeek(currentWeek, { weekStartsOn: 1 }),
  });

  // Navigate weeks
  const goToPreviousWeek = () => {
    setCurrentWeek(addDays(currentWeek, -7));
  };

  const goToNextWeek = () => {
    setCurrentWeek(addDays(currentWeek, 7));
  };

  // Load time slots when date changes
  useEffect(() => {
    if (selectedDate && serviceId) {
      // This would typically call an API to get available slots
      // For now, we'll use mock data
      const mockTimeSlots: TimeSlot[] = [
        { time: "09:00", isAvailable: true },
        { time: "10:00", isAvailable: true },
        { time: "11:00", isAvailable: false },
        { time: "12:00", isAvailable: true },
        { time: "13:00", isAvailable: true },
        { time: "14:00", isAvailable: false },
        { time: "15:00", isAvailable: true },
        { time: "16:00", isAvailable: true },
        { time: "17:00", isAvailable: true },
      ];
      setTimeSlots(mockTimeSlots);
    }
  }, [selectedDate, serviceId]);

  const formatTime = (timeString: string) => {
    return format(new Date(`2000-01-01T${timeString}`), "h:mm a");
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "EEE");
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateSelected = (date: Date) => {
    return selectedDate && isSameDay(date, selectedDate);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          Select Date & Time
        </h3>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {[...Array(7)].map((_, index) => (
              <div key={index} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Select Date & Time</h3>

      {/* Calendar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPreviousWeek}
            className="p-1 hover:bg-gray-100 rounded"
            disabled={isLoading}
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>

          <h4 className="text-lg font-medium text-gray-900">
            {format(currentWeek, "MMM yyyy")}
          </h4>

          <button
            onClick={goToNextWeek}
            className="p-1 hover:bg-gray-100 rounded"
            disabled={isLoading}
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((date) => {
            const isDisabled = isDateDisabled(date);
            const isSelected = isDateSelected(date);

            return (
              <button
                key={date.toISOString()}
                onClick={() => !isDisabled && onDateSelect(date)}
                disabled={isDisabled}
                className={`p-2 text-center rounded-lg transition-colors ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : isDisabled
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="text-sm font-medium">{getDateLabel(date)}</div>
                <div className="text-lg font-semibold">{format(date, "d")}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && timeSlots.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-900 mb-3">
            Available Times for {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </h4>

          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => slot.isAvailable && onTimeSelect(slot.time)}
                disabled={!slot.isAvailable}
                className={`p-3 text-center rounded-lg border transition-colors ${
                  selectedTime === slot.time
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : slot.isAvailable
                    ? "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    : "border-gray-100 text-gray-400 cursor-not-allowed bg-gray-50"
                }`}
              >
                <Clock className="h-4 w-4 mx-auto mb-1" />
                <div className="text-sm font-medium">
                  {formatTime(slot.time)}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedDate && timeSlots.length === 0 && !isLoading && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            No available times
          </h4>
          <p className="text-gray-500">Please select a different date</p>
        </div>
      )}
    </div>
  );
};

export default DateTimeSelection;
