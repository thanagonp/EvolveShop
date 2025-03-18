"use client";
import { useState } from "react";
import { motion} from "framer-motion";
import { Product } from "@/lib/types/interface";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export default function InfoModal({ isOpen, onClose, product }: InfoModalProps) {

 const [currentIndex, setCurrentIndex] = useState(0);

if (!isOpen || !product) return null; // ✅ Hook ถูกเรียกก่อน return

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white p-6 rounded-lg w-[90%] max-w-3xl shadow-lg relative z-50"
      >
        {/* ปุ่มปิด Modal */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-lg"
        >
          ✖
        </button>

        {/* หัวข้อสินค้า */}
        <h2 className="text-2xl font-bold mb-4">{product.name}</h2>

        {/* รายละเอียดสินค้า */}
        <p className="text-gray-700 mb-1">📦 ราคา: {product.price} บาท</p>
        <p className="text-gray-700 mb-1">📦 คลังสินค้า: {product.stock} ชิ้น</p>
        <p className="text-gray-700 mb-1">📦 สี: {product.color} </p>
        <p className="text-gray-700 mb-1">📦 ไซส์: {product.size} </p>
        <p className="text-gray-700 mb-1">📦 รายละเอียดสินค้า: {product.description} </p>

        {/* 🖼️ Image Carousel */}
        <div className="relative w-full flex justify-center items-center">
          {/* ปุ่ม Previous */}
          <button
            onClick={handlePrev}
            className="absolute left-0 p-2 bg-black/50 text-white rounded-full hover:bg-black transition"
          >
            ◀
          </button>

          {/* รูปภาพ Carousel */}
          <div className="w-[300px] h-[300px] flex overflow-hidden relative">
            {product.images.map((image: string, index: number) => (
              <motion.img
                key={index}
                src={image}
                alt={`Product ${index + 1}`}
                className={`absolute w-full h-full object-cover rounded-lg shadow-sm transition-opacity duration-300 ${
                  index === currentIndex ? "opacity-100 scale-105 z-10" : "opacity-50 scale-90 z-0"
                }`}
                animate={{ x: `${(index - currentIndex) * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            ))}
          </div>

          {/* ปุ่ม Next */}
          <button
            onClick={handleNext}
            className="absolute right-0 p-2 bg-black/50 text-white rounded-full hover:bg-black transition"
          >
            ▶
          </button>
        </div>
      </motion.div>
    </div>
  );
}
