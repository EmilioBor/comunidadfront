// app/Perfil/VerDonaciones/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/app/Inicio/components/Navbar";

// Importar la función del actions
import { obtenerDonacionesDePerfil } from "./actions";

interface Donacion {
  id: number;
  fecha: string;
  monto: string;
  destinatario: string;
  cbu: string;
  calificacion: string;
  descripcion: string;
  estado: string;
  tipo: string;
  donante: string;
  categoria: string;
  fechaHora?: string;
}

interface DetalleDonacion {
  id: number;
  descripcion: string;
  nombreDonacionIdDonacion: string;
  cantidad: number;
  nombreDonacionEstadoIdDonacionEstado: string;
}

interface PerfilType {
  id: number;
  cuitCuil: number;
  razonSocial: string;
  descripcion: string;
  cbu: number;
  alias: string;
  usuarioIdUsuario: number;
  localidadIdLocalidad: number;
  imagen: string;
}

// Definir los tipos de donaciones
const TIPOS_DONACIONES = [
  { id: "todos", nombre: "Todas las categorías", color: "bg-gray-100 text-gray-800" },
  { id: "Dinero", nombre: "Dinero", color: "bg-green-100 text-green-800" },
  { id: "Alimento", nombre: "Alimento", color: "bg-yellow-100 text-yellow-800" },
  { id: "Ropa", nombre: "Ropa", color: "bg-blue-100 text-blue-800" },
  { id: "Mueble", nombre: "Mueble", color: "bg-purple-100 text-purple-800" },
  { id: "Otros", nombre: "Otros", color: "bg-orange-100 text-orange-800" }
];

// Funciones auxiliares
const formatearFecha = (fecha: string) => {
  if (!fecha) return "Fecha no especificada";
  
  try {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return "Fecha inválida";
  }
};

const formatearMonto = (monto: any) => {
  if (!monto || monto === 0) return "No especificado";
  if (typeof monto === 'string' && monto.includes('$')) return monto;
  const numero = typeof monto === 'string' ? parseFloat(monto) : monto;
  return `$${numero.toLocaleString('es-AR')}`;
};

// Función para obtener TODOS los detalles de donación
async function obtenerTodosLosDetallesDonacion(): Promise<DetalleDonacion[]> {
  try {
    const response = await fetch(`https://localhost:7168/api/DetalleDonacion/api/v1/detalleDonacions`);
    
    if (!response.ok) {
      throw new Error(`Error al obtener detalles: ${response.status}`);
    }
    
    const detalles = await response.json();
    return Array.isArray(detalles) ? detalles : [];
  } catch (error) {
    console.error("Error obteniendo detalles de donación:", error);
    return [];
  }
}

// Función para filtrar detalles por descripción de donación
function filtrarDetallesPorDescripcion(detalles: DetalleDonacion[], descripcionDonacion: string): DetalleDonacion[] {
  return detalles.filter(detalle => 
    detalle.nombreDonacionIdDonacion && descripcionDonacion &&
    detalle.nombreDonacionIdDonacion.toLowerCase() === descripcionDonacion.toLowerCase()
  );
}

