import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5292';

// ---------- Types ----------

// API Response type (what the backend returns)
export interface ServiceApiResponse {
  serviceID: number;
  code: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  status: string;
}

// Frontend Service type (what your components use)
export interface Service {
  serviceID: number;
  name: string;
  price: string;
  description: string;
  category?: string;
  code?: string;
  duration?: number;
  status?: string;
}

export interface ServicePackage {
  servicePackageID: number;
  name: string;
  serviceIds: number[];
}

// ---------- API Functions ----------

// Get all services
export const getServices = async (): Promise<ServiceApiResponse[]> => {
  const res = await axios.get<ServiceApiResponse[]>(`${API_BASE_URL}/api/Services`);
  return res.data;
};

// Get all service packages
export const getServicePackages = async (): Promise<ServicePackage[]> => {
  const res = await axios.get<ServicePackage[]>(`${API_BASE_URL}/api/ServicePackages`);
  return res.data;
};