// app/Donacion/ComunidadSolidaria/page.tsx - VERSIÓN MÁS COMPACTA
"use client";

import React, { useState, useEffect } from "react";
import { crearDonacionComunidadSolidaria, obtenerTiposDonacion, obtenerPerfilComunidadSolidaria } from "./actions";
import { useRouter } from "next/navigation";

interface DonacionTipo {
  id: number;
  descripcion: string;
}

interface Perfil {
  id: number;
  razonSocial: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  fotoPerfil?: string;
}

interface UserMe {
  id: number;
  rol: string;
}

export default function DonacionComunidadSolidaria() {
  const router = useRouter();
  
  const [descripcion, setDescripcion] = useState("");
  const [tipoDonacionId, setTipoDonacionId] = useState("");
  const [tiposDonacion, setTiposDonacion] = useState<DonacionTipo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [perfilDonante, setPerfilDonante] = useState<Perfil | null>(null);
  const [perfilComunidadSolidaria, setPerfilComunidadSolidaria] = useState<Perfil | null>(null);

  // Función para obtener la URL completa de la imagen
  const getImagenUrl = (fotoPerfil: string | undefined) => {
    if (!fotoPerfil) return null;
    
    // Si ya es una URL completa, retornarla
    if (fotoPerfil.startsWith('http')) {
      return fotoPerfil;
    }
    
    // Si es un path relativo, construir la URL completa
    return `https://localhost:7168${fotoPerfil.startsWith('/') ? '' : '/'}${fotoPerfil}`;
  };

  // Función para obtener el usuario logueado
  const obtenerUsuarioLogueado = async (): Promise<UserMe | null> => {
    try {
      const response = await fetch("/api/user/me");
      if (!response.ok) {
        throw new Error('No se pudo obtener el usuario logueado');
      }
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo usuario logueado:', error);
      return null;
    }
  };

  // Función para obtener perfil por ID de usuario
  const obtenerPerfilPorUserId = async (userId: number): Promise<Perfil | null> => {
    try {
      const response = await fetch(`https://localhost:7168/api/Perfil/v1/perfil/user/${userId}`);
      
      if (!response.ok) {
        console.log("Error en respuesta perfil usuario:", response.status);
        return null;
      }
      
      const perfilData = await response.json();
      return perfilData;
    } catch (error) {
      console.log('Error obteniendo perfil por userId:', error);
      return null;
    }
  };

  // Función principal para obtener el perfil logueado
  const obtenerPerfilLogueado = async (): Promise<Perfil | null> => {
    try {
      const usuario = await obtenerUsuarioLogueado();
      
      if (!usuario) {
        return null;
      }

      const perfil = await obtenerPerfilPorUserId(usuario.id);
      return perfil;
    } catch (error) {
      console.error('Error en obtenerPerfilLogueado:', error);
      return null;
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        setError("");

        // 1. Cargar perfil de Comunidad Solidaria
        const resultadoComunidad = await obtenerPerfilComunidadSolidaria();
        if (!resultadoComunidad.success || !resultadoComunidad.data) {
          setError(resultadoComunidad.message || "No se pudo encontrar el perfil de Comunidad Solidaria");
          return;
        }
        setPerfilComunidadSolidaria(resultadoComunidad.data);

        // 2. Cargar tipos de donación
        const resultadoTipos = await obtenerTiposDonacion();
        if (resultadoTipos.success) {
          setTiposDonacion(resultadoTipos.data);
          if (resultadoTipos.data.length > 0) {
            setTipoDonacionId(resultadoTipos.data[0].id.toString());
          }
        } else {
          setError("No se pudieron cargar los tipos de donación");
          return;
        }

        // 3. Cargar perfil del donante (usuario logueado)
        const perfilDonanteData = await obtenerPerfilLogueado();
        
        if (!perfilDonanteData) {
          setError("No se pudo identificar tu perfil. Por favor, inicia sesión o completa tu perfil.");
          return;
        }
        setPerfilDonante(perfilDonanteData);

      } catch (error) {
        console.error('Error inesperado:', error);
        setError("Error inesperado al cargar los datos. Por favor, intenta nuevamente.");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  // Efecto para deshabilitar el scroll del body
  useEffect(() => {
    // Deshabilitar el scroll
    document.body.style.overflow = 'hidden';
    
    // Cleanup: restaurar el scroll cuando el componente se desmonte
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleCrearDonacion = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError("");

    if (!tipoDonacionId) {
      setError("Por favor selecciona un tipo de donación");
      setEnviando(false);
      return;
    }

    if (!perfilDonante) {
      setError("No se pudo identificar tu perfil");
      setEnviando(false);
      return;
    }

    if (!perfilComunidadSolidaria) {
      setError("No se pudo cargar la información de Comunidad Solidaria");
      setEnviando(false);
      return;
    }

    const donacion = {
      descripcion: descripcion || `Donación a Comunidad Solidaria`,
      fechaHora: new Date().toISOString(),
      donacionTipoIdDonacionTipo: parseInt(tipoDonacionId),
      perfilIdPerfil: perfilComunidadSolidaria.id, // SIEMPRE el ID de Comunidad Solidaria
      perfilDonanteIdPerfilDonante: perfilDonante.id,
      publicacionIdPublicacion: null, // Siempre null para donaciones directas a la plataforma
    };

    console.log("Enviando donación a Comunidad Solidaria:", donacion);

    try {
      const resultado = await crearDonacionComunidadSolidaria(donacion);

      if (resultado.success && resultado.data?.id) {
        console.log("✅ Donación a Comunidad Solidaria creada exitosamente, ID:", resultado.data.id);
        // REDIRIGIR A DETALLE CON EL ID DE LA DONACIÓN
        router.push(`/Donacion/Detalle?donacionId=${resultado.data.id}`);
      } else if (resultado.success && !resultado.data?.id) {
        console.error("⚠️ Donación creada pero no se obtuvo el ID");
        setError("Donación creada, pero hubo un problema al obtener el ID. Contacta soporte.");
      } else {
        console.error("❌ Error al crear donación:", resultado.message);
        setError(resultado.message || "Error al crear la donación");
      }
    } catch (error) {
      console.error("💥 Error inesperado:", error);
      setError("Error inesperado al enviar la donación");
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) {
    return (
      <div className="h-screen flex items-center justify-center bg-cover bg-center bg-fixed p-4" 
           style={{ backgroundImage: "url('/background-login.png')" }}>
        <div className="bg-[#C5E9BE] rounded-2xl shadow-lg p-8 w-full max-w-md text-gray-800 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-3 text-gray-600 text-sm">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error && !perfilDonante) {
    return (
      <div className="h-screen flex items-center justify-center bg-cover bg-center bg-fixed p-4" 
           style={{ backgroundImage: "url('/background-login.png')" }}>
        <div className="bg-[#C5E9BE] rounded-2xl shadow-lg p-6 w-full max-w-md text-gray-800 text-center">
          <div className="text-red-600 mb-4 whitespace-pre-line">{error}</div>
          <div className="flex gap-3">
            {error.includes('inicia sesión') && (
              <button
                onClick={() => router.push('/auth/login')}
                className="flex-1 bg-green-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-green-700 transition"
              >
                Iniciar Sesión
              </button>
            )}
            {error.includes('completa tu perfil') && (
              <button
                onClick={() => router.push('/Perfil/Crear')}
                className="flex-1 bg-green-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-green-700 transition"
              >
                Completar Perfil
              </button>
            )}
            <button
              onClick={() => router.push('/')}
              className="flex-1 bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg shadow hover:bg-gray-400 transition"
            >
              Ir al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  const imagenDonante = getImagenUrl(perfilDonante?.fotoPerfil);

  return (
    <div className="h-screen flex items-center justify-center bg-cover bg-center bg-fixed p-4" 
         style={{ backgroundImage: "url('/background-login.png')" }}>
      
      {/* Contenedor principal MÁS COMPACTO */}
      <div className="bg-[#C5E9BE] rounded-2xl shadow-lg p-5 w-full max-w-sm text-gray-800">
        
        {/* Header más compacto */}
        <div className="text-center mb-3">
          <img src="/logo.png" alt="logo" className="w-8 h-8 mx-auto mb-1" />
          <h1 className="text-lg font-bold">Donar a la Plataforma</h1>
          <h2 className="text-md font-[cursive]">Comunidad Solidaria</h2>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-1 rounded-lg text-center text-xs mb-3">
            {error}
          </div>
        )}

        {/* Info de Comunidad Solidaria más compacta */}
        {perfilComunidadSolidaria && (
          <div className="bg-white rounded-lg p-3 mb-3 border-2 border-green-400">
            <div className="text-center">
              {/* Logo de Comunidad Solidaria más pequeño */}
              <div className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-green-500 bg-white flex items-center justify-center overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="Logo Comunidad Solidaria"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-gray-800 text-md mb-1">
                {perfilComunidadSolidaria.razonSocial}
              </h3>
              <p className="text-gray-600 text-xs mb-2">
                Tu donación ayuda a mantener y mejorar nuestra plataforma solidaria
              </p>
              {perfilComunidadSolidaria.email && (
                <p className="text-gray-500 text-xs">📧 {perfilComunidadSolidaria.email}</p>
              )}
            </div>
          </div>
        )}

        {/* Info del perfil donante más compacta */}
        {perfilDonante && (
          <div className="bg-blue-50 rounded-lg p-2 mb-3 border border-blue-200">
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center overflow-hidden">
                {imagenDonante ? (
                  <img 
                    src={imagenDonante} 
                    alt={`Foto de ${perfilDonante.razonSocial}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextSibling?.style.display = 'flex';
                    }}
                  />
                ) : null}
                <span 
                  className={`text-blue-600 font-bold text-xs ${imagenDonante ? 'hidden' : 'flex items-center justify-center w-full h-full'}`}
                >
                  {perfilDonante.razonSocial.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-blue-700">
                Donante: <span className="font-semibold">{perfilDonante.razonSocial}</span>
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleCrearDonacion} className="space-y-3">
          
          {/* Descripción más compacta */}
          <div>
            <label className="block text-xs font-semibold mb-1">Descripción de la Donación</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe en qué quieres que se utilice tu donación o deja un mensaje..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700 resize-none text-xs min-h-[60px]"
              required
            />
          </div>

          {/* Tipo de Donación más compacto */}
          <div>
            <label className="block text-xs font-semibold mb-1">Tipo de Donación</label>
            <select
              value={tipoDonacionId}
              onChange={(e) => setTipoDonacionId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700 text-xs"
              required
            >
              <option value="" disabled>Selecciona un tipo...</option>
              {tiposDonacion.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>{tipo.descripcion}</option>
              ))}
            </select>
          </div>

          {/* Mensaje informativo más compacto */}
          

          {/* Botones más compactos */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => router.push('/Inicio')}
              className="flex-1 bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg shadow hover:bg-gray-400 transition text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando || !perfilDonante || !perfilComunidadSolidaria}
              className="flex-1 bg-white text-gray-800 font-semibold py-2 rounded-lg shadow hover:bg-gray-200 transition text-xs disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {enviando ? (
                <>
                  <div className="animate-spin rounded-full h-2 w-2 border-b-2 border-gray-800 mr-1"></div>
                  Enviando...
                </>
              ) : (
                "Donar a la Plataforma"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}