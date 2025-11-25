"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams  } from "next/navigation";
import { crearPerfilUsuario, obtenerLocalidades } from "./actions";

export default function Empresas() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idUsuario = searchParams.get("id");;
  const [razonSocial, setRazonSocial] = useState("");
  const [cbu, setCbu] = useState("");
  const [cuit, setCuit] = useState("");
  const [alias, setAlias] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [localidades, setLocalidades] = useState<Array<any>>([]);

  // Cargar las localidades al montar el componente 
  useEffect(() => {
    const cargarLocalidades = async () => {
      try {
        const res = await obtenerLocalidades();
        setLocalidades(res); // asegúrate de que res sea un array [{idLocalidad, nombre}]
      } catch (err) {
        console.error("Error cargando localidades:", err);
      }
    };

    cargarLocalidades();
  }, []);


  // ✅ Esta función debe ir fuera del handleSubmit
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagen(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!idUsuario) {
      setError("No se encontró el ID del usuario. Vuelve a registrarte.");
      return;
    }
    try {
      // Creamos el FormData
      const formData = new FormData();
      formData.append("cuitCuil", cuit);
      formData.append("razonSocial", razonSocial);
      formData.append("descripcion", descripcion);
      formData.append("cbu", cbu);
      formData.append("alias", alias);
      formData.append("usuarioIdUsuario", idUsuario);
      formData.append("localidadIdLocalidad", localidad);
      if (imagen) formData.append("files", imagen); 

      console.log("Formulario preparado para enviar:", Object.fromEntries(formData.entries()));

      const res = await crearPerfilUsuario(formData);

      if (res) {
        console.log("Perfil creado:", res.data);
        router.push("/Inicio");
      } else {
        setError("Error al registrarse. Intenta nuevamente.");
      }
    } catch (err) {
      console.error("Error en el registro:", err);
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/background-login.png')" }}
    >
      <div
        className="rounded-2xl shadow-lg p-10 w-full max-w-3xl text-gray-800 text-center"
        style={{ backgroundColor: "#C5E9BE" }}
      >
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="logo" className="w-12 h-12 mb-2" />
          <h1 className="text-2xl">Te damos la bienvenida a</h1>
          <h2 className="text-3xl font-bold">Comunidad Solidaria</h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left"
        >
          {/* Campos */}
          <div>
            <label className="block text-sm font-semibold mb-1">Razón Social</label>
            <input
              type="text"
              value={razonSocial}
              onChange={(e) => setRazonSocial(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 
               bg-white text-black placeholder:text-gray-400
               focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">CBU</label>
            <input
              type="text"
              value={cbu}
              onChange={(e) => setCbu(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 
               bg-white text-black placeholder:text-gray-400
               focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">CUIT / CUIL</label>
            <input
              type="text"
              value={cuit}
              onChange={(e) => setCuit(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 
               bg-white text-black placeholder:text-gray-400
               focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Alias</label>
            <input
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 
               bg-white text-black placeholder:text-gray-400
               focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Localidad</label>
            <select
              value={localidad}
              onChange={(e) => setLocalidad(e.target.value)}
              className="
                w-full px-3 py-2 
                rounded-t-lg 
                rounded-b-[16px] 
                border border-gray-300 
                bg-white 
                focus:outline-none focus:ring-2 focus:ring-green-400
                text-gray-700
              "
              required
            >
              <option value="" disabled>
                Seleccione una localidad...
              </option>

              {localidades.map((loc: any) => (
                <option key={loc.id} value={loc.id}>
                  {loc.nombre}
                </option>
              ))}
            </select>
          </div>


          <div>
            <label className="block text-sm font-semibold mb-1">Descripción</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 
               bg-white text-black placeholder:text-gray-400
               focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          {/* Imagen */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Foto</label>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
                aria-label="Selecciona foto de perfil"
              />
              <p className="text-xs text-gray-600 mt-1">Selecciona foto de perfil</p>
          </div>

          {error && (
            <p className="md:col-span-2 text-red-600 text-sm text-center">{error}</p>
          )}

          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="bg-white text-gray-800 font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-gray-200 transition"
            >
              Siguiente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
