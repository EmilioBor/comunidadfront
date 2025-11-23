import axios from 'axios';

const API_BASE = 'https://localhost:7168/api/Notificacion/api/v1';

export const notificacionService = {
  // Obtener todas las notificaciones
  async getNotificaciones() {
    try {
      const response = await fetch(`https://localhost:7168/api/Notificacion/api/v1/notificacions`);
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
      // console.log('Todas las notificaciones:', allNotificaciones);
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

export async function postNotificacion(data) {
  try {
    const response = await axios.post(`https://localhost:7168/api/Notificacion/api/v1/agrega/notificacion`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear notificación:', error);
    throw error;
  } 
}



    //obtener perfil por nombre
        export async function getNotificacionNombre(data) {
        try {
            const encoded = encodeURIComponent(data); 
            const url = `https://localhost:7168/api/Notificacion/api/v1/notificacion/buscar-nombre/${encoded}`;
            console.log("GET:", url);

            const response = await axios.get(url);

            return response.data;

        } catch (error) {
            console.error("Error en GetNotificacionByPerfil:", error);

            // Si el backend devuelve 404 → el usuario no tiene perfil aún
            if (error.response?.status === 404) {
            return null;  // manejalo en el front
            }

            throw error;
        }
    }