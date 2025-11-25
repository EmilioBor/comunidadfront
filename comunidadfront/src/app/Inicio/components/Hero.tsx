"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Contenedor Principal */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center h-full relative z-10 px-4 sm:px-8">
        
        {/* Texto */}
        <div className="md:w-1/2 text-left mb-12 md:mb-0">
          <h1 className="text-4xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
            Construyendo esperanza,
            <br />
            <span>juntos cambiamos vidas ♥</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-md">
            Un espacio donde cada aporte cuenta. Haz una diferencia hoy y ayuda a transformar vidas.
          </p>

          <div className="flex gap-4">
            {/* Botón Donar */}
            <Link
              href="/Donacion/ComunidadSolidaria"
              className="bg-[#C5E9BE] text-gray-800 px-6 py-3 border border-[#C5E9BE] rounded-lg shadow-md hover:bg-green-300 transition duration-300"
            >
              Donar aquí
            </Link>
            

            {/* Link con estilo de botón */}
            <Link
              href="/login"
              className="bg-transparent text-gray-800 px-6 py-3 border border-gray-400 rounded-lg shadow-md hover:bg-gray-100 transition duration-300 text-center"
            >
              Unite a la Comunidad
            </Link>
          </div>
        </div>

        {/* Imagen */}
        <div className="flex object-right md:justify-end h-full">
          <img
            src="/hero.png"
            alt="Manos de colores con corazones simbolizando solidaridad"
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>
    </section>
  );
}
