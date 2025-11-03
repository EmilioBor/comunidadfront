// Donacion/Listado/actions.ts
'use server';

import { getDonaciones } from "@/lib/api/donacionApi";
import { getDonacionTipos } from "@/lib/api/donacionTipoApi";

export async function obtenerDonaciones() {
  try {
    const donaciones = await getDonaciones();
    return { success: true, data: donaciones };
  } catch (error) {
    console.error('Error en server action obtenerDonaciones:', error);
    return { success: false, error: 'Error al cargar las donaciones' };
  }
}

export async function obtenerTiposDonacion() {
  try {
    const tipos = await getDonacionTipos();
    return { success: true, data: tipos };
  } catch (error) {
    console.error('Error en server action obtenerTiposDonacion:', error);
    return { success: false, error: 'Error al cargar los tipos de donación' };
  }
}