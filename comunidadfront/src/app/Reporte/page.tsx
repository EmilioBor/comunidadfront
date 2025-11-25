// app/Reporte/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { crearReporte } from "./actions";

export default function CrearReporte() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const publicacionId = searchParams.get("publicacionId");
  
  const [perfilId, setPerfilId] = useState<string | null>(null);
  const [motivo, setMotivo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);

  // Obtener el perfilId del usuario logueado
  useEffect(() => {
    const obtenerPerfilUsuario = async () => {
      try {
        console.log("Obteniendo perfil del usuario...");
        const meResponse = await fetch("/api/user/me");
        console.log("Response de /api/user/me:", meResponse.status);
        
        if (meResponse.ok) {
          const me = await meResponse.json();
          console.log("Usuario me:", me);
          
          if (me?.id) {
            // Obtener el perfil usando el mismo método que Perfil/page.tsx
            const perfilResponse = await fetch(`https://localhost:7168/api/Perfil/v1/perfil/user/${me.id}`);
            console.log("Response de perfil:", perfilResponse.status);
            
            if (perfilResponse.ok) {
              const perfilData = await perfilResponse.json();
              console.log("Perfil data:", perfilData);
              setPerfilId(perfilData.id.toString());
            } else {
              console.error("Error obteniendo perfil:", perfilResponse.status);
            }
          }
        } else {
          console.error("Error obteniendo usuario:", meResponse.status);
        }
      } catch (error) {
        console.error('Error obteniendo perfil:', error);
      }
    };

    obtenerPerfilUsuario();
  }, []);

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

    // Validaciones frontend
    if (!motivo || !descripcion) {
      setError("Todos los campos son obligatorios.");
      setEnviando(false);
      return;
    }

    if (!perfilId) {
      setError("No se pudo identificar tu perfil.");
      setEnviando(false);
      return;
    }

    try {
      const reporteData = {
        motivo: motivo,
        descripcion: descripcion,
        publicacionId: publicacionId,
        perfilId: perfilId
      };

      console.log("Enviando reporte...");
      const resultado = await crearReporte(reporteData);

      // Parsear la respuesta JSON
      const parsedResult = typeof resultado === 'string' ? JSON.parse(resultado) : resultado;
      
      console.log("Respuesta parseada:", parsedResult);

      if (parsedResult.success) {
        console.log("✅ Éxito - Mostrando modal");
        setMostrarModalExito(true);
      } else {
        console.log("❌ Error:", parsedResult.error);
        setError(parsedResult.error || "Error al enviar el reporte");
      }
      
    } catch (err) {
      console.error("Error inesperado:", err);
      setError("Error inesperado. Por favor, intenta nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  const handleAceptar = () => {
    setMostrarModalExito(false);
    router.push("/Comunidad");
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed p-4"
           style={{ backgroundImage: "url('/background-login.png')" }}>
        
        <div className="bg-[#C5E9BE] rounded-2xl shadow-lg p-6 w-full max-w-md">
          
          <div className="flex flex-col items-center mb-6">
            <img src="/logo.png" alt="logo" className="w-10 h-10 mb-2" />
            <h1 className="text-xl font-bold text-gray-800">Reportar Incidencia</h1>
            <h2 className="text-lg font-[cursive] text-gray-800">Comunidad Solidaria</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
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

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg text-center text-sm">
                {error}
              </div>
            )}

            <div className="border-t border-gray-400 my-2"></div>

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
                disabled={enviando || !perfilId}
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

            <div className="text-center">
              <p className="text-xs text-gray-600">
                Tu reporte será revisado por nuestro equipo de moderación.
              </p>
              {!perfilId && (
                <p className="text-xs text-yellow-600 mt-2">
                  Cargando información de perfil...
                </p>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Modal de Éxito - Mismo diseño que Donacion/Detalle */}
      {mostrarModalExito && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Ventana modal - Sin fondo oscuro detrás */}
          <div className="bg-[#C5E9BE] rounded-2xl shadow-2xl p-6 w-full max-w-sm relative z-10 border-2 border-green-300 transform transition-all duration-300 scale-100">
            <div className="text-center">
              {/* Icono de éxito */}
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              {/* Título y mensaje */}
              <h3 className="text-xl font-bold text-green-700 mb-2">¡Reporte Enviado!</h3>
              <p className="text-gray-700 mb-1">
                Tu reporte ha sido enviado correctamente.
              </p>
              <p className="text-gray-600 text-sm mb-6">
                Gracias por ayudarnos a mantener la comunidad segura.
              </p>
              
              {/* Botón de acción */}
              <button
                onClick={handleAceptar}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition w-full transform hover:scale-105"
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