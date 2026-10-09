/**
 * Accès au studio privé : un seul mot de passe (STUDIO_PASSWORD), un cookie de session signé.
 * Cookie = « expiration.signature » ; la signature HMAC-SHA256 dépend du mot de passe,
 * donc changer STUDIO_PASSWORD (ou STUDIO_SECRET) déconnecte toutes les sessions.
 * Un mot de passe de moins de 16 caractères est refusé : ni connexion, ni nouvelle session, et les sessions existantes cessent de marcher.
 * Web Crypto uniquement : utilisable dans proxy.ts, les routes et les pages serveur.
 */

export const STUDIO_COOKIE = "luma_studio";
export const SESSION_DAYS = 30;

const enc = new TextEncoder();

/** Longueur minimale de STUDIO_PASSWORD : en dessous, le studio refuse toute connexion et toute session. */
export const STUDIO_MIN_PASSWORD = 16;

/** « absent » : pas de mot de passe ; « court » : moins de STUDIO_MIN_PASSWORD caractères ; « ok » : utilisable. */
export function studioPasswordState(): "absent" | "court" | "ok" {
  const pw = process.env.STUDIO_PASSWORD ?? "";
  if (!pw) return "absent";
  return pw.length >= STUDIO_MIN_PASSWORD ? "ok" : "court";
}

export function studioConfigured() {
  return studioPasswordState() === "ok";
}

async function hmac(key: string, message: string) {
  const k = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", k, enc.encode(message));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Comparaison en temps constant de deux chaînes hexadécimales. */
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function secret() {
  const pw = process.env.STUDIO_PASSWORD ?? "";
  return { pw, key: process.env.STUDIO_SECRET || pw };
}

export async function checkPassword(candidate: string) {
  const { pw, key } = secret();
  if (!studioConfigured()) return false;
  const [a, b] = await Promise.all([hmac(key, `pw:${candidate}`), hmac(key, `pw:${pw}`)]);
  return safeEqual(a, b);
}

export async function createSession(now = Date.now()) {
  const { pw, key } = secret();
  if (!studioConfigured()) throw new Error("Studio non configuré : STUDIO_PASSWORD absent ou trop court.");
  const exp = Math.floor(now / 1000) + SESSION_DAYS * 86400;
  return `${exp}.${await hmac(key, `session:${exp}:${pw}`)}`;
}

export async function verifySession(value: string | undefined, now = Date.now()) {
  const { pw, key } = secret();
  if (!studioConfigured() || !value) return false;
  const [expRaw, sig] = value.split(".");
  const exp = Number(expRaw);
  if (!Number.isInteger(exp) || !sig || exp * 1000 < now) return false;
  return safeEqual(sig, await hmac(key, `session:${exp}:${pw}`));
}

/** Chemin de retour après connexion : uniquement une page du studio. */
export function safeNext(next: string | null | undefined) {
  return next && /^\/studio(\/[\w\-/]*)?$/.test(next) && !next.startsWith("/studio/connexion") ? next : "/studio";
}
