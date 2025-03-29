"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ConfirmPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const tempUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("tempTelegramUser") || "{}")
      : {};

  useEffect(() => {
    if (tempUser?.first_name) {
      setName(tempUser.first_name + (tempUser.last_name ? ` ${tempUser.last_name}` : ""));
    }
  }, []);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/telegram/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: tempUser.id,
          name,
          username: tempUser.username,
          photo_url: tempUser.photo_url,
        }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.removeItem("tempTelegramUser");
        localStorage.setItem("token", data.token);
        router.push(data.redirectUrl);
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error("❌ Confirm Error:", err);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center py-10 px-4 space-y-4">
      <h1 className="text-2xl font-bold">ยืนยันชื่อของคุณ</h1>
      <input
        type="text"
        className="p-2 border rounded w-full max-w-md"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        onClick={handleConfirm}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "กำลังบันทึก..." : "ยืนยันและเข้าสู่ระบบ"}
      </button>
    </main>
  );
}
