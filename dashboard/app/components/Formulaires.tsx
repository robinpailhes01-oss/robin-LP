"use client";

import { useFormStatus } from "react-dom";
import { STATUT_LABEL } from "@/lib/labels";
import type { Statut } from "@/lib/types";

// Les statuts que Robin marque à la main (brief : répondu, rdv, refus), plus les deux états posés par les scripts.
const ORDRE: Statut[] = ["repondu", "rdv", "refus", "desinscrit", "contacte", "nouveau"];

export function ChoixStatut({ id, statut, action }: { id: string; statut: Statut; action: (f: FormData) => Promise<void> }) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <fieldset>
        <legend className="sr-only">Changer le statut</legend>
        <BoutonsStatut courant={statut} />
      </fieldset>
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

export function Notes({ id, notes, action }: { id: string; notes: string; action: (f: FormData) => Promise<void> }) {
  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={id} />
      <label htmlFor="notes" className="sr-only">
        Notes
      </label>
      <textarea
        id="notes"
        name="notes"
        defaultValue={notes}
        rows={4}
        maxLength={5000}
        placeholder="Ce qu'il a dit, quand rappeler, ce qu'il faut préparer…"
        className="w-full resize-y rounded-lg border border-line-strong bg-surface px-3 py-2.5 text-[15px] leading-6 text-ink placeholder:text-muted focus:border-accent focus:outline-none"
      />
      <BoutonNotes />
    </form>
  );
}

function BoutonNotes() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-11 self-end rounded-full bg-accent px-5 text-[14px] font-medium text-white transition-colors hover:bg-accent-strong disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? "Enregistrement…" : "Enregistrer les notes"}
    </button>
  );
}
