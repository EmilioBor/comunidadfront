"use client";

import { getNovedades, NewsItem } from './components/actions';
import { useEffect, useState } from "react";
import Navbar from "../Inicio/components/Navbar";
import Footer from "../Inicio/components/Footer";
import Cards from "./components/Cards";

export default async function Novedades() {
  let novedades: NewsItem[] = [];
  try {
    novedades = await getNovedades();
  } catch (err) {
    console.error('Error cargando novedades:', err);
    // en un caso simple, devolvemos arreglo vacío para no romper el render
    novedades = [];
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Novedades</h1>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {novedades.length === 0 ? (
          <p>No hay novedades para mostrar.</p>
        ) : (
          novedades.map((n) => (
            <Cards
              key={n.id}
          imagen={n.imagen}
          titulo={n.titulo}
          fecha={n.fecha}
          descripcion={n.descripcion}
            />
          ))
        )}
      </section>
    </main>
  );
}

export function Novedades() {
  
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <main className="flex-grow mt-[90px]">
        {/* Sección superior */}
        <section className="bg-[#e6f0e6] text-center py-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#2e3b2e]">
            Colaborá con Comunidad Solidaria
          </h2>
          <p className="text-lg text-[#2e3b2e] mt-2">
            Tu solidaridad es esperanza
          </p>
        </section>

        {/* Sección de Novedades */}
        <section className="px-6 md:px-20 py-12">
          <h2 className="text-3xl font-bold mb-8 text-[#34495E]">Novedades</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
