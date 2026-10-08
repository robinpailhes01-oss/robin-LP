"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { changerStatut, enregistrerNotes, ErreurDemo } from "@/lib/db";
import { STATUTS } from "@/lib/labels";
import type { Statut } from "@/lib/types";

const retour = (id: string, msg: string) => `/leads/${encodeURIComponent(id)}?msg=${msg}`;

const issue = (e: unknown) => {
  if (e instanceof ErreurDemo) return "demo";
  console.error(e);
  return "erreur";
};

export async function actionStatut(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const statut = String(formData.get("statut") ?? "") as Statut;
  let msg = "statut";
  if (!STATUTS.includes(statut)) msg = "erreur";
  else {
    try {
      await changerStatut(id, statut);
    } catch (e) {
      msg = issue(e);
    }
  }
  revalidatePath("/", "layout");
  redirect(retour(id, msg));
}

export async function actionNotes(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const notes = String(formData.get("notes") ?? "").slice(0, 5000);
  let msg = "notes";
  try {
    await enregistrerNotes(id, notes);
  } catch (e) {
    msg = issue(e);
  }
  revalidatePath("/", "layout");
  redirect(retour(id, msg));
}
