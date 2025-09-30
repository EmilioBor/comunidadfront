import Contactanos from "../components/Contactanos";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

// Asumo que el componente Contactanos manejará la información de contacto y el corazón
// Para la cabecera verde de "Empresas y Organizaciones" usaremos un div simple.

export default function Empresas() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <main className="flex-grow">
        {/* Cabecera con fondo verde, similar al mockup */}
        <img
        src="/seccionazulempresa.png"
        alt="Sección Verde"
        className="w-full h-auto object-cover block mt-0 pt-0"
        />
        <section className="py-8 px-8 md:px-20 bg-white">
          <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl md:text-3xl text-gray-800 font-bold mb-8">
                    Alianzas con empresas y organizaciones
                </h2>
                <p className="text-lg text-gray-700 mb-8 max-w-4xl">
                    En Comunidad Solidaria promovemos alianzas con organizaciones, empresas e instituciones para que, animadas
                    por el sentido de la solidaridad, se involucren, colaboren y se comprometan en la construcción de un mundo
                    más justo.
                </p>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                    ¿Cómo colaborar?
                </h3>
                <ul className="list-disc list-outside ml-5 text-lg text-gray-700 mb-8 space-y-2">
                    <li>Donaciones corporativas</li>
                    <li>Donación de empresas en conjunto con empleados o clientes</li>
                    <li>Campañas de redondeo de vuelto</li>
                    <li>Especie y productos</li>
                    <li>Servicios</li>
                </ul>

                {/* Subtítulo Para más información y Email */}
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                Para más información
                </h3>
                <p className="text-lg text-gray-700 mb-8">
                Comunicarse a <a href="mailto:donaciones@comunidadsolidaria.org.ar" className="text-green-600 hover:text-green-700 font-medium">donaciones@comunidadsolidaria.org.ar</a>
                </p>

                {/* Subtítulo de Logos */}
                <h3 className="text-lg font-bold text-gray-800 mb-6">
                Las empresas y organizaciones que nos acompañan son:
                </h3>

                <img
                src="/carrito.png"
                alt="Quienes somos"
                className="w-[full]] h-[full] object-cover rounded-lg "
            />
          </div>
        </section>

        <Contactanos /> 
      </main>

      <Footer />
    </div>
  );
}