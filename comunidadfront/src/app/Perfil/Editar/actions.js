// app/Perfil/Editar/actions.js
'use server';

import { actualizarPerfilAPI } from "@/app/lib/api/perfil";

export async function editarPerfilAction(datosPerfil) {
  try {
    console.log("Actualizando perfil con JSON...");
    console.log("Datos recibidos:", datosPerfil);

    const resultado = await actualizarPerfilAPI(datosPerfil.id, datosPerfil);

    return {
      success: true,
      data: resultado,
      message: "Perfil actualizado correctamente"
    };

  } catch (error) {
    console.error('Error en editarPerfilAction:', error);
    return {
      success: false,
      error: error.response?.data?.message || "Error al actualizar el perfil"
    };
  }
}

