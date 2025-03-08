"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, ShoppingCart, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebar } from "@/components/layout/SidebarContext"; // ✅ นำเข้า Context ที่แยกออกไปแล้ว

export default function Sidebar() {
  
  const pathname = usePathname();
  const { isOpen, toggleSidebar } = useSidebar();
  
  return (
    <motion.aside
      className="fixed left-0 top-0 h-screen bg-white border-r shadow-md flex flex-col z-50 pt-16"
      animate={{ width: isOpen ? 200 : 60 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <nav className="overflow-y-auto flex-1 mt-6">
        {[
          { name: "Dashboard", path: "/dashboard", icon: Home },
          { name: "ออเดอร์", path: "/dashboard/orders", icon: ShoppingCart },
          { name: "สินค้า", path: "/dashboard/products", icon: Package },
          { name: "ตั้งค่า", path: "/dashboard/settings", icon: Settings },
        ].map(({ name, path, icon: Icon }) => (
          <Link key={path} href={path} className="relative flex items-center w-full px-4 py-3 group">

            {pathname === path && <motion.div layoutId="activeMenu" transition={{ duration: 0.15 }} className="absolute inset-0 bg-blue-500 rounded-md" />}
            <Icon className={`relative z-10 ${pathname === path ? "text-white" : "text-gray-800"}`} size={24} />
            {isOpen && (
              <span className={`relative z-10 ml-3 ${pathname === path ? "text-white font-semibold" : "text-gray-700"}`}>
                {name}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* ✅ ปุ่มขยาย/ย่อ Sidebar */}
      <div className="absolute bottom-4 right-2">
        <button
          onClick={toggleSidebar}
          className="bg-gray-300 p-2 rounded-full hover:bg-gray-400 transition"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </motion.aside>
  );
}
