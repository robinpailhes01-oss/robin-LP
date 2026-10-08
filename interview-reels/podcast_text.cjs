// Calques du Reel podcast : sous-titres (un PNG par mot surligné), filet central, étiquette, accroche.
// Usage : node podcast_text.cjs build/<nom>/spec.json
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const S = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const OUT = S.out;
const F = (f) => "file://" + path.resolve(__dirname, "..", "skills", "reel-kit", "assets", "fonts", f);
const keys = new Set((S.keys || []).map((k) => k.toLowerCase()));
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Bold; src: url("${F("inter-tight-800.woff2")}"); font-weight: 800; }
@font-face { font-family: SerifF; src: url("${F("instrument-serif.woff2")}"); }
html, body { margin: 0; width: 1080px; height: 1920px; overflow: hidden; background: transparent; }
#sub { position: absolute; left: 60px; right: 60px; top: 960px; transform: translateY(-50%); text-align: center;
       font: 800 74px/1.1 Bold; letter-spacing: -0.02em; color: #fff;
       text-shadow: 0 0 2px rgba(0,0,0,.7), 0 4px 14px rgba(0,0,0,.55); }
#sub .on { color: #ffc35c; }
#sub.q { color: #f3eee6; font-size: 64px; }
#sub.q .on { color: #b8adff; }
.qlabel { position: absolute; left: 50%; top: 1040px; transform: translateX(-50%); padding: 10px 22px; border-radius: 30px;
          background: #7c6cff; font: 800 28px/1 Bold; color: #fff; letter-spacing: 0.08em; text-transform: uppercase;
          box-shadow: 0 6px 20px rgba(124,108,255,.5); }
