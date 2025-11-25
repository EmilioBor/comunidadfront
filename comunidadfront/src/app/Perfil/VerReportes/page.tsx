"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { obtenerReportesCompletos } from "./actions";
import { GetUserByPerfil } from "@/app/lib/api/perfil";
import { deleteReporte } from "@/app/lib/api/reporte"; // Importar la función de eliminar

interface Publicacion {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  perfilIdPerfil: number;
  nombrePerfilIdPerfil: string;
  fechaCreacion?: string;
}

interface Perfil {
  id: number;
  razonSocial: string;
  imagen: string;
  descripcion?: string;
}

interface Reporte {
  id: number;
  descripcion: string;
  motivo: string;
  fechaCreacion?: string;
  fechaReporte?: string;
  // IDs
  publicacionId?: number;
  perfilReportadorId?: number;
  perfilReportadoId?: number;
  // Datos enriquecidos
  publicacion?: Publicacion;
  perfilReportador?: Perfil;
  perfilReportado?: Perfil;
  // Campos para compatibilidad
  publicacionIdPublicacion?: number;
  perfilIdPerfil?: number;
  estado?: string;
}

// Tipos de motivos con colores - ACTUALIZADO para coincidir con tus datos
const MOTIVOS_REPORTES = [
  { id: "todos", nombre: "Todos los reportes", color: "bg-gray-100 text-gray-800" },
  { id: "Información falsa", nombre: "Información Falsa", color: "bg-orange-100 text-orange-800" },
  { id: "Usuario fraudulento", nombre: "Usuario Fraudulento", color: "bg-purple-100 text-purple-800" },
  { id: "contenido_inapropiado", nombre: "Contenido Inapropiado", color: "bg-red-100 text-red-800" },
  { id: "spam", nombre: "Spam", color: "bg-yellow-100 text-yellow-800" },
  { id: "acoso", nombre: "Acoso", color: "bg-purple-100 text-purple-800" },
  { id: "otros", nombre: "Otros", color: "bg-blue-100 text-blue-800" }
];

// Función para formatear fecha
const formatearFecha = (fechaString?: string) => {
  if (!fechaString) return "Fecha no disponible";
  
  try {
    const fecha = new Date(fechaString);
    const ahora = new Date();
    const diffMs = ahora.getTime() - fecha.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Hace un momento";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays < 7) return `Hace ${diffDays} d`;
    
    return fecha.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch (error) {
    return "Fecha no disponible";
  }
};

export default function VerReportes() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [motivoFiltro, setMotivoFiltro] = useState("todos");
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [advertenciaModal, setAdvertenciaModal] = useState<{
    mostrar: boolean;
    perfilId: number | null;
    razonSocial: string;
  }>({
    mostrar: false,
    perfilId: null,
    razonSocial: ""
  });
  const [publicacionModal, setPublicacionModal] = useState<{
    mostrar: boolean;
    publicacion: Publicacion | null;
  }>({
    mostrar: false,
    publicacion: null
  });
  const [mensajeAdvertencia, setMensajeAdvertencia] = useState("");
  const [enviandoAdvertencia, setEnviandoAdvertencia] = useState(false);
  const [resolviendoReporte, setResolviendoReporte] = useState<number | null>(null);
  const [stats, setStats] = useState({conPublicacion: 0, conPerfilReportador: 0});

  const router = useRouter();

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Iniciando carga de reportes...");
      
      const resultado = await obtenerReportesCompletos();
      console.log("📦 Resultado obtenido:", resultado);
      
      if (resultado.success) {
        setReportes(resultado.data || []);
        setStats(resultado.stats || {conPublicacion: 0, conPerfilReportador: 0});
      } else {
        setError(resultado.error || "Error al cargar reportes");
      }
    } catch (err) {
      console.error("💥 Error inesperado:", err);
      setError("Error inesperado al cargar reportes");
    } finally {
      setLoading(false);
    }
  };

  // Función para marcar reporte como resuelto (eliminarlo)
  const marcarComoResuelto = async (reporteId: number) => {
    try {
      setResolviendoReporte(reporteId);
      console.log(`🗑️ Eliminando reporte ${reporteId}...`);
      
      // Llamar a la función de eliminar reporte
      await deleteReporte(reporteId);
      
      console.log(`✅ Reporte ${reporteId} eliminado correctamente`);
      
      // Actualizar la lista de reportes eliminando el reporte resuelto
      setReportes(prevReportes => prevReportes.filter(reporte => reporte.id !== reporteId));
      
      // Mostrar mensaje de éxito
      setError(null);
      
    } catch (err) {
      console.error(`❌ Error al eliminar reporte ${reporteId}:`, err);
      setError("Error al marcar el reporte como resuelto");
    } finally {
      setResolviendoReporte(null);
    }
  };

  // Filtrar reportes por motivo
  const reportesFiltrados = motivoFiltro === "todos" 
    ? reportes 
    : reportes.filter(reporte => reporte.motivo === motivoFiltro);

  // Limitar a 4 reportes inicialmente
  const reportesAMostrar = mostrarTodos 
    ? reportesFiltrados 
    : reportesFiltrados.slice(0, 4);

  // Estadísticas por motivo - CORREGIDO
  const estadisticasPorMotivo = MOTIVOS_REPORTES.filter(motivo => motivo.id !== "todos").map(motivo => {
    const cantidad = reportes.filter(reporte => reporte.motivo === motivo.id).length;
    return {
      ...motivo,
      cantidad
    };
  });

  // Función para abrir modal de publicación
  const abrirModalPublicacion = (publicacion: Publicacion) => {
    setPublicacionModal({
      mostrar: true,
      publicacion
    });
  };

  const cerrarModalPublicacion = () => {
    setPublicacionModal({
      mostrar: false,
      publicacion: null
    });
  };

  const abrirModalAdvertencia = (perfilId: number, razonSocial: string) => {
    setAdvertenciaModal({
      mostrar: true,
      perfilId,
      razonSocial
    });
    setMensajeAdvertencia(`Hola ${razonSocial}, hemos revisado tu publicación y hemos detectado que viola nuestras normas comunitarias. Por favor, modifica el contenido para que cumpla con nuestras políticas.`);
  };

  const cerrarModalAdvertencia = () => {
    setAdvertenciaModal({
      mostrar: false,
      perfilId: null,
      razonSocial: ""
    });
    setMensajeAdvertencia("");
  };


  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
       
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Cargando reportes...</p>
          </div>
        </div>
      </div>
    );
  }


