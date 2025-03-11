"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { API_BASE_URL } from "@/config";
import { CldImage } from "next-cloudinary";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { useToast } from "@/components/toasts/useToast";

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

export default function ProductPage() {
  const { id } = useParams(); // ดึง `id` จาก URL
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  const router = useRouter(); // ✅ ใช้ useRouter
  const { addToCart } = useCart(); // ✅ ใช้ useCart
  const { showToast } = useToast();

if (!showToast) {
  console.error("❌ ไม่พบฟังก์ชัน showToast, ตรวจสอบการใช้ ToastProvider");
}


  // ✅ ฟังก์ชันกลับไปที่หน้า /store
  const goToStore = () => {
    router.push("/customer/store");
  };

  // ✅ ฟังก์ชันเพิ่มสินค้าลงตะกร้า
  // ✅ ฟังก์ชันเพิ่มสินค้าลงตะกร้า
const handleAddToCart = async () => {
  if (!product) return; // ✅ ป้องกัน product เป็น null

  try {
    // 📌 ตรวจสอบสต็อกจาก API ก่อนเพิ่มลงตะกร้า
    const response = await axios.get(`${API_BASE_URL}/products/${product._id}/stock`);
    const availableStock = response.data.stock;

    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      stock: availableStock, // ✅ ส่งค่า stock ไปด้วย
      image: product.images?.[0] || "", // ✅ ป้องกัน images เป็น undefined
      quantity: 1,
    });

    setAdded(true); // ✅ เปลี่ยนปุ่มเป็น "เพิ่มแล้ว!"

    setTimeout(() => {
      setAdded(false);
    }, 2000); // ✅ กำหนดเวลาให้ปุ่มกลับเป็นปกติ

  } catch (error) {
    console.error("❌ ไม่สามารถดึงข้อมูลสต็อก:", error);
    showToast("❌ ไม่สามารถเพิ่มสินค้าได้", "error"); // ✅ แจ้งเตือนเมื่อเกิดปัญหา
  }
};


  useEffect(() => {
    if (!id) return;

    axios
      .get(`${API_BASE_URL}/products/${id}`)
      .then((response) => {
        console.log("✅ ได้ข้อมูลสินค้า:", response.data);
        setProduct(response.data);
      })
      .catch((err) => {
        console.error("❌ โหลดสินค้าล้มเหลว:", err);
        setError("ไม่พบสินค้าที่คุณกำลังค้นหา");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center py-10">⏳ กำลังโหลดข้อมูลสินค้า...</p>;
  if (error)
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-red-500">{error}</h2>
        <p className="text-gray-600">โปรดตรวจสอบรหัสสินค้า หรือกลับไปยังหน้าร้านค้า</p>
      </div>
    );

  if (!product) return <p className="text-center py-10">❌ ไม่พบข้อมูลสินค้า</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* แสดงรูปสินค้า */}
        <div>
          <CldImage
            src={product.images[0]}
            alt={product.name}
            width={500}
            height={500}
            className="w-full h-auto object-cover rounded-lg"
          />
          {/* แสดงรูปภาพเพิ่มเติม */}
          <div className="flex gap-2 mt-4">
            {product.images.slice(1).map((img: string, index: number) => (
              <CldImage
                key={index}
                src={img}
                alt={`รูปภาพที่ ${index + 1}`}
                width={100}
                height={100}
                className="w-20 h-20 object-cover rounded-md cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* แสดงรายละเอียดสินค้า */}
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>

          {/* ราคา */}
          <p className="text-xl font-bold mt-4">{product.price} บาท</p>

          {/* สีสินค้า */}
          {product.color?.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold">สีที่มี:</p>
              <div className="flex gap-2 mt-1">
                {product.color.map((color: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-gray-200 rounded-lg text-sm">
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ขนาดสินค้า */}
          {product.size?.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold">ขนาดที่มี:</p>
              <div className="flex gap-2 mt-1">
                {product.size.map((size: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-gray-200 rounded-lg text-sm">
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ปุ่มเพิ่มลงตะกร้า */}
          <button 
            onClick={handleAddToCart}
            className={`mt-6 px-4 py-2 text-white rounded-lg w-full 
              ${added ? "bg-green-500 cursor-default" : "bg-blue-500 cursor-pointer"}`}
            disabled={added} // ✅ ป้องกันการกดซ้ำ
          >
            {added ? "✔️ เพิ่มแล้ว!" : "เพิ่มลงตะกร้า"}
          </button>

           {/* ✅ ปุ่มกลับไปหน้าหลัก */}
           <button
            onClick={goToStore}
            className="mt-4 px-4 py-2 bg-gray-300 text-black rounded-lg w-full"
          >
            กลับไปหน้าสินค้าทั้งหมด
          </button>
        </div>
      </div>
    </div>
  );
}
