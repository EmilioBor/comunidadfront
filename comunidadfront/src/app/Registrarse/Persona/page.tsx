"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Empresas() {
  const router = useRouter();
  const [razonSocial, setRazonSocial] = useState("");
  const [cbu, setCbu] = useState("");
  const [cuit, setCuit] = useState("");
  const [alias, setAlias] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 👉 Acá después armamos el POST
    console.log({
      razonSocial,
      cbu,
      cuit,
      alias,
      localidad,
      descripcion,
      foto,
    });

    // De momento solo te llevo a la siguiente vista
    router.push("/perfil");
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
        {/* Logo + título */}
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="logo" className="w-12 h-12 mb-2" />
          <h1 className="text-2xl font-bold">Te damos la bienvenida a</h1>
          <h2 className="text-3xl font-[cursive]">Comunidad Solidaria</h2>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left"
        >
          <div>
            <label className="block text-sm font-semibold mb-1">
              Razón Social
            </label>
            <input
              type="text"
              value={razonSocial}
              onChange={(e) => setRazonSocial(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">CBU</label>
            <input
              type="text"
              value={cbu}
              onChange={(e) => setCbu(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">CUIT / CUIL</label>
            <input
              type="text"
              value={cuit}
              onChange={(e) => setCuit(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Alias</label>
            <input
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Localidad</label>
            <input
              type="text"
              value={localidad}
              onChange={(e) => setLocalidad(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Descripción</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          {/* Foto ocupa todo el ancho */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Foto</label>
            <input
              type="file"
              onChange={(e) => setFoto(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
            />
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
