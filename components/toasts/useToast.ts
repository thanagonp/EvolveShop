import { useContext } from "react";
import { ToastContext } from "./ToastProvider";

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast ต้องใช้ภายใน ToastProvider");
  }
  return context;
};
