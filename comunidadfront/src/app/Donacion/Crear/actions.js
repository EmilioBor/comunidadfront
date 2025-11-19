// app/Donacion/Crear/actions.js
'use server'

import { postDonacion } from "@/app/lib/api/donacionApi";
import { getDonacionTipos } from "@/app/lib/api/donacionTipoApi";

// Acción para crear una donación
export async function crearDonacion(data) {
  try {
    // Asegúrate de que los nombres de las propiedades coincidan con el DTO del backend
    const donacionData = {
      descripcion: data.descripcion,
      fechaHora: data.fechaHora,
      donacionTipoIdDonacionTipo: data.donacionTipoIdDonacionTipo,
      perfilIdPerfil: data.perfilIdPerfil,
      perfilDonanteIdPerfilDonante: data.perfilDonanteIdPerfilDonante,
      publicacionIdPublicacion: data.publicacionIdPublicacion
    };
    
    console.log("Enviando datos de donación al backend:", donacionData);
    
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
    
    console.log("✅ Donación creada con ID:", donacionId);
    
    return { 
      success: true, 
      data: {
        id: donacionId // ← ENVIAMOS SOLO EL ID PARA LA REDIRECCIÓN
      },
      message: "Donación creada exitosamente"
    };
  } catch (error) {
    console.error('Error en acción crearDonacion:', error);
    return { 
      success: false, 
      error: error.response?.data || error.message,
      message: "Error al crear la donación"
    };
  }
}

// Acción para obtener tipos de donación (sin cambios)
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