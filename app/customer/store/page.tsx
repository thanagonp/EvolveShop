"use client";
import { motion } from "framer-motion";
import ProductList from "@/components/products/ProductList";

export default function StorePage() {
  return (
    <motion.div
      className="w-full px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-4">🔖 สินค้าทั้งหมด</h1>
      <ProductList />
    </motion.div>
  );
}
