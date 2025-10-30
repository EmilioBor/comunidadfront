'use server'
import { RegistroAPI } from "../lib/api/registro";

export async function registrarUsuario(data) {
    return await RegistroAPI(data);
}