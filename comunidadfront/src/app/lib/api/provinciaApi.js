import axios from 'axios';

const BASE_URL = 'https://localhost:7168/api/Provincia/api/v1';

// Obtener todas las provincias
export async function getProvincias() {
    try {
        const response = await axios.get(`${BASE_URL}/provincias`, {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener provincias:', error);
        throw error;
    }
}

// Obtener provincia por ID
export async function getProvinciaById(id) {
    try {
        const response = await axios.get(`${BASE_URL}/provincia/id/${id}`, {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener provincia por ID:', error);
        throw error;
    }
}