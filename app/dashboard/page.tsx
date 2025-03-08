"use client";

import { motion } from "framer-motion";

export default function DashboardPage() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-gray-600">ยินดีต้อนรับสู่ระบบจัดการร้านค้า</p>
    </motion.main>
  );
}
