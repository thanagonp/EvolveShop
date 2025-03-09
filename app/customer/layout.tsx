"use client";
import CustomerNavbar from "@/components/layout/CustomerNavbar";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <CustomerNavbar /> {/* ✅ ใช้ Navbar ใหม่ของลูกค้า */}
      <main className="pt-20 p-4">{children}</main> {/* ✅ เพิ่ม `pt-20` กันเนื้อหาถูกบัง */}
    </div>
  );
}
