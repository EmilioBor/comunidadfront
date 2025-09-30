export default function Terminos() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Contenedor Principal */}
      <div className="max-w-5xl mx-auto flex flex-col items-center h-full relative z-10 px-4 sm:px-8 py-16">
        
        {/* Título */}
        <h1 className="text-4xl md:text-3xl lg:text-4xl font-extrabold text-black mb-6 text-center">
          Términos y Condiciones
        </h1>
        <p className="text-sm text-gray-500 mb-12 text-center">
          Última actualización: 30 de septiembre de 2025
        </p>

        {/* Contenido */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-black mb-2">1. Introducción</h2>
            <p className="text-gray-700 leading-relaxed">
              Bienvenido a <span className="font-semibold">Comunidad Solidaria</span>. 
              Al acceder o utilizar nuestro sitio web, servicios o aplicaciones, 
              aceptas cumplir y estar sujeto a los presentes Términos y Condiciones. 
              Si no estás de acuerdo, te recomendamos no utilizar nuestra plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-2">2. Uso del servicio</h2>
            <p className="text-gray-700 leading-relaxed">
              La plataforma tiene como finalidad conectar a personas que deseen donar 
              objetos, ropa, alimentos, muebles o dinero con aquellas que los necesitan. 
              El uso indebido, fraudulento o con fines comerciales no autorizados está 
              prohibido y puede conllevar la suspensión de tu cuenta.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-2">3. Registro de usuario</h2>
            <p className="text-gray-700 leading-relaxed">
              Para acceder a determinadas funciones, deberás registrarte como usuario. 
              Te comprometes a proporcionar información veraz, completa y actualizada. 
              Eres responsable de mantener la confidencialidad de tus credenciales 
              y de todas las actividades que ocurran bajo tu cuenta.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-2">4. Donaciones</h2>
            <p className="text-gray-700 leading-relaxed">
              Las donaciones realizadas a través de la plataforma se consideran actos 
              voluntarios y altruistas. No garantizamos beneficios económicos, fiscales 
              ni contraprestaciones a cambio de las mismas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-2">5. Responsabilidades</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
              <li>
                La plataforma actúa únicamente como nexo entre donantes y receptores.
              </li>
              <li>
                No nos responsabilizamos por la calidad, estado o entrega de los objetos donados.
              </li>
              <li>
                Los usuarios deben actuar de buena fe y cumplir con las leyes aplicables.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-2">6. Privacidad y protección de datos</h2>
            <p className="text-gray-700 leading-relaxed">
              Nos comprometemos a proteger tu información personal de acuerdo con 
              nuestra{" "}
              <a href="/privacidad" className="text-green-700 font-medium underline hover:text-green-800">
                Política de Privacidad
              </a>. 
              Al usar el servicio, aceptas el tratamiento de tus datos según lo establecido en dicha política.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-2">7. Propiedad intelectual</h2>
            <p className="text-gray-700 leading-relaxed">
              Todos los contenidos, marcas, logotipos, diseños e información disponibles 
              en la plataforma son propiedad de <span className="font-semibold">Comunidad Solidaria</span> 
              o de sus licenciantes, y están protegidos por la normativa vigente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-2">8. Modificaciones</h2>
            <p className="text-gray-700 leading-relaxed">
              Nos reservamos el derecho de actualizar o modificar estos Términos y Condiciones 
              en cualquier momento. Las modificaciones serán publicadas en esta misma página, 
              y el uso continuado de la plataforma implica la aceptación de los cambios.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-black mb-2">9. Contacto</h2>
            <p className="text-gray-700 leading-relaxed">
              Si tienes preguntas o inquietudes sobre estos Términos y Condiciones, 
              puedes contactarnos al correo:{" "}
              <a href="mailto:comunidadsolidaria@gmail.com" className="text-green-700 font-medium underline hover:text-green-800">
                comunidadsolidaria@gmail.com
              </a>.
            </p>
          </section>
        </div>

        {/* Botón */}
        <div className="mt-10 flex gap-4">
          <a
            href="/Inicio"
            className="bg-[#C5E9BE] text-gray-800 px-6 py-3 border border-[#C5E9BE] rounded-lg shadow-md hover:bg-green-300 transition duration-300"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </section>
  );
}
