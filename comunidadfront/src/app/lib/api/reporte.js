import axios from 'axios';

const BASE_URL = 'https://localhost:7168/api/UsuarioReporte/api/v1';

// Obtener todos los reportes
export async function getReportes() {
    try {
        const response = await axios.get(`${BASE_URL}/usuarioReportes`, {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener reportes:', error);
        throw error;
    }
}

// Obtener reporte por ID
export async function getReporteById(id) {
    try {
        const response = await axios.get(`${BASE_URL}/usuarioReporte/id/${id}`, {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener reporte por ID:', error);
        throw error;
    }
}

// Crear nuevo reporte
export async function postReporte(data) {
    try {
        const response = await axios.post(`${BASE_URL}/agrega/usuarioReporte`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
            httpsAgent: new (require('https')).Agent({ 
                rejectUnauthorized: false 
            }),
            timeout: 30000 // ← AGREGA ESTA LÍNEA (30 segundos)
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear el reporte:', error.response?.data || error);
        throw error;
    }
}

// Editar reporte existente
export async function putReporte(id, reporte) {
    try {
        const response = await axios.put(`${BASE_URL}/editar/${id}`, reporte, {
            headers: {
                'Content-Type': 'application/json',
            },
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error al editar el reporte:', error);
        throw error;
    }
}

// Eliminar reporte
export async function deleteReporte(id) {
    try {
        const response = await axios.delete(`${BASE_URL}/delete/usuarioReporte/${id}`, {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error al eliminar el reporte:', error);
        throw error;
    }
}