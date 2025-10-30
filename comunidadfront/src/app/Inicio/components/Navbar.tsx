"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex items-center justify-between ">
      {/* Logo + Nombre */}
      <div className="flex items-center space-x-2">
        <img src="/logo.png" alt="Logo" className="w-8 h-8" />
        <Link href="/Inicio" className="hover:underline">Comunidad Solidaria</Link>
      </div>

      {/* Links */}
      <div className="flex items-center space-x-6">
        <Link href="/Inicio#quienes" className="hover:underline">Quienes somos</Link>
        <Link href="#comunidad" className="hover:underline">Comunidad</Link>
        <Link href="/Novedades" className="hover:underline">Novedades</Link>
        <Link href="/Inicio/Empresas" className="hover:underline">Contactanos</Link>
        <Link href="/login" className="hover:underline">Inicio Sesión</Link>
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
