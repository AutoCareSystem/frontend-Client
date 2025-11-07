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
  packageName?: string | null;
  packageType?: string | null;
  packageServices?: Array<{ title?: string; price?: number }>;
  customServices?: Array<{ title?: string; price?: number }>;
};

const MOCK_APPOINTMENT_SERVICES: AppointmentServiceDto[] = [
  {
    appointmentID: 5,
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    vehicleInfo: "Toyota Toyota Corolla (2019) - CAR-1234",
    startDate: "2025-11-05T00:00:00Z",
    time: "01:49:00",
    status: "Completed",
    employeeName: "Not Assigned",
    serviceOption: "Custom",
    totalPrice: 20000,
    packageName: null,
    packageType: null,
    packageServices: [],
    customServices: [
      { title: "Full Engine Service", price: 15000 },
      { title: "Interior Cleaning", price: 5000 },
    ],
  },
  {
    appointmentID: 4,
    customerName: "Kevin Perera",
    customerEmail: "kevin.perera@example.com",
    vehicleInfo: "Nissan Nissan X-Trail (2018) - SUV-9101",
    startDate: "2025-11-05T00:00:00Z",
    time: "08:00:00",
    status: "Completed",
    employeeName: "Not Assigned",
    serviceOption: "Full",
    totalPrice: 24000,
    packageName: "Full Car Service Package",
    packageType: "Full",
    packageServices: [
      { title: "Full Engine Service", price: 15000 },
      { title: "Interior Cleaning", price: 5000 },
      { title: "Brake Inspection", price: 4000 },
    ],
    customServices: [],
  },
  {
    appointmentID: 3,
    customerName: "Sarah Fernando",
    customerEmail: "sarah.fernando@example.com",
    vehicleInfo: "Honda Honda Civic (2021) - CIV-5678",
    startDate: "2025-11-05T00:00:00Z",
    time: "09:00:00",
    status: "Pending",
    employeeName: "Not Assigned",
    serviceOption: "Custom",
    totalPrice: 24000,
    packageName: null,
    packageType: null,
    packageServices: [],
    customServices: [
      { title: "Full Engine Service", price: 15000 },
      { title: "Interior Cleaning", price: 5000 },
      { title: "Brake Inspection", price: 4000 },
    ],
  },
];

export async function fetchAppointmentServices(): Promise<AppointmentServiceDto[]> {
  // Try backend first, fall back to mock if unavailable
  try {
    const base = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5292';
    // dynamic import axios to avoid adding at top-level if not present
    // but axios is already a dependency; import normally for clarity
    const axios = (await import('axios')).default;
    const res = await axios.get(`${base}/api/Appointments/service`);
    if (res && Array.isArray(res.data)) {
      return res.data.map((s: any) => ({
        appointmentID: s.appointmentID ?? s.appointmentId ?? s.id,
        customerName: s.customerName,
        customerEmail: s.customerEmail,
        vehicleInfo: s.vehicleInfo,
        startDate: s.startDate,
        time: s.time,
        status: s.status,
        employeeName: s.employeeName,
        serviceOption: s.serviceOption,
        totalPrice: s.totalPrice,
        packageName: s.packageName ?? null,
        packageType: s.packageType ?? null,
        packageServices: Array.isArray(s.packageServices) ? s.packageServices.map((ps: any) => ({ title: ps.title, price: ps.price })) : [],
        customServices: Array.isArray(s.customServices) ? s.customServices.map((cs: any) => ({ title: cs.title, price: cs.price })) : [],
      }));
    }
  } catch (err: any) {
    console.warn('fetchAppointmentServices: backend request failed, using mock data', err?.message || err);
  }

  return Promise.resolve(MOCK_APPOINTMENT_SERVICES.map(a => ({ ...a })));
}
