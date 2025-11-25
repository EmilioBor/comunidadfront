"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  estadoActual?: string;
  esPendiente?: boolean;
}

interface DetalleDonacion {
  id: number;
  descripcion: string;
  nombreDonacionIdDonacion: string;
  cantidad: number;
  nombreDonacionEstadoIdDonacionEstado: string;
}

interface DonacionEstado {
  id: number;
  nombre: string;
  nombreDonacionIdDonacion: string;
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

// Estados de donación
const ESTADOS_DONACION = {
  PENDIENTE: "Pendiente",
  CANCELADO: "Cancelado",
  EN_PROCESO: "En Proceso", 
  PARCIALMENTE_CUMPLIDO: "Parcialmente Cumplido",
  CUMPLIDO: "Cumplido"
};

// Funciones auxiliares
const formatearFecha = (fecha: string) => {
  if (!fecha) return "Fecha no especificada";
  
  try {
    const fechaObj = new Date(fecha);
    
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

// SERVICIOS API PARA ESTADOS - CORREGIDA
async function getEstadosDonacion(): Promise<DonacionEstado[]> {
  try {
    console.log('🔄 Obteniendo estados de donación desde el servidor...');
    const response = await fetch('https://localhost:7168/api/DonacionEstado/api/v1/detalleDonacionTipos', {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
    
    if (!response.ok) throw new Error(`Error ${response.status} al obtener estados`);
    
    const estados = await response.json();
    console.log('📊 Estados obtenidos del servidor:', estados);
    
    return estados;
  } catch (error) {
    console.error('Error en getEstadosDonacion:', error);
    return [];
  }
}

// Función CORREGIDA para obtener el estado actual de una donación - USA EL ID
async function obtenerEstadoActualDonacion(donacionId: number, donaciones: any[]): Promise<string> {
  try {
    const estados = await getEstadosDonacion();
    
    // Encontrar la descripción de la donación específica
    const donacion = donaciones.find(d => d.id === donacionId);
    
    if (!donacion) {
      console.log(`❌ No se encontró la donación con ID: ${donacionId}`);
      return ESTADOS_DONACION.PENDIENTE;
    }
    
    const descripcionDonacion = donacion.descripcion;
    console.log(`🔍 Buscando estado MÁS RECIENTE para donación ID: ${donacionId} - "${descripcionDonacion}"`);
    
    // Buscar estados que coincidan con la descripción de ESTA donación específica
    const estadosDonacion = estados.filter((estado: DonacionEstado) => {
      return estado.nombreDonacionIdDonacion === descripcionDonacion;
    });
    
    console.log(`📊 Estados encontrados para donación ${donacionId}:`, estadosDonacion.length);
    
    if (estadosDonacion.length === 0) {
      console.log(`❌ No se encontró estado para donación ID: ${donacionId}`);
      return ESTADOS_DONACION.PENDIENTE;
    }
    
    // ORDENAR POR ID DESCENDENTE para tomar el MÁS RECIENTE
    const estadosOrdenados = estadosDonacion.sort((a: DonacionEstado, b: DonacionEstado) => b.id - a.id);
    const estadoMasReciente = estadosOrdenados[0];
    
    console.log(`🎯 Estado MÁS RECIENTE para donación ${donacionId}:`, estadoMasReciente.nombre);
    
    return estadoMasReciente.nombre || ESTADOS_DONACION.PENDIENTE;
  } catch (error) {
    console.error('Error obteniendo estado de donación:', error);
    return ESTADOS_DONACION.PENDIENTE;
  }
}

// Función CORREGIDA para crear un nuevo estado de donación - SOLUCIÓN PARA ERROR DE LLAVE FORÁNEA
async function crearEstadoDonacion(donacionId: number, descripcionDonacion: string, nombreEstado: string) {
  try {
    console.log('📤 Creando estado para donación ID:', donacionId, 'Descripción:', descripcionDonacion, 'estado:', nombreEstado);
    
    // ESTRUCTURA CORREGIDA: El backend necesita el ID numérico para la FK y la descripción para búsquedas
    const estadoData = {
      id: 0,
      nombre: nombreEstado,
      donacionIdDonacion: donacionId, // ID numérico para la llave foránea
      nombreDonacionIdDonacion: descripcionDonacion // Descripción para compatibilidad con búsquedas
    };

    console.log('📦 Creando nuevo estado:', estadoData);

    const response = await fetch('https://localhost:7168/api/DonacionEstado/api/v1/agrega/detalleDonacionTipo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(estadoData)
    });

    console.log('📡 Respuesta del servidor:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error detallado del servidor:', errorText);
      throw new Error(`Error al crear estado: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('✅ Estado creado exitosamente:', result);
    
    return result;
    
  } catch (error) {
    console.error('💥 Error en crearEstadoDonacion:', error);
    throw error;
  }
}

// Función para obtener TODOS los detalles de donación
async function obtenerTodosLosDetallesDonacion(): Promise<DetalleDonacion[]> {
  try {
    const response = await fetch(`https://localhost:7168/api/v1/DetalleDonacion`);
    
    if (!response.ok) {
      throw new Error(`Error al obtener detalles: ${response.status}`);
    }
    
    const detalles = await response.json();
    
    console.log("📦 Total de detalles cargados:", detalles.length);
    
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

// Función CORREGIDA para filtrar detalles - USA EL ID DE DONACIÓN
function filtrarDetallesPorDonacion(detalles: DetalleDonacion[], donaciones: any[], donacionId: number): DetalleDonacion[] {
  console.log(`🔍 Buscando detalles para donación ID: ${donacionId}`);
  
  // Primero, encontrar la descripción de la donación específica
  const donacion = donaciones.find(d => d.id === donacionId);
  
  if (!donacion) {
    console.log(`❌ No se encontró la donación con ID: ${donacionId}`);
    return [];
  }
  
  const descripcionDonacion = donacion.descripcion;
  console.log(`📝 Descripción de la donación ${donacionId}: "${descripcionDonacion}"`);
  
  // Filtrar detalles que coincidan EXACTAMENTE con esta descripción
  const detallesFiltrados = detalles.filter(detalle => {
    const coincideExacto = detalle.nombreDonacionIdDonacion === descripcionDonacion;
    
    if (coincideExacto) {
      console.log(`✅ Detalle encontrado: ID=${detalle.id}, Descripción="${detalle.descripcion}", Donación="${detalle.nombreDonacionIdDonacion}"`);
    }
    
    return coincideExacto;
  });
  
  console.log(`📊 Detalles encontrados para donación ${donacionId}: ${detallesFiltrados.length}`);
  
  return detallesFiltrados;
}

// Función CORREGIDA para procesar donación y actualizar estado
const procesarDonacion = async (donacion: any, accion: 'aceptar' | 'rechazar') => {
  try {
    console.log('🔄 Procesando donación ID:', donacion.id, 'Descripción:', donacion.descripcion, 'Acción:', accion);
    
    const nuevoEstado = accion === 'aceptar' ? ESTADOS_DONACION.CUMPLIDO : ESTADOS_DONACION.CANCELADO;
    console.log('🎯 Nuevo estado a aplicar:', nuevoEstado);

    // IMPORTANTE: Pasamos tanto el ID como la descripción para solucionar el error de llave foránea
    const resultado = await crearEstadoDonacion(donacion.id, donacion.descripcion, nuevoEstado);
    console.log('✅ Estado creado exitosamente para donación:', donacion.id);
    
    return resultado;
    
  } catch (error) {
    console.error('💥 Error en procesarDonacion:', error);
    throw error;
  }
};

export default function Donaciones() {
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [perfil, setPerfil] = useState<PerfilType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [mostrarTodas, setMostrarTodas] = useState(false);
  const [categoriaFiltro, setCategoriaFiltro] = useState("todos");
  const [tipoVista, setTipoVista] = useState<"enviadas" | "recibidas">("recibidas");
  
  // Estados para el modal de detalles
  const [modalAbierto, setModalAbierto] = useState(false);
  const [donacionSeleccionada, setDonacionSeleccionada] = useState<Donacion | null>(null);
  const [detallesDonacion, setDetallesDonacion] = useState<DetalleDonacion[]>([]);
  const [cargandoDetalles, setCargandoDetalles] = useState(false);
  const [errorDetalles, setErrorDetalles] = useState("");
  const [todosLosDetalles, setTodosLosDetalles] = useState<DetalleDonacion[]>([]);

  // Estados para gestión de donaciones pendientes
  const [modalGestionAbierto, setModalGestionAbierto] = useState(false);
  const [donacionPendiente, setDonacionPendiente] = useState<Donacion | null>(null);
  const [detallesPendientes, setDetallesPendientes] = useState<DetalleDonacion[]>([]);
  const [detallesSeleccionados, setDetallesSeleccionados] = useState<number[]>([]);
  const [procesando, setProcesando] = useState(false);

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

  // Cargar datos principales - ESTRATEGIA CORREGIDA
  const cargarDatosPrincipales = async () => {
    try {
      setLoading(true);
      setError("");
      setInfo("");

      console.log("🔄 Cargando datos del perfil y donaciones...");

      // Obtener usuario
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

      // Obtener todas las donaciones
      let todasLasDonaciones = [];
      try {
        todasLasDonaciones = await getDonaciones();
        console.log("📦 Total de donaciones:", todasLasDonaciones.length);
      } catch (err: any) {
        console.warn("⚠️ No se pudieron obtener las donaciones:", err.message);
        setInfo("No se pudieron cargar las donaciones del servidor");
        todasLasDonaciones = [];
      }

      // Filtrar donaciones según el tipo de vista seleccionado - CORREGIDO
      let donacionesFiltradas = [];
      if (tipoVista === "enviadas") {
        // Para donaciones enviadas: mostrar donde el perfil actual es el DONANTE
        donacionesFiltradas = todasLasDonaciones.filter(donacion => {
          const esDonante = donacion.nombrePerfilDonanteIdPerfilDonante === perfilData.razonSocial;
          console.log(`🔍 Donación ${donacion.id}: donante="${donacion.nombrePerfilDonanteIdPerfilDonante}", mi perfil="${perfilData.razonSocial}", esDonante=${esDonante}`);
          return esDonante;
        });
        console.log(`✅ Donaciones enviadas: ${donacionesFiltradas.length}`);
      } else {
        // Para donaciones recibidas: mostrar donde el perfil actual es el DESTINATARIO
        donacionesFiltradas = todasLasDonaciones.filter(donacion => {
          const esDestinatario = donacion.nombrePerfilIdPerfil === perfilData.razonSocial;
          console.log(`🔍 Donación ${donacion.id}: destinatario="${donacion.nombrePerfilIdPerfil}", mi perfil="${perfilData.razonSocial}", esDestinatario=${esDestinatario}`);
          return esDestinatario;
        });
        console.log(`✅ Donaciones recibidas: ${donacionesFiltradas.length}`);
      }

      // Obtener estados para cada donación y formatear
      console.log("🔄 Obteniendo estados para las donaciones...");
      const donacionesConEstados = await Promise.all(
        donacionesFiltradas.map(async (donacion) => {
          // IMPORTANTE: Pasar tanto el ID como el array de donaciones
          const estadoActual = await obtenerEstadoActualDonacion(donacion.id, donacionesFiltradas);
          
          // Determinar si es pendiente basado en el estado actual
          // Para donaciones enviadas, no mostramos como "pendientes" porque no podemos gestionarlas
          const esPendiente = tipoVista === "recibidas" && estadoActual === ESTADOS_DONACION.PENDIENTE;
          
          const donacionFormateada = {
            id: donacion.id,
            fecha: formatearFecha(donacion.fechaHora),
            monto: formatearMonto(donacion.descripcion),
            destinatario: donacion.nombrePerfilIdPerfil || "Destinatario no especificado",
            cbu: "No aplica para donaciones en especie",
            calificacion: "No calificada",
            descripcion: donacion.descripcion || `Donación de ${donacion.nombreDonacionTipoIdDonacionTipo}`,
            estado: estadoActual,
            tipo: donacion.nombreDonacionTipoIdDonacionTipo || "Donación en especie",
            donante: donacion.nombrePerfilDonanteIdPerfilDonante || perfilData.razonSocial,
            categoria: donacion.nombreDonacionTipoIdDonacionTipo,
            fechaHora: donacion.fechaHora,
            estadoActual: estadoActual,
            esPendiente: esPendiente
          };

          console.log(`📋 Donación ${donacion.id} - "${donacion.descripcion}":`, {
            estado: estadoActual,
            esPendiente: esPendiente,
            tipoVista: tipoVista
          });

          return donacionFormateada;
        })
      );

      setDonaciones(donacionesConEstados);

      // Mostrar información según el tipo de vista
      if (tipoVista === "recibidas") {
        const pendientesCount = donacionesConEstados.filter(d => d.esPendiente).length;
        if (pendientesCount > 0) {
          setInfo(`Tienes ${pendientesCount} donación(es) pendiente(s) de revisión`);
        } else if (donacionesFiltradas.length === 0) {
          setInfo("No se encontraron donaciones recibidas por este perfil");
        } else {
          setInfo("No hay donaciones pendientes de revisión");
        }
      } else {
        // Para donaciones enviadas
        if (donacionesFiltradas.length === 0) {
          setInfo("No se encontraron donaciones realizadas por este perfil");
        } else {
          const pendientesCount = donacionesConEstados.filter(d => d.estadoActual === ESTADOS_DONACION.PENDIENTE).length;
          const completadasCount = donacionesConEstados.filter(d => d.estadoActual === ESTADOS_DONACION.CUMPLIDO).length;
          const canceladasCount = donacionesConEstados.filter(d => d.estadoActual === ESTADOS_DONACION.CANCELADO).length;
          
          setInfo(`Has realizado ${donacionesFiltradas.length} donación(es): ${completadasCount} completadas, ${pendientesCount} pendientes, ${canceladasCount} canceladas`);
        }
      }

    } catch (err: any) {
      console.error("Error cargando donaciones:", err);
      setError(err.message || "Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatosPrincipales();
  }, [router, tipoVista]);

  // Filtrar donaciones pendientes (solo para donaciones recibidas)
  const donacionesPendientes = donaciones.filter(donacion => 
    tipoVista === "recibidas" && donacion.esPendiente
  );

  // Donaciones completadas (todas las que NO son pendientes)
  const donacionesCompletadas = donaciones.filter(donacion => 
    !donacion.esPendiente
  );

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
    if (!mostrarTodas) {
      setCategoriaFiltro("todos");
    }
  };

  const cambiarTipoVista = (nuevoTipo: "enviadas" | "recibidas") => {
    setTipoVista(nuevoTipo);
    setMostrarTodas(false);
    setCategoriaFiltro("todos");
  };

  // Función CORREGIDA para abrir el modal con los detalles - USA LA NUEVA FUNCIÓN
  const abrirModalDetalles = async (donacion: Donacion) => {
    setDonacionSeleccionada(donacion);
    setCargandoDetalles(true);
    setErrorDetalles("");
    setModalAbierto(true);

    try {
      console.log(`🔍 Buscando detalles para donación ID: ${donacion.id}`);
      
      // USAR LA NUEVA FUNCIÓN que filtra por ID de donación
      const detallesFiltrados = filtrarDetallesPorDonacion(todosLosDetalles, donaciones, donacion.id);
      
      console.log(`✅ Detalles encontrados para donación ${donacion.id}: ${detallesFiltrados.length}`);
      
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

  // Función CORREGIDA para abrir modal de gestión de donación pendiente - USA LA NUEVA FUNCIÓN
  const abrirModalGestion = async (donacion: Donacion) => {
    setDonacionPendiente(donacion);
    setDetallesSeleccionados([]);
    setModalGestionAbierto(true);

    try {
      console.log(`🔍 Buscando detalles para donación ID: ${donacion.id}`);
      
      // USAR LA NUEVA FUNCIÓN que filtra por ID de donación
      const detallesRelacionados = filtrarDetallesPorDonacion(todosLosDetalles, donaciones, donacion.id);
      
      console.log(`📋 Detalles relacionados encontrados para donación ${donacion.id}: ${detallesRelacionados.length}`);
      setDetallesPendientes(detallesRelacionados);
      
    } catch (err) {
      console.error("Error al cargar detalles pendientes:", err);
    }
  };

  // Función para cerrar modal de gestión
  const cerrarModalGestion = () => {
    setModalGestionAbierto(false);
    setDonacionPendiente(null);
    setDetallesPendientes([]);
    setDetallesSeleccionados([]);
  };

  // Función para seleccionar/deseleccionar detalle
  const toggleDetalleSeleccionado = (detalleId: number) => {
    setDetallesSeleccionados(prev => {
      if (prev.includes(detalleId)) {
        return prev.filter(id => id !== detalleId);
      } else {
        return [...prev, detalleId];
      }
    });
  };

  // Función para recargar datos completos
  const recargarDatosCompletos = async () => {
    try {
      setLoading(true);
      await cargarDatosPrincipales();
    } catch (error) {
      console.error("Error recargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar el estado de una donación en la lista
  const actualizarEstadoDonacion = (donacionId: number, nuevoEstado: string) => {
    setDonaciones(prevDonaciones => 
      prevDonaciones.map(donacion => 
        donacion.id === donacionId 
          ? { 
              ...donacion, 
              estadoActual: nuevoEstado,
              estado: nuevoEstado,
              esPendiente: false // Ya no es pendiente porque fue gestionada
            }
          : donacion
      )
    );
  };

  // Función CORREGIDA para aceptar toda la donación
  const aceptarTodaDonacion = async () => {
    if (!donacionPendiente) return;
    
    setProcesando(true);
    try {
      console.log("✅ Aceptando toda la donación ID:", donacionPendiente.id, "Descripción:", donacionPendiente.descripcion);
      
      // Procesar la donación
      await procesarDonacion(donacionPendiente, 'aceptar');
      
      // ACTUALIZAR ESTADO LOCAL - Marcar como no pendiente y con nuevo estado
      actualizarEstadoDonacion(donacionPendiente.id, ESTADOS_DONACION.CUMPLIDO);
      
      alert("Donación aceptada completamente");
      cerrarModalGestion();
      
      // Recargar datos para asegurar consistencia
      setTimeout(() => {
        recargarDatosCompletos();
      }, 1000);
      
    } catch (error) {
      console.error("Error aceptando donación:", error);
      alert("Error al aceptar la donación: " + error.message);
    } finally {
      setProcesando(false);
    }
  };

  // Función CORREGIDA para rechazar toda la donación
  const rechazarDonacion = async () => {
    if (!donacionPendiente) return;
    
    if (!confirm("¿Estás seguro de que deseas rechazar esta donación?")) {
      return;
    }
    
    setProcesando(true);
    try {
      console.log("❌ Rechazando donación ID:", donacionPendiente.id, "Descripción:", donacionPendiente.descripcion);
      
      await procesarDonacion(donacionPendiente, 'rechazar');
      
      // ACTUALIZAR ESTADO LOCAL - Marcar como no pendiente y con nuevo estado
      actualizarEstadoDonacion(donacionPendiente.id, ESTADOS_DONACION.CANCELADO);
      
      alert("Donación rechazada");
      cerrarModalGestion();
      
      // Recargar datos para asegurar consistencia
      setTimeout(() => {
        recargarDatosCompletos();
      }, 1000);
      
    } catch (error) {
      console.error("Error rechazando donación:", error);
      alert("Error al rechazar la donación: " + error.message);
    } finally {
      setProcesando(false);
    }
  };

  // Función CORREGIDA para aceptar detalles seleccionados
  const aceptarDetallesSeleccionados = async () => {
    if (!donacionPendiente || detallesSeleccionados.length === 0) return;
    
    setProcesando(true);
    try {
      console.log("✅ Aceptando detalles seleccionados para donación ID:", donacionPendiente.id);
      
      let nuevoEstado = ESTADOS_DONACION.PARCIALMENTE_CUMPLIDO;
      
      // Si se seleccionaron todos los detalles, aceptar toda la donación
      if (detallesSeleccionados.length === detallesPendientes.length) {
        await procesarDonacion(donacionPendiente, 'aceptar');
        nuevoEstado = ESTADOS_DONACION.CUMPLIDO;
        alert("Donación aceptada completamente");
      } else {
        // Si solo se seleccionaron algunos, marcar como parcialmente cumplido
        await crearEstadoDonacion(donacionPendiente.id, donacionPendiente.descripcion, ESTADOS_DONACION.PARCIALMENTE_CUMPLIDO);
        alert(`Se aceptaron ${detallesSeleccionados.length} detalles de la donación`);
      }
      
      // ACTUALIZAR ESTADO LOCAL
      actualizarEstadoDonacion(donacionPendiente.id, nuevoEstado);
      
      cerrarModalGestion();
      
      // Recargar datos para asegurar consistencia
      setTimeout(() => {
        recargarDatosCompletos();
      }, 1000);
      
    } catch (error) {
      console.error("Error aceptando detalles:", error);
      alert("Error al aceptar los detalles seleccionados: " + error.message);
    } finally {
      setProcesando(false);
    }
  };

  // Función para recargar los datos
  const handleRecargar = () => {
    cargarDatosPrincipales();
  };

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

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex w-full">
        {/* COLUMNA IZQUIERDA */}
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
                  href="/Chat"
                  className="bg-gray-300 hover:bg-gray-400 py-2 rounded-lg text-center text-black transition"
                >
                  Chats
                </Link>
                <button
                  onClick={handleRecargar}
                  className="bg-blue-500 hover:bg-blue-600 py-2 rounded-lg text-center text-white transition"
                >
                  Actualizar Estados
                </button>
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
                ? "Revisa todas las donaciones que has realizado y su estado actual" 
                : "Revisa todas las donaciones que has recibido"
              }
            </p>
          </div>

          {/* SECCIÓN DE DONACIONES PENDIENTES (solo para recibidas) */}
          {tipoVista === "recibidas" && (
            <section className="mb-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-yellow-800">
                  ⚠️ Donaciones Pendientes de Revisión
                </h2>
                <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                  {donacionesPendientes.length} pendiente(s)
                </span>
              </div>

              {donacionesPendientes.length === 0 ? (
                <div className="text-center py-4">
                  <div className="text-yellow-600 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-yellow-700 font-medium">No hay donaciones pendientes</p>
                  <p className="text-yellow-600 text-sm mt-1">
                    Todas las donaciones recibidas han sido procesadas
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {donacionesPendientes.map((donacion) => (
                    <div key={donacion.id} className="bg-white border border-yellow-300 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            Donación de {donacion.donante}
                          </h3>
                          <p className="text-gray-600 text-sm">{donacion.fecha}</p>
                        </div>
                        <div className="text-right">
                          {/* <p className="text-xl font-bold text-green-600">{donacion.monto}</p> */}
                          <div className="flex flex-col items-end gap-1">
                            <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                              Pendiente
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                        <div>
                          <p><strong>Descripción:</strong> {donacion.descripcion}</p>
                          <p><strong>Tipo:</strong> {donacion.tipo}</p>
                        </div>
                        <div>
                          <p><strong>Categoría:</strong> {donacion.categoria}</p>
                          <p><strong>Donante:</strong> {donacion.donante}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => abrirModalGestion(donacion)}
                          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition flex-1"
                        >
                          Gestionar Donación
                        </button>
                        <button 
                          onClick={() => abrirModalDetalles(donacion)}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                        >
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* PANEL DE DOS BOTONES - ENVIADAS/RECIBIDAS */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="flex">
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
                          {/* <p className="text-xl font-bold text-green-600">{donacion.monto}</p> */}
                          <div className="flex flex-col items-end gap-1">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              TIPOS_DONACIONES.find(t => t.id.toLowerCase() === donacion.tipo.toLowerCase())?.color || 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {donacion.tipo}
                            </span>
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              donacion.estadoActual === 'Cumplido' 
                                ? 'bg-green-100 text-green-800'
                                : donacion.estadoActual === 'Parcialmente Cumplido'
                                ? 'bg-blue-100 text-blue-800'
                                : donacion.estadoActual === 'Cancelado'
                                ? 'bg-red-100 text-red-800'
                                : donacion.estadoActual === 'En Proceso'
                                ? 'bg-yellow-100 text-yellow-800'
                                : donacion.estadoActual === 'Pendiente'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {donacion.estadoActual}
                            </span>
                          </div>
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
                          <p><strong>Tipo:</strong> {donacionSeleccionada.tipo}</p>
                          <p><strong>Estado:</strong> 
                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                              donacionSeleccionada.estadoActual === 'Cumplido' 
                                ? 'bg-green-100 text-green-800'
                                : donacionSeleccionada.estadoActual === 'Parcialmente Cumplido'
                                ? 'bg-blue-100 text-blue-800'
                                : donacionSeleccionada.estadoActual === 'Cancelado'
                                ? 'bg-red-100 text-red-800'
                                : donacionSeleccionada.estadoActual === 'En Proceso'
                                ? 'bg-yellow-100 text-yellow-800'
                                : donacionSeleccionada.estadoActual === 'Pendiente'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {donacionSeleccionada.estadoActual}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p><strong>Categoría:</strong> {donacionSeleccionada.categoria}</p>
                          {tipoVista === "enviadas" ? (
                            <>
                              <p><strong>Destinatario:</strong> {donacionSeleccionada.destinatario}</p>
                              <p><strong>Tu rol:</strong> Donante</p>
                            </>
                          ) : (
                            <>
                              <p><strong>Donante:</strong> {donacionSeleccionada.donante}</p>
                              <p><strong>Tu rol:</strong> Destinatario</p>
                            </>
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
                        {detallesDonacion.map((detalle, index) => (
                          <div key={detalle.id || index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-semibold text-gray-700">
                                Item #{index + 1}
                              </h4>
                              <span className="bg-gray-100 text-gray-800 px-2 py-1 text-xs rounded-full">
                                {detalle.cantidad} unidades
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <p><strong>Descripción:</strong> {detalle.descripcion}</p>
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

      {/* MODAL DE GESTIÓN DE DONACIÓN PENDIENTE */}
      {modalGestionAbierto && donacionPendiente && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b bg-yellow-50 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-yellow-800">
                  Gestionar Donación Pendiente
                </h2>
                <button
                  onClick={cerrarModalGestion}
                  className="text-yellow-600 hover:text-yellow-800 transition"
                  disabled={procesando}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Información de la donación */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Información de la Donación</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  <div>
                    <p><strong>Donante:</strong> {donacionPendiente.donante}</p>
                    <p><strong>Fecha:</strong> {donacionPendiente.fecha}</p>
                    <p><strong>Monto/Valor:</strong> {donacionPendiente.monto}</p>
                  </div>
                  <div>
                    <p><strong>Tipo:</strong> {donacionPendiente.tipo}</p>
                    <p><strong>Categoría:</strong> {donacionPendiente.categoria}</p>
                    <p><strong>Descripción:</strong> {donacionPendiente.descripcion}</p>
                  </div>
                </div>
              </div>

              {/* Detalles de la donación */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Detalles de la Donación
                </h3>
                
                {detallesPendientes.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No hay detalles específicos para esta donación
                  </div>
                ) : (
                  <div className="space-y-3">
                    {detallesPendientes.map((detalle, index) => (
                      <div key={detalle.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={detallesSeleccionados.includes(detalle.id)}
                          onChange={() => toggleDetalleSeleccionado(detalle.id)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          disabled={procesando}
                        />
                        <div className="ml-3 flex-1">
                          <p className="font-medium text-gray-800">
                            {detalle.descripcion || `Item ${index + 1}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            Cantidad: {detalle.cantidad} unidades
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={aceptarTodaDonacion}
                  disabled={procesando}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {procesando ? "Procesando..." : "✅ Aceptar Todo"}
                </button>
                
                <button
                  onClick={aceptarDetallesSeleccionados}
                  disabled={procesando || detallesSeleccionados.length === 0}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {procesando ? "Procesando..." : `✅ Aceptar Seleccionados (${detallesSeleccionados.length})`}
                </button>
                
                <button
                  onClick={rechazarDonacion}
                  disabled={procesando}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {procesando ? "Procesando..." : "❌ Rechazar Todo"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}