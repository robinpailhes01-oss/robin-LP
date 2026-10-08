// Calques texte du Reel « POV » (copie du style de la référence : police type Instagram « Classic », blanc, centré).
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const OUT = path.join(__dirname, "build");
const S = JSON.parse(fs.readFileSync(path.join(__dirname, "pov.json"), "utf8"));
const F = (f) => "file://" + path.resolve(__dirname, f);
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: InterV; src: url("${F("assets/inter-var.woff2")}"); font-weight: 100 900; }
@font-face { font-family: Cond; src: url("${F("../skills/reel-kit/assets/fonts/roboto-condensed.woff2")}"); font-weight: 100 900; }
@font-face { font-family: SerifR; src: url("${F("assets/instrument-serif.woff2")}"); }
@font-face { font-family: SerifI; src: url("${F("assets/instrument-serif-italic.woff2")}"); }
html, body { margin: 0; width: 1080px; height: 1920px; overflow: hidden; background: transparent; }
.t { position: absolute; left: 0; right: 0; text-align: center; color: #fff; font-family: InterV; font-weight: 600;
     text-shadow: 0 1px 2px rgba(0,0,0,.45), 0 2px 22px rgba(0,0,0,.55); }
/* style « classe » : POV en petites capitales espacées, la phrase en serif, l'accent en italique */
#pov { top: ${S.pov_y}px; font-size: ${S.pov_size}px; font-weight: 600; letter-spacing: 0.5em; text-indent: 0.5em; color: rgba(255,255,255,.86); }
#pov i { display: inline-block; width: 44px; height: 1.5px; background: rgba(255,255,255,.6); vertical-align: middle; margin: 0 22px; }
#line { top: ${S.line_y}px; font-family: SerifR; font-weight: 400; font-size: ${S.line_size}px; line-height: 1.05; letter-spacing: -0.005em; }
#line em { font-family: SerifI; font-style: normal; }
#brand { top: 820px; font-family: SerifR; font-weight: 400; font-size: 190px; letter-spacing: -0.01em; line-height: 1; text-shadow: 0 4px 30px rgba(0,0,0,.4); }
#brand sup { font-size: 60px; vertical-align: 70px; margin-left: 4px; color: #fff; }
#handle { top: 1040px; font-weight: 600; font-size: 26px; letter-spacing: 0.42em; text-indent: 0.42em; text-transform: uppercase; color: rgba(255,255,255,.85); }
</style></head><body></body></html>`;
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  const f = path.join(OUT, "page.html"); fs.writeFileSync(f, html);
  await page.goto("file://" + f);   // fichier (pas setContent) pour charger les polices locales
  const shot = async (inner, name) => {
    await page.evaluate((h) => { document.body.innerHTML = h; return document.fonts.ready; }, inner);
    await page.screenshot({ path: path.join(OUT, name), omitBackground: true });
  };
  await shot(`<div class="t" id="pov"><i></i>${S.pov}<i></i></div><div class="t" id="line">${S.line}</div>`, "title.png");
  await shot(`<div class="t" id="brand">${S.end_brand}</div>`, "brand.png");
  await shot(`<div class="t" id="handle">${S.end_sub}</div>`, "handle.png");
  await browser.close();
  console.log("calques OK");
})();
