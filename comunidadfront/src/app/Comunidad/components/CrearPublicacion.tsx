"use client";
import { useEffect, useState } from "react";
// import { getPerfilById, getDonacionTipos, crearPublicacion } from "../actions";

const CrearPublicacion = ({ userId }) => {
  const [perfil, setPerfil] = useState(null);
  const [donacionTipos, setDonacionTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [imagenBase64, setImagenBase64] = useState(null);

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    tipoDonacionId: "",
    localidadIdLocalidad: "",
    donacionIdDonacion: 1, // valor fijo si tu backend lo requiere
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
          localidadIdLocalidad: perfilData?.localidadId || "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagen = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagenBase64(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    const payload = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      imagen: imagenBase64,
      localidadIdLocalidad: formData.localidadIdLocalidad,
      perfilIdPerfil: perfil.id,
      publicacionTipoIdPublicacionTipo: formData.tipoDonacionId,
      donacionIdDonacion: formData.donacionIdDonacion,
    };

    console.log("📤 Enviando publicación:", payload);

    try {
      const result = await crearPublicacion(payload);
      console.log(result);
      alert("Publicación creada correctamente");
    } catch (err) {
      console.error(err);
      alert("Error al crear publicación");
    }
  };

  return (
    <div className="bg-[#D9D9D9] rounded-2xl p-4 flex flex-col gap-3">

      {/* Cabecera */}
      <div className="flex items-center gap-3">
        <img
          src={
            perfil?.imagen
              ? `data:image/png;base64,${perfil.imagen}`
              : "/default-avatar.png"
          }
          className="w-8 h-8 rounded-full"
        />
        <p>{perfil?.razonSocial}</p>
      </div>

      {/* Título + tipo */}
      <div className="grid grid-cols-[67%_31%] gap-3">
        <input
          type="text"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          placeholder="Título"
          className="bg-white rounded-lg p-2 text-sm text-[#3E3E3E] font-bold"
        />

        <select
          name="tipoDonacionId"
          value={formData.tipoDonacionId}
          onChange={handleChange}
          className="bg-white p-2 rounded-lg text-sm"
        >
          <option value="">Seleccionar tipo publicación</option>
          {donacionTipos.map((t) => (
            <option key={t.id} value={t.id}>
              {t.descripcion}
            </option>
          ))}
        </select>
      </div>

      {/* Descripción */}
      <textarea
        name="descripcion"
        value={formData.descripcion}
        onChange={handleChange}
        placeholder="Agrega la descripción..."
        className="bg-white p-2 rounded-lg text-sm h-20"
      />

      <input type="file" onChange={handleImagen} />

      <button
        onClick={handleSubmit}
        className="bg-[#7DB575] text-white px-4 py-1 rounded-full mt-2"
      >
        Publicar
      </button>
    </div>
  );
};

export default CrearPublicacion;
