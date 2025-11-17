'use client';

import { useEffect, useState } from "react";
import { obtenerPublicaciones, obtenerPerfilNombre } from "../actions";
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
  perfilData?: {
    razonSocial: string;
    imagen: string;
  };
}

export default function Perfil() {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [selectedTipo, setSelectedTipo] = useState<string>('');

  const loadPublicaciones = async () => {
    const pubs = await obtenerPublicaciones();
    for (let pub of pubs) {
      const perfilData = await obtenerPerfilNombre(pub.nombrePerfilIdPerfil);
      pub.perfilData = perfilData;
    }
    setPublicaciones(pubs);
  };

  useEffect(() => {
    loadPublicaciones();
  }, []);

  // 🚀 Esta función se pasa a CrearPublicacion
  const handleNuevaPublicacion = (pub: Publicacion) => {
    setPublicaciones(prev => [pub, ...prev]); // se agrega al inicio
  };

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
                <img src={`data:image/jpeg;base64,${pub.perfilData?.imagen}`} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                <p className="font-medium text-black cursor-pointer">{pub.perfilData?.razonSocial || 'Autor Desconocido'}</p>
              </div>
              <div className="relative group">
                <button className="text-gray-600 hover:text-gray-700 text-xl leading-none">⋮</button>
                <div className="absolute right-0 hidden group-hover:block bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[150px]">
                  <Link 
                    href={`/Reporte?publicacionId=${pub.id}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Reportar publicación
                  </Link>
                </div>
              </div>
            </div>

            <h3 className="font-bold text-xl mb-2 text-black">{pub.titulo}</h3>
            <p className="text-sm text-black mb-3">{pub.descripcion}</p>
            <p className="text-xs text-gray-500 mb-3">Fecha: {new Date(pub.fechaCreacion).toLocaleDateString()}</p>
            <p className="text-xs text-gray-500 mb-3">Localidad: {pub.nombreLocalidadIdLocalidad}</p>
            <img src={`data:image/jpeg;base64,${pub.imagen}`} alt="Imagen publicación" className="rounded-xl w-full object-cover mb-3" />

            <div className="flex justify-end gap-3">
              <button className="bg-[#7DB575] text-white px-6 py-1 rounded-full hover:bg-green-600 transition">Donar</button>
              <button className="bg-[#7DB575] text-white px-6 py-1 rounded-full hover:bg-green-600 transition">Chat</button>
            </div>
          </div>
      ))}
    </div>
  );
}