export default function QuienesSomos() {
  return (
    <section id="quienes" className="bg-[#D4F0F0] py-16 px-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Quienes somos
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Somos Comunidad Solidaria una plataforma que facilita la ayuda a quienes desean
            contribuir mediante donaciones de bienes o servicios. Nos enfocamos en conectar
            a usuarios dispuestos a colaborar con personas y sectores vulnerables, creando 
            una red solidaria que visibiliza y satisface necesidades en la comunidad
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-60">
          <img
            src="/quienes.png"
            alt="Quienes somos"
            className="w-[400px] h-[300px] object-cover rounded-lg shadow-md"
          />
          <img
            src="/somos.png"
            alt="Quienes somos"
            className="w-[400px] h-[300px] object-cover rounded-lg shadow-md"
          />
        </div>
      </div>
    </section>
  );
}
