import axios from "axios";


export async function CrearPerfil(data) {
    try {
        console.log('Datos enviados:', data);
        const res = await axios.post('https://localhost:7168/api/Perfil/api/v1/agrega/perfil', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        console.log("Respuesta del backend:", res.data);

        return res.data;  // Devuelve el objeto completo, no solo el token
    } catch (error) {
        console.error("El error esta en la api de registro");
        console.error("Error en el registro:", error.response ? error.response.data : error.message);
        throw error;  // Propaga el error para manejarlo en el cliente
    }
}

// Obtener perfil por ID
export async function getPerfilById(id) {
    try {
        const response = await axios.get(`${BASE_URL}/perfil/id/${id}`, {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener perfil por ID:', error);
        throw error;
    }
}

// Obtener todos los perfiles
export async function getPerfiles() {
    try {
        const response = await axios.get(`${BASE_URL}/perfils`, {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener perfiles:', error);
        throw error;
    }
}