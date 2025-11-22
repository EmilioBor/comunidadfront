import {postNotificacion} from "@/app/lib/api/notificacionApi";
import {getPerfilNombre} from "@/app/lib/api/perfil";
import { getPublicacionNombre } from "../lib/api/publicacion";
export async function enviarNotificacion(data) {
    return await postNotificacion(data);
}

export async function obtenerPerfilNombre(params) {
    return await getPerfilNombre(params);
}

export async function obtenerPublicacionNombre (params) {
    return await getPublicacionNombre(params);
    
}