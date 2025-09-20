import React, { createContext, useContext, ReactNode } from "react";
import type { DashboardStats, Booking, Service, Vehicle } from "../types";

interface MockDataContextType {
  dashboardStats: DashboardStats;
  bookings: Booking[];
  services: Service[];
  vehicles: Vehicle[];
  isLoading: boolean;
}

const mockDashboardStats: DashboardStats = {
  totalBookings: 5,
  upcomingAppointments: 2,
  completedServices: 3,
  totalSpent: 450.0,
  activeProjects: 1,
};

const mockVehicles: Vehicle[] = [
  {
    id: "vehicle-1",
    customerId: "dev-user-1",
    make: "Toyota",
    model: "Camry",
    year: 2020,
    vin: "1HGBH41JXMN109186",
    licensePlate: "ABC-123",
    color: "Silver",
    mileage: 45000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "vehicle-2",
    customerId: "dev-user-1",
    make: "Honda",
    model: "Civic",
    year: 2019,
    vin: "2HGBH41JXMN109187",
    licensePlate: "XYZ-789",
    color: "Blue",
    mileage: 52000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockServices: Service[] = [
  {
    id: "service-1",
    name: "Oil Change",
    description: "Complete oil change service with filter replacement",
    duration: 30,
    price: 29.99,
    category: "maintenance",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "service-2",
    name: "Brake Service",
    description: "Brake pad replacement and brake fluid check",
    duration: 120,
    price: 149.99,
    category: "repair",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "service-3",
    name: "Engine Tune-up",
    description: "Complete engine inspection and tune-up",
    duration: 180,
    price: 199.99,
    category: "maintenance",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "service-4",
    name: "Tire Rotation",
    description: "Tire rotation and pressure check",
    duration: 45,
    price: 39.99,
    category: "maintenance",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockBookings: Booking[] = [
  {
    id: "booking-1",
    customerId: "dev-user-1",
    vehicleId: "vehicle-1",
    serviceId: "service-1",
    appointmentDate: "2024-01-15",
    appointmentTime: "10:00",
    status: "confirmed",
    notes: "Regular maintenance",
    estimatedDuration: 30,
    totalCost: 29.99,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customer: {
      id: "dev-user-1",
      email: "dev@example.com",
      firstName: "John",
      lastName: "Doe",
      phone: "123-456-7890",
      role: "customer",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    vehicle: mockVehicles[0],
    service: mockServices[0],
  },
  {
    id: "booking-2",
    customerId: "dev-user-1",
    vehicleId: "vehicle-2",
    serviceId: "service-2",
    appointmentDate: "2024-01-20",
    appointmentTime: "14:00",
    status: "pending",
    notes: "Brake pads making noise",
    estimatedDuration: 120,
    totalCost: 149.99,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customer: {
      id: "dev-user-1",
      email: "dev@example.com",
      firstName: "John",
      lastName: "Doe",
      phone: "123-456-7890",
      role: "customer",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    vehicle: mockVehicles[1],
    service: mockServices[1],
  },
];

const MockDataContext = createContext<MockDataContextType | undefined>(
  undefined
);

export const MockDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const value: MockDataContextType = {
    dashboardStats: mockDashboardStats,
    bookings: mockBookings,
    services: mockServices,
    vehicles: mockVehicles,
    isLoading: false,
  };

  return (
    <MockDataContext.Provider value={value}>
      {children}
    </MockDataContext.Provider>
  );
};

export const useMockData = (): MockDataContextType => {
  const context = useContext(MockDataContext);
  if (context === undefined) {
    throw new Error("useMockData must be used within a MockDataProvider");
  }
  return context;
};
