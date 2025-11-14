import axios from 'axios';

const BASE_URL = 'https://localhost:7168/api/DonacionTipo/api/v1';

//Obtener todos los tipos de donación
export async function getDonacionTipos() {
    try {
        const response = await axios.get(`${BASE_URL}/donacionTipos`, {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener tipos de donación:', error);
        throw error;
    }
}

//Obtener un tipo de donación por ID
export async function getDonacionTipoById(id) {
    try {
        const response = await axios.get(`${BASE_URL}/donacionTipo/id/${id}`, {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener tipo de donación por ID:', error);
        throw error;
    }
}

//Crear un nuevo tipo de donación
export async function postDonacionTipo(data) {
    try {
        const response = await axios.post(`${BASE_URL}/agrega/donacionTipo`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear tipo de donación:', error.response?.data || error);
        throw error;
    }
}
