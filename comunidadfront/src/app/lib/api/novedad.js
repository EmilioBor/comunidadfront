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
