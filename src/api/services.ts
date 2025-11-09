import axios from "axios";

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




/**
 * Fetch services from backend API. This function will throw if the request fails
 * so callers can show an explicit error state. The frontend no longer ships a
 * built-in mock catalog — the app expects the backend to provide the service list.
 */

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

/**
 * Delete a service by id.
 * Sends user id headers if available to aid authorization auditing on the backend.
 */
export async function deleteService(serviceId: number | string): Promise<void> {
  const base = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5292';
  const userId = typeof window !== 'undefined' ? (localStorage.getItem('userId') ?? localStorage.getItem('userID') ?? localStorage.getItem('userid') ?? localStorage.getItem('UserID')) : null;
  const headers: Record<string, string> = {};
  if (userId) {
    headers['X-User-ID'] = userId;
    headers['UserID'] = userId;
    headers['x-user-id'] = userId;
  }

  try {
    await axios.delete(`${base}/api/Services/${serviceId}`, { headers });
  } catch (err: any) {
    if (err?.response) {
      const msg = err.response.data?.message ?? err.response.data ?? err.response.statusText;
      throw new Error(`Failed to delete service: ${String(msg)}`);
    }
    throw err;
  }
}

/**
 * Update an existing service by PUTting to /api/Services/{serviceId}.
 * Accepts a partial ServiceDto payload (only fields to update).
 */
export async function updateService(serviceId: number | string, payload: Partial<ServiceDto>): Promise<ServiceDto> {
  const base = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5292';
  const userId = typeof window !== 'undefined' ? (localStorage.getItem('userId') ?? localStorage.getItem('userID') ?? localStorage.getItem('userid') ?? localStorage.getItem('UserID')) : null;
  const headers: Record<string, string> = {};
  if (userId) {
    headers['X-User-ID'] = userId;
    headers['UserID'] = userId;
    headers['x-user-id'] = userId;
  }

  const body: any = {};
  // Some backends validate that the id in the route matches the id in the body.
  // Include both common variants so validation passes: `id` and `serviceID`.
  body.id = Number(serviceId);
  body.serviceID = Number(serviceId);
  if (payload.code !== undefined) body.code = payload.code;
  if (payload.title !== undefined) body.title = payload.title;
  if (payload.description !== undefined) body.description = payload.description;
  if (payload.duration !== undefined) body.duration = payload.duration;
  if (payload.price !== undefined) body.price = payload.price;
  if (payload.status !== undefined) body.status = payload.status;

  try {
    const res = await axios.put(`${base}/api/Services/${serviceId}`, body, { headers });
    // Some backends return 204 No Content on successful update. If res.data is empty,
    // construct a best-effort DTO from the returned status and request body + payload.
    let s: any = null;
    if (res && res.data) {
      s = res.data;
    } else if (res && (res.status === 200 || res.status === 204)) {
      // Build a fallback response object using the body we sent and the provided payload
      s = {
        id: Number(serviceId),
        serviceID: Number(serviceId),
        code: body.code ?? payload.code,
        title: body.title ?? payload.title,
        description: body.description ?? payload.description,
        duration: body.duration ?? payload.duration,
        price: body.price ?? payload.price,
        status: body.status ?? payload.status,
      };
    }
    if (!s) {
      throw new Error('Invalid response from update service API');
    }
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
  } catch (err: any) {
    if (err?.response) {
      const msg = err.response.data?.message ?? err.response.data ?? err.response.statusText;
      throw new Error(`Failed to update service: ${String(msg)}`);
    }
    throw err;
  }
}

