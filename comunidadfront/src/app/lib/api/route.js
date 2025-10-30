// /app/api/login/route.js
import { login } from "@/app/login/actions";

export async function POST(req) {
  try {
    const data = await req.json();
    const result = await login(data);

    if (result && result.token) {
      return Response.json({ success: true, token: result.token });
    } else {
      return Response.json({ success: false, message: "Credenciales inválidas" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error en /api/login:", error);
    return Response.json({ success: false, message: "Error en el servidor" }, { status: 500 });
  }
}
