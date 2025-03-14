"use client";

import { useState } from "react";

export default function CustomerLogin() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button 
        className="bg-blue-500 text-white p-2 rounded"
        onClick={() => setShowModal(true)}
      >
        Login with Telegram
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold text-center mb-4">🔑 Login via Telegram</h2>
            <script async src="https://telegram.org/js/telegram-widget.js?15"
              data-telegram-login="YOUR_TELEGRAM_BOT"
              data-size="large"
              data-auth-url="https://yourwebsite.com/api/auth/telegram"
              data-request-access="write">
            </script>
            <button 
              className="mt-4 bg-red-500 text-white p-2 rounded w-full"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
