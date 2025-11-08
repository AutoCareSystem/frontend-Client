import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { getAllUsers, createCustomer, createEmployee, updateCustomer, updateEmployee, deleteCustomer, deleteEmployee } from '../../api/users';
import type { UserDto } from '../../api/users';
import { useToast } from '../../components/ToastProvider';

export default function UserManagement() {
  const toast = useToast();
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [emailFilter, setEmailFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showNew, setShowNew] = useState(false);
  const [creating, setCreating] = useState(false);

  // new user form state
  const [newRole, setNewRole] = useState<'customer' | 'employee'>('customer');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPosition, setNewPosition] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newLoyalty, setNewLoyalty] = useState<number>(0);
  const [editingUser, setEditingUser] = useState<UserDto | null>(null);
  const [confirmingDeleteUser, setConfirmingDeleteUser] = useState<UserDto | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await getAllUsers();
        if (!mounted) return;
        setUsers(data);
      } catch (err: any) {
        toast.show('Failed to load users', 'error');
        // eslint-disable-next-line no-console
        console.error('[UserManagement] getAllUsers failed', err);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [toast]);

  async function handleCreate() {
    // basic validation
    if (!newEmail || !newPassword || !newPhone) {
      toast.show('Please fill email, password and phone', 'warning');
      return;
    }
    setCreating(true);
    try {
      if (newRole === 'customer') {
        await createCustomer({ email: newEmail, password: newPassword, phoneNumber: newPhone, loyaltyPoints: newLoyalty, address: newAddress });
      } else {
        await createEmployee({ email: newEmail, password: newPassword, phoneNumber: newPhone, position: newPosition });
      }
      toast.show('User created', 'success');
      // refresh list
      const refreshed = await getAllUsers();
      setUsers(refreshed);
      // reset & close
      setNewEmail(''); setNewPassword(''); setNewPhone(''); setNewPosition(''); setNewAddress(''); setNewLoyalty(0);
      setShowNew(false);
    } catch (err: any) {
      console.error('[UserManagement] create failed', err);
      // Show detailed server response when available to help debug 400 errors
      if (err?.response) {
        const status = err.response.status;
        const body = err.response.data;
        const msg = `${status} - ${typeof body === 'string' ? body : JSON.stringify(body).slice(0,1000)}`;
        toast.show(`Create failed: ${msg}`, 'error');
      } else {
        toast.show(err?.message || 'Create failed', 'error');
      }
    } finally {
      setCreating(false);
    }
  }

  async function handleSave() {
    if (!editingUser) return;
    const userId = String(editingUser.userID ?? editingUser.raw?.id ?? editingUser.raw?.userID);
    setCreating(true);
    try {
      if (editingUser.source === 'customer') {
        await updateCustomer(userId, { email: newEmail, phoneNumber: newPhone, loyaltyPoints: newLoyalty, address: newAddress });
      } else {
        await updateEmployee(userId, { userName: newEmail, email: newEmail, phoneNumber: newPhone, position: newPosition, empNo: editingUser.empNo, isActive: editingUser.isActive });
      }
      toast.show('User updated', 'success');
      const refreshed = await getAllUsers();
      setUsers(refreshed);
      setShowNew(false);
      setEditingUser(null);
    } catch (err: any) {
      console.error('[UserManagement] update failed', err);
      if (err?.response) {
        const status = err.response.status;
        const body = err.response.data;
        const msg = `${status} - ${typeof body === 'string' ? body : JSON.stringify(body).slice(0,1000)}`;
        toast.show(`Update failed: ${msg}`, 'error');
      } else {
        toast.show(err?.message || 'Update failed', 'error');
      }
    } finally {
      setCreating(false);
    }
  }

  // open a styled confirmation dialog (instead of window.confirm)
  async function handleDelete(u: UserDto) {
    setConfirmingDeleteUser(u);
  }

  async function confirmDelete() {
    const u = confirmingDeleteUser;
    if (!u) return;
    const id = String(u.userID ?? u.raw?.id ?? u.raw?.userID);
    if (!id) {
      toast.show('Cannot determine user id', 'error');
      setConfirmingDeleteUser(null);
      return;
    }
    try {
      if (u.source === 'customer') {
        await deleteCustomer(id);
      } else {
        await deleteEmployee(id);
      }
      toast.show('User deleted', 'success');
      const refreshed = await getAllUsers();
      setUsers(refreshed);
    } catch (err: any) {
      console.error('[UserManagement] delete failed', err);
      if (err?.response) {
        const status = err.response.status;
        const body = err.response.data;
        const msg = `${status} - ${typeof body === 'string' ? body : JSON.stringify(body).slice(0,1000)}`;
        toast.show(`Delete failed: ${msg}`, 'error');
      } else {
        toast.show(err?.message || 'Delete failed', 'error');
      }
    } finally {
      setConfirmingDeleteUser(null);
    }
  }

  function cancelDelete() {
    setConfirmingDeleteUser(null);
  }

  const roles = useMemo(() => {
    const set = new Set<string>();
    users.forEach(u => { if (u.role) set.add(String(u.role)); });
    return Array.from(set).sort();
  }, [users]);

  const filtered = useMemo(() => {
    return users.filter(u => {
      if (emailFilter && !(u.email || '').toLowerCase().includes(emailFilter.toLowerCase())) return false;
      if (roleFilter !== 'all' && (u.role || '').toLowerCase() !== roleFilter.toLowerCase()) return false;
      return true;
    });
  }, [users, emailFilter, roleFilter]);

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
      <Sidebar role="employee" />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-red-500">User Management</h1>
          <div className="flex items-center gap-2">
            <input placeholder="Filter by email" value={emailFilter} onChange={(e) => setEmailFilter(e.target.value)} className="p-2 rounded bg-[#161616]" />
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="p-2 rounded bg-[#161616]">
              <option value="all">All roles</option>
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <button onClick={() => setShowNew(true)} className="ml-2 bg-[#1f2937]/60 px-4 py-2 rounded hover:bg-red-600 transition">New User</button>
          </div>
        </div>

        {loading && <div className="mb-4 text-sm text-gray-300">Loading users...</div>}

        <div className="bg-[#2a2a2a] rounded-xl p-4 border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left text-sm text-gray-400 border-b border-gray-700">
                  {/* <th className="p-2">Name</th> */}
                  <th className="p-2">Email</th>
                  <th className="p-2">Phone</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">Position</th>
                  <th className="p-2">Source</th>
                  <th className="p-2">Active</th>
                  <th className="p-2">Joined</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={String(u.userID) + (u.email || '')} className="border-b border-gray-800 hover:bg-gray-900">
                    {/* name column intentionally hidden on narrow layouts; show on wide screens */}
                    {/* <td className="hidden md:table-cell p-2 align-top">{u.userName ?? u.raw?.fullName ?? u.userID}</td> */}
                    <td className="p-2 align-top text-sm text-gray-300">{u.email}</td>
                    <td className="p-2 align-top text-sm text-gray-300">{u.phoneNumber}</td>
                    <td className="p-2 align-top text-sm">{u.role}</td>
                    <td className="p-2 align-top text-sm">{u.position ?? u.empNo ?? '-'}</td>
                    <td className="p-2 align-top text-sm">{u.source}</td>
                    <td className="p-2 align-top text-sm">{u.isActive ? 'Yes' : 'No'}</td>
                    <td className="p-2 align-top text-sm">{u.createdAt ? new Date(u.createdAt).toLocaleString() : '-'}</td>
                    <td className="p-2 align-top text-sm flex gap-2">
                      <button onClick={() => {
                        // open modal in edit mode
                        setEditingUser(u);
                        setShowNew(true);
                        setNewRole(u.source === 'employee' ? 'employee' : 'customer');
                        setNewEmail(u.email ?? '');
                        setNewPassword('');
                        setNewPhone(u.phoneNumber ?? '');
                        setNewPosition(u.position ?? '');
                        setNewAddress(u.raw?.address ?? '');
                        setNewLoyalty(u.raw?.loyaltyPoints ?? 0);
                      }} className="px-2 py-1 rounded bg-[#151515]">Edit</button>
                      <button onClick={() => handleDelete(u)} className="px-2 py-1 rounded bg-red-600">Delete</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && !loading && (
                  <tr>
                    <td colSpan={9} className="p-4 text-center text-gray-400">No users match the filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {showNew && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-[#0f1113] p-6 rounded shadow-lg w-full max-w-md">
              <h2 className="text-lg font-semibold mb-3">Create new {newRole === 'customer' ? 'Customer' : 'Employee'}</h2>
                <div className="mb-2">
                  <label className="block text-sm text-gray-400">Role</label>
                  <select value={newRole} onChange={(e) => setNewRole(e.target.value as any)} className="w-full p-2 rounded bg-[#161616]" disabled={!!editingUser}>
                    <option value="customer">Customer</option>
                    <option value="employee">Employee</option>
                  </select>
                </div>
              <div className="grid grid-cols-1 gap-2">
                <input placeholder="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="p-2 rounded bg-[#161616]" />
                <input placeholder="Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="p-2 rounded bg-[#161616]" />
                <input placeholder="Phone" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="p-2 rounded bg-[#161616]" />
                {newRole === 'employee' ? (
                  <input placeholder="Position" value={newPosition} onChange={(e) => setNewPosition(e.target.value)} className="p-2 rounded bg-[#161616]" />
                ) : (
                  <>
                    <input placeholder="Address" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} className="p-2 rounded bg-[#161616]" />
                    <input type="number" placeholder="Loyalty Points" value={String(newLoyalty)} onChange={(e) => setNewLoyalty(Number(e.target.value || 0))} className="p-2 rounded bg-[#161616]" />
                  </>
                )}
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => { setShowNew(false); setEditingUser(null); }} className="px-3 py-1 rounded bg-gray-600">Cancel</button>
                {!editingUser ? (
                  <button onClick={handleCreate} disabled={creating} className="px-3 py-1 rounded bg-red-600">{creating ? 'Creating...' : 'Create'}</button>
                ) : (
                  <button onClick={handleSave} disabled={creating} className="px-3 py-1 rounded bg-red-600">{creating ? 'Saving...' : 'Save'}</button>
                )}
              </div>
            </div>
          </div>
        )}
        {confirmingDeleteUser && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60">
            <div className="bg-[#0f1113] p-6 rounded shadow-lg w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-3">Confirm delete</h3>
              <p className="text-sm text-gray-300">Are you sure you want to delete <strong>{confirmingDeleteUser.userName ?? confirmingDeleteUser.email}</strong>? This action cannot be undone.</p>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => cancelDelete()} className="px-3 py-1 rounded bg-gray-600">Cancel</button>
                <button onClick={() => confirmDelete()} className="px-3 py-1 rounded bg-red-600">Delete</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// --- modal and creation logic added after component ---


