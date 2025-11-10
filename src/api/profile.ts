import axios from "axios";
import type { ProfileData } from "../pages/customer/Profile";

export type EmployeeProfileDto = {
  employeeID?: number | string;
  userID?: number | string;
  userName?: string;
  name?: string;
  email?: string;
  phone?: string | null;
  phoneNumber?: string | null;
  position?: string;
  role?: string;
  createdAt?: string;
  empNo?: string;
  isActive?: boolean;
  raw?: any;
};

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5093';

const MOCK_PROFILE: EmployeeProfileDto = {
  employeeID: 101,
  userID: '67c051da0b79e1ee3cee9bd6',
  name: 'Shireen Shamil',
  email: 'shireenshamil@gmail.com',
  phone: '+94 77 123 4567',
  position: 'Senior Technician',
  empNo: 'EMP001',
  isActive: true,
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

export async function getCustomerProfile(userId: string): Promise<ProfileData> {
  const base = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5093";
  const url = `${base.replace(/\/+$/,'')}/api/Customers/${encodeURIComponent(userId)}`;
  const token = localStorage.getItem("accessToken");
  const headers: any = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  // some backends may use cookie auth; include credentials and also send Authorization if available
  const res = await axios.get(url, { headers, withCredentials: true });
  return res.data as ProfileData;
}

export async function updateCutomerProfile(userId: string, dto: { userName?: string; phoneNumber?: string; address?: string }) {
  const base = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5093";
  const url = `${base.replace(/\/+$/,'')}/api/Customers/${encodeURIComponent(userId)}`;
  const token = localStorage.getItem("accessToken");
  const headers: any = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await axios.put(url, dto, { headers, withCredentials: true });
  return res.data;
}


export async function resetPassword(userId: string, dto: { currentPassword: string; newPassword: string }) {
  const base = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5093";
  const url = `${base.replace(/\/+$/,'')}/api/Auth/reset-password/${encodeURIComponent(userId)}`;
  const token = localStorage.getItem("accessToken");
  const headers: any = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await axios.post(url, dto, { headers, withCredentials: true });
  return res.data;
}