"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export default function TelegramLoginTest() {
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // 📌 ดึงข้อมูลจาก Telegram Auth URL
  const handleTelegramLogin = () => {
    const botUsername = "MyEvolveShop_bot"; // ✅ ใส่ชื่อบอทที่ลงทะเบียนกับ Telegram
    const authUrl = `https://oauth.telegram.org/auth?bot_id=${botUsername}&origin=${window.location.origin}&embed=1`;
    
    // ✅ Redirect ไปหน้า Login ของ Telegram
    window.open(authUrl, "_self");
  };

  // 📌 ดึงข้อมูลจาก Query String แล้วส่งไปยัง Webhook API
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    
    if (queryParams.has("id")) {
      axios.get(`${API_BASE_URL}/auth/telegram?${queryParams.toString()}`)
        .then((res) => {
          console.log("✅ Login Success:", res.data);
          setUserData(res.data.user);
        })
        .catch((err) => {
          console.error("❌ Login Failed:", err);
          setError("❌ ไม่สามารถเข้าสู่ระบบได้");
        });
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">🔑 Telegram Login Test</h1>
      
      {userData ? (
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <img
            src={userData.photo}
            alt="User Avatar"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <h2 className="text-lg font-semibold">{userData.name}</h2>
          <p className="text-gray-600">@{userData.username}</p>
        </div>
      ) : (
        <button
          onClick={handleTelegramLogin}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition"
        >
          🔐 Login with Telegram
        </button>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
