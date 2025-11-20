// app/Perfil/VerDonaciones/actions.js
'use server'

import { getPerfilId } from "@/app/lib/api/perfil";
import { getDonaciones } from "@/app/lib/api/donacionApi";

/**
 * Obtiene las donaciones de un perfil específico por ID
 */
export async function obtenerDonacionesDePerfil(perfilId) {
  try {
    console.log("🔍 Iniciando obtención de donaciones para perfil ID:", perfilId);

    if (!perfilId) {
      throw new Error('ID de perfil no proporcionado');
    }

    // Obtener el perfil usando el ID
    const perfilData = await getPerfilId(perfilId);
    console.log("✅ Perfil obtenido:", perfilData);

    if (!perfilData) {
      throw new Error('Perfil no encontrado');
    }

    const nombrePerfil = perfilData.razonSocial;
    console.log("🔍 Buscando donaciones por nombre de perfil:", nombrePerfil);

    // Obtener TODAS las donaciones
    const todasLasDonaciones = await getDonaciones();
    console.log("📦 Total de donaciones obtenidas:", todasLasDonaciones.length);

    // Filtrar donaciones por nombrePerfilDonanteIdPerfilDonante
    const donacionesDelPerfil = todasLasDonaciones.filter(donacion => {
      const coincide = donacion.nombrePerfilDonanteIdPerfilDonante === nombrePerfil;
      if (coincide) {
        console.log("✅ Donación coincide:", donacion.id, donacion.descripcion);
      }
      return coincide;
    });

    console.log(`✅ Donaciones encontradas: ${donacionesDelPerfil.length}`);

    return {
      success: true,
      data: formatearDonaciones(donacionesDelPerfil, nombrePerfil),
      perfil: perfilData,
      message: donacionesDelPerfil.length === 0 ? 
        "No se encontraron donaciones realizadas por este perfil" : 
        `Se encontraron ${donacionesDelPerfil.length} donaciones`
    };

  } catch (error) {
    console.error('Error obteniendo donaciones del perfil:', error);
    
    return {
      success: false,
      data: [],
      error: error.message,
      message: "Error al cargar las donaciones del perfil"
    };
  }
}

/**
 * Formatea las donaciones para el frontend
 */
function formatearDonaciones(donaciones, nombrePerfil) {
  return donaciones.map(donacion => {
    return {
      id: donacion.id,
      fecha: formatearFecha(donacion.fechaHora),
      monto: formatearMonto(donacion.monto),
      destinatario: donacion.nombrePerfilIdPerfil || "Destinatario no especificado",
      cbu: "No aplica para donaciones en especie",
      calificacion: "No calificada",
      descripcion: donacion.descripcion || `Donación de ${donacion.nombreDonacionTipoIdDonacionTipo}`,
      estado: "Completada",
      tipo: donacion.nombreDonacionTipoIdDonacionTipo || "Donación en especie",
      donante: donacion.nombrePerfilDonanteIdPerfilDonante || nombrePerfil,
      categoria: donacion.nombreDonacionTipoIdDonacionTipo,
      fechaHora: donacion.fechaHora // Mantener la fecha original para ordenamiento
    };
  });
}

// Funciones auxiliares
function formatearFecha(fecha) {
  if (!fecha) return "Fecha no especificada";
  
  try {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return "Fecha inválida";
  }
}

function formatearMonto(monto) {
  if (!monto || monto === 0) {
    return "No especificado";
  }
  
  if (typeof monto === 'string' && monto.includes('$')) {
    return monto;
  }
  
  const numero = typeof monto === 'string' ? parseFloat(monto) : monto;
  return `$${numero.toLocaleString('es-AR')}`;
}