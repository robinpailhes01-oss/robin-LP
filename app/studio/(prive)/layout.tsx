import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { STUDIO_COOKIE, verifySession } from "@/lib/studio/auth";
import { StudioNav } from "@/components/studio/StudioNav";

/** Pages privées du studio. Deuxième contrôle de la session ici, en plus de proxy.ts. */
export default async function StudioPrivateLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  if (!(await verifySession(jar.get(STUDIO_COOKIE)?.value))) redirect("/studio/connexion");
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[84rem] items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/studio" className="flex items-center gap-2.5">
            <span className="font-display text-[20px] font-extrabold tracking-[-0.03em] text-night">Luma</span>
            <span className="rounded-full bg-night px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">Studio</span>
          </Link>
          <StudioNav />
          <form action="/api/studio/logout" method="post">
            <button type="submit" className="min-h-11 rounded-full px-3 text-[14px] font-medium text-muted hover:bg-mist hover:text-night">
              Se déconnecter
            </button>
          </form>
        </div>
      </header>
      <main id="contenu" className="mx-auto max-w-[84rem] px-4 pb-20 pt-8 sm:px-6 sm:pt-10">
        {children}
      </main>
    </>
  );
}
