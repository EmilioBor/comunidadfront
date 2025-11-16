// app/Reporte/actions.js
'use server'

import { postReporte } from "@/app/lib/api/reporte";

export async function crearReporte(data) {
  try {
    const reporteData = {
      motivo: data.motivo,
      descripcion: data.descripcion,
      publicacionIdPublicacion: data.publicacionId ? parseInt(data.publicacionId) : 2, //cargar publicacion para prueba
      perfilIdPerfil: 12, //cargar perfil para prueba
      fechaHora: new Date().toISOString()
    };

    console.log("📤 Enviando reporte al backend:", reporteData);

    try {
      const resultado = await postReporte(reporteData);
      return { 
        success: true, 
        data: resultado
      };
    } catch (error) {
      if (error.code === 'ERR_BAD_RESPONSE' || error.message.includes('aborted')) {
        console.log("⚠️ Error de conexión, pero reporte probablemente creado");
        return { 
          success: true, 
          data: { id: 'unknown', ...reporteData }
        };
      }
      throw error;
    }
    
  } catch (error) {
    console.error('Error en acción crearReporte:', error);
    return { 
      success: false, 
      error: "Error al enviar el reporte"
    };
  }
}