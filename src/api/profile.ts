export type EmployeeProfileDto = {
  employeeID?: number;
  userID?: number | string;
  name?: string;
  email?: string;
  phone?: string;
  position?: string;
  hourlyRate?: number;
  totalAppointments?: number;
  completedAppointments?: number;
  recentAppointments?: Array<any>;
};

const MOCK_PROFILE: EmployeeProfileDto = {
  employeeID: 101,
  userID: '67c051da0b79e1ee3cee9bd6',
  name: 'Shireen Shamil',
  email: 'shireenshamil@gmail.com',
  phone: '+94 77 123 4567',
  position: 'Senior Technician',
  hourlyRate: 1200,
  totalAppointments: 128,
  completedAppointments: 110,
  recentAppointments: [
    { id: 5, title: 'Full Car Service', date: '2025-11-05' },
    { id: 4, title: 'Brake Inspection', date: '2025-11-03' },
  ],
};

export async function getEmployeeProfile(userId: string): Promise<EmployeeProfileDto> {
  return Promise.resolve({ ...MOCK_PROFILE, userID: userId });
}

export async function updateEmployeeProfile(userId: string, dto: { name?: string; phone?: string; position?: string }) {
  // Apply changes to mock (in-memory) and return updated
  const updated = { ...MOCK_PROFILE, ...dto, userID: userId };
  return Promise.resolve(updated);
}
