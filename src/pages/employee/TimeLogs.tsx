
import Sidebar from "../../components/Sidebar";
import { useEffect, useMemo, useState, useRef } from "react";
import { fetchAppointments, updateAppointmentStatus, fetchAppointmentById } from '../../api/appointments';
import { Play, StopCircle, CheckCircle, Clock } from "lucide-react";
import { useMockData } from "../../context/MockDataContext";

type TimeLogItem = {
  id: number;
  type: "Project" | "Service";
  title: string;
  details?: string;
  status: "Pending" | "Approved" | "InProgress" | "Completed";
  startTime?: string | null; // ISO
  endTime?: string | null; // ISO
  elapsedMinutes?: number; // computed after end
};

function fmtMinutes(mins: number) {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

export default function TimeLogs() {
  const mock = useMockData();

  const [items, setItems] = useState<TimeLogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [detailsMap, setDetailsMap] = useState<Record<number, any>>({});
  const [endingIds, setEndingIds] = useState<number[]>([]);

  const [now, setNow] = useState<number>(Date.now());
  const timerRef = useRef<number | null>(null);

  const normalizeStatus = (s: any): TimeLogItem['status'] => {
    if (!s && s !== 0) return 'Pending';
    const raw = String(s).trim();
    const low = raw.replace(/_|\s+/g, '').toLowerCase();
    if (low === 'inprogress' || low === 'inprogress' || low === 'running') return 'InProgress';
    if (low === 'approved' || low === 'accept' || low === 'accepted') return 'Approved';
    if (low === 'completed' || low === 'complete' || low === 'finished') return 'Completed';
    if (low === 'pending' || low === 'waiting') return 'Pending';
    return (raw as TimeLogItem['status']);
  };

  useEffect(() => {
    if (activeId != null) {
      timerRef.current = window.setInterval(() => setNow(Date.now()), 1000);
    } else if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [activeId]);

  // Fetch approved appointments for this employee and populate time log items
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const emp = typeof window !== 'undefined' ? (localStorage.getItem('EmployeeID') ?? localStorage.getItem('employeeID') ?? localStorage.getItem('employeeId')) : null;
        // Fetch both Approved and InProgress items so employee sees pending and running work
        const [approvedRes, inProgressRes] = await Promise.all([
          fetchAppointments({ status: 'Approved', employeeId: emp ?? undefined }),
          fetchAppointments({ status: 'InProgress', employeeId: emp ?? undefined }).catch(() => []),
        ]);
        if (!mounted) return;
        // merge and dedupe by appointmentID
        const combined = [...(approvedRes || []), ...(inProgressRes || [])];
        const byId: Record<string, any> = {};
        combined.forEach((a: any) => {
          const key = String(a.appointmentID ?? a.id ?? a.appointmentId ?? '');
          if (!key) return;
          // prefer the more detailed object (inProgress may have startDate)
          byId[key] = byId[key] ? { ...byId[key], ...a } : a;
        });
        const merged = Object.values(byId);
        // Map appointments to TimeLogItem
        const mapped: TimeLogItem[] = merged.map(a => {
          const start = a.startDate ?? a.raw?.startDate ?? a.raw?.start ?? a.raw?.time;
          const end = a.endDate ?? a.raw?.endDate ?? a.raw?.end;
          const elapsed = start && end ? Math.max(1, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000)) : undefined;
          // Build a concise details string: prefer email then vehicle plate
          const email = a.raw?.customer?.user?.email ?? a.raw?.user?.email ?? a.raw?.customer?.userName ?? a.raw?.customerName ?? a.customerDisplay ?? '';
          const plate = a.vehiclePlate ?? a.raw?.vehicle?.plateNumber ?? a.raw?.vehicle?.plate ?? a.raw?.vehicle?.plateNo ?? '';
          const detailsStr = [email, plate].filter(Boolean).join(' • ');
          // If a start exists but no end, show InProgress in UI regardless of backend status
          const hasStartNoEnd = Boolean(start) && !Boolean(end);
          const uiStatus = hasStartNoEnd ? 'InProgress' : normalizeStatus(a.status ?? a.raw?.status ?? 'Approved');
          return {
            id: Number(a.appointmentID ?? a.id ?? 0),
            type: (a.type ?? a.raw?.appointmentType ?? 'Service') as TimeLogItem['type'],
            title: a.serviceDisplay ?? a.raw?.serviceDetails?.servicePackage?.name ?? a.raw?.serviceDetails?.servicePackage?.title ?? (a.serviceDisplay ?? 'Service'),
            details: detailsStr || '',
            status: uiStatus as TimeLogItem['status'],
            startTime: start ?? null,
            endTime: end ?? null,
            elapsedMinutes: elapsed,
          };
        });
  setItems(mapped);
  // If any item is already in progress, set it as active so the sticky bar and End button show
  const running = mapped.find(m => m.status === 'InProgress');
  if (running) setActiveId(running.id);
      } catch (err: any) {
        console.error('[TimeLogs] failed to load appointments', err);
        setError(err?.message || 'Failed to load appointments');
        // fallback: build from mock
        const initial: TimeLogItem[] = [
          ...mock.projects.map(p => ({ id: p.id, type: 'Project' as const, title: p.title, details: p.customer, status: p.status as TimeLogItem['status'] })),
          ...mock.services.map(s => ({ id: s.id, type: 'Service' as const, title: s.title, details: s.customer, status: s.status as TimeLogItem['status'] })),
        ];
        if (mounted) setItems(initial);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [mock.projects, mock.services]);

  const start = async (id: number) => {
    // Optimistic update: set item to InProgress
    const previous = items;
    setItems(prev => prev.map(it => {
      if (it.id === id) return { ...it, status: "InProgress", startTime: new Date().toISOString(), endTime: null };
      if (it.status === "InProgress") return { ...it, status: "Approved", startTime: null };
      return it;
    }));
    setActiveId(id);

    try {
      const emp = typeof window !== 'undefined' ? (localStorage.getItem('EmployeeID') ?? localStorage.getItem('employeeID') ?? localStorage.getItem('employeeId')) : null;
      const res = await updateAppointmentStatus(id, 'start', emp ?? undefined);
      // Update item using server response to get canonical start time
  const startDateFromServer = res?.startDate ?? res?.start ?? res?.data?.startDate ?? null;
  const timeFromServer = res?.time ?? res?.data?.time ?? null;
      let startIso: string | null = null;
      if (startDateFromServer && timeFromServer) {
        // server returns date and time separately (e.g. "2025-11-08" and "22:29")
        try {
          startIso = new Date(`${startDateFromServer}T${timeFromServer}`).toISOString();
        } catch (e) {
          startIso = new Date(startDateFromServer).toISOString();
        }
      } else if (res?.startDateTime) {
        startIso = new Date(res.startDateTime).toISOString();
      } else if (startDateFromServer) {
        startIso = new Date(startDateFromServer).toISOString();
      }

  const serverStatus = normalizeStatus(res?.status ?? res?.data?.status ?? 'InProgress');
  setItems(prev => prev.map(it => it.id === id ? { ...it, status: serverStatus, startTime: startIso ?? new Date().toISOString(), endTime: null } : it));
      setActiveId(id);
    } catch (err: any) {
      console.error('[TimeLogs] failed to start appointment', err);
      setError(err?.message ?? 'Failed to start appointment');
      // revert optimistic change
      setItems(previous);
      setActiveId(null);
    }
  };

  const end = (id: number) => {
    (async () => {
      // prevent double-end
      if (endingIds.includes(id)) return;
      setEndingIds(prev => [...prev, id]);
      const previous = items;
      const endIso = new Date().toISOString();
      // optimistic: mark completed locally
      setItems(prev => prev.map(it => {
        if (it.id === id) {
          const start = it.startTime ? new Date(it.startTime).getTime() : Date.now();
          const diffMin = Math.max(1, Math.round((new Date(endIso).getTime() - start) / 60000));
          return { ...it, status: "Completed", endTime: endIso, elapsedMinutes: diffMin };
        }
        return it;
      }));
      setActiveId(null);
      try {
        const emp = typeof window !== 'undefined' ? (localStorage.getItem('EmployeeID') ?? localStorage.getItem('employeeID') ?? localStorage.getItem('employeeId')) : null;
        const res = await updateAppointmentStatus(id, 'complete', emp ?? undefined);
        // apply server-provided end/start if present
        const endDateFromServer = res?.endDate ?? res?.end ?? res?.data?.endDate ?? null;
        const timeFromServer = res?.time ?? res?.data?.time ?? null;
        let endIsoServer: string | null = null;
        if (endDateFromServer && timeFromServer) {
          try { endIsoServer = new Date(`${endDateFromServer}T${timeFromServer}`).toISOString(); } catch (e) { endIsoServer = new Date(endDateFromServer).toISOString(); }
        } else if (endDateFromServer) {
          endIsoServer = new Date(endDateFromServer).toISOString();
        }
        // compute elapsed using startTime from item or server
        setItems(prev => prev.map(it => {
          if (it.id === id) {
            const startMs = it.startTime ? new Date(it.startTime).getTime() : (res?.startDate ? new Date(res.startDate).getTime() : Date.now());
            const endMs = endIsoServer ? new Date(endIsoServer).getTime() : new Date().getTime();
            const diffMin = Math.max(1, Math.round((endMs - startMs) / 60000));
            return { ...it, status: 'Completed', endTime: endIsoServer ?? endIso, elapsedMinutes: diffMin };
          }
          return it;
        }));
      } catch (err: any) {
        console.error('[TimeLogs] failed to complete appointment', err);
        setError(err?.message ?? 'Failed to complete appointment');
        // revert optimistic
        setItems(previous);
      } finally {
        setEndingIds(prev => prev.filter(x => x !== id));
      }
    })();
  };

  const approve = (id: number) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, status: "Approved" } : it));
  };

  const viewDetails = async (id: number) => {
    // toggle if already expanded
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    // if we already fetched details, just expand
    if (detailsMap[id]) {
      setExpandedId(id);
      return;
    }
    try {
      setLoading(true);
      const res = await fetchAppointmentById(id);
      setDetailsMap(prev => ({ ...prev, [id]: res }));
      setExpandedId(id);
    } catch (err: any) {
      console.error('[TimeLogs] failed to fetch appointment details', err);
      setError(err?.message ?? 'Failed to load appointment details');
    } finally {
      setLoading(false);
    }
  };

  const runningElapsed = useMemo(() => {
    if (!activeId) return null;
    const it = items.find(i => i.id === activeId);
    if (!it || !it.startTime) return null;
    const diffMs = Date.now() - new Date(it.startTime).getTime();
    const mins = Math.floor(diffMs / 60000);
    const secs = Math.floor((diffMs % 60000) / 1000);
    return { mins, secs };
  }, [activeId, items, now]);

  const approvedOrRunning = items.filter(it => it.status === 'Approved' || it.status === 'InProgress');
  const totalLogged = items.reduce((acc, it) => acc + (it.elapsedMinutes ?? 0), 0);

  // UI state: search + filter
  const [query, setQuery] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'approved' | 'running' | 'completed'>('all');

  const filtered = approvedOrRunning.filter(it => {
    if (filter === 'approved' && !(it.status === 'Approved' || it.status === 'InProgress')) return false; // show running under approved filter too
    if (filter === 'running' && it.status !== 'InProgress') return false;
    if (filter === 'completed' && it.status !== 'Completed') return false;
    if (!query) return true;
    return it.title.toLowerCase().includes(query.toLowerCase()) || (it.details ?? '').toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="flex h-screen bg-[#0f1113] text-gray-100">
      <Sidebar role="employee" />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-red-400">Time Logs {loading && <span className="text-sm text-gray-300 ml-2">(loading...)</span>}</h1>
              <p className="text-sm text-gray-400">Track your approved work items. Start a timer for approved items and end to save logged time.</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-xs text-gray-400">Active</div>
                <div className="text-lg font-semibold text-green-400">{activeId ? '1' : '0'}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">Items</div>
                <div className="text-lg font-semibold">{approvedOrRunning.length}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">Total Logged</div>
                <div className="text-lg font-semibold">{fmtMinutes(totalLogged)}</div>
              </div>
            </div>
          </header>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-md bg-red-900/40 border border-red-800 text-red-200">{error}</div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search items, customers..." className="w-full p-2 rounded-md bg-[#0b0c0d]/60 border border-gray-800 placeholder-gray-500" />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setFilter('all')} className={`px-3 py-2 rounded-md ${filter==='all' ? 'bg-gray-700 text-white' : 'bg-transparent text-gray-300'}`}>All</button>
              <button onClick={() => setFilter('approved')} className={`px-3 py-2 rounded-md ${filter==='approved' ? 'bg-gray-700 text-white' : 'bg-transparent text-gray-300'}`}>Approved</button>
              <button onClick={() => setFilter('running')} className={`px-3 py-2 rounded-md ${filter==='running' ? 'bg-gray-700 text-white' : 'bg-transparent text-gray-300'}`}>Running</button>
              <button onClick={() => setFilter('completed')} className={`px-3 py-2 rounded-md ${filter==='completed' ? 'bg-gray-700 text-white' : 'bg-transparent text-gray-300'}`}>Completed</button>
            </div>
          </div>

          <section className="space-y-4">
            {/* Active sticky bar when running */}
            {activeId && (() => {
              const active = items.find(i => i.id === activeId);
              if (!active) return null;
              return (
                <div className="sticky top-6 z-20 p-3 bg-gradient-to-r from-green-900 to-green-800 rounded-xl border border-green-700 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-black/30 p-2 rounded-md"><Clock size={18} /></div>
                    <div>
                      <div className="text-sm text-green-100 font-semibold">Running: {active.title}</div>
                      <div className="text-xs text-green-200">Started: {active.startTime ? new Date(active.startTime).toLocaleTimeString() : ''}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-green-100">{runningElapsed ? `${runningElapsed.mins}m ${runningElapsed.secs}s` : ''}</div>
                    <button onClick={() => end(active.id)} className="px-3 py-2 bg-red-600 rounded-md">End</button>
                  </div>
                </div>
              );
            })()}
            {filtered.length === 0 ? (
              <div className="p-6 bg-[#0b0c0d]/60 rounded-lg border border-gray-800 text-gray-400">No items match your filters. Try clearing search or changing status filter.</div>
            ) : (
              filtered.map(it => (
                <div key={it.id} className="bg-gradient-to-r from-[#0b0c0d] to-[#0f1113] p-4 rounded-xl border border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-800/40 p-3 rounded-lg">
                      <Clock size={20} />
                    </div>
                    <div>
                      <div className="text-white font-semibold">{it.title}</div>
                      <div className="text-sm text-gray-400">{it.type} • {it.details}</div>
                      {it.status === 'Completed' && it.elapsedMinutes != null && (
                        <div className="text-sm text-gray-300 mt-1">Logged: {fmtMinutes(it.elapsedMinutes)} • {it.startTime ? new Date(it.startTime).toLocaleString() : ''}</div>
                      )}
                      {it.status === 'InProgress' && (
                        <div className="text-sm text-green-300 mt-1">Running: {runningElapsed ? `${runningElapsed.mins}m ${runningElapsed.secs}s` : 'starting...'}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {it.status === 'Pending' && (
                      <button onClick={() => approve(it.id)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md flex items-center gap-2"><CheckCircle size={16}/> Approve</button>
                    )}

                    {it.status === 'Approved' && (
                      <div className="flex items-center gap-2">
                        <button onClick={() => start(it.id)} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md flex items-center gap-2"><Play size={16}/> Start</button>
                        <button onClick={() => viewDetails(it.id)} className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm">View</button>
                      </div>
                    )}

                    {it.status === 'InProgress' && (
                      <button onClick={() => end(it.id)} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md flex items-center gap-2"><StopCircle size={16}/> End</button>
                    )}
                  </div>
                </div>
              ))
            )}
            {/* Expanded details panel */}
            {expandedId && detailsMap[expandedId] && (() => {
              const d: any = detailsMap[expandedId];
              const customerName = d?.customerName ?? d?.customer?.user?.userName ?? d?.customer?.userName ?? d?.user?.userName ?? d?.customer?.fullName ?? d?.customer?.name ?? d?.customerDisplay ?? '';
              const vehiclePlate = d?.vehicle?.plateNumber ?? d?.vehicle?.plate ?? d?.vehiclePlate ?? d?.vehicle?.plateNo ?? '';
              const services = (Array.isArray(d?.appointmentServices) && d.appointmentServices.length)
                ? d.appointmentServices.map((s: any) => s?.service?.title ?? s?.service?.name ?? s?.serviceID ?? s?.service?.code).filter(Boolean).join(', ')
                : (d?.serviceDetails?.servicePackage?.items ? d.serviceDetails.servicePackage.items.map((it: any) => it?.service?.title ?? it?.service?.name).filter(Boolean).join(', ') : (d?.serviceDetails?.servicePackage?.name ?? d?.serviceDisplay ?? ''));
              const employeeName = d?.employee?.user?.userName ?? d?.employee?.userName ?? d?.employeeName ?? d?.employee?.empNo ?? '';
              const start = d?.startDate ?? d?.start ?? d?.time ?? '';
              const end = d?.endDate ?? d?.end ?? '';
              const total = d?.totalPrice ?? d?.total_price ?? d?.price ?? '';
              return (
                <div className="mt-4 p-4 rounded-lg bg-[#0b0c0d]/60 border border-gray-800">
                  <div className="text-sm text-gray-300 font-semibold mb-2">Appointment Details (id: {expandedId})</div>
                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-200">
                    <div><span className="text-gray-400">Customer:</span> {customerName || '—'}</div>
                    <div><span className="text-gray-400">Vehicle:</span> {vehiclePlate || '—'}</div>
                    <div><span className="text-gray-400">Services:</span> {services || '—'}</div>
                    <div><span className="text-gray-400">Employee:</span> {employeeName || '—'}</div>
                    <div><span className="text-gray-400">Start:</span> {start ? new Date(start).toLocaleString() : '—'}</div>
                    <div><span className="text-gray-400">End:</span> {end ? new Date(end).toLocaleString() : '—'}</div>
                    <div className="col-span-2"><span className="text-gray-400">Total:</span> {total ? `₹${total}` : '—'}</div>
                  </div>
                </div>
              );
            })()}
          </section>

        </div>
      </main>
    </div>
  );
}
