// app/Comunidad/components/SidebarSponsor.tsx - VERSIÓN CON CSS GLOBAL
"use client";

const sponsors = [
  "/Sponsors/BA_logo_sello-scaled.jpg",
  "/Sponsors/camara.jpg", 
  "/Sponsors/caritas.png",
  "/Sponsors/fundacin_perez_companc_logo.jpg",
  "/Sponsors/Fundacion_Bigand_5.original.png",
  "/Sponsors/luchemos.jpg"
];

const Sponsor = () => {
  const duplicatedSponsors = [...sponsors, ...sponsors];
  
  return (
    <aside className="bg-[#D9D9D9] rounded-2xl shadow-md w-36 h-full overflow-hidden flex items-center justify-center">
      <div className="relative w-full h-full overflow-hidden">
        
        {/* Contenedor de la cinta que se mueve */}
        <div className="flex flex-col items-center animate-scroll-vertical-slow">
          {duplicatedSponsors.map((src, index) => (
            <div 
              key={index} 
              className="w-full flex-shrink-0 flex items-center justify-center py-8"
              style={{ height: '160px' }}
            >
              <div className="w-28 h-28 flex items-center justify-center p-3 bg-white/90 rounded-xl shadow-sm">
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
            </div>
          ))}
        </div>

        {/* Efectos de degradado */}
        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#D9D9D9] to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#D9D9D9] to-transparent pointer-events-none" />
      
      </div>
    </aside>
  );
};

export default Sponsor;