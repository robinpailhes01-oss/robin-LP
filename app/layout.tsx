import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import localFont from "next/font/local";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ContactProvider } from "@/components/contact/ContactContext";
import { ContactPanel } from "@/components/contact/ContactPanel";
import "./globals.css";

const hand = localFont({ src: "../public/fonts/Caveat-SemiBold.woff2", variable: "--font-hand", display: "swap", weight: "600" });

export const metadata: Metadata = {
  title: { default: "Luma", template: "%s · Luma" },
  description: "Des automatisations et des outils IA sur mesure qui font gagner du temps et économiser de l’argent aux PME.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${GeistSans.variable} ${hand.variable}`}>
      <body>
        <ContactProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
          <ContactPanel />
        </ContactProvider>
      </body>
    </html>
  );
}
