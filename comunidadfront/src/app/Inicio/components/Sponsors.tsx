"use client";

export default function SponsorCarouselHorizontal({ sponsors }: { sponsors: string[] }) {
  const duplicatedSponsors = [...sponsors, ...sponsors];

  return (
    <div className="w-full overflow-hidden relative">
      
      {/* Contenedor que se desplaza horizontalmente */}
      <div className="flex animate-scroll-horizontal whitespace-nowrap">
        {duplicatedSponsors.map((src, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-40 h-28 mx-4 flex items-center justify-center rounded-xl p-3 bg-white shadow-sm"
          >
            <img
              src={src}
              alt={`Sponsor ${index + 1}`}
              className="object-contain max-w-full max-h-full"
              onError={(e) => {
                console.error(`Error loading image: ${src}`);
                e.currentTarget.src = "/logo.png";
              }}
            />
          </div>
        ))}
      </div>

      {/* Gradientes en los bordes */}
      <div className="pointer-events-none absolute top-0 left-0 h-full w-10 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute top-0 right-0 h-full w-10 bg-gradient-to-l from-white to-transparent" />
    </div>
  );
}