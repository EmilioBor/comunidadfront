"use client";

import { useEffect, useState } from "react";
import { obtenerPublicaciones } from "../actions"; // Asegúrate de que esta función esté en el archivo correcto
import { obtenerPerfilNombre } from "../actions"; // Función que obtiene los datos del perfil
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";


interface Publicacion {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  fechaCreacion: string;
  nombreLocalidadIdLocalidad: string;
  nombrePerfilIdPerfil: string; // ID del perfil que publicó
  nombrePublicacionTipoIdPublicacionTipo: string;
  nombreDonacionIdDonacion: string;
  perfilData?: {
    razonSocial: string;
    imagen: string;
  };
}

export default function Perfil() {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [selectedTipo, setSelectedTipo] = useState<string>(''); // Tipo de publicación seleccionado
  const router = useRouter();

  
const pathname = usePathname();

useEffect(() => {
  const load = async () => {
    const pubs = await obtenerPublicaciones();
    
    for (let pub of pubs) {
      const perfilData = await obtenerPerfilNombre(pub.nombrePerfilIdPerfil);
      pub.perfilData = perfilData;
    }

    setPublicaciones(pubs);
  };

  load();
}, [pathname]);

  // Filtrar las publicaciones por tipo
  const handleTipoChange = (tipo: string) => {
    setSelectedTipo(tipo);
  };

  if (!publicaciones.length) {
    return <p className="text-center mt-10 text-lg">Cargando publicaciones...</p>;
  }

  return (
    <div className="bg-[#D9D9D9] p-4 rounded-2xl flex flex-col gap-4">
      <h1 className="font-semibold text-black text-xl text-center mb-4">Publicaciones</h1>
      
      {/* Botones de filtro */}
      <div className="flex justify-center gap-3 mb-4">
        <button
          onClick={() => handleTipoChange('Donacion')}
          className="bg-[#7DB575] text-white px-4 py-2 rounded-full hover:bg-green-600 transition"
        >
          Donación
        </button>
        <button
          onClick={() => handleTipoChange('Servicio')}
          className="bg-[#7DB575] text-white px-4 py-2 rounded-full hover:bg-green-600 transition"
        >
          Servicio
        </button>
        <button
          onClick={() => handleTipoChange('Pedido')}
          className="bg-[#7DB575] text-white px-4 py-2 rounded-full hover:bg-green-600 transition"
        >
          Pedido
        </button>
      </div>

      {/* Mostrar las publicaciones filtradas o todas si no se aplica filtro */}
      {publicaciones
        .filter((pub) => !selectedTipo || pub.nombrePublicacionTipoIdPublicacionTipo === selectedTipo)
        .map((pub) => (
          <div key={pub.id} className="bg-white rounded-2xl p-4 mb-4 border border-gray-300">
            {/* Encabezado con el nombre y la imagen del autor de la publicación */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={`data:image/jpeg;base64,${pub.perfilData?.imagen}`}
                  alt="Imagen del autor"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <p
                  className="font-medium text-black cursor-pointer"
                  onClick={() => window.location.href = "/Perfil"}
                >
                  {pub.perfilData?.razonSocial || 'Autor Desconocido'}
                </p>
              </div>
              <div className="relative group">
                <button className="text-gray-600 hover:text-gray-700 text-xl leading-none">
                  ⋮
                </button>
                <div className="absolute hidden text-black group-hover:block bg-white border p-2 rounded-md">
                  <p>Reportar publicación</p>
                </div>
              </div>
            </div>

            {/* Contenido de la publicación */}
            <h3 className="font-bold text-xl mb-2 text-black">{pub.titulo}</h3>
            <p className="text-sm text-black mb-3">{pub.descripcion}</p>

            {/* Mostrar la fecha de creación y la localidad */}
            <p className="text-xs text-gray-500 mb-3">Fecha: {new Date(pub.fechaCreacion).toLocaleDateString()}</p>
            <p className="text-xs text-gray-500 mb-3">Localidad: {pub.nombreLocalidadIdLocalidad}</p>

            <img
              src={`data:image/jpeg;base64,${pub.imagen}`}
              alt="Imagen publicación"
              className="rounded-xl w-full object-cover mb-3"
            />

            {/* Botones de interacción */}
            <div className="flex justify-end gap-3">
              <button className="bg-[#7DB575] text-white px-6 py-1 rounded-full hover:bg-green-600 transition">
                Donar
              </button>
              <button className="bg-[#7DB575] text-white px-6 py-1 rounded-full hover:bg-green-600 transition">
                Chat
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}
