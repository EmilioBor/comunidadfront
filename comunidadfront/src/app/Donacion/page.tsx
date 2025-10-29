"use client";
import React, { useState } from "react";

export default function CrearDonacion() {
  const [descripcion, setDescripcion] = useState("Donación para comedor infantil");
  const [tipo, setTipo] = useState("Dinero");
  const [mensaje, setMensaje] = useState("");

  // simulamos perfil y publicacion
  const perfilHardcoded = {
    id: 1,
    nombre: "Pedro Pérez",
    email: "pedro.perez@gmail.com"
  };

  const publicacionHardcoded = {
    id: 10,
    descripcion: "Nueva colaboración con Cáritas Argentina La Plata"
  };

  const handleCrearDonacion = (e) => {
    e.preventDefault();

    const nuevaDonacion = {
      id: Math.floor(Math.random() * 10000),
      descripcion: descripcion || publicacionHardcoded.descripcion,
      fechaHora: new Date().toISOString(),
      tipo: tipo,
      perfil: perfilHardcoded,
      publicacion: publicacionHardcoded,
      detalleDonacion: {
        estado: "Pendiente",
        observaciones: "A la espera de confirmación"
      }
    };

    console.log("Donación creada:", nuevaDonacion);
    setMensaje("✅ ¡Donación creada exitosamente!");
  };

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center py-10">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-[500px]">
        <h2 className="text-2xl font-semibold text-center text-sky-700 mb-6">
          Crear Donación
        </h2>

        <form onSubmit={handleCrearDonacion} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Descripción</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ingrese la descripción de la donación"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Tipo de Donación</label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
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
            Crear Donación
          </button>
        </form>

        {mensaje && (
          <div className="mt-4 text-center text-green-600 font-medium">
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
}