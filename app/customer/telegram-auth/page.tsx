"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export default function TelegramAuthPage() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.substring(1); // ตัด #
    const params = new URLSearchParams(hash);

    const userData: Partial<TelegramUser> = {};
    params.forEach((value, key) => {
      (userData as any)[key] = value;
    });

    if (!userData.id || !userData.hash) {
      alert("ไม่สามารถเข้าสู่ระบบได้");
      router.push("/customer/store");
      return;
    }

    // ✅ call API login
    fetch(`${API_BASE_URL}/auth/telegram/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (data.isNew) {
            localStorage.setItem("tempTelegramUser", JSON.stringify(data.tempUser));
          } else {
            localStorage.setItem("token", data.token);
          }
          router.push(data.redirectUrl);
        } else {
          alert("Login failed: " + data.message);
          router.push("/customer/store");
        }
      })
      .catch(() => {
        alert("เกิดข้อผิดพลาด");
        router.push("/customer/store");
      });
  }, [router]);

  return null;
}
