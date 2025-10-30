import Navbar from "../Inicio/components/Navbar";
import Footer from "../Inicio/components/Footer";
import Comunidad_Publicacion from "./components/Publicaciones";
import SidebarPerfil from "./components/SidebarPerfil";
import CrearPublicacion from "./components/CrearPublicacion";
import Sponsor from "./components/Sponsor";

export default function Comunidad() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar fijo */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Contenido principal */}
      <main className="flex-grow mt-20 px-6">
        <div className="grid grid-cols-12 gap-4">
          {/* Columna 1: Perfil */}
          <div className="col-span-2 sticky top-24 h-fit">
            <SidebarPerfil />
          </div>

          {/* Columna 2: Crear publicación */}
          <div className="col-span-3 sticky top-24 h-fit">
            <CrearPublicacion />
          </div>

          {/* Columna 3: Publicaciones */}
          <div className="col-span-5">
            <Comunidad_Publicacion />
          </div>

          {/* Columna 4: Sponsor */}
          <div className="col-span-2 sticky top-24 h-fit">
            <Sponsor />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
