export default function QuienesSomos() {
  return (
    <section
      id="quienes"
      className="relative w-full"
    >
      {/* Imagen de fondo superior */}
      <div className="absolute top-0 left-0 w-full">
        <img
          src="/seccionazularriba.png"
          alt="Fondo superior"
          className="w-full object-cover"
        />
      </div>

      {/* Contenido central */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Quienes somos
        </h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-12">
          Somos Comunidad Solidaria una plataforma que facilita la ayuda a quienes desean
          contribuir mediante donaciones de bienes o servicios. Nos enfocamos en conectar
          a usuarios dispuestos a colaborar con personas y sectores vulnerables, creando
          una red solidaria que visibiliza y satisface necesidades en la comunidad
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24">
          <img
            src="/quienes.png"
            alt="Quienes somos"
            className="w-[350px] h-[250px] object-cover rounded-lg shadow-md"
          />
          <img
            src="/somos.png"
            alt="Solidaridad"
            className="w-[350px] h-[250px] object-cover rounded-lg shadow-md"
          />
        </div>
      </div>

      {/* Imagen de fondo inferior */}
      <div className="absolute bottom-0 left-0 w-full">
        <img
          src="/seccionazulbajo.png"
          alt="Fondo inferior"
          className="w-full object-cover"
        />
      </div>
    </section>
  );
}
