"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, X } from "lucide-react";

export default function ProductPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState("");

  const [productData, setProductData] = useState<{
    name: string;
    price: string;
    stock: string;
    attributes: Record<string, string>;
  }>({
    name: "",
    price: "",
    stock: "",
    attributes: {},
  });

  const categoryAttributes: Record<string, { name: string; label: string; type: string }[]> = {
    clothing: [
      { name: "color", label: "สี", type: "text" },
      { name: "size", label: "ไซส์", type: "text" },
      { name: "material", label: "วัสดุ", type: "text" },
    ],
    food: [
      { name: "weight", label: "น้ำหนัก (กรัม)", type: "number" },
      { name: "ingredients", label: "ส่วนประกอบ", type: "text" },
    ],
    electronics: [
      { name: "brand", label: "ยี่ห้อ", type: "text" },
      { name: "cpu", label: "CPU", type: "text" },
      { name: "ram", label: "RAM", type: "text" },
      { name: "storage", label: "ความจุ", type: "text" },
    ],
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleAttributeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductData((prev) => ({
      ...prev,
      attributes: { ...prev.attributes, [e.target.name]: e.target.value },
    }));
  };

  const closeModal = () => {
    setIsOpen(false);
    setCategory("");
    setProductData({ name: "", price: "", stock: "", attributes: {} });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">📦 รายการสินค้า</h1>
      <button
        onClick={() => setIsOpen(true)}
        className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        <PlusCircle className="w-5 h-5" />
        เพิ่มสินค้า
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg md:max-w-2xl relative"
          >
            {/* ปุ่มปิด Modal (แก้ไขตำแหน่ง) */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
            >
              <X className="w-6 h-6" />
            </button>
        
            <h2 className="text-xl font-semibold mb-4 text-center">เพิ่มสินค้าใหม่</h2>
        
            {/* Grid Layout ฟอร์ม */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        
              <div>
                <label className="block text-gray-700">หมวดหมู่</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">-- เลือกหมวดหมู่ --</option>
                  <option value="clothing">เสื้อผ้า</option>
                  <option value="food">อาหาร</option>
                  <option value="electronics">อุปกรณ์อิเล็กทรอนิกส์</option>
                </select>
              </div>
        
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
        
              {/* ฟิลด์ Dynamic */}
              {categoryAttributes[category as keyof typeof categoryAttributes]?.map((attr) => (
                <div key={attr.name}>
                  <label className="block text-gray-700">{attr.label}</label>
                  <input
                    type={attr.type}
                    name={attr.name}
                    value={productData.attributes[attr.name] || ""}
                    onChange={handleAttributeChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              ))}
            </div>
        
            {/* ปุ่มบันทึก */}
            <button
              onClick={() => alert(JSON.stringify(productData, null, 2))}
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition mt-4"
            >
              บันทึกสินค้า
            </button>
          </motion.div>
        </motion.div>         
        )}
      </AnimatePresence>
    </div>
  );
}
