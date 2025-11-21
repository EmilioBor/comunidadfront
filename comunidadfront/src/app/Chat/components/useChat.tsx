"use client";

import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { GetUserByPerfil } from "@/app/lib/api/perfil";

export interface ChatMessage {
  id: number;
  contenido: string;
  fechaHora: string;
  perfilNombre: string;
  soyYo: boolean;
}

interface PerfilType {
  id: number;
  cuitCuil: number;
  razonSocial: string;
  descripcion: string;
  cbu: number;
  alias: string;
  usuarioIdUsuario: number;
  localidadIdLocalidad: number;
  imagen: string;
}

interface ChatInfo {
  id: number;
  nombrePerfilidPerfil: string; // emisor
  nombreReceptorIdReceptor: string; // receptor
}

interface UseChatOptions {
  id: number;
  perfilNombre: string; // usuario logueado
  enabled?: boolean;
}

export function useChat({ id, perfilNombre, enabled = true }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInfo, setChatInfo] = useState<ChatInfo | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [perfil, setPerfil] = useState<PerfilType | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  // 1️⃣ Cargar info del chat
  useEffect(() => {
    if (!enabled) return;

    const loadChatInfo = async () => {
      try {
        



        const res = await fetch(`https://localhost:7168/api/Chat/api/v1/chat/id/${id}`);
        if (!res.ok) throw new Error("No se pudo obtener la info del chat");
        const data: ChatInfo = await res.json();
        setChatInfo(data);
      } catch (err) {
        console.error("Error cargando info del chat:", err);
      }
    };

    loadChatInfo();
  }, [id, enabled]);

  // 2️⃣ Cargar historial de mensajes
  useEffect(() => {
    if (!enabled || !chatInfo) return;

    const loadMessages = async () => {
      try {
        const res = await fetch(`https://localhost:7168/api/Mensaje/api/v1/mensajes/chat/${id}`);
        if (!res.ok) throw new Error("No se pudo cargar mensajes");
        let data = await res.json();

        data = data.sort(
          (a: any, b: any) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()
        );

        setMessages(
          data.map((m: any) => ({
            id: m.id,
            contenido: m.contenido,
            fechaHora: m.fechaHora,
            perfilNombre: m.nombrePerfilIdPerfil,
            soyYo: m.nombrePerfilIdPerfil === perfilNombre,
          }))
        );
      } catch (err) {
        console.error("Error cargando mensajes:", err);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [id, enabled, chatInfo, perfilNombre]);

  // 3️⃣ Conexión SignalR
  useEffect(() => {
    if (!enabled) return;

    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7168/chatHub?chatId=${id}`)
      .withAutomaticReconnect()
      .build();

    conn.start()
      .then(() => console.log("Conectado al Hub", id))
      .catch(err => console.error("Error conectando al Hub:", err));

    conn.on("ReceiveMessage", (autorNombre: string, contenido: string) => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          contenido,
          fechaHora: new Date().toISOString(),
          perfilNombre: autorNombre,
          soyYo: autorNombre === perfilNombre,
        },
      ]);
    });

    setConnection(conn);

    return () => {
      conn.off("ReceiveMessage");
      conn.stop();
    };
  }, [id, enabled, perfilNombre]);

  // 4️⃣ Autoscroll
  useEffect(() => {
    if (!enabled) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, enabled]);

  // 5️⃣ Enviar mensaje
const sendMessage = async (texto: string) => {
  if (!enabled || !texto.trim()) return;

  if (!connection || connection.state !== signalR.HubConnectionState.Connected) {
    console.error("No hay conexión activa al Hub");
    return;
  }

  try {

     const me = await fetch("/api/user/me").then((r) => r.json());
        console.log("📊 Datos del usuario logueado:", me);

        
        // Guardar el ID del usuario logueado - ESTE ES EL ID CORRECTO
        setUserId(me.id);
        console.log("🔑 ID del usuario logueado:", me.id);
        
        const perfilData = await GetUserByPerfil(me.id);
        console.log("📄 Datos del perfil:", perfilData);

        setPerfil(perfilData);



    const body = {
      contenido: texto,
      fechaHora: new Date().toISOString(),
      chatIdChat: id,           // ✅ chatId correcto
      perfilIdPerfil: perfilData?.id, // ✅ ID del perfil logueado (no el nombre)
    };
    console.log("Enviando mensaje con body:", body);
    // Guardar en DB
    const res = await fetch("https://localhost:7168/api/Mensaje/api/v1/agrega/mensaje", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error("Error guardando mensaje en la DB");

    if (!perfil?.id) {
      console.error("No se puede enviar mensaje: perfil.id no definido");
      return;
    }
    await connection.invoke("SendMessage", id, perfilData.id, texto);
  } catch (err) {
    console.error("Error al enviar mensaje:", err);
  }
};


  return { messages, sendMessage, loadingMessages, bottomRef };
}
