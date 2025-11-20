"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { GetUserByPerfil } from "@/app/lib/api/perfil";
import { obtenerLocalidadesByID } from "../Perfil/action";
import { useRouter } from "next/navigation";
import Navbar from "../Inicio/components/Navbar";
import Link from "next/link";
import { obtenerPublicacion, obtenerPerfilId } from "./action";
import { useObtenerUltimaConexion, useRegistroConexion } from "@/hooks/useUltimaConexion";

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
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null);
  const [modalEliminar, setModalEliminar] = useState<{ mostrar: boolean; publicacionId: number | null; titulo: string }>({
    mostrar: false,
    publicacionId: null,
    titulo: ""
  });
  const [eliminando, setEliminando] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  
  const menuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const router = useRouter();

  // Asegurar valores estables para los hooks
  const userIdEstable = userId || 0;
  const perfilIdEstable = perfil?.id || 0;

  // Registrar MI conexión automáticamente CON MAPEO
  useRegistroConexion(userIdEstable, perfilIdEstable);

  // Usar el hook para obtener última conexión REAL (de mi propio usuario)
  const { ultimaConexion, color } = useObtenerUltimaConexion(userIdEstable, perfilIdEstable);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedOutside = Object.values(menuRefs.current).every(
        (ref) => ref && !ref.contains(event.target as Node)
      );
      
      if (clickedOutside && menuAbierto !== null) {
        setMenuAbierto(null);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuAbierto]);

  // Carga perfil + localidad + rol desde la cookie/session
  useEffect(() => {
    async function load() {
      try {
        const me = await fetch("/api/user/me").then((r) => r.json());
        console.log("📊 Datos del usuario logueado:", me);
        setRol(me.rol);
        
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

        const localidadData = await obtenerLocalidadesByID(perfilData.localidadIdLocalidad);
        console.log("📍 Localidad:", localidadData);
        setLocalidad(localidadData);

        const pubs = await obtenerPublicacion(perfilData.razonSocial);
        console.log("📝 Publicaciones:", pubs);
        setPublicaciones(Array.isArray(pubs) ? pubs : [pubs]);
        
      } catch (error) {
        console.error("Error cargando datos del perfil:", error);
      }
    }
    load();
  }, []);

  // Función para toggle del menú
  const toggleMenu = (publicacionId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuAbierto(prev => prev === publicacionId ? null : publicacionId);
  };

  // Función para editar publicación
  const handleEditarPublicacion = (publicacionId: number) => {
    setMenuAbierto(null);
    setTimeout(() => {
      router.push(`/Perfil/EditarPublicacion/${publicacionId}`);
    }, 100);
  };

  // Función para abrir modal de confirmación de eliminación
  const handleAbrirModalEliminar = (publicacionId: number, titulo: string) => {
    setMenuAbierto(null);
    setModalEliminar({
      mostrar: true,
      publicacionId,
      titulo
    });
  };

  // Función para cerrar modal de eliminación
  const handleCerrarModalEliminar = () => {
    setModalEliminar({
      mostrar: false,
      publicacionId: null,
      titulo: ""
    });
    setEliminando(false);
  };

  // Función para eliminar publicación
  const handleEliminarPublicacion = async () => {
    if (!modalEliminar.publicacionId) return;

    setEliminando(true);
    
    try {
      const response = await fetch(`https://localhost:7168/api/Publicacion/api/v1/delete/publicacion/${modalEliminar.publicacionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Eliminar la publicación del estado local
        setPublicaciones(publicaciones.filter(pub => pub.id !== modalEliminar.publicacionId));
        handleCerrarModalEliminar();
      } else {
        throw new Error('Error al eliminar la publicación');
      }
    } catch (error) {
      console.error("Error al eliminar publicación:", error);
      alert("Error al eliminar la publicación");
    } finally {
      setEliminando(false);
    }
  };

  // Función para asignar la referencia del menú
  const setMenuRef = (publicacionId: number, el: HTMLDivElement | null) => {
    menuRefs.current[publicacionId] = el;
  };

  if (!perfil) {
    return <p className="text-center mt-10 text-lg">Cargando perfil...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* MODAL DE IMAGEN DE PERFIL - CENTRADO EN TODA LA PANTALLA SIN FONDO OSCURO */}
      {mostrarModalImagen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-2xl w-full mx-4 p-6">
            <button 
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              onClick={() => setMostrarModalImagen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Foto de perfil</h3>
              <div className="flex justify-center">
                <img
                  src={`data:image/jpeg;base64,${perfil.imagen}`}
                  alt="Foto de perfil ampliada"
                  className="w-80 h-80 object-cover rounded-lg shadow-lg"
                />
              </div>
              <p className="text-gray-700 mt-6 text-lg font-semibold">{perfil.razonSocial}</p>
            </div>
          </div>
        </div>
      )}

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
        <main className="w-3/4 p-8 flex flex-col gap-8 relative">
          {/* MODAL DE CONFIRMACIÓN PARA ELIMINAR PUBLICACIÓN - SIN FONDO OSCURO */}
          {modalEliminar.mostrar && (
            <div className="absolute inset-0 flex items-center justify-center z-40">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full mx-4 p-6 transform transition-all">
                <div className="text-center">
                  {/* Icono de advertencia */}
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    ¿Deseas eliminar la publicación?
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    Estás por eliminar la publicación: <strong>"{modalEliminar.titulo}"</strong>. Esta acción no se puede deshacer.
                  </p>

                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={handleCerrarModalEliminar}
                      disabled={eliminando}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
                    >
                      Cancelar
                    </button>
                    
                    <button
                      onClick={handleEliminarPublicacion}
                      disabled={eliminando}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium"
                    >
                      {eliminando ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Eliminando...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Sí, eliminar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INFORMACIÓN DEL PERFIL */}
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

                {/* INFORMACIÓN EN GRID MEJORADA */}
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

                    {/* ÚLTIMA CONEXIÓN - CON DATOS REALES DEL LOCALSTORAGE */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Última conexión</p>
                      <p className={`text-lg font-semibold ${color}`}>
                        {ultimaConexion}
                      </p>
                      {ultimaConexion.includes("Activo ahora") && (
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-600">En línea</span>
                        </div>
                      )}
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
                    <div 
                      className="relative"
                      ref={(el) => setMenuRef(pub.id, el)}
                    >
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
                        <div 
                          className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-32"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleEditarPublicacion(pub.id);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAbrirModalEliminar(pub.id, pub.titulo);
                            }}
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
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}