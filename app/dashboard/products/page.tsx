"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import AddProductModal from "@/components/modals/AddProductModal";
import { API_BASE_URL } from "@/config"; // API URL
import { CLOUDINARY_UPLOAD_URL, CLOUDINARY_UPLOAD_PRESET } from "@/config";
import InfoModal from "@/components/modals/InfoModal";
import { motion } from "framer-motion";
import { CldImage } from "next-cloudinary";
import { Info, Edit, Trash } from "lucide-react";
import { useToast } from "@/components/toasts/useToast";


export default function ProductPage() {
  interface Product {
    _id: string;
    name: string;
    price: number;
    stock: number;
    images: string[];
    color: string;
    size: string;
    description?: string;
    status: "available" | "unavailable";
  }
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const addToast = useToast();

  // 📌 ดึงข้อมูลสินค้าจาก API เมื่อโหลดหน้า
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get(`${API_BASE_URL}/list`)
      .then((response) => setProducts([...response.data]))
      .catch((error) => console.error("❌ โหลดสินค้าล้มเหลว:", error));
  };

  const clearModal = () => {
    setIsOpen(false);
    setSelectedProduct(null);
  }

  // 📌 ฟังก์ชันอัปโหลดรูปไปยัง Cloudinary
  const uploadImagesToCloudinary = async (images: File[]) => {
    try {
      const uploadedImages = [];

      for (const image of images) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData);

        uploadedImages.push(response.data.secure_url);
      }

      return uploadedImages; // ✅ คืนค่า URL ของรูปทั้งหมด
    } catch (error) {
      console.error("❌ อัปโหลดรูปภาพล้มเหลว:", error);
      return [];
    }
  };
  // 📌 ฟังก์ชันบันทึกสินค้า
  const handleSaveProduct = async (product: any) => {
    
    try {
      if (!product.images || product.images.length === 0) {
        console.error("❌ กรุณาอัปโหลดรูปภาพอย่างน้อย 1 รูป");
        return;
      }

      const uploadedImages = await uploadImagesToCloudinary(product.images);

      if (!uploadedImages || uploadedImages.length === 0) {
        console.error("❌ อัปโหลดรูปภาพไม่สำเร็จ");
        return;
      }

      // ✅ เตรียมข้อมูลสินค้าให้ตรงกับ Model หลังบ้าน
      const productData = {
        name: product.name,
        price: product.price,
        stock: product.stock,
        images: uploadedImages,
        color: product.color, // ✅ สีเดี่ยว
        size: product.size, // ✅ ไซส์เดี่ยว
        description: product.description,
        status: product.status || "available", // ✅ เพิ่มสถานะเริ่มต้นเป็นพร้อมขาย
      };

      const response = await axios.post(`${API_BASE_URL}/products/add`, productData, {
        headers: { "Content-Type": "application/json" },
      });

      clearModal();
      fetchProducts();
      addToast("✅ เพิ่มสินค้าสำเร็จ", "success");
    } catch (error: any) {
      console.error("❌ เกิดข้อผิดพลาด:", error.response?.data || error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold">📦 รายการสินค้า</h1>
      <button
        onClick={() => setIsOpen(true)}
        className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        <PlusCircle className="w-5 h-5" />
        เพิ่มสินค้า
      </button>
  
      {/* ✨ Modal สำหรับเพิ่มสินค้า */}
      <AddProductModal isOpen={isOpen} onClose={() => setIsOpen(false)} onSave={handleSaveProduct} />
  
      <div className="pt-4">
        <h1 className="text-3xl font-bold mb-6">🛍️ รายการสินค้า</h1>
  
        {/* 🔹 Grid Layout แสดงสินค้า */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative w-44 h-64 rounded-lg overflow-hidden shadow-lg transition group"
            >
              {/* 🔹 รูปสินค้า */}
              <motion.div className="relative w-full h-full overflow-hidden">
                {/* 🔹 ภาพสินค้า */}
                <CldImage
                  src={product.images[0]}
                  alt={product.name}
                  width={200}
                  height={200}
                  crop={{ type: "auto", source: true }}
                  className="w-full h-full object-cover transition-transform duration-300"
                  priority={true}
                />
  
                {/* 🔹 Gradient Overlay มืดเฉพาะขอบบนและล่าง */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
  
              {/* 🔹 ชื่อสินค้า */}
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-lg text-sm opacity-80">
                {product.name}
              </div>
  
              {/* 🔹 ปุ่ม Info (แสดงตลอด) */}
              <button
                onClick={() => {
                  setSelectedProduct(product);
                }}
                className="absolute top-3 right-3 p-2 rounded-full shadow-md z-20
                          bg-gray-700/40 backdrop-blur-md text-white
                          hover:bg-gray-400/50 transition duration-300"
              >
                <Info size={20} />
              </button>
  
              {/* 🔹 Action Icons (แสดงเมื่อ Hover) */}
              <motion.div
                className="absolute inset-0 flex items-end justify-end p-3 opacity-0 
             group-hover:opacity-100 transition-opacity z-10 gap-3"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* 🔹 Edit */}
                <button className="bg-gray-700/40 text-white p-3 rounded-full shadow-md hover:bg-gray-400/50">
                  <Edit size={20} />
                </button>
  
                {/* 🔹 Delete */}
                <button className="bg-red-500 text-white p-3 rounded-full shadow-md">
                  <Trash size={20} />
                </button>
              </motion.div>
            </motion.div>
          ))}
        </div>
  
        {/* 🏷️ ใช้ InfoModal แสดงรายละเอียดสินค้า */}
        {selectedProduct && (
          <InfoModal
            isOpen={!!selectedProduct}
            onClose={() => setSelectedProduct(null)}
            product={selectedProduct}
          />
        )}
      </div>
    </div>
  );  
}
