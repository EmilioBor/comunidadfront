"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useChat } from "@/app/Chat/components/useChat";
import { GetUserByPerfil } from "@/app/lib/api/perfil";

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

export default function ChatPage() {
  const params = useParams();
  
  // Debug detallado
  console.log("All params:", params);
  console.log("chatid param:", params?.chatid);
  console.log("chatId param:", params?.chatId);
  
  // Intenta diferentes nombres de parámetro
  const chatIdParam = Number(
    params?.chatid || 
    params?.chatId || 
    (params as any)?.id || 
    0
  );
  
  console.log("Parsed chatIdParam:", chatIdParam);

  const [perfil, setPerfil] = useState<PerfilType | null>(null);
  const [text, setText] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);

  // Validación del chatId
  useEffect(() => {
    if (isNaN(chatIdParam) || chatIdParam === 0) {
      console.error("Invalid chatId. Raw params:", params);
    }
  }, [chatIdParam, params]);

  // ------------------------------
  // 1️⃣ Cargar usuario logueado
  // ------------------------------
  useEffect(() => {
    const loadUser = async () => {
      try {
        const me = await fetch("/api/user/me").then((r) => r.json());
        const perfilData = await GetUserByPerfil(me.id);
        setPerfil(perfilData);
      } catch (err) {
        console.error("Error cargando usuario:", err);
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, []);

  // Usuario actual (razón social)
  const nombrePerfilIdPerfil = perfil?.razonSocial ?? null;

  // ------------------------------
  // 2️⃣ Hook del chat - Solo cuando chatIdParam es válido
  // ------------------------------
  const {
    messages,
    sendMessage,
    loadingMessages,
    bottomRef,
  } = useChat({
    id: chatIdParam,
    nombrePerfilIdPerfil,
  });

  // ------------------------------
  // Enviar mensaje
  // ------------------------------
  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text);
    setText("");
  };

  // Nombre del chat desde los mensajes
  const nombreChat =
    messages.length > 0
      ? messages[0].nombreChatIdChat || "Chat"
      : "Chat";

  // --------------------------------
  // 3️⃣ Render principal
  // --------------------------------
  if (isNaN(chatIdParam) || chatIdParam === 0) {
    return (
      <div className="p-4 text-black">
        <h2>Error: No se pudo cargar el chat</h2>
        <p>Parámetros recibidos: {JSON.stringify(params)}</p>
        <p>chatId: {params?.chatid || "undefined"}</p>
        <p>Por favor, verifica la URL e intenta nuevamente.</p>
      </div>
    );
  }

  if (loadingUser) {
    return <div className="p-4 text-black">Cargando usuario...</div>;
  }

  return (
    <div className="flex h-screen bg-[#EBFFF7]">
      <aside className="w-72 bg-[#E2F0D9] p-4 hidden md:flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-black">Chats</h2>
      </aside>

      <main className="flex-1 flex flex-col p-6">
        {/* HEADER DEL CHAT */}
        <header className="bg-[#47C7C1] rounded-t-3xl text-white px-6 py-4 flex items-center gap-3 shadow">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <span className="text-black font-bold">
              {nombreChat?.substring(0, 2).toUpperCase() || "CH"}
            </span>
          </div>
          <div>
            <span className="font-semibold text-lg">{nombreChat}</span>
            <span className="text-xs block">En línea</span>
          </div>
        </header>

        {/* MENSAJES */}
        <section className="flex-1 bg-[#6BD5D0] bg-opacity-80 rounded-b-3xl shadow flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 relative">
            <div className="absolute inset-0 opacity-30 bg-[url('/chat-bg.svg')] bg-cover pointer-events-none"></div>

            <div className="relative space-y-2">
              {loadingMessages && (
                <p className="text-center text-white text-sm">
                  Cargando mensajes...
                </p>
              )}

              {messages.map((m) => {
                const isMine = m.soyYo;
                return (
                  <div
                    key={m.id}
                    className={`flex mb-1 ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
                        isMine
                          ? "bg-[#47C7C1] text-white rounded-br-sm"
                          : "bg-white text-black rounded-bl-sm"
                      }`}
                    >
                      <p>{m.contenido}</p>
                      <div className="flex justify-end mt-1 text-[10px] opacity-80">
                        {new Date(m.fechaHora).toLocaleTimeString("es-AR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div ref={bottomRef} />
            </div>
          </div>

          {/* INPUT PARA ENVIAR */}
          <div className="bg-[#47C7C1] px-4 py-3 flex items-center gap-3">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-4 py-2 rounded-full bg-white text-black text-sm outline-none"
              placeholder="Escribe tu mensaje..."
            />
            <button
              onClick={handleSend}
              className="bg-[#0B95FF] text-white px-6 py-2 rounded-full text-sm hover:bg-blue-600 disabled:opacity-50"
              disabled={!text.trim()}
            >
              Enviar
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}