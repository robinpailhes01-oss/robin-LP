import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ContactProvider } from "@/components/contact/ContactContext";
import { ContactPanel } from "@/components/contact/ContactPanel";
import { AuditNudge } from "@/components/contact/AuditNudge";

/** Habillage du site public : menu, pied de page, assistant et invitation à l’audit. Le studio privé a le sien. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ContactProvider>
      <Nav />
      <main id="contenu">{children}</main>
      <Footer />
      <ContactPanel />
      <AuditNudge />
    </ContactProvider>
  );
}
