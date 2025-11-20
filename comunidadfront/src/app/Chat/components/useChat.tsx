"use client";

import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";

// Estructura de un mensaje de chat
export interface ChatMessage {
  id: number;
  contenido: string;
  fechaHora: string;
  nombreChatIdChat: string;      // Nombre del chat
  nombrePerfilIdPerfil: string;  // Autor del mensaje
  soyYo?: boolean;               // Si es del usuario logueado
}

// Props que recibe el hook
interface UseChatOptions {
  id: number;               
  nombrePerfilIdPerfil: string | null; 
}

export function useChat({ id, nombrePerfilIdPerfil }: UseChatOptions) {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // -----------------------------
  // 1️⃣ Cargar historial de mensajes desde la API
  // -----------------------------
  useEffect(() => {
    if (!id || !nombrePerfilIdPerfil) return;

    const loadMessages = async () => {
      try {
        const res = await fetch(
          `https://localhost:7168/api/Mensaje/api/v1/mensajes/chat/${id}`
        );
        if (!res.ok) throw new Error("Error al cargar mensajes");

        const data = await res.json();

        const mapped: ChatMessage[] = data.map((m: any) => ({
          id: m.id,
          contenido: m.contenido,
          fechaHora: m.fechaHora,
          nombreChatIdChat: m.nombreChatIdChat,
          nombrePerfilIdPerfil: m.nombrePerfilIdPerfil,
          soyYo: m.nombrePerfilIdPerfil === nombrePerfilIdPerfil,
        }));

        setMessages(mapped);
      } catch (err) {
        console.error("Error cargando mensajes:", err);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [id, nombrePerfilIdPerfil]);

  // -----------------------------
  // 2️⃣ Conexión a SignalR
  // -----------------------------
  useEffect(() => {
    if (!id || !nombrePerfilIdPerfil) return;

    let conn: signalR.HubConnection | null = null;

    const connectSignalR = async () => {
      conn = new signalR.HubConnectionBuilder()
        .withUrl(`https://localhost:7168/chatHub?chatId=${id}`)
        .withAutomaticReconnect()
        .build();

      try {
        await conn.start();
        console.log("Conectado al chat", id);

        conn.on("ReceiveMessage", (nombreAutor: string, contenido: string) => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              contenido,
              fechaHora: new Date().toISOString(),
              nombreChatIdChat: "",
              nombrePerfilIdPerfil: nombreAutor,
              soyYo: nombreAutor === nombrePerfilIdPerfil,
            },
          ]);
        });

        setConnection(conn);
      } catch (err) {
        console.error("Error en SignalR:", err);
      }
    };

    connectSignalR();

    return () => {
      if (conn) {
        conn.stop().catch((err) => console.error("Error stopping SignalR:", err));
      } else if (connection) {
        connection.stop().catch((err) => console.error("Error stopping SignalR:", err));
      }
    };
  }, [id, nombrePerfilIdPerfil]);

  // -----------------------------
  // 3️⃣ Autoscroll al último mensaje
  // -----------------------------
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // -----------------------------
  // 4️⃣ Función para enviar mensaje
  // -----------------------------
  const sendMessage = async (texto: string) => {
    if (!texto.trim() || !nombrePerfilIdPerfil) return;

    const mensajeLocal: ChatMessage = {
      id: Date.now(),
      contenido: texto,
      fechaHora: new Date().toISOString(),
      nombreChatIdChat: "",
      nombrePerfilIdPerfil: nombrePerfilIdPerfil,
      soyYo: true,
    };
    setMessages((prev) => [...prev, mensajeLocal]);

    try {
      const body = {
        id: 0,
        contenido: texto,
        fechaHora: new Date().toISOString(),
        chatIdChat: id,
        perfilIdPerfil: 0,
      };

      const res = await fetch(
        "https://localhost:7168/api/Mensaje/api/v1/agrega/mensaje",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) throw new Error("Error enviando mensaje");

      const saved = await res.json();

      setMessages((prev) =>
        prev.map((m) =>
          m.id === mensajeLocal.id
            ? { ...m, id: saved.id, fechaHora: saved.fechaHora }
            : m
        )
      );

      await connection?.invoke("SendMessage", nombrePerfilIdPerfil, texto);
    } catch (err) {
      console.error("Error sendMessage:", err);
    }
  };

  // -----------------------------
  // 5️⃣ Retorno del hook
  // -----------------------------
  return {
    messages,
    sendMessage,
    loadingMessages,
    bottomRef,
  };
}
