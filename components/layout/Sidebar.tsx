"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, ShoppingCart, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebar } from "@/components/layout/SidebarContext"; // ✅ นำเข้า Context ที่แยกออกไปแล้ว

export default function Sidebar() {
  
  const pathname = usePathname();
  const { isOpen, toggleSidebar } = useSidebar();
  
  return (
    <aside
      className="fixed left-0 top-0 h-screen bg-white border-r shadow-md flex flex-col z-50 pt-16 transition-all duration-200 ease-in-out"
      style={{ width: isOpen ? 200 : 60 }} // ✅ ใช้ CSS แทน Motion
    >
      <nav className="overflow-y-auto flex-1 mt-6">
        {[
          { name: "Dashboard", path: "/dashboard", icon: Home },
          { name: "ออเดอร์", path: "/dashboard/orders", icon: ShoppingCart },
          { name: "สินค้า", path: "/dashboard/products", icon: Package },
          { name: "ตั้งค่า", path: "/dashboard/settings", icon: Settings },
        ].map(({ name, path, icon: Icon }) => (
          <Link key={path} href={path} prefetch={false} className="relative flex items-center w-full px-4 py-3 group">

            {/* ✅ ใช้ CSS แทน Motion */}
            <div className={`absolute inset-0 ${pathname === path ? "bg-blue-500" : ""} rounded-md transition-all duration-150`} />

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
    </aside>
  );
}
