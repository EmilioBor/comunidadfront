interface NovedadProps {
  novedad: {
    id: number;
    titulo: string;
    descripcion: string;
    fecha: string;
    nombrePerfilIdPerfil: string;
    imagen: string;
  };
}

export default function Cards({ novedad }: NovedadProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col transition-transform hover:scale-105">
        <h1>HOLA MUNDO</h1>
      <img
        src={novedad.imagen || "/placeholder.png"}
        alt={novedad.titulo}
        className="w-full h-52 object-cover"
      />
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-2 text-[#2c3e50]">
          {novedad.titulo}
        </h3>
        <p className="text-gray-700 text-sm flex-grow">
          {novedad.descripcion.length > 120
            ? `${novedad.descripcion.substring(0, 120)}...`
            : novedad.descripcion}
        </p>
        <p className="text-xs text-gray-500 mt-3">{novedad.fecha}</p>
        <button className="mt-4 bg-[#b30000] text-white py-2 px-4 rounded-md self-start hover:bg-[#8a0000] transition">
          Leer más
        </button>
      </div>
    </div>
  );
}
