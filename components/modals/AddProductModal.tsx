"use client";
import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { motion } from "framer-motion";
import { Upload, XCircle } from "lucide-react";
import { useToast } from "@/components/toasts/useToast";
import axios from "axios";
import { API_BASE_URL } from "@/config";
import ConfirmAlert from "@/components/alerts/ConfirmAlert";
import { Product, EditableProduct } from "@/lib/types/interface";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void; // ✅ กำหนด type ที่ถูกต้อง
  product?: Product;
}

export default function AddProductModal({ isOpen, onClose, onSave, product }: AddProductModalProps) {

  const [productData, setProductData] = useState<EditableProduct>({
    _id: "",
    name: "",
    price: 0,
    stock: 0,
    color: "",
    size: "",
    description: "",
    images: [],
    oldImages: [], // ✅ ต้องมี oldImages
    newImages: [], // ✅ ต้องมี newImages
    status: "available",
  });
  const { showToast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<{ index: number, isOld: boolean } | null>(null);

  const confirmRemoveImage = (index: number, isOld: boolean) => {
    setImageToDelete({ index, isOld });
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!imageToDelete) return;
    await removeImage(imageToDelete.index, imageToDelete.isOld);
    setIsConfirmOpen(false);
  };

  useEffect(() => {
    if (product) {
      setProductData({
        _id: product._id || "",
        name: product.name || "",
        price: Number(product.price) || 0,
        stock: Number(product.stock) || 0,
        color: product.color || "",
        size: product.size || "",
        description: product.description || "",
        images: product.images || [], // ✅ เพิ่ม images ให้ครบ
        oldImages: product.images ? [...product.images] : [], 
        newImages: [],
        status: product.status || "available",
      });
    } else {
      setProductData({
        _id: "",
        name: "",
        price: 0,
        stock: 0,
        color: "",
        size: "",
        description: "",
        images: [], // ✅ ต้องมี field นี้
        oldImages: [],
        newImages: [],
        status: "available",
      });
    }
  }, [product]);
  
  
  // 📌 ฟังก์ชันจัดการการเปลี่ยนแปลงค่าในฟอร์ม
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  // 📌 ฟังก์ชันอัปโหลดรูปภาพ
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      if (productData.oldImages.length + productData.newImages.length + files.length > 5) {
        alert("สามารถอัปโหลดได้สูงสุด 5 รูปภาพเท่านั้น");
        return;
      }
      setProductData((prev) => ({
        ...prev,
        newImages: [...prev.newImages, ...Array.from(files)], // ✅ เก็บแค่รูปใหม่
      }));
    }
  };
  
  // 📌 ฟังก์ชันลบรูปภาพที่เลือก
  // 📌 ฟังก์ชันลบรูปภาพที่เลือก
const removeImage = async (index: number, isOld: boolean) => {
  // ✅ ตรวจสอบว่ามีรูปเหลือมากกว่า 1 รูปหรือไม่
  if (productData.oldImages.length + productData.newImages.length <= 1) {
    showToast("⚠️ ไม่สามารถลบรูปสุดท้ายได้", "warning");
    return;
  }

  if (isOld) {
    const imageUrl = productData.oldImages[index];
    const filename = imageUrl.split("/").pop()?.split(".")[0]; // ดึงเฉพาะชื่อไฟล์

    if (!filename) {
      showToast("❌ ไม่สามารถดึงชื่อไฟล์ได้", "error");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/products/delete-image`, {
        publicId: filename,
        productId: productData._id
      });

      if (response.status === 200) {
        showToast("✅ ลบภาพสำเร็จ", "success");

         // ✅ อัปเดตรูปภาพหลังจากลบสำเร็จ
         setProductData((prev) => {
          const updatedOldImages = prev.oldImages.filter((_, i) => i !== index);
          return { ...prev, oldImages: updatedOldImages };
        });
      } else {
        showToast("❌ ลบภาพไม่สำเร็จ", "error");
      }
    } catch (error) {
      console.error("❌ API ลบภาพล้มเหลว:", error);
      showToast("❌ เกิดข้อผิดพลาดในการลบรูป", "error");
    }
  } else {
    setProductData((prev) => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index),
    }));
    showToast("✅ ลบภาพใหม่สำเร็จ", "success");
  }
};

  // 📌 ฟังก์ชันบันทึกข้อมูลสินค้า
  const handleSave = () => {
    if (!productData.name || !productData.price || !productData.stock) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
  
    if (productData.oldImages.length + productData.newImages.length === 0) {
      alert("กรุณาอัปโหลดรูปภาพอย่างน้อย 1 รูป");
      return;
    }
  
    // ✅ ส่งทั้ง oldImages (URL) และ newImages (ไฟล์) ไปที่ onSave
    const updatedProduct: EditableProduct = {
      ...productData,
      oldImages: [...productData.oldImages],
      newImages: [...productData.newImages],
    };
  
    onSave(updatedProduct);
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
            autoComplete="off"
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
            autoComplete="off"
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
            autoComplete="off"
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
            autoComplete="off"
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
            autoComplete="off"
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
            autoComplete="off"
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
           {/* 🔹 แสดงรูปภาพเดิม */}
            {productData.oldImages.map((url, index) => (
              <div key={`old-${index}`} className="relative group">
                <img src={url} alt="Product Image" className="w-20 h-20 object-cover rounded-md" />
                <button
                  onClick={() => confirmRemoveImage(index, true)} // ✅ ใช้ removeImage ฟังก์ชันเดียว
                  className="absolute top-0 right-0 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* 🔹 แสดงรูปที่อัปโหลดใหม่ */}
            {productData.newImages.map((file, index) => (
              <div key={`new-${index}`} className="relative group">
                <img src={URL.createObjectURL(file)} alt="New Product Image" className="w-20 h-20 object-cover rounded-md" />
                <button
                  onClick={() => confirmRemoveImage(index, true)} // ✅ ใช้ removeImage ฟังก์ชันเดียว
                  className="absolute top-0 right-0 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <ConfirmAlert
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
          title="ยืนยันการลบรูป"
          message="คุณแน่ใจหรือไม่ว่าต้องการลบรูปนี้? การลบรูปจะไม่สามารถกู้คืนได้"
        />



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
