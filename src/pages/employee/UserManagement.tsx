import Sidebar from "../../components/Sidebar";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMockData } from "../../context/MockDataContext";
import type { User } from "../../context/MockDataContext";

export default function UserManagement() {
  const mock = useMockData();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mock.users;
    return mock.users.filter(u => (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q));
  }, [mock.users, query]);

  return (
    <div className="flex h-screen bg-[#0f1113] text-gray-100">
      <Sidebar role="employee" />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-red-400">User Management</h1>
          <div className="flex gap-3">
            <Link to="/employee/users/new" className="bg-[#1f2937]/60 px-4 py-2 rounded hover:bg-red-600 transition">New User</Link>
          </div>
        </header>

        <div className="bg-[#0b0c0d]/60 p-4 rounded mb-4">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or email" className="w-full p-2 bg-transparent rounded border border-gray-800 placeholder-gray-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((u: User) => (
            <div key={u.id} className="bg-[#0b0c0d]/60 p-4 rounded border border-gray-800 flex items-center justify-between">
              <div>
                <div className="font-medium">{u.name || 'Unnamed'}</div>
                <div className="text-sm text-gray-400">{u.email}</div>
                <div className="text-sm text-gray-400">Role: {u.role || 'User'}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button onClick={() => mock.toggleUserActive?.(u.id)} className={`px-3 py-1 rounded ${u.isActive ? 'bg-red-600' : 'bg-green-600'}`}>
                  {u.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <Link to={`/employee/users/${u.id}`} className="px-3 py-1 rounded bg-[#151515]">View</Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
