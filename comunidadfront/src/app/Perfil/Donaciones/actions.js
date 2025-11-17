// app/Perfil/Donaciones/actions.js
'use server'

import { GetUserByPerfil } from "@/app/lib/api/perfil";
import { getDonaciones } from "@/app/lib/api/donacionApi";
import { cookies } from 'next/headers';

/**
 * Obtiene el ID del usuario desde las cookies/session
 */
async function getUserIdFromSession() {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('authjs.session-token') || 
                         cookieStore.get('next-auth.session-token') ||
                         cookieStore.get('session');
    
    if (!sessionCookie) {
      throw new Error('No hay sesión activa');
    }

    // Aquí necesitarías decodificar el token JWT o hacer una llamada a tu API de sesión
    // Por ahora, vamos a usar el mismo método que en Perfil/page.tsx
    const meResponse = await fetch('http://localhost:3000/api/user/me', {
      headers: {
        Cookie: `authjs.session-token=${sessionCookie.value}`
      },
      cache: 'no-store'
    });

    if (!meResponse.ok) {
      throw new Error('No se pudo obtener la información del usuario');
    }

    const me = await meResponse.json();
    return me;
  } catch (error) {
    console.error('Error obteniendo usuario de sesión:', error);
    throw error;
  }
}

/**
 * Obtiene todas las donaciones realizadas por el perfil del usuario actual
 */
export async function obtenerDonacionesDelUsuario() {
  try {
    console.log("🔍 Iniciando obtención de donaciones del usuario...");

    // Usar el mismo método que en Perfil/page.tsx
    const meResponse = await fetch('http://localhost:3000/api/user/me', {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!meResponse.ok) {
      throw new Error(`Error en API user/me: ${meResponse.status}`);
    }

    const me = await meResponse.json();
    console.log("✅ Usuario obtenido:", me);

    if (!me || !me.id) {
      throw new Error('Usuario no autenticado o sin ID');
    }

    // Obtener el perfil usando el ID del usuario
    const perfilData = await GetUserByPerfil(me.id);
    console.log("✅ Perfil obtenido:", perfilData);

    if (!perfilData) {
      throw new Error('Perfil no encontrado para este usuario');
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
    console.error('Error obteniendo donaciones:', error);
    
    // En caso de error, devolver array vacío pero con información del error
    return {
      success: false,
      data: [],
      error: error.message,
      message: "Error al cargar las donaciones"
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
      categoria: donacion.nombreDonacionTipoIdDonacionTipo
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