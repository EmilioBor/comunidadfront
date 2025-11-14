"use client";

import React, { useState, useEffect } from "react";
import { postDonacion } from "@/app/lib/api/donacionApi";
import { getDonacionTipos } from "@/lib/api/donacionTipoApi";
import { useSearchParams } from "next/navigation";

interface DonacionTipo {
  id: number;
  descripcion: string;
}

export default function DonacionComunidadSolidaria() {
  const [descripcion, setDescripcion] = useState("");
  const [tipoDonacionId, setTipoDonacionId] = useState("");
  const [tiposDonacion, setTiposDonacion] = useState<DonacionTipo[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarChat, setMostrarChat] = useState(false);
  const [cargando, setCargando] = useState(true);
  
  const searchParams = useSearchParams();
  const tipoParam = searchParams.get('tipo');

  const perfilDestino = {
    id: 5,
    nombre: "Comunidad Solidaria",
    email: "donaciones@comunidadsolidaria.org.ar",
    imagen: "/logo.png",
  };

  useEffect(() => {
    const cargarTiposDonacion = async () => {
      try {
        const tipos = await getDonacionTipos();
        console.log("📋 Tipos de donación cargados:", tipos);
        setTiposDonacion(tipos);
        
        console.log("🔍 Parámetro tipo recibido:", tipoParam);
        
        if (tipoParam && tipos.length > 0) {
          // Viene desde botones de tipo - buscar el tipo específico
          const tipoEncontrado = tipos.find(tipo => 
            tipo.descripcion.toLowerCase() === tipoParam.toLowerCase()
          );
          
          if (tipoEncontrado) {
            console.log("✅ Tipo encontrado:", tipoEncontrado);
            setTipoDonacionId(tipoEncontrado.id.toString());
          } else {
            const tipoAproximado = tipos.find(tipo => 
              tipo.descripcion.toLowerCase().includes(tipoParam.toLowerCase()) ||
              tipoParam.toLowerCase().includes(tipo.descripcion.toLowerCase())
            );
            
            if (tipoAproximado) {
              console.log("✅ Tipo aproximado encontrado:", tipoAproximado);
              setTipoDonacionId(tipoAproximado.id.toString());
            } else {
              setTipoDonacionId(tipos[0].id.toString());
            }
          }
        } else if (tipos.length > 0) {
          // Viene desde "Donar aquí" - usar el primer tipo por defecto
          setTipoDonacionId(tipos[0].id.toString());
        }
      } catch (error) {
        console.error("Error al cargar tipos de donación:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarTiposDonacion();
  }, [tipoParam]);

  const handleCrearDonacion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tipoDonacionId) {
      alert("Por favor selecciona un tipo de donación");
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
      await postDonacion(donacion);

      setMostrarModal(true);
      setDescripcion("");
      setMostrarChat(true);
    } catch (error) {
      console.error("❌ Error al enviar la donación:", error);
      alert("Error al enviar la donación. Revisa la consola para más detalles.");
    }
  };

  const tipoSeleccionado = tiposDonacion.find(tipo => tipo.id.toString() === tipoDonacionId);

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

        {/* MOSTRAR TIPO SELECCIONADO SI VIENE DESDE BOTONES */}
        {tipoParam && tipoSeleccionado && (
          <div className="mb-6 p-4 bg-sky-100 rounded-lg border border-sky-300">
            <p className="text-sky-700 font-medium text-center text-lg">
              Tipo de donación:{" "}
              <span className="font-semibold">{tipoSeleccionado.descripcion}</span>
            </p>
            <p className="text-sky-600 text-sm text-center mt-1">
              Seleccionado desde la página principal
            </p>
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
              required
            />
          </div>

          {/* MOSTRAR SELECT SOLO SI NO VIENE DESDE BOTONES (sin tipoParam) */}
          {!tipoParam && (
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
          )}

          {/* SELECT OCULTO SI VIENE DESDE BOTONES - mantiene la funcionalidad */}
          {tipoParam && (
            <select className="hidden" value={tipoDonacionId} onChange={(e) => setTipoDonacionId(e.target.value)}>
              {tiposDonacion.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>{tipo.descripcion}</option>
              ))}
            </select>
          )}

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
              Tu donación {tipoSeleccionado && `de ${tipoSeleccionado.descripcion.toLowerCase()}`} fue enviada.
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