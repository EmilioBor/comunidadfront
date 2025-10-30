import axios from "axios";


export async function RegistroAPI(data) {
    try {
        console.log('Datos enviados:', data);
        const res = await axios.post('https://localhost:7168/api/Usuario/api/v1/agrega/usuario', data, {
            headers: {
                'Content-Type': 'application/json',
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