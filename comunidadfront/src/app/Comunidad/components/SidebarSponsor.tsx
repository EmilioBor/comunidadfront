"use client";

const logos = [
  "/logo.png",
  "/quienes.png",
  "/somos.png",
  "/quienes.png",
  "/logo.png",
  "/somos.png",
  "/logo.png",
];

const Sponsor = () => {
  const totalLogos = logos.length;
  const durationPerLogo = 3;
  const totalDuration = totalLogos * durationPerLogo;

  return (
    <aside className="bg-[#D9D9D9] rounded-2xl shadow-md w-36 h-full overflow-hidden flex items-center justify-center">
      <div className="relative w-full h-full overflow-hidden">
        <div
          className="flex flex-col absolute top-0 left-0 w-full animate-scroll-step"
          style={{ animationDuration: `${totalDuration}s` }}
        >
          {[...logos, ...logos].map((src, i) => (
            <div key={i} className="w-full h-40 flex items-center justify-center">
              <img
                src={src}
                alt={`Sponsor ${i}`}
                className="object-contain p-2 max-h-32"
              />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sponsor;
