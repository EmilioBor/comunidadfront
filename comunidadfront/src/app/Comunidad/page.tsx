"use client";

import Navbar from "../Inicio/components/Navbar";
import Footer from "../Inicio/components/Footer";
import Comunidad_Publicacion from "./components/Publicaciones";
import SidebarPerfil from "./components/SidebarPerfil";
import CrearPublicacion from "./components/CrearPublicacion";
import Sponsor from "./components/SidebarSponsor";
import { useState } from "react";

export default function Comunidad() {
  const [showCrear, setShowCrear] = useState(false);

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

            {/* SECCIÓN CREAR PUBLICACIÓN */}
            <div className="max-w-3xl mx-auto w-full">

              {/* Botón centrado */}
              <button
                onClick={() => setShowCrear(true)}
                className="
                  bg-[#7DB575]
                  text-white 
                  px-6 py-2.5 
                  rounded-full 
                  shadow-sm 
                  hover:bg-green-600 
                  transition-all 
                  font-medium
                  flex items-center gap-2 mx-auto
                "
              >
                Nueva publicación
              </button>

              {/* Modal */}
              {showCrear && (
                <div
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex justify-center items-center px-4"
                  onClick={() => setShowCrear(false)}
                >
                  {/* Ventana emergente */}
                  <div
                    className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6 relative animate-[pop_0.25s_ease]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Botón de cierre */}
                    <button
                      onClick={() => setShowCrear(false)}
                      className="
                        absolute -top-3 -right-3
                        bg-gray-600 text-white
                        w-8 h-8 rounded-full 
                        flex items-center justify-center
                        hover:bg-gray-700 
                        transition
                        shadow-md
                      "
                  >
                    X
                    </button>

                    <CrearPublicacion />
                  </div>
                </div>
              )}

            </div>

            {/* Publicaciones */}
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