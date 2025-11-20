import axios from 'axios';

const API_URL = 'https://localhost:7168/api/Notificacion/api/v1';

// Obtener todas las notificaciones
export async function getNotificaciones() {
  try {
    const response = await axios.get(`${API_URL}/notificacions`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    throw error;
  }
}

// Obtener notificación por ID
export async function getNotificacionById(id) {
  try {
    const response = await axios.get(`${API_URL}/notificacion/id/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo notificación:', error);
    throw error;
  }
}

// Obtener notificaciones por perfil
export async function getNotificacionesByPerfil(perfilId) {
  try {
    // Si no hay endpoint específico, filtramos del total
    const allNotificaciones = await getNotificaciones();
    return allNotificaciones.filter(notif => notif.perfilIdPerfil === perfilId);
  } catch (error) {
    console.error('Error obteniendo notificaciones del perfil:', error);
    throw error;
  }
}

// Crear notificación
export async function createNotificacion(notificacionData) {
  try {
    const response = await axios.post(`${API_URL}/agrega/notificacion`, notificacionData);
    return response.data;
  } catch (error) {
    console.error('Error creando notificación:', error);
    throw error;
  }
}

// Actualizar notificación
export async function updateNotificacion(id, notificacionData) {
  try {
    const response = await axios.put(`${API_URL}/editar/${id}`, notificacionData);
    return response.data;
  } catch (error) {
    console.error('Error actualizando notificación:', error);
    throw error;
  }
}

// Eliminar notificación
export async function deleteNotificacion(id) {
  try {
    const response = await axios.delete(`${API_URL}/delete/notificacion/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error eliminando notificación:', error);
    throw error;
  }
}

// Marcar notificación como leída (si el backend lo soporta)
export async function marcarComoLeida(id) {
  try {
    // Si el backend tiene este endpoint, usarlo. Sino, usar update
    const notificacion = await getNotificacionById(id);
    const updatedNotificacion = {
      ...notificacion,
      leida: true // Asumiendo que existe este campo
    };
    return await updateNotificacion(id, updatedNotificacion);
  } catch (error) {
    console.error('Error marcando notificación como leída:', error);
    throw error;
  }
}