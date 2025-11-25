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
  const [mostrarModalExito, setMostrarModalExito] = useState(false);

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
      // Crear FormData
      const formData = new FormData();
      formData.append("Titulo", titulo);
      formData.append("Descripcion", descripcion);
      const fechaUTC = new Date(fecha).toISOString();
      formData.append("Fecha", fechaUTC);

      formData.append("PerfilIdPerfil", perfilId); // coincide con tu DTO
      formData.append("files", imagen); // coincide con IFormFile files en backend

      // Mostrar contenido de FormData en consola para debug
      console.log("Formulario preparado para enviar:");
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(key, value.name, value.type, value.size + " bytes");
        } else {
          console.log(key, value);
        }
      }

      const res = await addNovedad(formData);

      if (res) {
        console.log("Novedad creada:", res);
        setMostrarModalExito(true);
      } else {
        setError("Error al crear la novedad. Intenta nuevamente.");
      }
    } catch (err) {
      console.error("Error en el registro:", err);
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleAceptar = () => {
    setMostrarModalExito(false);
    router.push("/Perfil");
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed p-4"
           style={{ backgroundImage: "url('/background-login.png')" }}>
        
        {/* Botón Volver - Posicionado correctamente */}
        <button
          type="button"
          onClick={() => router.back()}
          className="fixed top-24 left-6 bg-white text-center w-48 rounded-2xl h-14 text-black text-xl font-semibold group z-40"
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

        <div className="bg-[#C5E9BE] rounded-2xl shadow-lg p-6 w-full max-w-lg">
          
          <div className="flex flex-col items-center mb-6">
            <img src="/logo.png" alt="logo" className="w-10 h-10 mb-2" />
            <h1 className="text-xl font-bold text-gray-800">Crear Novedad</h1>
            <h2 className="text-lg font-[cursive] text-gray-800">Comunidad Solidaria</h2>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800">Título</label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 resize-none min-h-[100px]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800">Fecha</label>
              <input
                type="datetime-local"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800">Imagen (obligatoria)</label>
              <div className="relative w-full">
                <button
                  type="button"
                  onClick={() => document.getElementById("fileInput")?.click()}
                  className="w-full py-2 px-4 bg-white border border-gray-300 rounded-lg text-gray-800 text-left cursor-pointer hover:bg-gray-100 transition"
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
                  className="mt-2 w-full h-48 object-cover rounded-lg border border-gray-300"
                />
              )}
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg text-center text-sm">
                {error}
              </div>
            )}

            <div className="border-t border-gray-400 my-2"></div>

            <button
              type="submit"
              className="bg-white text-gray-800 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition flex items-center justify-center border border-gray-300 disabled:bg-gray-200 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800 mr-2"></div>
                  Creando...
                </>
              ) : (
                "Crear Novedad"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Modal de Éxito - Mismo diseño que los anteriores */}
      {mostrarModalExito && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Ventana modal - Sin fondo oscuro detrás */}
          <div className="bg-[#C5E9BE] rounded-2xl shadow-2xl p-6 w-full max-w-sm relative z-10 border-2 border-green-300">
            <div className="text-center">
              {/* Icono de éxito */}
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              {/* Título y mensaje */}
              <h3 className="text-xl font-bold text-green-700 mb-2">¡Novedad Creada!</h3>
              <p className="text-gray-700 mb-1">
                Tu novedad ha sido creada correctamente.
              </p>
              <p className="text-gray-600 text-sm mb-6">
                La novedad se ha publicado con éxito.
              </p>
              
              {/* Botón de acción */}
              <button
                onClick={handleAceptar}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition w-full transform hover:scale-105"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}