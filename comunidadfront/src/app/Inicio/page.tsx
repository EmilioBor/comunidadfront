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
      <section className="px-8 py-12 text-center max-w-4xl mx-auto">
        <p className="text-lg text-gray-700">
          Gracias a tu ayuda, ofrecemos atención a personas y organizaciones
          dedicadas a respaldar a los sectores más vulnerables de la sociedad.
          Además, creamos un espacio donde personas y empresas pueden comunicar
          sus necesidades, y brindamos una plataforma para quienes desean
          realizar donaciones, ya sean monetarias o de otros tipos de recursos.
        </p>
      </section>
      <Donaciones />
      <QuienesSomos />
      <Footer />
    </main>
  );
}
