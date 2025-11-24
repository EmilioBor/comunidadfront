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
  nombreDonacionEstadoIdDonacionEstado?: string;
  tieneDetallesPendientes?: boolean;
  detallesPendientesCount?: number;
  procesada?: boolean;
}

interface DetalleDonacion {
  id: number;
  descripcion: string;
  nombreDonacionIdDonacion: string;
  cantidad: number;
  nombreDonacionEstadoIdDonacionEstado: string;
  donacionIdDonacion?: number; // Asegúrate de que este campo esté definido
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

// Estados de donación (los 5 que mencionaste)
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

async function obtenerEstadosDetalles(): Promise<any[]> {
  try {
    const response = await fetch(`https://localhost:7168/api/DonacionEstado/api/v1/detalleDonacionTipos`);
    
    if (!response.ok) {
      console.warn("No se pudieron cargar los estados de detalles");
      return [];
    }
    
    const estados = await response.json();
    console.log("📊 Estados de detalles cargados:", estados);
    return Array.isArray(estados) ? estados : [];
  } catch (error) {
    console.error("Error obteniendo estados de detalles:", error);
    return [];
  }
}

// Función para obtener TODOS los detalles de donación
async function obtenerTodosLosDetallesDonacion(): Promise<DetalleDonacion[]> {
  try {
    const response = await fetch(`https://localhost:7168/api/DetalleDonacion/api/v1/detalleDonacions`);
    
    if (!response.ok) {
      throw new Error(`Error al obtener detalles: ${response.status}`);
    }
    
    const detalles = await response.json();
    
    console.log("📦 DETALLES CARGADOS DESDE API:", detalles);
    
    // DEBUG: Ver la estructura de los primeros detalles
    if (detalles.length > 0) {
      console.log("🔍 ESTRUCTURA DEL PRIMER DETALLE:", {
        id: detalles[0].id,
        descripcion: detalles[0].descripcion,
        nombreDonacionIdDonacion: detalles[0].nombreDonacionIdDonacion,
        donacionIdDonacion: detalles[0].donacionIdDonacion,
        cantidad: detalles[0].cantidad,
        nombreDonacionEstadoIdDonacionEstado: detalles[0].nombreDonacionEstadoIdDonacionEstado,
        tipoEstado: typeof detalles[0].nombreDonacionEstadoIdDonacionEstado
      });
    }
    
    if (Array.isArray(detalles)) {
      return detalles;
    } else if (detalles && typeof detalles === 'object') {
      return [detalles];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error obteniendo detalles de donación:", error);
    return [];
  }
}

// Función para obtener el último detalle pendiente por descripción
async function obtenerUltimoDetallePendiente(descripcion: string): Promise<DetalleDonacion | null> {
  try {
    const response = await fetch(`https://localhost:7168/api/DetalleDonacion/api/v1/detalleDonacion/descripcion/ultimo/${encodeURIComponent(descripcion)}`);
    
    if (!response.ok) {
      console.log(`No se encontró detalle pendiente para: ${descripcion}`);
      return null;
    }
    
    const detalle = await response.json();
    return detalle;
  } catch (error) {
    console.error("Error obteniendo último detalle pendiente:", error);
    return null;
  }
}

// Función para actualizar estado de un detalle
async function actualizarEstadoDetalle(detalleId: number, nuevoEstado: string) {
  try {
    // Usamos el endpoint correcto para actualizar por ID
    const response = await fetch(`https://localhost:7168/api/DetalleDonacion/api/v1/detalleDonacion/id/${detalleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Según tu DTO, necesitas enviar estos campos
        nombreDonacionEstadoIdDonacionEstado: nuevoEstado,
        // Incluye otros campos requeridos por tu DTO de actualización
        descripcion: `Actualizado a ${nuevoEstado}`
        // Agrega otros campos que necesite tu modelo DonacionDetalleEstadoDtoIn
      })
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar estado: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error actualizando estado:", error);
    throw error;
  }
}

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
  async function cargarTodosLosDatos() {
    try {
      console.log("🔄 Cargando todos los detalles y estados...");
      
      // Cargar detalles
      const detalles = await obtenerTodosLosDetallesDonacion();
      
      // Cargar estados
      const estados = await obtenerEstadosDetalles();
      
      // Combinar detalles con sus estados
      const detallesConEstados = detalles.map(detalle => {
        // Buscar el estado correspondiente a este detalle
        const estadoDetalle = estados.find(estado => 
          estado.donacionDetalleEstadoIdDonacionDetalleEstado === detalle.id
        );
        
        return {
          ...detalle,
          nombreDonacionEstadoIdDonacionEstado: estadoDetalle?.nombre || "Sin estado"
        };
      });
      
      console.log("🎯 Detalles con estados:", detallesConEstados);
      setTodosLosDetalles(detallesConEstados);
      
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  }

  cargarTodosLosDatos();
}, []);

  // Cargar datos principales
  useEffect(() => {
    async function cargarDatos() {
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
          console.log("📦 Total de donaciones crudas:", todasLasDonaciones.length);
        } catch (err) {
          console.warn("⚠️ No se pudieron obtener las donaciones:", err);
          setInfo("No se pudieron cargar las donaciones del servidor");
          todasLasDonaciones = [];
        }

        // Filtrar donaciones según el tipo de vista seleccionado
        let donacionesFiltradas = [];
        if (tipoVista === "enviadas") {
          donacionesFiltradas = todasLasDonaciones.filter(donacion => 
            donacion.nombrePerfilDonanteIdPerfilDonante === perfilData.razonSocial
          );
          console.log(`✅ Donaciones enviadas: ${donacionesFiltradas.length}`);
        } else {
          donacionesFiltradas = todasLasDonaciones.filter(donacion => 
            donacion.nombrePerfilIdPerfil === perfilData.razonSocial
          );
          console.log(`✅ Donaciones recibidas: ${donacionesFiltradas.length}`);
        }

        // Para donaciones recibidas, buscar detalles pendientes
        if (tipoVista === "recibidas") {
          console.log("🔍 Buscando detalles pendientes para donaciones recibidas...");
          
          const donacionesConPendientes = await Promise.all(
            donacionesFiltradas.map(async (donacion) => {
              try {
                // Buscar último detalle pendiente para esta donación
                const ultimoPendiente = await obtenerUltimoDetallePendiente(donacion.descripcion);
                
                // También buscar todos los detalles relacionados para contar pendientes
                const todosDetallesDonacion = todosLosDetalles.filter(detalle => 
                  detalle.nombreDonacionIdDonacion === donacion.descripcion
                );
                
                const detallesPendientesCount = todosDetallesDonacion.filter(detalle => 
                  detalle.nombreDonacionEstadoIdDonacionEstado === ESTADOS_DONACION.PENDIENTE
                ).length;

                const tieneDetallesPendientes = !!ultimoPendiente || detallesPendientesCount > 0;

                return {
                  tieneDetallesPendientes,
                  detallesPendientesCount,
                  ultimoPendiente
                };
              } catch (error) {
                console.error(`Error buscando pendientes para donación ${donacion.id}:`, error);
                return {
                  tieneDetallesPendientes: false,
                  detallesPendientesCount: 0,
                  ultimoPendiente: null
                };
              }
            })
          );

          // Formatear donaciones con información de pendientes
          const donacionesFormateadas = donacionesFiltradas.map((donacion, index) => {
            const infoPendientes = donacionesConPendientes[index];
            
            return {
              id: donacion.id,
              fecha: formatearFecha(donacion.fechaHora),
              monto: formatearMonto(donacion.monto),
              destinatario: donacion.nombrePerfilIdPerfil || "Destinatario no especificado",
              cbu: "No aplica para donaciones en especie",
              calificacion: "No calificada",
              descripcion: donacion.descripcion || `Donación de ${donacion.nombreDonacionTipoIdDonacionTipo}`,
              estado: donacion.nombreDonacionEstadoIdDonacionEstado || "Completada",
              tipo: donacion.nombreDonacionTipoIdDonacionTipo || "Donación en especie",
              donante: donacion.nombrePerfilDonanteIdPerfilDonante || perfilData.razonSocial,
              categoria: donacion.nombreDonacionTipoIdDonacionTipo,
              fechaHora: donacion.fechaHora,
              nombreDonacionEstadoIdDonacionEstado: donacion.nombreDonacionEstadoIdDonacionEstado,
              tieneDetallesPendientes: infoPendientes.tieneDetallesPendientes,
              detallesPendientesCount: infoPendientes.detallesPendientesCount,
              procesada: false
            };
          });

          setDonaciones(donacionesFormateadas);

          // Mostrar información sobre donaciones pendientes
          const pendientesCount = donacionesFormateadas.filter(d => 
            d.tieneDetallesPendientes && !d.procesada
          ).length;

          if (pendientesCount > 0) {
            setInfo(`Tienes ${pendientesCount} donación(es) pendiente(s) de revisión`);
          } else if (donacionesFiltradas.length === 0) {
            setInfo("No se encontraron donaciones recibidas por este perfil");
          } else {
            setInfo("No hay donaciones pendientes de revisión");
          }

        } else {
          // Para donaciones enviadas, formato simple
          const donacionesFormateadas = donacionesFiltradas.map(donacion => {
            return {
              id: donacion.id,
              fecha: formatearFecha(donacion.fechaHora),
              monto: formatearMonto(donacion.monto),
              destinatario: donacion.nombrePerfilIdPerfil || "Destinatario no especificado",
              cbu: "No aplica para donaciones en especie",
              calificacion: "No calificada",
              descripcion: donacion.descripcion || `Donación de ${donacion.nombreDonacionTipoIdDonacionTipo}`,
              estado: donacion.nombreDonacionEstadoIdDonacionEstado || "Completada",
              tipo: donacion.nombreDonacionTipoIdDonacionTipo || "Donación en especie",
              donante: donacion.nombrePerfilDonanteIdPerfilDonante || perfilData.razonSocial,
              categoria: donacion.nombreDonacionTipoIdDonacionTipo,
              fechaHora: donacion.fechaHora,
              nombreDonacionEstadoIdDonacionEstado: donacion.nombreDonacionEstadoIdDonacionEstado,
              tieneDetallesPendientes: false,
              detallesPendientesCount: 0,
              procesada: false
            };
          });

          setDonaciones(donacionesFormateadas);

          if (donacionesFiltradas.length === 0) {
            setInfo("No se encontraron donaciones realizadas por este perfil");
          }
        }

      } catch (err) {
        console.error("Error cargando donaciones:", err);
        setError(err.message || "Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, [router, tipoVista, todosLosDetalles]);

  // Filtrar donaciones pendientes (solo para donaciones recibidas)
  const donacionesPendientes = donaciones.filter(donacion => 
    tipoVista === "recibidas" && 
    donacion.tieneDetallesPendientes && 
    !donacion.procesada
  );

  // Donaciones completadas (sin detalles pendientes o ya procesadas)
  const donacionesCompletadas = donaciones.filter(donacion => 
    !donacion.tieneDetallesPendientes || donacion.procesada
  );

  // Ordenar donaciones por fecha (más recientes primero)
  const donacionesOrdenadas = [...donacionesCompletadas].sort((a, b) => {
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

  // Función para abrir el modal con los detalles
  const abrirModalDetalles = async (donacion: Donacion) => {
  setDonacionSeleccionada(donacion);
  setCargandoDetalles(true);
  setErrorDetalles("");
  setModalAbierto(true);

  try {
    console.log(`🔍 Buscando detalles para donación ID: ${donacion.id}`);
    console.log(`📝 Descripción de la donación: "${donacion.descripcion}"`);
    
    // Buscar detalles por múltiples criterios
    const detallesFiltrados = todosLosDetalles.filter(detalle => {
      const porDescripcion = detalle.nombreDonacionIdDonacion === donacion.descripcion;
      const porId = detalle.donacionIdDonacion === donacion.id;
      
      return porDescripcion || porId;
    });
    
    console.log(`✅ Detalles encontrados: ${detallesFiltrados.length}`);
    console.log("Detalles encontrados:", detallesFiltrados);
    
    setDetallesDonacion(detallesFiltrados);
    
    if (detallesFiltrados.length === 0) {
      setErrorDetalles(`No se encontraron detalles específicos para esta donación`);
      
      // Debug: mostrar todos los detalles disponibles
      console.log("Todos los detalles disponibles:", todosLosDetalles);
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

  // Función para abrir modal de gestión de donación pendiente
  const abrirModalGestion = async (donacion: Donacion) => {
  setDonacionPendiente(donacion);
  setDetallesSeleccionados([]);
  setModalGestionAbierto(true);

  try {
    console.log(`🔍 Buscando detalles pendientes para donación: "${donacion.descripcion}"`);
    
    // DEBUG: Mostrar información completa de todos los detalles
    console.log("🎯 TODOS LOS DETALLES DISPONIBLES:", todosLosDetalles);
    
    // Buscar detalles para esta donación
    const detallesRelacionados = todosLosDetalles.filter(detalle => {
      const porDescripcion = detalle.nombreDonacionIdDonacion === donacion.descripcion;
      const porId = detalle.donacionIdDonacion === donacion.id;
      return porDescripcion || porId;
    });
    
    console.log(`📋 Detalles relacionados encontrados: ${detallesRelacionados.length}`, detallesRelacionados);
    
    // DEBUG: Verificar los estados de cada detalle relacionado
    detallesRelacionados.forEach(detalle => {
      console.log(`🔎 Estado del detalle ${detalle.id}:`, {
        estadoActual: detalle.nombreDonacionEstadoIdDonacionEstado,
        esPendiente: detalle.nombreDonacionEstadoIdDonacionEstado === "Pendiente",
        esPendienteConConstante: detalle.nombreDonacionEstadoIdDonacionEstado === ESTADOS_DONACION.PENDIENTE,
        estadoEsString: typeof detalle.nombreDonacionEstadoIdDonacionEstado,
        estadoLength: detalle.nombreDonacionEstadoIdDonacionEstado?.length
      });
    });
    
    // Filtrar solo los pendientes
    const detallesPendientes = detallesRelacionados.filter(detalle => 
      detalle.nombreDonacionEstadoIdDonacionEstado === "Pendiente"
    );
    
    console.log(`🎯 Detalles pendientes finales: ${detallesPendientes.length}`, detallesPendientes);
    
    setDetallesPendientes(detallesPendientes);
    
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

  // Función para procesar donación y moverla al listado general
  const procesarDonacion = (donacionId: number, nuevoEstado: string, detallesRestantes: number = 0) => {
    setDonaciones(prev => prev.map(donacion => {
      if (donacion.id === donacionId) {
        const tienePendientes = detallesRestantes > 0;
        const estadoFinal = tienePendientes ? ESTADOS_DONACION.PARCIALMENTE_CUMPLIDO : nuevoEstado;
        
        return {
          ...donacion,
          estado: estadoFinal,
          tieneDetallesPendientes: tienePendientes,
          detallesPendientesCount: detallesRestantes,
          procesada: true
        };
      }
      return donacion;
    }));
  };

  // Función para aceptar toda la donación
  const aceptarTodaDonacion = async () => {
    if (!donacionPendiente) return;
    
    setProcesando(true);
    try {
      console.log("✅ Aceptando toda la donación:", donacionPendiente.id);
      
      // Actualizar todos los detalles pendientes
      await Promise.all(
        detallesPendientes.map(async (detalle) => {
          await actualizarEstadoDetalle(detalle.id, ESTADOS_DONACION.CUMPLIDO);
        })
      );
      
      // Procesar la donación
      procesarDonacion(donacionPendiente.id, ESTADOS_DONACION.CUMPLIDO, 0);
      
      alert("Donación aceptada completamente");
      cerrarModalGestion();
    } catch (error) {
      console.error("Error aceptando donación:", error);
      alert("Error al aceptar la donación");
    } finally {
      setProcesando(false);
    }
  };

  // Función para rechazar toda la donación
  const rechazarDonacion = async () => {
    if (!donacionPendiente) return;
    
    if (!confirm("¿Estás seguro de que deseas rechazar esta donación?")) {
      return;
    }
    
    setProcesando(true);
    try {
      console.log("❌ Rechazando donación:", donacionPendiente.id);
      
      // Actualizar todos los detalles pendientes a Cancelado
      await Promise.all(
        detallesPendientes.map(async (detalle) => {
          await actualizarEstadoDetalle(detalle.id, ESTADOS_DONACION.CANCELADO);
        })
      );
      
      // Procesar la donación
      procesarDonacion(donacionPendiente.id, ESTADOS_DONACION.CANCELADO, 0);
      
      alert("Donación rechazada");
      cerrarModalGestion();
    } catch (error) {
      console.error("Error rechazando donación:", error);
      alert("Error al rechazar la donación");
    } finally {
      setProcesando(false);
    }
  };

  // Función para aceptar detalles seleccionados
  const aceptarDetallesSeleccionados = async () => {
    if (!donacionPendiente || detallesSeleccionados.length === 0) return;
    
    setProcesando(true);
    try {
      console.log("✅ Aceptando detalles:", detallesSeleccionados);
      
      // Actualizar detalles seleccionados
      await Promise.all(
        detallesSeleccionados.map(async (detalleId) => {
          await actualizarEstadoDetalle(detalleId, ESTADOS_DONACION.CUMPLIDO);
        })
      );
      
      const detallesRestantes = detallesPendientes.length - detallesSeleccionados.length;
      
      // Procesar la donación
      procesarDonacion(
        donacionPendiente.id, 
        ESTADOS_DONACION.CUMPLIDO, 
        detallesRestantes
      );
      
      alert(`Se aceptaron ${detallesSeleccionados.length} detalles de la donación`);
      cerrarModalGestion();
    } catch (error) {
      console.error("Error aceptando detalles:", error);
      alert("Error al aceptar los detalles seleccionados");
    } finally {
      setProcesando(false);
    }
  };

  // Resto del componente (JSX) se mantiene igual que en tu código original...
  // [El JSX permanece exactamente igual que en tu código original]

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
                          <p className="text-xl font-bold text-green-600">{donacion.monto}</p>
                          <div className="flex flex-col items-end gap-1">
                            <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                              {donacion.detallesPendientesCount} items pendientes
                            </span>
                            <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
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
                          Gestionar Donación ({donacion.detallesPendientesCount} pendientes)
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

          {/* LISTADO DE DONACIONES (incluye las procesadas) */}
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
                          <div className="flex flex-col items-end gap-1">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              TIPOS_DONACIONES.find(t => t.id.toLowerCase() === donacion.tipo.toLowerCase())?.color || 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {donacion.tipo}
                            </span>
                            {/* Mostrar estado de la donación procesada */}
                            {donacion.procesada && (
                              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                donacion.estado === 'Cumplido' 
                                  ? 'bg-green-100 text-green-800'
                                  : donacion.estado === 'Parcialmente Cumplido'
                                  ? 'bg-blue-100 text-blue-800'
                                  : donacion.estado === 'Cancelado'
                                  ? 'bg-red-100 text-red-800'
                                  : donacion.estado === 'En Proceso'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {donacion.estado}
                              </span>
                            )}
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

                      {/* Mostrar información adicional para donaciones procesadas */}
                      {donacion.procesada && donacion.tieneDetallesPendientes && (
                        <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700">
                            <strong>Nota:</strong> Esta donación fue procesada parcialmente. 
                            Aún quedan {donacion.detallesPendientesCount} items pendientes.
                          </p>
                        </div>
                      )}

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
                        {detallesDonacion.map((detalle, index) => (
                          <div key={detalle.id || index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-semibold text-gray-700">
                                Item #{index + 1}
                              </h4>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                detalle.nombreDonacionEstadoIdDonacionEstado === 'Cumplido' 
                                  ? 'bg-green-100 text-green-800'
                                  : detalle.nombreDonacionEstadoIdDonacionEstado === 'Pendiente'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : detalle.nombreDonacionEstadoIdDonacionEstado === 'Cancelado'
                                  ? 'bg-red-100 text-red-800'
                                  : detalle.nombreDonacionEstadoIdDonacionEstado === 'En Proceso'
                                  ? 'bg-yellow-100 text-yellow-800'
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
                  Detalles Pendientes de la Donación
                </h3>
                
                {detallesPendientes.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No hay detalles pendientes para esta donación
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