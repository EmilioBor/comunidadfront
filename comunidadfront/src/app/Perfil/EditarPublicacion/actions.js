// app/Perfil/EditarPublicacion/actions.js
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { actualizarPublicacionAPI, obtenerPublicacionPorId, eliminarPublicacionAPI } from "@/app/lib/api/publicacion";

export async function editarPublicacionAction(formData) {
  try {
    console.log("🔄 [Action] Iniciando edición de publicación...");
    
    // Extraer datos del FormData
    const id = formData.get('id');
    const titulo = formData.get('titulo');
    const descripcion = formData.get('descripcion');
    const localidadIdLocalidad = formData.get('localidadIdLocalidad');
    const publicacionTipoIdPublicacionTipo = formData.get('publicacionTipoIdPublicacionTipo');
    const perfilIdPerfil = formData.get('perfilIdPerfil');
    const donacionIdDonacion = formData.get('donacionIdDonacion');
    const imagen = formData.get('imagen');
    const fechaCreacion = formData.get('fechaCreacion');

    console.log("📦 Datos recibidos:", {
      id, titulo, perfilIdPerfil, localidadIdLocalidad, publicacionTipoIdPublicacionTipo
    });

    // Validaciones
    if (!id || isNaN(parseInt(id))) {
      throw new Error("ID de publicación inválido");
    }

    if (!perfilIdPerfil || isNaN(parseInt(perfilIdPerfil))) {
      throw new Error("ID de perfil inválido");
    }

    // Preparar datos para la API
    const datosPublicacion = {
      id: parseInt(id),
      titulo: titulo.toString(),
      descripcion: descripcion.toString(),
      localidadIdLocalidad: parseInt(localidadIdLocalidad.toString()),
      publicacionTipoIdPublicacionTipo: parseInt(publicacionTipoIdPublicacionTipo.toString()),
      perfilIdPerfil: parseInt(perfilIdPerfil.toString()),
      donacionIdDonacion: donacionIdDonacion ? parseInt(donacionIdDonacion.toString()) : null,
      imagen: imagen ? imagen.toString() : '',
      fechaCreacion: fechaCreacion.toString()
    };

    console.log("📤 Enviando a API:", datosPublicacion);
    
    const resultado = await actualizarPublicacionAPI(datosPublicacion.id, datosPublicacion);

    console.log("✅ Publicación actualizada correctamente");
    
    // Revalidar el path para actualizar la cache
    revalidatePath('/Perfil');
    
    return {
      success: true,
      data: resultado,
      message: "Publicación actualizada correctamente"
    };

  } catch (error) {
    console.error('❌ Error en editarPublicacionAction:', error);
    
    let mensajeError = "Error al actualizar la publicación";
    if (error.message?.includes("ID de perfil inválido")) {
      mensajeError = "Error: El ID del perfil no es válido";
    } else if (error.response?.data?.message) {
      mensajeError = error.response.data.message;
    } else if (error.message) {
      mensajeError = error.message;
    }

    return {
      success: false,
      error: mensajeError
    };
  }
}

export async function obtenerPublicacionPorIdAction(id) {
  try {
    console.log("🔍 [Action] Buscando publicación con ID:", id);
    
    if (!id || isNaN(parseInt(id))) {
      throw new Error("ID de publicación inválido");
    }
    
    const publicacion = await obtenerPublicacionPorId(id);
    
    if (!publicacion) {
      console.log("❌ [Action] Publicación no encontrada");
      throw new Error("Publicación no encontrada");
    }
    
    console.log("✅ [Action] Publicación obtenida:", {
      id: publicacion.id,
      titulo: publicacion.titulo
    });
    
    return publicacion;
    
  } catch (error) {
    console.error('❌ [Action] Error obteniendo publicación:', error.message);
    
    return {
      id: parseInt(id) || 0,
      titulo: "Error cargando publicación",
      descripcion: "No se pudo cargar la publicación",
      imagen: "",
      fechaCreacion: new Date().toISOString(),
      localidadIdLocalidad: 1,
      perfilIdPerfil: 1,
      publicacionTipoIdPublicacionTipo: 1,
      donacionIdDonacion: null
    };
  }
}

export async function eliminarPublicacionAction(id) {
  try {
    console.log("🗑️ Eliminando publicación con ID:", id);

    if (!id || isNaN(parseInt(id))) {
      throw new Error("ID de publicación inválido");
    }

    const resultado = await eliminarPublicacionAPI(id);

    // Revalidar el path
    revalidatePath('/Perfil');

    return {
      success: true,
      data: resultado,
      message: "Publicación eliminada correctamente"
    };

  } catch (error) {
    console.error('❌ Error en eliminarPublicacionAction:', error);
    
    return {
      success: false,
      error: error.response?.data?.message || "Error al eliminar la publicación"
    };
  }
}