"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import BaseModal from "@/components/ui/Modal";
import { motion } from "framer-motion";

const BOT_USERNAME = "MyEvolveShopBot"; // ✅ Telegram Bot Username
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // ✅ ใช้ ENV แบบ runtime

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const widgetContainerRef = useRef<HTMLDivElement>(null); // ✅ ใช้ ref สำหรับ Widget

  useEffect(() => {
    if (isOpen && widgetContainerRef.current) {
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-widget.js?14";
      script.setAttribute("data-telegram-login", BOT_USERNAME);
      script.setAttribute("data-size", "large");
      script.setAttribute("data-auth-url", `${API_BASE_URL}/api/auth/telegram/login`);
      script.setAttribute("data-request-access", "write");
      script.async = true;
      widgetContainerRef.current.innerHTML = ""; // ✅ ล้างก่อนป้องกันซ้ำซ้อน
      widgetContainerRef.current.appendChild(script);
    }
  }, [isOpen]);

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

        {/* ✅ ใช้ ref แทน dangerouslySetInnerHTML */}
        <div ref={widgetContainerRef} className="flex justify-center"></div>
      </motion.div>
    </BaseModal>
  );
}
