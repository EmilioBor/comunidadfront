// app/Donacion/ComunidadSolidaria/actions.js
'use server'

import { postDonacion } from "@/app/lib/api/donacionApi";
import { getDonacionTipos } from "@/app/lib/api/donacionTipoApi";

// Acción para crear donación a Comunidad Solidaria
export async function crearDonacionComunidadSolidaria(data) {
  try {
    const donacionData = {
      descripcion: data.descripcion,
      fechaHora: data.fechaHora,
      donacionTipoIdDonacionTipo: data.donacionTipoIdDonacionTipo,
      perfilIdPerfil: data.perfilIdPerfil, // ID de Comunidad Solidaria
      perfilDonanteIdPerfilDonante: data.perfilDonanteIdPerfilDonante,
      publicacionIdPublicacion: data.publicacionIdPublicacion
    };
    
    console.log("Enviando donación a Comunidad Solidaria:", donacionData);
    
    const resultado = await postDonacion(donacionData);
    
    // EXTRAER EL ID DE LA DONACIÓN CREADA
    const donacionId = resultado.id || resultado.donacionId || resultado.data?.id;
    
    if (!donacionId) {
      console.error("No se pudo obtener el ID de la donación creada:", resultado);
      return { 
        success: false, 
        message: "Donación creada pero no se pudo obtener el ID para redirección"
      };
    }
    
    console.log("✅ Donación a Comunidad Solidaria creada con ID:", donacionId);
    
    return { 
      success: true, 
      data: {
        id: donacionId
      },
      message: "¡Donación a Comunidad Solidaria creada exitosamente!"
    };
  } catch (error) {
    console.error('Error en acción crearDonacionComunidadSolidaria:', error);
    return { 
      success: false, 
      error: error.response?.data || error.message,
      message: "Error al crear la donación a Comunidad Solidaria"
    };
  }
}

// Acción para obtener tipos de donación (igual que antes)
export async function obtenerTiposDonacion() {
  try {
    const tipos = await getDonacionTipos();
    return { 
      success: true, 
      data: tipos 
    };
  } catch (error) {
    console.error('Error en acción obtenerTiposDonacion:', error);
    return { 
      success: false, 
      error: error.response?.data || error.message,
      data: [] 
    };
  }
}

// Acción específica para buscar el perfil de Comunidad Solidaria
export async function obtenerPerfilComunidadSolidaria() {
  try {
    const nombrePerfil = "Comunidad Solidaria";
    const url = `https://localhost:7168/api/Perfil/v1/perfil/nombre/${encodeURIComponent(nombrePerfil)}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error al buscar perfil: ${response.status}`);
    }
    
    const perfilData = await response.json();
    
    if (!perfilData || !perfilData.id) {
      throw new Error("No se encontró el perfil de Comunidad Solidaria");
    }
    
    return {
      success: true,
      data: perfilData
    };
  } catch (error) {
    console.error('Error obteniendo perfil Comunidad Solidaria:', error);
    return {
      success: false,
      error: error.message,
      message: "No se pudo encontrar el perfil de Comunidad Solidaria"
    };
  }
}