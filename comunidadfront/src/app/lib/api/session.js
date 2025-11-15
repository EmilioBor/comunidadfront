import "server-only";
import { cookies } from "next/headers";

// Obtener sesión
export async function getSession() {
  const cookieStore = await cookies(); // <<-- obligatorio

  const tokenCookie = cookieStore.get("auth_token");
  if (!tokenCookie) return null;

  return {
    token: tokenCookie.value,
    id: cookieStore.get("auth_id")?.value || null,
    email: cookieStore.get("auth_email")?.value || null,
    rol: cookieStore.get("auth_rol")?.value || null,
  };
}

// Guardar sesión
export async function setSessionToken({ token, id, email, rol }) {
  const cookieStore = await cookies(); // <<-- obligatorio

  // Token httpOnly
  if (token) {
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 día
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
  }

  // Email accesible desde cliente
  if (email) {
    cookieStore.set("auth_email", String(email), {
      httpOnly: false,
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
  }

  // ID accesible desde cliente
  if (id) {
    cookieStore.set("auth_id", String(id), {
      httpOnly: false,
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
  }

  // Rol accesible desde cliente
  if (rol) {
    cookieStore.set("auth_rol", String(rol), {
      httpOnly: false,
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return true;
}

// Logout
export async function logout() {
  const cookieStore = await cookies();

  cookieStore.delete("auth_token");
  cookieStore.delete("auth_email");
  cookieStore.delete("auth_id");
  cookieStore.delete("auth_rol");

  return true;
}

