import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ContactProvider } from "@/components/contact/ContactContext";
import { ContactPanel } from "@/components/contact/ContactPanel";
import { AuditNudge } from "@/components/contact/AuditNudge";
import { site } from "@/lib/content";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", display: "swap", weight: ["600", "700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://robin-lp.vercel.app"),
  title: { default: site.title, template: "%s · Luma" },
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    locale: "fr_FR",
    type: "website",
    siteName: "Luma",
    images: [{ url: "/images/robin-large.jpg", width: 1024, height: 1024, alt: "Robin Pailhes, fondateur de Luma" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${interTight.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-night focus:px-4 focus:py-2 focus:text-white">
          Aller au contenu
        </a>
        <ContactProvider>
          <Nav />
          <main id="contenu">{children}</main>
          <Footer />
          <ContactPanel />
          <AuditNudge />
        </ContactProvider>
      </body>
    </html>
  );
}
