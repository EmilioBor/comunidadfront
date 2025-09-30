export default function Colaborar() {
  return (
    // 1. Aumentamos el padding horizontal (px) para empujar el contenido hacia adentro.
    //    'px-8' (~32px) para móviles y 'md:px-20' (~80px) para desktop,
    //    que es significativamente más que los 50px que pides,
    //    asegurando un buen espacio.
    <section className="bg-[#E0F5E0] py-16 md:py-24 px-8 md:px-20">
      
      {/* 2. Mantendremos el Flexbox para centrar y distribuir.
           - Eliminamos el 'max-w-7xl' para que el contenido use más ancho de la pantalla
             y los paddings sean más efectivos.
           - Usamos 'justify-start' para empezar los textos cerca del borde izquierdo
             (que ahora tiene un gran padding).
      */}
      <div className="mx-auto flex flex-col md:flex-row justify-start items-center gap-8 md:gap-16 lg:gap-32 text-center md:text-left">
        
        {/*
          3. Primer texto: 'Colaborá con Comunidad Solidaria'
        */}
        <h2 className="text-3xl md:text-4xl text-[#34495E] leading-snug">
          Colaborá con <br className="hidden md:inline" /> Comunidad Solidaria
        </h2>
        
        {/*
          4. Segundo texto: 'Tu solidaridad es esperanza'
          - Usamos 'md:ml-auto' para empujar este texto completamente a la derecha
            en pantallas grandes, creando el máximo espacio.
        */}
        <p className="text-3xl md:text-4xl text-[#34495E] leading-snug md:ml-auto">
          Tu solidaridad es esperanza
        </p>
      </div>
    </section>
  );
}