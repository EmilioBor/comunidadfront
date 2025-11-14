import { NextResponse } from "next/server";
import { getLoggedUser } from "@/app/lib/api/getLoggedUser";

export async function GET() {
  try {
    const user = await getLoggedUser();
    return NextResponse.json(user || null);
  } catch (error) {
    console.error("Error en /api/user/me:", error);
    return NextResponse.json(null, { status: 500 });
  }
}
