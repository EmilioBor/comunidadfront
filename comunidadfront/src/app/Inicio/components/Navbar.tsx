// "use client";
// import Link from "next/link";

// export default function Navbar() {
//   return (
//     <nav className="bg-gray-800 text-white px-6 py-3 flex items-center justify-between ">
//       {/* Logo + Nombre */}
//       <div className="flex items-center space-x-2">
//         <img src="/logo.png" alt="Logo" className="w-8 h-8" />
//         <Link href="/Inicio" className="hover:underline">Comunidad Solidaria</Link>
//       </div>

//       {/* Links */}
//       <div className="flex items-center space-x-6">
//         <Link href="/Inicio#quienes" className="hover:underline">Quienes somos</Link>
//         <Link href="#comunidad" className="hover:underline">Comunidad</Link>
//         <Link href="/Novedades" className="hover:underline">Novedades</Link>
//         <Link href="/Inicio/Empresas" className="hover:underline">Contactanos</Link>
//         <Link href="/login" className="hover:underline">Inicio Sesión</Link>
//         <Link
//               href="/Donacion/ComunidadSolidaria"
//               className="bg-[#C5E9BE] text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-green-300"
//             >
//               Donar aquí
//             </Link>
//       </div>
//     </nav>
//   );
// }
"use client";

interface Perfil {
  razonSocial: string;
  descripcion: string;
  imagen: string | null;
}

interface LoggedUser {
  id: number;
  email: string;
  token: string;
  perfil: Perfil;
}


import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getLoggedUser } from "@/app/lib/api/getLoggedUser"; // ajusta ruta según tu proyecto

export default function Navbar() {
  const [user, setUser] = useState<LoggedUser | null>(null);

  

  useEffect(() => {
  async function loadUser() {
    try {
      const res = await fetch("/api/user/me");
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Error cargando usuario:", err);
    }
  }
  loadUser();
}, []);

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex items-center justify-between">
      {/* LOGO */}
      <div className="flex items-center space-x-2">
        <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-md" unoptimized />
        <Link href="/Inicio" className="hover:underline">Comunidad Solidaria</Link>
      </div>

      {/* LINKS */}
      <div className="flex items-center space-x-6">
        
        <Link href="/Inicio#quienes" className="hover:underline">Quienes somos</Link>
        <Link href="#comunidad" className="hover:underline">Comunidad</Link>
        <Link href="/Novedades" className="hover:underline">Novedades</Link>
        <Link href="/Inicio/Empresas" className="hover:underline">Contactanos</Link>

        {/* SI ESTÁ LOGUEADO */}
        {user ? (
          <div className="relative group cursor-pointer">

            {/* FOTO PERFIL */}
            <div
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-white bg-gray-200 cursor-pointer"
              onClick={() => window.location.href = "/Perfil"}
              title="Ver perfil"
            >
              <Image
                src={`data:image/jpeg;base64,${user?.perfil?.imagen}`}
                alt="Perfil"
                width={40}
                height={40}
                className="object-cover object-center"
                unoptimized
              />
            </div>

            {/* HOVER TIPO GOOGLE */}
            <div className="absolute right-0 mt-3 w-72 bg-gray-900 text-white p-4 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white bg-gray-200 mb-3">
                  <Image
                     src={`data:image/jpeg;base64,${user?.perfil?.imagen}`}                    alt="Perfil grande"
                    width={96}
                    height={96}
                    className="object-contain object-center"
                    unoptimized
                  />
                </div>

                <p className="font-semibold text-center">{user?.perfil?.razonSocial}</p>
                <p className="text-sm text-gray-300 text-center break-words">{user?.email}</p>
              </div>
            </div>

          </div>
        ) : (
          <Link href="/login" className="hover:underline">Inicio Sesión</Link>
        )}

        <Link
          href="/Donacion/ComunidadSolidaria"
          className="bg-[#C5E9BE] text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-green-300"
        >
          Donar aquí
        </Link>

      </div>
    </nav>
  );
}
