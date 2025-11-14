// app/Reporte/Crear/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CrearReporte() {
  const router = useRouter();
  const [motivo, setMotivo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

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
      // Por ahora solo simulamos el envío ya que no tenemos el back
      console.log("📋 Reporte a enviar:", {
        motivo,
        descripcion,
        fecha: new Date().toISOString()
      });

      // Simulamos delay de envío
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mostrar éxito y redirigir
      alert("✅ Reporte enviado correctamente. Gracias por ayudarnos a mantener la comunidad segura.");
      router.push("/Inicio");
      
    } catch (err) {
      console.error("Error enviando reporte:", err);
      setError("Error al enviar el reporte. Intenta nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center py-10"
      style={{ backgroundImage: "url('/background-login.png')" }}
    >
      <div
        className="rounded-2xl shadow-lg p-10 w-full max-w-2xl text-gray-800 text-center"
        style={{ backgroundColor: "#C5E9BE" }}
      >
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="logo" className="w-12 h-12 mb-2" />
          <h1 className="text-2xl font-bold">Reportar Incidencia</h1>
          <h2 className="text-xl font-[cursive]">Comunidad Solidaria</h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 text-left"
        >
          {/* Campo Motivo */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Motivo *
            </label>
            <select
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="
                w-full px-4 py-3 
                rounded-t-lg 
                rounded-b-[16px] 
                border border-gray-300 
                bg-white 
                focus:outline-none focus:ring-2 focus:ring-green-400
                text-gray-700
                text-base
              "
              required
            >
              <option value="" disabled>
                Elije un motivo...
              </option>
              {motivos.map((motivoItem) => (
                <option key={motivoItem} value={motivoItem}>
                  {motivoItem}
                </option>
              ))}
            </select>
          </div>

          {/* Campo Descripción */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Descripción *
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe detalladamente el motivo de tu reporte..."
              className="
                w-full px-4 py-3 
                rounded-t-lg 
                rounded-b-[16px] 
                border border-gray-300 
                bg-white 
                focus:outline-none focus:ring-2 focus:ring-green-400
                text-gray-700
                resize-none
                min-h-[120px]
                text-base
              "
              required
            />
            <p className="text-xs text-gray-600 mt-1">
              Proporciona todos los detalles necesarios para que podamos entender la situación
            </p>
          </div>

          {/* Línea divisoria */}
          <div className="border-t border-gray-400 my-4"></div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="
                bg-gray-300 
                text-gray-800 
                font-semibold 
                py-3 
                px-8 
                rounded-lg 
                shadow-md 
                hover:bg-gray-400 
                transition 
                flex-1
                text-base
              "
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="
                bg-white 
                text-gray-800 
                font-semibold 
                py-3 
                px-8 
                rounded-lg 
                shadow-md 
                hover:bg-gray-200 
                transition 
                flex-1
                text-base
                disabled:bg-gray-200
                disabled:cursor-not-allowed
                flex items-center justify-center
              "
            >
              {enviando ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800 mr-2"></div>
                  Enviando...
                </>
              ) : (
                "Enviar Reporte"
              )}
            </button>
          </div>

          {/* Información adicional */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Tu reporte será revisado por nuestro equipo de moderación.
              <br />
              Agradecemos tu colaboración para mantener una comunidad segura.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}