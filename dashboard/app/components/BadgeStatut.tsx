import { STATUT_LABEL } from "@/lib/labels";
import type { Statut } from "@/lib/types";

const STYLE: Record<Statut, { fond: string; point: string; texte: string }> = {
  nouveau: { fond: "ring-1 ring-inset ring-line", point: "bg-line-strong", texte: "text-muted" },
  contacte: { fond: "bg-surface-2 ring-1 ring-inset ring-line", point: "bg-ink-2", texte: "text-ink-2" },
  repondu: { fond: "bg-accent-tint", point: "bg-accent", texte: "text-accent-strong" },
  rdv: { fond: "bg-good-tint", point: "bg-good", texte: "text-good" },
  refus: { fond: "bg-bad-tint", point: "bg-bad", texte: "text-bad" },
  desinscrit: { fond: "bg-surface-2 ring-1 ring-inset ring-line", point: "bg-muted", texte: "text-muted" },
};

export function BadgeStatut({ statut }: { statut: Statut }) {
  const s = STYLE[statut];
  return (
    <span className={`inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[12px] font-medium ${s.fond} ${s.texte}`}>
      <span className={`size-1.5 rounded-full ${s.point}`} aria-hidden />
      {STATUT_LABEL[statut]}
    </span>
  );
}
