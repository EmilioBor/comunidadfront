export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <h3 className="font-bold mb-2">Comunidad Solidaria</h3>
          <p>Conectando corazones y esperanza.</p>
        </div>
        <div>
          <h3 className="font-bold mb-2">Contacto</h3>
          <p>Email: contacto@comunidad.org</p>
          <p>Tel: +54 11 5555-5555</p>
        </div>
        <div>
          <h3 className="font-bold mb-2">Legal</h3>
          <p>Términos y condiciones</p>
          <p>Política de privacidad</p>
        </div>
      </div>
      <div className="text-center mt-6 text-sm">
        © 2025 Comunidad Solidaria. Todos los derechos reservados.
      </div>
    </footer>
  );
}
