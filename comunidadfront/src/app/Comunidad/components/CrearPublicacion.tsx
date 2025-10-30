"use client";
import { useEffect, useState } from "react";
import { getPerfilById, getDonacionTipos } from "../actions";

const CrearPublicacion = ({ userId = 2 }) => {
  const [perfil, setPerfil] = useState(null);
  const [donacionTipos, setDonacionTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    titulo: "",
    contenido: "",
    tipoDonacionId: "",
    provincia: "",
    localidad: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [perfilData, tiposData] = await Promise.all([
          getPerfilById(userId),
          getDonacionTipos(),
        ]);
        setPerfil(perfilData);
        setDonacionTipos(tiposData);

        setFormData((prev) => ({
          ...prev,
          provincia: perfilData?.provincia || "",
          localidad: perfilData?.localidad || "",
        }));
      } catch (err) {
        setError("No se pudo cargar la información");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const imagenSrc = perfil?.imagen
    ? `data:image/png;base64,${perfil.imagen}`
    : "/default-avatar.png";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Datos de publicación:", formData);
    // Conectar con endpoint POST publicación
  };

  return (
    <div className="bg-[#D9D9D9] rounded-2xl p-4 flex flex-col gap-3">
      {/* Cabecera con usuario */}
      <div className="flex items-center gap-3">
        <img
          src={imagenSrc}
          alt={perfil?.razonSocial || "Usuario"}
          className="w-8 h-8 rounded-full object-cover"
        />
        <p className="font-medium text-gray-800">
          {perfil?.razonSocial || "Usuario desconocido"}
        </p>
      </div>

      {/* Fila título + tipo de donación */}
       <div className="grid grid-cols-[67%_31%] gap-3">
        <input
          type="text"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          placeholder="Título de la publicación"
          className="w-full bg-white rounded-lg p-2 text-sm text-[#3E3E3E] outline-none font-bold"
        />
        <select
          name="tipoDonacionId"
          value={formData.tipoDonacionId}
          onChange={handleChange}
          className="w-full bg-white rounded-lg p-2 text-sm text-[#3E3E3E] outline-none"
          >
          <option value="">Seleccionar tipo publicación</option>
          {donacionTipos.map((tipo) => (
            <option key={tipo.id} value={tipo.id}>
              {tipo.descripcion}
            </option>
          ))}
        </select>
      </div>


      {/* Campo de texto */}
      <textarea
        name="contenido"
        value={formData.contenido}
        onChange={handleChange}
        placeholder="Agrega la descripción de tu publicación..."
        className="w-full bg-white rounded-lg p-2 text-sm text-[#3E3E3E] resize-none outline-none h-20"
      />

      {/* Fila provincia + localidad */}
      <div className="grid grid-cols-2 gap-3">
        <select
          name="provincia"
          value={formData.provincia}
          onChange={handleChange}
          className="bg-white rounded-lg p-2 text-sm text-[#3E3E3E] outline-none"
        >
          <option value="">Seleccionar provincia</option>
          <option value={perfil?.provincia}>{perfil?.provincia}</option>
        </select>

        <select
          name="localidad"
          value={formData.localidad}
          onChange={handleChange}
          className="bg-white rounded-lg p-2 text-sm text-[#3E3E3E] outline-none"
        >
          <option value="">Seleccionar localidad</option>
          <option value={perfil?.localidad}>{perfil?.localidad}</option>
        </select>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 mt-2">
        <button className="bg-[#7DB575] text-white px-4 py-1 rounded-full hover:bg-green-600 transition">
          Agregar Foto
        </button>
        <button
          onClick={handleSubmit}
          className="bg-[#7DB575] text-white px-4 py-1 rounded-full hover:bg-green-600 transition"
        >
          Publicar
        </button>
      </div>
    </div>
  );
};

export default CrearPublicacion;
