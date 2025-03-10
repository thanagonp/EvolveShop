import "./globals.css";
import ToastProvider from "../components/toasts/ToastProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-gray-100 flex">
          <div className="flex flex-1">
            <ToastProvider>{children}</ToastProvider>
          </div>
      </body>
    </html>
  );
}
