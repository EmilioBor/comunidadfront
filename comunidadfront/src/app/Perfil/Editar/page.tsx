// app/Perfil/Editar/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { editarPerfilAction } from "./actions";
import { GetUserByPerfil } from "@/app/lib/api/perfil";
import { fetchLocalidades, fetchLocalidadById } from "@/app/Comunidad/actions";
import Image from "next/image";

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

interface Localidad {
  id: number;
  nombre: string;
  codigoPostal: string;
  nombreProvinciaIdProvincia: string;
  provinciaIdProvincia: number;
}

export default function EditarPerfil() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [perfil, setPerfil] = useState<PerfilType | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [imagenBase64, setImagenBase64] = useState<string | null>(null);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);
  
  // Estados para localidades
  const [todasLasLocalidades, setTodasLasLocalidades] = useState<Localidad[]>([]);
  const [localidadSeleccionada, setLocalidadSeleccionada] = useState<Localidad | null>(null);
  const [busquedaLocalidad, setBusquedaLocalidad] = useState("");
  const [mostrarDropdown, setMostrarDropdown] = useState(false);

  // Cargar datos del perfil actual y todas las localidades
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const meResponse = await fetch("/api/user/me");
        if (!meResponse.ok) throw new Error("Error obteniendo usuario");
        
        const me = await meResponse.json();
        console.log("Usuario actual:", me);

        // Cargar perfil
        const perfilData = await GetUserByPerfil(me.id);
        console.log("Perfil cargado:", perfilData);
        
        setPerfil(perfilData);
        if (perfilData?.imagen) {
          setImagenPreview(`data:image/jpeg;base64,${perfilData.imagen}`);
          setImagenBase64(perfilData.imagen);
        }

        // Cargar todas las localidades
        const localidadesData = await fetchLocalidades();
        setTodasLasLocalidades(localidadesData);
        console.log("Todas las localidades cargadas:", localidadesData);

        // Si el perfil tiene localidad, cargar los datos completos de la localidad actual
        if (perfilData?.localidadIdLocalidad) {
          console.log("Buscando localidad actual ID:", perfilData.localidadIdLocalidad);
          
          const localidadActual = localidadesData.find(loc => loc.id === perfilData.localidadIdLocalidad);
          if (localidadActual) {
            setLocalidadSeleccionada(localidadActual);
            console.log("Localidad actual encontrada:", localidadActual);
          } else {
            // Si no se encuentra en la lista, intentar obtenerla por ID
            try {
              const localidadDetalle = await fetchLocalidadById(perfilData.localidadIdLocalidad);
              if (localidadDetalle) {
                setLocalidadSeleccionada(localidadDetalle);
                console.log("Localidad actual cargada por ID:", localidadDetalle);
              }
            } catch (error) {
              console.error("Error cargando localidad actual:", error);
            }
          }
        }

      } catch (error) {
        console.error("Error cargando datos:", error);
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  // Filtrar localidades basado en la búsqueda
  const localidadesFiltradas = todasLasLocalidades.filter(localidad =>
    localidad.nombre.toLowerCase().includes(busquedaLocalidad.toLowerCase()) ||
    localidad.nombreProvinciaIdProvincia.toLowerCase().includes(busquedaLocalidad.toLowerCase())
  );

  const seleccionarLocalidad = (localidad: Localidad) => {
    setLocalidadSeleccionada(localidad);
    setBusquedaLocalidad(`${localidad.nombre}, ${localidad.nombreProvinciaIdProvincia}`);
    setMostrarDropdown(false);
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagenFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagenPreview(result);
        // Extraer solo la parte base64 (sin el prefijo data:image/...)
        const base64 = result.split(',')[1];
        setImagenBase64(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!perfil) return;

    setGuardando(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      
      // Usar la localidad seleccionada o la actual del perfil
      const localidadId = localidadSeleccionada?.id || perfil.localidadIdLocalidad;
      
      if (!localidadId) {
        setError("Por favor selecciona una localidad");
        setGuardando(false);
        return;
      }

      // Crear objeto con los datos para enviar como JSON
      const datosPerfil = {
        id: perfil.id,
        razonSocial: formData.get("razonSocial") as string,
        descripcion: formData.get("descripcion") as string,
        cuitCuil: parseInt(formData.get("cuitCuil") as string),
        cbu: parseInt(formData.get("cbu") as string),
        alias: formData.get("alias") as string,
        usuarioIdUsuario: perfil.usuarioIdUsuario,
        localidadIdLocalidad: localidadId,
        imagen: imagenBase64 || perfil.imagen // Usar nueva imagen o la actual
      };

      console.log("Enviando datos del perfil:", datosPerfil);
      const resultado = await editarPerfilAction(datosPerfil);

      if (resultado.success) {
        setMostrarModalExito(true);
      } else {
        setError(resultado.error || "Error al actualizar el perfil");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error inesperado al actualizar el perfil");
    } finally {
      setGuardando(false);
    }
  };

  const handleAceptar = () => {
    setMostrarModalExito(false);
    router.push("/Perfil");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed" 
           style={{ backgroundImage: "url('/background-login.png')" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed" 
           style={{ backgroundImage: "url('/background-login.png')" }}>
        <p className="text-red-600 text-lg bg-white p-4 rounded-lg">No se pudo cargar el perfil</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed p-4"
           style={{ backgroundImage: "url('/background-login.png')" }}>
        
        {/* Botón Volver - Posicionado correctamente */}
        <button
          type="button"
          onClick={() => router.back()}
          className="fixed top-24 left-6 bg-white text-center w-48 rounded-2xl h-14 text-black text-xl font-semibold group z-40"
        >
          <div className="bg-green-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" height="25px" width="25px">
              <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" fill="#000" />
              <path
                d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                fill="#000"
              />
            </svg>
          </div>
          <p className="translate-x-2">Volver</p>
        </button>

        <div className="bg-[#C5E9BE] rounded-2xl shadow-lg p-6 w-full max-w-2xl">
          
          <div className="flex flex-col items-center mb-6">
            <img src="/logo.png" alt="logo" className="w-10 h-10 mb-2" />
            <h1 className="text-xl font-bold text-gray-800">Editar Perfil</h1>
            <h2 className="text-lg font-[cursive] text-gray-800">Comunidad Solidaria</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Imagen de Perfil */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800">
                Imagen de Perfil
              </label>
              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  {imagenPreview ? (
                    <img 
                      src={imagenPreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : perfil.imagen ? (
                    <img 
                      src={`data:image/jpeg;base64,${perfil.imagen}`}
                      alt="Perfil actual" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600">Sin imagen</span>
                    </div>
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white text-gray-800 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                >
                  Cambiar Imagen
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImagenChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Razón Social */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800">
                Razón Social 
              </label>
              <input
                type="text"
                name="razonSocial"
                defaultValue={perfil.razonSocial}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800">
                Descripción 
              </label>
              <textarea
                name="descripcion"
                defaultValue={perfil.descripcion}
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 resize-none"
                required
              />
            </div>

            {/* Localidad con buscador */}
            <div className="relative">
              <label className="block text-sm font-semibold mb-1 text-gray-800">
                Localidad 
              </label>
              
              {/* Mostrar localidad actual si existe */}
              {localidadSeleccionada && !mostrarDropdown && (
                <div className="mb-2 p-2 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    <strong>Localidad actual:</strong> {localidadSeleccionada.nombre}, {localidadSeleccionada.nombreProvinciaIdProvincia}
                  </p>
                </div>
              )}

              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar localidad..."
                  value={busquedaLocalidad}
                  onChange={(e) => {
                    setBusquedaLocalidad(e.target.value);
                    setMostrarDropdown(true);
                  }}
                  onFocus={() => setMostrarDropdown(true)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
                />
                
                {mostrarDropdown && localidadesFiltradas.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {localidadesFiltradas.map((localidad) => (
                      <div
                        key={localidad.id}
                        onClick={() => seleccionarLocalidad(localidad)}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-800">{localidad.nombre}</div>
                        <div className="text-xs text-gray-600">{localidad.nombreProvinciaIdProvincia}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <p className="text-xs text-gray-600 mt-1">
                Escribe para buscar localidades. Se mostrará la provincia automáticamente.
              </p>
            </div>

            {/* CUIT/CUIL */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800">
                CUIT/CUIL 
              </label>
              <input
                type="number"
                name="cuitCuil"
                defaultValue={perfil.cuitCuil}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
                required
              />
            </div>

            {/* CBU */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800">
                CBU 
              </label>
              <input
                type="number"
                name="cbu"
                defaultValue={perfil.cbu}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
                required
              />
            </div>

            {/* Alias */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800">
                Alias 
              </label>
              <input
                type="text"
                name="alias"
                defaultValue={perfil.alias}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
                required
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg text-center text-sm">
                {error}
              </div>
            )}

            <div className="border-t border-gray-400 my-2"></div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-400 transition flex-1 text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={guardando}
                className="bg-white text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition flex-1 text-sm disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {guardando ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-800 mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  "Guardar Cambios"
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-600">
                 Todos los campos son obligatorios
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de Éxito - Mismo diseño que los anteriores */}
      {mostrarModalExito && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Ventana modal - Sin fondo oscuro detrás */}
          <div className="bg-[#C5E9BE] rounded-2xl shadow-2xl p-6 w-full max-w-sm relative z-10 border-2 border-green-300 transform transition-all duration-300 scale-100">
            <div className="text-center">
              {/* Icono de éxito */}
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              {/* Título y mensaje */}
              <h3 className="text-xl font-bold text-green-700 mb-2">¡Perfil Actualizado!</h3>
              <p className="text-gray-700 mb-1">
                Los cambios en tu perfil se han guardado correctamente.
              </p>
              <p className="text-gray-600 text-sm mb-6">
                Tu información ha sido actualizada con éxito.
              </p>
              
              {/* Botón de acción */}
              <button
                onClick={handleAceptar}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition w-full transform hover:scale-105"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}