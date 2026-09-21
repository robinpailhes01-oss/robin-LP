import Image from "next/image";
import Link from "next/link";
import { nav } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-luma px-6 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <Image src="/images/logo-luma-mascotte.png" alt="Luma, agents IA pour les entreprises" width={900} height={539} className="h-16 w-auto" />
        <nav aria-label="Pied de page" className="flex flex-wrap gap-x-6 gap-y-2">
          {nav.map((l) => (
            <Link key={l.href} href={l.href} className="text-[14px] text-muted hover:text-navy transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="text-[13px] text-muted">© 2026 Luma</p>
      </div>
    </footer>
  );
}
