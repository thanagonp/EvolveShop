"use client";

import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import LoginModal from "@/components/modals/LoginModal";

export default function CustomerNavbar() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md p-4 z-50 flex justify-between items-center">
        {/* 🔹 โลโก้ร้าน */}
        <Link href="/customer/store" className="text-xl font-bold">
          🏪 ร้านค้าออนไลน์
        </Link>

        {/* 🔹 เมนูด้านขวา */}
        <div className="flex gap-4">
          {/* 🔹 ปุ่มหน้าร้าน */}
          <Link href="/customer/store" className="text-gray-700 hover:text-blue-500">
            หน้าแรก
          </Link>

          {/* 🔹 ตะกร้าสินค้า */}
          <Link href="/customer/cart" className="flex items-center gap-1 text-gray-700 hover:text-black">
            <ShoppingCart size={20} />
            ตะกร้า
          </Link>

          {/* 🔹 ปุ่มบัญชี → เปิด LoginModal */}
          <button
            className="flex items-center gap-1 text-gray-700 hover:text-black"
            onClick={() => setShowLogin(true)}
          >
            <User size={20} />
            บัญชี
          </button>
        </div>
      </nav>

      {/* ✅ เรียกใช้ Modal Login */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
