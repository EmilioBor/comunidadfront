export default function QuienesSomos() {
  return (
    <section id="quienes" className="bg-blue-100 py-16 px-8">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          ¿Quiénes somos?
        </h2>
        <p className="text-lg text-gray-700 mb-8">
            Somos Comunidad Solidaria una plataforma que facilita la ayuda a quienes desean
            contribuir mediante donaciones de bienes o servicios. Nos enfocamos en conectar
            a usuarios dispuestos a colaborar con personas y sectores vulnerables, creando 
            una red solidaria que visibiliza y satisface necesidades en la comunidad
        </p>
        <img src="/quienes.png" alt="Quienes somos" className="mx-auto w-80" />
      </div>
    </section>
  );
}
