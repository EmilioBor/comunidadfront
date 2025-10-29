"use client";

import React, { useState } from "react";

export default function CrearDonacion() {
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("Dinero");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarChat, setMostrarChat] = useState(false);

  const perfilDestino = {
    id: 1,
    nombre: "Cáritas Argentina La Plata",
    email: "contacto@caritaslp.org",
    imagen: "/perfil-donacion.jpg",
  };

  const handleCrearDonacion = async (e: React.FormEvent) => {
    e.preventDefault();

    const donacion = {
      descripcion: descripcion || "Donación realizada desde publicación",
      fechaHora: new Date().toISOString(),
      tipo: tipo,
      perfilDestinoId: perfilDestino.id,
    };

    console.log("📦 Donación enviada:", donacion);

    try {
      // 🔧 Descomentar cuando esté el backend listo:
      /*
      const response = await fetch("https://tuapi.com/api/Donacion/api/v1/agrega/donacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donacion),
      });

      if (!response.ok) throw new Error("Error al crear la donación");
      */

      setMostrarModal(true);
      setDescripcion("");
      setTipo("Dinero");
      setMostrarChat(true);
    } catch (error) {
      console.error(error);
      alert("❌ Error al enviar la donación");
    }
  };

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
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="Dinero">Dinero</option>
              <option value="Alimento">Alimento</option>
              <option value="Ropa">Ropa</option>
              <option value="Mueble">Mueble</option>
              <option value="Otros">Otros</option>
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
