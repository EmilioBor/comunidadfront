"use server";
import { EnvioPost } from "@/app/lib/api/envio";
import { getDonaciones, getDonacionEstadoNombre } from "@/app/lib/api/donacionApi";
import { getPerfiles, getPerfilNombre } from "@/app/lib/api/perfil";
import { GetLocalidadesApi } from "@/app/lib/api/localidad";

export async function obtenerPerfilNombre(data) {
  return await getPerfilNombre(data);
}

export async function obtenerLocalidades() {
    return await GetLocalidadesApi(); 
}

export async function obtenerDonaciones() {
    return await getDonaciones(); 
}

export async function obtenerDonacionesEstadoNombre(params) {
    return await getDonacionEstadoNombre(params);
    
}

export async function enviarEnvio(data) {
    return await EnvioPost(data);
}

export async function obtenerPerfiles() {
    return await getPerfiles();
}