"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/Inicio");
    } else {
      setError("Correo o contraseña inválidos");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/background-login.png')" }}
    >
      <div className="rounded-2xl shadow-lg p-10 w-[420px] text-gray-800"
         style={{ backgroundColor: "#C5E9BE" }}>
        {/* Título con logo */}
        <div className="flex items-center justify-center mb-6">
          <img src="/logo.png" alt="logo" className="w-10 h-10 mr-2" />
          <h1 className="text-3xl">Iniciar Sesión</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="bg-white text-gray-800 font-semibold py-2 rounded-lg shadow-md hover:bg-gray-200 transition"
          >
            Iniciar Sesión
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          <a
            href="/registro"
            className="text-gray-700 font-medium hover:underline"
          >
            ¿Todavia no te Registrate? Registrarse
          </a>
        </p>
      </div>
    </div>
  );
}
