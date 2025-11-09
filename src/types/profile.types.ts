// User Info
export interface UserInfo {
  userID: number;
  name: string;
  email: string;
  phone: string;
  address: string | null;
  loyaltyPoints: number;
  role: string | null;
}

// Vehicle Info
export interface VehicleInfo {
  vehicleID: number;
  plateNumber: string;
  model: string;
  company: string | null;
  year: string;
  vin: string;
}

// Upcoming Appointment
export interface UpcomingAppointment {
  appointmentID: number;
  serviceTitle: string;
  date: string; // ISO 8601 format
  time: string; // HH:mm format
  status: string; // "Pending" | "Confirmed" | "In Progress" | "Completed" | "Cancelled"
  progressPercentage: number | null; // 0-100
  appointmentType: string; // "Service" | "Project"
  employeeName: string | null;
}

// Service History Item
export interface ServiceHistoryItem {
  appointmentID: number;
  serviceTitle: string;
  date: string; // ISO 8601 format
  status: string;
  totalPrice: number | null;
  appointmentType: string;
}

// Project Info
export interface ProjectInfo {
  projectID: number;
  projectTitle: string;
  projectDescription: string | null;
  status: string;
  requestedAt: string; // ISO 8601 format
  assignedEmployee: string | null;
  totalPrice: number | null;
}

// Complete Profile Response
export interface CustomerProfile {
  user: UserInfo;
  vehicle: VehicleInfo | null;
  upcomingAppointment: UpcomingAppointment | null;
  serviceHistory: ServiceHistoryItem[];
  projects: ProjectInfo[];
}

// Update Profile Request
export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  address?: string;
}

// Update Vehicle Request
export interface UpdateVehicleRequest {
  model: string;
  year: string;
  vin: string;
  plateNumber: string;
  company?: string;
}