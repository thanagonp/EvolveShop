"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, ShoppingCart, Settings } from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: Home },
  { name: "ออเดอร์", path: "/dashboard/orders", icon: ShoppingCart },
  { name: "สินค้า", path: "/dashboard/products", icon: Package },
  { name: "ตั้งค่า", path: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.div 
      initial={{ x: -250 }} 
      animate={{ x: 0 }}   
      transition={{ duration: 0.3 }}  
      className="w-64 h-screen bg-white border-r border-gray-300 shadow-md mt-16"
    >
      <nav className="">
        {menuItems.map(({ name, path, icon: Icon }) => (
          <Link key={path} href={path} className="relative block">
            {pathname === path && (
              <motion.div  //
                layoutId="activeMenu"
                className="absolute inset-0 bg-gray-200"
                transition={{ type: "spring", stiffness: 100, damping: 20 }}  
              />
            )}
            <div
              className={`relative flex items-center gap-3 px-4 py-2 text-gray-800 ${
                pathname === path ? "font-bold" : "text-gray-600"
              }`}
            >
              <Icon size={20} />
              {name}
            </div>
          </Link>
        ))}
      </nav>
    </motion.div>  
  );
}
