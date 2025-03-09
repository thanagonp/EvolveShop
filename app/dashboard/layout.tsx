"use client";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { SidebarProvider } from "@/components/layout/SidebarContext";
import { useSidebar } from "@/components/layout/SidebarContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* ✅ Sidebar อยู่ที่นี่ */}
        <Sidebar />

        {/* ✅ Wrapper สำหรับ Content */}
        <ContentWrapper>{children}</ContentWrapper>
      </div>
    </SidebarProvider>
  );
}

// ✅ สร้าง Component ใหม่ เพื่อใช้ `isOpen`
function ContentWrapper({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar(); // ใช้ isOpen จาก Context
  return (
    <div className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ${
      isOpen ? "ml-[200px]" : "ml-[60px]"
    }`}>
      <Navbar />
      <main className="flex-1 p-6 pt-16">{children}</main>
    </div>
  );
}
