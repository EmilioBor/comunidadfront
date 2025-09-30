export default function Contactanos() {
  return (
    <section className="bg-white py-16 px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        {/* Texto */}
        <div className="text-left text-gray-800 space-y-3">
          <h2 className="text-2xl font-semibold mb-4">Consultas:</h2>

          <div>
            <h3 className="font-medium">Donaciones de dinero:</h3>
            <p>De lunes a viernes de 9 a 17hs</p>
            <p>+54 2314 529935</p>
            <p>donaciones@comunidadsolidaria.org.ar</p>
          </div>

          <div className="mt-4">
            <h3 className="font-medium">Otro tipo de donaciones o consultas:</h3>
            <p>(011) 6091-0300 de lunes a viernes de 9 a 17hs</p>
          </div>

          <div className="mt-6 text-sm leading-relaxed">
            <p>Comunidad Solidaria Comisión Nacional</p>
            <p>Entidad sin fines de lucro</p>
            <p>Certificado de Exención en el <br></br>Impuesto a las Ganancias Nº 112023075541</p>
            <p>CUIT 30-51731290-4</p>
          </div>
        </div>

        {/* Imagen */}
        <div className="flex justify-center">
          <img
            src="/corazon.png"
            alt="Contactanos"
            className="w-[350px] h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
}
