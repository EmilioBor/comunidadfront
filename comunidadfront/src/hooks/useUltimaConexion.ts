// src/hooks/useUltimaConexion.ts
"use client";

import { useState, useEffect } from 'react';

// Sistema de mapeo perfilId -> usuarioId
const obtenerMapeoPerfilUsuario = (): Record<number, number> => {
  try {
    return JSON.parse(localStorage.getItem('mapeoPerfilUsuario') || '{}');
  } catch {
    return {};
  }
};

const guardarMapeoPerfilUsuario = (perfilId: number, usuarioId: number) => {
  try {
    const mapeo = obtenerMapeoPerfilUsuario();
    mapeo[perfilId] = usuarioId;
    localStorage.setItem('mapeoPerfilUsuario', JSON.stringify(mapeo));
    console.log(`🗺️ Mapeo guardado: perfil ${perfilId} -> usuario ${usuarioId}`);
  } catch (error) {
    console.error("Error guardando mapeo:", error);
  }
};

// Hook para registrar MI propia conexión
export const useRegistroConexion = (usuarioId: number, perfilId?: number) => {
  useEffect(() => {
    if (!usuarioId || usuarioId === 0) {
      console.log("⚠️ useRegistroConexion: usuarioId no válido", usuarioId);
      return;
    }

    // Si tenemos perfilId, guardar el mapeo
    if (perfilId && perfilId > 0) {
      guardarMapeoPerfilUsuario(perfilId, usuarioId);
    }

    console.log("🔔 Registrando conexión para usuario:", usuarioId);
    
    const registrarConexion = () => {
      const ahora = new Date().toISOString();
      
      // Registrar mi propia conexión
      localStorage.setItem(`ultimaConexion_${usuarioId}`, ahora);
      
      // También guardar en una lista global de conexiones
      try {
        const conexionesGlobales = JSON.parse(localStorage.getItem('conexionesGlobales') || '{}');
        conexionesGlobales[usuarioId] = ahora;
        localStorage.setItem('conexionesGlobales', JSON.stringify(conexionesGlobales));
        console.log(`✅ Conexión registrada para usuario ${usuarioId}`);
      } catch (error) {
        console.error("Error guardando conexión global:", error);
      }
    };

    // Registrar inmediatamente
    registrarConexion();

    // Registrar en intervalos (cada 30 segundos) - REDUCIDO para menos spam
    const interval = setInterval(registrarConexion, 30000);

    // Registrar en eventos de actividad - SIMPLIFICADO
    const handleActivity = () => {
      registrarConexion();
    };

    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keypress', handleActivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keypress', handleActivity);
    };
  }, [usuarioId, perfilId]);
};

// Hook para obtener última conexión de cualquier usuario
export const useObtenerUltimaConexion = (usuarioId: number, perfilId?: number) => {
  const [ultimaConexion, setUltimaConexion] = useState<string>('Calculando...');
  const [color, setColor] = useState<string>('text-gray-600');

  // Asegurar que perfilId siempre tenga un valor numérico (0 si es undefined/null)
  const perfilIdEstable = perfilId || 0;

  useEffect(() => {
    if ((!usuarioId || usuarioId === 0) && (!perfilIdEstable || perfilIdEstable === 0)) {
      console.log("⚠️ useObtenerUltimaConexion: Sin IDs válidos");
      setUltimaConexion("No disponible");
      setColor("text-gray-600");
      return;
    }

    console.log("🔍 Buscando conexión para:", { usuarioId, perfilId: perfilIdEstable });

    const calcularUltimaConexion = () => {
      try {
        let usuarioIdFinal = usuarioId;
        
        // Si no tenemos usuarioId pero tenemos perfilId, buscar en el mapeo
        if ((!usuarioId || usuarioId === 0) && perfilIdEstable && perfilIdEstable > 0) {
          const mapeo = obtenerMapeoPerfilUsuario();
          usuarioIdFinal = mapeo[perfilIdEstable];
          console.log(`🗺️ Mapeo encontrado para perfil ${perfilIdEstable}: usuario ${usuarioIdFinal}`);
        }

        if (!usuarioIdFinal || usuarioIdFinal === 0) {
          setUltimaConexion("No disponible");
          setColor("text-gray-600");
          return;
        }

        // Buscar conexión
        const conexionesGlobales = JSON.parse(localStorage.getItem('conexionesGlobales') || '{}');
        const conexionGuardada = conexionesGlobales[usuarioIdFinal] || localStorage.getItem(`ultimaConexion_${usuarioIdFinal}`);
        
        console.log(`📊 Conexión encontrada para ${usuarioIdFinal}:`, conexionGuardada);

        if (!conexionGuardada) {
          setUltimaConexion("No disponible");
          setColor("text-gray-600");
          return;
        }

        const ahora = new Date();
        const ultimaConexionDate = new Date(conexionGuardada);
        const diferenciaMs = ahora.getTime() - ultimaConexionDate.getTime();
        
        const minutos = Math.floor(diferenciaMs / (1000 * 60));
        const horas = Math.floor(diferenciaMs / (1000 * 60 * 60));
        const dias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
        
        let texto = "";
        let colorClase = "";

        if (minutos < 1) {
          texto = "Activo ahora";
          colorClase = "text-green-600";
        } else if (minutos < 60) {
          texto = `Hace ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
          colorClase = minutos <= 5 ? "text-green-500" : "text-green-400";
        } else if (horas < 24) {
          texto = `Hace ${horas} hora${horas !== 1 ? 's' : ''}`;
          colorClase = horas <= 1 ? "text-yellow-600" : "text-yellow-500";
        } else if (dias < 7) {
          texto = `Hace ${dias} día${dias !== 1 ? 's' : ''}`;
          colorClase = "text-orange-500";
        } else {
          texto = ultimaConexionDate.toLocaleDateString('es-AR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
          colorClase = "text-gray-600";
        }

        console.log(`🕒 Última conexión: ${texto} para usuario ${usuarioIdFinal}`);
        setUltimaConexion(texto);
        setColor(colorClase);
      } catch (error) {
        console.error("Error calculando última conexión:", error);
        setUltimaConexion("Error");
        setColor("text-red-600");
      }
    };

    calcularUltimaConexion();
    
    // Actualizar cada minuto
    const interval = setInterval(calcularUltimaConexion, 60000);
    
    return () => clearInterval(interval);
  }, [usuarioId, perfilIdEstable]); // ← Array de dependencias estable

  return { ultimaConexion, color };
};