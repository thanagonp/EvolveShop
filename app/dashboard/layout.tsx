"use client";

import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { useSidebar } from "@/components/layout/SidebarContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar();

  return (
    <div className="flex min-h-screen">
      {/* ✅ Fixed Sidebar */}
      <Sidebar />

      {/* ✅ Wrapper สำหรับ Content */}
      <div className="flex flex-col flex-1 min-h-screen">
        <Navbar /> {/* ✅ แยก Navbar ออกจาก Sidebar */}
        <main className={`flex-1 p-6 pt-16 transition-all duration-300 ${isOpen ? "ml-[200px]" : "ml-[60px]"}`}>
        {children}
      </main>
      </div>
    </div>
  );
}
