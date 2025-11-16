// app/Donacion/Crear/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { crearDonacion, obtenerTiposDonacion } from "./actions";
import { useRouter } from "next/navigation";

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
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

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
          setTiposDonacion(resultado.data);
          if (resultado.data.length > 0) {
            setTipoDonacionId(resultado.data[0].id.toString());
          }
        } else {
          setError("Error al cargar tipos de donación");
        }
      } catch (error) {
        setError("Error inesperado al cargar datos");
      } finally {
        setCargando(false);
      }
    };

    cargarTiposDonacion();
  }, []);

  const handleCrearDonacion = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError("");

    if (!tipoDonacionId) {
      setError("Por favor selecciona un tipo de donación");
      setEnviando(false);
      return;
    }

    const donacion = {
      descripcion: descripcion || "Donación realizada desde publicación",
      fechaHora: new Date().toISOString(),
      donacionTipoIdDonacionTipo: parseInt(tipoDonacionId),
      perfilIdPerfil: perfilDestino.id,
    };

    try {
      const resultado = await crearDonacion(donacion);

      if (resultado.success) {
        setMostrarModal(true);
      } else {
        setError(`Error: ${resultado.message}`);
      }
    } catch (error) {
      setError("Error inesperado al enviar la donación");
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed" 
           style={{ backgroundImage: "url('/background-login.png')" }}>
        <div className="bg-[#C5E9BE] rounded-2xl shadow-lg p-8 w-full max-w-md text-gray-800 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-3 text-gray-600 text-sm">Cargando tipos de donación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed p-4" 
         style={{ backgroundImage: "url('/background-login.png')" }}>
      
      <div className="bg-[#C5E9BE] rounded-2xl shadow-lg p-6 w-full max-w-md text-gray-800">
        
        {/* Header */}
        <div className="text-center mb-4">
          <img src="/logo.png" alt="logo" className="w-10 h-10 mx-auto mb-2" />
          <h1 className="text-xl font-bold">Realizar Donación</h1>
          <h2 className="text-lg font-[cursive]">Comunidad Solidaria</h2>
        </div>

        {/* Info del perfil */}
        <div className="bg-white rounded-lg p-3 mb-4 border border-green-300 text-center">
          <img src={perfilDestino.imagen} alt="Perfil" className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-green-400" />
          <h3 className="font-medium text-gray-800 text-sm">
            Donando a: <span className="font-semibold">{perfilDestino.nombre}</span>
          </h3>
          <p className="text-gray-500 text-xs">{perfilDestino.email}</p>
        </div>

        <form onSubmit={handleCrearDonacion} className="space-y-4">
          
          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold mb-1">Descripción *</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe tu donación..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700 resize-none text-sm min-h-[80px]"
              required
            />
          </div>

          {/* Tipo de Donación */}
          <div>
            <label className="block text-sm font-semibold mb-1">Tipo de Donación *</label>
            <select
              value={tipoDonacionId}
              onChange={(e) => setTipoDonacionId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700 text-sm"
              required
            >
              <option value="" disabled>Selecciona un tipo...</option>
              {tiposDonacion.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>{tipo.descripcion}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg text-center text-sm">
              {error}
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg shadow hover:bg-gray-400 transition text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="flex-1 bg-white text-gray-800 font-semibold py-2 rounded-lg shadow hover:bg-gray-200 transition text-sm disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {enviando ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-800 mr-2"></div>
                  Enviando...
                </>
              ) : (
                "Enviar Donación"
              )}
            </button>
          </div>
        </form>

        {/* Modal de éxito */}
        {mostrarModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-5 rounded-xl shadow-lg w-full max-w-xs text-center">
              <h3 className="text-lg font-semibold text-green-700 mb-2">¡Éxito!</h3>
              <p className="text-gray-600 text-sm mb-4">
                Tu donación fue enviada a {perfilDestino.nombre}.
              </p>
              <button
                onClick={() => {
                  setMostrarModal(false);
                  router.push("/Inicio");
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                Aceptar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}