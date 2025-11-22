"use client";

import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { GetUserByPerfil } from "@/app/lib/api/perfil";
import { postNotificacion } from "@/app/lib/api/notificacionApi";
import { obtenerPerfilNombre, obtenerPublicacionNombre } from "@/app/Chat/action";

export interface ChatMessage {
  id: number;
  contenido: string;
  fechaHora: string;
  perfilIdPerfil: number;
  perfilNombre: string;
  soyYo: boolean;
}

interface PerfilType {
  id: number;
  razonSocial: string;
  // otros campos si los necesitás
}

interface PublicacionType {
  id: number;
  titulo: string;
  // otros campos si los necesitás
}

interface ChatInfo {
  id: number;
  perfilIdPerfil: number;
  receptorIdReceptor: number;
  publicacionIdPublicacion: number;
  nombrePublicacionIdPublicacion: string;
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
  const [notificacionEnviada, setNotificacionEnviada] = useState(false);

  // ---------------------------
  // 1️⃣ Cargar info del chat y obtener IDs reales
  // ---------------------------
  useEffect(() => {
    if (!enabled) return;

    const loadChatInfo = async () => {
      try {
        const res = await fetch(`https://localhost:7168/api/Chat/api/v1/chat/id/${id}`);
        if (!res.ok) throw new Error("No se pudo obtener la info del chat");
        const data = await res.json();

        // obtener IDs reales
        const perfilReal: PerfilType = await obtenerPerfilNombre(data.nombrePerfilidPerfil);
        const receptorReal: PerfilType = await obtenerPerfilNombre(data.nombreReceptorIdReceptor);
        const publicacionReal: PublicacionType = await obtenerPublicacionNombre(data.nombrePublicacionIdPublicacion);

        setChatInfo({
          id: data.id,
          perfilIdPerfil: perfilReal.id,
          receptorIdReceptor: receptorReal.id,
          publicacionIdPublicacion: publicacionReal.id,
          nombrePublicacionIdPublicacion: data.nombrePublicacionIdPublicacion,
        });

      } catch (err) {
        console.error("Error cargando info del chat:", err);
      }
    };

    loadChatInfo();
  }, [id, enabled]);

  // ---------------------------
  // 2️⃣ Cargar historial de mensajes
  // ---------------------------
  useEffect(() => {
    if (!enabled || !chatInfo) return;

    const loadMessages = async () => {
      try {
        const res = await fetch(`https://localhost:7168/api/Mensaje/api/v1/mensajes/chat/${id}`);
        if (!res.ok) throw new Error("No se pudo cargar mensajes");
        const data = (await res.json()).sort(
          (a: any, b: any) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()
        );

        setMessages(
          data.map((m: any) => ({
            id: m.id,
            contenido: m.contenido,
            fechaHora: m.fechaHora,
            perfilIdPerfil: m.perfilIdPerfil,
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

  // ---------------------------
  // 3️⃣ Inicializar SignalR
  // ---------------------------
  useEffect(() => {
    if (!enabled) return;

    const initConnection = async () => {
      try {
        const me = await fetch("/api/user/me").then(r => r.json());
        setUserId(me.id);

        const perfilData = await GetUserByPerfil(me.id);
        setPerfil(perfilData);

        const conn = new signalR.HubConnectionBuilder()
          .withUrl(`https://localhost:7168/chatHub?chatId=${id}`)
          .withAutomaticReconnect()
          .build();

        await conn.start();
        console.log("Conectado al Hub", id);

        conn.on("ReceiveMessage", (autorId: number, contenido: string, autorNombre: string) => {
          setMessages(prev => [
            ...prev,
            {
              id: Date.now(),
              contenido,
              fechaHora: new Date().toISOString(),
              perfilNombre: autorNombre,
              perfilIdPerfil: autorId,
              soyYo: autorId === perfilData.id,
            },
          ]);
        });

        setConnection(conn);
      } catch (err) {
        console.error("Error inicializando Hub:", err);
      }
    };

    initConnection();

    return () => {
      connection?.off("ReceiveMessage");
      connection?.stop();
    };
  }, [id, enabled]);

  // ---------------------------
  // 4️⃣ Autoscroll
  // ---------------------------
  useEffect(() => {
    if (!enabled) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, enabled]);

  // ---------------------------
  // 5️⃣ Enviar mensaje y crear notificación
  // ---------------------------
  const sendMessage = async (texto: string) => {
    if (!enabled || !texto.trim()) return;
    if (!connection || connection.state !== signalR.HubConnectionState.Connected) {
      console.error("No hay conexión activa al Hub");
      return;
    }

    try {
      if (!perfil) return;

      // Guardar mensaje en DB
      const mensajeBody = {
        contenido: texto,
        fechaHora: new Date().toISOString(),
        chatIdChat: id,
        perfilIdPerfil: perfil.id,
      };
      const res = await fetch("https://localhost:7168/api/Mensaje/api/v1/agrega/mensaje", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mensajeBody),
      });
      if (!res.ok) throw new Error("Error guardando mensaje en la DB");

      // ---------------------------
      // Crear notificación
      // ---------------------------
      if (chatInfo) {
        const receptorId =
          perfil.id === chatInfo.perfilIdPerfil ? chatInfo.receptorIdReceptor : chatInfo.perfilIdPerfil;

        const notificacion = {
          perfilIdPerfil: perfil.id,
          chatIdChat: id,
          titulo: chatInfo.nombrePublicacionIdPublicacion,
          descripcion: texto,
          publicacionIdPublicacion: chatInfo.publicacionIdPublicacion,
          perfilReceptorIdPerfilReceptor: receptorId,
        };

        console.log("📨 Enviando notificación:", notificacion);
        await postNotificacion(notificacion);
        setNotificacionEnviada(true);
      }

      // ---------------------------
      // Enviar mensaje via SignalR
      // ---------------------------
      await connection.invoke("SendMessage", id, perfil.id, texto);

    } catch (err) {
      console.error("Error al enviar mensaje:", err);
    }
  };

  return { messages, sendMessage, loadingMessages, bottomRef, chatInfo };
}
