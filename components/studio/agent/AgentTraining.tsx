import { Panel, PanelTitle } from "@/components/studio/ui";
import type { Agent, Department } from "@/lib/studio/agents";
import { plural, tint, typo } from "./format";

/** Entraînement : consignes actuelles, ce qu’il reste à apprendre avec Robin, journal (vide à l’étape 1). */
export function AgentTraining({ agent, department }: { agent: Agent; department: Department }) {
  const a = department.accent;
  const { instructions, toLearn } = agent.training;

  return (
    <Panel className="mt-8">
      <PanelTitle kicker="Entraînement" title="Ses consignes, et ce qu’il reste à lui apprendre" />

      <div className="mt-6 grid gap-6 lg:grid-cols-3 lg:gap-8">
        <div>
          <h3 className="font-display text-[16px] font-bold text-night">Consignes actuelles</h3>
          <ol className="mt-4 grid gap-3">
            {instructions.map((t, i) => (
              <li key={t} className="flex gap-3">
                <span aria-hidden className="flex size-7 shrink-0 items-center justify-center rounded-full font-display text-[13px] font-bold" style={{ background: tint(a, 10), color: a }}>
                  {i + 1}
                </span>
                <span className="pt-0.5 text-[15px] leading-[1.5] text-ink">{typo(t)}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <h3 id={`apprendre-${agent.id}`} className="font-display text-[16px] font-bold text-night">
            À apprendre avec toi
          </h3>
          <p className="mt-1 text-[13px] text-muted">
            {toLearn.length > 0 ? `${plural(toLearn.length, "point", "points")} à voir ensemble, aucun validé pour l’instant.` : "Rien à apprendre pour l’instant."}
          </p>
          <ul aria-labelledby={`apprendre-${agent.id}`} className="mt-4 grid gap-2.5">
            {toLearn.map((t) => (
              <li key={t} className="flex items-start gap-3 rounded-2xl border border-line bg-paper px-3.5 py-3">
                <span aria-hidden className="mt-0.5 size-[18px] shrink-0 rounded-[6px] border-[1.5px] border-powder bg-white" />
                <span className="text-[15px] leading-[1.45] text-ink">
                  <span className="sr-only">À faire&nbsp;: </span>
                  {typo(t)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <h3 className="font-display text-[16px] font-bold text-night">Journal d’entraînement</h3>
          <div className="mt-4 rounded-[20px] border border-dashed border-line bg-paper px-5 py-7 text-center">
            <p className="font-display text-[15px] font-bold text-night">Aucune séance pour l’instant.</p>
            <p className="mx-auto mt-1.5 max-w-[22rem] text-[14px] leading-[1.5] text-muted">À l’étape 2, chaque correction que tu feras ici affinera son travail.</p>
          </div>
        </div>
      </div>
    </Panel>
  );
}
