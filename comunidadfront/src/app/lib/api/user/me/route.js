import { getLoggedUser } from "@/app/lib/api/getLoggedUser";

export async function GET() {
  const user = await getLoggedUser();
  return Response.json(user || null);
}
