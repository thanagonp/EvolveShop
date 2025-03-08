import "./globals.css";
import ToastProvider from "../components/toasts/ToastProvider";
import Sidebar from "../components/layout/Sidebar";
import { SidebarProvider } from "../components/layout/SidebarContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-gray-100 flex">
        <SidebarProvider>
          <Sidebar /> {/* ✅ Sidebar อยู่ภายใน Provider */}
          <div className="flex flex-1">
            <ToastProvider>{children}</ToastProvider>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
