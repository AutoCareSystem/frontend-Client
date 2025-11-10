// src/api/appointments.ts
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5292/api";

// ---------------------
// TypeScript interfaces
// ---------------------
export interface AppointmentDto {
  CustomerID: string;
  VehicleID: number | null;
  StartDate: string;
  Time: string;
  AppointmentType: "Service" | "Project";
  ServiceOption?: "Full" | "Half" | "Custom";
  CustomServiceIDs?: number[];
  EndDate?: string;
  ProjectTitle?: string;
  ProjectDescription?: string;
  EmployeeID?: string;
}

export interface Appointment {
  appointmentID: number;
  customerID: string;
  vehicleID: number | null;
  startDate: string;
  time: string;
  appointmentType: string;
  serviceOption?: string;
  customServiceIDs?: number[];
  endDate?: string;
  status: string;
  totalPrice?: number;
  projectDetails?: {
    projectTitle: string;
    projectDescription?: string;
  };
}

// ✅ New interface for Project creation
export interface CreateProjectDto {
  CustomerID: string;
  ProjectTitle: string;
  ProjectDescription: string;
  EndDate?: string;
  VehicleID?: number | null;
}

// ---------------------
// API functions
// ---------------------

// Create a new appointment (Service or Project)
export const createAppointment = async (dto: AppointmentDto): Promise<Appointment> => {
  try {
    const response = await axios.post(`${API_BASE}/Appointments`, dto);
    return response.data;
  } catch (err) {
    console.error("Error in createAppointment:", err);
    throw err;
  }
};

// ✅ Create a Project appointment
export const createProject = async (dto: CreateProjectDto): Promise<Appointment> => {
  const now = new Date();
  const appointmentDto: AppointmentDto = {
    CustomerID: dto.CustomerID,
    VehicleID: dto.VehicleID || null,
    StartDate: now.toISOString(),
    Time: now.toTimeString().split(' ')[0],
    AppointmentType: "Project",
    ProjectTitle: dto.ProjectTitle,
    ProjectDescription: dto.ProjectDescription,
    EndDate: dto.EndDate ? new Date(dto.EndDate + 'T23:59:59').toISOString() : undefined,
  };

  try {
    const response = await axios.post(`${API_BASE}/Appointments`, appointmentDto);
    return response.data;
  } catch (err) {
    console.error("Error in createProject:", err);
    throw err;
  }
};

// Get all appointments
export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    const response = await axios.get(`${API_BASE}/Appointments`);
    return response.data;
  } catch (err) {
    console.error("Error in getAppointments:", err);
    throw err;
  }
};

// ✅ Get all project appointments for a customer
export const getCustomerProjects = async (customerID: string): Promise<Appointment[]> => {
  try {
    const response = await axios.get(`${API_BASE}/Appointments`);
    // Filter for Project type appointments for this customer
    const allAppointments: Appointment[] = response.data;
    return allAppointments.filter(
      apt => apt.appointmentType === "Project" && apt.customerID === customerID
    );
  } catch (err) {
    console.error("Error in getCustomerProjects:", err);
    throw err;
  }
};

// Get appointments for a specific customer and vehicle
export const getCustomerAppointments = async (
  customerID: string,
  vehicleID?: number
): Promise<Appointment[]> => {
  try {
    const url = vehicleID
      ? `${API_BASE}/Appointments/customer/${customerID}/vehicle/${vehicleID}`
      : `${API_BASE}/Appointments/customer/${customerID}`;
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    console.error("Error in getCustomerAppointments:", err);
    throw err;
  }
};

// ✅ Delete an appointment (including projects)
export const deleteAppointment = async (appointmentID: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE}/Appointments/${appointmentID}`);
  } catch (err) {
    console.error("Error in deleteAppointment:", err);
    throw err;
  }
};

// ✅ Update an appointment (including projects)
export const updateAppointment = async (
  appointmentID: number,
  dto: Partial<AppointmentDto>
): Promise<Appointment> => {
  try {
    const response = await axios.put(`${API_BASE}/Appointments/${appointmentID}`, dto);
    return response.data;
  } catch (err) {
    console.error("Error in updateAppointment:", err);
    throw err;
  }
};