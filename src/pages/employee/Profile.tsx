import Sidebar from "../../components/Sidebar";
import { useState, useRef, useEffect } from "react";
import { getEmployeeProfile, updateEmployeeProfile } from "../../api/profile";

type ProfileModel = {
  name: string;
  email: string;
  phone?: string;
  role?: string;
  empNo?: string;
  isActive?: boolean;
  createdAt?: string;
};

export default function Profile() {
  const defaultProfile: ProfileModel = {
    name: "",
    email: "",
    phone: "",
    role: "Employee",
    createdAt: new Date().toISOString(),
  };

  const [profile, setProfile] = useState<ProfileModel>(defaultProfile);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Password change state (local only)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const onPickAvatar = () => fileRef.current?.click();

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  function getUserIdFromToken(): string | null {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      // common claim names - coerce to string when present
      const id = payload.userId ?? payload.userID ?? payload.sub ?? payload.nameid ?? null;
      return id == null ? null : String(id);
    } catch {
      return null;
    }
  }

  useEffect(() => {
    let mounted = true;
    const uidFromStorage = localStorage.getItem('userId');
    const uid = uidFromStorage ? uidFromStorage : getUserIdFromToken();
    // Allow forcing a specific employee id for testing via an env var
    // or fall back to a hard-coded test id when no uid is present.
    const forced = (import.meta as any).env?.VITE_FORCE_EMPLOYEE_ID || null;
    const fallbackTestId = '3e5849d5-4730-46f2-99a1-a57c19afefe5';
    const effectiveId = forced ?? uid ?? fallbackTestId;
    if (!effectiveId) {
      setLoadError('No userId available. Please sign in.');
      return;
    }
    setUserId(effectiveId);

    const load = async () => {
      setLoading(true);
      try {
        // Use the effective id so the request goes to:
        // http://localhost:5093/api/Employees/{effectiveId}
        const data = await getEmployeeProfile(effectiveId);
        if (!mounted) return;
        setProfile(p => ({
          ...p,
          name: data.name ?? p.name,
          email: data.email ?? p.email,
          phone: data.phoneNumber ?? p.phone,
          role: data.position ?? p.role,
          empNo: data.empNo ?? p.empNo,
          isActive: typeof data.isActive === 'boolean' ? data.isActive : p.isActive,
          createdAt: p.createdAt,
        }));
      } catch (err: any) {
        if (!mounted) return;
        // Surface detailed server error when available to help debug auth/redirects
        if (err?.response) {
          const status = err.response.status;
          const body = err.response.data;
          setLoadError(`Request failed: ${status} - ${typeof body === 'string' ? body : JSON.stringify(body).slice(0,1000)}`);
        } else {
          setLoadError(err?.message || 'Failed to load profile');
        }
        // expose token presence in console for quick debugging
        console.debug('accessToken present:', !!localStorage.getItem('accessToken'));
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  const onSave = async () => {
    if (!userId) {
      setMessage("Cannot save: unknown user. Please login.");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setSaving(true);
      try {
      await updateEmployeeProfile(userId, {
        userName: profile.name,
        email: profile.email,
        phoneNumber: profile.phone ?? null,
        position: profile.role ?? null,
        empNo: profile.empNo ?? null,
        // keep active as true when saving from UI; adjust if you want a toggle
        isActive: profile.isActive ?? true,
      });
      setMessage("Profile saved");
      setEditing(false);
    } catch (err: any) {
      if (err?.response) {
        const status = err.response.status;
        const body = err.response.data;
        setMessage(`Save failed: ${status} - ${typeof body === 'string' ? body : JSON.stringify(body).slice(0,1000)}`);
      } else {
        setMessage(err?.message || "Failed to save profile");
      }
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const onChangePassword = async () => {
    if (!newPassword) {
      setMessage("New password is required");
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // TODO: call backend change-password endpoint
    setMessage("Password updated (local only)");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-gray-100">
      <Sidebar role="employee" />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-red-500">Profile</h1>
          <div className="flex items-center gap-3">
            {!editing ? (
              <button onClick={() => setEditing(true)} className="bg-[#2a2a2a] px-4 py-2 rounded hover:bg-red-600">Edit</button>
            ) : (
              <>
                <button onClick={() => setEditing(false)} className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700">Cancel</button>
                <button onClick={onSave} disabled={saving} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">{saving ? 'Saving...' : 'Save'}</button>
              </>
            )}
          </div>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-green-700 rounded">{message}</div>
        )}
        {loading && <div className="mb-4 text-sm text-gray-300">Loading profile...</div>}
        {loadError && <div className="mb-4 text-sm text-red-500">{loadError}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="col-span-1 bg-[#2a2a2a] p-6 rounded-xl border border-gray-700">
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-2xl text-gray-400">{profile.name.split(" ")[0][0]}{profile.name.split(" ").slice(-1)[0][0]}</div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
              <button onClick={onPickAvatar} className="mt-3 bg-[#2a2a2a] px-3 py-1 rounded hover:bg-red-600">Change avatar</button>
              <div className="mt-4 text-sm text-gray-400">Member since {new Date(profile.createdAt || '').toLocaleDateString()}</div>
              <div className="mt-1 text-sm text-gray-400">Role: {profile.role}</div>
            </div>
          </section>

          <section className="lg:col-span-2 bg-[#2a2a2a] p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Account</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300">Full name</label>
                <input value={profile.name} onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))} disabled={!editing} className="w-full mt-1 p-2 bg-[#161616] rounded" />
              </div>

              <div>
                <label className="text-sm text-gray-300">Email</label>
                <input value={profile.email} onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))} disabled={!editing} className="w-full mt-1 p-2 bg-[#161616] rounded" />
              </div>

              <div>
                <label className="text-sm text-gray-300">Phone</label>
                <input value={profile.phone} onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))} disabled={!editing} className="w-full mt-1 p-2 bg-[#161616] rounded" />
              </div>

              <div>
                <label className="text-sm text-gray-300">Role</label>
                <input value={profile.role} disabled className="w-full mt-1 p-2 bg-[#0f0f0f] rounded" />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Change password</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input type="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="p-2 bg-[#161616] rounded" />
                <input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="p-2 bg-[#161616] rounded" />
                <input type="password" placeholder="Confirm new" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="p-2 bg-[#161616] rounded" />
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={onChangePassword} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Update password</button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}


