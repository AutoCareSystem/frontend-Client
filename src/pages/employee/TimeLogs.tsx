import Sidebar from "../../components/Sidebar";
import { useEffect, useMemo, useState, useRef } from "react";
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

  // build initial items from mock services + projects
  const initial: TimeLogItem[] = [
    ...mock.projects.map(p => ({ id: p.id, type: "Project" as const, title: p.title, details: p.customer, status: p.status as TimeLogItem['status'] })),
    ...mock.services.map(s => ({ id: s.id, type: "Service" as const, title: s.title, details: s.customer, status: s.status as TimeLogItem['status'] })),
  ];

  const [items, setItems] = useState<TimeLogItem[]>(initial);
  const [activeId, setActiveId] = useState<number | null>(() => {
    const running = initial.find(d => d.status === "InProgress");
    return running ? running.id : null;
  });

  const [now, setNow] = useState<number>(Date.now());
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (activeId != null) {
      timerRef.current = window.setInterval(() => setNow(Date.now()), 1000);
    } else if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [activeId]);

  const start = (id: number) => {
    setItems(prev => prev.map(it => {
      if (it.id === id) return { ...it, status: "InProgress", startTime: new Date().toISOString(), endTime: null };
      if (it.status === "InProgress") return { ...it, status: "Approved", startTime: null };
      return it;
    }));
    setActiveId(id);
  };

  const end = (id: number) => {
    const endIso = new Date().toISOString();
    setItems(prev => prev.map(it => {
      if (it.id === id) {
        const start = it.startTime ? new Date(it.startTime).getTime() : Date.now();
        const diffMin = Math.max(1, Math.round((new Date(endIso).getTime() - start) / 60000));
        return { ...it, status: "Completed", endTime: endIso, elapsedMinutes: diffMin };
      }
      return it;
    }));
    setActiveId(null);
  };

  const approve = (id: number) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, status: "Approved" } : it));
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
    if (filter === 'approved' && it.status !== 'Approved') return false;
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
              <h1 className="text-3xl font-bold text-red-400">Time Logs</h1>
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
                      <button onClick={() => start(it.id)} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md flex items-center gap-2"><Play size={16}/> Start</button>
                    )}

                    {it.status === 'InProgress' && (
                      <button onClick={() => end(it.id)} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md flex items-center gap-2"><StopCircle size={16}/> End</button>
                    )}
                  </div>
                </div>
              ))
            )}
          </section>

        </div>
      </main>
    </div>
  );
}
