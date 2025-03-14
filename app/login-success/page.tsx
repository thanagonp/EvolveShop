"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthSuccess() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const authData = params.get("tgAuthResult");

    if (authData) {
      console.log("🔹 Telegram Auth Result:", authData);

      // ✅ ส่งค่าไป API Backend เพื่อ Verify
      fetch("/api/auth/telegram/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tgAuthResult: authData }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log("✅ Login Success:", data);
            router.replace("/customer/store");  // ✅ Redirect ไปหน้าสินค้า
          } else {
            console.error("❌ Login Failed:", data.message);
          }
        })
        .catch((err) => console.error("❌ API Error:", err));
    }
  }, [params]);

  return <p>🔄 กำลังดำเนินการเข้าสู่ระบบ...</p>;
}
