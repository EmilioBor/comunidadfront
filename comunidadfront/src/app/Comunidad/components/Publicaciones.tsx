// app/Comunidad/components/Publicaciones.tsx
'use client';

import { useEffect, useState, useRef } from "react";
import { obtenerPublicaciones } from "../actions";
import CrearPublicacion from "./CrearPublicacion";
import Link from "next/link";

interface Publicacion {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  fechaCreacion: string;
  nombreLocalidadIdLocalidad: string;
  nombrePerfilIdPerfil: string;
  nombrePublicacionTipoIdPublicacionTipo: string;
  nombreDonacionIdDonacion: string;
}

export default function Perfil() {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [selectedTipo, setSelectedTipo] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const loadPublicaciones = async () => {
    try {
      setLoading(true);
      const pubs = await obtenerPublicaciones();
      setPublicaciones(pubs);
    } catch (error) {
      console.error("Error cargando publicaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublicaciones();
  }, []);

  const handleNuevaPublicacion = (pub: Publicacion) => {
    setPublicaciones(prev => [pub, ...prev]);
  };

  const toggleMenu = (publicacionId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir que el evento llegue al document
    setMenuAbierto(menuAbierto === publicacionId ? null : publicacionId);
  };

  const cerrarMenu = () => {
    setMenuAbierto(null);
  };

  // Cerrar menú al hacer click fuera de él - CORREGIDO
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAbierto(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-[#D9D9D9] p-4 rounded-2xl flex flex-col gap-4">
        <h1 className="font-semibold text-black text-xl text-center mb-4">Publicaciones</h1>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando publicaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#D9D9D9] p-4 rounded-2xl flex flex-col gap-4">
      <h1 className="font-semibold text-black text-xl text-center mb-4">Publicaciones</h1>

      {/* Filtros */}
      <div className="flex justify-center gap-3 mb-4">
        <button onClick={() => setSelectedTipo('Donacion')} className="bg-[#7DB575] text-white px-4 py-2 rounded-full hover:bg-green-600 transition">Donación</button>
        <button onClick={() => setSelectedTipo('Servicio')} className="bg-[#7DB575] text-white px-4 py-2 rounded-full hover:bg-green-600 transition">Servicio</button>
        <button onClick={() => setSelectedTipo('Pedido')} className="bg-[#7DB575] text-white px-4 py-2 rounded-full hover:bg-green-600 transition">Pedido</button>
      </div>

      {/* Lista de publicaciones */}
      {publicaciones
        .filter(pub => !selectedTipo || pub.nombrePublicacionTipoIdPublicacionTipo === selectedTipo)
        .map(pub => (
          <div key={pub.id} className="bg-white rounded-2xl p-4 mb-4 border border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-xs text-gray-600">?</span>
                </div>
                <p className="font-medium text-black cursor-pointer">
                  {pub.nombrePerfilIdPerfil}
                </p>
              </div>
              
              {/* Menú de tres puntos - CORREGIDO */}
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={(e) => toggleMenu(pub.id, e)}
                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-full transition-all duration-200 text-xl leading-none flex items-center justify-center w-8 h-8"
                  title="Opciones"
                >
                  ⋮
                </button>
                
                {/* Menú desplegable */}
                {menuAbierto === pub.id && (
                  <div 
                    className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[150px] animate-in fade-in-0 zoom-in-95 duration-200"
                  >
                    <Link 
                      href={`/Reporte?publicacionId=${pub.id}`}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded text-sm text-black transition-colors duration-150"
                      onClick={cerrarMenu}
                    >
                      <span>Reportar...</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <h3 className="font-bold text-xl mb-2 text-black">{pub.titulo}</h3>
            <p className="text-sm text-black mb-3">{pub.descripcion}</p>
            <p className="text-xs text-gray-500 mb-3">Fecha: {new Date(pub.fechaCreacion).toLocaleDateString()}</p>
            <p className="text-xs text-gray-500 mb-3">Localidad: {pub.nombreLocalidadIdLocalidad}</p>
            <img 
              src={`data:image/jpeg;base64,${pub.imagen}`} 
              alt="Imagen publicación" 
              className="rounded-xl w-full object-cover mb-3 max-h-64" 
            />

            <div className="flex justify-end gap-3">
              <button className="bg-[#7DB575] text-white px-6 py-1 rounded-full hover:bg-green-600 transition">Donar</button>
              <button className="bg-[#7DB575] text-white px-6 py-1 rounded-full hover:bg-green-600 transition">Chat</button>
            </div>
          </div>
      ))}
    </div>
  );
}