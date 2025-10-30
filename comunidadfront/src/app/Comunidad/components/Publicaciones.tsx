const Comunidad_Publicacion = () => {
  return (
    <div className="bg-[#D9D9D9] rounded-2xl p-4 flex flex-col gap-3 w-full">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src="/default-avatar.png"
            alt="Foto perfil"
            className="w-8 h-8 rounded-full object-cover"
          />
          <p className="font-medium text-gray-800">Pedro Perez</p>
        </div>
        <button className="text-gray-600 hover:text-gray-700 text-xl leading-none">⋮</button>
      </div>

      {/* Publicación */}
      <div className="bg-white rounded-2xl p-3">
        <p className="text-sm text-gray-800 mb-3">
          Nueva colaboración con Caritas Argentina La Plata<br />
          Calle 7 entre 79 y 50 n° 883
        </p>
        <img
          src="/comedor.jpg"
          alt="Imagen publicación"
          className="rounded-xl w-full object-cover"
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3">
        <button className="bg-[#7DB575] text-white px-6 py-1 rounded-full hover:bg-green-600 transition">
          Donar
        </button>
        <button className="bg-[#7DB575] text-white px-6 py-1 rounded-full hover:bg-green-600 transition">
          Chat
        </button>
      </div>
    </div>
  );
};

export default Comunidad_Publicacion;
