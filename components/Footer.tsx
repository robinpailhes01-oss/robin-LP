import Link from "next/link";
import { nav } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-surface-alt">
      <div className="mx-auto max-w-luma px-6 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <p className="text-[18px] font-semibold tracking-[-0.03em]">Luma</p>
        <nav aria-label="Pied de page" className="flex flex-wrap gap-x-6 gap-y-2">
          {nav.map((l) => (
            <Link key={l.href} href={l.href} className="text-[14px] text-muted hover:text-ink transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="text-[13px] text-muted">© 2026 Luma</p>
      </div>
    </footer>
  );
}
