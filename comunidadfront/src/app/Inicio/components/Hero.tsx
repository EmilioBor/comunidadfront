export default function Hero() {
  return (
    <section className="bg-gray-100 text-center py-20">
      <div className="max-w-3xl mx-auto">
        <img src="/hero.png" alt="Hero" className="mx-auto mb-6 w-40" />
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Construyendo Esperanza
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Juntos cambiamos vidas
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-[#C5E9BE] text-gray-800 px-6 py-3 rounded-lg shadow hover:bg-green-300">
            Donar aquí
          </button>
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600">
            Unite a la comunidad
          </button>
        </div>
      </div>
    </section>
  );
}
