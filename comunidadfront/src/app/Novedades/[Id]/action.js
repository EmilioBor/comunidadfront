'use server'; 
import { getNovedadPorId } from "@/app/lib/api/novedad";

export async function obtenerNovedadPorId(id) {
  return await getNovedadPorId(id);
}