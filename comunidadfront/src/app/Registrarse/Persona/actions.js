'use server'
import { CrearPerfil } from "../../lib/api/perfil";
import {GetLocalidadesApi} from "../../lib/api/localidad";
export async function crearPerfilUsuario(data) {
    return await CrearPerfil(data);
}
export async function obtenerLocalidades() {
    return await GetLocalidadesApi();
}