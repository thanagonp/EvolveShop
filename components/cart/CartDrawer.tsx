"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/app/context/CartContext";
import { X } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-0 right-0 w-80 h-full bg-white shadow-xl p-4 z-50"
        >
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-bold">ตะกร้าสินค้า</h2>
            <button onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          {/* แสดงสินค้าในตะกร้า */}
          <div className="mt-4 space-y-4">
            {cart.length === 0 ? (
              <p className="text-gray-500">ไม่มีสินค้าในตะกร้า</p>
            ) : (
              cart.map((item) => (
                <motion.div
                  key={item.id}
                  className="flex items-center justify-between border p-2 rounded-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <p className="font-medium">{item.name}</p>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500">
                    ลบ
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
