"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">

      <div className="absolute top-0 left-0 w-full z-10">
        <Navbar />
      </div>

      {/* Sidebar */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        transition={{ duration: 0.5 }} 
        className="flex h-screen bg-gray-100">
        <Sidebar />
      </motion.div>

      {/* Content */}
      <div className="flex-1 p-6 mt-16">
        {children}
      </div>
    </div>
  );
}
