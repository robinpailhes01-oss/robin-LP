// Calques texte du Reel « Mes deux facettes » (1080×1920) : une image transparente par phrase + les 2 titres.
// Couleurs adaptées au bateau : titre or chaud lumineux, phrases crème avec ombre douce.
// Usage : NODE_PATH=/opt/node-tools/node_modules node facettes.cjs
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const S = JSON.parse(fs.readFileSync(path.join(__dirname, "deux-facettes.json"), "utf8"));
const OUT = path.join(__dirname, "build", "facettes");
fs.mkdirSync(OUT, { recursive: true });
const font = path.join(__dirname, "assets", "inter-700.woff2");
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Txt; src: url("file://${font}"); font-weight: 700; }
html, body { margin: 0; width: 1080px; height: 1920px; overflow: hidden; background: transparent; }
.p { position: absolute; transform: translate(-50%, -50%); white-space: nowrap; font: 700 46px/1 Txt; letter-spacing: -0.025em;
     color: #fff4e3; text-shadow: 0 2px 8px rgba(30,12,0,0.85), 0 0 2px rgba(30,12,0,0.7); }
.t { font-size: 80px; letter-spacing: -0.03em; color: #ffd47a;
     text-shadow: 0 0 3px rgba(40,15,0,0.9), 0 2px 14px rgba(25,8,0,0.95), 0 0 26px rgba(255,170,60,0.45); }
</style></head><body></body></html>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  const f = path.join(OUT, "page.html");
  fs.writeFileSync(f, html);
  await page.goto("file://" + f);
  const items = [
    ...S.title.map((t, i) => ({ name: `titre${i}`, text: t.text, xy: S.title_xy, cls: "p t" })),
    ...S.negatives.map((p, i) => ({ name: `neg${String(i).padStart(2, "0")}`, text: p.fr, xy: p.xy, cls: "p" })),
    ...S.positives.map((p, i) => ({ name: `pos${i}`, text: p.fr, xy: p.xy, cls: "p" })),
  ];
  for (const it of items) {
    await page.evaluate(({ text, xy, cls }) => {
      document.body.innerHTML = `<div class="${cls}" style="left:${xy[0]}px;top:${xy[1]}px">${text}</div>`;
      return document.fonts.ready;
    }, it);
    await page.screenshot({ path: path.join(OUT, it.name + ".png"), omitBackground: true });
  }
  // aperçu de toutes les phrases négatives / positives d'un coup, pour vérifier la mise en page
  for (const [name, list] of [["apercu-neg", ["titre0", ...S.negatives.map((_, i) => `neg${String(i).padStart(2, "0")}`)]],
                              ["apercu-pos", ["titre1", ...S.positives.map((_, i) => `pos${i}`)]]]) {
    const all = items.filter((x) => list.includes(x.name));
    await page.evaluate((all) => {
      document.body.innerHTML = all.map((it) => `<div class="${it.cls}" style="left:${it.xy[0]}px;top:${it.xy[1]}px">${it.text}</div>`).join("");
      return document.fonts.ready;
    }, all);
    await page.screenshot({ path: path.join(OUT, name + ".png"), omitBackground: true });
  }
  await browser.close();
  console.log("calques OK", items.length);
})();
