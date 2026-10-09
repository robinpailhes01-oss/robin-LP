import type { Metadata } from "next";
import { getStudioStats } from "@/lib/studio/data";
import { HqHeader } from "@/components/studio/hq/HqHeader";
import { AlmaBrief } from "@/components/studio/hq/AlmaBrief";
import { HqKpis } from "@/components/studio/hq/HqKpis";
import { AgencyFloor } from "@/components/studio/hq/AgencyFloor";
import { IncomingLeads } from "@/components/studio/hq/IncomingLeads";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "QG" };

/** Le QG du studio : le point d’Alma, les indicateurs réels, le plan de l’agence et les demandes entrantes. */
export default async function StudioHome() {
  const now = Date.now();
  const stats = await getStudioStats(now);

  return (
    <>
      <HqHeader now={now} />
      <div className="mt-8 space-y-4 sm:mt-10">
        <AlmaBrief stats={stats} />
        <HqKpis stats={stats} />
      </div>
      <div className="mt-14 sm:mt-16">
        <AgencyFloor />
      </div>
      <div className="mt-12 sm:mt-14">
        <IncomingLeads stats={stats} now={now} />
      </div>
    </>
  );
}
