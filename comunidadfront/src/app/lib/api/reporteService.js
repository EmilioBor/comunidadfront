// app/lib/api/reporteService.js
import { getReportes, getReporteById } from './reporte';

const API_BASE = 'https://localhost:7168/api';

export const reporteService = {
  // Obtener todos los reportes usando tu función existente
  async getReportes() {
    try {
      return await getReportes();
    } catch (error) {
      console.error('Error obteniendo reportes:', error);
      return [];
    }
  },

  // Obtener reporte por ID usando tu función existente
  async getReporteById(id) {
    try {
      return await getReporteById(id);
    } catch (error) {
      console.error('Error obteniendo reporte:', error);
      return null;
    }
  },

  // Obtener publicación por ID
  async getPublicacionById(id) {
    try {
      const response = await fetch(`${API_BASE}/Publicacion/api/v1/publicacion/id/${id}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo publicación:', error);
      return null;
    }
  },

  // Obtener perfil por ID
  async getPerfilById(id) {
    try {
      const response = await fetch(`${API_BASE}/Perfil/v1/perfil/${id}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      return null;
    }
  },

  // Enviar advertencia (crear notificación)
  async enviarAdvertencia(perfilId, mensaje) {
    try {
      const notificacionData = {
        perfilIdPerfil: perfilId,
        titulo: "Advertencia del Administrador",
        descripcion: mensaje,
        chatIdChat: null,
        novedadIdNovedad: null
      };

      const response = await fetch(`${API_BASE}/Notificacion/api/v1/agrega/notificacion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificacionData)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error enviando advertencia:', error);
      throw error;
    }
  },

  // Marcar reporte como resuelto
  async marcarReporteResuelto(id) {
    try {
      // Primero obtenemos el reporte actual
      const reporte = await this.getReporteById(id);
      if (!reporte) {
        throw new Error('Reporte no encontrado');
      }

      // Actualizamos el reporte con estado resuelto
      const reporteActualizado = {
        ...reporte,
        estado: 'resuelto'
      };

      const response = await fetch(`${API_BASE}/UsuarioReporte/api/v1/editar/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reporteActualizado)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error marcando reporte como resuelto:', error);
      throw error;
    }
  },

  // Obtener reportes por estado
  async getReportesPorEstado(estado) {
    try {
      const reportes = await this.getReportes();
      return reportes.filter(reporte => reporte.estado === estado);
    } catch (error) {
      console.error('Error obteniendo reportes por estado:', error);
      return [];
    }
  },

  // Obtener reportes por motivo
  async getReportesPorMotivo(motivo) {
    try {
      const reportes = await this.getReportes();
      return reportes.filter(reporte => reporte.motivo === motivo);
    } catch (error) {
      console.error('Error obteniendo reportes por motivo:', error);
      return [];
    }
  }
};