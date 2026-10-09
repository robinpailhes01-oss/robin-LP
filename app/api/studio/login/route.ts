import { NextResponse } from "next/server";
import { checkPassword, createSession, safeNext, SESSION_DAYS, STUDIO_COOKIE, studioConfigured } from "@/lib/studio/auth";

/** Connexion au studio (formulaire classique, fonctionne sans JavaScript). */
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const password = String(form?.get("password") ?? "").slice(0, 200);
  const next = safeNext(String(form?.get("next") ?? ""));
  const back = (q: string) => NextResponse.redirect(new URL(`/studio/connexion?${q}`, req.url), 303);

  if (!studioConfigured()) return back("erreur=config");
  if (!(await checkPassword(password))) {
    await new Promise((r) => setTimeout(r, 600)); // freine les essais en rafale
    return back(`erreur=1${next !== "/studio" ? `&next=${encodeURIComponent(next)}` : ""}`);
  }
  const res = NextResponse.redirect(new URL(next, req.url), 303);
  res.cookies.set(STUDIO_COOKIE, await createSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
  return res;
}
