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
export async function fetchAppointments(params?: { type?: string; status?: string; q?: string; employeeId?: string }): Promise<AppointmentDto[]> {
  const query: string[] = [];
  if (params?.type) query.push(`type=${encodeURIComponent(params.type)}`);
  if (params?.status) query.push(`status=${encodeURIComponent(params.status)}`);
  if (params?.q) query.push(`q=${encodeURIComponent(params.q)}`);
  if (params?.employeeId) query.push(`employeeId=${encodeURIComponent(params.employeeId)}`);
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

/**
 * Update appointment status on the backend.
 * Behavior:
 * - Reads the current user id from localStorage and sends it as header 'X-User-ID' when present.
 * - Ensures the appointment id is passed as an integer in the request body as `appointmentID`.
 * - Also passes `employeeID` in the body when available (from the argument or localStorage).
 * - Calls action-style endpoints: /api/Appointments/{id}/accept, /reject, /complete, etc.
 */
export async function updateAppointmentStatus(
  appointmentId: number | string,
  status: string,
  employeeID?: string | null
): Promise<any> {
  const userId = typeof window !== 'undefined' ? (localStorage.getItem('UserId') ?? localStorage.getItem('UserID') ?? localStorage.getItem('userid')) : null;
    const headers: Record<string, string> = {};
    // Send multiple common header variants so different backend expectations are met
    if (userId) {
      headers['X-User-ID'] = userId as string;
      headers['UserID'] = userId as string;
      headers['x-user-id'] = userId as string;
    }

  // Try to obtain employeeID from argument then localStorage as a fallback
  // Prefer the 'EmployeeID' key (capital E) in localStorage, fall back to older variants
  let emp = employeeID ?? (typeof window !== 'undefined' ? (localStorage.getItem('EmployeeID') ?? localStorage.getItem('employeeID') ?? localStorage.getItem('employeeId') ?? localStorage.getItem('employee')) : null);

  const idNumber = typeof appointmentId === 'string' ? Number(appointmentId) : appointmentId;
  // Map status display strings to action endpoints
  const actionMap: Record<string, string> = {
    Approved: 'accept',
    Rejected: 'reject',
    Completed: 'complete',
    Pending: 'pending',
  };
  const action = actionMap[status] ?? String(status).toLowerCase();

  // Backend expects the appointment id in the URL and employee id (and appointmentID) in the body.
  // Ensure we send the shape that backend requires: { appointmentID: <id>, employeeID: '<id>' }
  if (!emp) {
    throw new Error('employeeID is required to update appointment status. Set localStorage.employeeID or pass employeeID to the helper.');
  }
  // Include employee id in headers as some backends expect it there
  headers['EmployeeID'] = emp as string;
  headers['X-Employee-ID'] = emp as string;
  headers['x-employee-id'] = emp as string;
  headers['employeeid'] = emp as string;

  const body: any = { appointmentID: idNumber, employeeID: emp };

  const url = `${API_BASE}/api/Appointments/${idNumber}/${action}`;
  // Debug: log request details to help diagnose 400 responses
  try {
    // eslint-disable-next-line no-console
    console.debug('[updateAppointmentStatus] PUT', url, { headers, body });
  const res = await axios.put(url, body, { headers });
  // eslint-disable-next-line no-console
  console.debug('[updateAppointmentStatus] response', res.status, res.data);
  return res.data;
  } catch (err: any) {
    // Log full response for easier debugging
    // eslint-disable-next-line no-console
    console.error('[updateAppointmentStatus] error', err?.response?.status, err?.response?.data || err?.message || err);
    if (err?.response) {
      const msg = err.response.data?.message ?? err.response.data ?? err.response.statusText ?? 'Bad Request';
      // Include status and server payload in thrown error for visibility in UI
      throw new Error(`Failed to update appointment status (${err.response.status}): ${JSON.stringify(msg)}`);
    }
    throw err;
  }
}

/**
 * Fetch a single appointment by id (detailed payload).
 * Use this from list views when the user requests to view an appointment's full data.
 */
export async function fetchAppointmentById(appointmentId: number | string): Promise<any> {
  const id = typeof appointmentId === 'string' ? appointmentId : String(appointmentId);
  const res = await axios.get(`${API_BASE}/api/Appointments/${encodeURIComponent(id)}`);
  if (!res) throw new Error('Invalid response from appointments API');
  return res.data;
}
