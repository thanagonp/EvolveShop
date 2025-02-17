"use client";
import { motion } from "framer-motion";

export default function DashboardPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }} 
      className="p-6">
      
      <h1 className="text-2xl font-bold flex items-center">
        📊 จัดการร้านค้า
      </h1>
      <p className="mt-2 text-gray-600">ยินดีต้อนรับสู่ระบบจัดการร้านค้า</p>
    </motion.div>
  );
}
