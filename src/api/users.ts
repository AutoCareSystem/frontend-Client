import axios from "axios";

export type UserDto = {
  userID?: string | number;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
};

export async function fetchUsers(): Promise<UserDto[]> {
  const base = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5093";
  const normalized = base.replace(/\/+$/g, '');
  // Primary endpoints to try (employees and customers). We'll attempt both and combine results.
  const candidateBases = [normalized, normalized.replace(/:\d+$/, '') + ':5292'];

  const token = localStorage.getItem("accessToken");
  const headers: any = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const results: UserDto[] = [];

  for (const b of candidateBases) {
    // employees
    try {
      const url = `${b}/api/employees`;
      const res = await axios.get(url, { headers, withCredentials: true });
      if (res?.data && Array.isArray(res.data)) {
        for (const e of res.data) {
          const u = e?.user ?? e;
          results.push({
            userID: e.userID ?? u?.userID ?? u?.userID,
            name: u?.name ?? u?.user?.name,
            email: u?.email ?? u?.user?.email,
            phone: u?.phone ?? u?.user?.phone,
            role: 'Employee',
            isActive: e.isActive ?? true,
          });
        }
      }
    } catch (e) {
      // ignore and try customers
    }

    // customers
    try {
      const url = `${b}/api/customers`;
      const res = await axios.get(url, { headers, withCredentials: true });
      if (res?.data && Array.isArray(res.data)) {
        for (const c of res.data) {
          const u = c?.user ?? c;
          results.push({
            userID: c.userID ?? u?.userID,
            name: u?.name ?? u?.user?.name,
            email: u?.email ?? u?.user?.email,
            phone: u?.phone ?? u?.user?.phone,
            role: 'Customer',
            isActive: true,
          });
        }
      }
    } catch (e) {
      // ignore
    }
  }

  if (results.length) return results;
  throw new Error("Failed to fetch users from backend (employees/customers)");
}
