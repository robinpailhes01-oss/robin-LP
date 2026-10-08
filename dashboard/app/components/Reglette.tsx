// La voix « carnet de bord » : des crans qu'on coche, comme un relevé de navigation.

// Réglette des 100 envois : 20 crans de 5 envois. Le cran en cours se remplit en partie.
export function Reglette({ valeur, max, trait, piste }: { valeur: number; max: number; trait: string; piste: string }) {
  const crans = 20;
  const parCran = max / crans;
  return (
    <div className="flex h-3.5 items-end gap-[3px]" aria-hidden>
      {Array.from({ length: crans }, (_, i) => {
        const rempli = Math.max(0, Math.min(1, (valeur - i * parCran) / parCran));
        return (
          <span key={i} className={`relative ${(i + 1) % 5 === 0 ? "h-3.5" : "h-2.5"} flex-1 overflow-hidden rounded-[1.5px] ${piste}`}>
            {rempli > 0 && (
              <span
                className={`pousse absolute inset-y-0 left-0 ${trait}`}
                style={{ width: `${rempli * 100}%`, animationDelay: `${i * 30}ms` }}
              />
            )}
          </span>
        );
      })}
    </div>
  );
}

// Score sur 10 : dix crans verticaux, lisibles d'un coup d'œil dans une liste.
export function Crans({ score }: { score: number | null }) {
  if (score === null) return <span className="chiffres text-[12px] text-muted">—</span>;
  return (
    <span className="inline-flex items-center gap-2" title={`Score ${score} sur 10`}>
      <span className="flex h-3 items-end gap-[2px]" aria-hidden>
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className={`w-[3px] rounded-[1px] ${i < score ? "bg-ink" : "bg-line-strong"}`}
            style={{ height: `${45 + i * 6}%` }}
          />
        ))}
      </span>
      <span className="chiffres font-mono text-[12px] text-ink-2">
        <span className="sr-only">Score </span>
        <span className="font-semibold text-ink">{score}</span>/10
      </span>
    </span>
  );
}
