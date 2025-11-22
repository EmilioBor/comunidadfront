"use client";

import { useParams } from "next/navigation";
import { useChat } from "../components/useChat";
import { useEffect, useState } from "react";
import ChatHeader from "../components/ChatHeader";
import ChatMessages from "../components/ChatMessages";
import ChatInput from "../components/ChatInput";
import ChatSidebar from "../components/ChatSidebar";
import { GetUserByPerfil } from "@/app/lib/api/perfil";

export default function ChatPage() {
  const params = useParams();
  const chatId = Number(params.chatId || 0);

  const [perfil, setPerfil] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // 🔹 1) Cargar usuario logueado
  useEffect(() => {
    async function loadPerfil() {
      try {
        const me = await fetch("/api/user/me").then((r) => r.json());
        const perfilData = await GetUserByPerfil(me.id);
        setPerfil(perfilData);
      } catch (err) {
        console.error("Error cargando perfil:", err);
      } finally {
        setLoadingUser(false);
      }
    }

    loadPerfil();
  }, []);

  // 🔹 2) Hook del chat - solo cuando perfil esté cargado
  const chat = useChat({
    id: chatId,
    perfilNombre: perfil?.razonSocial ?? "",
    enabled: !!perfil,
  });

  if (loadingUser) {
    return <p className="p-4 text-black">Cargando usuario…</p>;
  }

  if (chatId === 0 || isNaN(chatId)) {
    return (
      <div className="p-4 text-black">
        <h2>Error: No se pudo cargar el chat</h2>
        <p>chatId inválido: {params.chatId}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#EBFFF7]">
      {/* Sidebar */}
      <ChatSidebar chats={[]} selectedChatId={chatId} />

      {/* Main */}
      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        {/* Header */}
        <ChatHeader title="Chat" />

        {/* Mensajes */}
      <section className="flex-1 min-h-0 relative rounded-b-3xl shadow flex flex-col">
        
        {/* Fondo */}
        <div className="absolute inset-0 bg-[url('/background-login.png')] bg-cover bg-center bg-no-repeat opacity-30"></div>

        {/* Overlay celeste transparente */}
        <div className="absolute inset-0 bg-cyan-400/30"></div>

        {/* Contenido del chat */}
        <div className="relative flex-1 flex flex-col">
          <ChatMessages messages={chat.messages} bottomRef={chat.bottomRef} />
          <ChatInput onSend={chat.sendMessage} />
        </div>

      </section>

      </main>
    </div>
  );
}
