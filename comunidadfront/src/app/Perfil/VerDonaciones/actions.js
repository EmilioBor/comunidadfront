// app/Perfil/VerReportes/actions.js
'use server'

import { getReportes, getReporteById } from '@/app/lib/api/reporte';
import { reporteService } from '@/app/lib/api/reporteService';

// Obtener todos los reportes con información completa
export async function obtenerReportesCompletos() {
  try {
    console.log('🔄 Obteniendo reportes completos...');
    
    // Obtener reportes usando tu función existente
    const reportes = await getReportes();
    console.log('📊 Reportes obtenidos:', reportes.length);

    // Si no hay reportes, retornar array vacío
    if (!reportes || reportes.length === 0) {
      console.log('📭 No se encontraron reportes');
      return { success: true, data: [] };
    }

    // Enriquecer cada reporte con información adicional
    const reportesCompletos = await Promise.all(
      reportes.map(async (reporte) => {
        try {
          console.log(`🔍 Enriqueciendo reporte ${reporte.id}...`);

          // Obtener información de la publicación reportada
          let publicacion = null;
          if (reporte.publicacionIdPublicacion) {
            console.log(`📝 Buscando publicación ${reporte.publicacionIdPublicacion} para reporte ${reporte.id}`);
            try {
              publicacion = await reporteService.getPublicacionById(reporte.publicacionIdPublicacion);
              console.log(`✅ Publicación encontrada:`, publicacion?.titulo);
            } catch (pubError) {
              console.error(`❌ Error obteniendo publicación ${reporte.publicacionIdPublicacion}:`, pubError.message);
            }
          }

          // Obtener información del perfil que reportó
          let perfilReportador = null;
          if (reporte.perfilIdPerfil) {
            console.log(`👤 Buscando perfil reportador ${reporte.perfilIdPerfil} para reporte ${reporte.id}`);
            try {
              perfilReportador = await reporteService.getPerfilById(reporte.perfilIdPerfil);
              console.log(`✅ Perfil reportador encontrado:`, perfilReportador?.razonSocial);
            } catch (perfilError) {
              console.error(`❌ Error obteniendo perfil reportador ${reporte.perfilIdPerfil}:`, perfilError.message);
            }
          }

          // Obtener información del perfil reportado (dueño de la publicación)
          let perfilReportado = null;
          if (publicacion && publicacion.perfilIdPerfil) {
            console.log(`👥 Buscando perfil reportado ${publicacion.perfilIdPerfil} para reporte ${reporte.id}`);
            try {
              perfilReportado = await reporteService.getPerfilById(publicacion.perfilIdPerfil);
              console.log(`✅ Perfil reportado encontrado:`, perfilReportado?.razonSocial);
            } catch (perfilError) {
              console.error(`❌ Error obteniendo perfil reportado ${publicacion.perfilIdPerfil}:`, perfilError.message);
            }
          }

          // Construir el reporte enriquecido
          const reporteCompleto = {
            id: reporte.id,
            descripcion: reporte.descripcion || 'Sin descripción',
            motivo: reporte.motivo || 'otros',
            perfilIdPerfil: reporte.perfilIdPerfil,
            publicacionIdPublicacion: reporte.publicacionIdPublicacion,
            fechaCreacion: reporte.fechaCreacion || new Date().toISOString(),
            publicacion: publicacion,
            perfilReportador: perfilReportador,
            perfilReportado: perfilReportado,
            estado: reporte.estado || 'pendiente'
          };

          console.log(`✅ Reporte ${reporte.id} enriquecido correctamente`);
          return reporteCompleto;

        } catch (error) {
          console.error(`💥 Error enriqueciendo reporte ${reporte.id}:`, error);
          
          // Retornar el reporte básico si hay error
          return {
            id: reporte.id,
            descripcion: reporte.descripcion || 'Sin descripción',
            motivo: reporte.motivo || 'otros',
            perfilIdPerfil: reporte.perfilIdPerfil,
            publicacionIdPublicacion: reporte.publicacionIdPublicacion,
            fechaCreacion: reporte.fechaCreacion || new Date().toISOString(),
            estado: reporte.estado || 'pendiente'
          };
        }
      })
    );

    console.log('🎉 Reportes completos procesados:', reportesCompletos.length);
    return { 
      success: true, 
      data: reportesCompletos,
      message: `Se encontraron ${reportesCompletos.length} reportes`
    };

  } catch (error) {
    console.error('💥 Error obteniendo reportes completos:', error);
    return { 
      success: false, 
      error: error.message,
      message: 'Error al cargar los reportes'
    };
  }
}

