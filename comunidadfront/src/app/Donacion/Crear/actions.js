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
    return { 
      success: true, 
      data: resultado,
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

// Acción para obtener tipos de donación
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