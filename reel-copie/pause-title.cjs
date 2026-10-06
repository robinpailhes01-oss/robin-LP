// Titre du Reel « pause » (calque transparent 1080×1920), même style que la référence : condensé blanc, ombre légère.
// Usage : NODE_PATH=/opt/node-tools/node_modules node pause-title.cjs
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "build", "pause");
fs.mkdirSync(OUT, { recursive: true });
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Cond; src: url(../../../reel-chatgpt-claude/assets/roboto-condensed.woff2); }
html, body { margin: 0; width: 1080px; height: 1920px; background: transparent; }
#t { position: absolute; top: 330px; left: 0; right: 0; text-align: center; color: #fff;
     font: 500 70px/1.28 Cond; letter-spacing: -0.005em; text-shadow: 0 2px 6px rgba(0,0,0,0.55), 0 0 2px rgba(0,0,0,0.5); }
</style></head><body><div id="t">Tu décides de faire une pause<br>Après avoir bossé 8h d’affilée</div></body></html>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  const f = path.join(OUT, "title.html");
  fs.writeFileSync(f, html);
  await page.goto("file://" + f);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(OUT, "title.png"), omitBackground: true });
  await browser.close();
  console.log("titre OK");
})();
