"use client";
import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";

export default function CustomerNavbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md p-4 z-50 flex justify-between items-center">
      {/* โลโก้ร้าน */}
      <Link href="/customer/store" className="text-xl font-bold">
        🛍️ ร้านค้าออนไลน์
      </Link>

      {/* เมนูด้านขวา */}
      <div className="flex gap-4">
        {/* 🔹 เพิ่มลิงก์ "หน้าแรก" */}
        <Link href="/customer/store" className="text-gray-700 hover:text-blue-500">
        หน้าแรก
        </Link>
        <Link href="/customer/cart" className="flex items-center gap-1 text-gray-700 hover:text-black">
          <ShoppingCart size={20} />
          ตะกร้า
        </Link>
        <Link href="/customer/profile" className="flex items-center gap-1 text-gray-700 hover:text-black">
          <User size={20} />
          บัญชี
        </Link>
      </div>
    </nav>
  );
}
