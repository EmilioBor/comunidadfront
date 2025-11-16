'use client';
import React, { useEffect, useState } from 'react';

// Simulamos las funciones de acción (en producción serían importadas de un archivo externo)
const obtenerPublicacionTipo = (tipo: string) => {
  // Lógica para obtener publicaciones filtradas por tipo
  console.log(`Filtrando publicaciones por tipo: ${tipo}`);
  // Llamada a API para obtener publicaciones filtradas
};

const obtenerPublicaciones = async () => {
  // Simulamos la llamada a la API para obtener todas las publicaciones
  return [
    {
      id: 0,
      titulo: 'Nueva colaboración con Caritas Argentina La Plata',
      descripcion: 'Calle 4 entre 49 y 50 n° 883',
      imagen: '/comedor.jpg',
      fechaCreacion: '2025-11-16T19:38:05.889Z',
      nombreLocalidadIdLocalidad: 'La Plata',
      nombrePerfilIdPerfil: 'Pedro Perez',
      nombrePublicacionTipoIdPublicacionTipo: 'Donacion',
      nombreDonacionIdDonacion: '1',
    },
  ];
};

const obtenerPerfilNombre = async (razonSocial: string) => {
  // Simulamos la llamada a la API para obtener el perfil
  return {
    razonSocial: 'Pedro Perez',
    imagen: '/default-avatar.png',
  };
};

const Comunidad_Publicacion = () => {
  const [publicaciones, setPublicaciones] = useState<any[]>([]);
  const [perfil, setPerfil] = useState<any>({});
  const [selectedTipo, setSelectedTipo] = useState<string>('Donacion'); // Estado para tipo de publicación seleccionado

  // Obtén las publicaciones al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      const publicacionesData = await obtenerPublicaciones();
      setPublicaciones(publicacionesData);
      // Cargar el perfil de la primera publicación (deberías modificar esto si es necesario)
      const perfilData = await obtenerPerfilNombre(publicacionesData[0].nombrePerfilIdPerfil);
      setPerfil(perfilData);
    };
    fetchData();
  }, []);

  // Filtrar publicaciones por tipo
  const handleTipoChange = (tipo: string) => {
    setSelectedTipo(tipo);
    obtenerPublicacionTipo(tipo);
  };

  return (
    <div className="bg-[#D9D9D9] rounded-2xl p-4 flex flex-col gap-3 w-full">
      {/* Botones de filtro */}
      <div className="flex gap-3 mb-4">
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

      {/* Publicaciones */}
      {publicaciones
        .filter((pub) => pub.nombrePublicacionTipoIdPublicacionTipo === selectedTipo)
        .map((publicacion) => (
          <div key={publicacion.id} className="bg-white rounded-2xl p-3 mb-4">
            {/* Encabezado */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img
                  src={perfil.imagen || '/default-avatar.png'}
                  alt="Foto perfil"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <p
                  className="font-medium text-gray-800 cursor-pointer"
                  onClick={() => window.location.href = "/Perfil"}
                >
                  {perfil.razonSocial}
                </p>
              </div>
              {/* Tres puntos para reportar publicación */}
              <div className="relative group">
                <button className="text-gray-600 hover:text-gray-700 text-xl leading-none">
                  ⋮
                </button>
                <div className="absolute hidden group-hover:block bg-white border p-2 rounded-md">
                  <p>Reportar publicación</p>
                </div>
              </div>
            </div>

            {/* Publicación */}
            <div className="mt-3">
              <p className="text-sm text-gray-800 mb-3">
                {publicacion.titulo}<br />
                {publicacion.descripcion}
              </p>
              <img
                src={publicacion.imagen}
                alt="Imagen publicación"
                className="rounded-xl w-full object-cover"
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 mt-3">
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
};

export default Comunidad_Publicacion;
