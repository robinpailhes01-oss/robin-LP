import type { Metadata } from "next";
import { getStudioStats } from "@/lib/studio/data";
import { HqHero } from "@/components/studio/hq/HqHero";
import { AlmaCommand } from "@/components/studio/hq/AlmaCommand";
import { AgencyFloor } from "@/components/studio/hq/AgencyFloor";
import { HqActivity } from "@/components/studio/hq/HqActivity";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "QG" };

/**
 * Le QG du studio, dans cet ordre : l’en-tête (« Bonjour Robin » et l’équipe), la carte de commandement d’Alma
 * (priorité du jour), le plan de l’agence (le cœur de la page), puis, au bout du rail de l’entrée, l’activité :
 * le module « Branchement » tant que Supabase n’est pas lisible, sinon les indicateurs réels et les demandes entrantes.
 * Toutes les données viennent de getStudioStats, côté serveur ; rien n’est inventé.
 */
export default async function StudioHome() {
  const now = Date.now();
  const stats = await getStudioStats(now);

  return (
    <div className="pb-6 sm:pt-4">
      <HqHero now={now} />
      <div className="mt-10 sm:mt-14 lg:mt-16">
        <AlmaCommand stats={stats} />
      </div>
      <div className="mt-20 sm:mt-28 lg:mt-32">
        <AgencyFloor />
      </div>
      {/* Pas de grand vide ici : le rail de l’entrée (fin d’AgencyFloor) descend jusqu’au titre « Activité ». */}
      <div className="mt-3">
        <HqActivity stats={stats} now={now} />
      </div>
    </div>
  );
}
