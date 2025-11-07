export type AppointmentDto = {
  id?: number;
  appointmentID?: number;
  customer?: string;
  customerName?: string;
  startDate?: string;
  endDate?: string | null;
  type?: 'Service' | 'Project' | string;
  status?: 'Pending' | 'Approved' | 'Completed' | 'Rejected' | string;
  service?: string;
  // UI-friendly helper fields
  customerDisplay?: string;
  vehiclePlate?: string;
  serviceDisplay?: string;
  totalPrice?: number | null;
  // raw payload (for detail view)
  raw?: any;
};

import axios from 'axios';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5292';

/**
 * Fetch appointments from backend with optional filters.
 * If backend is unavailable the function will reject and callers may fall back to a local dataset.
 */
export async function fetchAppointments(params?: { type?: string; status?: string; q?: string }): Promise<AppointmentDto[]> {
  const query: string[] = [];
  if (params?.type) query.push(`type=${encodeURIComponent(params.type)}`);
  if (params?.status) query.push(`status=${encodeURIComponent(params.status)}`);
  if (params?.q) query.push(`q=${encodeURIComponent(params.q)}`);
  const qp = query.length ? `?${query.join('&')}` : '';
  const res = await axios.get(`${API_BASE}/api/Appointments${qp}`);
  if (!res || !Array.isArray(res.data)) throw new Error('Invalid response from appointments API');
  const toString = (v: any) => {
    if (v == null) return undefined;
    if (typeof v === 'string') return v;
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    // Attempt to extract common name fields from an object
    if (typeof v === 'object') {
      if (v.fullName) return v.fullName;
      if (v.name) return v.name;
      if (v.customerName) return v.customerName;
      const maybeFirstLast = `${v.firstName ?? ""} ${v.lastName ?? ""}`.trim();
      if (maybeFirstLast) return maybeFirstLast;
      try {
        return JSON.stringify(v);
      } catch (e) {
        return String(v);
      }
    }
    return String(v);
  };

  return res.data.map((a: any) => {
    const appointmentServices = Array.isArray(a.appointmentServices) ? a.appointmentServices : [];
    const serviceTitles = appointmentServices
      .map((s: any) => s?.service?.title ?? s?.service?.name ?? s?.title)
      .filter(Boolean);

    // Try to extract package/service items if present
    if (!serviceTitles.length && a.serviceDetails?.servicePackage?.items) {
      (a.serviceDetails.servicePackage.items as any[]).forEach((it: any) => {
        const t = it?.service?.title ?? it?.service?.name ?? it?.packageName;
        if (t) serviceTitles.push(t);
      });
    }

    const customerDisplay = toString(a.customerName ?? a.customer ?? a.customerFullName ?? a.user?.userName ?? a.user?.userName ?? a.user?.userName ?? a.user?.userName);
    const vehiclePlate = toString(a.vehicle?.plateNumber ?? a.vehicle?.plate ?? a.vehicle?.plateNo);
    const serviceDisplay = serviceTitles.length ? serviceTitles.join(', ') : toString(a.service ?? a.serviceDetails?.servicePackage?.name ?? a.title);

  // Return a minimal, UI-focused object only (keep raw payload for detail view)
    return {
      id: a.id ?? a.appointmentID ?? a.appointmentId,
      appointmentID: a.appointmentID ?? a.appointmentId ?? a.id,
      customerDisplay: customerDisplay ?? undefined,
      vehiclePlate: vehiclePlate ?? undefined,
      startDate: toString(a.startDate ?? a.start_time ?? a.start),
      endDate: toString(a.endDate ?? a.end_time ?? null),
      type: toString(a.type ?? a.appointmentType ?? (a.packageType ? 'Service' : undefined)) ?? undefined,
      status: toString(a.status) ?? undefined,
      serviceDisplay: serviceDisplay ?? undefined,
      totalPrice: a.totalPrice ?? a.total_price ?? a.price ?? null,
      raw: a,
    } as AppointmentDto;
  });
}
