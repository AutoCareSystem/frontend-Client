// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: "customer" | "employee" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Vehicle Types
export interface Vehicle {
  id: string;
  customerId: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  licensePlate: string;
  color: string;
  mileage: number;
  createdAt: string;
  updatedAt: string;
}

// Service Types
export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: "maintenance" | "repair" | "inspection" | "emergency";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Booking and Appointment Types
export interface Booking {
  id: string;
  customerId: string;
  vehicleId: string;
  serviceId: string;
  appointmentDate: string;
  appointmentTime: string;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  notes: string;
  estimatedDuration: number;
  actualDuration?: number;
  totalCost: number;
  createdAt: string;
  updatedAt: string;
  // Relations
  customer?: User;
  vehicle?: Vehicle;
  service?: Service;
}

export interface TimeSlot {
  time: string;
  isAvailable: boolean;
  bookingId?: string;
}

export interface AvailableSlots {
  date: string;
  slots: TimeSlot[];
}

// Project Types (for modifications/requests)
export interface Project {
  id: string;
  customerId: string;
  vehicleId: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "in_progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  estimatedCost: number;
  actualCost?: number;
  estimatedDuration: number; // in days
  actualDuration?: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  // Relations
  customer?: User;
  vehicle?: Vehicle;
}

// Status Update Types
export interface StatusUpdate {
  id: string;
  bookingId?: string;
  projectId?: string;
  status: string;
  message: string;
  timestamp: string;
  updatedBy: string;
  // Relations
  updatedByUser?: User;
}

// Time Logging Types
export interface TimeLog {
  id: string;
  bookingId?: string;
  projectId?: string;
  employeeId: string;
  startTime: string;
  endTime: string;
  description: string;
  createdAt: string;
  // Relations
  employee?: User;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface VehicleForm {
  make: string;
  model: string;
  year: number;
  vin: string;
  licensePlate: string;
  color: string;
  mileage: number;
}

export interface BookingForm {
  vehicleId: string;
  serviceId: string;
  appointmentDate: string;
  appointmentTime: string;
  notes: string;
}

export interface ProjectForm {
  vehicleId: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  estimatedCost: number;
}

// Dashboard Types
export interface DashboardStats {
  totalBookings: number;
  upcomingAppointments: number;
  completedServices: number;
  totalSpent: number;
  activeProjects: number;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: string;
}

// Chatbot Types
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ChatbotState {
  messages: ChatMessage[];
  isLoading: boolean;
  isOpen: boolean;
}
