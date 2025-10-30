const CrearPublicacion = () => {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="font-semibold text-lg mb-2">Crear Publicación</h2>
      <textarea
        placeholder="Escribe tu publicación..."
        className="w-full border rounded-lg p-2 mb-2"
      />
      <div className="flex justify-between">
        <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300">
          Agregar Foto
        </button>
        <button className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700">
          Publicar
        </button>
      </div>
    </div>
  );
};
export default CrearPublicacion;