// Enviar advertencia a usuario
export async function enviarAdvertenciaUsuario(perfilId, mensaje) {
  try {
    console.log(`📤 Enviando advertencia a perfil ${perfilId}...`);
    
    if (!perfilId) {
      throw new Error('ID de perfil no válido');
    }

    if (!mensaje || mensaje.trim() === '') {
      throw new Error('El mensaje de advertencia no puede estar vacío');
    }

    const resultado = await reporteService.enviarAdvertencia(perfilId, mensaje.trim());
    
    console.log('✅ Advertencia enviada exitosamente');
    return { 
      success: true, 
      data: resultado,
      message: 'Advertencia enviada correctamente'
    };

  } catch (error) {
    console.error('❌ Error enviando advertencia:', error);
    return { 
      success: false, 
      error: error.message,
      message: 'Error al enviar la advertencia'
    };
  }
}

// Marcar reporte como resuelto
export async function marcarReporteResuelto(reporteId) {
  try {
    console.log(`🔧 Marcando reporte ${reporteId} como resuelto...`);
    
    if (!reporteId) {
      throw new Error('ID de reporte no válido');
    }

    // Aquí implementarías la lógica para marcar el reporte como resuelto en tu backend
    // Por ahora, simulamos la operación
    
    console.log(`✅ Reporte ${reporteId} marcado como resuelto`);
    return { 
      success: true, 
      message: 'Reporte marcado como resuelto correctamente'
    };

  } catch (error) {
    console.error('❌ Error marcando reporte como resuelto:', error);
    return { 
      success: false, 
      error: error.message,
      message: 'Error al marcar el reporte como resuelto'
    };
  }
}

// Obtener estadísticas de reportes
export async function obtenerEstadisticasReportes() {
  try {
    console.log('📈 Obteniendo estadísticas de reportes...');
    
    const resultado = await obtenerReportesCompletos();
    
    if (!resultado.success) {
      throw new Error(resultado.error);
    }

    const reportes = resultado.data || [];
    
    // Calcular estadísticas
    const totalReportes = reportes.length;
    const reportesPendientes = reportes.filter(r => r.estado === 'pendiente').length;
    const reportesResueltos = reportes.filter(r => r.estado === 'resuelto').length;
    
    // Estadísticas por motivo
    const motivos = ['contenido_inapropiado', 'spam', 'informacion_falsa', 'acoso', 'otros'];
    const estadisticasPorMotivo = motivos.map(motivo => {
      const cantidad = reportes.filter(r => r.motivo === motivo).length;
      return {
        motivo,
        cantidad
      };
    });

    const estadisticas = {
      total: totalReportes,
      pendientes: reportesPendientes,
      resueltos: reportesResueltos,
      porMotivo: estadisticasPorMotivo
    };

    console.log('✅ Estadísticas obtenidas:', estadisticas);
    return { 
      success: true, 
      data: estadisticas,
      message: 'Estadísticas calculadas correctamente'
    };

  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    return { 
      success: false, 
      error: error.message,
      message: 'Error al obtener las estadísticas'
    };
  }
}

// Obtener reportes por motivo específico
export async function obtenerReportesPorMotivo(motivo) {
  try {
    console.log(`🔍 Obteniendo reportes por motivo: ${motivo}...`);
    
    const resultado = await obtenerReportesCompletos();
    
    if (!resultado.success) {
      throw new Error(resultado.error);
    }

    const todosLosReportes = resultado.data || [];
    const reportesFiltrados = motivo === 'todos' 
      ? todosLosReportes 
      : todosLosReportes.filter(reporte => reporte.motivo === motivo);

    console.log(`✅ Reportes filtrados por motivo ${motivo}:`, reportesFiltrados.length);
    return { 
      success: true, 
      data: reportesFiltrados,
      message: `Se encontraron ${reportesFiltrados.length} reportes con motivo "${motivo}"`
    };

  } catch (error) {
    console.error('❌ Error obteniendo reportes por motivo:', error);
    return { 
      success: false, 
      error: error.message,
      message: 'Error al filtrar los reportes por motivo'
    };
  }
}