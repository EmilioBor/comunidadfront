// Donacion/Listado/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// Interfaces basadas en tu backend
interface DonacionTipo {
  id: number;
  descripcion: string;
}

interface Localidad {
  id: number;
  nombre: string;
}

interface Perfil {
  id: number;
  alias: string;
  descripcion: string;
  imagen: string;
  localidad: Localidad;
}

interface Donacion {
  id: number;
  descripcion: string;
  fechaHora: string;
  donacionTipoIdDonacionTipo: number;
  perfilIdPerfil: number;
  donacionTipo?: DonacionTipo;
  perfil?: Perfil;
  estado?: string;
}

export default function ListadoDonaciones() {
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [tiposDonacion, setTiposDonacion] = useState<DonacionTipo[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  
  const [filtros, setFiltros] = useState({
    tipoId: "",
    localidadId: "",
    perfilId: "",
    estado: "",
    busqueda: ""
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
      
      // Llamadas a los endpoints
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

      // Simulación de datos de localidades y perfiles (en producción vendrían de APIs)
      const localidadesSimuladas: Localidad[] = [
        { id: 1, nombre: "Capital" },
        { id: 2, nombre: "Villa Mercedes" },
        { id: 3, nombre: "Merlo" },
        { id: 4, nombre: "San Luis" },
        { id: 5, nombre: "La Toma" }
      ];

      const perfilesSimulados: Perfil[] = [
        { id: 1, alias: "María Solidaria", descripcion: "Ayudo con alimentos", imagen: "", localidad: localidadesSimuladas[0] },
        { id: 2, alias: "Juan Donador", descripcion: "Ropa en buen estado", imagen: "", localidad: localidadesSimuladas[1] },
        { id: 3, alias: "Ana Comunitaria", descripcion: "Servicios varios", imagen: "", localidad: localidadesSimuladas[2] },
        { id: 4, alias: "Carlos Ayudante", descripcion: "Muebles y electrodomésticos", imagen: "", localidad: localidadesSimuladas[3] },
        { id: 5, alias: "Comunidad Solidaria", descripcion: "Donaciones generales", imagen: "", localidad: localidadesSimuladas[0] }
      ];

      // Enriquecer donaciones con datos
      const donacionesEnriquecidas = donacionesData.map((donacion: Donacion) => {
        const perfilAleatorio = perfilesSimulados[Math.floor(Math.random() * perfilesSimulados.length)];
        return {
          ...donacion,
          donacionTipo: tiposData.find((tipo: DonacionTipo) => 
            tipo.id === donacion.donacionTipoIdDonacionTipo
          ),
          perfil: perfilAleatorio,
          estado: ["Activa", "En proceso", "Completada"][Math.floor(Math.random() * 3)]
        };
      });

      setDonaciones(donacionesEnriquecidas);
      setTiposDonacion(tiposData);
      setLocalidades(localidadesSimuladas);
      setPerfiles(perfilesSimulados);
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
      setError("Error al cargar las donaciones. Verifica que el servidor esté ejecutándose.");
    } finally {
      setCargando(false);
    }
  };

  const aplicarFiltros = () => {
    let donacionesFiltradas = donaciones;

    // Filtro por tipo
    if (filtros.tipoId) {
      donacionesFiltradas = donacionesFiltradas.filter(
        donacion => donacion.donacionTipoIdDonacionTipo === parseInt(filtros.tipoId)
      );
    }

    // Filtro por localidad
    if (filtros.localidadId) {
      donacionesFiltradas = donacionesFiltradas.filter(
        donacion => donacion.perfil?.localidad.id === parseInt(filtros.localidadId)
      );
    }

    // Filtro por perfil
    if (filtros.perfilId) {
      donacionesFiltradas = donacionesFiltradas.filter(
        donacion => donacion.perfilIdPerfil === parseInt(filtros.perfilId)
      );
    }

    // Filtro por estado
    if (filtros.estado) {
      donacionesFiltradas = donacionesFiltradas.filter(
        donacion => donacion.estado === filtros.estado
      );
    }

    // Filtro por búsqueda de texto
    if (filtros.busqueda) {
      const busquedaLower = filtros.busqueda.toLowerCase();
      donacionesFiltradas = donacionesFiltradas.filter(
        donacion => 
          donacion.descripcion?.toLowerCase().includes(busquedaLower) ||
          donacion.donacionTipo?.descripcion.toLowerCase().includes(busquedaLower) ||
          donacion.perfil?.alias.toLowerCase().includes(busquedaLower) ||
          donacion.perfil?.localidad.nombre.toLowerCase().includes(busquedaLower)
      );
    }

    return donacionesFiltradas;
  };

  const donacionesFiltradas = aplicarFiltros();

  const limpiarFiltros = () => {
    setFiltros({
      tipoId: "",
      localidadId: "",
      perfilId: "",
      estado: "",
      busqueda: ""
    });
  };

  const hayFiltrosActivos = Object.values(filtros).some(valor => valor !== "");

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

        {/* Panel de Filtros Mejorado */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* Buscador Principal */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-800 mb-2">
              🔍 Buscar en donaciones
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400 text-gray-900 placeholder-gray-500"
              placeholder="Buscar por descripción, tipo, donante o ubicación..."
              value={filtros.busqueda}
              onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
            />
          </div>

          {/* Filtros Avanzados */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Filtro por Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Tipo de Donación
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400 text-gray-900 bg-white"
                value={filtros.tipoId}
                onChange={(e) => setFiltros({...filtros, tipoId: e.target.value})}
              >
                <option value="" className="text-gray-500">Todos los tipos</option>
                {tiposDonacion.map((tipo) => (
                  <option key={tipo.id} value={tipo.id} className="text-gray-900">
                    {tipo.descripcion}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Localidad */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                📍 Ubicación
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400 text-gray-900 bg-white"
                value={filtros.localidadId}
                onChange={(e) => setFiltros({...filtros, localidadId: e.target.value})}
              >
                <option value="" className="text-gray-500">Todas las localidades</option>
                {localidades.map((localidad) => (
                  <option key={localidad.id} value={localidad.id} className="text-gray-900">
                    {localidad.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Perfil */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                👤 Donante
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400 text-gray-900 bg-white"
                value={filtros.perfilId}
                onChange={(e) => setFiltros({...filtros, perfilId: e.target.value})}
              >
                <option value="" className="text-gray-500">Todos los donantes</option>
                {perfiles.map((perfil) => (
                  <option key={perfil.id} value={perfil.id} className="text-gray-900">
                    {perfil.alias}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Estado
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-400 text-gray-900 bg-white"
                value={filtros.estado}
                onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
              >
                <option value="" className="text-gray-500">Todos los estados</option>
                <option value="Activa" className="text-gray-900">Activa</option>
                <option value="En proceso" className="text-gray-900">En proceso</option>
                <option value="Completada" className="text-gray-900">Completada</option>
              </select>
            </div>
          </div>

          {/* Controles */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">
                {donacionesFiltradas.length} de {donaciones.length} donaciones
              </span>
              {hayFiltrosActivos && (
                <span className="px-2 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium">
                  Filtros aplicados
                </span>
              )}
            </div>

            <div className="flex gap-3">
              {hayFiltrosActivos && (
                <button
                  onClick={limpiarFiltros}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
                >
                  Limpiar Filtros
                </button>
              )}
              <Link
                href="/Donacion/Crear"
                className="bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 text-center"
              >
                + Nueva Donación
              </Link>
            </div>
          </div>
        </div>

        {/* Grid de Donaciones Mejorado */}
        {donacionesFiltradas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donacionesFiltradas.map((donacion) => (
              <div 
                key={donacion.id} 
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200"
              >
                <div className="p-6">
                  {/* Header con Estado y Fecha */}
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      donacion.estado === 'Activa' ? 'bg-green-100 text-green-800 border border-green-200' :
                      donacion.estado === 'En proceso' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                      'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {donacion.estado}
                    </span>
                    <span className="text-sm text-gray-600 font-medium">
                      {new Date(donacion.fechaHora).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  
                  {/* Tipo de Donación */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {donacion.donacionTipo?.descripcion || "Donación"}
                  </h3>
                  
                  {/* Descripción */}
                  <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                    {donacion.descripcion || "Sin descripción disponible"}
                  </p>

                  {/* Información del Donante */}
                  <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sky-600 font-bold text-sm">
                        {donacion.perfil?.alias?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {donacion.perfil?.alias || "Usuario"}
                      </p>
                      <div className="flex items-center text-xs text-gray-600">
                        <span>📍 {donacion.perfil?.localidad.nombre}</span>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex space-x-2">
                    <Link
                      href={`/Donacion/Detalle/${donacion.id}`}
                      className="flex-1 bg-sky-600 hover:bg-sky-700 text-white text-center py-2 px-4 rounded-lg transition duration-200 text-sm font-semibold"
                    >
                      Ver Detalles
                    </Link>
                    <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-200 text-sm font-semibold">
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
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No se encontraron donaciones
              </h3>
              <p className="text-gray-700 mb-6">
                {donaciones.length === 0 
                  ? "Aún no hay donaciones publicadas en la plataforma." 
                  : "No hay donaciones que coincidan con los filtros aplicados."}
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
                {hayFiltrosActivos && (
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