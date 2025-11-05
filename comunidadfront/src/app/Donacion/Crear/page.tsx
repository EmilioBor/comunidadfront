// Donacion/Crear/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { crearDonacion, obtenerTiposDonacion } from "./actions";

// Interface para los tipos de donación
interface DonacionTipo {
  id: number;
  descripcion: string;
}

export default function CrearDonacion() {
  const router = useRouter();
  const [descripcion, setDescripcion] = useState("");
  const [tipoDonacionId, setTipoDonacionId] = useState("");
  const [tiposDonacion, setTiposDonacion] = useState<DonacionTipo[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarChat, setMostrarChat] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const perfilDestino = {
    id: 12,
    nombre: "Lucas Cambas", 
    email: "lucascambas@gmail.com",
    imagen: "/perfil-donacion.jpg",
  };

  useEffect(() => {
    const cargarTiposDonacion = async () => {
      try {
        const tipos = await obtenerTiposDonacion();
        console.log("📋 Tipos de donación cargados:", tipos);
        setTiposDonacion(tipos);
        if (tipos.length > 0) {
          setTipoDonacionId(tipos[0].id.toString());
        }
      } catch (error) {
        console.error("Error al cargar tipos de donación:", error);
        setError("Error al cargar los tipos de donación");
      } finally {
        setCargando(false);
      }
    };

    cargarTiposDonacion();
  }, []);

  const handleCrearDonacion = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!tipoDonacionId) {
      setError("Por favor selecciona un tipo de donación");
      return;
    }

    const donacion = {
      descripcion: descripcion || "Donación realizada desde publicación",
      fechaHora: new Date().toISOString(),
      donacionTipoIdDonacionTipo: parseInt(tipoDonacionId),
      perfilIdPerfil: perfilDestino.id,
    };

    console.log("📦 Donación enviada:", donacion);

    try {
      await crearDonacion(donacion);

      setMostrarModal(true);
      setDescripcion("");
      setTipoDonacionId(tiposDonacion[0]?.id?.toString() || "");
      setMostrarChat(true);
    } catch (error) {
      console.error("❌ Error al enviar la donación:", error);
      setError("Error al enviar la donación. Intenta nuevamente.");
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tipos de donación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col items-center py-10">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-[500px]">
        <h2 className="text-2xl font-semibold text-center text-sky-700 mb-6">
          Agregue su Donación
        </h2>

        <div className="flex flex-col items-center mb-6">
          <img
            src={perfilDestino.imagen}
            alt="Perfil"
            className="w-24 h-24 rounded-full object-cover mb-2 border-2 border-sky-300"
          />
          <h3 className="text-lg font-medium text-gray-800">
            Donando a:{" "}
            <span className="font-semibold">{perfilDestino.nombre}</span>
          </h3>
          <p className="text-gray-500 text-sm">{perfilDestino.email}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleCrearDonacion} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Descripción
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-sky-400 text-gray-800"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Escribe una breve descripción de tu donación..."
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Tipo de Donación
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-400 text-gray-800"
              value={tipoDonacionId}
              onChange={(e) => setTipoDonacionId(e.target.value)}
            >
              {tiposDonacion.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.descripcion}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Enviar Donación
          </button>
        </form>

        {mostrarChat && (
          <div className="mt-6 flex justify-center">
            <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition">
              💬 Ir al Chat con {perfilDestino.nombre}
            </button>
          </div>
        )}
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[350px] text-center">
            <h3 className="text-lg font-semibold text-sky-700 mb-2">
              ¡Donación enviada con éxito!
            </h3>
            <p className="text-gray-600 mb-4">
              Tu donación fue enviada al perfil {perfilDestino.nombre}.
            </p>
            <button
              onClick={() => setMostrarModal(false)}
              className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}