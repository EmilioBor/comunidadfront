"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { crearReporte } from "./actions";

export default function CrearReporte() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const publicacionId = searchParams.get('publicacionId');
  
  const [motivo, setMotivo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);

  const motivos = [
    "Contenido inapropiado",
    "Usuario fraudulento", 
    "Información falsa",
    "Acoso o bullying",
    "Spam",
    "Otro"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setEnviando(true);

    if (!motivo) {
      setError("Por favor selecciona un motivo");
      setEnviando(false);
      return;
    }

    if (!descripcion) {
      setError("Por favor describe el motivo del reporte");
      setEnviando(false);
      return;
    }

    try {
      const reporteData = {
        motivo: motivo,
        descripcion: descripcion,
        publicacionId: publicacionId || "2"
      };

      const resultado = await crearReporte(reporteData);

      if (resultado.success) {
        setMostrarModalExito(true);
      } else {
        setError(resultado.error || "Error al enviar el reporte");
      }
      
    } catch (err) {
      console.error("Error enviando reporte:", err);
      setError("Error inesperado al enviar el reporte. Intenta nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  const handleAceptar = () => {
    setMostrarModalExito(false);
    router.push("/Inicio");
  };

  return (
    <>
      {/* Contenido principal con efecto blur cuando el modal está activo */}
      <div className={`min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed p-4 transition-all duration-300 ${
        mostrarModalExito ? 'blur-sm brightness-90' : ''
      }`} 
           style={{ backgroundImage: "url('/background-login.png')" }}>
        
        <div className="bg-[#C5E9BE] rounded-2xl shadow-lg p-6 w-full max-w-md">
          
          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <img src="/logo.png" alt="logo" className="w-10 h-10 mb-2" />
            <h1 className="text-xl font-bold text-gray-800">Reportar Incidencia</h1>
            <h2 className="text-lg font-[cursive] text-gray-800">Comunidad Solidaria</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Campo Motivo */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800">
                Motivo 
              </label>
              <select
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 text-sm"
                required
              >
                <option value="" disabled>Elije un motivo...</option>
                {motivos.map((motivoItem) => (
                  <option key={motivoItem} value={motivoItem}>{motivoItem}</option>
                ))}
              </select>
            </div>

            {/* Campo Descripción */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800">
                Descripción 
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe detalladamente el motivo de tu reporte..."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800 resize-none min-h-[80px] text-sm"
                required
              />
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg text-center text-sm">
                {error}
              </div>
            )}

            {/* Línea divisoria */}
            <div className="border-t border-gray-400 my-2"></div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-400 transition flex-1 text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={enviando}
                className="bg-white text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition flex-1 text-sm disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {enviando ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-800 mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  "Enviar Reporte"
                )}
              </button>
            </div>

            {/* Información adicional */}
            <div className="text-center">
              <p className="text-xs text-gray-600">
                Tu reporte será revisado por nuestro equipo de moderación.
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de éxito - Aparece por delante con fondo semi-transparente */}
      {mostrarModalExito && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Fondo semi-transparente sin blur negro */}
          <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-[2px]"></div>
          
          {/* Modal con animación */}
          <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-auto border border-green-200 animate-in zoom-in-95 duration-300">
            <div className="text-center">
              {/* Ícono de éxito */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              {/* Título y mensaje */}
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                ¡Reporte Enviado!
              </h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Gracias por ayudarnos a mantener la comunidad segura. Tu reporte ha sido enviado correctamente.
              </p>
              
              {/* Botón Aceptar */}
              <button
                onClick={handleAceptar}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 transform hover:scale-105 active:scale-95"
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