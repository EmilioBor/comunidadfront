"use server";

import { logout } from "@/app/lib/api/session";
import { redirect } from "next/navigation";

export async function logoutAction() {
  await logout();
  redirect("/login");
}
