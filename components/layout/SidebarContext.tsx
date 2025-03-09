"use client";
import { createContext, useContext, useState, useEffect } from "react";

// ✅ สร้าง Context สำหรับ Sidebar
interface SidebarContextType {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [hydrated, setHydrated] = useState(false); // ✅ ป้องกัน Hydration Error

  // ✅ ใช้ useEffect โหลดค่า isOpen จาก localStorage หลังจากที่ Component ถูก Mount
  useEffect(() => {
    setHydrated(true);
    if (typeof window !== "undefined") {
      const storedIsOpen = localStorage.getItem("sidebarOpen");
      if (storedIsOpen !== null) {
        setIsOpen(storedIsOpen === "true");
      }
    }
  }, []);

  const toggleSidebar = () => {
    setIsOpen((prev) => {
      const newState = !prev;
      localStorage.setItem("sidebarOpen", newState.toString());
      return newState;
    });
  };

  if (!hydrated) return null; // ✅ รอให้ Hydration เสร็จก่อน

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

// ✅ ใช้ Hook `useSidebar()` ใน Component อื่นๆ
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar ต้องใช้ภายใน SidebarProvider");
  }
  return context;
}