const enviarAdvertencia = async () => {
  if (!advertenciaModal.perfilId) return;

  try {
    setEnviandoAdvertencia(true);

    // 1. Obtener al usuario logueado
    const meRes = await fetch("/api/user/me");
    if (!meRes.ok) throw new Error("No se pudo obtener el usuario logueado");
    const me = await meRes.json();

    // 2. Obtener el perfil del usuario logueado
    const perfilLogueado = await GetUserByPerfil(me.id);
    if (!perfilLogueado?.id) throw new Error("No se encontró el perfil del usuario logueado");

    // 3. Crear el chat con receptor
    const crearChatRes = await fetch(
      "https://localhost:7168/api/Chat/api/v1/agrega/chat",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: 0,
          publicacionIdPublicacion: 0, // o dinámico si aplica
          perfilIdPerfil: perfilLogueado.id,
          receptorIdReceptor: advertenciaModal.perfilId, // <- aquí usamos el perfil del modal
        }),
      }
    );

    if (!crearChatRes.ok) {
      const errTxt = await crearChatRes.text();
      throw new Error("Error creando chat: " + errTxt);
    }


    const chatCreado = await crearChatRes.json();

    // Enviar mensaje inicial
      const mensajeInicial = mensajeAdvertencia || "Hola, hemos revisado tu publicación.";
      
      const fechaHora = new Date().toISOString().slice(0, -1);
      await fetch("https://localhost:7168/api/Mensaje/api/v1/agrega/mensaje", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contenido: mensajeInicial,
          fechaHora: fechaHora,
          chatIdChat: chatCreado.id,
          perfilIdPerfil: perfilLogueado.id,
        }),
      });


    // 4. Redirigir al chat creado
    router.push(`/Chat/${chatCreado.id}`);

    return {
      success: true,
      chatId: chatCreado.id,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: err,
    };
  } finally {
    setEnviandoAdvertencia(false);
  }
};


  return (
    <div className="flex flex-col min-h-screen">
      
      
      <div className="flex-1 p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Reportes de la Comunidad</h1>
                <p className="text-gray-600 mt-2">
                  {reportesFiltrados.length} reporte(s) pendiente(s) de revisión
                </p>
                <p className="text-sm text-gray-500">
                  Con publicación: {stats.conPublicacion} • Con reportador: {stats.conPerfilReportador}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={cargarReportes}
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg text-gray-800 font-medium transition-colors"
                >
                  Actualizar
                </button>
                <Link
                  href="/Perfil"
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                >
                  Volver al Perfil
                </Link>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              <div className="flex justify-between items-center">
                <span>{error}</span>
                <button
                  onClick={cargarReportes}
                  className="text-red-800 hover:text-red-900 font-medium"
                >
                  Reintentar
                </button>
              </div>
            </div>
          )}

          {/* Estadísticas por Motivo */}
          <section className="bg-white rounded-xl shadow-sm border mb-8">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Reportes por Motivo</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {estadisticasPorMotivo.map((motivo) => (
                  <div 
                    key={motivo.id} 
                    className={`p-4 rounded-lg border-2 text-center transition-all duration-200 ${
                      motivo.cantidad > 0 
                        ? `${motivo.color} border-current shadow-md cursor-pointer hover:scale-105` 
                        : 'bg-gray-50 text-gray-400 border-gray-200'
                    }`}
                    onClick={() => motivo.cantidad > 0 && setMotivoFiltro(motivo.id)}
                  >
                    <div className="text-2xl font-bold mb-1">{motivo.cantidad}</div>
                    <div className="text-sm font-medium">{motivo.nombre}</div>
                    {motivo.cantidad === 0 && (
                      <div className="text-xs mt-1">Sin reportes</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Filtros y Controles */}
          <div className="bg-white rounded-xl shadow-sm border mb-6">
            <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <select
                  value={motivoFiltro}
                  onChange={(e) => setMotivoFiltro(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                >
                  {MOTIVOS_REPORTES.map(motivo => (
                    <option key={motivo.id} value={motivo.id}>
                      {motivo.nombre} {motivo.id !== "todos" && `(${
                        reportes.filter(r => r.motivo === motivo.id).length
                      })`}
                    </option>
                  ))}
                </select>
                
                {motivoFiltro !== "todos" && (
                  <button
                    onClick={() => setMotivoFiltro("todos")}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    Limpiar filtro
                  </button>
                )}
              </div>

              {reportesFiltrados.length > 4 && (
                <button
                  onClick={() => setMostrarTodos(!mostrarTodos)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  {mostrarTodos ? "Ver menos" : `Ver todos (${reportesFiltrados.length})`}
                </button>
              )}
            </div>
          </div>

          {/* Grid de Reportes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportesAMostrar.length === 0 ? (
              <div className="col-span-2 bg-white rounded-xl shadow-sm p-8 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {motivoFiltro === "todos" ? 'No hay reportes pendientes' : 'No hay reportes con este motivo'}
                </h3>
                <p className="text-gray-500">
                  {motivoFiltro === "todos" 
                    ? "Todos los reportes han sido revisados y resueltos."
                    : `No se encontraron reportes con el motivo "${MOTIVOS_REPORTES.find(m => m.id === motivoFiltro)?.nombre}".`
                  }
                </p>
              </div>
            ) : (
              reportesAMostrar.map((reporte) => (
                <div key={reporte.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  {/* Header del Reporte */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          MOTIVOS_REPORTES.find(m => m.id === reporte.motivo)?.color || 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {reporte.motivo || "Sin motivo"}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatearFecha(reporte.fechaCreacion || reporte.fechaReporte)}
                        </p>
                      </div>
                      {reporte.estado === 'resuelto' && (
                        <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Resuelto
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-700 text-sm line-clamp-2">
                      {reporte.descripcion || "Sin descripción adicional"}
                    </p>
                  </div>

                  {/* Información del Reportador */}
                  <div className="p-4 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Reportado por:</h4>
                    {reporte.perfilReportador ? (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                          {reporte.perfilReportador.imagen ? (
                            <img
                              src={`data:image/jpeg;base64,${reporte.perfilReportador.imagen}`}
                              alt={reporte.perfilReportador.razonSocial}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 text-xs font-medium">
                              {reporte.perfilReportador.razonSocial.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {reporte.perfilReportador.razonSocial}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-xs text-gray-600">?</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Información no disponible</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Publicación Reportada */}
                  <div className="p-4 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Publicación Reportada:</h4>
                    {reporte.publicacion ? (
                      <div 
                        className="flex gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        onClick={() => abrirModalPublicacion(reporte.publicacion!)}
                      >
                        <div className="flex-shrink-0">
                          {reporte.publicacion.imagen ? (
                            <img
                              src={`data:image/jpeg;base64,${reporte.publicacion.imagen}`}
                              alt={reporte.publicacion.titulo}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-400 text-xs">📷</span>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {reporte.publicacion.titulo || "Sin título"}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {reporte.publicacion.descripcion || "Sin descripción"}
                          </p>
                          <p className="text-xs text-blue-600 mt-1 font-medium">
                            Click para ver detalles
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">📄</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Publicación no disponible</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Perfil Reportado */}
                  <div className="p-4 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Perfil Reportado:</h4>
                    {reporte.perfilReportado ? (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                          {reporte.perfilReportado.imagen ? (
                            <img
                              src={`data:image/jpeg;base64,${reporte.perfilReportado.imagen}`}
                              alt={reporte.perfilReportado.razonSocial}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 text-xs font-medium">
                              {reporte.perfilReportado.razonSocial.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {reporte.perfilReportado.razonSocial}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-xs text-gray-600">👤</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Información no disponible</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (reporte.perfilReportado) {
                            abrirModalAdvertencia(
                              reporte.perfilReportado.id,
                              reporte.perfilReportado.razonSocial
                            );
                          }
                        }}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 px-3 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!reporte.perfilReportado || reporte.estado === 'resuelto'}
                      >
                        Advertir
                      </button>
                      
                      <button 
                        onClick={() => marcarComoResuelto(reporte.id)}
                        disabled={resolviendoReporte === reporte.id}
                        className="flex-1 bg-green-500 hover:bg-green-600 px-3 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {resolviendoReporte === reporte.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                            Eliminando...
                          </>
                        ) : (
                          'Resolver'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de Publicación - VENTANA MEDIANA */}
      {publicacionModal.mostrar && publicacionModal.publicacion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Fondo con blur del contenido actual */}
          <div 
            className="absolute inset-0 bg-gray-50 backdrop-blur-sm bg-opacity-90"
            onClick={cerrarModalPublicacion}
          ></div>
          
          {/* Contenido del modal - TAMAÑO MEDIANO */}
          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            <button 
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              onClick={cerrarModalPublicacion}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Publicación Reportada</h3>

              <div className="space-y-6">
                {/* IMAGEN DE LA PUBLICACIÓN */}
                {publicacionModal.publicacion.imagen && (
                  <div className="flex justify-center">
                    <img
                      src={`data:image/jpeg;base64,${publicacionModal.publicacion.imagen}`}
                      alt={publicacionModal.publicacion.titulo}
                      className="max-w-full h-64 object-cover rounded-lg shadow-md"
                    />
                  </div>
                )}
                
                {/* INFORMACIÓN DE LA PUBLICACIÓN */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    {publicacionModal.publicacion.titulo}
                  </h4>
                  
                  <p className="text-gray-600 mb-3">
                    {publicacionModal.publicacion.descripcion}
                  </p>
                  
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>
                      <strong>Publicado por:</strong> {publicacionModal.publicacion.nombrePerfilIdPerfil}
                    </p>
                    {publicacionModal.publicacion.fechaCreacion && (
                      <p>
                        <strong>Fecha de creación:</strong> {formatearFecha(publicacionModal.publicacion.fechaCreacion)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Advertencia - VENTANA MEDIANA */}
      {advertenciaModal.mostrar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Fondo con blur del contenido actual */}
          <div 
            className="absolute inset-0 bg-gray-50 backdrop-blur-sm bg-opacity-90"
            onClick={cerrarModalAdvertencia}
          ></div>
          
          {/* Contenido del modal - TAMAÑO MEDIANO */}
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <button 
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              onClick={cerrarModalAdvertencia}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Enviar Advertencia a {advertenciaModal.razonSocial}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje de advertencia:
              </label>
              <textarea
                value={mensajeAdvertencia}
                onChange={(e) => setMensajeAdvertencia(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black" // AGREGADO text-black
                rows={4}
                placeholder="Escribe el mensaje de advertencia..."
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={cerrarModalAdvertencia}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                disabled={enviandoAdvertencia}
              >
                Cancelar
              </button>
              
              <button
                onClick={enviarAdvertencia}
                disabled={enviandoAdvertencia || !mensajeAdvertencia.trim()}
                className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {enviandoAdvertencia ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Enviando...
                  </>
                ) : (
                  "Enviar Advertencia"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}