import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Car,
  Wrench,
  Clock,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import { apiService } from "../../services/api";
import type {
  Vehicle,
  Service,
  BookingForm as BookingFormType,
} from "../../types";
import ServiceSelection from "./ServiceSelection";
import VehicleSelection from "./VehicleSelection";
import DateTimeSelection from "./DateTimeSelection";

const bookingSchema = z.object({
  vehicleId: z.string().min(1, "Please select a vehicle"),
  serviceId: z.string().min(1, "Please select a service"),
  appointmentDate: z.string().min(1, "Please select a date"),
  appointmentTime: z.string().min(1, "Please select a time"),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const BookingForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [vehiclesResponse, servicesResponse] = await Promise.all([
          apiService.getVehicles(),
          apiService.getServices(),
        ]);

        if (vehiclesResponse.success && vehiclesResponse.data) {
          setVehicles(vehiclesResponse.data);
        }

        if (servicesResponse.success && servicesResponse.data) {
          setServices(servicesResponse.data);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Update form values when selections change
  useEffect(() => {
    if (selectedVehicle) {
      setValue("vehicleId", selectedVehicle.id);
    }
  }, [selectedVehicle, setValue]);

  useEffect(() => {
    if (selectedService) {
      setValue("serviceId", selectedService.id);
    }
  }, [selectedService, setValue]);

  useEffect(() => {
    if (selectedDate) {
      setValue("appointmentDate", selectedDate.toISOString().split("T")[0]);
    }
  }, [selectedDate, setValue]);

  useEffect(() => {
    if (selectedTime) {
      setValue("appointmentTime", selectedTime);
    }
  }, [selectedTime, setValue]);

  const steps = [
    { number: 1, title: "Select Service", icon: Wrench },
    { number: 2, title: "Choose Vehicle", icon: Car },
    { number: 3, title: "Pick Date & Time", icon: Calendar },
    { number: 4, title: "Review & Confirm", icon: CheckCircle },
  ];

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    try {
      setIsSubmitting(true);
      const response = await apiService.createBooking(data);

      if (response.success) {
        navigate("/bookings", {
          state: {
            message: "Booking created successfully!",
            booking: response.data,
          },
        });
      } else {
        throw new Error(response.message || "Failed to create booking");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return selectedService !== null;
      case 2:
        return selectedVehicle !== null;
      case 3:
        return selectedDate !== null && selectedTime !== null;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}m`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;

            return (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      isCompleted
                        ? "bg-green-600 text-white"
                        : isActive
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      isActive ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      isCompleted ? "bg-green-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Step 1: Service Selection */}
        {currentStep === 1 && (
          <ServiceSelection
            services={services}
            selectedService={selectedService}
            onServiceSelect={setSelectedService}
            isLoading={isLoading}
          />
        )}

        {/* Step 2: Vehicle Selection */}
        {currentStep === 2 && (
          <VehicleSelection
            vehicles={vehicles}
            selectedVehicle={selectedVehicle}
            onVehicleSelect={setSelectedVehicle}
            isLoading={isLoading}
          />
        )}

        {/* Step 3: Date & Time Selection */}
        {currentStep === 3 && (
          <DateTimeSelection
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateSelect={setSelectedDate}
            onTimeSelect={setSelectedTime}
            availableSlots={null}
            isLoading={isLoading}
            serviceId={selectedService?.id}
          />
        )}

        {/* Step 4: Review & Confirm */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">
              Review Your Booking
            </h3>

            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
              {/* Service Details */}
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Wrench className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Service</h4>
                  <p className="text-gray-600">{selectedService?.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedService?.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {formatDuration(selectedService?.duration || 0)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4" />
                      <span>${selectedService?.price}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Car className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Vehicle</h4>
                  <p className="text-gray-600">
                    {selectedVehicle?.make} {selectedVehicle?.model} (
                    {selectedVehicle?.year})
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedVehicle?.licensePlate} • {selectedVehicle?.color}
                  </p>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Appointment</h4>
                  <p className="text-gray-600">
                    {selectedDate && formatDate(selectedDate)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedTime && formatTime(selectedTime)}
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Additional Notes (Optional)
                </label>
                <textarea
                  {...register("notes")}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any special instructions or notes for the service..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </button>

          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={!canProceedToNext()}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!canProceedToNext() || isSubmitting}
              className="flex items-center px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Booking...
                </>
              ) : (
                <>
                  Confirm Booking
                  <CheckCircle className="h-4 w-4 ml-2" />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
