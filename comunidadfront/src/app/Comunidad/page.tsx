"use client";

import Navbar from "../Inicio/components/Navbar";
import Footer from "../Inicio/components/Footer";
import Comunidad_Publicacion from "./components/Publicaciones";
import SidebarPerfil from "./components/SidebarPerfil";
import CrearPublicacion from "./components/CrearPublicacion";
import Sponsor from "./components/SidebarSponsor";

export default function Comunidad() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar fijo */}
      <div className="fixed top-0 left-0 w-full z-50">
        {/* <Navbar /> */}
      </div>

      {/* Contenido principal */}
      <main className="flex-grow mt-20 px-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar izquierdo - Perfil */}
          <div className="col-span-2">
            <div className="sticky top-20">
              <SidebarPerfil />
            </div>
          </div>

          {/* Feed central */}
          <div className="col-span-8 flex flex-col gap-6">
            <div className="max-w-3xl mx-auto w-full">
              <CrearPublicacion />
            </div>
            <div className="max-w-3xl mx-auto w-full">
              <Comunidad_Publicacion />
            </div>
          </div>

          {/* Sidebar derecho - Sponsor */}
          <div className="col-span-2">
            <div className="sticky top-28">
              <div className="flex flex-col justify-between h-[calc(100vh-8rem)]">
                <Sponsor />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
