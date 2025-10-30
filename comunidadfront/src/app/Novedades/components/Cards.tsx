import Link from "next/link";
import Image from "next/image";

export interface CardProps {
  imagen: string;
  titulo: string;
  fecha: string;
  descripcion: string;
}

export default function Cards({ imagen, titulo, fecha, descripcion}: CardProps
) {
  return (
    <article className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105">
      <div className="relative w-full h-48">
        <div className="relative w-full h-48">
          <Image
            src={imagen}
            alt = "Imagen"
            fill
            sizes="(max-width: 640px) 100vw, 400px"
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="font-medium text-gray-700">{descripcion}</span>
          <time className="text-gray-400">{fecha}</time>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 leading-snug">
          {titulo}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-3">{descripcion}</p>

        <div className="mt-2">
          <Link
            href = "#"
            className="inline-block px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
          >
            Leer más
          </Link>
        </div>
      </div>
    </article>
  );
}
