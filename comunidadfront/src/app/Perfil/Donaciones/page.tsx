// app/Perfil/Donaciones/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/app/Inicio/components/Navbar";
import { GetUserByPerfil } from "@/app/lib/api/perfil";
import { getDonaciones } from "@/app/lib/api/donacionApi";

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
  nombreDonacionIdDonacion: string;  // Este campo contiene la DESCRIPCIÓN de la donación
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

// Funciones auxiliares - MOVIDAS ARRIBA del componente
const formatearFecha = (fecha: string) => {
  if (!fecha) return "Fecha no especificada";
  
  try {
    // Intentar parsear la fecha del backend
    const fechaObj = new Date(fecha);
    
    // Verificar si la fecha es válida
    if (isNaN(fechaObj.getTime())) {
      console.warn("Fecha inválida:", fecha);
      return "Fecha inválida";
    }
    
    return fechaObj.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error("Error formateando fecha:", error, "Fecha original:", fecha);
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
    
    console.log("📦 Total de detalles cargados:", detalles.length);
    
    // Asegurarnos de que siempre devolvemos un array
    if (Array.isArray(detalles)) {
      return detalles;
    } else if (detalles && typeof detalles === 'object') {
      return [detalles];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error obteniendo detalles de donación:", error);
    throw error;
  }
}

// Función para filtrar detalles por descripción de donación
function filtrarDetallesPorDescripcion(detalles: DetalleDonacion[], descripcionDonacion: string): DetalleDonacion[] {
  console.log(`🔍 Filtrando detalles para descripción: "${descripcionDonacion}"`);
  
  const detallesFiltrados = detalles.filter(detalle => {
    // Coincidencia EXACTA (case insensitive)
    const coincideExacto = detalle.nombreDonacionIdDonacion && descripcionDonacion &&
      detalle.nombreDonacionIdDonacion.toLowerCase() === descripcionDonacion.toLowerCase();
    
    if (coincideExacto) {
      console.log(`   ✅ COINCIDE: "${detalle.nombreDonacionIdDonacion}"`);
      return true;
    }
    
    return false;
  });
  
  console.log(`✅ Detalles encontrados: ${detallesFiltrados.length}`);
  return detallesFiltrados;
}

export default function Donaciones() {
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

  // Cargar todos los detalles al montar el componente
  useEffect(() => {
    async function cargarTodosLosDetalles() {
      try {
        console.log("🔄 Cargando todos los detalles de donación...");
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

  // Donaciones a mostrar (últimas 2 o todas según el estado)
  const donacionesAMostrar = mostrarTodas 
    ? donacionesOrdenadas 
    : donacionesOrdenadas.slice(0, 2);

  // Filtrar donaciones por categoría seleccionada
  const donacionesFiltradas = categoriaFiltro === "todos" 
    ? donacionesAMostrar 
    : donacionesAMostrar.filter(donacion => 
        donacion.tipo.toLowerCase() === categoriaFiltro.toLowerCase() ||
        donacion.categoria.toLowerCase() === categoriaFiltro.toLowerCase()
      );

  // Calcular estadísticas por categoría
  const estadisticasPorCategoria = TIPOS_DONACIONES.filter(tipo => tipo.id !== "todos").map(tipo => {
    const cantidad = donaciones.filter(donacion => 
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
  const ultimaDonacion = donacionesOrdenadas.length > 0 ? donacionesOrdenadas[0] : null;
  const fechaUltimaDonacion = ultimaDonacion 
    ? formatearFecha(ultimaDonacion.fechaHora || ultimaDonacion.fecha)
    : 'N/A';

  const toggleMostrarTodas = () => {
    setMostrarTodas(!mostrarTodas);
    // Si estamos mostrando todas, resetear el filtro
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
      console.log(`🔍 Buscando detalles para donación ID: ${donacion.id}`);
      console.log(`📝 Descripción de la donación: "${donacion.descripcion}"`);
      
      // Filtrar los detalles por la descripción de la donación
      const detallesFiltrados = filtrarDetallesPorDescripcion(todosLosDetalles, donacion.descripcion);
      
      console.log(`✅ Detalles encontrados: ${detallesFiltrados.length}`);
      
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
        setLoading(true);
        setError("");
        setInfo("");

        console.log("🔄 Cargando datos del perfil y donaciones...");

        // Obtener usuario (mismo método que en Perfil/page.tsx)
        const me = await fetch("/api/user/me").then((r) => r.json());
        console.log("✅ Usuario obtenido:", me);

        if (!me || !me.id) {
          throw new Error("Usuario no autenticado");
        }

        // Obtener perfil
        const perfilData = await GetUserByPerfil(me.id);
        console.log("✅ Perfil obtenido:", perfilData);

        if (!perfilData) {
          router.push("/Perfil/Crear");
          return;
        }

        setPerfil(perfilData);

        // Obtener donaciones con manejo de errores
        let todasLasDonaciones = [];
        try {
          todasLasDonaciones = await getDonaciones();
          console.log("📦 Total de donaciones:", todasLasDonaciones.length);
        } catch (err) {
          console.warn("⚠️ No se pudieron obtener las donaciones:", err.message);
          setInfo("No se pudieron cargar las donaciones del servidor");
          todasLasDonaciones = [];
        }

        // Filtrar donaciones según el tipo de vista seleccionado
        let donacionesFiltradas = [];
        if (tipoVista === "enviadas") {
          // Donaciones enviadas - donde el perfil actual es el donante
          donacionesFiltradas = todasLasDonaciones.filter(donacion => 
            donacion.nombrePerfilDonanteIdPerfilDonante === perfilData.razonSocial
          );
          console.log(`✅ Donaciones enviadas: ${donacionesFiltradas.length}`);
        } else {
          // Donaciones recibidas - donde el perfil actual es el destinatario
          donacionesFiltradas = todasLasDonaciones.filter(donacion => 
            donacion.nombrePerfilIdPerfil === perfilData.razonSocial
          );
          console.log(`✅ Donaciones recibidas: ${donacionesFiltradas.length}`);
        }

        // Formatear donaciones
        const donacionesFormateadas = donacionesFiltradas.map(donacion => ({
          id: donacion.id,
          fecha: formatearFecha(donacion.fechaHora),
          monto: formatearMonto(donacion.monto),
          destinatario: donacion.nombrePerfilIdPerfil || "Destinatario no especificado",
          cbu: "No aplica para donaciones en especie",
          calificacion: "No calificada",
          descripcion: donacion.descripcion || `Donación de ${donacion.nombreDonacionTipoIdDonacionTipo}`,
          estado: "Completada",
          tipo: donacion.nombreDonacionTipoIdDonacionTipo || "Donación en especie",
          donante: donacion.nombrePerfilDonanteIdPerfilDonante || perfilData.razonSocial,
          categoria: donacion.nombreDonacionTipoIdDonacionTipo,
          fechaHora: donacion.fechaHora
        }));

        setDonaciones(donacionesFormateadas);

        if (donacionesFiltradas.length === 0 && todasLasDonaciones.length === 0) {
          setInfo("No se encontraron donaciones en el sistema");
        } else if (donacionesFiltradas.length === 0) {
          setInfo(`No se encontraron donaciones ${tipoVista === "enviadas" ? "realizadas" : "recibidas"} por este perfil`);
        }

      } catch (err) {
        console.error("Error cargando donaciones:", err);
        setError(err.message || "Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, [router, tipoVista]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        
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
        
        <div className="flex w-full justify-center items-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-4">⚠️ {error}</div>
            <Link
              href="/Perfil/Crear"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Crear Perfil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      
      <div className="flex w-full">
        {/* COLUMNA IZQUIERDA - Mismo diseño que Perfil */}
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

              <div className="mt-10 flex flex-col w-full gap-4">
                <Link
                  href="/Perfil"
                  className="bg-gray-300 hover:bg-gray-400 py-2 rounded-lg text-center text-black transition"
                >
                  Volver al Perfil
                </Link>
                <Link
                  href="/Perfil/Chat"
                  className="bg-gray-300 hover:bg-gray-400 py-2 rounded-lg text-center text-black transition"
                >
                  Chats
                </Link>
              </div>
            </>
          )}
        </aside>

        {/* COLUMNA CENTRAL - Listado de Donaciones */}
        <main className="w-3/4 p-8">
          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Historial de Donaciones {tipoVista === "enviadas" ? "Enviadas" : "Recibidas"}
            </h1>
            <p className="text-gray-600">
              {tipoVista === "enviadas" 
                ? "Revisa todas las donaciones que has realizado" 
                : "Revisa todas las donaciones que has recibido"
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
              <p className="text-2xl font-bold text-green-600">{donaciones.length}</p>
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
                    ? `Mostrando ${donacionesFiltradas.length} de ${donaciones.length} donaciones` 
                    : `Tus donaciones ${tipoVista === "enviadas" ? "realizadas" : "recibidas"} más recientes`
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
                          donaciones.filter(d => 
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
                    ? (info || `Todavía no has ${tipoVista === "enviadas" ? "realizado" : "recibido"} ninguna donación.`)
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
                <Link
                  href="/Inicio"
                  className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                  Explorar Publicaciones
                </Link>
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
                {donaciones.length > 2 && (
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
                          Ver Más Donaciones ({donaciones.length - 2} más)
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
            {/* Header del Modal */}
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

            {/* Contenido del Modal */}
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
                  {/* Información general de la donación - TEXTO MÁS OSCURO */}
                  {donacionSeleccionada && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Información General</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700"> {/* Texto más oscuro */}
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
                      <div className="mt-3 text-gray-700"> {/* Texto más oscuro */}
                        <p><strong>Descripción:</strong> {donacionSeleccionada.descripcion}</p>
                      </div>
                    </div>
                  )}

                  {/* Detalles específicos */}
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
                            {/* ID DETALLE ELIMINADO */}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Footer del Modal */}
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