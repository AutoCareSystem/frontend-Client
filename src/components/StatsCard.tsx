import type { ReactNode } from 'react';

export default function StatsCard({ title, value, subtitle, icon, color = 'bg-red-500', children }: { title: string; value: string | number; subtitle?: string; icon?: ReactNode; color?: string; children?: ReactNode }) {
  return (
    <div className="p-5 rounded-2xl shadow-md transform hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))', border: '1px solid rgba(255,255,255,0.04)', backdropFilter: 'blur(6px)' }}>
      <div className="flex items-start justify-between gap-4">
        <div style={{ minWidth: 0 }}>
          <div className="text-sm text-gray-400 truncate">{title}</div>
          <div className="text-2xl font-extrabold mt-1 text-red-500 truncate">{value}</div>
          {subtitle ? <div className="text-xs text-gray-400 mt-1 truncate">{subtitle}</div> : null}
        </div>
        {icon ? <div className={`p-3 rounded-xl ${color}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 44 }}>{icon}</div> : null}
      </div>
      {children ? <div className="mt-3 text-sm text-gray-300">{children}</div> : null}
      <div className="mt-3 flex justify-end">
        <button onClick={() => { /* placeholder for quick action */ }} className="text-xs text-gray-300 bg-white/3 px-2 py-1 rounded hover:bg-white/5">Quick</button>
      </div>
    </div>
  );
}
