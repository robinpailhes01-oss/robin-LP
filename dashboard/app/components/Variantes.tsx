import { fmtNb } from "@/lib/format";
import { SEUIL_PREUVE } from "@/lib/labels";
import type { Stats } from "@/lib/stats";
import type { Variante } from "@/lib/types";
import { Reglette } from "./Reglette";

const COULEUR: Record<Variante, { trait: string; piste: string; texte: string }> = {
  "1": { trait: "bg-v1", piste: "bg-v1-track", texte: "text-v1" },
  "2": { trait: "bg-v2", piste: "bg-v2-track", texte: "text-v2" },
};

// Élément signature : le « compteur de preuve ». Tant qu'une variante n'a pas 100 envois,
// la jauge reste incomplète et le verdict reste une tendance.
export function Variantes({ variantes }: { variantes: Stats["variantes"] }) {
  const v1 = variantes["1"];
  const v2 = variantes["2"];
  const assez = v1.contactes >= SEUIL_PREUVE && v2.contactes >= SEUIL_PREUVE;

  return (
    <div>
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line">
        {(["1", "2"] as Variante[]).map((v) => {
          const b = variantes[v];
                    return (
            <div key={v} className="flex flex-col bg-surface p-4 sm:p-5">
              <p className="flex items-center gap-2 text-[13px] font-medium text-ink">
                <span className={`size-2.5 rounded-[3px] ${COULEUR[v].trait}`} aria-hidden />
                Variante {v}
              </p>
              <p className="mt-1 text-[12px] leading-5 text-muted sm:line-clamp-2 sm:min-h-[2.5rem]">
                {b.objet ? `« ${b.objet} »` : "Pas encore d'envoi"}
              </p>
              <p className="mt-3 flex items-start text-[34px] font-semibold leading-none tracking-[-0.03em] text-ink sm:text-[40px]">
                {b.taux === null ? (
                  "—"
                ) : (
                  <>
                    {Math.round(b.taux * 100)}
                    <span className={`ml-0.5 mt-[0.1em] text-[0.5em] font-medium tracking-normal ${COULEUR[v].texte}`}>%</span>
                  </>
                )}
              </p>
              <p className="chiffres mt-1.5 text-[12px] text-ink-2">
                {fmtNb(b.reponses)} rép. / {fmtNb(b.contactes)} envois
              </p>
              <div
                className="mt-4"
                role="meter"
                aria-valuemin={0}
                aria-valuemax={SEUIL_PREUVE}
                aria-valuenow={Math.min(b.contactes, SEUIL_PREUVE)}
                aria-label={
                  b.contactes >= SEUIL_PREUVE
                    ? `Variante ${v} : ${b.contactes} envois, seuil de ${SEUIL_PREUVE} atteint`
                    : `Variante ${v} : ${b.contactes} envois sur les ${SEUIL_PREUVE} nécessaires pour conclure`
                }
              >
                <Reglette valeur={b.contactes} max={SEUIL_PREUVE} trait={COULEUR[v].trait} piste={COULEUR[v].piste} />
              </div>
              <p className="repere chiffres mt-2 !tracking-[0.04em]">
                {Math.min(b.contactes, SEUIL_PREUVE)}/{SEUIL_PREUVE} envois
              </p>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[13px] leading-5 text-ink-2">{verdict(v1, v2, assez)}</p>
    </div>
  );
}

function verdict(v1: Stats["variantes"]["1"], v2: Stats["variantes"]["2"], assez: boolean) {
  if (v1.taux === null || v2.taux === null) return "Les deux variantes doivent être envoyées avant toute comparaison.";
  const ecart = Math.round((v1.taux - v2.taux) * 100);
  if (ecart === 0) return assez ? "Égalité sur plus de 100 envois chacune." : "Égalité pour l'instant. Trop tôt pour conclure.";
  const devant = ecart > 0 ? "1" : "2";
  const pts = `${Math.abs(ecart)} pt${Math.abs(ecart) > 1 ? "s" : ""}`;
  return assez
    ? `La variante ${devant} répond mieux de ${pts}, sur plus de ${SEUIL_PREUVE} envois chacune.`
    : `Tendance : la variante ${devant} devance de ${pts}. Sous ${SEUIL_PREUVE} envois par variante, ce n'est pas une preuve.`;
}
