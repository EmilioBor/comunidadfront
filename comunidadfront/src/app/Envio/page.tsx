"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  obtenerPerfilNombre,
  obtenerLocalidades,
  obtenerDonaciones,
  enviarEnvio,
  obtenerPerfiles,
} from "./action";
import { GetUserByPerfil } from "@/app/lib/api/perfil";

interface PerfilType {
  id: number;
  razonSocial: string;
  descripcion: string;
  imagen: string | null;
}

export default function CrearEnvio() {
  const router = useRouter();

  // =============================
  // STATES
  // =============================
  const [perfilEmisor, setPerfilEmisor] = useState<PerfilType | null>(null);

  const [localidades, setLocalidades] = useState([]);
  const [perfiles, setPerfiles] = useState<PerfilType[]>([]);
  const [donaciones, setDonaciones] = useState([]);

  const [direccionEmisor, setDireccionEmisor] = useState("");
  const [localidadEmisorId, setLocalidadEmisorId] = useState("");

  const [perfilReceptorId, setPerfilReceptorId] = useState("");
  const [localidadReceptorId, setLocalidadReceptorId] = useState("");
  const [direccionReceptor, setDireccionReceptor] = useState("");

  const [donacionId, setDonacionId] = useState("");
  const [aclaracion, setAclaracion] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);

  // =============================
  // CARGA INICIAL
  // =============================
  useEffect(() => {
    async function cargarData() {
      try {
        const me = await fetch("/api/user/me").then((r) => r.json());
        if (!me?.id) return;

        const perfil = await GetUserByPerfil(me.id);
        const locs = await obtenerLocalidades();
        const dons = await obtenerDonaciones();
        const perfs = await obtenerPerfiles();

        setPerfilEmisor(perfil);
        setLocalidades(locs);
        setDonaciones(dons);
        setPerfiles(perfs);
      } catch (err) {
        console.error("Error cargando datos", err);
      }
    }
    cargarData();
  }, []);

  // =============================
  // SUBMIT
  // =============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !direccionEmisor ||
      !localidadEmisorId ||
      !perfilReceptorId ||
      !localidadReceptorId ||
      !direccionReceptor ||
      !donacionId
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    const envio = {
      direccionEmisor,
      perfilEmisorIdPerfilEmisor: perfilEmisor?.id,
      perfilReceptorIdPerfilReceptor: Number(perfilReceptorId),
      localidadEmisorIdLocalidadEmisor: Number(localidadEmisorId),
      localidadReceptorIdLocalidadReceptor: Number(localidadReceptorId),
      direccionEreceptor: direccionReceptor,
      donacionIddonacion: Number(donacionId),
      aclaracion,
    };

    setLoading(true);

    try {
      const res = await enviarEnvio(envio);

      if (res) {
        setMostrarModalExito(true);
      } else {
        setError("No se pudo registrar el envío.");
      }
    } catch (err) {
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleAceptar = () => {
    setMostrarModalExito(false);
    router.push("/Perfil");
  };

  // =============================
  // CUSTOM SELECT DE PERFILES (CON FOTO)
  // =============================
  const renderPerfilOption = (p) => (
    <option key={p.id} value={p.id}>
      {p.razonSocial}
    </option>
  );

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed p-4"
        style={{ backgroundImage: "url('/background-login.png')" }}
      >
        {/* BOTÓN VOLVER */}
        <button
          type="button"
          onClick={() => router.back()}
          className="fixed top-24 left-6 bg-white w-48 rounded-2xl h-14 text-black text-xl font-semibold group z-40"
        >
          <div className="bg-green-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] duration-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
              height="25px"
              width="25px"
            >
              <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" />
              <path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" />
            </svg>
          </div>
          <p className="translate-x-2">Volver</p>
        </button>

        {/* CARD */}
        <div className="bg-[#C5E9BE] rounded-2xl shadow-lg p-6 w-full max-w-lg">
          <div className="flex flex-col items-center mb-6">
            <img src="/logo.png" alt="logo" className="w-10 h-10 mb-2" />
            <h1 className="text-xl font-bold text-gray-800">Crear Envío</h1>
            <h2 className="text-lg font-[cursive] text-gray-800">
              Comunidad Solidaria
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* DIRECCIÓN EMISOR */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800">
                Dirección del Emisor
              </label>
              <input
                type="text"
                value={direccionEmisor}
                onChange={(e) => setDireccionEmisor(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-white"
                required
              />
            </div>

            {/* LOCALIDAD EMISOR */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800">
                Localidad del Emisor
              </label>
              <select
                value={localidadEmisorId}
                onChange={(e) => setLocalidadEmisorId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white"
                required
              >
                <option value="">Seleccionar...</option>
                {localidades.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* PERFIL RECEPTOR (CON FOTO) */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800">
                Perfil Receptor
              </label>

              <select
                value={perfilReceptorId}
                onChange={(e) => setPerfilReceptorId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white"
                required
              >
                <option value="">Seleccionar...</option>
                {perfiles.map(renderPerfilOption)}
              </select>
            </div>

            {/* LOCALIDAD RECEPTOR */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800">
                Localidad del Receptor
              </label>
              <select
                value={localidadReceptorId}
                onChange={(e) => setLocalidadReceptorId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white"
                required
              >
                <option value="">Seleccionar...</option>
                {localidades.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* DIRECCIÓN RECEPTOR */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800">
                Dirección del Receptor
              </label>
              <input
                type="text"
                value={direccionReceptor}
                onChange={(e) => setDireccionReceptor(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-white"
                required
              />
            </div>

            {/* DONACIÓN */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800">
                Donación
              </label>
              <select
                value={donacionId}
                onChange={(e) => setDonacionId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white"
                required
              >
                <option value="">Seleccionar...</option>
                {donaciones.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.descripcion}
                  </option>
                ))}
              </select>
            </div>

            {/* ACLARACIÓN */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-800">
                Aclaración
              </label>
              <textarea
                value={aclaracion}
                onChange={(e) => setAclaracion(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-white min-h-[80px] resize-none"
              />
            </div>

            {/* ERROR */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg text-center text-sm">
                {error}
              </div>
            )}

            {/* BOTÓN SEND */}
            <button
              type="submit"
              disabled={loading}
              className="bg-white text-gray-800 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition border border-gray-300 disabled:bg-gray-200"
            >
              {loading ? "Enviando..." : "Registrar Envío"}
            </button>
          </form>
        </div>
      </div>

      {/* MODAL EXITO */}
      {mostrarModalExito && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-[#C5E9BE] rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-green-700 mb-2">
                ¡Envío registrado!
              </h3>
              <p className="text-gray-700 mb-1">
                Tu envío ha sido cargado correctamente.
              </p>

              <button
                onClick={handleAceptar}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg w-full"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
