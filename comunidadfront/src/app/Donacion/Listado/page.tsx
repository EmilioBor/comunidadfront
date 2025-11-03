// Donacion/Listado/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// Interfaces basadas en tu backend
interface DonacionTipo {
  id: number;
  descripcion: string;
}

interface Donacion {
  id: number;
  descripcion: string;
  fechaHora: string;
  donacionTipoIdDonacionTipo: number;
  perfilIdPerfil: number;
  donacionTipo?: DonacionTipo;
  estado?: string;
}

export default function ListadoDonaciones() {
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [tiposDonacion, setTiposDonacion] = useState<DonacionTipo[]>([]);
  const [filtros, setFiltros] = useState({
    tipoId: "",
    estado: ""
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      setCargando(true);
      setError(null);
      
      // Llamadas directas a los endpoints (sin Server Actions por ahora)
      const [donacionesRes, tiposRes] = await Promise.all([
        fetch('https://localhost:7168/api/Donacion/api/v1/donacions', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }),
        fetch('https://localhost:7168/api/DonacionTipo/api/v1/donacionTipos', {
          method: 'GET', 
          headers: { 'Content-Type': 'application/json' }
        })
      ]);

      if (!donacionesRes.ok || !tiposRes.ok) {
        throw new Error('Error al cargar datos del servidor');
      }

      const donacionesData = await donacionesRes.json();
      const tiposData = await tiposRes.json();

      console.log("📦 Donaciones cargadas:", donacionesData);
      console.log("📋 Tipos cargados:", tiposData);

      // Enriquecer donaciones con datos de tipos
      const donacionesEnriquecidas = donacionesData.map((donacion: Donacion) => ({
        ...donacion,
        donacionTipo: tiposData.find((tipo: DonacionTipo) => 
          tipo.id === donacion.donacionTipoIdDonacionTipo
        ),
        estado: "Activa" // Estado por defecto
      }));

      setDonaciones(donacionesEnriquecidas);
      setTiposDonacion(tiposData);
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
      setError("Error al cargar las donaciones. Verifica que el servidor esté ejecutándose.");
    } finally {
      setCargando(false);
    }
  };

  const aplicarFiltros = () => {
    let donacionesFiltradas = donaciones;

    if (filtros.tipoId) {
      donacionesFiltradas = donacionesFiltradas.filter(
        donacion => donacion.donacionTipoIdDonacionTipo === parseInt(filtros.tipoId)
      );
    }

    if (filtros.estado) {
      donacionesFiltradas = donacionesFiltradas.filter(
        donacion => donacion.estado === filtros.estado
      );
    }

    return donacionesFiltradas;
  };

  const donacionesFiltradas = aplicarFiltros();

  const limpiarFiltros = () => {
    setFiltros({ tipoId: "", estado: "" });
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando donaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md">
            <p className="font-medium">Error de conexión</p>
            <p className="mt-2 text-sm">{error}</p>
            <div className="mt-4 space-x-2">
              <button
                onClick={cargarDatosIniciales}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                Reintentar
              </button>
              <Link
                href="/Donacion/Crear"
                className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                Crear Donación
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-sky-800 mb-4">
            Donaciones Disponibles
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explora las donaciones disponibles en nuestra comunidad solidaria. 
          </p>
        </div>

        {/* Panel de Filtros */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Donación
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  value={filtros.tipoId}
                  onChange={(e) => setFiltros({...filtros, tipoId: e.target.value})}
                >
                  <option value="">Todos los tipos</option>
                  {tiposDonacion.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.descripcion}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  value={filtros.estado}
                  onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
                >
                  <option value="">Todos los estados</option>
                  <option value="Activa">Activa</option>
                  <option value="En proceso">En proceso</option>
                  <option value="Completada">Completada</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={limpiarFiltros}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
              >
                Limpiar
              </button>
              <Link
                href="/Donacion/Crear"
                className="bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 text-center"
              >
                + Nueva Donación
              </Link>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <span className="text-gray-600">
              {donacionesFiltradas.length} de {donaciones.length} donaciones
            </span>
            {(filtros.tipoId || filtros.estado) && (
              <span className="text-sm text-sky-600 font-medium">
                Filtros aplicados
              </span>
            )}
          </div>
        </div>

        {/* Grid de Donaciones */}
        {donacionesFiltradas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donacionesFiltradas.map((donacion) => (
              <div 
                key={donacion.id} 
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      donacion.estado === 'Activa' ? 'bg-green-100 text-green-800' :
                      donacion.estado === 'En proceso' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {donacion.estado}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(donacion.fechaHora).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {donacion.donacionTipo?.descripcion || "Donación"}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {donacion.descripcion || "Sin descripción disponible"}
                  </p>

                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                      <span className="text-sky-600 font-medium text-sm">U</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">Usuario</p>
                      <p className="text-xs text-gray-500">Comunidad Solidaria</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      href={`/Donacion/Detalle/${donacion.id}`}
                      className="flex-1 bg-sky-600 hover:bg-sky-700 text-white text-center py-2 px-4 rounded-lg transition duration-200 text-sm font-medium"
                    >
                      Ver Detalles
                    </Link>
                    <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-200 text-sm font-medium">
                      💬 Contactar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📦</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                No hay donaciones
              </h3>
              <p className="text-gray-600 mb-6">
                {donaciones.length === 0 
                  ? "Aún no hay donaciones publicadas." 
                  : "No hay donaciones con los filtros aplicados."}
              </p>
              <div className="space-y-3">
                {donaciones.length === 0 && (
                  <Link
                    href="/Donacion/Crear"
                    className="inline-block bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-8 rounded-lg transition duration-200"
                  >
                    Publicar Primera Donación
                  </Link>
                )}
                {(filtros.tipoId || filtros.estado) && (
                  <button
                    onClick={limpiarFiltros}
                    className="block w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-8 rounded-lg transition duration-200"
                  >
                    Limpiar Filtros
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}