"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import BaseModal from "@/components/ui/Modal";
import { motion } from "framer-motion";

const BOT_USERNAME = "MyEvolveShopBot";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ✅ Telegram user type จาก Telegram Login Widget docs
interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const widgetContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && widgetContainerRef.current) {
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-widget.js?14";
      script.setAttribute("data-telegram-login", BOT_USERNAME);
      script.setAttribute("data-size", "large");
      script.setAttribute("data-userpic", "false");
      script.setAttribute("data-request-access", "write");
      script.setAttribute("data-on-auth", "onTelegramAuth");
      script.async = true;

      widgetContainerRef.current.innerHTML = "";
      widgetContainerRef.current.appendChild(script);

      // ✅ เพิ่ม handler ที่ปลอดภัยสำหรับ TypeScript
      (window as unknown as { onTelegramAuth: (user: TelegramUser) => void }).onTelegramAuth =
        async (user: TelegramUser) => {
          try {
            const res = await fetch(`${API_BASE_URL}/api/auth/telegram/login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(user),
            });

            const data = await res.json();

            if (data.success) {
              localStorage.setItem("token", data.token); // ✅ บันทึก token
              router.push(data.redirectUrl); // ✅ ไปหน้าร้าน
            } else {
              alert("❌ Login failed: " + data.message);
            }
          } catch (err) {
            console.error("❌ Telegram login error:", err);
            alert("เกิดข้อผิดพลาดระหว่าง login");
          }
        };
    }
  }, [isOpen, router]);

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
        <div ref={widgetContainerRef} className="flex justify-center"></div>
      </motion.div>
    </BaseModal>
  );
}
