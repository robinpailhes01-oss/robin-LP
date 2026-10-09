import { agents, departments } from "@/lib/studio/agents";
import { AgentAvatar } from "@/components/studio/AgentAvatar";
import { count, parisIsoDate, parisLongDate } from "./format";

/** En-tête du QG : salutation, date du jour (Paris) et taille de l’équipe, calculée depuis les fiches. */
export function HqHeader({ now }: { now: number }) {
  const today = new Date(now);
  const openCount = departments.filter((d) => d.open).length;

  return (
    <header className="hero-in flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="text-[14px] font-medium text-muted">
          <time dateTime={parisIsoDate(today)}>{parisLongDate(today)}</time>
        </p>
        <h1 className="mt-2 font-display text-[40px] font-extrabold leading-[1] tracking-[-0.04em] text-night sm:text-[56px]">Bonjour Robin</h1>
        <p className="mt-3 text-[16px] leading-[1.5] text-ink">
          Ton équipe&nbsp;: {count(agents.length, "agent")} · {count(openCount, "département ouvert", "départements ouverts")}
        </p>
      </div>

      {/* Les visages de l’équipe, décoratifs : la ligne ci-dessus le dit déjà en texte. */}
      <div aria-hidden className="flex items-center">
        {agents.map((a, i) => (
          <span key={a.id} className={`rounded-full bg-paper p-[3px] ${i > 0 ? "-ml-2.5" : ""}`}>
            <AgentAvatar agent={{ name: a.name, avatar: a.avatar }} size={40} />
          </span>
        ))}
      </div>
    </header>
  );
}
