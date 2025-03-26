"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { User as UserIcon } from "lucide-react";

interface Customer {
  name: string;
  username: string;
  photo?: string;
}

export default function Navbar() {
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          setCustomer(res.data.user);
        }
      } catch (err) {
        console.error("❌ Failed to fetch user info:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white border-b border-gray-300 shadow-md flex justify-between items-center px-6 z-50">
      <h1 className="text-lg font-bold">ระบบจัดการร้าน</h1>

      <div className="flex items-center gap-2">
        {customer ? (
          <div className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-gray-50">
            {customer.photo && (
              <img src={customer.photo} alt="Profile" className="w-6 h-6 rounded-full" />
            )}
            <span className="text-sm font-medium">{customer.username}</span>
          </div>
        ) : (
          <button className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-100">
            <UserIcon className="w-5 h-5" />
            <span>บัญชี</span>
          </button>
        )}
      </div>
    </header>
  );
}
