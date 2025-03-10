"use client";

import { createContext, useState, useContext, useEffect, ReactNode } from "react";

// 📌 Interface สำหรับสินค้าในตะกร้า
interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// 📌 Interface สำหรับ Context
interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // ✅ โหลดข้อมูลตะกร้าจาก LocalStorage เมื่อโหลดหน้าใหม่
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // ✅ อัปเดต LocalStorage ทุกครั้งที่มีการเปลี่ยนแปลงตะกร้า
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  
  // ✅ ฟังก์ชันคำนวณยอดรวมสินค้า
  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

 // ✅ เพิ่มสินค้า
 const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  // ✅ ลบสินค้า
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // ✅ อัปเดตจำนวนสินค้า
  const updateQuantity = (id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  // ✅ ล้างตะกร้า
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
};

// 📌 Hook ใช้เรียก Context API
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart ต้องใช้ภายใน CartProvider");
  }
  return context;
};
