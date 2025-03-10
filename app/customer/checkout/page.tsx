'use client';
import { useCart } from '@/app/context/CartContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { API_BASE_URL } from '@/config';
import { motion } from 'framer-motion';

export default function Checkout() {
  const { cart, totalAmount, clearCart } = useCart();
  const router = useRouter();

  const [customer, setCustomer] = useState({ name: '', address: '', phone: '' });
  const [paymentSlip, setPaymentSlip] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentSlip) {
      alert('กรุณาแนบสลิปการชำระเงิน');
      return;
    }

    const formData = new FormData();
    formData.append("customer", JSON.stringify(customer));
    formData.append("items", JSON.stringify(cart));
    formData.append("totalAmount", totalAmount.toString());
    
    // แปลงไฟล์เป็น Blob ก่อนแนบ
    if (paymentSlip) {
        formData.append("paymentSlip", paymentSlip, paymentSlip.name);
    }
    

    try {
      const res = await axios.post(`${API_BASE_URL}/orders/addOrder`, formData);
      if (res.data.success) {
        clearCart();
        router.push('/customer/store');
      }
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการส่งข้อมูล');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] bg-gray-100 px-4">
    <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="w-full max-w-screen-md space-y-4 bg-white shadow-lg rounded-lg p-6 md:p-8"
    >
    <h2 className="text-2xl font-semibold text-center flex items-center justify-center gap-2">
      🛒 ยืนยันคำสั่งซื้อ
    </h2>

    <input
      className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 transition"
      placeholder="ชื่อผู้รับ"
      required
      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
    />

    <textarea
      className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 transition resize-none"
      placeholder="ที่อยู่ในการจัดส่ง"
      required
      rows={3}
      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
    ></textarea>

    <input
      className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 transition"
      placeholder="เบอร์โทรศัพท์"
      required
      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
    />

    <div className="flex flex-col">
      <label className="mb-1 font-medium">แนบสลิปการชำระเงิน</label>
      <input
        className="border p-2 rounded-lg cursor-pointer"
        type="file"
        required
        onChange={(e) => setPaymentSlip(e.target.files ? e.target.files[0] : null)}
      />
    </div>

    <div className="text-xl font-semibold text-right">ยอดรวม: {totalAmount} บาท</div>

    <button
      type="submit"
      className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition shadow-md"
    >
      ยืนยันการสั่งซื้อ
    </button>
  </motion.form>
</div>
  );
}