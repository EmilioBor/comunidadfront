import axios from "axios";

export async function CreaNovedad(formData) {
  try {
    const res = await axios.post(
      "https://localhost:7168/api/Novedad/api/v1/agrega/novedad",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  } catch (err) {
    console.error("Error en el registro:", err);
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

