"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { GetUserByPerfil } from "@/app/lib/api/perfil";
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

interface ChatSidebarProps {
  chats: any[];
  selectedChatId: number | null;
  perfil: PerfilType;
}

export default function ChatSidebar({ chats, selectedChatId, perfil }: ChatSidebarProps) {
  const [otrosPerfiles, setOtrosPerfiles] = useState<Record<string, PerfilType>>({});

  // Cargar perfiles de los otros usuarios
  useEffect(() => {
    async function loadPerfiles() {
      const nuevosPerfiles: Record<string, PerfilType> = {};
      for (const chat of chats) {
        const soyPerfil = chat.nombrePerfilidPerfil === perfil.razonSocial;
        const otroNombre = soyPerfil
          ? chat.nombreReceptorIdReceptor
          : chat.nombrePerfilidPerfil;

        // Evitar recargar si ya está
        if (!otrosPerfiles[otroNombre]) {
          try {
            const data = await obtenerPerfilNombre(otroNombre);
            nuevosPerfiles[otroNombre] = data;
          } catch (err) {
            console.error("Error cargando perfil de", otroNombre, err);
          }
        }
      }

      // Actualizar estado
      setOtrosPerfiles(prev => ({ ...prev, ...nuevosPerfiles }));
    }

    if (chats.length > 0) {
      loadPerfiles();
    }
  }, [chats, perfil]);

  return (
    <aside className="w-80 bg-white border-r border-gray-200 shadow-md px-4 py-4 overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">💬 Tus Chats</h2>

      {chats.length === 0 ? (
        <p className="text-gray-500">No tenés chats todavía</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {chats.map(chat => {
            const soyPerfil = chat.nombrePerfilidPerfil === perfil.razonSocial;
            const otroNombre = soyPerfil
              ? chat.nombreReceptorIdReceptor
              : chat.nombrePerfilidPerfil;

            const otroPerfil = otrosPerfiles[otroNombre];
            const publicacion = chat.nombrePublicacionIdPublicacion ?? "Sin publicación";

            return (
              <Link key={chat.id} href={`/Chat/${chat.id}`}>
                <li
                  className={`p-3 rounded-xl cursor-pointer transition-all border 
                    ${selectedChatId === chat.id
                      ? "bg-green-100 border-green-500"
                      : "bg-gray-50 border-gray-200 hover:bg-green-50"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar: si hay imagen, mostrarla, sino inicial */}
                    {otroPerfil?.imagen ? (
                      <img
                        src={`data:image/jpeg;base64,${otroPerfil.imagen}`}
                        alt={otroNombre}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                        {otroNombre.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <p className="font-semibold text-gray-800 text-md">{otroNombre}</p>
                      <p className="text-gray-600 text-sm italic">
                        Publicación: {publicacion}
                      </p>
                    </div>
                  </div>
                </li>
              </Link>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
