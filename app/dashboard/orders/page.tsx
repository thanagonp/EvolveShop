"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config";
import { motion } from "framer-motion";
import { CheckCircle, Eye, Truck, XCircle, MapPin, Phone, DollarSign, User } from "lucide-react";
import { Order, OrderStatus } from "@/lib/types/interface";
import BaseModal from "@/components/ui/Modal";
import Image from "next/image";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [trackingNumber, setTrackingNumber] = useState<{ [key: string]: string }>({});
  const [selectedSlip, setSelectedSlip] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  // 📌 ดึงรายการออเดอร์
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/list`);
      setOrders(response.data.orders);
    } catch (error) {
      console.error("❌ โหลดออเดอร์ล้มเหลว:", error);
    }
  };

  // 📌 ยืนยันออเดอร์
  const handleConfirmOrder = async (orderId: string) => {
    try {
      await axios.put(`${API_BASE_URL}/orders/${orderId}/status`, { status: OrderStatus.Confirmed });
      fetchOrders();
    } catch (error) {
      console.error("❌ อัปเดตสถานะล้มเหลว:", error);
    }
  };

  // 📌 จัดส่งออเดอร์ (พร้อม Tracking Number)
  const handleShipOrder = async (orderId: string) => {
    if (!trackingNumber[orderId]) {
      alert("กรุณากรอกเลข Tracking Number");
      return;
    }
    try {
      await axios.put(`${API_BASE_URL}/orders/${orderId}/status`, {
        status: OrderStatus.Shipped,
        trackingNumber: trackingNumber[orderId],
      });
      fetchOrders();
    } catch (error) {
      console.error("❌ อัปเดตสถานะล้มเหลว:", error);
    }
  };

  // 📌 ยกเลิกออเดอร์
  const handleCancelOrder = async (orderId: string) => {
    try {
      await axios.put(`${API_BASE_URL}/orders/${orderId}/status`, { status: OrderStatus.Cancelled });
      fetchOrders();
    } catch (error) {
      console.error("❌ อัปเดตสถานะล้มเหลว:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">📦 รายการออเดอร์</h1>

      {/* ✅ Grid Card Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {orders.map((order, index) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="p-6 bg-white shadow-lg rounded-xl border border-gray-200"
          >
            <div className="flex flex-col gap-3">
              <p className="flex items-center gap-2">
                <User size={18} className="text-gray-600" />
                <strong>ลูกค้า:</strong> {order.customer.name}
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={18} className="text-gray-600" />
                <strong>ที่อยู่:</strong> {order.customer.address}
              </p>
              <p className="flex items-center gap-2">
                <Phone size={18} className="text-gray-600" />
                <strong>โทร:</strong> {order.customer.phone}
              </p>
              <p className="flex items-center gap-2">
                <DollarSign size={18} className="text-gray-600" />
                <strong>ยอดรวม:</strong> {order.totalAmount} บาท
              </p>

              {/* 🔹 สถานะออเดอร์ */}
              <p>
                🚀 <strong>สถานะ:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded-md text-white ml-2 ${
                    order.status === OrderStatus.Pending
                      ? "bg-yellow-500"
                      : order.status === OrderStatus.Confirmed
                      ? "bg-blue-500"
                      : order.status === OrderStatus.Shipped
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {order.status}
                </span>
              </p>

              {order.status === OrderStatus.Shipped && (
                <p>📦 <strong>Tracking:</strong> {order.trackingNumber}</p>
              )}

              
              {/* 🔹 ปุ่มต่าง ๆ */}
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <button
                  onClick={() => setSelectedSlip(order.paymentSlip)}
                  className="flex items-center gap-2 text-blue-500 hover:underline"
                >
                  <Eye size={18} /> ดูสลิป
                </button>

                {order.status === OrderStatus.Pending && (
                  <button
                    onClick={() => handleConfirmOrder(order._id)}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
                  >
                    <CheckCircle size={20} /> ยืนยันออเดอร์
                  </button>
                )}

                {order.status === OrderStatus.Confirmed && (
                  <div className="flex flex-wrap gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Tracking Number"
                      value={trackingNumber[order._id] || ""}
                      onChange={(e) => setTrackingNumber({ ...trackingNumber, [order._id]: e.target.value })}
                      className="border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                      onClick={() => handleShipOrder(order._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
                    >
                      <Truck size={20} /> จัดส่ง
                    </button>
                  </div>
                )}

                {order.status !== OrderStatus.Shipped && (
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
                  >
                    <XCircle size={20} /> ยกเลิก
                  </button>
                )}
              </div>

            </div>
          </motion.div>
        ))}
      </div>

      {/* 🔹 Modal แสดงภาพสลิป */}
      <BaseModal 
        isOpen={!!selectedSlip} 
        title="สลิปการชำระเงิน" 
        onClose={() => setSelectedSlip(null)}
      >
        <div className="relative flex justify-center items-center max-w-xl mx-auto p-4">
          <button 
            onClick={() => setSelectedSlip(null)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            ❌
          </button>
          {selectedSlip && (
            <Image 
              src={selectedSlip} 
              alt="Payment Slip" 
              className="rounded-lg max-w-full max-h-[80vh] object-contain"
              width={500}
              height={500} 
            />
          )}
        </div>
      </BaseModal>
    </div>
  );
}
