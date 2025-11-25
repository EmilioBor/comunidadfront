"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {login} from './action';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setContaseña] = useState("");
  const [error, setError] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const data = { email, password };


    try {
      const response = await login(data);

        if (response && response.ok) {
            window.location.href = "/Inicio";
        } else {
          setError("Correo o contraseña inválidos");
          console.error("La respuesta de la API no contiene token");
        }

        console.log("Datos adicionales:", response);
        } catch (error: any) {
          setError("Error al iniciar sesión");
          console.error(
            "Error en el login:",
            error.response ? error.response.data : error.message
          );
        }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/background-login.png')" }}>
      <div className="rounded-2xl shadow-lg p-10 w-[420px] text-gray-800" style={{ backgroundColor: "#C5E9BE" }}>
        <div className="flex items-center justify-center mb-6">
          <img src="/logo.png" alt="logo" className="w-10 h-10 mr-2" />
          <h1 className="text-3xl">Iniciar Sesión</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Correo</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 
               bg-white text-black placeholder:text-gray-400
               focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setContaseña(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 
               bg-white text-black placeholder:text-gray-400
               focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="********"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="bg-white text-gray-800 font-semibold py-2 rounded-lg shadow-md hover:bg-gray-200 transition"
          >
            Iniciar Sesión
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          ¿Todavía no tenes cuenta?{" "}
          <a href="/Registrarse" className="text-gray-700 font-medium hover:underline">
            Registrarse
          </a>
        </p>
      </div>
    </div>
  );
}
