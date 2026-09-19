import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import localFont from "next/font/local";

const hand = localFont({ src: "../public/fonts/Caveat-SemiBold.woff2", variable: "--font-hand", display: "swap", weight: "600" });
import "./globals.css";

export const metadata: Metadata = {
  title: "Luma",
  description:
    "Des agents IA sur-mesure pour automatiser vos processus et libérer du temps pour la croissance.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${GeistSans.variable} ${hand.variable}`}>
      <body>{children}</body>
    </html>
  );
}
