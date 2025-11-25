import axios from "axios";

const API_BASE_URL = "https://localhost:7168"; 

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

// Obtener perfil por ID de usuario
    export async function GetUserByPerfil(idUsuario) {
        try {
            const url = `https://localhost:7168/api/Perfil/v1/perfil/user/${idUsuario}`;
            console.log("GET:", url);

            const response = await axios.get(url);

            return response.data;

        } catch (error) {
            console.error("Error en GetUserByPerfil:", error);

            // Si el backend devuelve 404 → el usuario no tiene perfil aún
            if (error.response?.status === 404) {
            return null;  // manejalo en el front
            }

            throw error;
        }
    }

    //obtener perfil por nombre
        export async function getPerfilNombre(data) {
        try {
            const encoded = encodeURIComponent(data); 
            const url = `https://localhost:7168/api/Perfil/v1/perfil/nombre/${encoded}`;
            console.log("GET:", url);

            const response = await axios.get(url);

            return response.data;

        } catch (error) {
            console.error("Error en GetUserByPerfil:", error);

            // Si el backend devuelve 404 → el usuario no tiene perfil aún
            if (error.response?.status === 404) {
            return null;  // manejalo en el front
            }

            throw error;
        }
    }

// Obtener perfil por ID
export const getPerfilId = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Perfil/api/v1/perfil/id/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener el perfil: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("[getPerfilById] Error:", error);
    throw error;
  }
};

// Editar perfil
export async function actualizarPerfilAPI(perfilId, datosPerfil) {
    try {
        const url = `https://localhost:7168/api/Perfil/api/v1/editar/${perfilId}`;
        console.log("PUT con JSON:", url);
        console.log("Datos:", datosPerfil);

        const response = await axios.put(url, datosPerfil, {
            headers: {
                'Content-Type': 'application/json',
            },
            httpsAgent: new (require('https')).Agent({ 
                rejectUnauthorized: false 
            })
        });

        console.log("✅ Perfil actualizado exitosamente");
        return response.data;

    } catch (error) {
        console.error("Error en actualizarPerfilAPI:", error);
        console.error("Status:", error.response?.status);
        console.error("Data:", error.response?.data);

        if (error.response?.status === 404) {
            return null;
        }

        throw error;
    }
}



// Obtener todas las donaciones
export async function getPerfiles() {
    try {
        const response = await axios.get(`https://localhost:7168/api/Perfil/api/v1/perfils`, {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener donaciones:', error);
        throw error;
    }
}
