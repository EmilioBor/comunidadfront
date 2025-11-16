"use client";

import { useEffect, useState } from "react";
import Footer from "../Inicio/components/Footer";
import Navbar from "../Inicio/components/Navbar";
import { obtenerNovedades } from "./action";
import Link from "next/link";

interface Novedad {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  imagen: string;
}

export default function Novedades() {
  const [novedades, setNovedades] = useState<Novedad[]>([]);

  useEffect(() => {
    const cargarNovedades = async () => {
      try {
        const res = await obtenerNovedades();
        setNovedades(res);
      } catch (err) {
        console.error(err);
      }
    };
    cargarNovedades();
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
            {novedades.map((novedad) => (
              <div
                key={novedad.id}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
              >
                <img
                  src={`data:image/jpeg;base64,${novedad.imagen}`}
                  alt={novedad.titulo}
                  className="w-full h-[200px] object-cover"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-[#2c3e50] mb-2">
                    {novedad.titulo}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(novedad.fecha).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>

                  <Link
                    href={`/Novedades/${novedad.id}`}
                    className="mt-4 bg-red-600 text-white text-sm px-4 py-2 rounded hover:bg-red-700 self-start"
                  >
                    Leer más
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}