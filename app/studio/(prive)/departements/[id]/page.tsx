import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AgentCard } from "@/components/studio/dept/AgentCard";
import { ClosedDept } from "@/components/studio/dept/ClosedDept";
import { DeptHeader } from "@/components/studio/dept/DeptHeader";
import { NinaQueue } from "@/components/studio/dept/NinaQueue";
import { DirectionFlow, GenericFlow, ProspectionFlow } from "@/components/studio/dept/TeamFlow";
import { plural } from "@/components/studio/agent/format";
import { agents, agentsOf, departments, manager } from "@/lib/studio/agents";
import { getStudioStats } from "@/lib/studio/data";

/** Page d’un département : son organisation, son équipe et, pour la prospection, la file des demandes. */

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

      <div className="mt-10 grid gap-10">
        {department.id === "prospection" ? (
          <ProspectionFlow department={department} />
        ) : department.id === "direction" ? (
          <DirectionFlow department={department} manager={manager} />
        ) : (
          <GenericFlow department={department} team={team} />
        )}

        {team.length > 0 && (
          <section aria-labelledby="equipe-titre">
            <p className="t-kicker">{plural(team.length, "agent", "agents")}</p>
            <h2 id="equipe-titre" className="mt-1 font-display text-[24px] font-bold tracking-[-0.02em] text-night">
              L’équipe
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {team.map((a) => (
                <AgentCard key={a.id} agent={a} department={department} stats={stats} />
              ))}
            </div>
          </section>
        )}

        {department.id === "prospection" && <NinaQueue stats={stats} owner={nina} accent={department.accent} />}
      </div>
    </>
  );
}
