"use server";

import { revalidatePath } from "next/cache";
import { changerStatut, enregistrerNotes, ErreurDemo } from "@/lib/db";
import { STATUTS } from "@/lib/labels";
import type { Statut } from "@/lib/types";

// Les actions renvoient un état au lieu de rediriger : la page se met à jour sur place,
// et ce que Robin a tapé reste dans le champ si l'enregistrement échoue.
export type Retour = { message: "statut" | "notes" | "demo" | "erreur" | null };

const issue = (e: unknown): Retour => {
  if (e instanceof ErreurDemo) return { message: "demo" };
  console.error(e);
  return { message: "erreur" };
};

export async function actionStatut(_avant: Retour, formData: FormData): Promise<Retour> {
  const id = String(formData.get("id") ?? "");
  const statut = String(formData.get("statut") ?? "") as Statut;
  if (!STATUTS.includes(statut)) return { message: "erreur" };
  try {
    await changerStatut(id, statut);
  } catch (e) {
    return issue(e);
  }
  revalidatePath("/", "layout");
  return { message: "statut" };
}

export async function actionNotes(_avant: Retour, formData: FormData): Promise<Retour> {
  const id = String(formData.get("id") ?? "");
  const notes = String(formData.get("notes") ?? "").slice(0, 5000);
  try {
    await enregistrerNotes(id, notes);
  } catch (e) {
    return issue(e);
  }
  revalidatePath("/", "layout");
  return { message: "notes" };
}
