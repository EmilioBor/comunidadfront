import Contactanos from "../components/Contactanos";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Empresas() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Sección de Empresas */}
        <section className="py-16 px-8 md:px-20 bg-white">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl text-gray-800 font-bold mb-6">
                Alianzas con empresas y organizaciones
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                En Comunidad Solidaria promovemos alianzas con organizaciones, empresas e instituciones para que, animadas
                por el sentido de la solidaridad, se involucren, colaboren y se comprometan en la construcción de un mundo
                más justo.
                ¿Cómo colaborar?
                Donaciones corporativas
                Donación de empresas en conjunto con empleados o clientes
                Campañas de redondeo de vuelto
                Especie y productos
                Servicios
                Para más información:Comunicarse a donaciones@comunidadsolidaria.org.ar
                Las empresas y organizaciones que nos acompañan son:

            </p>
            <img
            src="/carrito.png"
            alt="Quienes somos"
            className="w-[full] h-[full] object-cover rounded-lg "
          />
          </div>
        </section>

        
        <Contactanos />
      </main>

      <Footer />
    </div>
  );
}
