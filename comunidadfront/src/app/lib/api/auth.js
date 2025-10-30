import axios from 'axios';
import 'server-only';

export async function loginAPI(data) {
    try {
        console.log('Datos enviados:', data);
        
        // Realizar la solicitud con axios
        const res = await axios.post('https://localhost:7168/Login/Login', data, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        

        // Devolver el objeto completo de la API
        return res.data;  // Devuelve el objeto completo, no solo el token
    } catch (error) {
        console.error("Error en el login:", error.response ? error.response.data : error.message);
        throw error;  // Propaga el error para manejarlo en el cliente
    }
}
