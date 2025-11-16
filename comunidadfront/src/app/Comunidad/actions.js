const API_BASE_URL = "https://localhost:7168"; // ⚠️ ajustá esto según tu backend real

// Obtener perfil por ID
export const getPerfilById = async (id) => {
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

// Obtener tipo donacion
export const getDonacionTipos = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/DonacionTipo/api/v1/donacionTipos`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok)
      throw new Error(`Error al obtener tipos de donación: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error("[getDonacionTipos] Error:", error);
    throw error;
  }
};

// Obtener todas las provincias
export const fetchProvincias = async () => {
  try {
    const response = await fetch("/api/Provincia/api/v1/provincias");
    if (!response.ok) throw new Error("Error al obtener provincias");
    return await response.json();
  } catch (error) {
    console.error("fetchProvincias:", error);
    return [];
  }
};

// Obtener todas las localidades de una provincia
export const fetchLocalidadesByProvincia = async (provinciaId) => {
  try {
    const response = await fetch(`/api/Localidad/api/v1/localidads?provinciaId=${provinciaId}`);
    if (!response.ok) throw new Error("Error al obtener localidades");
    return await response.json();
  } catch (error) {
    console.error("fetchLocalidadesByProvincia:", error);
    return [];
  }
};

// Obtener provincia por ID
export const fetchProvinciaById = async (id) => {
  try {
    const response = await fetch(`/api/Provincia/api/v1/provincia/id/${id}`);
    if (!response.ok) throw new Error("Error al obtener provincia por id");
    return await response.json();
  } catch (error) {
    console.error("fetchProvinciaById:", error);
    return null;
  }
};

// Obtener localidad por ID
export const fetchLocalidadById = async (id) => {
  try {
    const response = await fetch(`/api/Localidad/api/v1/localidad/id/${id}`);
    if (!response.ok) throw new Error("Error al obtener localidad por id");
    return await response.json();
  } catch (error) {
    console.error("fetchLocalidadById:", error);
    return null;
  }
};
