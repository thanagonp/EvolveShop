"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-300 px-6 py-3 flex justify-between items-center">
      <h1 className="text-lg font-bold">ระบบจัดการร้าน</h1>

      {/* User Menu */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-100"
        >
          <User className="w-5 h-5" />
          <span>บัญชี</span>
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg overflow-hidden"
            >
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                แก้ไขโปรไฟล์
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-red-500">
                <LogOut className="w-4 h-4" /> ออกจากระบบ
              </li>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
