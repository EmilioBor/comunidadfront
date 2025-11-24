import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Colaborar from "./components/Colaborar";
import Donaciones from "./components/Donaciones";
import QuienesSomos from "./components/QuienesSomos";
import Footer from "./components/Footer";
import Contactanos from "./components/Contactanos";



export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      <div className="fixed top-0 left-0 w-full z-50">
        
      </div>
      <Hero />
      <Colaborar />
      <section className="bg-white py-8">
        <p className="max-w-5xl mx-auto px-4 sm:px-8 text-center text-3xl text-black font-normal leading-relaxed">
          Gracias a tu ayuda, ofrecemos atención a personas y organizaciones dedicadas a respaldar a los sectores más vulnerables de la sociedad. Además, creamos un espacio donde personas y empresas pueden comunicar sus necesidades, y brindamos una plataforma para quienes desean realizar donaciones, ya sean monetarias o de otros tipos de recursos.
        </p>
      </section>
      <Donaciones />
      <QuienesSomos />
      <Contactanos />
      <Footer />
    </main>
  );
}
