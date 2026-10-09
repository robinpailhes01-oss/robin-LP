"use client";

/**
 * Filet de sécurité du studio : une erreur de rendu (une donnée corrompue, Supabase qui répond mal…)
 * n’abat plus toute la page. L’en-tête du studio reste en place ; « Réessayer » relance le rendu côté serveur.
 * Aucun détail technique affiché : seul l’identifiant (digest) permet de retrouver l’erreur dans les journaux.
 */
export default function StudioError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <section
      aria-labelledby="erreur-titre"
      className="mx-auto max-w-[36rem] rounded-[24px] border border-line bg-white p-6 text-center sm:mt-6 sm:p-10"
    >
      <h1 id="erreur-titre" className="font-display text-[26px] font-extrabold leading-[1.15] tracking-[-0.02em] text-night text-balance">
        Cette page n’a pas pu s’afficher.
      </h1>
      <p className="mx-auto mt-3 max-w-[30rem] text-[15px] leading-[1.55] text-ink text-pretty">
        Une donnée inattendue a bloqué l’affichage. Réessaie dans un instant&nbsp;; si ça recommence, le reste du studio reste accessible depuis le QG.
      </p>
      <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-night px-6 text-[15px] font-semibold text-white hover:bg-night-hover motion-safe:transition-colors"
        >
          Réessayer
        </button>
        <a
          href="/studio"
          className="inline-flex min-h-11 items-center justify-center rounded-full px-5 text-[15px] font-semibold text-night hover:bg-mist motion-safe:transition-colors"
        >
          Retour au QG
        </a>
      </div>
      {error.digest && <p className="mt-6 text-[12px] text-muted">Référence&nbsp;: {error.digest}</p>}
    </section>
  );
}
