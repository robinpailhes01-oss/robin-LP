import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AgentChat } from "@/components/studio/agent/AgentChat";
import { AgentColleagues } from "@/components/studio/agent/AgentColleagues";
import { AgentFacts } from "@/components/studio/agent/AgentFacts";
import { AgentBreadcrumb, AgentHero } from "@/components/studio/agent/AgentHero";
import { AgentPager } from "@/components/studio/agent/AgentPager";
import { AgentTraining } from "@/components/studio/agent/AgentTraining";
import { agents, departmentOf } from "@/lib/studio/agents";
import { getStudioStats } from "@/lib/studio/data";

/** Fiche personnage d’un agent : présentation, fiche de poste, entraînement, discussion (verrouillée), équipe. */

export const dynamic = "force-dynamic";

type Params = { id: string };

export function generateStaticParams(): Params[] {
  return agents.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const agent = agents.find((a) => a.id === id);
  if (!agent) return {};
  return { title: agent.name, description: `${agent.role}. ${agent.tagline}` };
}

export default async function AgentPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const agent = agents.find((a) => a.id === id);
  if (!agent) notFound();
  const department = departmentOf(agent);
  // Supabase n’est interrogé que si l’indicateur de l’agent y est relié.
  const stats = agent.kpi.source ? await getStudioStats() : null;

  return (
    <>
      <AgentBreadcrumb agent={agent} department={department} />
      <AgentHero agent={agent} department={department} />
      <AgentFacts agent={agent} department={department} stats={stats} />
      <AgentTraining agent={agent} department={department} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start">
        <AgentChat agent={agent} />
        <AgentColleagues agent={agent} />
      </div>

      <AgentPager agent={agent} />
    </>
  );
}
