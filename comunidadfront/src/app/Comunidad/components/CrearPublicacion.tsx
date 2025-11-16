'use client';

import { useEffect, useState, ChangeEvent } from "react";
import { addPublicacion, getPublicacionTipos } from "../actions";
import { GetUserByPerfil } from "@/app/lib/api/perfil";

interface PerfilType {
  id: number;
  cuitCuil: number;
  razonSocial: string;
  descripcion: string;
  cbu: number;
  alias: string;
  usuarioIdUsuario: number;
  localidadIdLocalidad: number;
  imagen: string | null;
}

interface PublicacionTipo {
  id: number;
  descripcion: string;
}

const CrearPublicacion = () => {
  const [perfil, setPerfil] = useState<PerfilType | null>(null);
  const [publicacionTipos, setPublicacionTipos] = useState<PublicacionTipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagen, setImagen] = useState<File | null>(null);
  const [imagenBase64, setImagenBase64] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    tipoDonacionId: "",
    localidadIdLocalidad: "",
    donacionIdDonacion: 1,
  });

  // Cargar perfil y tipos de publicación
  useEffect(() => {
    const fetchData = async () => {
      try {
        const me = await fetch("/api/user/me").then(r => r.json());
        if (!me?.id) {
          setLoading(false);
          return;
        }

        const perfilData = await GetUserByPerfil(me.id);
        if (!perfilData) setError("No se encontró un perfil asociado al usuario.");

        const tiposData = await getPublicacionTipos();

        setPerfil(perfilData);
        setPublicacionTipos(tiposData);

        setFormData(prev => ({
          ...prev,
          localidadIdLocalidad: perfilData?.localidadIdLocalidad.toString() || "",
        }));
      } catch (err) {
        setError("Error al cargar la información");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="text-black">Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImagenChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImagen(file);

    if (!file) {
      setImagenBase64(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagenBase64(reader.result?.toString().split(",")[1] || null);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!perfil) return;

    if (!formData.titulo || !formData.descripcion || !formData.tipoDonacionId || !imagen) {
      alert("Completa todos los campos y selecciona una imagen antes de publicar.");
      return;
    }

    const form = new FormData();
    form.append("Titulo", formData.titulo);
    form.append("Descripcion", formData.descripcion);
    form.append("LocalidadIdLocalidad", formData.localidadIdLocalidad);
    form.append("PerfilIdPerfil", perfil.id.toString());
    form.append("PublicacionTipoIdPublicacionTipo", formData.tipoDonacionId);
    form.append("DonacionIdDonacion", formData.donacionIdDonacion.toString());
    form.append("files", imagen);

    console.log("Formulario preparado para enviar:", Object.fromEntries(form.entries()));

    try {
      const result = await addPublicacion(form);
      console.log("✅ Publicación creada:", result);
      alert("Publicación creada correctamente");

      setFormData({
        titulo: "",
        descripcion: "",
        tipoDonacionId: "",
        localidadIdLocalidad: perfil.localidadIdLocalidad.toString(),
        donacionIdDonacion: 1,
      });
      setImagen(null);
      setImagenBase64(null);
    } catch (err) {
      console.error("❌ Error al crear publicación:", err);
      alert("Error al crear publicación");
    }
  };

  return (
    <div className="bg-[#D9D9D9] text-black rounded-2xl p-4 flex flex-col gap-4 w-full max-w-3xl mx-auto">
      {/* Cabecera */}
      <div className="flex items-center gap-3">
        <img
          src={perfil?.imagen ? `data:image/png;base64,${perfil.imagen}` : "/default-avatar.png"}
          className="w-10 h-10 rounded-full"
          alt="Avatar"
        />
        <p className="text-black font-medium">{perfil?.razonSocial || "Perfil sin nombre"}</p>
      </div>

      {/* Título */}
      <input
        type="text"
        name="titulo"
        value={formData.titulo}
        onChange={handleChange}
        placeholder="Título"
        className="bg-white rounded-lg p-2 text-black text-sm font-bold w-full"
      />

      {/* Selección Tipo de Publicación */}
      <div className="flex flex-col gap-1">
        <label htmlFor="tipoDonacion" className="text-sm font-semibold">Tipo de Publicación</label>
        <select
          id="tipoDonacion"
          name="tipoDonacionId"
          value={formData.tipoDonacionId}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">Seleccionar tipo de publicación</option>
          {publicacionTipos.map((tipo) => (
            <option key={tipo.id} value={tipo.id}>{tipo.descripcion}</option>
          ))}
        </select>
      </div>

      {/* Descripción */}
      <textarea
        name="descripcion"
        value={formData.descripcion}
        onChange={handleChange}
        placeholder="Agrega la descripción..."
        className="bg-white p-2 rounded-lg text-black text-sm h-24 w-full"
      />

      {/* Preview de imagen */}
      {imagenBase64 && (
        <img
          src={`data:image/png;base64,${imagenBase64}`}
          alt="Preview"
          className="w-32 h-32 object-cover rounded-lg mt-2"
        />
      )}

      {/* Input de archivo */}
      <button
        type="button"
        onClick={() => document.getElementById("fileInput")?.click()}
        className="w-full py-2 px-4 bg-white border border-gray-300 rounded-lg text-black text-left cursor-pointer hover:bg-gray-100 transition"
      >
        {imagen ? imagen.name : "Agregar archivo"}
      </button>
      <input
        type="file"
        id="fileInput"
        className="hidden"
        onChange={handleImagenChange}
      />

      {/* Botón Publicar */}
      <button
        onClick={handleSubmit}
        className="bg-[#7DB575] text-white px-6 py-2 rounded-full mt-3 hover:bg-green-600 transition"
      >
        Publicar
      </button>
    </div>
  );
};

export default CrearPublicacion;
