'use server'

import { postReporte } from "@/app/lib/api/reporteApi";

// Acción para crear un reporte
export async function crearReporte(data) {
  try {
    const resultado = await postReporte(data);
    return { 
      success: true, 
      data: resultado,
      message: "Reporte enviado exitosamente"
    };
  } catch (error) {
    console.error('Error en acción crearReporte:', error);
    return { 
      success: false, 
      error: error.response?.data || error.message,
      message: "Error al enviar el reporte"
    };
  }
}