"use client";

import React, { useState, useEffect } from "react";
import { crearDonacion, obtenerTiposDonacion } from "./actions";

interface DonacionTipo {
  id: number;
  descripcion: string;
}

export default function CrearDonacion() {
  const [descripcion, setDescripcion] = useState("");
  const [tipoDonacionId, setTipoDonacionId] = useState("");
  const [tiposDonacion, setTiposDonacion] = useState<DonacionTipo[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarChat, setMostrarChat] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const perfilDestino = {
    id: 13,
    nombre: "Lucas Cambas", 
    email: "lucas@hotmail.com",
    imagen: "/perfil-donacion.jpg",
  };

  useEffect(() => {
    const cargarTiposDonacion = async () => {
      try {
        const resultado = await obtenerTiposDonacion();
        
        if (resultado.success) {
          console.log("📋 Tipos de donación cargados:", resultado.data);
          setTiposDonacion(resultado.data);
          if (resultado.data.length > 0) {
            setTipoDonacionId(resultado.data[0].id.toString());
          }
        } else {
          console.error("Error al cargar tipos:", resultado.error);
          alert("Error al cargar tipos de donación");
        }
      } catch (error) {
        console.error("Error inesperado:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarTiposDonacion();
  }, []);

  const handleCrearDonacion = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    if (!tipoDonacionId) {
      alert("Por favor selecciona un tipo de donación");
      setEnviando(false);
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
      const resultado = await crearDonacion(donacion);

      if (resultado.success) {
        setMostrarModal(true);
        setDescripcion("");
        setTipoDonacionId(tiposDonacion[0]?.id?.toString() || "");
        setMostrarChat(true);
      } else {
        console.error("❌ Error del servidor:", resultado.error);
        alert(`Error: ${resultado.message}`);
      }
    } catch (error) {
      console.error("❌ Error al enviar la donación:", error);
      alert("Error inesperado al enviar la donación");
    } finally {
      setEnviando(false);
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
            disabled={enviando}
            className="bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
          >
            {enviando ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Enviando...
              </>
            ) : (
              "Enviar Donación"
            )}
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