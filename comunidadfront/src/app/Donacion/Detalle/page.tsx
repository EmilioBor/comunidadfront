// app/Donacion/Detalle/page.tsx - VERSIÓN SIN obtenerEstadosDonacion
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { crearDonacionDetalle } from "./actions";

interface DetalleItem {
  id: number;
  Descripcion: string;
  Cantidad: number;
  DonacionIdDonacion: number;
}

export default function DonacionDetalle() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [descripcion, setDescripcion] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [donacionId, setDonacionId] = useState<string | null>(null);
  const [detalles, setDetalles] = useState<DetalleItem[]>([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  // Obtener parámetros de la URL
  const donacionIdParam = searchParams.get('donacionId');

  // Cargar datos iniciales SIN obtenerEstadosDonacion
  useEffect(() => {
    const cargarDatosIniciales = () => {
      try {
        setCargando(true);
        setError("");

        setDonacionId(donacionIdParam);

        if (!donacionIdParam) {
          setError("No se recibió el ID de la donación");
        }

      } catch (error) {
        console.error('Error cargando datos:', error);
        setError("Error al cargar los datos iniciales");
      } finally {
        setCargando(false);
      }
    };

    cargarDatosIniciales();
  }, [donacionIdParam]);

  // Agregar detalle
  const agregarDetalle = () => {
    if (!descripcion.trim()) {
      setError("La descripción es obligatoria");
      return;
    }

    if (!cantidad || !donacionId) {
      setError("Cantidad y ID de donación son obligatorios");
      return;
    }

    const cantidadNum = parseInt(cantidad);
    if (isNaN(cantidadNum) || cantidadNum <= 0) {
      setError("La cantidad debe ser un número mayor a 0");
      return;
    }

    const nuevoDetalle: DetalleItem = {
      id: Date.now(),
      Descripcion: descripcion.trim(),
      Cantidad: cantidadNum,
      DonacionIdDonacion: parseInt(donacionId)
    };

    setDetalles([...detalles, nuevoDetalle]);
    setDescripcion("");
    setCantidad("");
    setError("");
  };

  // Eliminar detalle
  const eliminarDetalle = (id: number) => {
    setDetalles(detalles.filter(detalle => detalle.id !== id));
  };

  // Enviar todos los detalles
  const enviarDetalles = async () => {
    if (detalles.length === 0) {
      setError("Debes agregar al menos un detalle");
      return;
    }

    setEnviando(true);
    setError("");

    try {
      let detallesExitosos = 0;
      let detallesFallidos = 0;
      const errores: string[] = [];

      for (const [index, detalle] of detalles.entries()) {
        try {
          const resultado = await crearDonacionDetalle(detalle);

          if (resultado.success) {
            detallesExitosos++;
          } else {
            detallesFallidos++;
            errores.push(`"${detalle.Descripcion}": ${resultado.message}`);
          }
        } catch (error: any) {
          detallesFallidos++;
          errores.push(`"${detalle.Descripcion}": ${error.message}`);
        }
      }

      if (detallesFallidos === 0) {
        setMostrarModal(true);
      } else if (detallesExitosos > 0) {
        setError(
          `Se crearon ${detallesExitosos} detalles exitosamente, pero ${detallesFallidos} fallaron:\n${errores.join('\n')}`
        );
      } else {
        setError(`Ningún detalle se pudo guardar:\n${errores.join('\n')}`);
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      setError("Error de conexión al enviar los detalles");
    } finally {
      setEnviando(false);
    }
  };

  // Enter para agregar detalle
  const manejarKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      agregarDetalle();
    }
  };

  // LOADING
  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
           style={{ backgroundImage: "url('/background-login.png')" }}>
        <div className="bg-[#C5E9BE] rounded-2xl shadow-lg p-8 w-full max-w-md text-gray-800 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-3 text-gray-600 text-sm">Cargando datos...</p>
        </div>
      </div>
    );
  }

  // ERROR sin donacionId
  if (error && !donacionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed p-4"
           style={{ backgroundImage: "url('/background-login.png')" }}>
        <div className="bg-[#C5E9BE] rounded-2xl shadow-lg p-6 w-full max-w-md text-gray-800 text-center">
          <div className="text-red-600 mb-4 text-sm">{error}</div>
          <button
            onClick={() => router.push('/Inicio')}
            className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-green-700 transition text-sm"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  // PÁGINA PRINCIPAL
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed p-4"
         style={{ backgroundImage: "url('/background-login.png')" }}>
      
      <div className="bg-[#C5E9BE] rounded-2xl shadow-lg p-6 w-full max-w-2xl text-gray-800">
        
        {/* HEADER */}
        <div className="text-center mb-6">
          <img src="/logo.png" alt="logo" className="w-10 h-10 mx-auto mb-2" />
          <h1 className="text-xl font-bold">Detalles de la Donación</h1>
          <h2 className="text-lg font-[cursive]">Comunidad Solidaria</h2>
          {donacionId && (
            <p className="text-sm text-gray-600 mt-2">Completando donación #{donacionId}</p>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg text-center text-sm mb-4 whitespace-pre-line">
            {error}
          </div>
        )}

        {/* Info */}
        <div className="bg-green-50 rounded-lg p-3 mb-4 border border-green-200">
          <p className="text-sm text-green-700 text-center">
            <span className="font-semibold">⚠️ Importante:</span> Cada detalle se creará automáticamente con estado "Pendiente"
          </p>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-300">
          <h3 className="font-semibold text-gray-800 mb-3">Agregar Detalle</h3>
          
          <div className="space-y-3">

            {/* Descripción */}
            <div>
              <label className="block text-sm font-semibold mb-1">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                onKeyPress={manejarKeyPress}
                placeholder="Describe el detalle..."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700 resize-none text-sm min-h-[80px]"
              />
            </div>

            {/* Cantidad */}
            <div>
              <label className="block text-sm font-semibold mb-1">Cantidad</label>
              <input
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && agregarDetalle()}
                min="1"
                placeholder="Ej: 5"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700 text-sm"
              />
            </div>

            <button
              type="button"
              onClick={agregarDetalle}
              disabled={!descripcion.trim() || !cantidad}
              className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg shadow hover:bg-green-600 transition text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              + Agregar a la Lista
            </button>
          </div>
        </div>

        {/* TABLA */}
        {detalles.length > 0 && (
          <div className="bg-white rounded-lg p-4 mb-4 border border-gray-300">
            <h3 className="font-semibold text-gray-800 mb-3">
              Detalles Agregados ({detalles.length})
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-semibold text-gray-700">Descripción</th>
                    <th className="text-center py-2 font-semibold text-gray-700">Cantidad</th>
                    <th className="text-center py-2 font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {detalles.map(detalle => (
                    <tr key={detalle.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 text-gray-800 text-sm">{detalle.Descripcion}</td>
                      <td className="py-2 text-center text-gray-800 font-medium">{detalle.Cantidad}</td>
                      <td className="py-2 text-center">
                        <button
                          onClick={() => eliminarDetalle(detalle.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-medium bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">
                  Total de detalles: <strong>{detalles.length}</strong>
                </span>
                <span className="text-gray-600">
                  Total items: <strong>
                    {detalles.reduce((sum, d) => sum + d.Cantidad, 0)}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* BOTONES */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => router.push('/Inicio')}
            className="flex-1 bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg shadow hover:bg-gray-400 transition text-sm"
          >
            Cancelar
          </button>

          <button
            onClick={enviarDetalles}
            disabled={enviando || detalles.length === 0}
            className="flex-1 bg-white text-gray-800 font-semibold py-2 rounded-lg shadow hover:bg-gray-200 transition text-sm disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center border border-gray-300"
          >
            {enviando ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-800 mr-2"></div>
                Guardando...
              </>
            ) : (
              `Completar Donación (${detalles.length})`
            )}
          </button>
        </div>

        {/* Modal */}
        {mostrarModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-5 rounded-xl shadow-lg w-full max-w-xs text-center">
              <div className="text-green-500 text-4xl mb-3">✅</div>
              <h3 className="text-lg font-semibold text-green-700 mb-2">¡Donación Completada!</h3>
              <p className="text-gray-600 text-sm mb-4">
                Se guardaron correctamente {detalles.length} detalles.
              </p>
              <button
                onClick={() => router.push("/Inicio")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm w-full transition"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
