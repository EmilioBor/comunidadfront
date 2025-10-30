"use client";
import { useRouter } from 'next/navigation';

export default function Donaciones() {
  const router = useRouter();

  return (
    <section className="py-16 px-16 text-center bg-white">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Selecciona el tipo de donación
      </h2>
      <div className="flex justify-center gap-4">
        <button 
          onClick={() => router.push('/Donacion/ComunidadSolidaria?tipo=Dinero')}
          className="bg-[#D4F0F0] text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-[#b8e0e0] transition duration-200"
        >
          Dinero
        </button>

        <button 
          onClick={() => router.push('/Donacion/ComunidadSolidaria?tipo=Alimento')}
          className="bg-[#D4F0F0] text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-[#b8e0e0] transition duration-200"
        >
          Alimento
        </button>

        <button 
          onClick={() => router.push('/Donacion/ComunidadSolidaria?tipo=Ropa')}
          className="bg-[#D4F0F0] text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-[#b8e0e0] transition duration-200"
        >
          Ropa
        </button>

        <button 
          onClick={() => router.push('/Donacion/ComunidadSolidaria?tipo=Mueble')}
          className="bg-[#D4F0F0] text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-[#b8e0e0] transition duration-200"
        >
          Mueble
        </button>

        <button 
          onClick={() => router.push('/Donacion/ComunidadSolidaria?tipo=Otros')}
          className="bg-[#D4F0F0] text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-[#b8e0e0] transition duration-200"
        >
          Otros
        </button>
      </div>
    </section>
  );
}