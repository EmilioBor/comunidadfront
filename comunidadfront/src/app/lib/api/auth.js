import axios from 'axios';
import 'server-only';

export async function loginAPI(data) {
    try {
        console.log('Datos enviados:', data);
        
        // Realizar la solicitud con axios
        const res = await axios.post('https://localhost:7168/api/Usuario/login', data, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        

        // Devolver el objeto completo de la API
        return res.data;  // Devuelve el objeto completo, no solo el token
    } catch (error) {
    // Error cuando el backend NO responde
    if (error.code === "ECONNREFUSED") {
      console.error("❌ BACKEND ESTA CAIDO O NO ES ACCESIBLE.");
      throw new Error(
        "NO SE CONECTA CON EL SERVIDOR. VERIFICA QUE EL BACK ESTE INICIADO."
      );
    }

    // Timeout
    if (error.code === "ECONNABORTED") {
      console.error("❌ Timeout alcanzado.");
      throw new Error(
        "El servidor no respondió a tiempo. Intenta nuevamente en unos segundos."
      );
    }

    // Errores SSL (certificado inválido en HTTPS)
    if (error.message.includes("self signed certificate") ||
        error.message.includes("SSL")) {
      console.error("❌ Error SSL / Certificado.");
      throw new Error(
        "Hubo un problema con la conexión segura (HTTPS). Verifica el certificado del backend."
      );
    }

    // Si el backend respondió con un error (400/401/500/etc.)
    if (error.response) {
      console.error("❌ Error del backend:", error.response.data);

      const backendMsg =
        error.response.data?.message ||
        error.response.data?.error ||
        error.response.data;

      throw new Error(
        typeof backendMsg === "string"
          ? backendMsg
          : "Error al procesar la solicitud."
      );
    }

    // Error desconocido
    console.error("❌ Error desconocido:", error);
    throw new Error("Ocurrió un error inesperado al iniciar sesión.");
  }
}
