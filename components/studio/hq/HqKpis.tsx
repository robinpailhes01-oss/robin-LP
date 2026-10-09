import type { StudioStats } from "@/lib/studio/data";
import { Kpi, Panel } from "@/components/studio/ui";

const NBSP = " ";

const LABELS = {
  leads: `Demandes (7${NBSP}j)`,
  audits: `Audits (7${NBSP}j)`,
  rappels: `Rappels (7${NBSP}j)`,
  drafts: `Brouillons (7${NBSP}j)`,
};

const titleClass = "font-display text-[17px] font-bold tracking-[-0.01em] text-night";

/**
 * Indicateurs des 7 derniers jours. Une valeur n’apparaît que si elle vient de Supabase.
 * Supabase pas encore branché : un bloc compact (les intitulés et quand ils seront branchés) plutôt que quatre « — ».
 * Lecture en échec : les cartes restent, avec la raison. Les brouillons d’Inès ne sont reliés à aucune source pour l’instant.
 */
export function HqKpis({ stats }: { stats: StudioStats }) {
  if (!stats.connected) {
    return (
      <Panel className="py-4 sm:py-5">
        <h2 id="indicateurs" className={titleClass}>
          Indicateurs des 7 derniers jours
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {Object.values(LABELS).map((label) => (
            <li key={label} className="rounded-full border border-line bg-paper px-3 py-1 text-[13px] font-medium text-muted">
              {label}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[13px] leading-[1.5] text-muted text-pretty">
          Branchés dès que Supabase sera connecté. Les brouillons, après l’entraînement d’Inès.
        </p>
      </Panel>
    );
  }

  const live = !stats.error;
  const reason = stats.error ? "Lecture impossible pour le moment" : null;

  return (
    <section aria-labelledby="indicateurs">
      <h2 id="indicateurs" className={titleClass}>
        Indicateurs des 7 derniers jours
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label={LABELS.leads} value={live ? stats.leadsWeek : null} hint={reason ?? "Audits, rappels et messages du site"} />
        <Kpi label={LABELS.audits} value={live ? stats.auditsWeek : null} hint={reason ?? "Mini-audits complétés"} />
        <Kpi label={LABELS.rappels} value={live ? stats.rappelsWeek : null} hint={reason ?? "Demandes de rappel"} />
        <Kpi label={LABELS.drafts} value={null} hint="Branché quand Inès sera entraînée" />
      </div>
    </section>
  );
}
