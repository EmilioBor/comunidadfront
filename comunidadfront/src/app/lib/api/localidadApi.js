import axios from 'axios';

const BASE_URL = 'https://localhost:7168/api/Localidad/api/v1';

// Obtener todas las localidades
export async function getLocalidades() {
    try {
        const response = await axios.get(`${BASE_URL}/localidads`, {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener localidades:', error);
        throw error;
    }
}

// Obtener localidad por ID
export async function getLocalidadById(id) {
    try {
        const response = await axios.get(`${BASE_URL}/localidad/id/${id}`, {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener localidad por ID:', error);
        throw error;
    }
}