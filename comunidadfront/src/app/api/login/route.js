import { NextResponse } from "next/server";
import { login } from "@/app/login/action";

export async function POST(req) {
  try {
    const data = await req.json();

    const result = await login(data);

    if (result && result.ok) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: "Credenciales inválidas" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error en /api/login:", error);
    return NextResponse.json({ success: false, message: "Error en el servidor" }, { status: 500 });
  }
}
