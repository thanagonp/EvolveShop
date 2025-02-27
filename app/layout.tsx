import "./globals.css";
import ToastProvider from "@/components/toasts/ToastProvider";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-gray-100">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
