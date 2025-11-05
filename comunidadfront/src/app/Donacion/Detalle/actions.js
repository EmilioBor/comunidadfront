'use server';

import { getDonacionById } from "../../lib/api/donacionApi";

// 🔵 Obtener detalle de una donación específica
export async function obtenerDetalleDonacion(id) {
  try {
    const response = await getDonacionById(id);
    console.log("📦 Detalle de donación obtenido:", response);
    return response;
  } catch (error) {
    console.error("❌ Error al obtener detalle de donación:", error.response?.data || error.message);
    throw error;
  }
}
