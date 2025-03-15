"use client";

import { User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white border-b border-gray-300 shadow-md flex justify-between items-center px-6 z-50">
      <h1 className="text-lg font-bold">ระบบจัดการร้าน</h1>
      <button className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-100">
        <User className="w-5 h-5" />
        <span>บัญชี</span>
      </button>
    </header>
  );
}
