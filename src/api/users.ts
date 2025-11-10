import axios from 'axios';

export type UserDto = {
  userID?: string;
  userName?: string;
  email?: string;
  phoneNumber?: string | null;
  role?: string;
  createdAt?: string;
  position?: string;
  empNo?: string;
  isActive?: boolean;
  source?: 'customer' | 'employee';
  raw?: any;
};

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5093';

export async function fetchCustomers(): Promise<UserDto[]> {
  try {
    const res = await axios.get(`${API_BASE}/api/Customers`);
    const arr = Array.isArray(res.data) ? res.data : [];
    return arr.map((d: any) => ({
      userID: d.userID ?? d.id ?? undefined,
      userName: d.userName ?? d.fullName ?? d.name ?? undefined,
      email: d.email ?? undefined,
      phoneNumber: d.phoneNumber ?? d.phone ?? null,
      role: d.role ?? 'customer',
      createdAt: d.createdAt ?? undefined,
      isActive: typeof d.isActive === 'boolean' ? d.isActive : undefined,
      source: 'customer',
      raw: d,
    }));
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.warn('[fetchCustomers] failed', err?.message || err);
    return [];
  }
}

export async function fetchEmployees(): Promise<UserDto[]> {
  try {
    const res = await axios.get(`${API_BASE}/api/Employees`);
    const arr = Array.isArray(res.data) ? res.data : [];
    return arr.map((d: any) => ({
      userID: d.userID ?? d.userId ?? d.id ?? undefined,
      userName: d.userName ?? d.fullName ?? d.name ?? undefined,
      email: d.email ?? undefined,
      phoneNumber: d.phoneNumber ?? d.phone ?? null,
      role: d.role ?? d.position ?? 'employee',
      createdAt: d.createdAt ?? undefined,
      position: d.position ?? undefined,
      empNo: d.empNo ?? undefined,
      isActive: typeof d.isActive === 'boolean' ? d.isActive : undefined,
      source: 'employee',
      raw: d,
    }));
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.warn('[fetchEmployees] failed', err?.message || err);
    return [];
  }
}

export async function getAllUsers(): Promise<UserDto[]> {
  const [customers, employees] = await Promise.all([fetchCustomers(), fetchEmployees()]);
  return [...employees, ...customers];
}

export type CreateCustomerDto = {
  email: string;
  password: string;
  phoneNumber: string;
  loyaltyPoints?: number;
  address?: string;
};

export type CreateEmployeeDto = {
  email: string;
  password: string;
  phoneNumber: string;
  position?: string;
};

export async function createCustomer(dto: CreateCustomerDto): Promise<UserDto> {
  const url = `${API_BASE}/api/Customers`;
  try {
    // ensure loyaltyPoints is present per API contract
    const body = { ...dto, loyaltyPoints: dto.loyaltyPoints ?? 0 };
    const res = await axios.post(url, body);
    const d = res.data ?? {};
    return {
      userID: d.userID ?? d.id ?? undefined,
      userName: d.userName ?? d.fullName ?? d.name ?? undefined,
      email: d.email ?? dto.email,
      phoneNumber: d.phoneNumber ?? d.phone ?? dto.phoneNumber ?? null,
      role: d.role ?? 'customer',
      createdAt: d.createdAt ?? undefined,
      isActive: typeof d.isActive === 'boolean' ? d.isActive : undefined,
      source: 'customer',
      raw: d,
    } as UserDto;
  } catch (err: any) {
    // rethrow so UI can surface errors
    // eslint-disable-next-line no-console
    console.error('[createCustomer] failed', err);
    throw err;
  }
}

export async function createEmployee(dto: CreateEmployeeDto): Promise<UserDto> {
  const url = `${API_BASE}/api/Employees`;
  try {
    const res = await axios.post(url, dto);
    const d = res.data ?? {};
    return {
      userID: d.userID ?? d.userId ?? d.id ?? undefined,
      userName: d.userName ?? d.fullName ?? d.name ?? undefined,
      email: d.email ?? dto.email,
      phoneNumber: d.phoneNumber ?? d.phone ?? dto.phoneNumber ?? null,
      role: d.role ?? d.position ?? 'employee',
      createdAt: d.createdAt ?? undefined,
      position: d.position ?? dto.position ?? undefined,
      empNo: d.empNo ?? undefined,
      isActive: typeof d.isActive === 'boolean' ? d.isActive : undefined,
      source: 'employee',
      raw: d,
    } as UserDto;
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('[createEmployee] failed', err);
    throw err;
  }
}

export type UpdateCustomerDto = {
  email?: string;
  phoneNumber?: string;
  loyaltyPoints?: number;
  address?: string;
};

export type UpdateEmployeeDto = {
  userName?: string;
  email?: string;
  phoneNumber?: string;
  position?: string;
  empNo?: string;
  isActive?: boolean;
};

export async function updateCustomer(userId: string, dto: UpdateCustomerDto): Promise<UserDto> {
  if (!userId) throw new Error('userId is required');
  const url = `${API_BASE}/api/Customers/${encodeURIComponent(userId)}`;
  try {
    const res = await axios.put(url, dto);
    const d = res.data ?? {};
    return {
      userID: d.userID ?? d.id ?? userId,
      userName: d.userName ?? d.fullName ?? d.name ?? undefined,
      email: d.email ?? dto.email,
      phoneNumber: d.phoneNumber ?? d.phone ?? dto.phoneNumber ?? null,
      role: d.role ?? 'customer',
      createdAt: d.createdAt ?? undefined,
      isActive: typeof d.isActive === 'boolean' ? d.isActive : undefined,
      source: 'customer',
      raw: d,
    } as UserDto;
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('[updateCustomer] failed', err);
    throw err;
  }
}

export async function updateEmployee(userId: string, dto: UpdateEmployeeDto): Promise<UserDto> {
  if (!userId) throw new Error('userId is required');
  const url = `${API_BASE}/api/Employees/${encodeURIComponent(userId)}`;
  try {
    const res = await axios.put(url, dto);
    const d = res.data ?? {};
    return {
      userID: d.userID ?? d.userId ?? d.id ?? userId,
      userName: d.userName ?? d.fullName ?? d.name ?? undefined,
      email: d.email ?? dto.email,
      phoneNumber: d.phoneNumber ?? d.phone ?? dto.phoneNumber ?? null,
      role: d.role ?? d.position ?? 'employee',
      createdAt: d.createdAt ?? undefined,
      position: d.position ?? dto.position ?? undefined,
      empNo: d.empNo ?? dto.empNo ?? undefined,
      isActive: typeof d.isActive === 'boolean' ? d.isActive : undefined,
      source: 'employee',
      raw: d,
    } as UserDto;
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('[updateEmployee] failed', err);
    throw err;
  }
}

export async function deleteCustomer(userId: string): Promise<void> {
  if (!userId) throw new Error('userId is required');
  const url = `${API_BASE}/api/Customers/${encodeURIComponent(userId)}`;
  try {
    await axios.delete(url);
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('[deleteCustomer] failed', err);
    throw err;
  }
}

export async function deleteEmployee(userId: string): Promise<void> {
  if (!userId) throw new Error('userId is required');
  const url = `${API_BASE}/api/Employees/${encodeURIComponent(userId)}`;
  try {
    await axios.delete(url);
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('[deleteEmployee] failed', err);
    throw err;
  }
}

