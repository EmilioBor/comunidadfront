// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { GetUserByPerfil } from "@/app/lib/api/perfil";
// import { obtenerLocalidadesByID } from "../Perfil/action";
// import { useRouter } from "next/navigation";
// import Navbar from "../Inicio/components/Navbar";
// import Link from "next/link";

// interface PerfilType {
//   id: number;
//   cuitCuil: number;
//   razonSocial: string;
//   descripcion: string;
//   cbu: number;
//   alias: string;
//   usuarioIdUsuario: number;
//   localidadIdLocalidad: number;
//   imagen: string;
// }

// interface LocalidadType {
//   id: number;
//   nombre: string;
//   codigoPostal: string;
//   nombreProvinciaIdProvincia: string;
// }

// export default function Perfil() {
//   const [perfil, setPerfil] = useState<PerfilType | null>(null);
//   const [localidad, setLocalidad] = useState<LocalidadType | null>(null);
//   const router = useRouter();

//   // Carga perfil + localidad
//   useEffect(() => {
//     async function load() {
//       try {
//         const me = await fetch("/api/user/me").then((r) => r.json());

//         const perfilData = await GetUserByPerfil(me.id);

//         if (!perfilData) {
//           router.push("/Perfil/Crear");
//           return;
//         }

//         setPerfil(perfilData);

//         // Obtener la localidad relacionada
//         const localidadData = await obtenerLocalidadesByID(
//           perfilData.localidadIdLocalidad
//         );

//         setLocalidad(localidadData);

//       } catch (error) {
//         console.error("Error cargando datos del perfil:", error);
//       }
//     }

//     load();
//   }, []);

//   if (!perfil) {
//     return <p className="text-center mt-10 text-lg">Cargando perfil...</p>;
//   }

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Navbar />

//       <div className="flex w-full">
//         <aside className="w-1/4 h-screen p-6 flex flex-col items-center bg-gray-100">
//           <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border">
//             <Image
//               src={`data:image/jpeg;base64,${perfil.imagen}`}
//               alt="Foto de perfil"
//               width={160}
//               height={160}
//               className="object-cover"
//               unoptimized
//             />
//           </div>

//           <p className="text-lg font-semibold text-black">
//             {perfil.razonSocial}
//           </p>

//           <div className="mt-10 flex flex-col w-full gap-4">
//             <Link
//               href="/Perfil/Donaciones"
//               className="bg-gray-300 hover:bg-gray-400 py-2 rounded-lg text-center text-black"
//             >
//               Donaciones
//             </Link>

//             <Link
//               href="/Perfil/Chat"
//               className="bg-gray-300 hover:bg-gray-400 py-2 rounded-lg text-center text-black"
//             >
//               Chats
//             </Link>
//           </div>
//         </aside>

//         <main className="w-3/4 p-8 flex flex-col gap-8">
//           <section className="bg-gray-200 p-8 rounded-xl w-full text-sm">
//             <div className="border border-[#D9D9D9] bg-white p-6 rounded-lg">
//               <div className="grid grid-cols-2 gap-y-4">
//                 <p className="font-bold text-black">{perfil.razonSocial}</p>

//                 <p className="font-bold text-black">
//                   <strong>Provincia:</strong>{" "}
//                   {localidad?.nombreProvinciaIdProvincia ?? "Cargando..."}
//                 </p>

//                 <p className="font-bold text-black">
//                   <strong>Cuil/Cuit:</strong> {perfil.cuitCuil}
//                 </p>

//                 <p className="font-bold text-black">
//                   <strong>Localidad:</strong> {localidad?.nombre ?? "Cargando..."}
//                 </p>

//                 <p className="font-bold text-black">
//                   <strong>CBU:</strong> {perfil.cbu}
//                 </p>

//                 <p className="font-bold text-black">
//                   <strong>Alias:</strong> {perfil.alias}
//                 </p>
//               </div>

//               <div className="mt-6">
//                 <p className="font-bold text-black">Descripción:</p>
//                 <p className="text-black">{perfil.descripcion}</p>
//               </div>
//             </div>
//           </section>

//           <section className="w-full">
//             <h2 className="text-xl font-bold mb-4 text-black">
//               Publicaciones
//             </h2>
//           </section>
//         </main>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { GetUserByPerfil } from "@/app/lib/api/perfil";
import { obtenerLocalidadesByID } from "../Perfil/action";
import { useRouter } from "next/navigation";
import Navbar from "../Inicio/components/Navbar";
import Link from "next/link";

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

export default function Perfil() {
  const [perfil, setPerfil] = useState<PerfilType | null>(null);
  const [localidad, setLocalidad] = useState<LocalidadType | null>(null);
  const [rol, setRol] = useState<string | null>(null);

  const router = useRouter();

  // Carga perfil + localidad + rol desde la cookie/session
  useEffect(() => {
    async function load() {
      try {
        // Obtener datos del usuario logueado
        const me = await fetch("/api/user/me").then((r) => r.json());
        setRol(me.rol);

        // Perfil del usuario
        const perfilData = await GetUserByPerfil(me.id);

        if (!perfilData) {
          router.push("/Perfil/Crear");
          return;
        }

        setPerfil(perfilData);

        // Localidad
        const localidadData = await obtenerLocalidadesByID(
          perfilData.localidadIdLocalidad
        );
        setLocalidad(localidadData);

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

          {/* FOTO */}
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

          {/* NOMBRE */}
          <p className="text-lg font-semibold text-black">
            {perfil.razonSocial}
          </p>

          {/* BOTONES */}
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

            {/* ⭐ SOLO PARA EMPRESA */}
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

          <section className="w-full">
            <h2 className="text-xl font-bold mb-4 text-black">
              Publicaciones
            </h2>
          </section>
        </main>
      </div>
    </div>
  );
}
