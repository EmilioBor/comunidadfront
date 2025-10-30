const SidebarPerfil = () => {
  return (
    <aside className="bg-white rounded-2xl shadow-md overflow-hidden w-full max-w-xs">
      {/* Fondo de color superior */}
      <div className="bg-[#84CEDB] h-40 rounded-t-2xl"></div>

      {/* Contenido del perfil */}
      <div className="flex flex-col items-center -mt-12 pb-6">
        <img
          src="/default-avatar.png"
          alt="Foto perfil"
          className="w-37 h-37 rounded-full object-cover border-4 border-[grey]"
        />
        <p className="mt-3 font-medium text-gray-800">Pedro Perez</p>

        {/* Botones */}
        <div className="mt-4 flex flex-col gap-2 w-4/5">
          <button className="bg-[#7DB575] text-white py-2 rounded-xl hover:bg-green-600 transition">
            Donaciones
          </button>
          <button className="bg-[#7DB575] text-white py-2 rounded-xl hover:bg-green-600 transition">
            Chats
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SidebarPerfil;
