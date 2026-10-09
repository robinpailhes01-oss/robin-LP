import Link from "next/link";
import { AgentAvatar } from "@/components/studio/AgentAvatar";
import { DeptBadge, StatusPill } from "@/components/studio/ui";
import type { Agent, Department } from "@/lib/studio/agents";
import { tint, typo } from "./format";
import { Lock } from "./icons";

/** Fil d’Ariane : QG / département / agent. */
export function AgentBreadcrumb({ agent, department }: { agent: Agent; department: Department }) {
  const link = "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-2.5 font-medium text-muted hover:bg-mist hover:text-night motion-safe:transition-colors";
  return (
    <nav aria-label="Fil d’Ariane" className="-ml-2.5">
      <ol className="flex flex-wrap items-center gap-x-0.5 text-[14px]">
        <li>
          <Link href="/studio" className={link}>
            QG
          </Link>
        </li>
        <li aria-hidden className="text-powder">
          /
        </li>
        <li>
          <Link href={`/studio/departements/${department.id}`} className={link}>
            {department.name}
          </Link>
        </li>
        <li aria-hidden className="text-powder">
          /
        </li>
        <li aria-current="page" className="px-2.5 font-semibold text-night">
          {agent.name}
        </li>
      </ol>
    </nav>
  );
}

/** Hero de la fiche personnage : scène teintée de l’accent du département, grand avatar, présentation. */
export function AgentHero({ agent, department }: { agent: Agent; department: Department }) {
  const a = department.accent;
  return (
    <section aria-labelledby="agent-nom" className="relative mt-3 overflow-hidden rounded-[28px] border border-line px-5 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-14" style={{ background: tint(a, 6) }}>
      {/* Décor : cercles fins, discrets, sans animation. */}
      <span aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-[22rem] rounded-full border sm:-right-16 sm:-top-28 sm:size-[30rem]" style={{ borderColor: tint(a, 22) }} />
      <span aria-hidden className="pointer-events-none absolute -right-6 -top-6 size-[13rem] rounded-full border sm:right-10 sm:top-0 sm:size-[18rem]" style={{ borderColor: tint(a, 16) }} />
      <span aria-hidden className="pointer-events-none absolute -bottom-28 -left-20 size-[18rem] rounded-full" style={{ background: tint(a, 10) }} />

      <div className="relative grid items-center gap-8 md:grid-cols-[auto_minmax(0,1fr)] md:gap-12">
        <div className="flex">
          <span aria-hidden className="flex rounded-full bg-white p-2.5 sm:p-3" style={{ boxShadow: `0 0 0 1px ${tint(a, 20)}, 0 18px 40px -28px rgba(23,38,61,0.45)` }}>
            <span className="flex md:hidden">
              <AgentAvatar agent={agent} size={140} animated />
            </span>
            <span className="hidden md:flex">
              <AgentAvatar agent={agent} size={200} animated />
            </span>
          </span>
        </div>

        <div className="hero-in min-w-0">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <DeptBadge department={department} />
            <StatusPill status={agent.status} />
          </div>
          <h1 id="agent-nom" className="t-display mt-4">
            {agent.name}
          </h1>
          <p className="mt-2 font-display text-[19px] font-semibold tracking-[-0.01em] text-ink sm:text-[21px]">{agent.role}</p>

          <blockquote className="mt-6 max-w-[36rem] border-l-2 pl-4 text-[clamp(1.0625rem,1rem+0.5vw,1.3125rem)] leading-[1.5] text-night" style={{ borderColor: a }}>
            <p>«&nbsp;{typo(agent.tagline)}&nbsp;»</p>
          </blockquote>

          <ul aria-label="Personnalité" className="mt-6 flex flex-wrap gap-2">
            {agent.personality.map((p) => (
              <li key={p} className="rounded-full border bg-white/85 px-3.5 py-1.5 text-[13px] font-medium text-ink" style={{ borderColor: tint(a, 28) }}>
                {p}
              </li>
            ))}
          </ul>

          {/* Même libellé que sur le QG : la discussion est annoncée, verrouillée jusqu’à l’étape 2. */}
          <a
            href="#discussion"
            aria-label={`Discuter avec ${agent.name}, disponible à l’étape 2`}
            className="mt-7 inline-flex min-h-11 flex-wrap items-center gap-2.5 rounded-full border border-line bg-white/85 px-5 text-[14px] font-semibold text-night hover:bg-white motion-safe:transition-colors"
          >
            <Lock size={15} className="text-muted" />
            Discuter avec {agent.name}
            <span className="shrink-0 rounded-full bg-mist px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">Étape 2</span>
          </a>
        </div>
      </div>
    </section>
  );
}
