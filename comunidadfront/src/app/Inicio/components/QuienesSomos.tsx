export default function QuienesSomos() {
  return (
    <section id="quienes" className="bg-blue-100 py-16 px-8">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          ¿Quiénes somos?
        </h2>
        <p className="text-lg text-gray-700 mb-8">
          Somos una comunidad que conecta personas y organizaciones con
          necesidades sociales, brindando un espacio seguro para donar y
          colaborar en proyectos solidarios.
        </p>
        <img src="/quienes.png" alt="Quienes somos" className="mx-auto w-80" />
      </div>
    </section>
  );
}
