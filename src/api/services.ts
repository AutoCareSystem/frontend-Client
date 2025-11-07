export type ServiceDto = {
  serviceID?: number;
  code?: string;
  title?: string;
  description?: string;
  duration?: number;
  price?: number;
  status?: string;
  createdByDisplay?: string;
};

import axios from 'axios';

const toString = (v: any) => {
  if (v == null) return undefined;
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (typeof v === 'object') {
    if (v.normalizedUserName) return v.normalizedUserName;
    if (v.userName) return v.userName;
    if (v.fullName) return v.fullName;
    const maybe = `${v.firstName ?? ''} ${v.lastName ?? ''}`.trim();
    if (maybe) return maybe;
    try { return JSON.stringify(v); } catch { return String(v); }
  }
  return String(v);
};

/**
 * Fetch services from backend API. This function will throw if the request fails
 * so callers can show an explicit error state. The frontend no longer ships a
 * built-in mock catalog — the app expects the backend to provide the service list.
 */
export async function fetchServices(): Promise<ServiceDto[]> {
  const base = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5292';
  const res = await axios.get(`${base}/api/Services`);
  if (!res || !Array.isArray(res.data)) throw new Error('Invalid response from services API');
  return res.data.map((s: any) => ({
    serviceID: s.serviceID ?? s.serviceId ?? s.id,
    code: s.code,
    title: s.title,
    description: s.description,
    duration: s.duration,
    price: s.price,
    status: s.status,
    createdByDisplay: toString(s.createdBy ?? s.user ?? s.owner ?? s.createdByUser ?? s.creator),
  }));
}

/**
 * Create a service by POSTing to the backend. Returns the created service DTO
 * as returned by the API.
 */
export async function createService(payload: ServiceDto): Promise<ServiceDto> {
  const base = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5292';
  const body = {
    code: payload.code,
    title: payload.title,
    description: payload.description,
    duration: payload.duration,
    price: payload.price,
    status: payload.status,
  };
  const res = await axios.post(`${base}/api/Services`, body);
  if (!res || !res.data) throw new Error('Failed to create service');
  const s = res.data;
  return {
    serviceID: s.serviceID ?? s.serviceId ?? s.id,
    code: s.code,
    title: s.title,
    description: s.description,
    duration: s.duration,
    price: s.price,
    status: s.status,
    createdByDisplay: toString(s.createdBy ?? s.user ?? s.owner ?? s.createdByUser ?? s.creator),
  };
}

