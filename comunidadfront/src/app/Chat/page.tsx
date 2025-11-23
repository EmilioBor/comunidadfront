"use client";

import { useEffect, useState } from "react";
import ChatSidebar from "./components/ChatSidebar";
import { obternerChatByPerfil } from "./[chatId]/actions";
import { GetUserByPerfil } from "@/app/lib/api/perfil";

export default function ChatsPage() {
  const [perfil, setPerfil] = useState<any>(null);
  const [loadingPerfil, setLoadingPerfil] = useState(true);
  const [chats, setChats] = useState<any[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);

  // 1️⃣ Obtener usuario logueado
  useEffect(() => {
    async function loadPerfil() {
      try {
        const me = await fetch("/api/user/me").then((r) => r.json());
        const perfilData = await GetUserByPerfil(me.id);
        setPerfil(perfilData);
      } catch (err) {
        console.error("Error cargando perfil:", err);
      } finally {
        setLoadingPerfil(false);
      }
    }

    loadPerfil();
  }, []);

  // 2️⃣ Cuando ya tengo el perfil → obtener la lista de chats
  useEffect(() => {
    if (!perfil) return;

    async function loadChats() {
      try {
        const lista = await obternerChatByPerfil(perfil.razonSocial);
        setChats(lista);
      } catch (err) {
        console.error("Error cargando lista de chats:", err);
      } finally {
        setLoadingChats(false);
      }
    }

    loadChats();
  }, [perfil]);

  if (loadingPerfil) {
    return <p className="p-4 text-black">Cargando perfil…</p>;
  }

  return (
    <div className="flex h-screen bg-[#EBFFF7]">
      {/* Sidebar */}
      <ChatSidebar chats={chats} selectedChatId={null} perfil={perfil} />


      {/* Panel derecho (vacío) */}
      <main className="flex-1 flex flex-col items-center justify-center text-black">
        {loadingChats ? (
          <p>Cargando chats…</p>
        ) : chats.length === 0 ? (
          <p className="text-gray-600 text-xl">Todavía no tenés chats 😄</p>
        ) : (
          <p className="text-gray-500 text-lg">
            Seleccioná un chat de la izquierda
          </p>
        )}
      </main>
    </div>
  );
}
