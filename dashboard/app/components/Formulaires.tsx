"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import type { Retour } from "@/app/leads/[id]/actions";
import { STATUT_LABEL } from "@/lib/labels";
import type { Statut } from "@/lib/types";

type Action = (avant: Retour, f: FormData) => Promise<Retour>;

// Les statuts que Robin marque à la main (brief : répondu, rdv, refus), plus les deux états posés par les scripts.
const ORDRE: Statut[] = ["repondu", "rdv", "refus", "desinscrit", "contacte", "nouveau"];

const TEXTES: Record<NonNullable<Retour["message"]>, { texte: string; ton: "ok" | "info" | "erreur" }> = {
  statut: { texte: "Statut enregistré.", ton: "ok" },
  notes: { texte: "Notes enregistrées.", ton: "ok" },
  demo: { texte: "Mode démo : rien n'a été enregistré. Ça marchera dès que Supabase sera branché.", ton: "info" },
  erreur: { texte: "L'enregistrement a échoué. Réessaie, et préviens Claude si ça recommence.", ton: "erreur" },
};

function Notice({ etat }: { etat: Retour }) {
  if (!etat.message) return null;
  const n = TEXTES[etat.message];
  return (
    <p
      role="status"
      className={`mt-2 rounded-lg px-3 py-2 text-[13px] leading-5 ${
        n.ton === "ok" ? "bg-good-tint text-good" : n.ton === "info" ? "bg-accent-tint text-ink-2" : "bg-bad-tint text-bad"
      }`}
    >
      {n.texte}
    </p>
  );
}

export function ChoixStatut({ id, statut, action }: { id: string; statut: Statut; action: Action }) {
  const [etat, envoyer] = useActionState(action, { message: null });
  return (
    <form action={envoyer}>
      <input type="hidden" name="id" value={id} />
      <fieldset>
        <legend className="sr-only">Changer le statut</legend>
        <BoutonsStatut courant={statut} />
      </fieldset>
      <Notice etat={etat} />
    </form>
  );
}

function BoutonsStatut({ courant }: { courant: Statut }) {
  const { pending, data } = useFormStatus();
  const enCours = pending ? (data?.get("statut") as Statut | null) : null;
  return (
    <div className="grid grid-cols-3 gap-2">
      {ORDRE.map((s) => {
        const actif = (enCours ?? courant) === s;
        return (
          <button
            key={s}
            type="submit"
            name="statut"
            value={s}
            disabled={pending}
            aria-pressed={actif}
            className={`h-11 rounded-lg text-[14px] font-medium transition-colors disabled:cursor-wait ${
              actif
                ? "bg-ink text-white"
                : "bg-surface text-ink-2 ring-1 ring-inset ring-line-strong hover:text-ink hover:ring-ink/40"
            } ${s === "contacte" || s === "nouveau" ? "text-[13px]" : ""}`}
          >
            {STATUT_LABEL[s]}
          </button>
        );
      })}
    </div>
  );
}

export function Notes({ id, notes, action }: { id: string; notes: string; action: Action }) {
  // Champ contrôlé : React ne le vide pas après l'envoi, donc rien n'est perdu si l'enregistrement échoue.
  const [texte, setTexte] = useState(notes);
  const [etat, envoyer] = useActionState(action, { message: null });
  return (
    <form action={envoyer} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={id} />
      <label htmlFor="notes" className="sr-only">
        Notes
      </label>
      <textarea
        id="notes"
        name="notes"
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
        rows={4}
        maxLength={5000}
        placeholder="Ce qu'il a dit, quand rappeler, ce qu'il faut préparer…"
        className="w-full resize-y rounded-lg border border-line-strong bg-surface px-3 py-2.5 text-[16px] leading-6 text-ink placeholder:text-muted focus:border-accent focus:outline-none sm:text-[15px]"
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Notice etat={etat} />
        </div>
        <BoutonNotes />
      </div>
    </form>
  );
}

function BoutonNotes() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-11 shrink-0 rounded-full bg-accent px-5 text-[14px] font-medium text-white transition-colors hover:bg-accent-strong disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? "Enregistrement…" : "Enregistrer"}
    </button>
  );
}
