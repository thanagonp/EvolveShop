"use client";
import { createContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Toast, { ToastProps } from "./Toast";

export const ToastContext = createContext<any>(null);

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // ✅ รวม `showToast` กับ `addToast`
  const showToast = (message: string, type: "success" | "error" | "warning" | "info" = "success") => {
    const id = uuidv4();
    setToasts((prevToasts) => [...prevToasts, { id, message, type, onClose: removeToast }]);

    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>  {/* ✅ ใช้ Object แทนค่าเดี่ยว */}
      {children}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col gap-2 z-[9999]">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
