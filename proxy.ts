import { NextResponse, type NextRequest } from "next/server";
import { STUDIO_COOKIE, verifySession } from "@/lib/studio/auth";

/** Studio privé : toute page /studio (sauf la connexion) et toute route /api/studio (sauf login) exige la session. */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/studio/connexion" || pathname === "/api/studio/login") return NextResponse.next();
  if (await verifySession(req.cookies.get(STUDIO_COOKIE)?.value)) return NextResponse.next();
  if (pathname.startsWith("/api/")) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  const url = req.nextUrl.clone();
  url.pathname = "/studio/connexion";
  url.search = pathname === "/studio" ? "" : `?next=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/studio", "/studio/:path*", "/api/studio/:path*"],
};
