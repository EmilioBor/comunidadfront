"use client";
import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
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


const SidebarPerfil = () => {
  const [perfil, setPerfil] = useState<PerfilType | null>(null);
  const [rol, setRol] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  
  useEffect(() => {
    async function loadPerfil() {
      try {
        // 🟦 1. Obtener usuario logeado desde tu session API
        const me = await fetch("/api/user/me").then((r) => r.json());
        console.log("me sidebar:", me);

        setRol(me.rol);

        // 🟦 2. Traer perfil desde actions, igual que en Perfil/page.tsx
        const perfilData = await GetUserByPerfil(me.id);
        console.log("perfil sidebar:", perfilData);

        setPerfil(perfilData || null);
      } catch (err) {
        console.error(" ", err);
      } finally {
        setLoading(false);
      }
    }

    loadPerfil();
  }, []);

  if (loading)
    return <p className="text-center mt-5 text-gray-600">Cargando perfil...</p>;

  if (!perfil)
    return (
      <p className="text-center mt-5 text-red-600">
        
      </p>
    );

  return (
    <aside className="bg-white rounded-2xl shadow-md overflow-hidden w-full max-w-xs">
      <div className="bg-[#84CEDB] h-40 rounded-t-2xl"></div>

      <div className="flex flex-col items-center -mt-12 pb-6">
      <img
          src={perfil?.imagen ? `data:image/png;base64,${perfil.imagen}` : "/default-avatar.png"}
          alt="Foto perfil"
          className="w-37 h-37 rounded-full object-cover border-4 border-[grey]"
        />
        
        <p className="mt-3 font-medium text-gray-800">
          {perfil?.razonSocial || "Usuario desconocido"}
        </p>

        <div className="mt-4 flex flex-col gap-2 w-4/5">
          <button className="bg-[#7DB575] text-white py-2 rounded-xl hover:bg-green-600 transition">
            Donaciones
          </button>
          <button className="bg-[#7DB575] text-white py-2 rounded-xl hover:bg-green-600 transition">
            Chats
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SidebarPerfil;

