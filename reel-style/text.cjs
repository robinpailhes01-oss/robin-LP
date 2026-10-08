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
html, body { margin: 0; width: 1080px; height: 1920px; overflow: hidden; background: transparent; }
.t { position: absolute; left: 0; right: 0; text-align: center; color: #fff; font-family: InterV; font-weight: 600;
     text-shadow: 0 1px 3px rgba(0,0,0,.35), 0 2px 18px rgba(0,0,0,.35); }
#pov { top: ${S.pov_y}px; font-size: ${S.pov_size}px; letter-spacing: 0.01em; }
#line { top: ${S.line_y}px; font-size: ${S.line_size}px; line-height: 1.12; letter-spacing: -0.005em; }
#brand { top: 820px; font-size: 168px; font-weight: 700; letter-spacing: -0.04em; line-height: 1; text-shadow: 0 4px 30px rgba(0,0,0,.4); }
#brand sup { font-size: 60px; vertical-align: 70px; margin-left: 4px; color: #fff; }
#handle { top: 1035px; font-family: Cond; font-weight: 700; font-size: 50px; letter-spacing: 0.02em; text-transform: uppercase; }
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
  await shot(`<div class="t" id="pov">${S.pov}</div><div class="t" id="line">${S.line}</div>`, "title.png");
  await shot(`<div class="t" id="brand">${S.end_brand}</div>`, "brand.png");
  await shot(`<div class="t" id="handle">${S.end_sub}</div>`, "handle.png");
  await browser.close();
  console.log("calques OK");
})();
