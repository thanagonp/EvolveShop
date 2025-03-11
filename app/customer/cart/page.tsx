"use client";

import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { motion } from "framer-motion";
import { Trash, Plus, Minus, ShoppingCart } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalAmount ,clearCart } = useCart();
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-6 relative pb-32">
      <h1 className="text-2xl font-bold flex items-center gap-2 justify-center">
        <ShoppingCart className="w-6 h-6" />
        ตะกร้าสินค้า
      </h1>

      {cart.length === 0 ? (
        <p className="text-center py-10 text-gray-500">❌ ไม่มีสินค้าในตะกร้า</p>
      ) : (
        <div className="flex flex-col gap-8 mt-6">
          <div className="space-y-4">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-4 p-4 bg-white shadow-md rounded-lg border"
              >
                <CldImage
                  src={item.image}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-gray-500">{item.price} บาท</p>
                  <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => {
                      if (item.quantity > 1) {
                        updateQuantity(item.id, item.quantity - 1);
                      }
                    }}
                    className="p-2 bg-gray-200 rounded-lg disabled:opacity-50"
                    disabled={item.quantity <= 1} // ปิดใช้งานปุ่มถ้าค่าจำนวนเป็น 1
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                    <span className="w-8 text-center text-lg font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 bg-gray-200 rounded-lg">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="p-3 bg-red-500 text-white rounded-lg">
                  <Trash className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* 🔥 กล่องสรุปยอดรวมสินค้า (Sticky Bottom) */}
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 border-t z-20 md:max-w-lg md:mx-auto md:rounded-t-lg">
            <h2 className="text-lg font-semibold">💰 ยอดรวม:</h2>
            <p className="text-2xl font-bold mt-2">{totalAmount.toLocaleString()} บาท</p>

            <button
            onClick={() => router.push("/customer/checkout")}
            className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
            ไปที่หน้าชำระเงิน
            </button>

            <button
              onClick={clearCart}
              className="mt-2 w-full px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition"
            >
              ล้างตะกร้า
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
