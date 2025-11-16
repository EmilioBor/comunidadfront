import axios from "axios";
const API_BASE_URL = "https://localhost:7168"; 
export const getProvincias = async () => {
  try {
    const response = await fetch("https://localhost:7168/api/Provincia/api/v1/provincias");
    if (!response.ok) throw new Error("Error al obtener provincias");
    return await response.json();
  } catch (error) {
    console.error("fetchProvincias:", error);
    return [];
  }
};

export const getLocalidadesByProvincia = async (provinciaId) => {
  try {
    const response = await fetch(`/api/Localidad/api/v1/localidads?provinciaId=${provinciaId}`);
    if (!response.ok) throw new Error("Error al obtener localidades");
    return await response.json();
  } catch (error) {
    console.error("fetchLocalidadesByProvincia:", error);
    return [];
  }
};

export const gethProvinciaById = async (id) => {
  try {
    const response = await fetch(`https://localhost:7168/api/Provincia/api/v1/provincia/id/${id}`);
    if (!response.ok) throw new Error("Error al obtener provincia por id");
    return await response.json();
  } catch (error) {
    console.error("fetchProvinciaById:", error);
    return null;
  }
};