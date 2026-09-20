import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { nav } from "@/lib/content";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link href="/" className="brand-link" aria-label="Luma, accueil">
            <Logo />
          </Link>
          <p>
            Des agents IA pour les entreprises
            <br />
            d’aujourd’hui et de demain.
          </p>
        </div>
        <nav aria-label="Pied de page">
          {nav.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Luma</span>
        <span>Moins de tâches. Plus d’impact.</span>
      </div>
    </footer>
  );
}
