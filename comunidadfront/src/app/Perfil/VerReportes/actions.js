"use server";

import { GetUserByPerfil } from "@/app/Chat/components/useChat";

// Versión corregida que usa los campos correctos de la API
export async function obtenerReportesCompletos() {
  try {
    console.log("📋 Obteniendo todos los reportes...");
    
    const response = await fetch('https://localhost:7168/api/UsuarioReporte/api/v1/usuarioReportes', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const reportes = await response.json();
    console.log("✅ Reportes obtenidos:", reportes);
    
    // Enriquecer los reportes con información adicional
    const reportesEnriquecidos = await Promise.all(
      (Array.isArray(reportes) ? reportes : []).map(async (reporte) => {
        try {
          console.log(`🔍 Procesando reporte ${reporte.id}:`, {
            nombrePublicacion: reporte.nombrePublicacionIdPublicacion,
            nombrePerfil: reporte.nombrePerfilIdPerfil,
            motivo: reporte.motivo
          });

          // Estrategia para obtener la publicación:
          // 1. Primero intentar buscar por nombre/título
          let publicacionData = null;
          if (reporte.nombrePublicacionIdPublicacion) {
            try {
              console.log(`🔎 Buscando publicación por nombre: "${reporte.nombrePublicacionIdPublicacion}"...`);
              
              // Primero obtener todas las publicaciones y buscar por nombre
              const todasPublicacionesResponse = await fetch('https://localhost:7168/api/Publicacion/api/v1/publicacions', {
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                },
              });
              
              if (todasPublicacionesResponse.ok) {
                const todasPublicaciones = await todasPublicacionesResponse.json();
                console.log(`📚 Total de publicaciones obtenidas: ${todasPublicaciones.length}`);
                
                // Buscar publicación por nombre/título
                publicacionData = todasPublicaciones.find(pub => 
                  pub.titulo === reporte.nombrePublicacionIdPublicacion || 
                  pub.nombrePerfilIdPerfil === reporte.nombrePublicacionIdPublicacion ||
                  pub.descripcion?.includes(reporte.nombrePublicacionIdPublicacion)
                );
                
                if (publicacionData) {
                  console.log(`✅ Publicación encontrada:`, publicacionData);
                } else {
                  console.warn(`❌ No se encontró publicación con nombre: "${reporte.nombrePublicacionIdPublicacion}"`);
                  
                  // Crear objeto simulado con la información que tenemos
                  publicacionData = {
                    id: 0, // ID temporal
                    titulo: reporte.nombrePublicacionIdPublicacion,
                    descripcion: "Información de publicación no disponible",
                    imagen: "",
                    nombrePerfilIdPerfil: reporte.nombrePerfilIdPerfil || "Desconocido"
                  };
                }
              }
            } catch (pubError) {
              console.error(`❌ Error buscando publicación:`, pubError);
              // Crear objeto simulado como fallback
              publicacionData = {
                id: 0,
                titulo: reporte.nombrePublicacionIdPublicacion || "Publicación reportada",
                descripcion: "No se pudo cargar la información de la publicación",
                imagen: "",
                nombrePerfilIdPerfil: reporte.nombrePerfilIdPerfil || "Desconocido"
              };
            }
          }

          // Estrategia para obtener el perfil reportador:
          // Buscar por nombre del perfil
          let perfilReportadorData = null;
          if (reporte.nombrePerfilIdPerfil) {
            try {
              console.log(`🔎 Buscando perfil reportador por nombre: "${reporte.nombrePerfilIdPerfil}"...`);
              
              // Primero obtener todos los perfiles y buscar por nombre
              const todosPerfilesResponse = await fetch('https://localhost:7168/api/Perfil/api/v1/perfils', {
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                },
              });
              
              if (todosPerfilesResponse.ok) {
                const todosPerfiles = await todosPerfilesResponse.json();
                console.log(`📚 Total de perfiles obtenidos: ${todosPerfiles.length}`);
                
                // Buscar perfil por razón social
                perfilReportadorData = todosPerfiles.find(perfil => 
                  perfil.razonSocial === reporte.nombrePerfilIdPerfil
                );
                
                if (perfilReportadorData) {
                  console.log(`✅ Perfil reportador encontrado:`, perfilReportadorData);
                } else {
                  console.warn(`❌ No se encontró perfil con nombre: "${reporte.nombrePerfilIdPerfil}"`);
                  
                  // Crear objeto simulado
                  perfilReportadorData = {
                    id: 0,
                    razonSocial: reporte.nombrePerfilIdPerfil,
                    imagen: "",
                    descripcion: "Información del perfil no disponible"
                  };
                }
              }
            } catch (perfilError) {
              console.error(`❌ Error buscando perfil reportador:`, perfilError);
              // Crear objeto simulado como fallback
              perfilReportadorData = {
                id: 0,
                razonSocial: reporte.nombrePerfilIdPerfil || "Usuario reportador",
                imagen: "",
                descripcion: "No se pudo cargar la información del perfil"
              };
            }
          }

          // Para el perfil reportado, podemos asumir que es el mismo que creó la publicación
          // o buscar información adicional si está disponible
          let perfilReportadoData = null;
          if (publicacionData && publicacionData.nombrePerfilIdPerfil) {
            try {
              console.log(`🔎 Buscando perfil reportado: "${publicacionData.nombrePerfilIdPerfil}"...`);
              
              const todosPerfilesResponse = await fetch('https://localhost:7168/api/Perfil/api/v1/perfils');
              if (todosPerfilesResponse.ok) {
                const todosPerfiles = await todosPerfilesResponse.json();
                perfilReportadoData = todosPerfiles.find(perfil => 
                  perfil.razonSocial === publicacionData.nombrePerfilIdPerfil
                );
                
                if (!perfilReportadoData) {
                  perfilReportadoData = {
                    id: 0,
                    razonSocial: publicacionData.nombrePerfilIdPerfil,
                    imagen: "",
                    descripcion: "Propietario de la publicación"
                  };
                }
              }
            } catch (error) {
              console.error("Error buscando perfil reportado:", error);
            }
          }

          const reporteEnriquecido = {
            id: reporte.id,
            descripcion: reporte.descripcion || "Sin descripción",
            motivo: reporte.motivo || "otros",
            fechaCreacion: reporte.fechaHora || reporte.fechaCreacion,
            // Usar los nombres como identificadores
            nombrePublicacion: reporte.nombrePublicacionIdPublicacion,
            nombrePerfilReportador: reporte.nombrePerfilIdPerfil,
            // Datos enriquecidos
            publicacion: publicacionData,
            perfilReportador: perfilReportadorData,
            perfilReportado: perfilReportadoData,
            // Campos para compatibilidad
            publicacionIdPublicacion: publicacionData?.id || 0,
            perfilIdPerfil: perfilReportadorData?.id || 0
          };

          console.log(`🎯 Reporte ${reporte.id} enriquecido:`, {
            tienePublicacion: !!publicacionData,
            tienePerfilReportador: !!perfilReportadorData,
            tienePerfilReportado: !!perfilReportadoData
          });

          return reporteEnriquecido;

        } catch (error) {
          console.error(`💥 Error grave enriqueciendo reporte ${reporte.id}:`, error);
          // Retornar el reporte básico como fallback
          return {
            id: reporte.id,
            descripcion: reporte.descripcion || "Sin descripción",
            motivo: reporte.motivo || "otros",
            fechaCreacion: reporte.fechaHora,
            nombrePublicacion: reporte.nombrePublicacionIdPublicacion,
            nombrePerfilReportador: reporte.nombrePerfilIdPerfil,
            publicacionIdPublicacion: 0,
            perfilIdPerfil: 0,
            publicacion: {
              id: 0,
              titulo: reporte.nombrePublicacionIdPublicacion || "Publicación reportada",
              descripcion: "Error al cargar información",
              imagen: "",
              nombrePerfilIdPerfil: reporte.nombrePerfilIdPerfil || "Desconocido"
            },
            perfilReportador: {
              id: 0,
              razonSocial: reporte.nombrePerfilIdPerfil || "Usuario reportador",
              imagen: "",
              descripcion: "Error al cargar información"
            },
            perfilReportado: null
          };
        }
      })
    );

    // Estadísticas de enriquecimiento
    const stats = {
      total: reportesEnriquecidos.length,
      conPublicacion: reportesEnriquecidos.filter(r => r.publicacion && r.publicacion.id !== 0).length,
      conPerfilReportador: reportesEnriquecidos.filter(r => r.perfilReportador && r.perfilReportador.id !== 0).length,
      conPerfilReportado: reportesEnriquecidos.filter(r => r.perfilReportado && r.perfilReportado.id !== 0).length
    };
    
    console.log("📊 Estadísticas de enriquecimiento:", stats);

    return {
      success: true,
      data: reportesEnriquecidos,
      stats: stats
    };

  } catch (error) {
    console.error("❌ Error al obtener reportes:", error);
    return {
      success: false,
      error: "Error al cargar los reportes: " + error.message,
      data: []
    };
  }
}

// Función para enviar advertencia
