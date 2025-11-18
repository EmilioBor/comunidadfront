"use client";
import { useState } from "react";
import { useChat } from "@/hooks/useChat";

export default function Chat({ chatId, perfilId }) {
  const { messages, sendMessage } = useChat(chatId);
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim() === "") return;
    sendMessage(perfilId, text);
    setText("");
  };

  return (
    <div>
      <div className="messages">
        {messages.map((m, i) => (
          <p key={i}><b>{m.perfilId}:</b> {m.message}</p>
        ))}
      </div>

      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleSend}>Enviar</button>
    </div>
  );
}
