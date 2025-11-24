// app/Inicio/Navbar.jsx - VERSIÓN ACTUALIZADA
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { logoutAction } from "@/app/Inicio/Navbar/logoutAction";
import Notificaciones from "@/app/Inicio/components/Notificaciones";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [perfilId, setPerfilId] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/user/me");
        const data = await res.json();
        setUser(data);
        
        // Obtener el perfilId del usuario logueado
        if (data?.perfil?.id) {
          setPerfilId(data.perfil);
        }
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
        <Link href="/Comunidad" className="hover:underline">Comunidad</Link>
        <Link href="/Novedades" className="hover:underline">Novedades</Link>
        <Link href="/Inicio/Empresas" className="hover:underline">Contactanos</Link>

        {/* NOTIFICACIONES - SOLO SI ESTÁ LOGUEADO */}
        {user && perfilId && (
          <Notificaciones perfilId={perfilId} />
        )}

        {/* SI ESTÁ LOGUEADO */}
        {user ? (
          <div className="relative">
            {/* FOTO PERFIL */}
            <div
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-white bg-gray-200 cursor-pointer"
              onMouseEnter={() => setShowProfileMenu(true)}
              onMouseLeave={() => setShowProfileMenu(false)}
              
              title="Ver perfil"
            >
              <Link href={"/Perfil"}>
              <Image
                src={`data:image/jpeg;base64,${perfilId?.imagen}`}
                alt="Perfil"
                width={40}
                height={40}
                className="object-cover object-center"
                unoptimized
                />
                </Link>
            </div>

            {/* MENU QUE SE MUESTRA SOLO AL HOVER SOBRE LA FOTO */}
            <div 
              className={`absolute right-0 mt-3 w-72 bg-gray-900 text-white p-4 rounded-xl shadow-lg transition-all duration-200 z-20 ${
                showProfileMenu 
                  ? "opacity-100 visible translate-y-0" 
                  : "opacity-0 invisible -translate-y-2"
              }`}
              onMouseEnter={() => setShowProfileMenu(true)}
              onMouseLeave={() => setShowProfileMenu(false)}
            >
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white bg-gray-200 mb-3">
                  <Image
                    src={`data:image/jpeg;base64,${user?.perfil?.imagen}`}
                    alt="Perfil grande"
                    width={96}
                    height={96}
                    className="object-contain object-center"
                    unoptimized
                  />
                </div>

                <p className="font-semibold text-center">{user?.perfil?.razonSocial}</p>
                <p className="text-sm text-gray-300 text-center break-words mb-4">{user?.email}</p>
                
                <form action={logoutAction} className="w-full">
                  <button
                    type="submit"
                    className="w-full text-left px-4 py-2 rounded-xl 
                              bg-gradient-to-r from-red-500 to-orange-500
                              text-white font-bold shadow-lg
                              hover:from-red-600 hover:to-orange-600
                              hover:shadow-xl hover:scale-105
                              transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                      />
                    </svg>
                    Cerrar sesión
                  </button>
                </form>
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