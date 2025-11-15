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
