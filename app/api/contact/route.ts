import { NextResponse } from "next/server";

/**
 * Réception des demandes du site : formulaire d’audit (kind "audit") et mini-audit (kind "mini-audit").
 * Destination : CONTACT_WEBHOOK_URL si défini (email, CRM, WhatsApp via un relais),
 * sinon journalisation serveur. À brancher une fois la destination choisie.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const contact = clean(body.contact);
  if (!contact) return NextResponse.json({ ok: false, error: "missing_contact" }, { status: 400 });

  const kind = clean(body.kind) || "audit";
  let payload: Record<string, unknown>;

  if (kind === "mini-audit") {
    const raw = body.answers;
    const answers: Record<string, string[]> = {};
    if (raw && typeof raw === "object") {
      for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
        if (Array.isArray(v)) answers[k.slice(0, 40)] = v.map(clean).filter(Boolean).slice(0, 12);
      }
    }
    payload = { kind, contact, answers };
  } else {
    const sector = clean(body.sector);
    const pain = clean(body.pain);
    if (!sector || !pain) return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
    payload = { kind, sector, pain, contact };
  }

  payload = { ...payload, receivedAt: new Date().toISOString(), source: "site" };
  const url = process.env.CONTACT_WEBHOOK_URL;

  if (url) {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!res.ok) return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  } else {
    console.log("[contact]", JSON.stringify(payload));
  }

  return NextResponse.json({ ok: true });
}

function clean(v: unknown): string {
  return typeof v === "string" ? v.trim().slice(0, 500) : "";
}
