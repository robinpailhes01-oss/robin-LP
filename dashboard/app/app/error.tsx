"use client";

export default function Erreur({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[36rem] flex-col justify-center px-4">
      <p className="repere">Erreur</p>
      <h1 className="mt-2 text-[24px] font-semibold tracking-[-0.02em] text-ink">Impossible de charger les données.</h1>
      <p className="mt-2 text-[15px] leading-6 text-ink-2">
        La base Supabase n&apos;a pas répondu correctement. Réessaie dans un instant ; si ça persiste, transmets ce code à Claude
        {error.digest ? ` : ${error.digest}` : "."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 h-11 self-start rounded-full bg-accent px-5 text-[14px] font-medium text-white hover:bg-accent-strong"
      >
        Réessayer
      </button>
    </main>
  );
}
