"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registrarUsuario } from "./actions";

export default function Registrarse() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [rol, setRol] = useState(""); // 👈 Nuevo estado para el rol
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // 👇 Ahora incluimos el campo "rol" como lo necesita la API
  const data = { 
    email: email, 
    password: password,
    rol: rol
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await registrarUsuario(data);
      
      if (res?.id) { 
        const id = res.id;

        alert("Usuario registrado con éxito");
        console.log("Usuario registrado con ID:", id);

        router.push(`/Registrarse/Persona?id=${id}`);

      } else {
        setError("Error al registrarse. Intenta con otro correo.");
      }
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/background-login.png')" }}
    >
      <div
        className="rounded-2xl shadow-lg p-10 w-[420px] text-gray-800 text-center"
        style={{ backgroundColor: "#C5E9BE" }}
      >
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="logo" className="w-12 h-12 mb-2" />
          <h1 className="text-2xl">Te damos la bienvenida a</h1>
          <h2 className="text-3xl font-bold">Comunidad Solidaria</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-semibold mb-1">Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 
               bg-white text-black placeholder:text-gray-400
               focus:outline-none focus:ring-2 focus:ring-green-400"  
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          {/* ROL SELECT */}
          <div>
            <label className="block text-sm font-semibold mb-1">Rol</label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="
                w-full px-3 py-2 
                rounded-t-lg 
                rounded-b-[16px]   /* 👈 borde inferior de 16px */
                border border-gray-300 
                bg-white 
                focus:outline-none focus:ring-2 focus:ring-green-400
                text-gray-700
              "
            >
              <option value="" disabled>
                Elige tipo de usuario...
              </option>
              <option value="Persona">Persona</option>
              <option value="Empresa">Empresa</option>
            </select>
          </div>


          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-semibold mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 
               bg-white text-black placeholder:text-gray-400
               focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="********"
              required
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block text-sm font-semibold mb-1">Verificar Contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 
               bg-white text-black placeholder:text-gray-400
               focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="********"
              required
            />
          </div>

          {/* ERROR */}
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          {/* SUBMIT */}
          <button
            type="submit"
            className="bg-white text-gray-800 font-semibold py-2 rounded-lg shadow-md hover:bg-gray-200 transition"
          >
            Siguiente
          </button>

        </form>
      </div>
    </div>
  );
}
