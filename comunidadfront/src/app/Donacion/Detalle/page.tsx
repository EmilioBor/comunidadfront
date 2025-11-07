"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/app/Inicio/components/Navbar";
import Footer from "@/app/Inicio/components/Footer";

interface DetalleDonacion {
  id: number;
  descripcion: string;
  donacionIdDonacionNavigation: {
    descripcion: string;
    fechaHora: string;
    donacionTipoIdDonacionTipoNavigation: {
      descripcion: string;
    };
    perfilIdPerfilNavigation: {
      alias: string;
      email: string;
      razonSocial: string;
    };
  };
  envioIdEnvioNavigation: {
    direccion: string;
    fechaEnvio: string;
    estadoIdEstadoNavigation: {
      nombre: string;
    };
  };
  detalleDonacionTipoIdDetalleDonacinoTipoNavigation: {
    nombre: string;
  };
}

export default function DetalleDonacionPage() {
  const [detalle, setDetalle] = useState<DetalleDonacion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔹 Donación hardcodeada para pruebas
    const fakeData: DetalleDonacion = {
      id: 1,
      descripcion: "Donación de alimentos no perecederos a la Fundación Manos Unidas.",
      donacionIdDonacionNavigation: {
        descripcion: "Donación mensual de alimentos",
        fechaHora: "2025-11-03T15:00:00Z",
        donacionTipoIdDonacionTipoNavigation: {
          descripcion: "Alimentos",
        },
        perfilIdPerfilNavigation: {
          alias: "FundaciónManosUnidas",
          email: "contacto@manosunidas.org",
          razonSocial: "Fundación Manos Unidas Argentina",
        },
      },
      envioIdEnvioNavigation: {
        direccion: "Av. Siempre Viva 742, Buenos Aires",
        fechaEnvio: "2025-11-04T10:30:00Z",
        estadoIdEstadoNavigation: {
          nombre: "En camino",
        },
      },
      detalleDonacionTipoIdDetalleDonacinoTipoNavigation: {
        nombre: "Confirmada",
      },
    };

    // Simulamos tiempo de carga
    setTimeout(() => {
      setDetalle(fakeData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading || !detalle) {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center">
        <p className="text-sky-600 font-medium">Cargando detalle de donación...</p>
      </div>
    );
  }

  const d = detalle;
  const donacion = d.donacionIdDonacionNavigation;
  const envio = d.envioIdEnvioNavigation;

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col">
      {/* HEADER */}
      <Navbar />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col items-center py-10 px-5">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-[600px] border border-sky-100">
          <h1 className="text-3xl font-bold text-sky-800 text-center mb-6">
            Detalle de Donación
          </h1>

          <h2 className="text-xl font-semibold text-sky-700 mb-4">
            {donacion.descripcion}
          </h2>

          <div className="text-gray-700 space-y-2">
            <p>
              <strong>Fecha:</strong>{" "}
              {new Date(donacion.fechaHora).toLocaleDateString()}
            </p>
            <p>
              <strong>Tipo de Donación:</strong>{" "}
              {donacion.donacionTipoIdDonacionTipoNavigation.descripcion}
            </p>
            <p>
              <strong>Estado:</strong>{" "}
              {d.detalleDonacionTipoIdDetalleDonacinoTipoNavigation.nombre}
            </p>
            <p>
              <strong>Descripción Detalle:</strong> {d.descripcion}
            </p>
          </div>

          <hr className="my-4" />

          <div className="text-gray-700 space-y-2">
            <h3 className="text-lg font-semibold text-sky-600">Envío</h3>
            <p>
              <strong>Dirección:</strong> {envio.direccion}
            </p>
            <p>
              <strong>Fecha de Envío:</strong>{" "}
              {new Date(envio.fechaEnvio).toLocaleDateString()}
            </p>
            <p>
              <strong>Estado del Envío:</strong>{" "}
              {envio.estadoIdEstadoNavigation.nombre}
            </p>
          </div>

          <hr className="my-4" />

          <div className="text-gray-700">
            <h3 className="text-lg font-semibold text-sky-600">Perfil Destino</h3>
            <p>
              <strong>Alias:</strong> {donacion.perfilIdPerfilNavigation.alias}
            </p>
            <p>
              <strong>Email:</strong> {donacion.perfilIdPerfilNavigation.email}
            </p>
            <p>
              <strong>Razón Social:</strong>{" "}
              {donacion.perfilIdPerfilNavigation.razonSocial}
            </p>
          </div>

          <div className="mt-6 flex justify-center">
            <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition">
              💬 Chat con el representante
            </button>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
