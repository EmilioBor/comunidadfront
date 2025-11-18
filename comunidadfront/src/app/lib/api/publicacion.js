import axios from "axios";
import https from "https"; // ⚠️ Esto es lo que te falta

export async function getPublicacionPerfil(data) {
  try {
    console.log("Llamando a getPublicacionPerfil con:", data);

    if (!data) return [];

    const res = await axios.get(
      `https://localhost:7168/api/Publicacion/api/v1/publicacion/perfil/${data}`,
      {
        headers: {
          "Accept": "application/json",
        },
        timeout: 5000, // evita que quede colgado
      }
    );

    console.log("Publicaciones recibidas:", res.data);
    return Array.isArray(res.data) ? res.data : [];

  } catch (err) {
    if (err.response) {
      console.error("❌ Error del backend:", err.response.data);
    } else if (err.request) {
      console.error("❌ No hubo respuesta del backend:", err.message);
    } else {
      console.error("❌ Error inesperado:", err.message);
    }
    return [];
  }
}

export async function getPublicacionTipo() {
  try {
    const res = await axios.get(
      "https://localhost:7168/api/PublicacionTipo/api/v1/publicacionTipos",
      {
        headers: {
          Accept: "application/json",
        },
        timeout: 5000,
      }
    );

    console.log("Publicaciones recibidas:", res.data);
    return Array.isArray(res.data) ? res.data : [];

  } catch (err) {
    if (err.response) {
      console.error("❌ Error del backend:", err.response.data);
    } else if (err.request) {
      console.error("❌ No hubo respuesta del backend:", err.message);
    } else {
      console.error("❌ Error inesperado:", err.message);
    }
    return [];
  }
}


export async function getPublicacion() {
  try {

    const res = await axios.get(
      `https://localhost:7168/api/Publicacion/api/v1/publicacions`,
      {
        headers: {
          "Accept": "application/json",
        },
        timeout: 1000, // evita que quede colgado
      }
    );

    console.log("Publicaciones recibidas:", res.data);
    return Array.isArray(res.data) ? res.data : [];

  } catch (err) {
    if (err.response) {
      console.error("❌ Error del backend:", err.response.data);
    } else if (err.request) {
      console.error("❌ No hubo respuesta del backend:", err.message);
    } else {
      console.error("❌ Error inesperado:", err.message);
    }
    return [];
  }
}

export async function crearPublicacion(formData) {
  try {
    const res = await axios.post(
      "https://localhost:7168/api/Publicacion/api/v1/agrega/publicacion/",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" }, // necesario
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error al crear la publicación:", error.response?.data || error);
    throw error;
  }
}

export async function obtenerPublicacionPorId(id) {
  try {
    console.log("Obteniendo publicación con ID:", id);

    const res = await axios.get(
      `https://localhost:7168/api/Publicacion/api/v1/publicacion/id/${id}`,
      {
        headers: {
          "Accept": "application/json",
        },
        timeout: 5000,
      }
    );

    console.log("Publicación obtenida:", res.data);
    return res.data;

  } catch (err) {
    if (err.response) {
      console.error("❌ Error del backend al obtener publicación:", err.response.data);
    } else if (err.request) {
      console.error("❌ No hubo respuesta del backend:", err.message);
    } else {
      console.error("❌ Error inesperado:", err.message);
    }
    throw err;
  }
}

// En app/lib/api/publicacion.js - CORREGIR actualizarPublicacionAPI
export async function actualizarPublicacionAPI(publicacionId, datosPublicacion) {
    try {
        const url = `https://localhost:7168/api/Publicacion/api/v1/editar/${publicacionId}`;
        console.log("PUT con JSON:", url);
        console.log("Datos:", datosPublicacion);

        const response = await axios.put(url, datosPublicacion, {
            headers: {
                'Content-Type': 'application/json',
            },
            httpsAgent: new https.Agent({ 
                rejectUnauthorized: false 
            })
        });

        console.log("✅ Publicación actualizada exitosamente");
        return response.data;

    } catch (error) {
        console.error("Error en actualizarPublicacionAPI:", error);
        console.error("Status:", error.response?.status);
        console.error("Data:", error.response?.data);

        if (error.response?.status === 404) {
            return null;
        }

        throw error;
    }
}

// Función para eliminar publicación
export async function eliminarPublicacionAPI(id) {
  try {
    console.log("Eliminando publicación con ID:", id);

    const res = await axios.delete(
      `https://localhost:7168/api/Publicacion/api/v1/delete/publicacion/${id}`,
      {
        headers: {
          "Accept": "application/json",
        },
        timeout: 5000,
      }
    );

    console.log("Publicación eliminada exitosamente:", res.data);
    return res.data;

  } catch (err) {
    if (err.response) {
      console.error("❌ Error del backend al eliminar publicación:", err.response.data);
    } else if (err.request) {
      console.error("❌ No hubo respuesta del backend:", err.message);
    } else {
      console.error("❌ Error inesperado:", err.message);
    }
    throw err;
  }
}