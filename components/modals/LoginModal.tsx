"use client";

import { useEffect, useRef, useState } from "react";
import BaseModal from "@/components/ui/Modal";
import { motion } from "framer-motion";

const BOT_USERNAME = "MyEvolveShop_bot";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

// ✅ ใช้ type safe แบบนี้ แทน any
declare global {
  interface Window {
    [key: string]: (user: TelegramUser) => void;
  }
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    if (!isOpen || !widgetRef.current || isMobile) return;

    const container = widgetRef.current;
    container.innerHTML = "";

    const callbackName = "tgAuthCallback_" + Math.random().toString(36).substring(2, 9);

    window[callbackName] = async (user: TelegramUser) => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/telegram/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });

        const data = await res.json();

        if (data.success) {
          if (data.isNew) {
            localStorage.setItem("tempTelegramUser", JSON.stringify(data.tempUser));
          } else {
            localStorage.setItem("token", data.token);
          }

          onClose();
          window.location.href = data.redirectUrl;
        } else {
          alert("Login failed: " + data.message);
        }
      } catch (err) {
        console.error("Telegram login error:", err);
        alert("เกิดข้อผิดพลาดระหว่าง login");
      }
    };

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?14";
    script.async = true;
    script.setAttribute("data-telegram-login", BOT_USERNAME);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-userpic", "false");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-onauth", `${callbackName}(user)`);

    container.appendChild(script);

    return () => {
      delete window[callbackName];
    };
  }, [isOpen, onClose, isMobile]);

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

        {isMobile ? (
          <a
            href={`https://t.me/${BOT_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            📲 เปิดแชทผ่าน Telegram
          </a>
        ) : (
          <div ref={widgetRef} className="flex justify-center" />
        )}
      </motion.div>
    </BaseModal>
  );
}
