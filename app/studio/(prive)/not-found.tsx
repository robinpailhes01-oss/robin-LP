import type { Metadata } from "next";
import Link from "next/link";
import { Panel } from "@/components/studio/ui";

export const metadata: Metadata = { title: "Fiche introuvable" };

/** Agent ou département inconnu (notFound() dans agents/[id] et departements/[id]) : message en français, dans le cadre du studio. */
export default function StudioNotFound() {
  return (
    <Panel className="mx-auto max-w-[36rem] text-center sm:mt-6">
      <div className="py-2 sm:py-4">
        <p className="t-kicker">Introuvable</p>
        <h1 className="mt-2 font-display text-[26px] font-extrabold leading-[1.15] tracking-[-0.02em] text-night text-balance">Cette fiche n’existe pas.</h1>
        <p className="mx-auto mt-3 max-w-[28rem] text-[15px] leading-[1.55] text-ink text-pretty">
          Le lien est peut-être ancien ou mal tapé. Tous tes agents et départements sont au QG.
        </p>
        <Link
          href="/studio"
          className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-night px-6 text-[15px] font-semibold text-white hover:bg-night-hover motion-safe:transition-colors"
        >
          Retour au QG
        </Link>
      </div>
    </Panel>
  );
}
