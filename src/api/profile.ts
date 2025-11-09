import axios from "axios";

export type EmployeeProfileDto = {
  employeeID?: number;
  userID?: number;
  name?: string;
  email?: string;
  phone?: string;
  position?: string;
  hourlyRate?: number;
  totalAppointments?: number;
  completedAppointments?: number;
  recentAppointments?: Array<any>;
};

export async function getEmployeeProfile(userId: string): Promise<EmployeeProfileDto> {
  const base = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5093";
  const url = `${base.replace(/\/+$/,'')}/api/Profile/employee/${encodeURIComponent(userId)}`;
  const token = localStorage.getItem("accessToken");
  const headers: any = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  // some backends may use cookie auth; include credentials and also send Authorization if available
  const res = await axios.get(url, { headers, withCredentials: true });
  return res.data as EmployeeProfileDto;
}

export async function updateEmployeeProfile(userId: string, dto: { name?: string; phone?: string; position?: string }) {
  const base = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5093";
  const url = `${base.replace(/\/+$/,'')}/api/Profile/employee/${encodeURIComponent(userId)}`;
  const token = localStorage.getItem("accessToken");
  const headers: any = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await axios.put(url, dto, { headers, withCredentials: true });
  return res.data;
}
