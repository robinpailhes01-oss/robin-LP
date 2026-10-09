import type { Metadata, Viewport } from "next";
import { Aurora } from "@/components/studio/fx/Aurora";
import { DocumentTone } from "@/components/studio/fx/DocumentTone";
import "./studio.css";

export const metadata: Metadata = {
  title: { default: "Studio", template: "%s · Studio Luma" },
  robots: { index: false, follow: false, nocache: true },
};

/** Barre du navigateur sombre sur les pages du studio seulement (le site public garde themeColor blanc). */
export const viewport: Viewport = {
  themeColor: "#060B16",
  colorScheme: "dark",
};

/**
 * Studio privé de l’agence : jamais indexé, sans le menu ni le pied de page du site public.
 * Thème sombre « centre de commande » : tout le style vit dans studio.css, sous la classe .studio posée ici.
 */
export default function StudioRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="studio">
      <DocumentTone />
      <Aurora />
      {children}
    </div>
  );
}
