export default function Donaciones() {
  return (
    <section className="py-16 px-16 text-center bg-white">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Selecciona el tipo de donación
      </h2>
      <div className="flex justify-center gap-4">
        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
          Mensual
        </button>
        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
          Por única vez
        </button>
        <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
          Otro tipo
        </button>
      </div>
    </section>
  );
}
