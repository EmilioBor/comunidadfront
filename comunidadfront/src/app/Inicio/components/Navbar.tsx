"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex items-center justify-between">
      {/* Logo + Nombre */}
      <div className="flex items-center space-x-2">
        <img src="/logo.png" alt="Logo" className="w-8 h-8" />
        <span className="font-bold text-lg">Comunidad Solidaria</span>
      </div>

      {/* Links */}
      <div className="flex items-center space-x-6">
        <Link href="#quienes" className="hover:underline">Quienes somos</Link>
        <Link href="#comunidad" className="hover:underline">Comunidad</Link>
        <Link href="#novedades" className="hover:underline">Novedades</Link>
        <Link href="/login" className="hover:underline">Inicio Sesión</Link>
        <button className="bg-[#C5E9BE] text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-green-300">
          Donar aquí
        </button>
      </div>
    </nav>
  );
}
