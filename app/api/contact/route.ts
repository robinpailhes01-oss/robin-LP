import { NextResponse } from "next/server";

/**
 * Réception des demandes du formulaire « Parler de mon entreprise ».
 * Destination : CONTACT_WEBHOOK_URL si défini (email, CRM, WhatsApp via un relais),
 * sinon erreur explicite (aucune fausse confirmation, aucune coordonnée journalisée). À brancher une fois la destination choisie (BRIEF.md, question ouverte 1).
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { ok: false, error: "invalid_payload" },
      { status: 400 },
    );
  }

  const sector = clean(body.sector);
  const pain = clean(body.pain);
  const contact = clean(body.contact);
  if (!sector || !pain || !contact) {
    return NextResponse.json(
      { ok: false, error: "missing_fields" },
      { status: 400 },
    );
  }

  const payload = {
    sector,
    pain,
    contact,
    receivedAt: new Date().toISOString(),
    source: "site",
  };
  const url = process.env.CONTACT_WEBHOOK_URL;

  if (!url) {
    return NextResponse.json(
      { ok: false, error: "delivery_unavailable" },
      { status: 503 },
    );
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok)
      return NextResponse.json(
        { ok: false, error: "delivery_failed" },
        { status: 502 },
      );
  } catch {
    return NextResponse.json(
      { ok: false, error: "delivery_failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

function clean(v: unknown): string {
  return typeof v === "string" ? v.trim().slice(0, 500) : "";
}
