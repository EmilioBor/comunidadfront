import axios from 'axios';

const BASE_URL = 'https://localhost:7168/api/Donacion/api/v1';

// Obtener todas las donaciones
export async function getDonaciones() {
    try {
        const response = await axios.get(`${BASE_URL}/donaciones`, {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener donaciones:', error);
        throw error;
    }
}

// Obtener donación por ID
export async function getDonacionById(id) {
    try {
        const response = await axios.get(`${BASE_URL}/donacion/${id}`, {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener donación por ID:', error);
        throw error;
    }
}

// Crear nueva donación
export async function postDonacion(data) {
    try {
        const response = await axios.post(`${BASE_URL}/agrega/donacion`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear la donación:', error.response?.data || error);
        throw error;
    }
}

// Editar donación existente
export async function putDonacion(id, donacion) {
    try {
        const response = await axios.put(`${BASE_URL}/editar/${id}`, donacion, {
            headers: {
                'Content-Type': 'application/json',
            },
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error al editar la donación:', error);
        throw error;
    }
}

// Eliminar donación
export async function deleteDonacion(id) {
    try {
        const response = await axios.delete(`${BASE_URL}/eliminar/${id}`, {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error al eliminar la donación:', error);
        throw error;
    }
}