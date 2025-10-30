"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registrarUsuario } from "./actions";
import axios from "axios";

export default function Registrarse() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const data = { Email: email, Password: password };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  if (password !== confirmPassword) {
    setError("Las contraseñas no coinciden");
    return;
  }

  try {
    const res = await registrarUsuario(data);
    
    // 👇 CAMBIO CLAVE: Verifica si la respuesta tiene un 'id' para confirmar el éxito
    if (res?.id) { 
      const id = res.id; // ✅ Usamos el ID devuelto por el backend
      
      alert("Usuario registrado con éxito");
      console.log("Usuario registrado con ID:", id); 
      
      // ✅ Redirección correcta usando la ruta /Persona/[id]
      router.push(`/Registrarse/Persona?id=${id}`);

      
    } else {
      // Manejar el caso de un registro fallido (por ejemplo, email ya existe)
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
          <h1 className="text-2xl font-bold">Te damos la bienvenida a</h1>
          <h2 className="text-3xl font-[cursive]">Comunidad Solidaria</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          <div>
            <label className="block text-sm font-semibold mb-1">Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="********"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Verificar Contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="********"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

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
