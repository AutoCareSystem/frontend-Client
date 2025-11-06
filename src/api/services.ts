import axios from "axios";

export type ServiceDto = {
  serviceID?: number;
  code?: string;
  title?: string;
  description?: string;
  duration?: number;
  price?: number;
  status?: string;
};

export async function fetchServices(): Promise<ServiceDto[]> {
  const base = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5093";
  const normalized = base.replace(/\/+$/g, '');
  const urls = [
    `${normalized}/api/services`,
    // fallback to the other port you mentioned where service endpoints may live
    `${normalized.replace(/:\d+$/, '')}:5292/api/services`,
  ];

  const token = localStorage.getItem("accessToken");
  const headers: any = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  for (const url of urls) {
    try {
      const res = await axios.get(url, { headers, withCredentials: true });
      if (res?.data && Array.isArray(res.data)) return res.data as ServiceDto[];
    } catch (e) {
      // try next
    }
  }

  throw new Error("Failed to fetch services from backend");
}
