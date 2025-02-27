"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { motion } from "framer-motion";
import { Upload, XCircle } from "lucide-react";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => void;
}

export default function AddProductModal({ isOpen, onClose, onSave }: AddProductModalProps) {
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    stock: "",
    color: "",  // ✅ เปลี่ยนเป็นค่าเดียว
    size: "",   // ✅ เปลี่ยนเป็นค่าเดียว
    description: "",
    images: [] as File[],
    status: "available",
  });

  // 📌 ฟังก์ชันจัดการการเปลี่ยนแปลงค่าในฟอร์ม
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  // 📌 ฟังก์ชันอัปโหลดรูปภาพ
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      if (productData.images.length + files.length > 5) {
        alert("สามารถอัปโหลดได้สูงสุด 5 รูปภาพเท่านั้น");
        return;
      }
      setProductData((prev) => ({
        ...prev,
        images: [...prev.images, ...Array.from(files)],
      }));
    }
  };

  // 📌 ฟังก์ชันลบรูปภาพที่เลือก
  const removeImage = (index: number) => {
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // 📌 ฟังก์ชันบันทึกข้อมูลสินค้า
  const handleSave = () => {
    if (!productData.name || !productData.price || !productData.stock || !productData.color || !productData.size) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    if (productData.images.length === 0) {
      alert("กรุณาอัปโหลดรูปภาพอย่างน้อย 1 รูป");
      return;
    }
    console.log("🚀 ข้อมูลสินค้าก่อนส่งออก:", productData);
    onSave(productData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="เพิ่มสินค้าใหม่">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* 🏷️ ชื่อสินค้า */}
        <div>
          <label className="block text-gray-700">ชื่อสินค้า</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* 🏷️ ราคา */}
        <div>
          <label className="block text-gray-700">ราคา (บาท)</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* 🏷️ จำนวนสินค้า */}
        <div>
          <label className="block text-gray-700">จำนวนสินค้าในสต็อก</label>
          <input
            type="number"
            name="stock"
            value={productData.stock}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* สถานะสินค้า(พร้อมขาย/ปิดการขาย) */}
        <div>
          <label className="block text-gray-700">สถานะสินค้า</label>
          <select
            name="status"
            value={productData.status}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          >
            <option value="available">พร้อมขาย</option>
            <option value="unavailable">ปิดการขาย</option>
          </select>
        </div>

        {/* 🎨 สี */}
        <div>
          <label className="block text-gray-700">สี</label>
          <input
            type="text"
            name="color"
            value={productData.color}
            onChange={handleChange}
            placeholder="เช่น ขาว, ดำ, น้ำเงิน"
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* 📏 ไซส์ */}
        <div>
          <label className="block text-gray-700">ไซส์</label>
          <input
            type="text"
            name="size"
            value={productData.size}
            onChange={handleChange}
            placeholder="เช่น S, M, L, XL"
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* 📝 รายละเอียดสินค้า */}
        <div className="col-span-2">
          <label className="block text-gray-700">รายละเอียดสินค้า</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="เช่น วัสดุที่ใช้, รอบอก, รอบเอว, ปีที่ผลิต ฯลฯ"
          />
        </div>
      </motion.div>

      {/* 🖼️ อัปโหลดรูปภาพ */}
      <div className="col-span-2">
          <label className="block text-gray-700">อัปโหลดรูปภาพสินค้า (สูงสุด 5 รูป)</label>
          <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-100 transition">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="upload-images"
            />
            <label htmlFor="upload-images" className="cursor-pointer flex flex-col items-center">
              <Upload className="w-10 h-10 text-gray-500" />
              <span className="text-gray-600">ลากและวาง หรือ คลิกเพื่อเลือกไฟล์</span>
            </label>
          </div>

          {/* Preview รูปภาพ */}
          <div className="mt-4 grid grid-cols-5 gap-2">
            {productData.images.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Product Preview"
                  className="w-20 h-20 object-cover rounded-md"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>


      {/* ปุ่มบันทึก */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSave}
        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition mt-4"
      >
        บันทึกสินค้า
      </motion.button>
    </Modal>
  );
}
