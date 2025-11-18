import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

export function useChat(chatId) {
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:5001/chatHub?chatId=${chatId}`)
      .withAutomaticReconnect()
      .build();

    conn.start().then(() => {
      console.log("Conectado al chat");
    });

    conn.on("ReceiveMessage", (perfilId, message) => {
      setMessages(prev => [...prev, { perfilId, message }]);
    });

    setConnection(conn);

    return () => conn.stop();
  }, [chatId]);

  const sendMessage = async (perfilId, message) => {
    await connection.invoke("SendMessage", chatId, perfilId, message);
  };

  return { messages, sendMessage };
}
