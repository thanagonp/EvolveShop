import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

export interface ToastProps {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  onClose: (id: string) => void;
}

const Toast = ({ id, message, type, onClose }: ToastProps) => {
  const icons = {
    success: <CheckCircle className="text-green-500 w-5 h-5" />,
    error: <XCircle className="text-red-500 w-5 h-5" />,
    warning: <AlertTriangle className="text-yellow-500 w-5 h-5" />,
    info: <Info className="text-blue-500 w-5 h-5" />,
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3 p-3 mb-2 bg-white shadow-md rounded-lg border-l-4"
        style={{
          borderColor:
            type === "success"
              ? "#22c55e"
              : type === "error"
              ? "#ef4444"
              : type === "warning"
              ? "#facc15"
              : "#3b82f6",
        }}
      >
        {icons[type]}
        <span className="text-sm">{message}</span>
        <button className="ml-auto" onClick={() => onClose(id)}>
          ✖
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
