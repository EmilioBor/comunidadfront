"use client";

import { useState, useRef, useEffect } from 'react';
import { notificacionService } from '@/app/lib/api/notificacionApi';
import { getNotificacionNombre } from "../../lib/api/notificacionApi";

interface Notificacion {
  id: number;
  perfilIdPerfil: number;
  chatIdChat?: number;
  titulo: string;
  descripcion: string;
  novedadIdNovedad?: number;
  nombrePerfilIdPerfil?: string;
  nombreNovedadIdNovedad?: string;
  leida?: boolean;
  fechaCreacion?: string;
}

interface NotificacionesProps {
  perfilId: number;
}

export default function Notificaciones({ perfilId }: NotificacionesProps) {
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cargar notificaciones
  const cargarNotificaciones = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Cargando notificaciones para perfilId:', perfilId);
      const data = await getNotificacionNombre(perfilId.razonSocial);
      console.log('Notificaciones cargadas:', data);
      setNotificaciones(data);
    } catch (err) {
      setError('Error al cargar notificaciones');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    // Datos de ejemplo - reemplazar con llamada real a la API
    const notificacionesEjemplo: Notificacion[] = [
      {
        id: 1,
        perfilIdPerfil: perfilId,
        titulo: "Bienvenido a Comunidad Solidaria",
        descripcion: "Tu cuenta ha sido creada exitosamente",
        leida: false
      },
      {
        id: 2,
        perfilIdPerfil: perfilId,
        titulo: "Nueva donación recibida",
        descripcion: "Has recibido una donación de $500",
        leida: true
      }
    ];
    
    setNotificaciones(notificacionesEjemplo);
  }, [perfilId]);

  // Cargar notificaciones inicialmente y cada 30 segundos
  useEffect(() => {
    if (!perfilId) return;

    cargarNotificaciones();

    const interval = setInterval(cargarNotificaciones, 30000); // Actualizar cada 30 segundos
    return () => clearInterval(interval);
  }, [perfilId]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMostrarNotificaciones(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleNotificaciones = () => {
    setMostrarNotificaciones(!mostrarNotificaciones);
    if (!mostrarNotificaciones) {
      cargarNotificaciones(); // Recargar al abrir
    }
  };

  const handleMarcarComoLeida = async (notificacionId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificacionService.marcarComoLeida(notificacionId);
      setNotificaciones(prev => 
        prev.map(notif => 
          notif.id === notificacionId ? { ...notif, leida: true } : notif
        )
      );
    } catch (err) {
      console.error('Error marcando como leída:', err);
    }
  };

  const handleEliminarNotificacion = async (notificacionId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificacionService.eliminarNotificacion(notificacionId);
      setNotificaciones(prev => prev.filter(notif => notif.id !== notificacionId));
    } catch (err) {
      console.error('Error eliminando notificación:', err);
    }
  };

  const formatearFecha = (fechaString?: string) => {
    if (!fechaString) return 'Reciente';
    
    try {
      const fecha = new Date(fechaString);
      const ahora = new Date();
      const diffMs = ahora.getTime() - fecha.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Ahora mismo';
      if (diffMins < 60) return `Hace ${diffMins} min`;
      if (diffHours < 24) return `Hace ${diffHours} h`;
      if (diffDays < 7) return `Hace ${diffDays} d`;
      
      return fecha.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'Reciente';
    }
  };

  const handleNotificacionClick = (notificacion: Notificacion) => {
    // Navegar según el tipo de notificación
    if (notificacion.chatIdChat) {
      window.location.href = `/Chat/${notificacion.chatIdChat}`;
    } else if (notificacion.novedadIdNovedad) {
      window.location.href = `/Novedades#${notificacion.novedadIdNovedad}`;
    }
    
    // Marcar como leída si no lo está
    if (!notificacion.leida) {
      notificacionService.marcarComoLeida(notificacion.id);
    }
    
    setMostrarNotificaciones(false);
  };

  const unreadCount = notificaciones.filter(notif => !notif.leida).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón de campana MEJORADO */}
      <button
        onClick={toggleNotificaciones}
        className="relative p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200 group"
        title="Notificaciones"
      >
        {/* Icono de campana más profesional */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
        </svg>
        
        {/* Badge de notificaciones no leídas - MEJORADO */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse border-2 border-gray-800">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown de notificaciones */}
      {mostrarNotificaciones && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header MEJORADO */}
          <div className="px-4 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Notificaciones</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todas leídas'}
                </p>
              </div>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-medium animate-pulse">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>

          {/* Lista de notificaciones */}
          <div className="overflow-y-auto max-h-64">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-3"></div>
                <p className="text-gray-500 text-sm">Cargando notificaciones...</p>
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-600">
                <svg className="w-12 h-12 mx-auto text-red-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-medium">{error}</p>
                <button 
                  onClick={cargarNotificaciones}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  Reintentar
                </button>
              </div>
            ) : notificaciones.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                <h4 className="text-lg font-semibold text-gray-600 mb-2">No hay notificaciones</h4>
                <p className="text-gray-500 text-sm">
                  Te avisaremos cuando tengas nuevas notificaciones
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notificaciones.map((notificacion) => (
                  <div
                    key={notificacion.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-all duration-200 group ${
                      !notificacion.leida 
                        ? 'bg-blue-50 border-l-4 border-blue-500 hover:bg-blue-100' 
                        : 'border-l-4 border-transparent'
                    }`}
                    onClick={() => handleNotificacionClick(notificacion)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className={`font-semibold text-sm mb-1 ${
                          !notificacion.leida ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notificacion.titulo || 'Nueva notificación'}
                        </h4>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {notificacion.descripcion || 'Sin descripción'}
                        </p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notificacion.leida && (
                          <button
                            onClick={(e) => handleMarcarComoLeida(notificacion.id, e)}
                            className="text-green-600 hover:text-green-800 text-xs p-1 bg-white rounded border"
                            title="Marcar como leída"
                          >
                            ✓
                          </button>
                        )}
                        <button
                          onClick={(e) => handleEliminarNotificacion(notificacion.id, e)}
                          className="text-red-600 hover:text-red-800 text-xs p-1 bg-white rounded border"
                          title="Eliminar"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                      <span>
                        {notificacion.nombrePerfilIdPerfil && `De: ${notificacion.nombrePerfilIdPerfil}`}
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {formatearFecha(notificacion.fechaCreacion)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer MEJORADO */}
          {notificaciones.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {notificaciones.length} notificaciones
                </span>
                <button
                  onClick={() => {
                    // Marcar todas como leídas
                    notificaciones.forEach(notif => {
                      if (!notif.leida) {
                        notificacionService.marcarComoLeida(notif.id);
                      }
                    });
                    setNotificaciones(prev => 
                      prev.map(notif => ({ ...notif, leida: true }))
                    );
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Marcar todas como leídas
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}