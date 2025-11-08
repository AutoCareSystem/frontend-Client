import axios from 'axios';

export type EmployeeProfileDto = {
  employeeID?: number | string;
  userID?: number | string;
  userName?: string;
  name?: string;
  email?: string;
  phone?: string | null;
  phoneNumber?: string | null;
  position?: string;
  role?: string;
  createdAt?: string;
  empNo?: string;
  isActive?: boolean;
  raw?: any;
};

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5093';

const MOCK_PROFILE: EmployeeProfileDto = {
  employeeID: 101,
  userID: '67c051da0b79e1ee3cee9bd6',
  name: 'Shireen Shamil',
  email: 'shireenshamil@gmail.com',
  phone: '+94 77 123 4567',
  position: 'Senior Technician',
  empNo: 'EMP001',
  isActive: true,
};

export async function getEmployeeProfile(userId: string): Promise<EmployeeProfileDto> {
  if (!userId) throw new Error('userId is required');
  const url = `${API_BASE}/api/Employees/${encodeURIComponent(userId)}`;
  try {
    const res = await axios.get(url);
    const d = res.data;
    return {
      employeeID: d.employeeID ?? d.empId ?? d.empNo ?? undefined,
      userID: d.userID ?? d.userId ?? d.id ?? userId,
      userName: d.userName ?? undefined,
      name: d.fullName ?? d.name ?? d.userName ?? undefined,
      email: d.email ?? undefined,
      phone: d.phoneNumber ?? d.phone ?? null,
      phoneNumber: d.phoneNumber ?? d.phone ?? null,
      position: d.position ?? undefined,
      role: d.role ?? undefined,
      createdAt: d.createdAt ?? undefined,
      empNo: d.empNo ?? undefined,
      isActive: typeof d.isActive === 'boolean' ? d.isActive : undefined,
      raw: d,
    } as EmployeeProfileDto;
  } catch (err: any) {
    // Fall back to mock for dev if the backend isn't available
    // eslint-disable-next-line no-console
    console.warn('[getEmployeeProfile] failed, falling back to mock', err?.message || err);
    return { ...MOCK_PROFILE, userID: userId };
  }
}

export async function updateEmployeeProfile(userId: string, dto: { userName?: string; email?: string; phoneNumber?: string | null; position?: string | null; empNo?: string | null; isActive?: boolean }) {
  if (!userId) throw new Error('userId is required');
  const url = `${API_BASE}/api/Employees/${encodeURIComponent(userId)}`;
  // Per API contract, send only the profile fields in the PUT body
  const body = {
    userName: dto.userName,
    email: dto.email,
    phoneNumber: dto.phoneNumber,
    position: dto.position,
    empNo: dto.empNo,
    isActive: dto.isActive,
  };
  try {
    const res = await axios.put(url, body);
    const d = res.data;
    return {
      employeeID: d.employeeID ?? d.empId ?? d.empNo ?? undefined,
      userID: d.userID ?? d.userId ?? d.id ?? userId,
      userName: d.userName ?? undefined,
      name: d.fullName ?? d.name ?? d.userName ?? undefined,
      email: d.email ?? undefined,
      phone: d.phoneNumber ?? d.phone ?? null,
      position: d.position ?? undefined,
      role: d.role ?? undefined,
      createdAt: d.createdAt ?? undefined,
      empNo: d.empNo ?? undefined,
      isActive: typeof d.isActive === 'boolean' ? d.isActive : undefined,
      raw: d,
    } as EmployeeProfileDto;
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.warn('[updateEmployeeProfile] failed, returning mock', err?.message || err);
    const updated = { ...MOCK_PROFILE, ...dto, userID: userId } as any;
    return updated;
  }
}
