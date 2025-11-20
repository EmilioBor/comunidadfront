'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../Inicio/components/Navbar';
import Footer from '../../Inicio/components/Footer';
import { obtenerNovedadPorId } from "./action";
import Link from "next/link";

interface Novedad {
  id?: number;
  titulo: string;
  imagen?: string | null;
  fecha: string;
  descripcion: string;
  [key: string]: any;
}

export default function DetalleNovedadCliente() {
  const params = useParams();
  const id = params?.Id as string | undefined;

  const [novedad, setNovedad] = useState<Novedad | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  let mounted = true;

  async function fetchData() {
    setLoading(true);
    setError(null);

    if (!id) {
      setError("Id no presente en la ruta");
      setLoading(false);
      return;
    }

    try {
      const data = await obtenerNovedadPorId(id);
      if (mounted) setNovedad(data);
    } catch (err: any) {
      console.error("Error:", err);
      if (mounted) setError(err.message || "Error desconocido");
    } finally {
      if (mounted) setLoading(false);
    }
  }

  fetchData();
  return () => {
    mounted = false;
  };
}, [id]);


  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <main className="flex-grow mt-28 px-6 md:px-20 py-12">
        <div className="mb-6">
          <Link href="/Novedades" className="inline-block bg-red-600 text-white text-sm px-4 py-2 rounded hover:bg-red-700">
            Volver
          </Link>
        </div>

        {loading && <div className="text-gray-600">Cargando novedad...</div>}

        {error && <div className="text-red-600 break-words">No se pudo cargar: {error}</div>}

        {!loading && !error && novedad && (
          <>
            <h1 className="text-3xl font-bold mb-6 text-[#34495E]">{novedad.titulo}</h1>

            {novedad.imagen && (
              <img
                src={`data:image/jpeg;base64,${novedad.imagen}`}
                alt={novedad.titulo}
                className="w-full max-h-[400px] object-cover rounded-lg shadow mb-6"
              />
            )}

            <p className="text-sm text-gray-500 mb-4">
              {new Date(novedad.fecha).toLocaleDateString('es-AR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>

            <p className="text-gray-700 text-lg whitespace-pre-line">{novedad.descripcion}</p>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}



/*import Navbar from "../../Inicio/components/Navbar";
import Footer from "../../Inicio/components/Footer";
import { getIdNovedad } from "./action";

interface Params {
  params: { id: string }
}

export default async function DetalleNovedad({ params }: Params) {
  const novedad = await getIdNovedad(Number(params.id));

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <main className="flex-grow mt-28 px-6 md:px-20 py-12">
        <h1 className="text-3xl font-bold mb-6 text-[#34495E]">{novedad.titulo}</h1>

        <img
          src={`data:image/jpeg;base64,${novedad.imagen}`}
          alt={novedad.titulo}
          className="w-full max-h-[400px] object-cover rounded-lg shadow mb-6"
        />

        <p className="text-sm text-gray-500 mb-4">
          {new Date(novedad.fecha).toLocaleDateString("es-AR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        <p className="text-gray-700 text-lg whitespace-pre-line">
          {novedad.descripcion}
        </p>
      </main>

      <Footer />
    </div>
  );
}

*/