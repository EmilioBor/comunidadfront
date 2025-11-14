'use server'

import { setSessionToken } from "../lib/api/session";
import { loginAPI } from "@/app/lib/api/auth";

export async function login(formData) {

  const res = await loginAPI(formData);

  if (!res?.token) {
    throw new Error("La respuesta de la API no contiene token");
  }

  if (!res.esCorrecto) {
    throw new Error("Credenciales incorrectas");
  }

  // Guardamos todo en sesión
  await setSessionToken({
    token: res.token,
    id: res.id,
    email: res.email,
    rol: res.rol
  });

  return { ok: true };
}
