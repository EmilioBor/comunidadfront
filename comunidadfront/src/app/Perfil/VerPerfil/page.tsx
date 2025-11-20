// app/Perfil/VerPerfil/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { obtenerPerfilId, obtenerPublicacion, obtenerLocalidadConProvincia } from "./actions";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../../Inicio/components/Navbar";
import Link from "next/link";

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
  provinciaId?: number;
  provincia?: {
    id: number;
    nombre: string;
  };
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
  nombreDonacionIdDonacion: number;
}

export default function VerPerfil() {
  const [perfil, setPerfil] = useState<PerfilType | null>(null);
  const [localidad, setLocalidad] = useState<LocalidadType | null>(null);
  const [rol, setRol] = useState<string | null>(null);
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [mostrarModalImagen, setMostrarModalImagen] = useState(false);
  const [ultimaConexion, setUltimaConexion] = useState<string>("Activo");
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const perfilId = searchParams.get('id');

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

  // Carga perfil + localidad + publicaciones
  useEffect(() => {
    async function load() {
      try {
        if (!perfilId) {
          setErrorCarga("No se recibió ID de perfil");
          return;
        }

        setCargando(true);
        setErrorCarga(null);

        // Obtener perfil por ID
        const perfilData = await obtenerPerfilId(parseInt(perfilId));
        console.log("perfilData:", perfilData);
        
        if (!perfilData) {
          setErrorCarga("No se encontró el perfil");
          return;
        }
        
        setPerfil(perfilData);

        // Obtener rol del usuario
        const esEmpresa = perfilData.cuitCuil.toString().length > 11;
        setRol(esEmpresa ? "Empresa" : "Persona");

        // Obtener localidad COMPLETA del perfil (con provincia)
        if (perfilData.localidadIdLocalidad) {
          try {
            console.log("📍 Obteniendo localidad para ID:", perfilData.localidadIdLocalidad);
            const localidadData = await obtenerLocalidadConProvincia(perfilData.localidadIdLocalidad);
            console.log("📍 Localidad con provincia obtenida:", localidadData);
            setLocalidad(localidadData);
          } catch (localidadError) {
            console.warn("No se pudo cargar la localidad:", localidadError);
            setLocalidad(null);
          }
        } else {
          console.warn("El perfil no tiene localidadIdLocalidad");
          setLocalidad(null);
        }

        // Obtener publicaciones del perfil
        try {
          const pubs = await obtenerPublicacion(perfilData.razonSocial);
          console.log("pubs:", pubs);
          setPublicaciones(Array.isArray(pubs) ? pubs : [pubs]);
        } catch (publicacionError) {
          console.warn("No se pudieron cargar las publicaciones:", publicacionError);
          setPublicaciones([]);
        }

        setUltimaConexion("Activo");
        
      } catch (error) {
        console.error("Error cargando datos del perfil:", error);
        setErrorCarga("Error al cargar el perfil");
      } finally {
        setCargando(false);
      }
    }
    load();
  }, [perfilId]);

  // Función para formatear la localidad y provincia
  const formatearLocalidad = () => {
    if (!localidad) {
      // Si no hay localidad, intentar obtener de las publicaciones
      if (publicaciones.length > 0 && publicaciones[0].nombreLocalidadIdLocalidad) {
        return publicaciones[0].nombreLocalidadIdLocalidad;
      }
      return "Ubicación no disponible";
    }

    let ubicacion = localidad.nombre || "";
    
    // Agregar provincia si está disponible
    if (localidad.provincia && localidad.provincia.nombre) {
      ubicacion += `, ${localidad.provincia.nombre}`;
    } else if (localidad.nombreProvinciaIdProvincia) {
      // Fallback: usar nombreProvinciaIdProvincia si existe
      ubicacion += `, ${localidad.nombreProvinciaIdProvincia}`;
    }

    return ubicacion || "Ubicación no disponible";
  };

  // Función para toggle del menú
  const toggleMenu = (publicacionId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuAbierto(menuAbierto === publicacionId ? null : publicacionId);
  };

  // Función para cerrar el menú
  const cerrarMenu = () => {
    setMenuAbierto(null);
  };

  if (cargando) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-lg">Cargando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (errorCarga || !perfil) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">{errorCarga || "No se pudo cargar el perfil"}</p>
            <button
              onClick={() => router.push('/Inicio')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
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
                href={`/Perfil/VerDonaciones?perfilId=${perfil.id}`}
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
          </div>
        </aside>

        {/* COLUMNA CENTRAL */}
        <main className="w-3/4 p-8 flex flex-col gap-8">
          {/* INFORMACIÓN DEL PERFIL - VERSIÓN SOLO LECTURA */}
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

                {/* INFORMACIÓN EN GRID MEJORADA - SOLO LECTURA */}
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
                    {/* LOCALIDAD Y PROVINCIA - MEJORADO */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Ubicación</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {formatearLocalidad()}
                      </p>
                      {localidad && localidad.codigoPostal && (
                        <p className="text-sm text-gray-600 mt-1">
                          CP: {localidad.codigoPostal}
                        </p>
                      )}
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
              </div>
            </div>
          </section>

          {/* PUBLICACIONES - CON BOTÓN DE TRES PUNTOS PARA REPORTE */}
          <section className="w-full">
            <h2 className="text-xl font-bold mb-4 text-black">Publicaciones</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publicaciones.length === 0 ? (
                <p className="text-gray-500 col-span-full text-center py-8">
                  No hay publicaciones para mostrar.
                </p>
              ) : (
                publicaciones.map((pub) => (
                  <div key={pub.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col relative">
                    {/* INFORMACIÓN DEL PERFIL - CON BOTÓN DE TRES PUNTOS */}
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
                      
                      {/* BOTÓN DE TRES PUNTOS PARA REPORTE - NUEVO */}
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
                        <strong>Localidad:</strong> {pub.nombreLocalidadIdLocalidad}
                      </p>
                      <p className="text-sm text-gray-500 mb-2">
                        <strong>Tipo:</strong> {pub.nombrePublicacionTipoIdPublicacionTipo}
                      </p>
                      <p className="text-gray-700 text-sm flex-grow line-clamp-3">{pub.descripcion}</p>

                      {/* BOTONES DE ACCIÓN - SOLO DONAR Y CHAT */}
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
                ))
              )}
            </div>
          </section>
        </main>
      </div>

      {/* MODAL PARA VER IMAGEN GRANDE */}
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