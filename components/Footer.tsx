import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { founder, nav } from "@/lib/content";

export function Footer() {
  return (
    <footer className="bg-night text-white">
      <div className="mx-auto max-w-luma px-5 sm:px-6 lg:px-8 py-14 md:py-16 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo light />
          <p className="mt-4 text-[15px] leading-[1.6] text-white/75 max-w-[340px]">
            Des outils IA personnalisés pour la relation client des PME, créés pour vous ou avec vous.
          </p>
        </div>
        <nav aria-label="Pied de page" className="md:col-span-7 md:justify-self-end">
          <ul className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-8 gap-y-1">
            {nav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-11 items-center text-[14px] text-white/80 hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="md:col-span-12 border-t border-white/15 pt-6 text-[13px] text-white/60">© 2026 Luma · {founder.name}</p>
      </div>
    </footer>
  );
}