#sub .k { font-family: SerifF; font-weight: 400; font-style: italic; font-size: 80px; letter-spacing: 0; }
.seam { position: absolute; left: 0; right: 0; top: 958px; height: 4px;
        background: linear-gradient(90deg, transparent, #7c6cff 20%, #ffc35c 50%, #7c6cff 80%, transparent);
        box-shadow: 0 0 18px rgba(124,108,255,.8); }
.tag { position: absolute; left: 40px; top: 760px; padding: 14px 24px; border-radius: 40px;
       background: rgba(10,10,20,.55); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,.25);
       font: 800 30px/1 Bold; color: #fff; letter-spacing: -0.01em; }
.tag b { color: #ffc35c; }
.hook { position: absolute; left: 70px; right: 70px; top: 640px; text-align: center; padding: 26px 30px; border-radius: 30px;
        background: rgba(10,10,20,.62); border: 1px solid rgba(255,255,255,.22);
        font: 800 58px/1.1 Bold; color: #fff; letter-spacing: -0.02em; }
.hook em { font-family: SerifF; font-weight: 400; color: #ffc35c; font-size: 70px; }
.card { position: absolute; transform: translate(-50%, -50%); padding: 22px 28px; border-radius: 28px;
        background: rgba(14,14,24,.72); border: 1px solid rgba(255,255,255,.22); backdrop-filter: blur(10px);
        box-shadow: 0 16px 40px rgba(0,0,0,.35); color: #fff; font: 800 34px/1.15 Bold; letter-spacing: -0.01em; }
.card .row { display: flex; align-items: center; gap: 16px; }
.card .ic { width: 54px; height: 54px; border-radius: 16px; display: grid; place-items: center; background: #7c6cff; flex: none; }
.card .ic.g { background: #25d366; } .card .ic.o { background: #ffc35c; }
.card small { display: block; font-size: 22px; opacity: .7; font-weight: 800; margin-bottom: 6px; letter-spacing: .02em; }
.card .big { font: 400 72px/1 SerifF; white-space: nowrap; font-style: italic; color: #ffc35c; }
.bubble { background: #fff; color: #111; border-radius: 22px 22px 22px 6px; padding: 14px 18px; font-size: 28px; margin-top: 12px; }
.bubble.me { background: #d9fdd3; border-radius: 22px 22px 6px 22px; margin-left: 40px; }
.bars { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; font-size: 26px; }
.bars div { display: flex; justify-content: space-between; gap: 30px; padding: 10px 14px; border-radius: 14px; background: rgba(255,255,255,.08); }
.bars i { width: 14px; height: 14px; border-radius: 50%; background: #25d366; display: inline-block; margin-right: 10px; }
/* style épuré (C.style = "minimal") : pas de boîtes, typo fine, ombres douces */
body.min #sub { font-size: 62px; letter-spacing: -0.015em; text-shadow: 0 2px 10px rgba(0,0,0,.6); }
body.min #sub .on { color: #fff; text-decoration: underline; text-decoration-thickness: 4px; text-underline-offset: 10px; text-decoration-color: #ffc35c; }
body.min #sub .k { font-size: 70px; }
body.min #sub.q { font-size: 54px; color: rgba(255,255,255,.88); }
body.min #sub.q .on { color: #fff; text-decoration-color: rgba(255,255,255,.7); }
body.min .qlabel { background: none; box-shadow: none; padding: 0; top: 1046px; font-size: 22px; letter-spacing: .3em; opacity: .75;
                   text-shadow: 0 1px 6px rgba(0,0,0,.6); }
body.min .seam { height: 2px; top: 959px; background: rgba(255,255,255,.85); box-shadow: none; }
body.min .tag { background: none; border: none; backdrop-filter: none; padding: 0; left: 44px; top: 780px; font-size: 24px;
                letter-spacing: .12em; text-transform: uppercase; text-shadow: 0 1px 8px rgba(0,0,0,.65); }
body.min .hook { background: none; border: none; top: 170px; font-size: 56px; text-shadow: 0 2px 16px rgba(0,0,0,.7); }
body.min .hook em { font-size: 70px; }
.mcard { position: absolute; transform: translate(-50%, -50%); text-align: center; color: #fff; white-space: nowrap; padding: 34px 70px;
         background: radial-gradient(closest-side, rgba(0,0,0,.42), rgba(0,0,0,.18) 60%, transparent);
         text-shadow: 0 2px 14px rgba(0,0,0,.7), 0 0 2px rgba(0,0,0,.5); }
.mcard small { display: block; font: 800 20px/1 Bold; letter-spacing: .32em; text-transform: uppercase; opacity: .8; }
.mcard hr { width: 46px; height: 2px; border: 0; margin: 14px auto 12px; background: #ffc35c; box-shadow: 0 1px 6px rgba(0,0,0,.4); }
.mcard div { font: italic 400 66px/1 SerifF; }
/* pastilles et frise (motion design épuré) */
.chip { position: absolute; transform: translate(-50%, -50%); display: flex; align-items: center; gap: 16px; white-space: nowrap;
        padding: 14px 28px 14px 14px; border-radius: 60px; background: rgba(12,12,20,.55); border: 1.5px solid rgba(255,255,255,.35);
        font: 800 38px/1 Bold; color: #fff; letter-spacing: -0.01em; box-shadow: 0 10px 30px rgba(0,0,0,.3); }
.chip.plain { padding: 14px 30px; }
.chip .dot { width: 54px; height: 54px; border-radius: 50%; display: grid; place-items: center; background: #25d366; }
.chip .dot.o { background: #ffc35c; }
.chip.gold { background: none; border: none; box-shadow: none; font: italic 400 58px/1 SerifF; color: #ffc35c;
             text-shadow: 0 2px 14px rgba(0,0,0,.75); }
.step { position: absolute; transform: translate(-50%, -50%); text-align: center; white-space: nowrap; color: #fff;
        text-shadow: 0 2px 14px rgba(0,0,0,.75); }
.step small { display: block; font: 800 22px/1 Bold; letter-spacing: .3em; text-transform: uppercase; color: #ffc35c; margin-bottom: 12px; }
.step div { font: italic 400 58px/1 SerifF; }
.line { position: absolute; height: 4px; border-radius: 2px; background: linear-gradient(90deg, #ffc35c, #fff);
        box-shadow: 0 1px 8px rgba(0,0,0,.5); }
</style></head><body></body></html>`;
const ICON = {
  up: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17l6-6 4 4 6-8"/><path d="M14 7h6v6"/></svg>',
  chat: '<svg width="30" height="30" viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/></svg>',
  clock: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  check: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>',
  cup: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2.4" stroke-linecap="round"><path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M16 11h2a2 2 0 0 1 0 4h-2M8 3v3M12 3v3"/></svg>',
  chart: '<svg width="30" height="30" viewBox="0 0 24 24" fill="#fff"><rect x="4" y="12" width="4" height="8" rx="1"/><rect x="10" y="7" width="4" height="13" rx="1"/><rect x="16" y="3" width="4" height="17" rx="1"/></svg>',
};
const card = (g) => {
  if (g.type === "chip")
    return `<div class="chip ${g.icon ? "" : "plain"} ${g.style || ""}" style="left:${g.pos[0]}px;top:${g.pos[1]}px">` +
      (g.icon ? `<span class="dot ${g.color || ""}">${ICON[g.icon] || ""}</span>` : "") + `${g.text}</div>`;
  if (g.type === "step")
    return `<div class="step" style="left:${g.pos[0]}px;top:${g.pos[1]}px"><small>${g.title}</small><div>${g.text}</div></div>`;
  if (g.type === "line")
    return `<div class="line" style="left:${g.pos[0]}px;top:${g.pos[1]}px;width:${g.w}px"></div>`;
  if (g.type === "img")   // capture d'écran (chemin relatif au dossier interview-reels)
    return `<div class="mcard" style="left:${g.pos[0]}px;top:${g.pos[1]}px">${g.title ? `<small>${g.title}</small><hr>` : ""}` +
      `<img src="file://${path.resolve(__dirname, g.src)}" style="display:block;width:${g.w || 760}px;border-radius:26px;` +
      `box-shadow:0 18px 50px rgba(0,0,0,.45)"></div>`;
  if (g.type === "min")
    return `<div class="mcard" style="left:${g.pos[0]}px;top:${g.pos[1]}px"><small>${g.title || ""}</small><hr><div>${g.text}</div></div>`;
  const ic = g.icon ? `<div class="ic ${g.color || ""}">${ICON[g.icon] || ""}</div>` : "";
  let body = "";
  if (g.type === "chat") body = `<small>${g.title || "WhatsApp"}</small>` + (g.lines || []).map((l, i) => `<div class="bubble ${i % 2 ? "me" : ""}">${l}</div>`).join("");
  else if (g.type === "big") body = `<small>${g.title || ""}</small><div class="big">${g.text}</div>`;
  else if (g.type === "list") body = `<small>${g.title || ""}</small><div class="bars">${(g.lines || []).map((l) => `<div><span><i></i>${l}</span></div>`).join("")}</div>`;
  else body = `${g.title ? `<small>${g.title}</small>` : ""}${g.text}`;
  return `<div class="card" style="left:${g.pos[0]}px;top:${g.pos[1]}px;width:${g.w || 440}px"><div class="row">${ic}<div>${body}</div></div></div>`;
};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  const f = path.join(OUT, "page.html");
  fs.writeFileSync(f, html);
  await page.goto("file://" + f);
  const shot = async (inner, name) => {
    await page.evaluate(([h, m]) => { document.body.innerHTML = h; document.body.className = m ? "min" : "";
                                     return Promise.all([document.fonts.ready, ...[...document.images].map((i) => i.decode())]); },
                        [inner, S.style === "minimal"]);
    await page.screenshot({ path: path.join(OUT, name), omitBackground: true });
  };
  await shot(`<div class="seam"></div>`, "seam.png");
  if (S.tag) await shot(`<div class="tag">${S.tag}</div>`, "tag.png");
  if (S.hook) await shot(`<div class="hook">${S.hook}</div>`, "hook.png");
  await shot(`<div class="qlabel">La question</div>`, "qlabel.png");
  for (const g of S.graphics || []) await shot(card(g), `gfx_${String(g.i).padStart(2, "0")}.png`);
  const clean = (w) => w.toLowerCase().replace(/[.,!?:;«»"]/g, "");
  for (const [gi, g] of S.groups.entries()) {
    for (let wi = 0; wi < g.length; wi++) {
      const inner = g.map((w, j) => {
        const cls = [j === wi ? "on" : "", keys.has(clean(w)) ? "k" : ""].join(" ").trim();
        return `<span class="${cls}">${w}</span>`;
      }).join(" ");
      const q = (S.speakers || [])[gi] === "q" ? ' class="q"' : "";
      await shot(`<div id="sub"${q}>${inner}</div>`, `sub_${String(gi).padStart(3, "0")}_${String(wi).padStart(2, "0")}.png`);
    }
  }
  await browser.close();
  console.log("calques podcast OK");
})();
