'use server'
import { CrearPerfil } from "../../lib/api/perfil";
export async function crearPerfilUsuario(data) {
    return await CrearPerfil(data);
}