"use client";

import { LiveDot } from "@/components/studio/fx/LiveDot";

/**
 * Filet de sécurité du studio : une erreur de rendu (une donnée corrompue, Supabase qui répond mal…)
 * n’abat plus toute la page. L’en-tête du studio reste en place ; « Réessayer » relance le rendu côté serveur.
 * Aucun détail technique affiché : seul l’identifiant (digest) permet de retrouver l’erreur dans les journaux.
 */
export default function StudioError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <section aria-labelledby="erreur-titre" className="studio-glass studio-glass--raised relative mx-auto max-w-[36rem] overflow-hidden rounded-[28px] p-6 text-center sm:mt-6 sm:p-10">
      <span aria-hidden className="studio-halo absolute left-1/2 top-0 size-64 -translate-x-1/2 -translate-y-1/2 opacity-60 [--halo:#F5C27A]" />
      <p className="relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[12px] font-semibold text-white/80">
        <LiveDot tone="warn" size={6} />
        Affichage interrompu
      </p>
      <h1 id="erreur-titre" className="relative mt-5 font-display text-[28px] font-extrabold leading-[1.08] tracking-[-0.035em] text-white text-balance sm:text-[32px]">
        Cette page n’a pas pu s’afficher.
      </h1>
      <p className="relative mx-auto mt-3 max-w-[30rem] text-[15px] leading-[1.6] text-white/70 text-pretty">
        Une donnée inattendue a bloqué l’affichage. Réessaie dans un instant&nbsp;; si ça recommence, le reste du studio reste accessible depuis le QG.
      </p>
      <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button type="button" onClick={() => retry()} className="studio-btn studio-btn--primary w-full px-6 sm:w-auto">
          Réessayer
        </button>
        <a href="/studio" className="studio-btn studio-btn--ghost w-full sm:w-auto">
          Retour au QG
        </a>
      </div>
      {error.digest && <p className="relative mt-6 text-[12px] text-white/60">Référence&nbsp;: {error.digest}</p>}
    </section>
  );
}
