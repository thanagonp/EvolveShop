// app/customer/telegram-auth/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function TelegramAuthPage() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.substring(1); // ลบ #
    const params = new URLSearchParams(hash);
    const userData: any = {};
    params.forEach((value, key) => {
      userData[key] = value;
    });

    if (!userData.id || !userData.hash) {
      alert("ไม่สามารถเข้าสู่ระบบได้");
      router.push("/customer/store");
      return;
    }

    // call API
    fetch(`${API_BASE_URL}/auth/telegram/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.isNew) {
            localStorage.setItem("tempTelegramUser", JSON.stringify(data.tempUser));
          } else {
            localStorage.setItem("token", data.token);
          }
          router.push(data.redirectUrl);
        } else {
          alert("Login ผิดพลาด: " + data.message);
          router.push("/customer/store");
        }
      })
      .catch(() => {
        alert("เกิดข้อผิดพลาด");
        router.push("/customer/store");
      });
  }, [router]);

  return <p className="p-6 text-center">⏳ กำลังเข้าสู่ระบบผ่าน Telegram...</p>;
}
