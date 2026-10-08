import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

// Le dashboard affiche des données de prospects : il est protégé par un mot de passe (DASHBOARD_PASSWORD).
// Sans mot de passe, il ne s'ouvre qu'en démo (aucune donnée réelle) ; avec Supabase branché, il reste fermé.
export function proxy(request: NextRequest) {
  const motDePasse = process.env.DASHBOARD_PASSWORD;
  const donneesReelles = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY);

  if (!motDePasse) {
    if (!donneesReelles) return NextResponse.next();
    return new NextResponse("Accès fermé : DASHBOARD_PASSWORD n'est pas défini.", { status: 503 });
  }

  const [schema, valeur] = (request.headers.get("authorization") ?? "").split(" ");
  if (schema === "Basic" && valeur) {
    const decode = Buffer.from(valeur, "base64").toString("utf8");
    const saisi = decode.slice(decode.indexOf(":") + 1);
    if (egal(saisi, motDePasse)) return NextResponse.next();
  }

  return new NextResponse("Mot de passe requis.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Luma prospection", charset="UTF-8"' },
  });
}

function egal(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
