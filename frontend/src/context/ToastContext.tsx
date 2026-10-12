import React, { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ToastContextType {
  showToast: (type: ToastMessage['type'], title: string, message?: string, duration?: number) => void;
  success: (title: string, message?: string, duration?: number) => void;
  error: (title: string, message?: string, duration?: number) => void;
  info: (title: string, message?: string, duration?: number) => void;
  warning: (title: string, message?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Duration configuration: success toasts auto-dismiss in ~1.5s; errors give users enough time to read
const DEFAULT_DURATIONS: Record<ToastMessage['type'], number> = {
  success: 1500, // Exactly 1.5 seconds auto-dismiss
  error: 6000,   // Sufficient reading time for errors
  warning: 4500,
  info: 3500,
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Cleanup all pending timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  const removeToast = useCallback((id: string) => {
    // Clear associated timer if still pending
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastMessage['type'], title: string, message?: string, customDuration?: number) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastMessage = { id, type, title, message };

      setToasts((prev) => {
        // Limit max active toasts to 4 and clear timers for discarded toasts
        if (prev.length >= 4) {
          const removed = prev.slice(0, prev.length - 3);
          removed.forEach((item) => {
            const t = timersRef.current.get(item.id);
            if (t) {
              clearTimeout(t);
              timersRef.current.delete(item.id);
            }
          });
          return [...prev.slice(-3), newToast];
        }
        return [...prev, newToast];
      });

      const duration = customDuration ?? DEFAULT_DURATIONS[type];
      const timer = setTimeout(() => {
        removeToast(id);
      }, duration);

      timersRef.current.set(id, timer);
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, message?: string, duration?: number) => showToast('success', title, message, duration),
    [showToast]
  );
  const error = useCallback(
    (title: string, message?: string, duration?: number) => showToast('error', title, message, duration),
    [showToast]
  );
  const info = useCallback(
    (title: string, message?: string, duration?: number) => showToast('info', title, message, duration),
    [showToast]
  );
  const warning = useCallback(
    (title: string, message?: string, duration?: number) => showToast('warning', title, message, duration),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      <div
        id="toast-container"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0"
      >
        <AnimatePresence>
          {toasts.map((toast) => {
            const icons = {
              success: <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0" />,
              error: <AlertCircle className="w-5 h-5 text-[#B91C1C] shrink-0" />,
              info: <Info className="w-5 h-5 text-[#1D4ED8] shrink-0" />,
              warning: <AlertTriangle className="w-5 h-5 text-[#B45309] shrink-0" />,
            };

            const bgBorders = {
              success: 'bg-[#DCFCE7] border-[#BBF7D0] text-[#15803D] shadow-xs',
              error: 'bg-[#FEE2E2] border-[#FECACA] text-[#B91C1C] shadow-xs',
              info: 'bg-[#DBEAFE] border-[#BFDBFE] text-[#1D4ED8] shadow-xs',
              warning: 'bg-[#FEF3C7] border-[#FDE68A] text-[#B45309] shadow-xs',
            };

            return (
              <motion.div
                key={toast.id}
                id={`toast-${toast.id}`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm ${bgBorders[toast.type]}`}
              >
                <div className="pt-0.5">{icons[toast.type]}</div>
                <div className="flex-1 pr-2">
                  <h4 className="text-sm font-semibold leading-tight">{toast.title}</h4>
                  {toast.message && (
                    <p className="mt-1 text-xs opacity-90 leading-relaxed font-normal">{toast.message}</p>
                  )}
                </div>
                <button
                  id={`btn-close-toast-${toast.id}`}
                  onClick={() => removeToast(toast.id)}
                  className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-black/5 cursor-pointer"
                  aria-label="Dismiss toast"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
