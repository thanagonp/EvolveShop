'use client'
import { useState } from "react";
//import { motion } from "framer-motion";

export default function ChatComponent() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const sendMessage = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setResponse(data.reply);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">AI Chat</h2>
      <textarea
        className="w-full p-2 border rounded"
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={sendMessage}
      >
        Send
      </button>
      {response && <p className="mt-4 p-2 border">{response}</p>}
      
      
    </div>
  );
}
