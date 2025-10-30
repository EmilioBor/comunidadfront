const SidebarPerfil = () => {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="font-semibold text-lg mb-2">Mi Perfil</h2>
      <div className="flex flex-col items-center">
        <img
          src="/default-avatar.png"
          alt="Foto perfil"
          className="w-24 h-24 rounded-full mb-3"
        />
        <p className="font-medium">Pedro Pérez</p>
        <button className="mt-3 bg-green-600 text-white px-4 py-1 rounded-xl hover:bg-green-700">
          Donaciones
        </button>
      </div>
    </div>
  );
};
export default SidebarPerfil;
