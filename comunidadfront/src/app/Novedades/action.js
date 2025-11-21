"use server";
import { getNovedades } from "@/app/lib/api/novedad";
import { getPerfilNombre } from "@/app/lib/api/perfil";

export async function obtenerNovedades() {
  return await getNovedades();
}

export async function obtenerPerfilNombre(data) {
  return await getPerfilNombre(data);
}