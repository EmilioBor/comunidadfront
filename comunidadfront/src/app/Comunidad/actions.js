// app/Comunidad/actions.js
'use server';

import { getPublicacionTipo, getPublicacion, crearPublicacion } from "@/app/lib/api/publicacion";
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
export async function obtenerPerfilPorId(id) {
  return await getPerfilId(id);
}

// Obtener perfil por nombre usando el endpoint específico
export async function obtenerPerfilPorNombre(nombre) {
  try {
    // Usar el endpoint específico para obtener perfil por nombre
    const response = await fetch(`https://localhost:7168/api/Publicacion/api/v1/publicacion/perfil/${encodeURIComponent(nombre)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const perfil = await response.json();
    return perfil;
  } catch (error) {
    console.error('Error al obtener perfil por nombre:', error);
    return null;
  }
}

// NUEVA FUNCIÓN: Obtener usuario actualmente logueado
export async function obtenerUsuarioActual() {
  try {
    const response = await fetch('https://localhost:7168/api/user/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const usuario = await response.json();
    return usuario;
  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    return null;
  }
}

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

export async function addPublicacion (data) {
  return await crearPublicacion(data);
}

export async function getPublicacionTipos() {
  return await getPublicacionTipo();
}

//Obtener todas las localidades (esta es la que falta)
export async function fetchLocalidades() {
  try {
    // Si tienes la función GetLocalidadesApi en tu API, úsala:
    if (typeof GetLocalidadesApi !== 'undefined') {
      return await GetLocalidadesApi();
    } else {
      // Si no existe, crea una implementación directa
      const response = await fetch('https://localhost:7168/api/Localidad/api/v1/localidads', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const localidades = await response.json();
      return localidades;
    }
  } catch (error) {
    console.error('Error en fetchLocalidades:', error);
    // Retornar array vacío para evitar errores en la UI
    return [];
  }
}