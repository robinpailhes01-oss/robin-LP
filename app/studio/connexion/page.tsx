import type { Metadata } from "next";
import { safeNext, studioConfigured } from "@/lib/studio/auth";

export const metadata: Metadata = { title: "Connexion" };

/** Connexion au studio : un seul mot de passe, défini dans STUDIO_PASSWORD. */
export default async function StudioLogin({ searchParams }: { searchParams: Promise<{ erreur?: string; next?: string }> }) {
  const { erreur, next } = await searchParams;
  const configured = studioConfigured();
  return (
    <main id="contenu" className="flex min-h-[100dvh] items-center justify-center px-4">
      <div className="w-full max-w-[24rem] rounded-[28px] border border-line bg-white p-7 shadow-[0_30px_60px_-40px_rgba(23,38,61,0.45)] sm:p-8">
        <p className="flex items-center gap-2.5">
          <span className="font-display text-[22px] font-extrabold tracking-[-0.03em] text-night">Luma</span>
          <span className="rounded-full bg-night px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">Studio</span>
        </p>
        <h1 className="mt-6 font-display text-[26px] font-extrabold tracking-[-0.02em] text-night">Le QG de l’agence</h1>
        <p className="mt-2 text-[15px] leading-[1.5] text-ink">Espace privé. Entrez le mot de passe du studio.</p>
        {configured ? (
          <form action="/api/studio/login" method="post" className="mt-6 flex flex-col gap-4">
            <input type="hidden" name="next" value={safeNext(next)} />
            <label className="flex flex-col gap-2 text-[14px] font-semibold text-night">
              Mot de passe
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                autoFocus
                aria-invalid={erreur === "1" || undefined}
                className="h-12 rounded-xl border border-powder bg-white px-4 text-[16px] font-normal text-night focus:border-night focus:outline-none focus-visible:outline-2 focus-visible:outline-night"
              />
            </label>
            {erreur === "1" && (
              <p role="alert" className="text-[14px] font-medium text-night">
                Mot de passe incorrect.
              </p>
            )}
            <button type="submit" className="min-h-12 rounded-full bg-night px-6 text-[15px] font-semibold text-white hover:bg-night-hover">
              Entrer
            </button>
          </form>
        ) : (
          <p role="alert" className="mt-6 rounded-2xl bg-mist p-4 text-[14px] leading-[1.5] text-night">
            Le studio n’a pas encore de mot de passe. Ajoutez la variable <code className="font-semibold">STUDIO_PASSWORD</code> dans Vercel, puis redéployez.
          </p>
        )}
      </div>
    </main>
  );
}
