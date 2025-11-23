import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { obtenerPerfilNombre } from "../action";

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

interface ChatHeaderProps {
  title: string;
  chats: any[];
  perfil: PerfilType;
  chatId: number;
}

export default function ChatHeader({ title, chats, perfil, chatId }: ChatHeaderProps) {
  const [otrosPerfiles, setOtrosPerfiles] = useState<Record<string, PerfilType>>({});

  useEffect(() => {
    async function loadPerfiles() {
      const nuevos: Record<string, PerfilType> = {};

      for (const chat of chats) {
        const soyPerfil = chat.nombrePerfilidPerfil === perfil.razonSocial;
        const otroNombre = soyPerfil
          ? chat.nombreReceptorIdReceptor
          : chat.nombrePerfilidPerfil;

        if (!otrosPerfiles[otroNombre]) {
          try {
            const data = await obtenerPerfilNombre(otroNombre);
            nuevos[otroNombre] = data;
          } catch (err) {
            console.error("Error cargando perfil:", err);
          }
        }
      }

      setOtrosPerfiles(prev => ({ ...prev, ...nuevos }));
    }

    if (chats.length > 0) loadPerfiles();
  }, [chats, perfil]);

  const chatActual = chats.find(c => c.id === chatId);

  if (!chatActual) {
    return (
      <header className="bg-[#47C7C1] rounded-t-3xl text-white px-6 py-4 flex items-center gap-3 shadow">
        <Link href="/Chat">
          <ArrowLeft className="text-white cursor-pointer" />
        </Link>
        <h1 className="font-semibold text-lg">{title}</h1>
        <p className="ml-4 italic text-white/80">Cargando...</p>
      </header>
    );
  }

  const soyPerfil = chatActual.nombrePerfilidPerfil === perfil.razonSocial;

  const otroNombre = soyPerfil
    ? chatActual.nombreReceptorIdReceptor
    : chatActual.nombrePerfilidPerfil;

  const otroPerfil = otrosPerfiles[otroNombre];

  return (
    <header className="bg-[#47C7C1] rounded-t-3xl text-white px-6 py-4 flex items-center gap-4 shadow">
      
      {/* ← Volver */}
      <Link href="/Chat">
        <ArrowLeft className="text-white cursor-pointer" />
      </Link>

      {/* ⭐ Imagen + nombre del otro usuario */}
      <div className="flex items-center gap-3">
        {otroPerfil?.imagen ? (
          <img
            src={`data:image/jpeg;base64,${otroPerfil.imagen}`}
            alt={otroNombre}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-white text-[#47C7C1] rounded-full flex items-center justify-center font-bold">
            {otroNombre?.charAt(0)}
          </div>
        )}

        <p className="font-semibold">{otroNombre}</p>
      </div>

      {/* Empuja el título hacia la derecha */}
      <div className="flex-1" />

    </header>
  );
}
