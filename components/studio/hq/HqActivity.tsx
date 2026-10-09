import type { StudioStats } from "@/lib/studio/data";
import { FadeIn } from "@/components/studio/fx/FadeIn";
import { LiveDot } from "@/components/studio/fx/LiveDot";
import { HqKpis } from "./HqKpis";
import { HqWiring } from "./HqWiring";
import { IncomingLeads } from "./IncomingLeads";

/**
 * Bloc « Activité » du QG, au bout du rail qui descend de l’entrée de l’agence (AgencyFloor) : titre centré sous le rail.
 * Sans valeur réelle (Supabase pas branché, ou lecture en échec) : un seul module « Branchement » (HqWiring).
 * Avec des valeurs lues dans Supabase : les tuiles d’indicateurs (compteurs) puis la liste des demandes entrantes.
 */
export function HqActivity({ stats, now }: { stats: StudioStats; now: number }) {
  const live = stats.connected && !stats.error;

  return (
    <section aria-labelledby="activite-titre">
      <FadeIn trigger="inView" y={18} className="flex flex-col items-center text-center">
        <p className="studio-kicker">Activité</p>
        <h2 id="activite-titre" className="studio-h2 mt-3">
          Ce qui arrive à l’agence
        </h2>
        {live && (
          <p className="studio-chip mt-4">
            <LiveDot tone="ok" size={6} />
            Données réelles · Supabase
          </p>
        )}
      </FadeIn>

      {live ? (
        <>
          <div className="mt-8 sm:mt-10">
            <HqKpis stats={stats} />
          </div>
          <div className="mt-8 sm:mt-10">
            <IncomingLeads stats={stats} now={now} />
          </div>
        </>
      ) : (
        <div className="mt-8 sm:mt-10">
          <HqWiring stats={stats} />
        </div>
      )}
    </section>
  );
}
