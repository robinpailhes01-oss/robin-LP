import Link from "next/link";
import { PlannedAvatar } from "@/components/studio/AgentAvatar";
import { Panel } from "@/components/studio/ui";
import type { Department } from "@/lib/studio/agents";
import { tint } from "@/components/studio/agent/format";
import { ArrowRight, Lock } from "@/components/studio/agent/icons";

/** Département pas encore ouvert : sobre, sans bouton factice. */
export function ClosedDept({ department }: { department: Department }) {
  const roles = department.plannedRoles ?? [];
  return (
    <Panel className="mt-10">
      <div className="mx-auto max-w-[40rem] py-4 text-center sm:py-8">
        <span aria-hidden className="mx-auto flex size-12 items-center justify-center rounded-full" style={{ background: tint(department.accent, 12), color: department.accent }}>
          <Lock size={20} />
        </span>
        <h2 className="mt-4 font-display text-[22px] font-bold tracking-[-0.02em] text-night">Département pas encore ouvert</h2>
        <p className="mt-2 text-[15px] leading-[1.55] text-ink">On l’ouvrira quand la prospection tournera.</p>
      </div>

      {roles.length > 0 && (
        <div className="mx-auto max-w-[40rem]">
          <p className="t-kicker text-center">Postes prévus</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {roles.map((r) => (
              <li key={r} className="flex items-center gap-4 rounded-[20px] border border-dashed border-powder bg-paper p-4">
                <PlannedAvatar size={48} />
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold text-night">{r}</p>
                  <p className="text-[13px] text-muted">Pas encore pourvu</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex justify-center pb-2">
        <Link
          href="/studio/departements/prospection"
          className="group inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[14px] font-semibold text-night hover:bg-mist motion-safe:transition-colors"
        >
          Voir la prospection
          <ArrowRight size={15} className="motion-safe:transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </Panel>
  );
}
