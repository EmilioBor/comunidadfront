"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { GetUserByPerfil } from "@/app/lib/api/perfil";
import { obtenerLocalidadesByID } from "../Perfil/action";
import { useRouter } from "next/navigation";
import Navbar from "../Inicio/components/Navbar";
import Link from "next/link";
import { obtenerPublicacion } from "./action";

interface PerfilType {
  id: number;
  cuitCuil: number;
  razonSocial: string;
  descripcion: string;
  cbu: number;
  alias: string;
  usuarioIdUsuario: number;
  localidadIdLocalidad: number;
  imagen: string;
}

interface LocalidadType {
  id: number;
  nombre: string;
  codigoPostal: string;
  nombreProvinciaIdProvincia: string;
}

interface Publicacion {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  fechaCreacion: string;
  nombreLocalidadIdLocalidad: string;
  nombrePerfilIdPerfil: string;
  nombrePublicacionTipoIdPublicacionTipo: string;
  nombreDonacionIdDonacion: 1;
}

export default function Perfil() {
  const [perfil, setPerfil] = useState<PerfilType | null>(null);
  const [localidad, setLocalidad] = useState<LocalidadType | null>(null);
  const [rol, setRol] = useState<string | null>(null);
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);

  const router = useRouter();

  // Carga perfil + localidad + rol desde la cookie/session
        useEffect(() => {
        async function load() {
            try {
            const me = await fetch("/api/user/me").then((r) => r.json());
            console.log("me:", me);
            setRol(me.rol);

            const perfilData = await GetUserByPerfil(me.id);
            console.log("perfilData:", perfilData);
            if (!perfilData) {
                router.push("/Perfil/Crear");
                return;
            }
            setPerfil(perfilData);

            const localidadData = await obtenerLocalidadesByID(perfilData.localidadIdLocalidad);
            console.log("localidadData:", localidadData);
            setLocalidad(localidadData);

            const pubs = await obtenerPublicacion(perfilData.razonSocial);
            console.log("pubs:", pubs);
            setPublicaciones(Array.isArray(pubs) ? pubs : [pubs]);
            } catch (error) {
            console.error("Error cargando datos del perfil:", error);
            }
        }
        load();
        }, []);


  if (!perfil) {
    return <p className="text-center mt-10 text-lg">Cargando perfil...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex w-full">
        {/* COLUMNA IZQUIERDA */}
        <aside className="w-1/4 h-screen p-6 flex flex-col items-center bg-gray-100">
          <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border">
            <Image
              src={`data:image/jpeg;base64,${perfil.imagen}`}
              alt="Foto de perfil"
              width={160}
              height={160}
              className="object-cover"
              unoptimized
            />
          </div>

          <p className="text-lg font-semibold text-black">{perfil.razonSocial}</p>

          <div className="mt-10 flex flex-col w-full gap-4">
            <Link
              href="/Perfil/Donaciones"
              className="bg-gray-300 hover:bg-gray-400 py-2 rounded-lg text-center text-black"
            >
              Donaciones
            </Link>
            <Link
              href="/Perfil/Chat"
              className="bg-gray-300 hover:bg-gray-400 py-2 rounded-lg text-center text-black"
            >
              Chats
            </Link>
            {rol === "Empresa" && (
              <Link
                href={`/Perfil/CrearNovedad/?idPerfil=${perfil.id}`}
                className="bg-blue-400 hover:bg-blue-500 py-2 rounded-lg text-center text-white font-semibold"
              >
                Crear Novedad
              </Link>
            )}
          </div>
        </aside>

        {/* COLUMNA CENTRAL */}
        <main className="w-3/4 p-8 flex flex-col gap-8">
          {/* INFORMACIÓN DEL PERFIL */}
          <section className="bg-gray-200 p-8 rounded-xl w-full text-sm">
            <div className="border border-[#D9D9D9] bg-white p-6 rounded-lg">
              <div className="grid grid-cols-2 gap-y-4">
                <p className="font-bold text-black">{perfil.razonSocial}</p>
                <p className="font-bold text-black">
                  <strong>Provincia:</strong>{" "}
                  {localidad?.nombreProvinciaIdProvincia ?? "Cargando..."}
                </p>
                <p className="font-bold text-black">
                  <strong>Cuil/Cuit:</strong> {perfil.cuitCuil}
                </p>
                <p className="font-bold text-black">
                  <strong>Localidad:</strong> {localidad?.nombre ?? "Cargando..."}
                </p>
                <p className="font-bold text-black">
                  <strong>CBU:</strong> {perfil.cbu}
                </p>
                <p className="font-bold text-black">
                  <strong>Alias:</strong> {perfil.alias}
                </p>
              </div>
              <div className="mt-6">
                <p className="font-bold text-black">Descripción:</p>
                <p className="text-black">{perfil.descripcion}</p>
              </div>
            </div>
          </section>

          {/* PUBLICACIONES */}
          <section className="w-full">
            <h2 className="text-xl font-bold mb-4 text-black">Publicaciones</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publicaciones.length === 0 && (
                <p className="text-gray-500 col-span-full">No hay publicaciones.</p>
              )}
              {publicaciones.map((pub) => (
                <div key={pub.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
        

                    {/* INFORMACIÓN DEL PERFIL + TRES PUNTITOS */}
                    <div className="flex items-center justify-between px-4 pt-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border">
                        <Image
                            src={`data:image/jpeg;base64,${perfil.imagen}`}
                            alt={perfil.razonSocial}
                            width={40}
                            height={40}
                            className="object-cover"
                            unoptimized
                        />
                        </div>
                        <span className="font-semibold text-gray-800">{pub.nombrePerfilIdPerfil}</span>
                    </div>
                    {/* BOTÓN DE TRES PUNTITOS */}
                    <button className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 7a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z"/>
                        </svg>
                    </button>
                    </div>

                    {/* CONTENIDO DE LA PUBLICACIÓN */}
                    {/* IMAGEN DE LA PUBLICACIÓN */}
                    <img
                    src={`data:image/jpeg;base64,${pub.imagen}`}
                    alt={pub.titulo}
                    className="w-full h-[200px] object-cover"
                    />
                    <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-[#2c3e50] mb-1">{pub.titulo}</h3>
                    <p className="text-sm text-gray-500 mb-1">
                        {new Date(pub.fechaCreacion).toLocaleDateString("es-AR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        })}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                        <strong>Tipo de publicación:</strong> {pub.nombrePublicacionTipoIdPublicacionTipo}
                    </p>
                    <p className="text-gray-700 text-sm flex-grow line-clamp-3">{pub.descripcion}</p>

                    {/* BOTONES DE ACCIÓN */}
                    <div className="flex gap-2 mt-3">
                        <Link
                        href={`/Donacion/${pub.id}`}
                        className="flex-1 bg-[#7DB575] text-white py-2 rounded-lg text-center font-semibold hover:bg-green-500 transition"
                        >
                        Donar
                        </Link>
                        <Link
                        href={`/Perfil/Chat?perfil=${pub.nombrePerfilIdPerfil}`}
                        className="flex-1 bg-[#7DB575] text-white py-2 rounded-lg text-center font-semibold hover:bg-blue-500 transition"
                        >
                        Chat
                        </Link>
                    </div>
                    </div>
                </div>
                ))}

            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
