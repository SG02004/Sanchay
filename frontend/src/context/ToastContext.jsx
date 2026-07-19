/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

// A tiny, dependency-free toast (pop-up notification) system.
// Any component can call toast.success("...") / toast.error("...") after using useToast().
const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

// Simple counter so each toast gets a unique id (we avoid Math.random for predictability)
let counter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Remove a toast by id
  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  // Add a toast, then auto-remove it after 3.5 seconds
  const push = useCallback(
    (message, type) => {
      counter += 1;
      const id = counter;
      setToasts((current) => [...current, { id, message, type }]);
      setTimeout(() => dismiss(id), 3500);
    },
    [dismiss]
  );

  // The public API we hand to the rest of the app
  const toast = {
    success: (msg) => push(msg, "success"),
    error: (msg) => push(msg, "error"),
    info: (msg) => push(msg, "info"),
  };

  const styles = {
    success: { ring: "border-emerald-200", icon: <CheckCircle2 className="text-emerald-600" size={20} /> },
    error: { ring: "border-red-200", icon: <XCircle className="text-red-500" size={20} /> },
    info: { ring: "border-blue-200", icon: <Info className="text-blue-600" size={20} /> },
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* The stack of toasts, fixed to the top-right corner */}
      <div className="fixed right-4 top-4 z-[100] flex w-full max-w-xs flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-in fade-in slide-in-from-top-2 flex items-start gap-3 rounded-xl border ${styles[t.type].ring} bg-white p-4 shadow-lg`}
          >
            {styles[t.type].icon}
            <p className="flex-1 text-sm font-medium text-slate-700">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="text-slate-400 transition hover:text-slate-600"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
