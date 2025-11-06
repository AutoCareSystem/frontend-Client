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
  return Promise.resolve(MOCK_APPOINTMENT_SERVICES.map(a => ({ ...a })));
}
