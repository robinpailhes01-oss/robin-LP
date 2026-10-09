import type { StudioStats } from "@/lib/studio/data";
import { Kpi } from "@/components/studio/ui";

/**
 * Bandeau d’indicateurs. Une valeur n’apparaît que si elle vient de Supabase ;
 * sinon « — » et la raison. Les emails envoyés ne sont reliés à aucune source pour l’instant.
 */
export function HqKpis({ stats }: { stats: StudioStats }) {
  const live = stats.connected && !stats.error;
  const reason = !stats.connected ? "Supabase pas encore connecté" : stats.error ? "Lecture impossible pour le moment" : null;

  return (
    <section aria-labelledby="indicateurs" className="hero-in" style={{ animationDelay: "120ms" }}>
      <h2 id="indicateurs" className="sr-only">
        Indicateurs des 7 derniers jours
      </h2>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label={"Demandes (7\u00a0j)"} value={live ? stats.leadsWeek : null} hint={reason ?? "Audits, rappels et messages du site"} />
        <Kpi label={"Audits (7\u00a0j)"} value={live ? stats.auditsWeek : null} hint={reason ?? "Mini-audits complétés"} />
        <Kpi label={"Rappels (7\u00a0j)"} value={live ? stats.rappelsWeek : null} hint={reason ?? "Demandes de rappel"} />
        <Kpi label={"Emails envoyés (7\u00a0j)"} value={null} hint="Branché quand Inès sera entraînée" />
      </div>
    </section>
  );
}
