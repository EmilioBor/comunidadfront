"use server";

import { CreaNovedad } from "@/app/lib/api/novedad";

export async function addNovedad(formData) {
  return await CreaNovedad(formData);
}
