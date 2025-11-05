'use server';

import { postDonacion } from "../../lib/api/donacionApi";
import { getDonacionTipos } from "../../lib/api/donacionTipoApi";

// 🟢 Crear donación desde la sección Donación/Crear
export async function crearDonacion(data) {
    try {
        const response = await postDonacion(data);
        console.log("✅ Donación creada correctamente:", response);
        return response;
    } catch (error) {
        console.error("❌ Error al crear donación:", error.response?.data || error.message);
        throw error;
    }
}

// 🟣 Obtener los tipos de donación disponibles
export async function obtenerTiposDonacion() {
    try {
        const response = await getDonacionTipos();
        console.log("📦 Tipos de donación obtenidos:", response);
        return response;
    } catch (error) {
        console.error("❌ Error al obtener tipos de donación:", error.response?.data || error.message);
        throw error;
    }
}
