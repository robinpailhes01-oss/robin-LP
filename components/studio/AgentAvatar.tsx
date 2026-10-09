import { useId, type ReactNode } from "react";
import type { Agent, AvatarSpec } from "@/lib/studio/agents";

/**
 * Personnages du studio Luma, direction « illustration éditoriale ».
 * SVG pur (viewBox 0 0 120 120), buste dans un disque, tout calculé depuis l’AvatarSpec.
 * Composant serveur : aucun état, aucun JS. Réservé à /studio (la DA interdit les avatars sur le site public).
 *
 * Repère : le buste est dessiné dans un repère 120 « naturel », puis agrandi par
 * matrix(1.12 0 0 1.12 -7.2 -5.28) (échelle 1,12 autour de 60,44). Le torse est remonté de 6 (cou court).
 * Sous 48 px (mode « lite »), on retire le bruit (mèches, pli du bras, patte de boutonnage, nez)
 * et on agrandit les yeux et le sourire pour que l’expression se lise encore à 32-44 px.
 */

/* ---------- Couleurs dérivées ---------- */

type RGB = [number, number, number];
const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

function rgbOf(h: string): RGB {
  const m = HEX.exec(h.trim());
  const s = m ? m[1] : "000000";
  const f = s.length === 3 ? s.split("").map((c) => c + c).join("") : s;
  return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16)) as RGB;
}

const toHex = (rgb: number[]) =>
  "#" + rgb.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("").toUpperCase();

/** Couleur sûre : une valeur invalide (spec inconnu) retombe sur la couleur par défaut. */
function safeColor(value: unknown, fallback: string) {
  return typeof value === "string" && HEX.test(value.trim()) ? toHex(rgbOf(value)) : fallback;
}

/** mix(a, b, t) : t = part de b (0 = a pur, 1 = b pur), interpolation RVB linéaire. */
function mix(a: string, b: string, t: number) {
  const A = rgbOf(a);
  const B = rgbOf(b);
  return toHex(A.map((v, i) => v + (B[i] - v) * t));
}

