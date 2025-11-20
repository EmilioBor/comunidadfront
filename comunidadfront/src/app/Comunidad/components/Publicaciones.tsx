// app/Comunidad/components/Publicaciones.tsx
'use client';

import { useEffect, useState, useRef } from "react";
import { obtenerPublicaciones, obtenerPerfilNombre } from "../actions";
import CrearPublicacion from "./CrearPublicacion";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { GetUserByPerfil } from "@/app/lib/api/perfil";


interface Publicacion {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  fechaCreacion: string;
  nombreLocalidadIdLocalidad: string;
  nombrePerfilIdPerfil: string;
  nombrePublicacionTipoIdPublicacionTipo: string;
  nombreDonacionIdDonacion: string;
  perfil?: any;
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

export default function Perfil() {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [selectedTipo, setSelectedTipo] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [perfil, setPerfil] = useState<PerfilType | null>(null);
  const [userId, setUserId] = useState<number | null>(null);




  const loadPublicaciones = async () => {
    try {
      setLoading(true);

      const pubs = await obtenerPublicaciones();

      // Agregar perfil con imagen a cada publicación
      const publicacionesConPerfil = await Promise.all(
        pubs.map(async (pub: Publicacion) => {
          const perfilData = await obtenerPerfilNombre(pub.nombrePerfilIdPerfil);
          return { ...pub, perfil: perfilData };
        })
      );

      setPublicaciones(publicacionesConPerfil);

    } catch (error) {
      console.error("Error cargando publicaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublicaciones();
  }, []);

  const toggleMenu = (publicacionId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuAbierto(menuAbierto === publicacionId ? null : publicacionId);
  };

  const cerrarMenu = () => {
    setMenuAbierto(null);
  };

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAbierto(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Función para construir la URL de donación - CORREGIDA
  const getDonacionUrl = (publicacion: Publicacion) => {
    if (!publicacion.perfil?.id) {
      console.error('No se pudo obtener el perfil de destino para la publicación:', publicacion.id);
      console.log('Perfil data:', publicacion.perfil);
      return '#';
    }

    const params = new URLSearchParams({
      publicacionId: publicacion.id.toString(),
      perfilDestinoId: publicacion.perfil.id.toString(), // ID REAL del perfil
      razonSocialDestino: publicacion.perfil.razonSocial || publicacion.nombrePerfilIdPerfil
    });
    
    console.log(`URL de donación para publicación ${publicacion.id}:`, `/Donacion/Crear?${params.toString()}`);
    return `/Donacion/Crear?${params.toString()}`;
  };



    // 🔹 Crear chat y redirigir
    const handleChatClick = async (pub: Publicacion) => {
      try {
        // 1) usuario logeado desde iron-session
                const me = await fetch("/api/user/me").then((r) => r.json());
                console.log("📊 Datos del usuario logueado:", me);

                
                // Guardar el ID del usuario logueado - ESTE ES EL ID CORRECTO
                setUserId(me.id);
                console.log("🔑 ID del usuario logueado:", me.id);
                
                const perfilData = await GetUserByPerfil(me.id);
                console.log("📄 Datos del perfil:", perfilData);
                if (!perfilData) {
                  router.push("/Perfil/Crear");
                  return;
                }
                setPerfil(perfilData);
        // const resUser = await fetch("/api/user/me").then((r) => r.json());
        // console.log("📊 Datos del usuario logueado:", resUser);
        // if (!resUser.ok) {
        //   console.error("No se pudo obtener el usuario");
        //   return;
        // }
        // const user = await resUser.json();

        const perfilIdActual = perfilData.id; // ajustá al nombre real
        const receptorId = pub.perfil?.id; // perfil dueño de la publicación
        console.log("Perfil actual ID:", perfilIdActual);
        console.log("Receptor ID:", receptorId);
        if (!perfilIdActual || !receptorId) {
          console.error("Faltan IDs de perfil/receptor");
          return;
        }

        // 2) Crear chat (si ya existe, tu servicio lo devuelve)
        const body = {
          id: 0,
          publicacionIdPublicacion: pub.id,
          perfilIdPerfil: perfilIdActual,
          receptorIdReceptor: receptorId,
        };

        const resChat = await fetch(
          "https://localhost:7168/api/Chat/api/v1/agrega/chat",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );

        if (!resChat.ok) {
          console.error("Error al crear/obtener chat");
          return;
        }

        const chat = await resChat.json();

        // 3) Redirigir al chat
        router.push(`/Chat/${chat.id}`);
      } catch (err) {
        console.error("Error en handleChatClick:", err);
      }
    };











  if (loading) {
    return (
      <div className="bg-[#D9D9D9] p-4 rounded-2xl flex flex-col gap-4">
        <h1 className="font-semibold text-black text-xl text-center mb-4">Publicaciones</h1>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="font-medium text-black">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#D9D9D9] p-4 rounded-2xl flex flex-col gap-4">
      <h1 className="font-semibold text-black text-xl text-center mb-4">Publicaciones</h1>

      {/* Filtros */}
      <div className="flex justify-center gap-3 mb-4">
        <button onClick={() => setSelectedTipo('Donacion')} className="bg-[#7DB575] text-white px-4 py-2 rounded-full hover:bg-green-600 transition">Donación</button>
        <button onClick={() => setSelectedTipo('Servicio')} className="bg-[#7DB575] text-white px-4 py-2 rounded-full hover:bg-green-600 transition">Servicio</button>
        <button onClick={() => setSelectedTipo('Pedido')} className="bg-[#7DB575] text-white px-4 py-2 rounded-full hover:bg-green-600 transition">Pedido</button>
      </div>

      {/* Lista de publicaciones */}
      {publicaciones
        .filter(pub => !selectedTipo || pub.nombrePublicacionTipoIdPublicacionTipo === selectedTipo)
        .map(pub => (
          <div key={pub.id} className="bg-white rounded-2xl p-4 mb-4 border border-gray-300">
            
            {/* Perfil - MODIFICADO: Nombre clickeable */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={pub.perfil?.imagen ? `data:image/jpeg;base64,${pub.perfil.imagen}` : "/default-profile.png"}
                  alt="Foto perfil"
                  className="w-8 h-8 rounded-full object-cover bg-gray-200"
                />
                {/* NOMBRE DEL PERFIL CLICKEABLE - NUEVO */}
                {pub.perfil?.id ? (
                  <Link 
                    href={`/Perfil/VerPerfil?id=${pub.perfil.id}`}
                    className="font-medium text-black hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    {pub.perfil?.razonSocial || pub.nombrePerfilIdPerfil}
                  </Link>
                ) : (
                  <span className="font-medium text-black">
                    {pub.perfil?.razonSocial || pub.nombrePerfilIdPerfil}
                  </span>
                )}
              </div>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={(e) => toggleMenu(pub.id, e)}
                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-full transition-all duration-200 text-xl leading-none flex items-center justify-center w-8 h-8"
                  title="Opciones"
                >
                  ⋮
                </button>

                {menuAbierto === pub.id && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[150px]">
                    <Link
                      href={`/Reporte?publicacionId=${pub.id}`}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded text-sm text-black transition-colors duration-150"
                      onClick={cerrarMenu}
                    >
                      <span>Reportar...</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Contenido */}
            <h3 className="font-bold text-xl mb-2 text-black">{pub.titulo}</h3>
            <p className="text-sm text-black mb-3">{pub.descripcion}</p>
            <p className="text-xs text-gray-500 mb-3">Fecha: {new Date(pub.fechaCreacion).toLocaleDateString()}</p>
            <p className="text-xs text-gray-500 mb-3">Localidad: {pub.nombreLocalidadIdLocalidad}</p>

            <img
              src={`data:image/jpeg;base64,${pub.imagen}`}
              alt="Imagen publicación"
              className="rounded-xl w-full object-cover mb-3 max-h-64"
            />

            <div className="flex justify-end gap-3">
              <Link 
                href={getDonacionUrl(pub)}
                className="bg-[#7DB575] text-white px-6 py-1 rounded-full hover:bg-green-600 transition"
              >
                Donar
              </Link>
              <button
                onClick={() => handleChatClick(pub)}
                className="bg-[#7DB575] text-white px-6 py-1 rounded-full hover:bg-green-600 transition"
              >
                Chat
              </button>
            </div>

          </div>
        ))}
    </div>
  );
}