'use server';

import { getDonacionById } from "../../lib/api/donacionApi";

// 🟦 Obtener una donación junto con sus detalles y envío
export async function obtenerDetalleDonacion(id) {
  try {
    const response = await getDonacionById(id);

    // Simulamos estructura más completa si el backend la devuelve parcialmente
    const detalle = {
      id: response.id,
      descripcion: response.descripcion,
      fechaHora: response.fechaHora,
      tipo: response.tipo, // DonacionTipo: Dinero, Ropa, etc.
      perfil: response.perfil || {},
      envio: response.envio || {},
      detalleDonacion: response.detalleDonacion || [],
      estado: response.estado || "En Proceso",
    };

    console.log("📦 Detalle de Donación obtenido:", detalle);
    return detalle;
  } catch (error) {
    console.error("❌ Error al obtener detalle de donación:", error.response?.data || error.message);
    throw error;
  }
}
