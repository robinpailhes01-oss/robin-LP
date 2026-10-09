import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClosedDept } from "@/components/studio/dept/ClosedDept";
import { DeptHeader } from "@/components/studio/dept/DeptHeader";
import { NinaQueue } from "@/components/studio/dept/NinaQueue";
import { TeamSection } from "@/components/studio/dept/TeamSection";
import { DirectionFlow, GenericFlow, ProspectionFlow } from "@/components/studio/dept/TeamFlow";
import { deptGlow } from "@/components/studio/fx/tokens";
import { agents, agentsOf, departments, manager } from "@/lib/studio/agents";
import { getStudioStats } from "@/lib/studio/data";

/**
 * Page d’un département : en-tête lumineux (l’équipe en bustes), son équipe en cartes personnages juste dessous,
 * puis son organisation en schémas de flux et, pour la prospection, la file des demandes du site.
 * Département fermé : une pièce sobre avec les postes prévus.
 */

export const dynamic = "force-dynamic";

type Params = { id: string };

export function generateStaticParams(): Params[] {
  return departments.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const department = departments.find((d) => d.id === id);
  if (!department) return {};
  return { title: department.name, description: department.description };
}

export default async function DepartmentPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const department = departments.find((d) => d.id === id);
  if (!department) notFound();
  const team = agentsOf(department.id);

  if (!department.open) {
    return (
      <>
        <DeptHeader department={department} team={team} />
        <ClosedDept department={department} />
      </>
    );
  }

  const stats = await getStudioStats();
  const nina = department.id === "prospection" ? agents.find((a) => a.id === "nina") : undefined;

  return (
    <>
      <DeptHeader department={department} team={team} />

      {/* Les personnages d’abord, juste sous l’en-tête ; puis l’organisation, puis la file des demandes. */}
      <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-20 sm:mt-16 sm:gap-28">
        <TeamSection department={department} team={team} stats={stats} />

        {department.id === "prospection" ? (
          <ProspectionFlow department={department} />
        ) : department.id === "direction" ? (
          <DirectionFlow department={department} manager={manager} />
        ) : (
          <GenericFlow department={department} team={team} />
        )}

        {nina && <NinaQueue stats={stats} owner={nina} accent={deptGlow(department.id)} />}
      </div>
    </>
  );
}
