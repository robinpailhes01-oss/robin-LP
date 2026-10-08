// Calques de la VSL : sous-titres (un PNG par mot surligné) et éléments de motion design (pastilles, chiffres, notifications).
// Usage : NODE_PATH=/opt/node-tools/node_modules node vsl_text.cjs build/spec.json
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const S = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const OUT = S.out;
const F = (f) => "file://" + path.resolve(__dirname, "..", "skills", "reel-kit", "assets", "fonts", f);
const keys = new Set((S.keys || []).map((k) => k.toLowerCase()));
const SUB_Y = S.sub_y || 1640;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Bold; src: url("${F("inter-tight-800.woff2")}"); font-weight: 800; }
@font-face { font-family: SerifF; src: url("${F("instrument-serif.woff2")}"); }
html, body { margin: 0; width: 1080px; height: 1920px; overflow: hidden; background: transparent; }
#sub { position: absolute; left: 70px; right: 70px; top: ${SUB_Y}px; transform: translateY(-50%); text-align: center;
       font: 800 62px/1.15 Bold; letter-spacing: -0.015em; color: #fff; text-shadow: 0 2px 12px rgba(0,0,0,.65), 0 0 2px rgba(0,0,0,.5); }
#sub .on { text-decoration: underline; text-decoration-thickness: 5px; text-underline-offset: 11px; text-decoration-color: #ffc35c; }
#sub .k { font-family: SerifF; font-weight: 400; font-style: italic; font-size: 72px; letter-spacing: 0; color: #ffe2a8; }
.chip { position: absolute; transform: translate(-50%, -50%); display: flex; align-items: center; gap: 16px; white-space: nowrap;
        padding: 14px 30px 14px 14px; border-radius: 60px; background: rgba(12,12,20,.62); border: 1.5px solid rgba(255,255,255,.32);
        font: 800 38px/1 Bold; color: #fff; letter-spacing: -0.01em; box-shadow: 0 10px 30px rgba(0,0,0,.3); }
.chip.plain { padding: 16px 32px; }
.chip .dot { width: 54px; height: 54px; border-radius: 50%; display: grid; place-items: center; background: #25d366; flex: none; }
.chip .dot.o { background: #ffc35c; } .chip .dot.r { background: #ff6b6b; } .chip .dot.v { background: #7c6cff; } .chip .dot.w { background: #fff; }
.chip.off { color: rgba(255,255,255,.75); } .chip.off .t { text-decoration: line-through; text-decoration-color: #ff6b6b; text-decoration-thickness: 4px; }
.chip.gold { background: none; border: none; box-shadow: none; padding: 0; font: italic 400 64px/1 SerifF; color: #ffc35c;
             text-shadow: 0 2px 16px rgba(0,0,0,.8), 0 0 2px rgba(0,0,0,.6); }
.big { position: absolute; transform: translate(-50%, -50%); text-align: center; white-space: nowrap; color: #fff;
       text-shadow: 0 3px 18px rgba(0,0,0,.75); }
.big small { display: block; font: 800 24px/1 Bold; letter-spacing: .28em; text-transform: uppercase; opacity: .9; }
.big b { display: block; font: italic 400 150px/1 SerifF; color: #ffc35c; margin: 10px 0 2px; }
.big span { display: block; font: 800 36px/1.1 Bold; }
.brand { position: absolute; transform: translate(-50%, -50%); text-align: center; white-space: nowrap; color: #fff;
         text-shadow: 0 3px 20px rgba(0,0,0,.7); }
.brand b { display: block; font: italic 400 160px/0.9 SerifF; letter-spacing: -0.01em; }
.brand small { display: block; margin-top: 14px; font: 800 26px/1 Bold; letter-spacing: .34em; text-transform: uppercase; color: #ffc35c; }
.kicker { position: absolute; transform: translate(-50%, -50%); white-space: nowrap; font: 800 24px/1 Bold; letter-spacing: .34em;
          text-transform: uppercase; color: #fff; text-shadow: 0 1px 10px rgba(0,0,0,.7); }
.kicker i { display: inline-block; width: 40px; height: 2px; background: #ffc35c; vertical-align: middle; margin: 0 18px; }
.notif { position: absolute; transform: translate(-50%, -50%); width: 820px; display: flex; gap: 18px; align-items: center;
         padding: 18px 22px; border-radius: 30px; background: rgba(245,245,247,.94); color: #111;
         box-shadow: 0 14px 40px rgba(0,0,0,.35); font: 800 31px/1.2 Bold; }
.notif .app { width: 64px; height: 64px; border-radius: 16px; background: #25d366; display: grid; place-items: center; flex: none; }
.notif small { display: flex; justify-content: space-between; font-size: 21px; color: #777; letter-spacing: .04em; margin-bottom: 6px; }
.notif .tx { flex: 1; }
.cap { position: absolute; transform: translate(-50%, -50%); white-space: nowrap; font: 800 24px/1 Bold; letter-spacing: .3em;
       text-transform: uppercase; color: #fff; text-shadow: 0 1px 10px rgba(0,0,0,.8); }
</style></head><body></body></html>`;

const sv = (d, fill) => `<svg width="30" height="30" viewBox="0 0 24 24" ${fill ? `fill="${fill}"` : `fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"`}>${d}</svg>`;
const ICON = {
  chat: sv('<path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/>', "#fff"),
  check: sv('<path d="M5 12l5 5 9-10"/>'),
  x: sv('<path d="M6 6l12 12M18 6L6 18"/>'),
  clock: sv('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  up: sv('<path d="M4 17l6-6 4 4 6-8"/><path d="M14 7h6v6"/>'),
  down: sv('<path d="M12 4v15M6 13l6 6 6-6"/>'),
  phone: sv('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'),
  cal: sv('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
  mail: sv('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
  doc: sv('<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>'),
  db: sv('<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>'),
  repeat: sv('<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>'),
  user: sv('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
  bolt: sv('<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>', "#fff"),
  grid: sv('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'),
};
const P = (g) => `left:${g.pos[0]}px;top:${g.pos[1]}px`;
const el = (g) => {
  if (g.type === "chip")
    return `<div class="chip ${g.icon ? "" : "plain"} ${g.style || ""}" style="${P(g)}">` +
      (g.icon ? `<span class="dot ${g.color || ""}">${ICON[g.icon] || ""}</span>` : "") + `<span class="t">${g.text}</span></div>`;
  if (g.type === "big") return `<div class="big" style="${P(g)}"><small>${g.title || ""}</small><b>${g.text}</b><span>${g.sub || ""}</span></div>`;
  if (g.type === "brand") return `<div class="brand" style="${P(g)}"><b>${g.text}</b><small>${g.sub || ""}</small></div>`;
  if (g.type === "kicker") return `<div class="kicker" style="${P(g)}"><i></i>${g.text}<i></i></div>`;
  if (g.type === "cap") return `<div class="cap" style="${P(g)}">${g.text}</div>`;
  if (g.type === "notif")
    return `<div class="notif" style="${P(g)}"><div class="app">${ICON.chat}</div>` +
      `<div class="tx"><small><span>WHATSAPP</span><span>${g.time}</span></small>${g.text}</div></div>`;
  return "";
};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  const f = path.join(OUT, "page.html");
  fs.writeFileSync(f, html);
  await page.goto("file://" + f);   // la page doit être un fichier pour que les polices locales se chargent
  const shot = async (inner, name) => {
    await page.evaluate((h) => { document.body.innerHTML = h; return document.fonts.ready; }, inner);
    await page.screenshot({ path: path.join(OUT, name), omitBackground: true });
  };
  for (const g of S.graphics) if (g.type !== "insert") await shot(el(g), `gfx_${String(g.i).padStart(3, "0")}.png`);
  for (const g of S.graphics) if (g.type === "insert" && g.title) await shot(el({ type: "cap", text: g.title, pos: [540, g.cap_y] }), `cap_${String(g.i).padStart(3, "0")}.png`);
  const clean = (w) => w.toLowerCase().replace(/[.,!?:;«»"…]/g, "");
  for (const [gi, g] of S.groups.entries()) {
    for (let wi = 0; wi < g.length; wi++) {
      const inner = g.map((w, j) => {
        const cls = [j === wi ? "on" : "", keys.has(clean(w)) ? "k" : ""].join(" ").trim();
        return `<span class="${cls}">${w}</span>`;
      }).join(" ");
      await shot(`<div id="sub">${inner}</div>`, `sub_${String(gi).padStart(3, "0")}_${String(wi).padStart(2, "0")}.png`);
    }
  }
  await browser.close();
  console.log("calques VSL OK");
})();
