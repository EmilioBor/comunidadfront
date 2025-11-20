import { useState, useEffect, useCallback } from 'react';
import { getNotificacionesByPerfil, marcarComoLeida, deleteNotificacion } from '@/app/lib/api/notificacionApi';

export function useNotificaciones(perfilId) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Cargar notificaciones
  const cargarNotificaciones = useCallback(async () => {
    if (!perfilId) return;
    
    try {
      setLoading(true);
      const data = await getNotificacionesByPerfil(perfilId);
      setNotificaciones(data);
      
      // Contar no leídas (asumiendo que tienes un campo 'leida' en el backend)
      // Si no existe el campo, todas se consideran no leídas
      const noLeidas = data.filter(notif => !notif.leida).length;
      setUnreadCount(noLeidas);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    } finally {
      setLoading(false);
    }
  }, [perfilId]);

  // Polling para actualizaciones en tiempo real
  useEffect(() => {
    if (!perfilId) return;

    cargarNotificaciones();

    // Polling cada 30 segundos
    const interval = setInterval(cargarNotificaciones, 30000);

    return () => clearInterval(interval);
  }, [perfilId, cargarNotificaciones]);

  const marcarComoLeidaHandler = async (notificacionId) => {
    try {
      await marcarComoLeida(notificacionId);
      
      // Actualizar estado local
      setNotificaciones(prev => 
        prev.map(notif => 
          notif.id === notificacionId ? { ...notif, leida: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marcando notificación como leída:', error);
    }
  };

  const eliminarNotificacionHandler = async (notificacionId) => {
    try {
      await deleteNotificacion(notificacionId);
      
      // Actualizar estado local
      const notificacionEliminada = notificaciones.find(n => n.id === notificacionId);
      setNotificaciones(prev => prev.filter(notif => notif.id !== notificacionId));
      
      if (notificacionEliminada && !notificacionEliminada.leida) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error eliminando notificación:', error);
    }
  };

  return {
    notificaciones,
    loading,
    unreadCount,
    cargarNotificaciones,
    marcarComoLeida: marcarComoLeidaHandler,
    eliminarNotificacion: eliminarNotificacionHandler
  };
}