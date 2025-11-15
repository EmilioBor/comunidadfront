"use server";

import { setSessionToken } from "../lib/api/session";
import { loginAPI } from "@/app/lib/api/auth";

export async function login(formData) {
  let email, password;

  // ☑️ Caso 1: FormData real (form HTML)
  if (typeof formData.get === "function") {
    email = formData.get("email");
    password = formData.get("password");
  } 
  // ☑️ Caso 2: Objeto enviado desde cliente (fetch / axios / form manual)
  else if (typeof formData === "object") {
    email = formData.email;
    password = formData.password;
  }

  if (!email || !password) {
    throw new Error("Debes completar todos los campos.");
  }

  // Llamada al backend
  const res = await loginAPI({ email, password });

  if (!res) {
    throw new Error("No se recibió respuesta del servidor.");
  }

  if (!res.esCorrecto) {
    throw new Error("Credenciales incorrectas.");
  }

  if (!res.token) {
    throw new Error("La respuesta de la API no contiene token.");
  }

  // Guardamos todo en sesión
  await setSessionToken({
    token: res.token,
    id: res.id,
    email: res.email,
    rol: res.rol,
  });

  return { ok: true };
}
