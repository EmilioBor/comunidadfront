import "server-only";
import { cookies } from "next/headers";

export function getSession() {
  const cookieStore = cookies();
  const tokenCookie = cookieStore.get("auth_token");

  if (!tokenCookie) return null;

  return {
    token: tokenCookie.value,
    id: cookieStore.get("auth_id")?.value || null,
    email: cookieStore.get("auth_email")?.value || null,
    rol: cookieStore.get("auth_rol")?.value || null,
  };
}

export function setSessionToken({ token, id, email, rol }) {
  const cookieStore = cookies();

  // Cookie httpOnly con el token (no accesible desde JS en el cliente)
  cookieStore.set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24, // 1 día
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  // Información adicional (no httpOnly) si necesitas leerla desde cliente
  if (email) {
    cookieStore.set({
      name: "auth_email",
      value: String(email),
      httpOnly: false,
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
  }

  if (id) {
    cookieStore.set({
      name: "auth_id",
      value: String(id),
      httpOnly: false,
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
  }

  if (rol) {
    cookieStore.set({
      name: "auth_rol",
      value: String(rol),
      httpOnly: false,
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return true;
}

export function logout() {
  const cookieStore = cookies();
  cookieStore.delete("auth_token");
  cookieStore.delete("auth_email");
}
