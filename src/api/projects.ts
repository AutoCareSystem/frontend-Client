import axios from 'axios';

export type ProjectDto = {
  appointmentID?: number;
  customerDisplay?: string;
  vehiclePlate?: string;
  startDate?: string;
  endDate?: string | null;
  status?: string;
  projectTitle?: string;
  projectDescription?: string;
  totalPrice?: number | null;
  raw?: any;
};

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5292';

const toString = (v: any) => {
  if (v == null) return undefined;
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (typeof v === 'object') {
    if (v.fullName) return v.fullName;
    if (v.name) return v.name;
    if (v.customerName) return v.customerName;
    const maybeFirstLast = `${v.firstName ?? ''} ${v.lastName ?? ''}`.trim();
    if (maybeFirstLast) return maybeFirstLast;
    try { return JSON.stringify(v); } catch { return String(v); }
  }
  return String(v);
};

export async function fetchProjects(): Promise<ProjectDto[]> {
  const res = await axios.get(`${API_BASE}/api/Projects`);
  if (!res || !Array.isArray(res.data)) throw new Error('Invalid response from projects API');

  return res.data.map((p: any) => {
    const customerDisplay = toString(
      p.customer?.user?.normalizedUserName ??
        p.customer?.user?.userName ??
        p.customer?.user?.fullName ??
        p.customer?.userName ??
        p.customer?.customerName ??
        p.customer?.customerFullName
    );
    const vehiclePlate = toString(p.vehicle?.plateNumber ?? p.vehicle?.plate ?? p.vehicle?.plateNo);
    const projectTitle = toString(p.projectDetails?.projectTitle ?? p.projectDetails?.title ?? p.projectTitle ?? p.title);
    const projectDescription = toString(p.projectDetails?.projectDescription ?? p.projectDetails?.description ?? p.projectDescription ?? p.description);

    return {
      appointmentID: p.appointmentID,
      customerDisplay: customerDisplay ?? undefined,
      vehiclePlate: vehiclePlate ?? undefined,
      startDate: toString(p.startDate ?? p.start_time ?? p.start) ?? undefined,
      endDate: toString(p.endDate ?? p.end_time ?? null) ?? undefined,
      status: toString(p.status) ?? undefined,
      projectTitle: projectTitle ?? undefined,
      projectDescription: projectDescription ?? undefined,
      totalPrice: p.totalPrice ?? p.total_price ?? p.price ?? null,
      raw: p,
    } as ProjectDto;
  });
}

