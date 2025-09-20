import React, { useState } from "react";
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
import { useMockData } from "../../contexts/MockDataProvider";
import type { BookingForm as BookingFormType } from "../../types";

const bookingSchema = z.object({
  vehicleId: z.string().min(1, "Please select a vehicle"),
  serviceId: z.string().min(1, "Please select a service"),
  appointmentDate: z.string().min(1, "Please select a date"),
  appointmentTime: z.string().min(1, "Please select a time"),
  notes: z.string().optional(),
});

const BookingFormMock: React.FC = () => {
  const { services, vehicles } = useMockData();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BookingFormType>({
    resolver: zodResolver(bookingSchema),
  });

  const steps = [
    { id: 1, name: "Select Service", icon: Wrench },
    { id: 2, name: "Select Vehicle", icon: Car },
    { id: 3, name: "Date & Time", icon: Calendar },
    { id: 4, name: "Review & Confirm", icon: CheckCircle },
  ];

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    setValue("serviceId", service.id);
  };

  const handleVehicleSelect = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setValue("vehicleId", vehicle.id);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setValue("appointmentDate", date.toISOString().split("T")[0]);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setValue("appointmentTime", time);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: BookingFormType) => {
    setIsSubmitting(true);
    console.log("Mock booking submission:", data);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    alert("Booking submitted successfully! (This is mock data)");
    navigate("/dev/dashboard");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Select a Service
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedService?.id === service.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {service.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {service.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${service.price}
                      </p>
                      <p className="text-sm text-gray-600">
                        {service.duration} min
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {errors.serviceId && (
              <p className="text-red-600 text-sm">{errors.serviceId.message}</p>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Select a Vehicle
            </h3>
            <div className="space-y-3">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  onClick={() => handleVehicleSelect(vehicle)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedVehicle?.id === vehicle.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {vehicle.make} {vehicle.model} ({vehicle.year})
                      </h4>
                      <p className="text-sm text-gray-600">
                        {vehicle.licensePlate} •{" "}
                        {vehicle.mileage.toLocaleString()} miles
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{vehicle.color}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {errors.vehicleId && (
              <p className="text-red-600 text-sm">{errors.vehicleId.message}</p>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Select Date & Time
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => handleDateSelect(new Date(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time
                </label>
                <select
                  onChange={(e) => handleTimeSelect(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                </select>
              </div>
            </div>
            {errors.appointmentDate && (
              <p className="text-red-600 text-sm">
                {errors.appointmentDate.message}
              </p>
            )}
            {errors.appointmentTime && (
              <p className="text-red-600 text-sm">
                {errors.appointmentTime.message}
              </p>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Review Your Booking
            </h3>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">
                Service Details
              </h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{selectedService?.name}</p>
                  <p className="text-sm text-gray-600">
                    {selectedService?.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${selectedService?.price}</p>
                  <p className="text-sm text-gray-600">
                    {selectedService?.duration} minutes
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">
                Vehicle Details
              </h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {selectedVehicle?.make} {selectedVehicle?.model} (
                    {selectedVehicle?.year})
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedVehicle?.licensePlate} •{" "}
                    {selectedVehicle?.mileage.toLocaleString()} miles
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {selectedVehicle?.color}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">
                Appointment Details
              </h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {selectedDate?.toLocaleDateString()} at {selectedTime}
                  </p>
                  <p className="text-sm text-gray-600">
                    Estimated duration: {selectedService?.duration} minutes
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-lg">
                    Total: ${selectedService?.price}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                {...register("notes")}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any special instructions or notes..."
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted
                      ? "bg-blue-600 border-blue-600 text-white"
                      : isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      isCompleted ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step) => (
            <span
              key={step.id}
              className={`text-sm ${
                currentStep === step.id
                  ? "text-blue-600 font-medium"
                  : "text-gray-500"
              }`}
            >
              {step.name}
            </span>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </button>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Booking
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BookingFormMock;
