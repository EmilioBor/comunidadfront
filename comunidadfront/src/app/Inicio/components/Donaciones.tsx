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
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Dinero
        </button>

        <button 
          onClick={() => router.push('/Donacion/ComunidadSolidaria?tipo=Alimento')}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Alimento
        </button>

        <button 
          onClick={() => router.push('/Donacion/ComunidadSolidaria?tipo=Ropa')}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Ropa
        </button>

        <button 
          onClick={() => router.push('/Donacion/ComunidadSolidaria?tipo=Mueble')}
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          Mueble
        </button>

        <button 
          onClick={() => router.push('/Donacion/ComunidadSolidaria?tipo=Otros')}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Otros
        </button>
      </div>
    </section>
  );
}