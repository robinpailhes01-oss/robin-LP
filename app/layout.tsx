import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ContactProvider } from "@/components/contact/ContactContext";
import { ContactPanel } from "@/components/contact/ContactPanel";

export const metadata: Metadata = {
  title: {
    default: "Luma — Agents IA pour les entreprises",
    template: "%s | Luma",
  },
  description:
    "Des agents IA sur-mesure pour automatiser vos processus et libérer du temps pour la croissance.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={GeistSans.variable}>
      <body>
        <ContactProvider>
          <a className="skip-link" href="#contenu">
            Aller au contenu
          </a>
          <Nav />
          <main id="contenu">{children}</main>
          <Footer />
          <ContactPanel />
        </ContactProvider>
      </body>
    </html>
  );
}
