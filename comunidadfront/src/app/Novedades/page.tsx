"use client";

import { useEffect, useState } from "react";
import Navbar from "../Inicio/components/Navbar";
import Footer from "../Inicio/components/Footer";
import Cards from "./components/Cards";

interface Novedad {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  nombrePerfilIdPerfil: string;
  imagen: string;
}

export default function Novedades() {
  const [novedades, setNovedades] = useState<Novedad[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://localhost:7168/api/Novedad/api/v1/agrega/novedad");
        if (!res.ok) throw new Error("Error al obtener novedades");
        const data = await res.json();
        setNovedades(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

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
            {novedades.map((novedad) => (
              <Cards key={novedad.id} novedad={novedad} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
