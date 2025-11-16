import axios from "axios";

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

export async function getPublicacionTipo(data) {
  try {
    console.log("Llamando a getPublicacionPerfil con:", data);

    if (!data) return [];

    const res = await axios.get(
      `https://localhost:7168/api/Publicacion/api/v1/publicacion/tipopublicacion/${data}`,
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