function luminance(h: string) {
  const [r, g, b] = rgbOf(h).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

type Palette = ReturnType<typeof palette>;

function palette(spec: { skin: string; hairColor: string; outfit: string }) {
  const { skin, hairColor, outfit } = spec;
  const darkHair = luminance(hairColor) < 0.02;
  return {
    // Disque teinté par la couleur du haut (donc du département) : direction #DFE1E4, prospection #E4EBF1.
    bg: mix(outfit, "#FFFFFF", 0.86),
    skin,
    skinShade: mix(skin, "#4A2617", 0.2),
    skinDeep: mix(skin, "#4A2617", 0.34),
    blush: mix(skin, "#E0675A", 0.42),
    mouth: mix(skin, "#5E1F1A", 0.58),
    hair: hairColor,
    hairLight: mix(hairColor, "#FFFFFF", darkHair ? 0.24 : 0.2),
    hairDark: mix(hairColor, "#000000", 0.32),
    brow: darkHair ? mix(hairColor, skin, 0.12) : mix(hairColor, "#000000", 0.3),
    outfit,
    outfitShade: mix(outfit, "#0B1220", 0.32),
    outfitLight: mix(outfit, "#FFFFFF", 0.14),
    outfitTrim: luminance(outfit) < 0.05 ? mix(outfit, "#FFFFFF", 0.28) : mix(outfit, "#0B1220", 0.22),
    eye: "#1F1B19",
    ink: "#1E2633",
  };
}

/* ---------- Géométrie commune ---------- */

const SCALE = "matrix(1.12 0 0 1.12 -7.2 -5.28)";
const FACE = "M60 25C72.2 25 79.6 34 79.6 46.4C79.6 59.4 72 70.2 60 72.6C48 70.2 40.4 59.4 40.4 46.4C40.4 34 47.8 25 60 25Z";
const TORSO = "M10 126C10 107 22.5 97.4 41 93.6C47.6 92.3 52 89.8 53.2 85.6L66.8 85.6C68 89.8 72.4 92.3 79 93.6C97.5 97.4 110 107 110 126Z";
const NECK = "M51.6 58V88.5C51.6 92 68.4 92 68.4 88.5V58Z";

/* ---------- Coiffures ---------- */

type Hair = {
  /** Derrière le cou et le visage. */
  back?: ReactNode;
  /** Arrière en teinte plus sombre (profondeur des cheveux longs). */
  backDark?: boolean;
  /** Devant le visage (rejoué en ombre douce sur la peau). */
  front: ReactNode;
  /** Mèches dessinées, retirées sous 48 px. */
  strands?: string;
  extra?: ReactNode;
  hidesEars?: boolean;
  frontOpacity?: number;
};

const circles = (list: number[][]) => list.map(([cx, cy, r]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />);

const CURLS = [
  [41, 31, 9.6], [47.8, 22, 9.6], [58.6, 18, 10], [69.6, 18.8, 9.6], [78, 25.6, 9.4], [83, 35.2, 9.4], [84, 46.6, 8.8], [82.4, 57.6, 8.2], [79.6, 66.4, 6.8],
  [37, 40.6, 9.4], [36, 51.4, 8.8], [37.4, 61.4, 7.8], [40.4, 69.4, 6.4],
];
const FRINGE = [[44.6, 33.4, 5.2], [50.6, 29.2, 5.8], [57.6, 27.4, 6], [64.8, 27.8, 5.8], [71.4, 30.4, 5.6], [76.4, 35.4, 4.8], [42, 39.6, 4.2]];

function hairShapes(kind: string, c: Palette): Hair {
  switch (kind) {
    case "meche":
      // Mèche balayée de droite à gauche, pointe au-dessus du sourcil gauche ; volume à droite.
      // La patte gauche descend jusqu’à l’oreille (y 50) : plus de coin clair entre les deux.
      return {
        front: <path d="M40.1 50C38.2 32.4 45.6 18.8 59.4 17.4C70.6 16.4 80.4 22 81.8 33.4C82.4 38 81.6 42.4 80.4 46.8L78.9 46.8C78.6 42.6 78 39.6 77 37.4C72.4 39.6 62.6 40.4 55.4 39.6C51.2 39.2 47.8 40.6 45.4 43.4C45.4 40.2 44.8 37.6 43.4 35.6C42.6 39.4 42.2 43.4 42.6 50Z" />,
        strands: "M73.6 24.2C65.4 26.2 55.4 31.6 48.4 39.4M79.2 31.4C72.4 33.8 63.4 35.6 55.8 36.2",
      };
    case "chignon":
      return {
        back: <circle cx="60" cy="17.6" r="8.8" />,
        front: <path d="M40 49.4C37.8 31.6 46.8 20.2 60 20.2C73.2 20.2 82.2 31.6 80 49.4L78.6 49.4C77.6 40.6 74.6 33.6 69.4 30.8C65.6 29 62.2 29.6 60 31.4C57.8 29.6 54.4 29 50.6 30.8C45.4 33.6 42.4 40.6 41.4 49.4Z" />,
        strands: "M58.6 22.6C52.8 23.6 47 28 44.2 35.6M61.4 22.6C67.2 23.6 73 28 75.8 35.6M55 12.4C58.6 11.2 63.2 11.8 65.8 14.8M53.2 17.8C56.4 15 62 14.6 66.4 18.6",
        extra: (
          <>
            <ellipse cx="60" cy="24.4" rx="5.4" ry="1.8" fill={c.hairDark} />
            <path d="M42.4 41.6C41.2 47.6 42 53.4 44.2 57.6" fill="none" stroke={c.hair} strokeWidth="1.3" strokeLinecap="round" />
          </>
        ),
      };
    case "long":
      return {
        back: <path d="M38.6 48C36 26.4 47.4 16.6 60 16.6C72.6 16.6 84 26.4 81.4 48C80.6 64 82.4 80 86 94L34 94C37.6 80 39.4 64 38.6 48Z" />,
        backDark: true,
        front: <path d="M55.4 22.4C47 23.2 41.6 30.6 40.8 41.6C40 53.6 41.4 67.6 39.6 80.6C38.8 86.6 37.6 91.6 36.2 96.2C40.2 97.6 44.6 96.4 47 93.8C45.8 85 45.6 75.4 46 65.6C46.4 54.4 47.6 38.6 55.4 29.6C61.2 37 69.8 37.8 75 39.2C74.6 50 74 62.6 74.4 74.6C74.8 83.4 74.4 89.6 73.2 93.6C75.8 96.6 80.2 97.6 84 96.2C82.4 91.4 81.2 86.2 80.4 80.6C78.4 67.6 80 54 79.2 42C78.4 29.6 69.8 21.8 55.4 22.4Z" />,
        strands: "M53.6 25.4C48 28.6 44.6 34.8 43.6 42.6M43.4 55C43.4 66 42.8 78 40.8 90M58 26.8C64.6 31.6 71.2 33.2 77 34.8M77.2 48C77 60 77.6 72 79.8 86",
        hidesEars: true,
      };
    case "boucles":
      return {
        back: (
          <>
            <ellipse cx="60" cy="42" rx="23.6" ry="24" />
            {circles(CURLS)}
          </>
        ),
        front: <>{circles(FRINGE)}</>,
        strands:
          "M38.6 31.6C40.4 28 44.4 27.2 46.8 29.2M50.6 20.4C53.6 17.6 58.2 17.4 60.8 20.2M66.6 17.8C70.2 16.4 74 18 75 21.4M80 30.2C83.4 31.6 84.6 35.4 83.2 38.6M84.6 50.4C84.6 54 82.4 56.8 79.6 57.4M35 47.6C34.4 51.4 36.4 54.6 39.4 55.4M36.6 63.8C37.8 66.6 40.8 67.8 43.4 66.8M53.4 25.8C56.2 23.6 60.2 23.8 62.4 26.4M66.6 26.6C69.6 25.6 72.8 27 73.8 30",
      };
    case "rase":
      return {
        front: <path d="M40.6 46.4C39.4 30.4 47.6 23.4 60 23.4C72.4 23.4 80.6 30.4 79.4 46.4C78.8 42.6 77.8 39.4 76.4 37.2C71.6 33.2 66 31.8 60 31.8C54 31.8 48.4 33.2 43.6 37.2C42.2 39.4 41.2 42.6 40.6 46.4Z" />,
        strands: "M50 26.6C55.8 24.8 64.2 24.8 70 26.6",
        frontOpacity: 0.9,
      };
    case "court":
    default:
      // Coupe courte : aussi la coiffure de repli pour une valeur inconnue.
      return {
        front: <path d="M39.8 48.5C38.2 31.5 46.4 19.4 60.6 19.4C74.6 19.4 82.4 30.4 80.2 48.5L78.7 48.5C78.3 41.6 76.9 37.2 74.4 34.2C67.6 35.4 57.8 33.6 51.4 29.4C48.2 33.6 44.4 38.8 41.4 48.5Z" />,
        strands: "M52.8 26.4C59.6 29.6 68 30.4 76.2 31.2M49.6 25.6C46.4 28.2 43.6 32.4 42.2 37.6M56 22.6C63.4 23.6 70.4 25.4 76 28.6",
      };
  }
}

/* ---------- Cols (dérivés de l’accessoire, sans champ propre) ---------- */

type Collar = "blazer" | "chemise" | "v" | "rond";

function collarOf(accessory: string | undefined): Collar {
  switch (accessory) {
    case "carnet":
      return "blazer";
    case "lunettes":
    case "badge":
      return "chemise";
    case "stylo":
      return "v";
    default:
      return "rond";
  }
}

function CollarShape({ kind, c, lite }: { kind: Collar; c: Palette; lite: boolean }) {
  switch (kind) {
    case "blazer":
      return (
        <>
          <path d="M53.2 85.4L60 107L66.8 85.4Z" fill="#F5F2EC" />
          <path d="M55.6 85.4L60 94.4L64.4 85.4Z" fill={c.skin} />
          <path d="M53.4 84.8L44.8 92.6L48.8 95.8L46.4 99.2L59.6 112.6L60 107.4L53.6 87.6Z" fill={c.outfitLight} stroke={c.outfitTrim} strokeWidth=".9" strokeLinejoin="round" />
          <path d="M66.6 84.8L75.2 92.6L71.2 95.8L73.6 99.2L60.4 112.6L60 107.4L66.4 87.6Z" fill={c.outfitLight} stroke={c.outfitTrim} strokeWidth=".9" strokeLinejoin="round" />
          <circle cx="60" cy="116.4" r="1.5" fill={c.outfitTrim} />
        </>
      );
    case "chemise":
      return (
        <>
          <path d="M54.4 85.4L60 96L65.6 85.4Z" fill={c.skin} />
          {!lite && (
            <>
              <path d="M60 96.4V126" stroke={c.outfitShade} strokeWidth="1" />
              <circle cx="60" cy="103.6" r="1.1" fill={c.outfitShade} />
              <circle cx="60" cy="112" r="1.1" fill={c.outfitShade} />
            </>
          )}
          <path d="M53.4 83.6L47.6 93.4L57.4 97.6L60 96.2Z" fill={c.outfitLight} stroke={c.outfitShade} strokeWidth=".9" strokeLinejoin="round" />
          <path d="M66.6 83.6L72.4 93.4L62.6 97.6L60 96.2Z" fill={c.outfitLight} stroke={c.outfitShade} strokeWidth=".9" strokeLinejoin="round" />
        </>
      );
    case "v":
      return (
        <>
          <path d="M53.4 85.4L60 99.6L66.6 85.4Z" fill={c.skin} />
          <path d="M52.2 85L60 101.6L67.8 85" fill="none" stroke={c.outfitTrim} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
        </>
      );
    case "rond":
    default:
      return (
        <>
          <path d="M53.2 85.4C55.4 90.6 64.6 90.6 66.8 85.4Z" fill={c.skin} />
          <path d="M51.6 85C54 93 66 93 68.4 85" fill="none" stroke={c.outfitTrim} strokeWidth="2.6" strokeLinecap="round" />
        </>
      );
  }
}

/* ---------- Accessoires : under (posé sur le buste) / over (au-dessus de tout) ---------- */

const PEN = "#E3B25A";
const NIGHT = "#17263D";

function accessory(kind: string | undefined, c: Palette): { under?: ReactNode; over?: ReactNode } {
  switch (kind) {
    case "lunettes":
      return {
        over: (
          <>
            <g fill="#FFFFFF" fillOpacity=".16" stroke={c.ink} strokeWidth="1.8" strokeLinejoin="round">
              <rect x="46" y="45.4" width="12.4" height="9.6" rx="4" />
              <rect x="61.6" y="45.4" width="12.4" height="9.6" rx="4" />
            </g>
            <path d="M58.4 49.2C59.4 48.2 60.6 48.2 61.6 49.2M46 48.6L41.6 47.6M74 48.6L78.4 47.6" fill="none" stroke={c.ink} strokeWidth="1.6" strokeLinecap="round" />
          </>
        ),
      };
    case "casque":
      return {
        over: (
          <>
            <path d="M38.4 49.6C36.4 24.6 49 17.6 60 17.6C71 17.6 83.6 24.6 81.6 49.6" fill="none" stroke={c.ink} strokeWidth="3.4" strokeLinecap="round" />
            <rect x="35.2" y="43" width="9" height="14.4" rx="4.2" fill={c.ink} />
            <rect x="75.8" y="43" width="9" height="14.4" rx="4.2" fill={c.ink} />
            <rect x="37.4" y="45.6" width="3.4" height="9.2" rx="1.7" fill={mix(c.ink, "#FFFFFF", 0.22)} />
            <path d="M40.2 56.6C40.6 63.6 45 66.4 51.4 65.8" fill="none" stroke={c.ink} strokeWidth="1.9" strokeLinecap="round" />
            <rect x="50.2" y="63.4" width="5.4" height="4.6" rx="2.3" fill={c.ink} />
          </>
        ),
      };
    case "stylo":
      // Stylo glissé derrière l’oreille droite, par-dessus les cheveux : corps doré, pointe et embout nuit.
      // Recalé sur ce visage (bord à x 79,6, yeux à y 50,2) : translate(-3.6 -2), vérifié en capture,
      // pour que la moitié basse passe sur les cheveux (glissé dedans) et que l’embout dépasse au-dessus.
      return {
        over: (
          <g transform="translate(-3.6 -2) rotate(-72 86 38)">
            <rect x="76" y="35.8" width="19" height="4.4" rx="2.2" fill={PEN} />
            <path d="M76.6 35.8L72.4 38L76.6 40.2Z" fill={NIGHT} />
            <rect x="90.4" y="35.8" width="4.6" height="4.4" rx="2.2" fill={NIGHT} />
          </g>
        ),
      };
    case "carnet":
      return {
        under: (
          <g transform="rotate(-8 40 108)">
            <rect x="30.6" y="94.6" width="21.6" height="28" rx="2.4" fill="#FBF8F2" />
            <rect x="29.2" y="93.6" width="21.6" height="28" rx="2.4" fill="#C49A6C" />
            <rect x="45" y="93.6" width="2.2" height="28" fill="#8C6A48" />
            <path d="M32.8 99.4H40.6" stroke="#E6CFAE" strokeWidth="1.4" strokeLinecap="round" />
            <rect x="47.2" y="100.4" width="4.4" height="9" rx="2.2" fill={c.skin} />
            <path d="M48.2 106.2H50.6" stroke={c.skinShade} strokeWidth=".9" strokeLinecap="round" />
          </g>
        ),
      };
    case "badge":
      return {
        under: (
          <>
            <path d="M54.2 86.6L57.6 103.6M65.8 86.6L62.4 103.6" stroke={mix(c.outfit, "#FFFFFF", 0.72)} strokeWidth="1.7" strokeLinecap="round" />
            <rect x="58" y="101.6" width="4" height="3.6" rx="1" fill={c.ink} />
            <rect x="52" y="104.4" width="16" height="13.2" rx="2.6" fill="#FFFFFF" />
            <rect x="52" y="104.4" width="16" height="3.4" rx="1.4" fill={c.outfitShade} />
            <rect x="54.6" y="109.6" width="4.6" height="5" rx="1.2" fill={c.bg} />
            <path d="M61 111H65.4M61 113.8H64" stroke="#CADFED" strokeWidth="1.3" strokeLinecap="round" />
          </>
        ),
      };
    default:
      return {};
  }
}

/* ---------- Animation « vivante » (CSS interne, coupée sous prefers-reduced-motion) ---------- */

const LIVE_CSS =
  ".lav-breathe{animation:lav-breathe 5.6s ease-in-out infinite;transform-origin:60px 122px}" +
  ".lav-blink{animation:lav-blink 5.2s infinite;transform-box:fill-box;transform-origin:center}" +
  "@keyframes lav-breathe{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-.9px) scale(1.007)}}" +
  "@keyframes lav-blink{0%,92%,97%,100%{transform:scaleY(1)}94.5%{transform:scaleY(.1)}}" +
  "@media (prefers-reduced-motion:reduce){.lav-breathe,.lav-blink{animation:none}}";

/** Décalage propre à chaque prénom (0 à 5,1 s) : les agents ne clignent jamais tous ensemble. */
function delayOf(name: string) {
  let sum = 0;
  for (const ch of name) sum += ch.codePointAt(0) ?? 0;
  return (sum % 52) / 10;
}

const cleanId = (id: string) => id.replace(/[^a-zA-Z0-9_-]/g, "");

/* ---------- Personnage ---------- */

export function AgentAvatar({ agent, size = 56, animated = false, className = "" }: { agent: Pick<Agent, "name" | "avatar">; size?: number; animated?: boolean; className?: string }) {
  const uid = cleanId(useId());
  const spec: Partial<AvatarSpec> = agent.avatar ?? {};
  const name = typeof agent.name === "string" ? agent.name : "";
  const c = palette({
    skin: safeColor(spec.skin, "#E8BFA0"),
    hairColor: safeColor(spec.hairColor, "#3A2A20"),
    outfit: safeColor(spec.outfit, "#3B6E9E"),
  });
  const hairKind = typeof spec.hair === "string" ? spec.hair : "court";
  const h = hairShapes(hairKind, c);
  const acc = accessory(spec.accessory, c);
  const lite = size < 48;
  const disc = `lav-disc-${uid}`;
  const face = `lav-face-${uid}`;
  const delay = delayOf(name);

  return (
    <span role="img" aria-label={name} className={`inline-flex shrink-0 rounded-full ${className}`} style={{ width: size, height: size }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width={size} height={size} aria-hidden="true" focusable="false" style={{ display: "block" }}>
        <title>{name}</title>
        {animated && <style>{LIVE_CSS}</style>}
        <defs>
          <clipPath id={disc}>
            <circle cx="60" cy="60" r="60" />
          </clipPath>
          <clipPath id={face}>
            <path d={FACE} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${disc})`}>
          {/* 1. Fond : disque teinté + halo doux derrière la tête */}
          <rect width="120" height="120" fill={c.bg} />
          <circle cx="56" cy="50" r="36" fill="#FFFFFF" fillOpacity=".5" />
          <g className={animated ? "lav-breathe" : undefined} style={animated ? { animationDelay: `${(-delay * 1.3).toFixed(2)}s` } : undefined}>
            <g transform={SCALE}>
              {/* 2. Cheveux arrière */}
              {h.back && <g fill={h.backDark ? c.hairDark : c.hair}>{h.back}</g>}
              {/* 3. Cou + ombre du menton */}
              <path d={NECK} fill={c.skin} />
              <path d="M51.6 62C54.8 70.6 65.2 70.6 68.4 62V75.4C64.6 79 55.4 79 51.6 75.4Z" fill={c.skinShade} />
              {/* 4. Buste, remonté de 6 */}
              <g transform="translate(0 -6)">
                <path d={TORSO} fill={c.outfit} />
                <path d="M84.4 95.2C99 99.6 110 108.4 110 126H94.6C94.6 112.4 91.6 101.8 84.4 95.2Z" fill={c.outfitShade} fillOpacity=".38" />
                {!lite && <path d="M31.6 99.6C35.4 105.6 36.6 114 36.4 126" fill="none" stroke={c.outfitShade} strokeOpacity=".45" strokeWidth="1.1" strokeLinecap="round" />}
                <CollarShape kind={collarOf(spec.accessory)} c={c} lite={lite} />
                {acc.under}
              </g>
              {/* 5. Oreilles (cachées par les cheveux longs) */}
              {!h.hidesEars && (
                <>
                  <ellipse cx="40.8" cy="50.4" rx="3.7" ry="5.6" fill={c.skin} />
                  <ellipse cx="79.2" cy="50.4" rx="3.7" ry="5.6" fill={c.skinShade} />
                  <path d="M41.8 47.6C40.4 49 40.4 51.8 41.8 53.2M78.2 47.6C79.6 49 79.6 51.8 78.2 53.2" fill="none" stroke={c.skinDeep} strokeWidth="1" strokeLinecap="round" />
                </>
              )}
              {/* 6. Visage + modelé (joue droite, ombre douce sous les cheveux) */}
              <path d={FACE} fill={c.skin} />
              <g clipPath={`url(#${face})`}>
                <path d="M74.6 30C79.6 40 79.8 56 70.2 69C76.8 67 82 56 82 46C82 38 79 33 74.6 30Z" fill={c.skinShade} fillOpacity=".55" />
                <g transform="translate(0.6 2.6)" fill={c.skinShade} fillOpacity=".75">
                  {h.front}
                </g>
              </g>
              {/* 7. Traits : pommettes, sourcils, yeux (avec reflets), nez, sourire */}
              <ellipse cx="48.8" cy="58" rx="3.8" ry="2.2" fill={c.blush} fillOpacity=".5" />
              <ellipse cx="71.2" cy="58" rx="3.8" ry="2.2" fill={c.blush} fillOpacity=".5" />
              <path d="M48.4 44.4C50.6 42.6 54.4 42.4 56.8 43.8M63.2 43.8C65.6 42.4 69.4 42.6 71.6 44.4" fill="none" stroke={c.brow} strokeWidth="1.8" strokeLinecap="round" />
              <g className={animated ? "lav-blink" : undefined} style={animated ? { animationDelay: `${(-delay).toFixed(2)}s` } : undefined}>
                {lite ? (
                  <>
                    <ellipse cx="52.6" cy="50.2" rx="2.9" ry="3.6" fill={c.eye} />
                    <ellipse cx="67.4" cy="50.2" rx="2.9" ry="3.6" fill={c.eye} />
                    <circle cx="53.6" cy="48.8" r="1.05" fill="#FFFFFF" />
                    <circle cx="68.4" cy="48.8" r="1.05" fill="#FFFFFF" />
                  </>
                ) : (
                  <>
                    <ellipse cx="52.6" cy="50.2" rx="2.3" ry="2.7" fill={c.eye} />
                    <ellipse cx="67.4" cy="50.2" rx="2.3" ry="2.7" fill={c.eye} />
                    <circle cx="53.4" cy="49.1" r=".85" fill="#FFFFFF" />
                    <circle cx="68.2" cy="49.1" r=".85" fill="#FFFFFF" />
                  </>
                )}
              </g>
              {!lite && <path d="M60.6 50.6C59.8 53.4 58.8 55.2 59 56.2C59.3 57 60.6 57.2 61.8 56.7" fill="none" stroke={c.skinDeep} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />}
              <path d="M55.4 61.2C57.6 63.9 62.4 63.9 64.6 61.2" fill="none" stroke={c.mouth} strokeWidth={lite ? 2.2 : 1.8} strokeLinecap="round" />
              {/* 8. Cheveux avant + mèches */}
              <g fill={c.hair} fillOpacity={h.frontOpacity}>
                {h.front}
              </g>
              {!lite && h.strands && <path d={h.strands} fill="none" stroke={c.hairLight} strokeWidth="1.1" strokeLinecap="round" strokeOpacity=".75" />}
              {h.extra}
              {/* 9. Accessoires au-dessus */}
              {acc.over}
            </g>
          </g>
        </g>
      </svg>
    </span>
  );
}

/* ---------- Poste prévu, pas encore pourvu ---------- */

/** Disque neutre (bleu brume) : la même famille que les disques de l’équipe, sans département. */
const PLANNED_BG = mix("#CADFED", "#FFFFFF", 0.6);
const POWDER = "#CADFED";

/**
 * Chaise vide de la même équipe : même disque, même silhouette (cou, visage, buste),
 * en trait pointillé bleu poudré, sans remplissage ni visage. Décoratif (aria-hidden).
 * Le trait garde une épaisseur lisible à l’écran quelle que soit la taille (36 à 52 px dans les pages).
 */
export function PlannedAvatar({ size = 56, className = "" }: { size?: number; className?: string }) {
  const uid = cleanId(useId());
  const disc = `lav-pdisc-${uid}`;
  const neckMask = `lav-pneck-${uid}`;
  const torsoMask = `lav-ptorso-${uid}`;
  // Épaisseur visée à l’écran (px), convertie dans le repère du buste (échelle 1,12 × size / 120).
  const px = Math.min(2.25, Math.max(1.25, size / 30));
  const w = (px * 120) / (1.12 * Math.max(size, 1));
  const stroke = {
    fill: "none",
    stroke: POWDER,
    strokeWidth: w,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeDasharray: `${(w * 1.1).toFixed(2)} ${(w * 2.1).toFixed(2)}`,
  };

  return (
    <span aria-hidden="true" className={`inline-flex shrink-0 rounded-full ${className}`} style={{ width: size, height: size }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width={size} height={size} focusable="false" style={{ display: "block" }}>
        <defs>
          <clipPath id={disc}>
            <circle cx="60" cy="60" r="60" />
          </clipPath>
          {/* Seul le contour extérieur de la silhouette est tracé : chaque forme masque l’intérieur des autres. */}
          <mask id={neckMask} maskUnits="userSpaceOnUse" x="-20" y="-20" width="160" height="160">
            <rect x="-20" y="-20" width="160" height="160" fill="#FFFFFF" />
            <path d={FACE} fill="#000000" />
            <path d={TORSO} transform="translate(0 -6)" fill="#000000" />
          </mask>
          <mask id={torsoMask} maskUnits="userSpaceOnUse" x="-20" y="-20" width="160" height="160">
            <rect x="-20" y="-20" width="160" height="160" fill="#FFFFFF" />
            <path d={NECK} transform="translate(0 6)" fill="#000000" />
          </mask>
        </defs>
        <g clipPath={`url(#${disc})`}>
          <rect width="120" height="120" fill={PLANNED_BG} />
          <circle cx="56" cy="50" r="36" fill="#FFFFFF" fillOpacity=".5" />
          <g transform={SCALE}>
            <path d={NECK} {...stroke} mask={`url(#${neckMask})`} />
            <g transform="translate(0 -6)">
              <path d={TORSO} {...stroke} mask={`url(#${torsoMask})`} />
            </g>
            <path d={FACE} {...stroke} />
          </g>
        </g>
      </svg>
    </span>
  );
}
