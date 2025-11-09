import Sidebar from "../../components/Sidebar";
import { useEffect, useMemo, useState } from "react";
import { fetchUsers, type UserDto } from "../../api/users";
import { Link } from "react-router-dom";

export default function UserManagement() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchUsers()
      .then((data) => { if (!mounted) return; setUsers(data); })
      .catch((err) => { if (!mounted) return; setError(err?.message || 'Failed to load users'); })
      .finally(() => { if (!mounted) return; setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(u => (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q));
  }, [users, query]);

  const toggleActive = (id: string | number) => {
    setUsers(prev => prev.map(u => u.userID === id ? ({ ...u, isActive: !u.isActive }) : u));
  };

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
      <Sidebar role="Employee" />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-red-500">User Management</h1>
          <div className="flex gap-3">
            <Link to="/employee/users/new" className="bg-[#2a2a2a] px-4 py-2 rounded hover:bg-red-600 transition">New User</Link>
          </div>
        </header>

        <div className="bg-[#2a2a2a] p-4 rounded mb-4">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or email" className="w-full p-2 bg-[#161616] rounded" />
        </div>

        {loading && <div className="text-sm text-gray-300">Loading users...</div>}
        {error && <div className="text-sm text-red-500">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((u) => (
            <div key={String(u.userID)} className="bg-[#2a2a2a] p-4 rounded border border-gray-700 flex items-center justify-between">
              <div>
                <div className="font-medium">{u.name || 'Unnamed'}</div>
                <div className="text-sm text-gray-400">{u.email}</div>
                <div className="text-sm text-gray-400">Role: {u.role || 'User'}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button onClick={() => toggleActive(u.userID ?? '')} className={`px-3 py-1 rounded ${u.isActive ? 'bg-red-600' : 'bg-green-600'}`}>
                  {u.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <Link to={`/employee/users/${u.userID}`} className="px-3 py-1 rounded bg-[#3a3a3a]">View</Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
