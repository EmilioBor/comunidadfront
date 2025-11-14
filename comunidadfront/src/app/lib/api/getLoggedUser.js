'use server'
import { getSession } from "./session";
import axios from "axios";

export async function getLoggedUser() {
  const session = await getSession();

  if (!session?.token || !session?.id) return null;

  try {
    const perfilRes = await axios.get(
      `https://localhost:7168/api/Perfil/v1/perfil/user/${session.id}`,
      {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      }
    );

    return {
      id: session.id,
      email: session.email,
      rol: session.rol,
      token: session.token,
      perfil: perfilRes.data
    };

  } catch (e) {
    console.log("Error cargando perfil:", e);
    return null;
  }
}
