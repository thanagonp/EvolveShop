"use client";

import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import { useEffect, useState } from "react";
import LoginModal from "@/components/modals/LoginModal";
import axios from "axios";

interface Customer {
  name: string;
  username: string;
  photo: string;
}

export default function CustomerNavbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("/auth/me", {
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setCustomer(res.data.user);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch customer info:", err);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCustomer(null);
    window.location.href = "/customer/store";
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md p-4 z-50 flex justify-between items-center">
        {/* 🔹 โลโก้ร้าน */}
        <Link href="/customer/store" className="text-xl font-bold">
          🏪 ร้านค้าออนไลน์
        </Link>

        {/* 🔹 เมนูด้านขวา */}
        <div className="flex gap-4 items-center">
          <Link href="/customer/store" className="text-gray-700 hover:text-blue-500">
            หน้าแรก
          </Link>

          <Link href="/customer/cart" className="flex items-center gap-1 text-gray-700 hover:text-black">
            <ShoppingCart size={20} />
            ตะกร้า
          </Link>

          {customer ? (
            <div className="flex items-center gap-3">
              <span className="font-semibold text-sm text-gray-700">👋 {customer.name}</span>
              <button onClick={handleLogout} className="text-red-600 hover:text-red-800 font-medium text-sm">
                ออกจากระบบ
              </button>
            </div>
          ) : (
            <button
              className="flex items-center gap-1 text-gray-700 hover:text-black"
              onClick={() => setShowLogin(true)}
            >
              <User size={20} />
              บัญชี
            </button>
          )}
        </div>
      </nav>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
