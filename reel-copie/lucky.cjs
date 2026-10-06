// Cartons et titre du Reel « on dit que t'as eu de la chance » (1080×1920), même rythme et mêmes couleurs que la référence.
// Usage : NODE_PATH=/opt/node-tools/node_modules node lucky.cjs
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "build", "lucky");
fs.mkdirSync(OUT, { recursive: true });
const SPEC = JSON.parse(fs.readFileSync(path.join(__dirname, "lucky.json"), "utf8"));
const COL = { black: ["#070002", "#ffffff"], white: ["#fbf5fa", "#161214"] };

const page0 = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Bold; src: url(../../assets/inter-700.woff2); font-weight: 700; }
html, body { margin: 0; width: 1080px; height: 1920px; overflow: hidden; background: transparent; }
.card { position: absolute; left: 0; right: 0; top: 940px; transform: translateY(-50%); text-align: center;
        font: 700 34px/1 Bold; letter-spacing: 0.005em; white-space: nowrap; }
.title { position: absolute; left: 60px; right: 60px; top: 700px; text-align: center; color: #fff;
         font: 700 54px/1.25 Bold; letter-spacing: -0.01em;
         text-shadow: 0 3px 10px rgba(0,0,0,0.75), 0 0 3px rgba(0,0,0,0.6); }
</style></head><body></body></html>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  const f = path.join(OUT, "page.html");
  fs.writeFileSync(f, page0);
  await page.goto("file://" + f);
  // titre (calque transparent)
  await page.evaluate((t) => { document.body.style.background = "transparent"; document.body.innerHTML = `<div class="title">${t}</div>`; return document.fonts.ready; }, SPEC.title);
  await page.screenshot({ path: path.join(OUT, "title.png"), omitBackground: true });
  // cartons pleins + texte seul (pour le fondu du dernier)
  for (const [i, c] of SPEC.cards.entries()) {
    const [bg, fg] = COL[c.color];
    await page.evaluate(({ text, bg, fg }) => { document.body.style.background = bg; document.body.innerHTML = `<div class="card" style="color:${fg}">${text}</div>`; return document.fonts.ready; }, { text: c.text, bg, fg });
    await page.screenshot({ path: path.join(OUT, `card${String(i).padStart(2, "0")}.png`) });
  }
  await browser.close();
  console.log("cartons OK", SPEC.cards.length);
})();
