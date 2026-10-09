import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Studio", template: "%s · Studio Luma" },
  robots: { index: false, follow: false, nocache: true },
};

/** Studio privé de l’agence : jamais indexé, sans le menu ni le pied de page du site public. */
export default function StudioRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-[100dvh] bg-paper">{children}</div>;
}
