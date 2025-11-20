import axios from 'axios';

const API_BASE = 'https://localhost:7168/api/Notificacion/api/v1';

export const notificacionService = {
  // Obtener todas las notificaciones
  async getNotificaciones() {
    try {
      const response = await fetch(`${API_BASE}/notificacions`);
      if (!response.ok) throw new Error('Error al obtener notificaciones');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  },

  // Obtener notificaciones por perfil
  async getNotificacionesByPerfil(perfilId) {
    try {
      const allNotificaciones = await this.getNotificaciones();
      return allNotificaciones.filter(notif => notif.perfilIdPerfil === perfilId);
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  },

  // Marcar como leída
  async marcarComoLeida(id) {
    try {
      // Primero obtenemos la notificación actual
      const response = await fetch(`${API_BASE}/notificacion/id/${id}`);
      if (!response.ok) throw new Error('Error al obtener notificación');
      
      const notificacion = await response.json();
      
      // Actualizamos con el campo leida
      const updatedNotificacion = {
        ...notificacion,
        leida: true
      };

      const updateResponse = await fetch(`${API_BASE}/editar/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedNotificacion)
      });

      if (!updateResponse.ok) throw new Error('Error al actualizar notificación');
      return await updateResponse.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // Eliminar notificación
  async eliminarNotificacion(id) {
    try {
      const response = await fetch(`${API_BASE}/delete/notificacion/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Error al eliminar notificación');
      return true;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
};