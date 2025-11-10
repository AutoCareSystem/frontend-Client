import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';

export type ToastType = 'info' | 'success' | 'error' | 'warning';
export type ToastItem = { id: string; type: ToastType; message: string; title?: string };

const ToastContext = createContext<{ show: (message: string, type?: ToastType, title?: string) => void } | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((message: string, type: ToastType = 'info', title?: string) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 7);
    const t: ToastItem = { id, type, message, title };
    setToasts((s) => [t, ...s]);
    // auto remove after 4.5s
    setTimeout(() => setToasts((s) => s.filter(x => x.id !== id)), 4500);
  }, []);

  const remove = useCallback((id: string) => setToasts((s) => s.filter(t => t.id !== id)), []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div aria-live="polite" className="fixed top-6 right-6 z-50 flex flex-col items-end space-y-3">
        {toasts.map(t => (
          <Toast key={t.id} item={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

function Toast({ item, onClose }: { item: ToastItem; onClose: () => void }) {
  useEffect(() => {
    const id = setTimeout(onClose, 5000);
    return () => clearTimeout(id);
  }, [onClose]);

  const color = item.type === 'success' ? 'bg-green-600' : item.type === 'error' ? 'bg-red-600' : item.type === 'warning' ? 'bg-yellow-500' : 'bg-slate-600';

  return (
    <div className={`max-w-sm w-full ${color} text-white rounded-lg shadow-lg border border-white/5 overflow-hidden`}> 
      <div className="px-4 py-3 flex items-start gap-3">
        <div className="flex-1">
          {item.title && <div className="font-semibold">{item.title}</div>}
          <div className="text-sm mt-1">{item.message}</div>
        </div>
        <button onClick={onClose} className="ml-2 text-white/90 hover:text-white">✕</button>
      </div>
    </div>
  );
}
