"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";

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

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();

  return (
    <motion.div
    className="cursor-pointer border rounded-lg overflow-hidden shadow-md bg-white flex flex-col w-full"
    whileHover={{ scale: 1.05, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}
    transition={{ duration: 0.3 }}
    onClick={() => router.push(`/customer/store/${product._id}`)}
    >
    <CldImage
        src={product.images[0]}
        alt={product.name}
        width={300}
        height={300}
        className="w-full h-60 object-cover"
    />
    <div className="p-4 flex flex-col justify-between flex-1">
        <h2 className="text-lg font-bold">{product.name}</h2>
        <p className="text-gray-600">{product.price} บาท</p>
    </div>
    </motion.div>
  );
}
