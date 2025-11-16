'use server'; 
import {obtenerNovedadPorId} from "@/app/lib/api/novedad"

export async function getIdNovedad(id) {
    return await obtenerNovedadPorId(id);
}