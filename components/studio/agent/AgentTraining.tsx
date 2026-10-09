import { FadeIn, Stagger } from "@/components/studio/fx/FadeIn";
import { GlassCard } from "@/components/studio/fx/GlassCard";
import { deptGlow } from "@/components/studio/fx/tokens";
import type { Agent, Department } from "@/lib/studio/agents";
import { glow, plural, typo } from "./format";
import { EmptyState, IconChip, SectionHeading } from "./kit";
import { Book, Clock, Sparkle } from "./icons";

/** Entraînement : consignes actuelles, ce qu’il reste à apprendre avec Robin, journal (vide à l’étape 1). */
export function AgentTraining({ agent, department }: { agent: Agent; department: Department }) {
  const accent = deptGlow(department.id);
  const { instructions, toLearn } = agent.training;
  const learnId = `apprendre-${agent.id}`;

  return (
    <section aria-labelledby="entrainement-titre" className="mt-16 sm:mt-24">
      <FadeIn trigger="inView">
        <SectionHeading id="entrainement-titre" kicker="Entraînement" title="Ses consignes, et ce qu’il reste à lui apprendre" accent={accent} />
      </FadeIn>

      <GlassCard variant="raised" pad="none" radius="xl" className="mt-8 overflow-hidden">
        <div className="grid lg:grid-cols-3">
          {/* Consignes actuelles */}
          <div className="p-5 sm:p-8">
            <h3 className="studio-h3 flex items-center gap-3">
              <IconChip accent={accent}>
                <Book size={18} />
              </IconChip>
              Consignes actuelles
            </h3>
            <Stagger as="ol" trigger="inView" step={0.08} className="mt-6 grid gap-4">
              {instructions.map((t, i) => (
                <li key={t} className="flex gap-3.5">
                  <span
                    aria-hidden
                    className="studio-num flex size-8 shrink-0 items-center justify-center rounded-full border font-display text-[13px] font-bold"
                    style={{
                      // Chiffre éclairci (45 % de l’accent, le reste en blanc) : en bleu électrique pur sur sa teinte, il passait sous AA.
                      color: `color-mix(in srgb, ${accent} 45%, white)`,
                      borderColor: glow(accent, 45),
                      background: glow(accent, 10),
                      boxShadow: `0 0 18px -6px ${accent}`,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="pt-1 text-[15px] leading-[1.55] text-white/80">{typo(t)}</span>
                </li>
              ))}
            </Stagger>
          </div>

          {/* À apprendre avec toi */}
          <div className="border-t border-white/[0.08] p-5 sm:p-8 lg:border-l lg:border-t-0">
            <h3 id={learnId} className="studio-h3 flex items-center gap-3">
              <IconChip accent={accent}>
                <Sparkle size={18} />
              </IconChip>
              À apprendre avec toi
            </h3>
            <p className="mt-3 text-[13px] leading-[1.5] text-white/65">
              {toLearn.length > 0 ? `${plural(toLearn.length, "point", "points")} à voir ensemble, aucun validé pour l’instant.` : "Rien à apprendre pour l’instant."}
            </p>
            <Stagger as="ul" aria-labelledby={learnId} trigger="inView" step={0.08} className="mt-5 grid gap-2.5">
              {toLearn.map((t) => (
                <li key={t} className="flex items-start gap-3 rounded-[14px] border border-white/[0.08] bg-[rgb(202_223_237/0.03)] px-3.5 py-3">
                  <span aria-hidden className="mt-0.5 size-[18px] shrink-0 rounded-[6px] border-[1.5px] border-dashed border-[#CADFED]/50" />
                  <span className="text-[15px] leading-[1.45] text-white/80">
                    <span className="sr-only">À faire&nbsp;: </span>
                    {typo(t)}
                  </span>
                </li>
              ))}
            </Stagger>
          </div>

          {/* Journal d’entraînement : vide tant que la discussion n’est pas branchée. */}
          <div className="border-t border-white/[0.08] p-5 sm:p-8 lg:border-l lg:border-t-0">
            <h3 className="studio-h3 flex items-center gap-3">
              <IconChip accent={accent}>
                <Clock size={18} />
              </IconChip>
              Journal d’entraînement
            </h3>
            <EmptyState icon={<Book size={20} />} title="Aucune séance pour l’instant." className="mt-6">
              À l’étape&nbsp;2, chaque correction que tu feras ici affinera son travail.
            </EmptyState>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
