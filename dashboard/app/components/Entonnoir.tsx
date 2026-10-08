import { fmtNb, fmtPct } from "@/lib/format";
import type { Bloc } from "@/lib/stats";

// Une seule teinte (l'encre) : on compare des quantités qui décroissent. Le violet ne marque que l'arrivée, le RDV.
export function Entonnoir({ bloc }: { bloc: Bloc }) {
  const etapes = [
    { label: "Leads", valeur: bloc.leads, base: null as string | null },
    { label: "Contactés", valeur: bloc.contactes, base: "des leads" },
    { label: "Réponses", valeur: bloc.reponses, base: "des contactés" },
    { label: "RDV", valeur: bloc.rdv, base: "des réponses" },
  ];
  const max = Math.max(bloc.leads, 1);

  return (
    <ol className="divide-y divide-line">
      {etapes.map((e, i) => {
        const precedente = i > 0 ? etapes[i - 1].valeur : null;
        const conversion = precedente ? e.valeur / precedente : null;
        const largeur = e.valeur === 0 ? 0 : Math.max((e.valeur / max) * 100, 1.5);
        return (
          <li key={e.label} className="grid grid-cols-[6.5rem_1fr] items-center gap-x-4 py-3 sm:grid-cols-[8rem_1fr_9rem]">
            <span className="text-[14px] text-ink-2">{e.label}</span>
            <div className="flex items-center gap-3">
              <div className="h-2 flex-1 rounded-full bg-line" aria-hidden>
                <div className={`pousse h-full rounded-full ${i === etapes.length - 1 ? "bg-accent" : "bg-ink"}`} style={{ width: `${largeur}%`, animationDelay: `${i * 90}ms` }} />
              </div>
              <span className="chiffres w-12 text-right text-[17px] font-semibold tracking-[-0.01em] text-ink">{fmtNb(e.valeur)}</span>
            </div>
            <span className="chiffres col-start-2 mt-1 text-[12px] text-muted sm:col-start-3 sm:mt-0 sm:text-right">
              {e.base ? (conversion === null ? "—" : `${fmtPct(conversion)} ${e.base}`) : "collectés"}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
