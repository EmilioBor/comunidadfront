"use client";

import { useState } from "react";

export default function ChatInput({ onSend }: any) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="p-4 border-t bg-white flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 bg-gray-100 p-3 rounded-full outline-none"
        placeholder="Escribe un mensaje..."
      />

      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600"
      >
        Enviar
      </button>
    </div>
  );
}
