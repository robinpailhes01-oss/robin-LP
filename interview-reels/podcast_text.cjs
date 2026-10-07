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
       font: 800 66px/1.12 Bold; letter-spacing: -0.02em; color: #fff;
       text-shadow: 0 0 2px rgba(0,0,0,.7), 0 4px 14px rgba(0,0,0,.55); }
#sub .on { color: #ffc35c; }
#sub .k { font-family: SerifF; font-weight: 400; font-style: italic; font-size: 80px; letter-spacing: 0; }
.seam { position: absolute; left: 0; right: 0; top: 958px; height: 4px;
        background: linear-gradient(90deg, transparent, #7c6cff 20%, #ffc35c 50%, #7c6cff 80%, transparent);
        box-shadow: 0 0 18px rgba(124,108,255,.8); }
.tag { position: absolute; left: 40px; top: 760px; padding: 14px 24px; border-radius: 40px;
       background: rgba(10,10,20,.55); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,.25);
       font: 800 30px/1 Bold; color: #fff; letter-spacing: -0.01em; }
.tag b { color: #ffc35c; }
.hook { position: absolute; left: 70px; right: 70px; top: 300px; text-align: center; padding: 26px 30px; border-radius: 30px;
        background: rgba(10,10,20,.62); border: 1px solid rgba(255,255,255,.22);
        font: 800 58px/1.1 Bold; color: #fff; letter-spacing: -0.02em; }
.hook em { font-family: SerifF; font-weight: 400; color: #ffc35c; font-size: 70px; }
</style></head><body></body></html>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  const f = path.join(OUT, "page.html");
  fs.writeFileSync(f, html);
  await page.goto("file://" + f);
  const shot = async (inner, name) => {
    await page.evaluate((h) => { document.body.innerHTML = h; return document.fonts.ready; }, inner);
    await page.screenshot({ path: path.join(OUT, name), omitBackground: true });
  };
  await shot(`<div class="seam"></div>`, "seam.png");
  if (S.tag) await shot(`<div class="tag">${S.tag}</div>`, "tag.png");
  if (S.hook) await shot(`<div class="hook">${S.hook}</div>`, "hook.png");
  const clean = (w) => w.toLowerCase().replace(/[.,!?:;«»"]/g, "");
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
  console.log("calques podcast OK");
})();
