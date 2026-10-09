import type { Metadata } from "next";
import { getStudioStats } from "@/lib/studio/data";
import { HqHeader } from "@/components/studio/hq/HqHeader";
import { AlmaBrief } from "@/components/studio/hq/AlmaBrief";
import { HqKpis } from "@/components/studio/hq/HqKpis";
import { AgencyFloor } from "@/components/studio/hq/AgencyFloor";
import { IncomingLeads } from "@/components/studio/hq/IncomingLeads";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "QG" };

/**
 * Le QG du studio, dans cet ordre : l’en-tête, la priorité du jour, le plan de l’agence (le cœur de la page,
 * placé le plus haut possible), puis un bloc « activité » : les indicateurs réels et les demandes entrantes.
 */
export default async function StudioHome() {
  const now = Date.now();
  const stats = await getStudioStats(now);

  return (
    <>
      <HqHeader now={now} />
      <div className="mt-8">
        <AlmaBrief stats={stats} />
      </div>
      <div className="mt-12 sm:mt-14">
        <AgencyFloor />
      </div>
      <div className="mt-12">
        <HqKpis stats={stats} />
      </div>
      <div className="mt-4">
        <IncomingLeads stats={stats} now={now} />
      </div>
    </>
  );
}
