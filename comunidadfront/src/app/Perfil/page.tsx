"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { GetUserByPerfil } from "@/app/lib/api/perfil";
import { obtenerLocalidadesByID } from "../Perfil/action";
import { useRouter } from "next/navigation";
import Navbar from "../Inicio/components/Navbar";
import Link from "next/link";
import { obtenerPublicacion } from "./action";

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

interface LocalidadType {
  id: number;
  nombre: string;
  codigoPostal: string;
  nombreProvinciaIdProvincia: string;
}

interface Publicacion {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  fechaCreacion: string;
  nombreLocalidadIdLocalidad: string;
  nombrePerfilIdPerfil: string;
  nombrePublicacionTipoIdPublicacionTipo: string;
  nombreDonacionIdDonacion: 1;
}

export default function Perfil() {
  const [perfil, setPerfil] = useState<PerfilType | null>(null);
  const [localidad, setLocalidad] = useState<LocalidadType | null>(null);
  const [rol, setRol] = useState<string | null>(null);
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [mostrarModalImagen, setMostrarModalImagen] = useState(false);
  const [ultimaConexion, setUltimaConexion] = useState<string>("Activo");
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null);

  const router = useRouter();

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = () => {
      setMenuAbierto(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Carga perfil + localidad + rol desde la cookie/session
  useEffect(() => {
    async function load() {
      try {
        const me = await fetch("/api/user/me").then((r) => r.json());
        console.log("me:", me);
        setRol(me.rol);

        const perfilData = await GetUserByPerfil(me.id);
        console.log("perfilData:", perfilData);
        if (!perfilData) {
          router.push("/Perfil/Crear");
          return;
        }
        setPerfil(perfilData);

        const localidadData = await obtenerLocalidadesByID(perfilData.localidadIdLocalidad);
        console.log("localidadData:", localidadData);
        setLocalidad(localidadData);

        const pubs = await obtenerPublicacion(perfilData.razonSocial);
        console.log("pubs:", pubs);
        setPublicaciones(Array.isArray(pubs) ? pubs : [pubs]);

        // Simular última conexión
        setUltimaConexion("Activo");
        
      } catch (error) {
        console.error("Error cargando datos del perfil:", error);
      }
    }
    load();
  }, []);

  const toggleMenu = (publicacionId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuAbierto(menuAbierto === publicacionId ? null : publicacionId);
  };

  const handleEditarPublicacion = (publicacionId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuAbierto(null);
    // Aquí iría la lógica para editar la publicación
    console.log("Editar publicación:", publicacionId);
    router.push(`/Perfil/EditarPublicacion/${publicacionId}`);
  };

  const handleEliminarPublicacion = async (publicacionId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuAbierto(null);
    
    // Confirmación antes de eliminar
    if (window.confirm("¿Estás seguro de que quieres eliminar esta publicación?")) {
      try {
        // Aquí iría la llamada a tu API para eliminar la publicación
        console.log("Eliminar publicación:", publicacionId);
        
        // Simular eliminación - en una app real harías una llamada a tu API
        setPublicaciones(publicaciones.filter(pub => pub.id !== publicacionId));
        
        alert("Publicación eliminada correctamente");
      } catch (error) {
        console.error("Error al eliminar publicación:", error);
        alert("Error al eliminar la publicación");
      }
    }
  };

  if (!perfil) {
    return <p className="text-center mt-10 text-lg">Cargando perfil...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex w-full">
        {/* COLUMNA IZQUIERDA */}
        <aside className="w-1/4 h-screen p-6 flex flex-col items-center bg-gray-100">
          {/* IMAGEN DE PERFIL CLICKEABLE */}
          <div 
            className="w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg cursor-pointer transform transition-transform hover:scale-105"
            onClick={() => setMostrarModalImagen(true)}
          >
            <Image
              src={`data:image/jpeg;base64,${perfil.imagen}`}
              alt="Foto de perfil"
              width={160}
              height={160}
              className="object-cover w-full h-full"
              unoptimized
            />
          </div>

          <p className="text-lg font-semibold text-black text-center">{perfil.razonSocial}</p>

          <div className="mt-10 flex flex-col w-full gap-4">
            <Link
              href="/Perfil/Donaciones"
              className="bg-gray-300 hover:bg-gray-400 py-2 rounded-lg text-center text-black transition-colors shadow-sm hover:shadow-md"
            >
              Donaciones
            </Link>
            <Link
              href="/Perfil/Chat"
              className="bg-gray-300 hover:bg-gray-400 py-2 rounded-lg text-center text-black transition-colors shadow-sm hover:shadow-md"
            >
              Chats
            </Link>
            {rol === "Empresa" && (
              <Link
                href={`/Perfil/CrearNovedad/?idPerfil=${perfil.id}`}
                className="bg-blue-500 hover:bg-blue-600 py-2 rounded-lg text-center text-white font-semibold transition-colors shadow-md hover:shadow-lg"
              >
                Crear Novedad
              </Link>
            )}
          </div>
        </aside>

        {/* COLUMNA CENTRAL */}
        <main className="w-3/4 p-8 flex flex-col gap-8">
          {/* INFORMACIÓN DEL PERFIL - MEJORADA */}
          <section className="w-full">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-2xl shadow-lg border border-green-200">
              <div className="bg-white rounded-xl shadow-md p-6">
                {/* HEADER CON TIPO DE PERFIL Y CANTIDAD DE PUBLICACIONES */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">{perfil.razonSocial}</h1>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      rol === "Empresa" 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-green-100 text-green-800"
                    }`}>
                      {rol === "Empresa" ? "Perfil Empresa" : "Perfil Persona"}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Publicaciones</p>
                    <p className="text-2xl font-bold text-green-600">{publicaciones.length}</p>
                  </div>
                </div>

                {/* INFORMACIÓN EN GRID MEJORADA - ORGANIZACIÓN SOLICITADA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* COLUMNA IZQUIERDA */}
                  <div className="space-y-4">
                    {/* CBU */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">CBU</p>
                      <p className="text-lg font-mono text-blue-600 font-semibold">{perfil.cbu}</p>
                    </div>
                    
                    {/* ALIAS */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Alias</p>
                      <p className="text-lg font-semibold text-blue-600">{perfil.alias}</p>
                    </div>

                    {/* DESCRIPCIÓN */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-2">Descripción</p>
                      <p className="text-gray-700 leading-relaxed">{perfil.descripcion}</p>
                    </div>
                  </div>
                  
                  {/* COLUMNA DERECHA */}
                  <div className="space-y-4">
                    {/* LOCALIDAD */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Localidad</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {localidad?.nombre ?? "Cargando..."}, {localidad?.nombreProvinciaIdProvincia ?? "Cargando..."}
                      </p>
                    </div>
                    
                    {/* CUIT/CUIL */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">CUIT/CUIL</p>
                      <p className="text-lg font-semibold text-gray-800">{perfil.cuitCuil}</p>
                    </div>

                    {/* ÚLTIMA CONEXIÓN */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Última conexión</p>
                      <p className={`text-lg font-semibold ${
                        ultimaConexion === "Activo" 
                          ? "text-green-600" 
                          : "text-gray-600"
                      }`}>
                        {ultimaConexion}
                      </p>
                    </div>
                  </div>
                </div>

                {/* BOTÓN EDITAR */}
                <div className="flex justify-end">
                  <Link
                    href="/Perfil/Editar"
                    className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-lg text-white font-semibold transition-colors shadow-md hover:shadow-lg flex items-center gap-2 transform hover:scale-105 transition-transform"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    <span>Editar Perfil</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* PUBLICACIONES CON MENÚ DESPLEGABLE */}
          <section className="w-full">
            <h2 className="text-xl font-bold mb-4 text-black">Publicaciones</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publicaciones.length === 0 && (
                <p className="text-gray-500 col-span-full">No hay publicaciones.</p>
              )}
              {publicaciones.map((pub) => (
                <div key={pub.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col relative">
                  {/* INFORMACIÓN DEL PERFIL + TRES PUNTITOS */}
                  <div className="flex items-center justify-between px-4 pt-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border">
                        <Image
                          src={`data:image/jpeg;base64,${perfil.imagen}`}
                          alt={perfil.razonSocial}
                          width={40}
                          height={40}
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <span className="font-semibold text-gray-800">{pub.nombrePerfilIdPerfil}</span>
                    </div>
                    
                    {/* BOTÓN DE TRES PUNTITOS CON MENÚ DESPLEGABLE */}
                    <div className="relative">
                      <button 
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        onClick={(e) => toggleMenu(pub.id, e)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 7a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z"/>
                        </svg>
                      </button>

                      {/* MENÚ DESPLEGABLE */}
                      {menuAbierto === pub.id && (
                        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32">
                          <button
                            onClick={(e) => handleEditarPublicacion(pub.id, e)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar
                          </button>
                          <button
                            onClick={(e) => handleEliminarPublicacion(pub.id, e)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CONTENIDO DE LA PUBLICACIÓN */}
                  <img
                    src={`data:image/jpeg;base64,${pub.imagen}`}
                    alt={pub.titulo}
                    className="w-full h-[200px] object-cover"
                  />
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-[#2c3e50] mb-1">{pub.titulo}</h3>
                    <p className="text-sm text-gray-500 mb-1">
                      {new Date(pub.fechaCreacion).toLocaleDateString("es-AR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      <strong>Tipo de publicación:</strong> {pub.nombrePublicacionTipoIdPublicacionTipo}
                    </p>
                    <p className="text-gray-700 text-sm flex-grow line-clamp-3">{pub.descripcion}</p>

                    {/* BOTONES DE ACCIÓN */}
                    <div className="flex gap-2 mt-3">
                      <Link
                        href={`/Donacion/${pub.id}`}
                        className="flex-1 bg-[#7DB575] text-white py-2 rounded-lg text-center font-semibold hover:bg-green-500 transition"
                      >
                        Donar
                      </Link>
                      <Link
                        href={`/Perfil/Chat?perfil=${pub.nombrePerfilIdPerfil}`}
                        className="flex-1 bg-[#7DB575] text-white py-2 rounded-lg text-center font-semibold hover:bg-blue-500 transition"
                      >
                        Chat
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* MODAL PARA VER IMAGEN GRANDE - VERSIÓN MÁS SIMPLE */}
      {mostrarModalImagen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-8"
          onClick={() => setMostrarModalImagen(false)}
        >
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl max-h-[90vh] overflow-hidden">
            <button 
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors z-10 bg-white rounded-full p-1 shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                setMostrarModalImagen(false);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-4">
              <img
                src={`data:image/jpeg;base64,${perfil.imagen}`}
                alt="Foto de perfil ampliada"
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}