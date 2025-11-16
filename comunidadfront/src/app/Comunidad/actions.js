'use server';

import { getPublicacionTipo, getPublicacion } from "@/app/lib/api/publicacion";
import { getPerfilNombre, getPerfilId } from "@/app/lib/api/perfil";
import { getProvincias, getLocalidadesByProvincia, gethProvinciaById } from "../lib/api/provincia";
import { GetLocalidadesByID } from "@/app/lib/api/localidad";

export async function obtenerPublicacionTipo(params) {
   return await getPublicacionTipo(params);
}

export async function obtenerPublicaciones() {
  return await getPublicacion();
}


export async function obtenerPerfilNombre(params) {
  return await getPerfilNombre(params);
}
// Obtener perfil por ID
export async function getPerfilById(id) {
  return await getPerfilId(id);
};


// Obtener todas las provincias
export async function fetchProvincias () {
  return await getProvincias();
};

// Obtener todas las localidades de una provincia
export async function fetchLocalidadesByProvincia (provinciaId)  {
  return await getLocalidadesByProvincia(provinciaId);
};

// Obtener provincia por ID
export async function fetchProvinciaById(id){
    return  await gethProvinciaById(id);
};

// Obtener localidad por ID
export async function fetchLocalidadById(id){
  return await GetLocalidadesByID(id);
};


