// Rend un texte en PNG plein cadre (calque transparent ou carton plein) pour un Reel 1080×1920.
// Usage : NODE_PATH=/opt/node-tools/node_modules node text_png.cjs spec.json
// spec.json : un objet ou une liste d'objets
// "extra_css" : CSS libre ajouté au texte (ex. une ombre plus marquée).
//   { "out": "build/titre.png", "text": "Ligne 1<br>Ligne 2", "font": "/chemin/police.woff2", "weight": 700,
//     "size": 54, "line": 1.25, "top": 700, "color": "#fff", "bg": null, "shadow": true,
//     "upper": false, "tracking": "-0.01em", "width": 1080, "height": 1920 }
// - top = position du centre vertical du bloc (px). bg = couleur de carton ("#070002") ou null pour transparent.
// - shadow = ombre douce pour lire le texte sur une vidéo claire ou chargée.
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const arg = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const specs = Array.isArray(arg) ? arg : [arg];

(async () => {
  const browser = await chromium.launch();
  for (const s of specs) {
    const W = s.width || 1080, H = s.height || 1920;
    const page = await browser.newPage({ viewport: { width: W, height: H } });
    const out = path.resolve(s.out);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    const shadow = s.shadow ? "text-shadow: 0 3px 10px rgba(0,0,0,0.75), 0 0 3px rgba(0,0,0,0.6);" : "";
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: F; src: url("file://${path.resolve(s.font)}"); font-weight: ${s.weight || 400}; }
html, body { margin: 0; width: ${W}px; height: ${H}px; overflow: hidden; background: ${s.bg || "transparent"}; }
#t { position: absolute; left: ${s.side || 60}px; right: ${s.side || 60}px; top: ${s.top ?? H / 2}px; transform: translateY(-50%);
     text-align: center; color: ${s.color || "#fff"}; font: ${s.weight || 400} ${s.size || 54}px/${s.line || 1.25} F;
     letter-spacing: ${s.tracking || "0"}; ${s.upper ? "text-transform: uppercase;" : ""} ${shadow} ${s.extra_css || ""} }
</style></head><body><div id="t">${s.text}</div></body></html>`;
    // la page doit être un fichier (pas setContent) pour que la police locale se charge
    const tmp = out.replace(/\.png$/, ".html");
    fs.writeFileSync(tmp, html);
    await page.goto("file://" + tmp);
    await page.evaluate(() => document.fonts.ready);
    const ok = await page.evaluate(() => [...document.fonts].every((f) => f.status === "loaded"));
    if (!ok) console.warn("ATTENTION police non chargée pour", s.out);
    await page.screenshot({ path: out, omitBackground: !s.bg });
    fs.unlinkSync(tmp);
    await page.close();
    console.log("OK", s.out);
  }
  await browser.close();
})();