export default function VerDonaciones() {
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [perfil, setPerfil] = useState<PerfilType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [mostrarTodas, setMostrarTodas] = useState(false);
  const [categoriaFiltro, setCategoriaFiltro] = useState("todos");
  const [tipoVista, setTipoVista] = useState<"enviadas" | "recibidas">("enviadas");
  
  // Estados para el modal de detalles
  const [modalAbierto, setModalAbierto] = useState(false);
  const [donacionSeleccionada, setDonacionSeleccionada] = useState<Donacion | null>(null);
  const [detallesDonacion, setDetallesDonacion] = useState<DetalleDonacion[]>([]);
  const [cargandoDetalles, setCargandoDetalles] = useState(false);
  const [errorDetalles, setErrorDetalles] = useState("");
  const [todosLosDetalles, setTodosLosDetalles] = useState<DetalleDonacion[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const perfilId = searchParams.get('perfilId');

  // Cargar todos los detalles al montar el componente
  useEffect(() => {
    async function cargarTodosLosDetalles() {
      try {
        const detalles = await obtenerTodosLosDetallesDonacion();
        setTodosLosDetalles(detalles);
      } catch (error) {
        console.error("Error cargando todos los detalles:", error);
      }
    }

    cargarTodosLosDetalles();
  }, []);

  // Ordenar donaciones por fecha (más recientes primero)
  const donacionesOrdenadas = [...donaciones].sort((a, b) => {
    const fechaA = a.fechaHora ? new Date(a.fechaHora) : new Date(a.fecha);
    const fechaB = b.fechaHora ? new Date(b.fechaHora) : new Date(b.fecha);
    return fechaB.getTime() - fechaA.getTime();
  });

  // Filtrar donaciones según el tipo de vista seleccionado
  const donacionesFiltradasPorTipo = donacionesOrdenadas.filter(donacion => {
    if (tipoVista === "enviadas") {
      // Donaciones enviadas - donde el perfil visitado es el donante
      return donacion.donante === perfil?.razonSocial;
    } else {
      // Donaciones recibidas - donde el perfil visitado es el destinatario
      return donacion.destinatario === perfil?.razonSocial;
    }
  });

  // Donaciones a mostrar (últimas 2 o todas según el estado)
  const donacionesAMostrar = mostrarTodas 
    ? donacionesFiltradasPorTipo 
    : donacionesFiltradasPorTipo.slice(0, 2);

  // Filtrar donaciones por categoría seleccionada
  const donacionesFiltradas = categoriaFiltro === "todos" 
    ? donacionesAMostrar 
    : donacionesAMostrar.filter(donacion => 
        donacion.tipo.toLowerCase() === categoriaFiltro.toLowerCase() ||
        donacion.categoria.toLowerCase() === categoriaFiltro.toLowerCase()
      );

  // Calcular estadísticas por categoría
  const estadisticasPorCategoria = TIPOS_DONACIONES.filter(tipo => tipo.id !== "todos").map(tipo => {
    const cantidad = donacionesFiltradasPorTipo.filter(donacion => 
      donacion.tipo.toLowerCase() === tipo.id.toLowerCase() ||
      donacion.categoria.toLowerCase() === tipo.id.toLowerCase()
    ).length;
    
    return {
      ...tipo,
      cantidad
    };
  });

  // Total de categorías con al menos 1 donación
  const categoriasConDonaciones = estadisticasPorCategoria.filter(tipo => tipo.cantidad > 0).length;

  // Obtener la fecha de la última donación
  const ultimaDonacion = donacionesFiltradasPorTipo.length > 0 ? donacionesFiltradasPorTipo[0] : null;
  const fechaUltimaDonacion = ultimaDonacion 
    ? formatearFecha(ultimaDonacion.fechaHora || ultimaDonacion.fecha)
    : 'N/A';

  const toggleMostrarTodas = () => {
    setMostrarTodas(!mostrarTodas);
    if (!mostrarTodas) {
      setCategoriaFiltro("todos");
    }
  };

  const cambiarTipoVista = (nuevoTipo: "enviadas" | "recibidas") => {
    setTipoVista(nuevoTipo);
    setMostrarTodas(false);
    setCategoriaFiltro("todos");
  };

  // Función para abrir el modal con los detalles
  const abrirModalDetalles = async (donacion: Donacion) => {
    setDonacionSeleccionada(donacion);
    setCargandoDetalles(true);
    setErrorDetalles("");
    setModalAbierto(true);

    try {
      // Filtrar los detalles por la descripción de la donación
      const detallesFiltrados = filtrarDetallesPorDescripcion(todosLosDetalles, donacion.descripcion);
      setDetallesDonacion(detallesFiltrados);
      
      if (detallesFiltrados.length === 0) {
        setErrorDetalles(`No se encontraron detalles específicos para esta donación`);
      }
    } catch (err) {
      console.error("Error al cargar detalles:", err);
      setErrorDetalles("No se pudieron cargar los detalles de la donación");
    } finally {
      setCargandoDetalles(false);
    }
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    setModalAbierto(false);
    setDonacionSeleccionada(null);
    setDetallesDonacion([]);
    setErrorDetalles("");
  };

  // Función auxiliar para asegurar que tenemos un array de detalles
  const obtenerArrayDetalles = (detalles: DetalleDonacion[] | DetalleDonacion): DetalleDonacion[] => {
    if (Array.isArray(detalles)) {
      return detalles;
    } else if (detalles && typeof detalles === 'object') {
      return [detalles];
    } else {
      return [];
    }
  };

  useEffect(() => {
    async function cargarDatos() {
      try {
        if (!perfilId) {
          setError("No se recibió ID de perfil");
          setLoading(false);
          return;
        }

        setLoading(true);
        setError("");
        setInfo("");

        console.log("🔄 Cargando donaciones para perfil ID:", perfilId);

        // Obtener donaciones del perfil específico
        const resultado = await obtenerDonacionesDePerfil(parseInt(perfilId));
        
        if (resultado.success) {
          setDonaciones(resultado.data);
          setPerfil(resultado.perfil);
          setInfo(resultado.message);
        } else {
          setError(resultado.message || "Error al cargar las donaciones");
        }

      } catch (err) {
        console.error("Error cargando donaciones:", err);
        setError(err.message || "Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, [perfilId]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex w-full justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
            <p className="text-lg text-gray-600">Cargando donaciones...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !perfil) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex w-full justify-center items-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-4">⚠️ {error}</div>
            <button
              onClick={() => router.back()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Volver Atrás
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex w-full">
        {/* COLUMNA IZQUIERDA - Información del perfil visitado */}
        <aside className="w-1/4 h-screen p-6 flex flex-col items-center bg-gray-100">
          {perfil && (
            <>
              <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border">
                <Image
                  src={`data:image/jpeg;base64,${perfil.imagen}`}
                  alt="Foto de perfil"
                  width={160}
                  height={160}
                  className="object-cover"
                  unoptimized
                />
              </div>

              <p className="text-lg font-semibold text-black text-center">{perfil.razonSocial}</p>
              <p className="text-sm text-gray-600 text-center mt-2">Historial de Donaciones</p>

              <div className="mt-10 flex flex-col w-full gap-4">
                <button
                  onClick={() => router.back()}
                  className="bg-gray-300 hover:bg-gray-400 py-2 rounded-lg text-center text-black transition"
                >
                  Volver Atrás
                </button>
                <Link
                  href="/Inicio"
                  className="bg-gray-300 hover:bg-gray-400 py-2 rounded-lg text-center text-black transition"
                >
                  Volver al Inicio
                </Link>
              </div>
            </>
          )}
        </aside>

        {/* COLUMNA CENTRAL - Listado de Donaciones del perfil visitado */}
        <main className="w-3/4 p-8">
          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Historial de Donaciones {tipoVista === "enviadas" ? "Enviadas" : "Recibidas"} de {perfil?.razonSocial}
            </h1>
            <p className="text-gray-600">
              {tipoVista === "enviadas" 
                ? "Donaciones que este usuario ha realizado" 
                : "Donaciones que este usuario ha recibido"
              }
            </p>
          </div>

          {/* PANEL DE DOS BOTONES - ENVIADAS/RECIBIDAS */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="flex">
                {/* BOTÓN DONACIONES ENVIADAS */}
                <button
                  onClick={() => cambiarTipoVista("enviadas")}
                  className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-200 ${
                    tipoVista === "enviadas" 
                      ? "bg-gray-300 text-gray-800 shadow-inner" 
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Donaciones Enviadas
                </button>
                
                {/* BOTÓN DONACIONES RECIBIDAS */}
                <button
                  onClick={() => cambiarTipoVista("recibidas")}
                  className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-200 ${
                    tipoVista === "recibidas" 
                      ? "bg-gray-300 text-gray-800 shadow-inner" 
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Donaciones Recibidas
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-6">
              <strong>Aviso:</strong> {error}
            </div>
          )}

          {info && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg mb-6">
              {info}
            </div>
          )}

          {/* ESTADÍSTICAS RESUMEN */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Total Donaciones {tipoVista === "enviadas" ? "Enviadas" : "Recibidas"}
              </h3>
              <p className="text-2xl font-bold text-green-600">{donacionesFiltradasPorTipo.length}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Categorías Utilizadas</h3>
              <p className="text-2xl font-bold text-blue-600">{categoriasConDonaciones}</p>
              <p className="text-sm text-gray-500 mt-1">de 5 categorías</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Última Donación</h3>
              <p className="text-lg font-semibold text-gray-800">
                {fechaUltimaDonacion}
              </p>
            </div>
          </div>

          {/* ESTADÍSTICAS POR CATEGORÍA */}
          <section className="bg-white rounded-xl shadow-sm border mb-8">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Donaciones {tipoVista === "enviadas" ? "Enviadas" : "Recibidas"} por Categoría
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {estadisticasPorCategoria.map((tipo) => (
                  <div 
                    key={tipo.id} 
                    className={`p-4 rounded-lg border-2 text-center transition-all duration-200 ${
                      tipo.cantidad > 0 
                        ? `${tipo.color} border-current shadow-md` 
                        : 'bg-gray-50 text-gray-400 border-gray-200'
                    }`}
                  >
                    <div className="text-2xl font-bold mb-1">{tipo.cantidad}</div>
                    <div className="text-sm font-medium">{tipo.nombre}</div>
                    {tipo.cantidad === 0 && (
                      <div className="text-xs mt-1">Sin donaciones</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* LISTADO DE DONACIONES */}
          <section className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {mostrarTodas 
                    ? `Todas las Donaciones ${tipoVista === "enviadas" ? "Enviadas" : "Recibidas"}` 
                    : `Últimas Donaciones ${tipoVista === "enviadas" ? "Enviadas" : "Recibidas"}`
                  }
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {mostrarTodas 
                    ? `Mostrando ${donacionesFiltradas.length} de ${donacionesFiltradasPorTipo.length} donaciones` 
                    : `Donaciones ${tipoVista === "enviadas" ? "realizadas" : "recibidas"} más recientes`
                  }
                </p>
              </div>

              {/* Filtro por categoría (solo cuando se muestran todas) */}
              {mostrarTodas && (
                <div className="flex items-center gap-4">
                  <select
                    value={categoriaFiltro}
                    onChange={(e) => setCategoriaFiltro(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                  >
                    {TIPOS_DONACIONES.map(tipo => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nombre} {tipo.id !== "todos" && `(${
                          donacionesFiltradasPorTipo.filter(d => 
                            d.tipo.toLowerCase() === tipo.id.toLowerCase() || 
                            d.categoria.toLowerCase() === tipo.id.toLowerCase()
                          ).length
                        })`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {donacionesFiltradas.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {categoriaFiltro === "todos" 
                    ? `No hay donaciones ${tipoVista === "enviadas" ? "enviadas" : "recibidas"} registradas` 
                    : 'No hay donaciones en esta categoría'
                  }
                </h3>
                <p className="text-gray-500 mb-4">
                  {categoriaFiltro === "todos" 
                    ? (info || `Este usuario todavía no ha ${tipoVista === "enviadas" ? "realizado" : "recibido"} ninguna donación.`)
                    : `No se encontraron donaciones en la categoría "${TIPOS_DONACIONES.find(t => t.id === categoriaFiltro)?.nombre}"`
                  }
                </p>
                {categoriaFiltro !== "todos" && (
                  <button
                    onClick={() => setCategoriaFiltro("todos")}
                    className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition mr-2"
                  >
                    Ver Todas las Categorías
                  </button>
                )}
                <button
                  onClick={() => router.back()}
                  className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                  Volver Atrás
                </button>
              </div>
            ) : (
              <>
                <div className="divide-y">
                  {donacionesFiltradas.map((donacion) => (
                    <div key={donacion.id} className="p-6 hover:bg-gray-50 transition">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {tipoVista === "enviadas" 
                              ? `Donación a ${donacion.destinatario}`
                              : `Donación de ${donacion.donante}`
                            }
                          </h3>
                          <p className="text-gray-600 text-sm">{donacion.fecha}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-600">{donacion.monto}</p>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            TIPOS_DONACIONES.find(t => t.id.toLowerCase() === donacion.tipo.toLowerCase())?.color || 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {donacion.tipo}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p><strong>Descripción:</strong> {donacion.descripcion}</p>
                          <p><strong>Tipo:</strong> {donacion.tipo}</p>
                        </div>
                        <div>
                          <p><strong>Categoría:</strong> {donacion.categoria}</p>
                          {tipoVista === "enviadas" ? (
                            <p><strong>Destinatario:</strong> {donacion.destinatario}</p>
                          ) : (
                            <p><strong>Donante:</strong> {donacion.donante}</p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <button 
                          onClick={() => abrirModalDetalles(donacion)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm transition"
                        >
                          Ver detalles →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Botón Ver Más / Ver Menos */}
                {donacionesFiltradasPorTipo.length > 2 && (
                  <div className="p-6 border-t text-center">
                    <button
                      onClick={toggleMostrarTodas}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 transform hover:scale-105"
                    >
                      {mostrarTodas ? (
                        <>
                          <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                          Ver Menos Donaciones
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          Ver Más Donaciones ({donacionesFiltradasPorTipo.length - 2} más)
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </main>
      </div>

      {/* MODAL DE DETALLES */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b bg-gray-50 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Detalles de la Donación
                </h2>
                <button
                  onClick={cerrarModal}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {cargandoDetalles ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Cargando detalles...</span>
                </div>
              ) : errorDetalles ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {errorDetalles}
                </div>
              ) : (
                <>
                  {donacionSeleccionada && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Información General</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                        <div>
                          <p><strong>Fecha:</strong> {donacionSeleccionada.fecha}</p>
                          <p><strong>Monto/Valor:</strong> {donacionSeleccionada.monto}</p>
                          <p><strong>Tipo:</strong> {donacionSeleccionada.tipo}</p>
                        </div>
                        <div>
                          <p><strong>Categoría:</strong> {donacionSeleccionada.categoria}</p>
                          {tipoVista === "enviadas" ? (
                            <p><strong>Destinatario:</strong> {donacionSeleccionada.destinatario}</p>
                          ) : (
                            <p><strong>Donante:</strong> {donacionSeleccionada.donante}</p>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 text-gray-700">
                        <p><strong>Descripción:</strong> {donacionSeleccionada.descripcion}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Detalles Específicos</h3>
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                        {detallesDonacion.length} {detallesDonacion.length === 1 ? 'detalle' : 'detalles'}
                      </span>
                    </div>
                    
                    {detallesDonacion.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p>No hay detalles adicionales para esta donación</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {obtenerArrayDetalles(detallesDonacion).map((detalle, index) => (
                          <div key={detalle.id || index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-semibold text-gray-700">
                                Item #{index + 1}
                              </h4>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                detalle.nombreDonacionEstadoIdDonacionEstado === 'Completada' 
                                  ? 'bg-green-100 text-green-800'
                                  : detalle.nombreDonacionEstadoIdDonacionEstado === 'Pendiente'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : detalle.nombreDonacionEstadoIdDonacionEstado === 'Cancelada'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {detalle.nombreDonacionEstadoIdDonacionEstado}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>
                                <p><strong>Descripción del item:</strong></p>
                                <p className="mt-1">{detalle.descripcion}</p>
                              </div>
                              <div>
                                <p><strong>Cantidad:</strong></p>
                                <p className="mt-1 text-lg font-semibold">{detalle.cantidad} unidades</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50 rounded-b-xl">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Mostrando {detallesDonacion.length} {detallesDonacion.length === 1 ? 'detalle' : 'detalles'}
                </div>
                <button
                  onClick={cerrarModal}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}