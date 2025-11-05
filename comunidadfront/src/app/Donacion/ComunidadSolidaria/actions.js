'use server';

import { postDonacion } from "../../lib/api/donacionApi";
import { getDonacionTipos } from "../../lib/api/donacionTipoApi";

export async function crearDonacionComunidad(data) {
    try {
        const response = await postDonacion(data);
        console.log("✅ Donación creada correctamente:", response);
        return response;
    } catch (error) {
        console.error("❌ Error al crear donación:", error);
        throw error;
    }
}

export async function obtenerTiposDonacion() {
    try {
        const response = await getDonacionTipos();
        console.log("📦 Tipos de donación obtenidos:", response);
        return response;
    } catch (error) {
        console.error("❌ Error al obtener tipos de donación:", error);
        throw error;
    }
}
