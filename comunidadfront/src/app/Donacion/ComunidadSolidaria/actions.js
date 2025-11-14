'use server'

import { postDonacion } from "@/app/lib/api/donacionApi";
import { getDonacionTipos } from "@/app/lib/api/donacionTipoApi";

// Acción para crear una donación
export async function crearDonacion(data) {
  try {
    const resultado = await postDonacion(data);
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