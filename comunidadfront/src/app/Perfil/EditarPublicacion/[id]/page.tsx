// app/Perfil/EditarPublicacion/[id]/page.tsx - COMPLETO CORREGIDO
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { editarPublicacionAction, obtenerPublicacionPorIdAction } from "../actions";
import { fetchLocalidades } from "@/app/Comunidad/actions";
import { getPublicacionTipos } from "@/app/Comunidad/actions";
import { GetUserByPerfil } from "@/app/lib/api/perfil";

interface PublicacionType {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  fechaCreacion: string;
  localidadIdLocalidad: number;
  perfilIdPerfil: number;
  publicacionTipoIdPublicacionTipo: number;
  donacionIdDonacion?: number;
}

interface Localidad {
  id: number;
  nombre: string;
  codigoPostal: string;
  nombreProvinciaIdProvincia: string;
  provinciaIdProvincia: number;
}

interface PublicacionTipo {
  id: number;
  nombre: string;
}

interface PerfilType {
  id: number;
  nombre?: string;
  apellido?: string;
  email?: string;
}

export default function EditarPublicacionPage() {
  const router = useRouter();
  const params = useParams();
  const publicacionId = parseInt(params.id as string);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [publicacion, setPublicacion] = useState<PublicacionType | null>(null);
  const [perfilUsuario, setPerfilUsuario] = useState<PerfilType | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const [imagenBase64, setImagenBase64] = useState<string | null>(null);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);
  
  // Estados para formulario
  const [todasLasLocalidades, setTodasLasLocalidades] = useState<Localidad[]>([]);
  const [tiposPublicacion, setTiposPublicacion] = useState<PublicacionTipo[]>([]);
  const [localidadSeleccionada, setLocalidadSeleccionada] = useState<Localidad | null>(null);
  const [tipoPublicacionSeleccionado, setTipoPublicacionSeleccionado] = useState<number>(0);
  const [busquedaLocalidad, setBusquedaLocalidad] = useState("");
  const [mostrarDropdown, setMostrarDropdown] = useState(false);

  // Cargar datos
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        // 1. Obtener usuario actual
        const meResponse = await fetch("/api/user/me");
        if (!meResponse.ok) throw new Error("Error obteniendo usuario");
        
        const me = await meResponse.json();
        console.log("Usuario actual:", me);

        // 2. Obtener perfil del usuario
        const perfilData = await GetUserByPerfil(me.id);
        console.log("Perfil del usuario:", perfilData);
        
        if (!perfilData) {
          setError("No se pudo cargar el perfil del usuario");
          return;
        }
        
        setPerfilUsuario(perfilData);

        // 3. Cargar publicación
        const publicacionData = await obtenerPublicacionPorIdAction(publicacionId);
        console.log("Publicación cargada:", publicacionData);
        
        if (!publicacionData) {
          setError("No se pudo cargar la publicación");
          return;
        }
        
        // Si perfilIdPerfil es undefined, usar el del usuario
        if (publicacionData.perfilIdPerfil === undefined || publicacionData.perfilIdPerfil === null) {
          publicacionData.perfilIdPerfil = perfilData.id;
        }
        
        setPublicacion(publicacionData);

        // Configurar imagen
        if (publicacionData?.imagen) {
          setImagenPreview(`data:image/jpeg;base64,${publicacionData.imagen}`);
          setImagenBase64(publicacionData.imagen);
        }

        // 4. Cargar datos adicionales
        const [localidadesData, tiposData] = await Promise.all([
          fetchLocalidades(),
          getPublicacionTipos()
        ]);

        setTodasLasLocalidades(localidadesData);
        setTiposPublicacion(tiposData);

        // Establecer localidad actual
        if (publicacionData?.localidadIdLocalidad) {
          const localidadActual = localidadesData.find(loc => loc.id === publicacionData.localidadIdLocalidad);
          if (localidadActual) {
            setLocalidadSeleccionada(localidadActual);
            setBusquedaLocalidad(`${localidadActual.nombre}, ${localidadActual.nombreProvinciaIdProvincia}`);
          }
        }

        // Establecer tipo de publicación actual
        if (publicacionData?.publicacionTipoIdPublicacionTipo) {
          setTipoPublicacionSeleccionado(publicacionData.publicacionTipoIdPublicacionTipo);
        }

      } catch (error) {
        console.error("Error cargando datos:", error);
        setError("Error al cargar los datos de la publicación");
      } finally {
        setLoading(false);
      }
    };

    if (publicacionId) {
      cargarDatos();
    }
  }, [publicacionId]);

  // Filtrar localidades
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
      setError("");
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagenPreview(result);
        const base64 = result.split(',')[1];
        setImagenBase64(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!publicacion || !perfilUsuario) return;

    setGuardando(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      
      // Validaciones básicas
      if (!localidadSeleccionada) {
        setError("Por favor selecciona una localidad");
        setGuardando(false);
        return;
      }

      if (!tipoPublicacionSeleccionado) {
        setError("Por favor selecciona un tipo de publicación");
        setGuardando(false);
        return;
      }

      // Crear FormData para la Server Action
      const actionFormData = new FormData();
      actionFormData.append('id', publicacion.id.toString());
      actionFormData.append('titulo', formData.get("titulo") as string);
      actionFormData.append('descripcion', formData.get("descripcion") as string);
      actionFormData.append('localidadIdLocalidad', localidadSeleccionada.id.toString());
      actionFormData.append('publicacionTipoIdPublicacionTipo', tipoPublicacionSeleccionado.toString());
      actionFormData.append('perfilIdPerfil', perfilUsuario.id.toString());
      actionFormData.append('donacionIdDonacion', publicacion.donacionIdDonacion?.toString() || '');
      actionFormData.append('fechaCreacion', publicacion.fechaCreacion);
      actionFormData.append('imagen', imagenBase64 || publicacion.imagen || '');

      console.log("📤 Enviando FormData a Server Action");
      
      const resultado = await editarPublicacionAction(actionFormData);

      if (resultado.success) {
        setMostrarModalExito(true);
      } else {
        setError(resultado.error || "Error al actualizar la publicación");
      }
    } catch (err: any) {
      console.error("Error:", err);
      setError("Error inesperado al actualizar la publicación");
    } finally {
      setGuardando(false);
    }
  };

  const handleAceptar = () => {
    setMostrarModalExito(false);
    router.push("/Perfil");
  };

  const handleVolver = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed" 
           style={{ backgroundImage: "url('/background-login.png')" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando publicación...</p>
        </div>
      </div>
    );
  }

  if (!publicacion || !perfilUsuario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed" 
           style={{ backgroundImage: "url('/background-login.png')" }}>
        <p className="text-red-600 text-lg bg-white p-4 rounded-lg">No se pudo cargar la publicación o el perfil del usuario</p>
      </div>
    );
  }

  return (
    <>
      <div className={`min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed p-4 transition-all duration-300 ${
        mostrarModalExito ? 'blur-sm brightness-90' : ''
      }`} 
           style={{ backgroundImage: "url('/background-login.png')" }}>
        
        <button
          type="button"
          onClick={handleVolver}
          className="absolute top-6 left-6 bg-white text-center w-48 rounded-2xl h-14 text-black text-xl font-semibold group"
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
            <h1 className="text-xl font-bold text-gray-800">Editar Publicación</h1>
            <h2 className="text-lg font-[cursive] text-gray-800">Comunidad Solidaria</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Imagen */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800">
                Imagen de la Publicación
              </label>
              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-lg overflow-hidden border-4 border-white shadow-lg">
                  {imagenPreview ? (
                    <img 
                      src={imagenPreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : publicacion.imagen ? (
                    <img 
                      src={`data:image/jpeg;base64,${publicacion.imagen}`}
                      alt="Publicación actual" 
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

            {/* Título */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800">
                Título 
              </label>
              <input
                type="text"
                name="titulo"
                defaultValue={publicacion.titulo}
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
                defaultValue={publicacion.descripcion}
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 resize-none"
                required
              />
            </div>

            {/* Tipo de Publicación */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800">
                Tipo de Publicación 
              </label>
              <select
                value={tipoPublicacionSeleccionado}
                onChange={(e) => setTipoPublicacionSeleccionado(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
                required
              >
                <option value={0}>Selecciona un tipo</option>
                {tiposPublicacion.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Localidad */}
            <div className="relative">
              <label className="block text-sm font-semibold mb-1 text-gray-800">
                Localidad 
              </label>
              
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
                onClick={handleVolver}
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
                 Los campos marcados con * son obligatorios
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de éxito */}
      {mostrarModalExito && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-[2px]"></div>
          
          <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-auto border border-green-200 animate-in zoom-in-95 duration-300">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                ¡Publicación Actualizada!
              </h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Los cambios en tu publicación se han guardado correctamente.
              </p>
              
              <button
                onClick={handleAceptar}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 transform hover:scale-105 active:scale-95"
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