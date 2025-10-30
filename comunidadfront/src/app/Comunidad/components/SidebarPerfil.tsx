"use client";
import { useEffect, useState } from "react";
import { getPerfilById } from "../actions";

const SidebarPerfil = () => {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const data = await getPerfilById(2); // reemplazar x el ID real del usuario
        setPerfil(data);
      } catch (err) {
        setError("No se pudo cargar el perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, []);

  if (loading) return <p>Cargando perfil...</p>;
  if (error) return <p>{error}</p>;

  return (
    <aside className="bg-white rounded-2xl shadow-md overflow-hidden w-full max-w-xs">
      <div className="bg-[#84CEDB] h-40 rounded-t-2xl"></div>

      <div className="flex flex-col items-center -mt-12 pb-6">
      <img
          src={perfil?.imagen ? `data:image/png;base64,${perfil.imagen}` : "/default-avatar.png"}
          alt="Foto perfil"
          className="w-37 h-37 rounded-full object-cover border-4 border-[grey]"
        />
        
        <p className="mt-3 font-medium text-gray-800">
          {perfil?.razonSocial || "Usuario desconocido"}
        </p>

        <div className="mt-4 flex flex-col gap-2 w-4/5">
          <button className="bg-[#7DB575] text-white py-2 rounded-xl hover:bg-green-600 transition">
            Donaciones
          </button>
          <button className="bg-[#7DB575] text-white py-2 rounded-xl hover:bg-green-600 transition">
            Chats
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SidebarPerfil;
