"use client";

import { createContext, useState, useContext, useEffect, useRef, useCallback, ReactNode } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config";
import { useToast } from "@/components/toasts/useToast";
import { CartItem, CartContextType } from "@/lib/types/interface";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { showToast } = useToast();
  const isProcessing = useRef(false);
  const toastQueue = useRef<string | null>(null);
  const [isToastReady, setIsToastReady] = useState(false);

  // ✅ โหลดข้อมูลจาก LocalStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // ✅ อัปเดต LocalStorage เมื่อ `cart` เปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ แสดง Toast เมื่อพร้อม
  useEffect(() => {
    if (isToastReady && toastQueue.current) {
      showToast(toastQueue.current, "success");
      toastQueue.current = null;
      setIsToastReady(false);
    }
  }, [isToastReady, showToast]); // ✅ เพิ่ม `showToast` ใน dependency array

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // ✅ เพิ่มสินค้า (เช็คสต็อกก่อนเพิ่ม)
  const addToCart = useCallback(async (product: CartItem) => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    try {
      const response = await axios.get<{ stock: number }>(`${API_BASE_URL}/products/${product.id}/stock`);
      const availableStock = response.data.stock;

      if (availableStock < 1) {
        showToast("❌ สินค้าในสต็อกมีไม่พอ", "error");
        isProcessing.current = false;
        return;
      }

      let isItemAdded = false;
      let updatedCart: CartItem[] = [];

      setCart((prevCart) => {
        updatedCart = [...prevCart];

        for (let i = 0; i < updatedCart.length; i++) {
          if (updatedCart[i].id === product.id) {
            if (updatedCart[i].quantity + 1 > availableStock) {
              showToast("❌ สินค้าในสต็อกมีไม่พอ", "error");
              isProcessing.current = false;
              return prevCart;
            }
            updatedCart[i].quantity += 1;
            isItemAdded = true;
          }
        }

        if (!isItemAdded) {
          updatedCart.push({ ...product, quantity: 1 });
        }

        return updatedCart;
      });

      // ✅ เรียก Toast หลังจาก cart อัปเดตเสร็จ
      setTimeout(() => {
        showToast("✅ เพิ่มสินค้าลงตะกร้าสำเร็จ!", "success");
      }, 100);

    } catch (error: unknown) {
      console.error("❌ ไม่สามารถดึงข้อมูลสต็อก:", error);
    } finally {
      setTimeout(() => {
        isProcessing.current = false;
      }, 500);
    }
  }, [showToast]); // ✅ เพิ่ม `showToast` ใน dependency array

  // ✅ ลบสินค้าออกจากตะกร้า
  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // ✅ อัปเดตจำนวนสินค้าในตะกร้า (ตรวจสอบ stock)
  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    try {
      const response = await axios.get<{ stock: number }>(`${API_BASE_URL}/products/${id}/stock`);
      const availableStock = response.data.stock;

      if (quantity > availableStock) {
        showToast("❌ สินค้าในสต็อกมีไม่พอ", "error");
        return;
      }

      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    } catch (error: unknown) {
      console.error("❌ ไม่สามารถดึงข้อมูลสต็อก:", error);
    }
  }, [showToast]); // ✅ เพิ่ม `showToast` ใน dependency array

  // ✅ ล้างตะกร้าสินค้า
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart ต้องใช้ภายใน CartProvider");
  }
  return context;
};
