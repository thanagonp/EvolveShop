"use client";
import { useState, useEffect,useRef } from "react";
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
import ConfirmAlert from "@/components/alerts/ConfirmAlert";
import { Product, EditableProduct } from "@/lib/types/interface";

export default function ProductPage() {
  
  const [isOpen, setIsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<EditableProduct | undefined>(undefined);
  const { showToast } = useToast();
  const isFetched = useRef(false); // ✅ ใช้ useRef ป้องกันโหลดซ้ำ
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  // 📌 ดึงข้อมูลสินค้าจาก API เมื่อโหลดหน้า
  useEffect(() => {
    if (!isFetched.current) {
      isFetched.current = true; // ✅ ป้องกัน API ถูกเรียกซ้ำ
      fetchProducts();
    }
  }, []);

  const fetchProducts = () => {
    axios.get(`${API_BASE_URL}/products/list`)
      .then((response) => setProducts([...response.data]))
      .catch((error) => console.error("❌ โหลดสินค้าล้มเหลว:", error));
  };

  const clearModal = () => {
    setIsOpen(false);
    setSelectedProduct(undefined);
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
  const handleSaveProduct = async (product: EditableProduct) => {
    try {
      console.log("🔍 Debug: ข้อมูลสินค้า", product);
  
      // ✅ รวมภาพเก่า + ภาพใหม่ก่อนเช็ค
      const oldImages = product.oldImages || [];
      const newImages = product.newImages || [];
      let uploadedImages = [...oldImages];
  
      console.log("🔍 Debug: รูปภาพเก่า", oldImages);
      console.log("🔍 Debug: รูปภาพใหม่", newImages);
  
      // ✅ ตรวจสอบว่ามีภาพอย่างน้อย 1 รูปหลังรวม oldImages + newImages
      if (oldImages.length === 0 && newImages.length === 0) {
        console.error("❌ กรุณาอัปโหลดรูปภาพอย่างน้อย 1 รูป");
        return;
      }
  
      // 📌 อัปโหลดรูปใหม่ไปยัง Cloudinary
      if (newImages.length > 0) {
        const newUploadedImages = await uploadImagesToCloudinary(newImages);
        console.log("✅ Debug: รูปที่อัปโหลดใหม่สำเร็จ", newUploadedImages);
        uploadedImages = [...uploadedImages, ...newUploadedImages]; // รวมภาพใหม่กับเก่า
      }
  
      // ✅ ตรวจสอบอีกครั้งหลังอัปโหลด
      if (uploadedImages.length === 0) {
        console.error("❌ อัปโหลดรูปภาพไม่สำเร็จ");
        return;
      }
  
      // ✅ เตรียมข้อมูลสินค้าใหม่
      const productData = {
        _id: product._id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        images: uploadedImages, // ✅ ใช้ภาพที่รวม oldImages + newImages แล้ว
        color: product.color,
        size: product.size,
        description: product.description,
        status: product.status || "available",
      };
  
      console.log("✅ อัปเดตสินค้า:", productData);
  
      // 🔹 เช็คว่าเป็น "เพิ่ม" หรือ "แก้ไข"
      if (product._id) {
        // 📌 อัปเดตสินค้า
        await axios.put(`${API_BASE_URL}/products/update/${product._id}`, productData, {
          headers: { "Content-Type": "application/json" },
        });
        showToast("อัปเดตสินค้าสำเร็จ", "success");
      } else {
        // 📌 เพิ่มสินค้าใหม่
        await axios.post(`${API_BASE_URL}/products/add`, productData, {
          headers: { "Content-Type": "application/json" },
        });
        showToast("เพิ่มสินค้าสำเร็จ", "success");
      }
      fetchProducts();

      clearModal();

    } catch (error) {
      console.error("❌ เกิดข้อผิดพลาด:", error);
    }
  };
  
  
  const handleEditProduct = async (product: Product) => {
     // ✅ อัปเดตค่า images ก่อนส่งไปให้ Modal
    axios.get(`${API_BASE_URL}/products/${product._id}`).then((response) => {
      setSelectedProduct({
        ...response.data, 
        oldImages: response.data.images || [],
        newImages: [],
      });
      setIsOpen(true);
    });
  };
  

  // 📌 เปิด Modal ยืนยันการลบสินค้า
const handleOpenDeleteModal = (productId: string) => {
  setDeleteProductId(productId);
  setIsDeleteOpen(true);
};

// 📌 ฟังก์ชันลบสินค้า
const handleDeleteProduct = async () => {
  if (!deleteProductId) return;

  try {
    await axios.delete(`${API_BASE_URL}/products/delete/${deleteProductId}`);
    setProducts(products.filter((product) => product._id !== deleteProductId));
    showToast("✅ ลบสินค้าสำเร็จ!", "success");
  } catch (error) {
    console.error("❌ ลบสินค้าล้มเหลว:", error);
    showToast("❌ ไม่สามารถลบสินค้าได้", "error");
  }

  setIsDeleteOpen(false); // ปิด Modal หลังจากลบสินค้า
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
      <AddProductModal
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
        setSelectedProduct(undefined); 
      }}
      onSave={handleSaveProduct}
      product={selectedProduct ?? undefined}
    />
  
      <div className="pt-4">
        <h1 className="text-3xl font-bold mb-6">🛍️ รายการสินค้า</h1>
  
        {/* 🔹 Grid Layout แสดงสินค้า */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative w-full max-w-xs h-64 rounded-lg overflow-hidden shadow-lg transition group bg-white"
            >
              {/* 🔹 รูปสินค้า */}
              <motion.div className="relative w-full h-full overflow-hidden">
                <CldImage
                  src={product.images[0]}
                  alt={product.name}
                  width={200}
                  height={200}
                  crop={{ type: "auto", source: true }}
                  className="w-full h-full object-cover transition-transform duration-300"
                  priority={true}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>

              {/* 🔹 ชื่อสินค้า */}
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-lg text-sm opacity-80">
                {product.name}
              </div>

               {/* 🔹 ปุ่ม Info (แสดงตลอด) */}
               <button
                onClick={() => {
                  setSelectedProduct({
                    ...product,
                    oldImages: product.images, // กำหนด oldImages จาก images ที่มีอยู่
                    newImages: [] // เริ่มต้นเป็นอาร์เรย์ว่าง
                  });
                  setIsInfoOpen(true);
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
                <button className="bg-gray-700/40 text-white p-3 rounded-full shadow-md hover:bg-gray-400/50"
                onClick={() => handleEditProduct(product)}>
                  <Edit size={20} />
                </button>
  
                {/* 🔹 Delete */}
                <button
                  className="bg-red-500 text-white p-3 rounded-full shadow-md hover:bg-red-600"
                  onClick={() => handleOpenDeleteModal(product._id)}
                >
                  <Trash size={20} />
                </button>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* 🏷️ ใช้ InfoModal แสดงรายละเอียดสินค้า */}
        {selectedProduct && (
          <InfoModal
            isOpen={isInfoOpen}
            onClose={() => { 
              setIsInfoOpen(false);
              setSelectedProduct(undefined) }}
            product={selectedProduct}
          />
        )}

        <ConfirmAlert
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDeleteProduct}
          title="ยืนยันการลบสินค้า"
          message="คุณแน่ใจหรือไม่ที่ต้องการลบสินค้านี้? การลบจะไม่สามารถกู้คืนได้"
        />

      </div>
    </div>
  );  
}
