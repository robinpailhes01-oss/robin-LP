import { NextResponse } from "next/server";

/**
 * Réception des demandes du site :
 * - "mini-audit" : coordonnées laissées à la fin du mini-audit (/audit), avec réponses et estimation ;
 * - "rappel" : clic sur « Être rappelé par Robin » depuis le résultat du mini-audit ;
 * - "assistant" : panneau « Assistant de Robin » ;
 * - "audit" : ancien formulaire (secteur, besoin, contact).
 *
 * Destinations, chacune active si ses variables sont définies (voir README) :
 * - Supabase : une ligne par demande dans la table `leads` (clé service côté serveur uniquement) ;
 * - Telegram : une notification instantanée à Robin, en tête pour les rappels ;
 * - CONTACT_WEBHOOK_URL : relais libre (email, CRM…).
 * Sans aucune destination, la demande est journalisée côté serveur.
 * Réponse 502 si toutes les destinations configurées échouent : le visiteur peut réessayer.
 */

type Answers = Record<string, string[]>;

const KINDS = new Set(["audit", "mini-audit", "rappel", "assistant"]);

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
  // Types connus uniquement : la valeur est relue telle quelle par le studio.
  if (!KINDS.has(kind)) return NextResponse.json({ ok: false, error: "invalid_kind" }, { status: 400 });
  let answers: Answers = {};

  if (kind !== "audit") {
    const raw = body.answers;
    if (raw && typeof raw === "object") {
      for (const [k, v] of Object.entries(raw as Record<string, unknown>).slice(0, 30)) {
        if (Array.isArray(v)) answers[k.slice(0, 40)] = v.map((x) => (typeof x === "string" ? x.trim().slice(0, 1000) : "")).filter(Boolean).slice(0, 12);
      }
    }
  } else {
    const sector = clean(body.sector);
    const pain = clean(body.pain);
    if (!sector || !pain) return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
    answers = { sector: [sector], tasks: [pain] };
  }

  const first = (k: string) => answers[k]?.[0] ?? "";
  const lead = {
    kind,
    source: first("source") || kind,
    name: first("name") || first("who"),
    company: first("company"),
    email: first("email") || (contact.includes("@") ? contact : ""),
    phone: first("phone") || (contact.includes("@") ? "" : contact),
    contact,
    timing: first("timing"),
    estimate: answers.estimate ?? [],
    answers,
  };

  const deliveries: Promise<boolean>[] = [];
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) deliveries.push(saveToSupabase(lead));
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) deliveries.push(notifyTelegram(lead));
  if (process.env.CONTACT_WEBHOOK_URL) deliveries.push(post(process.env.CONTACT_WEBHOOK_URL, { ...lead, receivedAt: new Date().toISOString() }));

  if (!deliveries.length) {
    console.log("[contact]", JSON.stringify(lead));
    return NextResponse.json({ ok: true });
  }

  const results = await Promise.all(deliveries);
  if (!results.some(Boolean)) return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  return NextResponse.json({ ok: true });
}

type Lead = { kind: string; source: string; name: string; company: string; email: string; phone: string; contact: string; timing: string; estimate: string[]; answers: Answers };

function saveToSupabase(lead: Lead) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return post(`${process.env.SUPABASE_URL!.replace(/\/$/, "")}/rest/v1/leads`, lead, {
    apikey: key,
    Authorization: `Bearer ${key}`,
    Prefer: "return=minimal",
  });
}

const LABELS: Record<string, string> = {
  sector: "Secteur",
  size: "Taille",
  tasks: "Tâches",
  channels: "Canaux",
  time: "Temps par jour",
  cost: "Coût horaire",
  tools: "Outils",
  toolsDetail: "Détail outils",
};

function notifyTelegram(lead: Lead) {
  const urgent = lead.timing === "Dès que possible";
  const title =
    lead.kind === "rappel" ? "📞 RAPPEL DEMANDÉ" : lead.kind === "mini-audit" ? "🆕 Nouveau mini-audit" : lead.kind === "assistant" ? "💬 Nouveau message (assistant)" : "🆕 Nouvelle demande";
  const lines: (string | null)[] = [
    `${title}${urgent ? " · 🔥 dès que possible" : ""}`,
    "",
    [lead.name, lead.company].filter(Boolean).join(" · ") || null,
    lead.phone ? `Tél : ${lead.phone}` : null,
    lead.email ? `Email : ${lead.email}` : null,
    lead.timing ? `Échéance : ${lead.timing}` : null,
    lead.estimate.length ? `Estimation : ${lead.estimate.join(" · ")}` : null,
  ];
  if (lead.kind !== "rappel") {
    lines.push("");
    for (const [k, v] of Object.entries(lead.answers)) {
      if (LABELS[k] && v.length) lines.push(`${LABELS[k]} : ${v.join(", ")}`);
    }
    if (lead.kind === "assistant") {
      for (const [k, v] of Object.entries(lead.answers)) if (!LABELS[k] && !["name", "who", "email", "phone", "source"].includes(k) && v.length) lines.push(`${k} : ${v.join(" / ")}`);
    }
  }
  const text = lines.filter((l) => l !== null).join("\n").slice(0, 4000);
  return post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, { chat_id: process.env.TELEGRAM_CHAT_ID, text, disable_web_page_preview: true });
}

async function post(url: string, data: unknown, headers: Record<string, string> = {}) {
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(data), signal: AbortSignal.timeout(8000) });
    if (!res.ok) console.error("[contact] delivery failed", new URL(url).host, res.status, (await res.text()).slice(0, 300));
    return res.ok;
  } catch (e) {
    console.error("[contact] delivery error", new URL(url).host, e instanceof Error ? e.message : e);
    return false;
  }
}

function clean(v: unknown): string {
  return typeof v === "string" ? v.trim().slice(0, 500) : "";
}
