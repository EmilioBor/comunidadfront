"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { addNovedad } from "./action";

export default function CrearNovedad() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const perfilId = searchParams.get("idPerfil"); // viene como string

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setImagen(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagen(null);
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!titulo || !descripcion || !fecha) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (!perfilId) {
      setError("No se pudo identificar el perfil.");
      return;
    }

    if (!imagen) {
      setError("Debes subir una imagen.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("Titulo", titulo);
      formData.append("Descripcion", descripcion);
      formData.append("Fecha", fecha);
      formData.append("IdPerfil", perfilId.toString());
      formData.append("Imagen", imagen);

      const res = await addNovedad(formData);
      console.log("Novedad creada:", res);

      alert("Novedad creada con éxito!");
      router.push("/Perfil");
    } catch (err) {
      console.error(err);
      setError("Error al crear la novedad.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/background-login.png')" }}
    >
      <button
        type="button"
        onClick={() => router.back()}
        className="absolute top-6 left-6 bg-white text-center w-48 rounded-2xl h-14 text-black text-xl font-semibold group"
      >
        <div className="bg-green-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" height="25px" width="25px">
            <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" fill="#000" />
            <path
              d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
              fill="#000"
            />
          </svg>
        </div>
        <p className="translate-x-2">Volver</p>
      </button>

      <div className="w-full max-w-lg p-8 rounded-xl shadow-lg text-black" style={{ backgroundColor: "#C5E9BE" }}>
        <div className="flex items-center justify-center mb-6 gap-3">
          <img src="/logo.png" alt="logo" className="w-14 h-14" />
          <h1 className="text-2xl font-bold">Crear Novedad</h1>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block font-semibold mb-1 text-black">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white text-black focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-black">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white text-black focus:ring-2 focus:ring-green-400"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-black">Fecha</label>
            <input
              type="datetime-local"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-white text-black focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-black">Imagen (obligatoria)</label>
            <div className="relative w-full">
              <button
                type="button"
                onClick={() => document.getElementById("fileInput")?.click()}
                className="w-full py-2 px-4 bg-white border border-gray-300 rounded-lg text-black text-left cursor-pointer hover:bg-gray-100 transition"
              >
                {imagen ? imagen.name : "Elegir imagen..."}
              </button>

              <input
                id="fileInput"
                type="file"
                name="Imagen"
                accept="image/*"
                required
                onChange={handleImagenChange}
                className="hidden"
              />
            </div>

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 w-full h-48 object-cover rounded-lg border"
              />
            )}
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="bg-green-500 text-black py-3 px-8 rounded-lg font-semibold mt-4 disabled:opacity-50 transition-transform duration-300 hover:scale-105 hover:shadow-lg mx-auto"
            disabled={loading}
          >
            {loading ? "Creando..." : "Crear Novedad"}
          </button>
        </form>
      </div>
    </div>
  );
}
