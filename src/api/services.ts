export type ServiceDto = {
  serviceID?: number;
  code?: string;
  title?: string;
  description?: string;
  duration?: number;
  price?: number;
  status?: string;
};

// In-memory dummy dataset for services (frontend-only)
const MOCK_SERVICES: ServiceDto[] = [
  { serviceID: 1, code: 'SRV-FULL-01', title: 'Full Car Service', description: 'Complete inspection, oil change, and safety checks.', duration: 120, price: 24000, status: 'Active' },
  { serviceID: 2, code: 'SRV-INT-01', title: 'Interior Cleaning', description: 'Deep interior cleaning and vacuuming.', duration: 60, price: 5000, status: 'Active' },
  { serviceID: 3, code: 'SRV-ENG-01', title: 'Engine Tuneup', description: 'Engine diagnostics and tuneup.', duration: 180, price: 35000, status: 'Inactive' },
];

export async function fetchServices(): Promise<ServiceDto[]> {
  // Return a copy so callers can mutate without affecting the mock source
  return Promise.resolve(MOCK_SERVICES.map(s => ({ ...s })));
}

export async function createService(payload: ServiceDto): Promise<ServiceDto> {
  const nextId = MOCK_SERVICES.reduce((m, s) => Math.max(m, s.serviceID ?? 0), 0) + 1;
  const created: ServiceDto = { serviceID: nextId, ...payload };
  MOCK_SERVICES.push(created);
  return Promise.resolve({ ...created });
}

