'use server'; 
import {getNovedades} from "@/app/lib/api/novedad"
export async function obtenerNovedades() {
    return await getNovedades();
} 