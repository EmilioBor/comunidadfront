// app/Donacion/Crear/page.tsx - VERSIÓN CORREGIDA
"use client";

import React, { useState, useEffect } from "react";
import { crearDonacion, obtenerTiposDonacion } from "./actions";
import { useRouter, useSearchParams } from "next/navigation";

interface DonacionTipo {
  id: number;
  descripcion: string;
}

interface Perfil {
  id: number;
  razonSocial: string;
  email?: string;
}

interface UserMe {
  id: number;
  rol: string;
}

export default function CrearDonacion() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [descripcion, setDescripcion] = useState("");
  const [tipoDonacionId, setTipoDonacionId] = useState("");
  const [tiposDonacion, setTiposDonacion] = useState<DonacionTipo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [perfilDonante, setPerfilDonante] = useState<Perfil | null>(null);
  const [perfilDestino, setPerfilDestino] = useState<Perfil | null>(null);

  // Obtener parámetros de la URL
  const publicacionId = searchParams.get('publicacionId');
  const perfilDestinoId = searchParams.get('perfilDestinoId');
  const razonSocialDestino = searchParams.get('razonSocialDestino');

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

  // Función para obtener perfil destino por ID
  const obtenerPerfilPorId = async (id: string | null): Promise<Perfil | null> => {
    if (!id) {
      return null;
    }

    try {
      const url = `https://localhost:7168/api/Perfil/v1/perfil/${id}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        return null;
      }
      
      const perfilData = await response.json();
      return perfilData;
    } catch (error) {
      console.log('Error obteniendo perfil destino:', error);
      return null;
    }
  };

  // Función para obtener perfil por nombre
  const obtenerPerfilPorNombre = async (nombre: string): Promise<Perfil | null> => {
    try {
      const url = `https://localhost:7168/api/Perfil/v1/perfil/nombre/${encodeURIComponent(nombre)}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        return null;
      }
      
      const perfilData = await response.json();
      return perfilData;
    } catch (error) {
      console.log('Error obteniendo perfil por nombre:', error);
      return null;
    }
  };

  // Función para crear perfil temporal
  const crearPerfilTemporal = (): Perfil => {
    return {
      id: parseInt(perfilDestinoId || "0"),
      razonSocial: razonSocialDestino || "Destinatario de la donación",
      email: ""
    };
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

        // 1. Cargar tipos de donación
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

        // 2. Cargar perfil del donante (usuario logueado)
        const perfilDonanteData = await obtenerPerfilLogueado();
        
        if (!perfilDonanteData) {
          setError("No se pudo identificar tu perfil. Por favor, inicia sesión o completa tu perfil.");
          return;
        }
        setPerfilDonante(perfilDonanteData);

        // 3. Cargar perfil destino
        let perfilDestinoData: Perfil | null = null;
        
        // Buscar por ID si está disponible
        if (perfilDestinoId) {
          perfilDestinoData = await obtenerPerfilPorId(perfilDestinoId);
        }

        // Si no se encontró por ID, buscar por nombre
        if (!perfilDestinoData && razonSocialDestino) {
          perfilDestinoData = await obtenerPerfilPorNombre(razonSocialDestino);
        }
        
        // Si aún no se encontró, crear perfil temporal
        if (!perfilDestinoData) {
          perfilDestinoData = crearPerfilTemporal();
        }
        
        setPerfilDestino(perfilDestinoData);

      } catch (error) {
        setError("Error inesperado al cargar los datos. Por favor, intenta nuevamente.");
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [perfilDestinoId, razonSocialDestino]);

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

    if (!perfilDestino) {
      setError("No se pudo cargar la información del destinatario");
      setEnviando(false);
      return;
    }

    // Validar que el perfil destino tenga un ID válido
    if (!perfilDestino.id || perfilDestino.id === 0) {
      setError("El destinatario de la donación no es válido");
      setEnviando(false);
      return;
    }

    const donacion = {
      descripcion: descripcion || `Donación para: ${perfilDestino.razonSocial}`,
      fechaHora: new Date().toISOString(),
      donacionTipoIdDonacionTipo: parseInt(tipoDonacionId),
      perfilIdPerfil: perfilDestino.id,
      perfilDonanteIdPerfilDonante: perfilDonante.id,
      publicacionIdPublicacion: publicacionId ? parseInt(publicacionId) : null,
    };

    console.log("Enviando donación:", donacion);

    try {
      const resultado = await crearDonacion(donacion);

      if (resultado.success && resultado.data?.id) {
        console.log("✅ Donación creada exitosamente, ID:", resultado.data.id);
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
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed" 
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
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed p-4" 
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
              onClick={() => router.back()}
              className="flex-1 bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg shadow hover:bg-gray-400 transition"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed p-4" 
         style={{ backgroundImage: "url('/background-login.png')" }}>
      
      <div className="bg-[#C5E9BE] rounded-2xl shadow-lg p-6 w-full max-w-md text-gray-800">
        
        {/* Header */}
        <div className="text-center mb-4">
          <img src="/logo.png" alt="logo" className="w-10 h-10 mx-auto mb-2" />
          <h1 className="text-xl font-bold">Realizar Donación</h1>
          <h2 className="text-lg font-[cursive]">Comunidad Solidaria</h2>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg text-center text-sm mb-4">
            {error}
          </div>
        )}

        {/* Info del perfil destino - SIMPLIFICADA */}
        {perfilDestino && (
          <div className="bg-white rounded-lg p-4 mb-4 border border-green-300">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-green-400 bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">
                  {perfilDestino.razonSocial.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="font-medium text-gray-800 text-sm">
                Donando a: <span className="font-semibold">{perfilDestino.razonSocial}</span>
              </h3>
              {perfilDestino.email && (
                <p className="text-gray-500 text-xs mt-1">{perfilDestino.email}</p>
              )}
              {perfilDestino.id === 0 && (
                <p className="text-yellow-600 text-xs mt-2">⚠️ Información básica del destinatario</p>
              )}
            </div>
          </div>
        )}

        {/* Info del perfil donante - SIMPLIFICADA */}
        {perfilDonante && (
          <div className="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-200">
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">
                  {perfilDonante.razonSocial.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-blue-700">
                Donante: <span className="font-semibold">{perfilDonante.razonSocial}</span>
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleCrearDonacion} className="space-y-4">
          
          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold mb-1">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe tu donación..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700 resize-none text-sm min-h-[80px]"
              required
            />
          </div>

          {/* Tipo de Donación */}
          <div>
            <label className="block text-sm font-semibold mb-1">Tipo de Donación</label>
            <select
              value={tipoDonacionId}
              onChange={(e) => setTipoDonacionId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700 text-sm"
              required
            >
              <option value="" disabled>Selecciona un tipo...</option>
              {tiposDonacion.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>{tipo.descripcion}</option>
              ))}
            </select>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg shadow hover:bg-gray-400 transition text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando || !perfilDonante || !perfilDestino || perfilDestino.id === 0}
              className="flex-1 bg-white text-gray-800 font-semibold py-2 rounded-lg shadow hover:bg-gray-200 transition text-sm disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {enviando ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-800 mr-2"></div>
                  Enviando...
                </>
              ) : (
                "Enviar Donación"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}