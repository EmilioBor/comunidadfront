"use server";

import { GetLocalidadesByID } from "@/app/lib/api/localidad";
import { getPublicacionPerfil } from "@/app/lib/api/publicacion";
export async function obtenerLocalidadesByID(id) {
  try {
    if (!id) {
      throw new Error("ID de localidad inválido");
    }

    const localidad = await GetLocalidadesByID(id);

    if (!localidad) {
      throw new Error("No se encontró la localidad");
    }

    return localidad;

  } catch (error) {
    console.error("Error en obtenerLocalidadesByID:", error);
    throw new Error("No se pudo obtener la localidad");
  }
}

export async function obtenerPublicacion(params) {
    return await getPublicacionPerfil(params);
} 

