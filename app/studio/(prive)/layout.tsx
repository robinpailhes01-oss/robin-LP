import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { STUDIO_COOKIE, verifySession } from "@/lib/studio/auth";
import { agents } from "@/lib/studio/agents";
import { StudioNav } from "@/components/studio/StudioNav";

function LogoutIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false" className={className}>
      <path d="M8 4H5.5A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8" />
      <path d="M12.5 13.5 16 10l-3.5-3.5M16 10H8" />
    </svg>
  );
}

/** Pages privées du studio. Deuxième contrôle de la session ici, en plus de proxy.ts. */
export default async function StudioPrivateLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  if (!(await verifySession(jar.get(STUDIO_COOKIE)?.value))) redirect("/studio/connexion");
  // Petit objet { id: département } pour l’état actif du menu : agents.ts n’est pas envoyé au navigateur.
  const agentDept = Object.fromEntries(agents.map((a) => [a.id, a.department]));
  return (
    <>
      {/* Barre du haut en verre sombre, sur une seule rangée à toutes les tailles : logo, menu, déconnexion. Un filet lumineux la souligne. */}
      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#060B16]/65 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex h-16 max-w-[84rem] items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6">
          <Link href="/studio" className="-ml-1 flex min-h-11 shrink-0 items-center gap-2 rounded-full px-1 sm:-mx-2 sm:gap-2.5 sm:px-2">
            <span className="font-display text-[20px] font-extrabold tracking-[-0.04em] text-white sm:text-[21px]">Luma</span>
            {/* Mobile : un simple point lumineux ; dès 640 px, la pastille « Studio ». */}
            <span aria-hidden className="size-1.5 rounded-full bg-[#9CC3FF] shadow-[0_0_8px_#9CC3FF] sm:hidden" />
            <span className="hidden items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.06] px-2 py-[3px] text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#CADFED] sm:inline-flex">
              <span aria-hidden className="size-1.5 rounded-full bg-[#9CC3FF] shadow-[0_0_8px_#9CC3FF]" />
              Studio
            </span>
            <span className="sr-only sm:hidden"> Studio</span>
            <span className="sr-only">, retour au QG</span>
          </Link>
          <StudioNav agentDept={agentDept} className="flex min-w-0 items-center gap-0.5 rounded-full border border-white/[0.07] bg-white/[0.03] p-1 sm:gap-1" />
          <form action="/api/studio/logout" method="post" className="shrink-0">
            {/* Mobile : bouton icône de 44 px ; le nom accessible reste « Se déconnecter » partout. */}
            <button
              type="submit"
              aria-label="Se déconnecter"
              className="studio-btn studio-btn--quiet min-h-11 w-11 gap-2 px-0 text-[14px] font-medium sm:w-auto sm:px-3"
            >
              <LogoutIcon className="opacity-70" />
              <span aria-hidden className="hidden sm:inline">
                Se déconnecter
              </span>
            </button>
          </form>
        </div>
        <span aria-hidden className="studio-rule pointer-events-none absolute inset-x-0 -bottom-px block opacity-60" />
      </header>
      <main id="contenu" className="mx-auto max-w-[84rem] px-4 pb-24 pt-8 sm:px-6 sm:pt-10">
        {children}
      </main>
    </>
  );
}
