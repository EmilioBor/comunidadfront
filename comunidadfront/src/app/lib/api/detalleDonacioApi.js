// src/lib/api/detalleDonacionTipoApi.js
import axios from 'axios';

const BASE_URL = 'https://localhost:7168/api/DetalleDonacionTipo/api/v1';

// Obtener todos los tipos de detalle de donación
export async function getDetalleDonacionTipos() {
    try {
        const response = await axios.get(`${BASE_URL}/detalleDonacionTipos`, {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener tipos de detalle de donación:', error);
        throw error;
    }
}

// Obtener un tipo de detalle de donación por ID
export async function getDetalleDonacionTipoById(id) {
    try {
        const response = await axios.get(`${BASE_URL}/detalleDonacionTipo/id/${id}`, {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener tipo de detalle de donación por ID:', error);
        throw error;
    }
}

// Crear un nuevo tipo de detalle de donación
export async function postDetalleDonacionTipo(data) {
    try {
        const response = await axios.post(`${BASE_URL}/agrega/detalleDonacionTipo`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear tipo de detalle de donación:', error.response?.data || error);
        throw error;
    }
}

