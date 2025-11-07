import axios from 'axios';

const BASE_URL = 'https://localhost:7168/api/Envio/api/v1';

// Obtener todos los envíos
export async function getEnvios() {
    try {
        const response = await axios.get(`${BASE_URL}/envios`, {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener envíos:', error);
        throw error;
    }
}

// Obtener envío por ID
export async function getEnvioById(id) {
    try {
        const response = await axios.get(`${BASE_URL}/envio/id/${id}`, {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener envío por ID:', error);
        throw error;
    }
}

// Crear nuevo envío
export async function postEnvio(data) {
    try {
        const response = await axios.post(`${BASE_URL}/agrega/envio`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear envío:', error.response?.data || error);
        throw error;
    }
}

// Editar envío existente
export async function putEnvio(id, envio) {
    try {
        const response = await axios.put(`${BASE_URL}/editar/${id}`, envio, {
            headers: {
                'Content-Type': 'application/json',
            },
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error al editar envío:', error);
        throw error;
    }
}

// Eliminar envío
export async function deleteEnvio(id) {
    try {
        const response = await axios.delete(`${BASE_URL}/delete/envio/${id}`, {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error al eliminar envío:', error);
        throw error;
    }
}