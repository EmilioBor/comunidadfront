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

export default function Donaciones() {
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [perfil, setPerfil] = useState<PerfilType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [mostrarTodas, setMostrarTodas] = useState(false);
  const [categoriaFiltro, setCategoriaFiltro] = useState("todos");

  const router = useRouter();

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
          console.log("📋 Ejemplo de donación:", todasLasDonaciones[0]);
        } catch (err) {
          console.warn("⚠️ No se pudieron obtener las donaciones:", err.message);
          setInfo("No se pudieron cargar las donaciones del servidor");
          todasLasDonaciones = [];
        }

        // Filtrar donaciones por nombrePerfilDonanteIdPerfilDonante
        const donacionesDelPerfil = todasLasDonaciones.filter(donacion => 
          donacion.nombrePerfilDonanteIdPerfilDonante === perfilData.razonSocial
        );

        console.log(`✅ Donaciones del perfil: ${donacionesDelPerfil.length}`);

        // Formatear donaciones - CORREGIDO para manejar fechaHora
        const donacionesFormateadas = donacionesDelPerfil.map(donacion => ({
          id: donacion.id,
          fecha: formatearFecha(donacion.fechaHora), // Usar fechaHora del backend
          monto: formatearMonto(donacion.monto),
          destinatario: donacion.nombrePerfilIdPerfil || "Destinatario no especificado",
          cbu: "No aplica para donaciones en especie",
          calificacion: "No calificada",
          descripcion: donacion.descripcion || `Donación de ${donacion.nombreDonacionTipoIdDonacionTipo}`,
          estado: "Completada",
          tipo: donacion.nombreDonacionTipoIdDonacionTipo || "Donación en especie",
          donante: donacion.nombrePerfilDonanteIdPerfilDonante || perfilData.razonSocial,
          categoria: donacion.nombreDonacionTipoIdDonacionTipo,
          fechaHora: donacion.fechaHora // Mantener la fecha original del backend
        }));

        setDonaciones(donacionesFormateadas);

        if (donacionesDelPerfil.length === 0 && todasLasDonaciones.length === 0) {
          setInfo("No se encontraron donaciones en el sistema");
        } else if (donacionesDelPerfil.length === 0) {
          setInfo("No se encontraron donaciones realizadas por este perfil");
        }

      } catch (err) {
        console.error("Error cargando donaciones:", err);
        setError(err.message || "Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, [router]);

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
      <Navbar />
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Historial de Donaciones</h1>
            <p className="text-gray-600">
              Revisa todas las donaciones que has realizado
            </p>
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
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Donaciones</h3>
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

          {/* ESTADÍSTICAS POR CATEGORÍA - SIN RESUMEN */}
          <section className="bg-white rounded-xl shadow-sm border mb-8">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Donaciones por Categoría</h2>
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
                  {mostrarTodas ? 'Todas las Donaciones' : 'Últimas Donaciones'}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {mostrarTodas 
                    ? `Mostrando ${donacionesFiltradas.length} de ${donaciones.length} donaciones` 
                    : 'Tus donaciones más recientes'
                  }
                </p>
              </div>

              {/* Filtro por categoría (solo cuando se muestran todas) - CORREGIDO COLOR */}
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
                  {categoriaFiltro === "todos" ? 'No hay donaciones registradas' : 'No hay donaciones en esta categoría'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {categoriaFiltro === "todos" 
                    ? (info || "Todavía no has realizado ninguna donación.")
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
                            Donación a {donacion.destinatario}
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
                          <p><strong>Destinatario:</strong> {donacion.destinatario}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition">
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
    </div>
  );
}