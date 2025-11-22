import axios from "axios";
import { getSession } from "./session";

export async function CreaNovedad(formData) {
  try {
    const session = await getSession();
    
    const headers = {
      // NO establezcar Content-Type manualmente con FormData
      // Axios lo hará automáticamente con el boundary correcto
    };

    // Agregar token si existe
    if (session?.token) {
      headers.Authorization = `Bearer ${session.token}`;
    }

    console.log("📤 Enviando novedad con FormData...");
    console.log("📋 Headers:", headers);

    const res = await axios.post(
      "https://localhost:7168/api/Novedad/api/v1/agrega/novedad",
      formData,
      { headers }
    );

    console.log("✅ Respuesta del backend:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Error en CreaNovedad:", err.message);
    if (err.response) {
      console.error("📊 Status:", err.response.status);
      console.error("📝 Data:", err.response.data);
      console.error("📌 Headers respuesta:", err.response.headers);
    }
    throw err;
  }
}

export async function getNovedades() {
  try {
        const res = await fetch(
          "https://localhost:7168/api/Novedad/api/v1/novedades"
        );
        if (!res.ok) throw new Error("Error al obtener novedades");
        const data = await res.json();
        return data;
      } catch (err) {
        console.error(err);
      }
    }

    // Obtener novedad por ID
export async function getNovedadPorId(id) {
  try {
    const url = `https://localhost:7168/api/Novedad/api/v1/novedad/id/${id}`;
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Error al obtener novedad: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getNovedadPorId:", error);
    throw error;
  }
}
    