"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import { API_BASE_URL } from "@/config";
import { motion } from "framer-motion";

interface Product {
    _id: string;
    name: string;
    price: number;
    stock: number;
    images: string[];
    color: string[];
    size: string[];
    description?: string;
    status: "available" | "unavailable";
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/products/list`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => console.error("❌ โหลดสินค้าล้มเหลว:", error));
  }, []);

  return (
    <motion.div
      className="w-full max-w-screen-2xl mx-auto px-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
        {products.map((product, index) => (
          <motion.div
            key={product._id}
            className="w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
