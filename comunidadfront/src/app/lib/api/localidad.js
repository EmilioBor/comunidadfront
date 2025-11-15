import axios from 'axios';

export async function GetLocalidadesApi() {
    try {
        const response = await axios.get('https://localhost:7168/api/Localidad/api/v1/localidads', {
            httpsAgent: new (require('https')).Agent({ rejectUnauthorized: false })
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}



export async function GetLocalidadesByID(id) {
  try {
    console.log("📌 [GetLocalidadesByID] Buscando localidad ID:", id);

    const response = await axios.get(
      `https://localhost:7168/api/Localidad/api/v1/localidad/id/${id}`
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

