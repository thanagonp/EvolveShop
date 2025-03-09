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
    axios.get(`${API_BASE_URL}/list`)
      .then((response) => {
        console.log("✅ สินค้า:", response.data);
        setProducts(response.data);
      })
      .catch((error) => console.error("❌ โหลดสินค้าล้มเหลว:", error));
  }, []);

  return (
    <motion.div
    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    >
    {products.map((product, index) => (
        <motion.div
        key={product._id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
        >
        <ProductCard product={product} />
        </motion.div>
    ))}
    </motion.div>
  );
}
