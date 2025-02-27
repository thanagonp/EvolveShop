"use client";
import { createContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Toast, { ToastProps } from "./Toast";

export const ToastContext = createContext<any>(null);

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (message: string, type: ToastProps["type"]) => {
    const id = uuidv4();
    setToasts((prev) => [...prev, { id, message, type, onClose: removeToast }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
