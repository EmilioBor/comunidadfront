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
    <div className="bg-[#47C7C1] px-4 py-3 flex items-center gap-3">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        className="flex-1 px-4 py-2 rounded-full bg-white text-black text-sm outline-none"
        placeholder="Escribe tu mensaje..."
      />
      <button
        onClick={handleSend}
        className="bg-[#0B95FF] text-white px-6 py-2 rounded-full text-sm
                  hover:bg-blue-600 disabled:opacity-50"
        disabled={!text.trim()}
      >
        Enviar
      </button>
    </div>
  );
}
