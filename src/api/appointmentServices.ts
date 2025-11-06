import axios from "axios";

export type AppointmentServiceDto = {
  appointmentID?: number;
  customerName?: string;
  customerEmail?: string;
  vehicleInfo?: string;
  startDate?: string;
  time?: string;
  status?: string;
  employeeName?: string;
  serviceOption?: string;
  totalPrice?: number;
  packageName?: string;
  packageType?: string;
  packageServices?: Array<{ title?: string; price?: number }>;
  customServices?: Array<{ title?: string; price?: number }>;
};

export async function fetchAppointmentServices(): Promise<AppointmentServiceDto[]> {
  const base = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5292";
  const normalized = base.replace(/\/+$/g, '');
  const urls = [
    // common variants (some backends use different casing or singular/plural)
    `${normalized}/api/Appointments/services`,
    `${normalized}/api/Appointments/service`,
    `${normalized}/api/appointments/services`,
    `${normalized}/api/appointments/service`,
    // fallback host/port (try both plural/singular)
    `${normalized.replace(/:\d+$/, '')}:5292/api/Appointments/services`,
    `${normalized.replace(/:\d+$/, '')}:5292/api/Appointments/service`,
    `${normalized.replace(/:\d+$/, '')}:5292/api/appointments/services`,
    `${normalized.replace(/:\d+$/, '')}:5292/api/appointments/service`,
  ];

  const token = localStorage.getItem("accessToken");
  const headers: any = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  let lastErr: any = null;
  for (const url of urls) {
    try {
      const res = await axios.get(url, { headers, withCredentials: true });
      if (res?.data && Array.isArray(res.data)) return res.data as AppointmentServiceDto[];
      // if server returned something but not an array, capture and continue
      if (res?.data) {
        lastErr = new Error(`Unexpected response shape from ${url}: ${JSON.stringify(res.data).slice(0, 200)}`);
      }
    } catch (e: any) {
      lastErr = e;
      // continue to next URL
    }
  }

  const tried = urls.join(', ');
  const msg = lastErr ? `${lastErr?.message || String(lastErr)} (tried: ${tried})` : `No response from backends (tried: ${tried})`;
  throw new Error(`Failed to fetch appointment services from backend: ${msg}`);
}
