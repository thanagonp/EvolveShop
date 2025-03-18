"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // ✅ ใช้ router สำหรับ redirect
import BaseModal from "@/components/ui/Modal";
import { motion } from "framer-motion";
import { API_BASE_URL } from "@/config";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  // ✅ ตรวจสอบว่า Telegram ส่ง `tgAuthResult` กลับมาแบบ Fragment (`#`)
  useEffect(() => {
    const hash = window.location.hash;
  
    if (hash.includes("tgAuthResult")) {
      const authData = hash.replace("#tgAuthResult=", "");
      console.log("🔹 Telegram Auth Result:", authData);
  
      localStorage.setItem("tgAuthResult", authData);
  
      fetch(`${API_BASE_URL}/api/auth/telegram/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tgAuthResult: authData }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log("✅ Login Success:", data);
  
            window.history.replaceState(null, "", window.location.pathname);
            router.replace("/customer/store");  // ✅ router อยู่ใน dependency array
          } else {
            console.error("❌ Login Failed:", data.message);
          }
        })
        .catch((err) => console.error("❌ API Error:", err));
    }
  }, [router]); // ✅ เพิ่ม router เข้าไปใน dependency array
  
  // ✅ ใช้ bot_id แทน bot_username
  const handleTelegramLogin = () => {
    console.log("🔍 API_BASE_URL:", API_BASE_URL);
    setIsLoggingIn(true);

    const botId = "7690060834"; 
    const origin = "https://48e6-171-7-23-248.ngrok-free.app";  
    const redirectUrl = `${origin}/api/auth/telegram/callback`;

    // ✨ เปลี่ยนจาก # เป็น ?
    const authUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&scope=profile&origin=${encodeURIComponent(origin)}&redirect_uri=${encodeURIComponent(redirectUrl)}&embed=1`;

    console.log("🔗 Redirecting to Telegram:", authUrl);
    console.log("📌 Expected redirect URI:", redirectUrl);
    window.location.href = authUrl;
};

  return (
    <BaseModal isOpen={isOpen} title="🔑 Login via Telegram" onClose={onClose}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center space-y-4"
      >
        <p className="text-lg font-semibold">โปรดกดปุ่มด้านล่างเพื่อ Login</p>

        {/* 🔹 ปุ่ม Login ผ่าน Telegram OAuth */}
        <button
          onClick={handleTelegramLogin}
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
        >
          🔑 Login with Telegram
        </button>

        {isLoggingIn && <p className="text-blue-500">⏳ กำลังเข้าสู่ระบบ...</p>}
      </motion.div>
    </BaseModal>
  );
}
