const CrearPublicacion = () => {
  return (
    <div className="bg-[#D9D9D9] rounded-2xl p-4 flex flex-col gap-3">
      {/* Cabecera con usuario */}
      <div className="flex items-center gap-3">
        <img
          src="/default-avatar.png"
          alt="Foto perfil"
          className="w-8 h-8 rounded-full object-cover"
        />
        <p className="font-medium text-gray-800">Pedro Perez</p>
      </div>

      {/* Campo de texto */}
      <textarea
        placeholder="Escribe tu publicación..."
        className="w-full bg-transparent text-sm text-[#3E3E3E] resize-none outline-none h-16"
      />

      {/* Botones */}
      <div className="flex justify-end gap-3">
        <button className="bg-[#7DB575] text-white px-4 py-1 rounded-full hover:bg-green-600 transition">
          Agregar Foto
        </button>
        <button className="bg-[#7DB575] text-white px-4 py-1 rounded-full hover:bg-green-600 transition">
          Publicar
        </button>
      </div>
    </div>
  );
};

export default CrearPublicacion;
