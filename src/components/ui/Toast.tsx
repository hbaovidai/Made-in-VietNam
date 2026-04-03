import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn';

// ============================================================
// Toast Types & Context
// ============================================================
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

// ============================================================
// Toast Provider
// ============================================================
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    // Auto remove
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, toast.duration || 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

// ============================================================
// Toast Container & Item
// ============================================================
const TOAST_CONFIG: Record<ToastType, { icon: React.ReactNode; bg: string; border: string; iconColor: string }> = {
  success: {
    icon: <CheckCircle2 size={20} />,
    bg: 'bg-white',
    border: 'border-emerald-200',
    iconColor: 'text-emerald-500',
  },
  error: {
    icon: <XCircle size={20} />,
    bg: 'bg-white',
    border: 'border-red-200',
    iconColor: 'text-red-500',
  },
  warning: {
    icon: <AlertTriangle size={20} />,
    bg: 'bg-white',
    border: 'border-amber-200',
    iconColor: 'text-amber-500',
  },
  info: {
    icon: <Info size={20} />,
    bg: 'bg-white',
    border: 'border-blue-200',
    iconColor: 'text-blue-500',
  },
};

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const config = TOAST_CONFIG[toast.type];
        return (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto animate-toast-in',
              config.bg,
              'border',
              config.border,
              'rounded-xl shadow-xl shadow-slate-200/50 p-4 flex items-start gap-3'
            )}
          >
            <div className={cn('shrink-0 mt-0.5', config.iconColor)}>
              {config.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900">{toast.title}</p>
              {toast.message && (
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => onRemove(toast.id)}
              className="shrink-0 p-1 rounded-lg text-slate-300 hover:text-slate-500 hover:bg-slate-100 transition-all"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
