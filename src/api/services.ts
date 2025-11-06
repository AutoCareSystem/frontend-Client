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

export async function createService(payload: ServiceDto): Promise<ServiceDto> {
  const base = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5093";
  const normalized = base.replace(/\/+$/g, '');
  const urls: string[] = [];
  urls.push(`${normalized}/api/services`);
  // build a safe fallback using the URL API to avoid malformed strings
  try {
    const parsed = new URL(base);
    const hostFallback = `${parsed.protocol}//${parsed.hostname}:5292/api/services`;
    urls.push(hostFallback);
  } catch (e) {
    // fallback to literal localhost:5292
    urls.push(`http://localhost:5292/api/services`);
  }
  // explicit localhost fallback as last resort
  if (!urls.includes(`http://localhost:5292/api/services`)) urls.push(`http://localhost:5292/api/services`);

  const token = localStorage.getItem("accessToken");
  const headers: any = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  let lastErr: any = null;
  for (const url of urls) {
    try {
      const res = await axios.post(url, payload, { headers, withCredentials: true });
      if (res?.data) return res.data as ServiceDto;
    } catch (e: any) {
      lastErr = e;
      // try next
    }
  }

  const tried = urls.join(', ');
  const msg = lastErr ? `${lastErr?.message || String(lastErr)} (tried: ${tried})` : `No response from backends (tried: ${tried})`;
  throw new Error(`Failed to create service: ${msg}`);
}
