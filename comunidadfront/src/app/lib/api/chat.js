'use service';
import axios from "axios";

export async function getChatByPerfil(date) {
  try {
    console.log("📌 [getChatByPerfil] Buscando perfil ID:", date);

    const encoded = encodeURIComponent(data); 
    const response = await axios.get(
      `https://localhost:7168/perfil/${encoded}`
    );

    console.log("📌 [GetLocalidadesByID] Respuesta backend:", response.data);

    return response.data;

  } catch (error) {
    console.error("❌ Error en GetLocalidadesByID:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    return null; // <-- NO tiramos error acá
  }
}