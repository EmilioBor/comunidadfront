// app/Perfil/VerPerfil/actions.js
"use server";

import { getPerfilId } from "@/app/lib/api/perfil";
import { GetLocalidadesByID } from "@/app/lib/api/localidad";
import { getPublicacionPerfil } from "@/app/lib/api/publicacion";
import { gethProvinciaById } from "@/app/lib/api/provincia";

// Función para obtener localidad con provincia
export async function obtenerLocalidadConProvincia(localidadId) {
  try {
    console.log("🔍 Buscando localidad completa con ID:", localidadId);
    
    if (!localidadId) {
      console.warn("ID de localidad inválido");
      return null;
    }

    // 1. Obtener la localidad
    const localidad = await GetLocalidadesByID(localidadId);
    console.log("📋 Localidad base encontrada:", localidad);
    
    if (!localidad) {
      return null;
    }

    // 2. Intentar obtener la provincia si la localidad tiene provinciaId
    let provinciaData = null;
    
    if (localidad.provinciaId) {
      try {
        console.log("📍 Buscando provincia con ID:", localidad.provinciaId);
        provinciaData = await gethProvinciaById(localidad.provinciaId);
        console.log("📍 Provincia encontrada:", provinciaData);
      } catch (provinciaError) {
        console.warn("No se pudo obtener la provincia:", provinciaError);
      }
    }

    // 3. Si la localidad ya tiene nombreProvinciaIdProvincia, usarlo como fallback
    if (!provinciaData && localidad.nombreProvinciaIdProvincia) {
      provinciaData = {
        nombre: localidad.nombreProvinciaIdProvincia
      };
    }

    // 4. Devolver la localidad enriquecida
    const localidadEnriquecida = {
      ...localidad,
      provincia: provinciaData
    };
    
    console.log("📍 Localidad enriquecida final:", localidadEnriquecida);
    return localidadEnriquecida;

  } catch (error) {
    console.error("Error en obtenerLocalidadConProvincia:", error);
    return null;
  }
}

export async function obtenerPublicacion(data) {
  try {
    console.log("🔍 Buscando publicaciones para:", data);
    const pubs = await getPublicacionPerfil(data);
    console.log("📋 Publicaciones encontradas:", pubs);
    return pubs;
  } catch (error) {
    console.error("Error en obtenerPublicacion:", error);
    return [];
  }
} 

export async function obtenerPerfilId(data) {
  try {
    console.log("🔍 Buscando perfil con ID:", data);
    const perfil = await getPerfilId(data);
    console.log("📋 Perfil encontrado:", perfil);
    return perfil;
  } catch (error) {
    console.error("Error en obtenerPerfilId:", error);
    return null;
  }
}