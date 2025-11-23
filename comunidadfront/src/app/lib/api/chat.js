'use service';
import axios from "axios";

export async function getChatByPerfil(date) {
  try {
    console.log("📌 [getChatByPerfil] Buscando perfil nombre:", date);

    const encoded = encodeURIComponent(date); 
    const response = await axios.get(
      `https://localhost:7168/perfil/${encoded}`
    );

    console.log("📌 [getChatByPerfil] Respuesta backend:", response.data);

    return response.data;

  } catch (error) {
    console.error("❌ Error en getChatByPerfil:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    return null;
  }
}
