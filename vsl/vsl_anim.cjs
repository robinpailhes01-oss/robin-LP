// Rend les mock-ups animés de la VSL en séquences PNG transparentes (une image par 1/30 s).
// Usage : NODE_PATH=/opt/node-tools/node_modules node vsl_anim.cjs build/spec.json
// Modèles : anim_tpl.js, style : anim.css. Une séquence déjà rendue avec les mêmes réglages est réutilisée.
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DIR = __dirname;
const S = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const FPS = 30;
const page_html = `<!doctype html><html><head><meta charset="utf-8"><base href="file://${DIR}/">
<link rel="stylesheet" href="anim.css"><script src="anim_tpl.js"></script></head><body><div id="box"></div></body></html>`;
const version = crypto.createHash("md5").update(fs.readFileSync(path.join(DIR, "anim_tpl.js")) + fs.readFileSync(path.join(DIR, "anim.css"))).digest("hex");

(async () => {
  const browser = await chromium.launch({ args: ["--allow-file-access-from-files"] });
  const page = await browser.newPage({ viewport: { width: 1000, height: 1000 } });
  const f = path.join(S.out, "anim.html");
  fs.writeFileSync(f, page_html);
  await page.goto("file://" + f);
  await page.evaluate(() => document.fonts.ready);
  for (const g of S.graphics.filter((x) => x.type === "anim")) {
    const dir = path.join(S.out, `anim_${String(g.i).padStart(3, "0")}`);
    const key = crypto.createHash("md5").update(version + JSON.stringify({ ...g, t0: 0, t1: 0, i: 0, grp: 0 })).digest("hex");
    const stamp = path.join(dir, "key.txt");
    if (fs.existsSync(stamp) && fs.readFileSync(stamp, "utf8") === key) { console.log("anim", g.i, g.tpl, "(déjà rendue)"); continue; }
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    const dims = await page.evaluate((g) => { const T = window.TPL[g.tpl]; return [g.w || T.w, g.h || T.h]; }, g);
    await page.setViewportSize({ width: dims[0], height: dims[1] });
    await page.evaluate(async (g) => {
      const box = document.getElementById("box"); const T = window.TPL[g.tpl];
      box.style.width = (g.w || T.w) + "px"; box.style.height = (g.h || T.h) + "px";
      box.innerHTML = T.html(g);
      await Promise.all([...box.querySelectorAll("img")].map((i) => i.decode().catch(() => {})));
      await document.fonts.ready;
    }, g);
    const t0 = Date.now();
    for (let k = 0; k < g.nf; k++) {
      await page.evaluate(([g, t]) => window.TPL[g.tpl].update(t, g), [g, k / FPS]);
      await page.screenshot({ path: path.join(dir, `${String(k).padStart(4, "0")}.png`), omitBackground: true, clip: { x: 0, y: 0, width: dims[0], height: dims[1] } });
    }
    fs.writeFileSync(stamp, key);
    console.log("anim", g.i, g.tpl, g.nf, "images", ((Date.now() - t0) / 1000).toFixed(0) + " s");
  }
  await browser.close();
})();
