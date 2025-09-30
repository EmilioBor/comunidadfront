import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Colaborar from "./components/Colaborar";
import Donaciones from "./components/Donaciones";
import QuienesSomos from "./components/QuienesSomos";
import Footer from "./components/Footer";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <Colaborar />
      <section className="bg-white py-8">
        
        {/* Ajustamos el estilo del párrafo:
          1. 'max-w-4xl mx-auto' centra el párrafo y limita su ancho.
          2. 'text-center' centra el texto dentro del párrafo.
          3. 'text-2xl' para hacerlo más grande y visible.
          4. 'text-black' para un negro puro y 'font-normal' (o sin él) 
             para el peso normal, como se ve en el mockup.
          5. 'px-4 sm:px-8' para un padding horizontal para que no se pegue.
        */}
        <p className="max-w-5xl mx-auto px-4 sm:px-8 text-center text-3xl text-black font-normal leading-relaxed">
          Gracias a tu ayuda, ofrecemos atención a personas y organizaciones dedicadas a respaldar a los sectores más vulnerables de la sociedad. Además, creamos un espacio donde personas y empresas pueden comunicar sus necesidades, y brindamos una plataforma para quienes desean realizar donaciones, ya sean monetarias o de otros tipos de recursos.
        </p>
      </section>
      <Donaciones />
      <QuienesSomos />
      <Footer />
    </main>
  );
}
