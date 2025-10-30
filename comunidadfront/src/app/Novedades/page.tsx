"use client";

import Cards from "./components/Cards"
import { useEffect, useState } from "react";
import Footer from "../Inicio/components/Footer";
import Navbar from "../Inicio/components/Navbar";

interface Novedad {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  imagenUrl: string;
}

export default function Novedades() {
  const [novedades, setNovedades] = useState<Novedad[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://localhost:7168/api/Novedad/api/v1/agrega/novedad"
        );
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
    <div className="flex flex-col min-h-screen bg-white mt-0 pt-0">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>
        <main className="flex-grow">
        <img
        src="/seccionverde.png"
        alt="Sección Verde"
        className="w-full h-auto object-cover block mt-0 pt-0"
        />
        

        {/* Sección de Novedades */}
        <section className="px-6 md:px-20 py-12">
          <h2 className="text-3xl font-bold mb-8 text-[#34495E]">Novedades</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Cards />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
