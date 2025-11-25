// app/Perfil/VerDonaciones/actions.js
'use server'

import { getPerfilId } from "@/app/lib/api/perfil";
import { getDonaciones } from "@/app/lib/api/donacionApi";

/**
 * Obtiene las donaciones de un perfil específico por ID (tanto enviadas como recibidas)
 */
export async function obtenerDonacionesDePerfil(perfilId) {
  try {
    console.log("🔍 Iniciando obtención de donaciones para perfil ID:", perfilId);

    if (!perfilId) {
      throw new Error('ID de perfil no proporcionado');
    }

    // Obtener el perfil usando el ID - usar getPerfilId que SÍ existe
    const perfilData = await getPerfilId(perfilId);
    console.log("✅ Perfil obtenido:", perfilData);

    if (!perfilData) {
      throw new Error('Perfil no encontrado');
    }

    const nombrePerfil = perfilData.razonSocial;
    console.log("🔍 Buscando donaciones para:", nombrePerfil);

    // Obtener TODAS las donaciones
    const todasLasDonaciones = await getDonaciones();
    console.log("📦 Total de donaciones obtenidas:", todasLasDonaciones.length);

    // DEBUG: Mostrar algunas donaciones para verificar estructura
    console.log("🔍 Estructura de las primeras 3 donaciones:");
    todasLasDonaciones.slice(0, 3).forEach((donacion, index) => {
      console.log(`Donación ${index + 1}:`, {
        id: donacion.id,
        nombrePerfilDonanteIdPerfilDonante: donacion.nombrePerfilDonanteIdPerfilDonante,
        nombrePerfilIdPerfil: donacion.nombrePerfilIdPerfil,
        nombreDonacionTipoIdDonacionTipo: donacion.nombreDonacionTipoIdDonacionTipo,
        descripcion: donacion.descripcion
      });
    });

    // Filtrar donaciones tanto ENVIADAS como RECIBIDAS por el perfil
    const donacionesDelPerfil = todasLasDonaciones.filter(donacion => {
      // Usar comparación segura para evitar problemas con undefined
      const esDonante = donacion.nombrePerfilDonanteIdPerfilDonante === nombrePerfil;
      const esDestinatario = donacion.nombrePerfilIdPerfil === nombrePerfil;
      
      if (esDonante || esDestinatario) {
        console.log(`✅ Donación ${donacion.id}:`, {
          descripcion: donacion.descripcion,
          esDonante: esDonante,
          esDestinatario: esDestinatario,
          donante: donacion.nombrePerfilDonanteIdPerfilDonante,
          destinatario: donacion.nombrePerfilIdPerfil
        });
      }
      
      return esDonante || esDestinatario;
    });

    console.log(`✅ Total donaciones encontradas: ${donacionesDelPerfil.length}`);

    return {
      success: true,
      data: donacionesDelPerfil, // NO formatear aquí, dejar los datos crudos
      perfil: perfilData,
      message: donacionesDelPerfil.length === 0 ? 
        "No se encontraron donaciones para este perfil" : 
        `Se encontraron ${donacionesDelPerfil.length} donaciones`
    };

  } catch (error) {
    console.error('Error obteniendo donaciones del perfil:', error);
    
    return {
      success: false,
      data: [],
      perfil: null,
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
    const esDonante = donacion.nombrePerfilDonanteIdPerfilDonante === nombrePerfil;
    
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
      fechaHora: donacion.fechaHora, // Mantener la fecha original para ordenamiento
      // Campo adicional para identificar el tipo
      esEnviada: esDonante
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