// Rend les textes du Reel « locked in » en PNG 1080×810 (bande 4:3) : cartons pleins et calques transparents.
// Usage : NODE_PATH=/opt/node-tools/node_modules node text.cjs <lang>
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const LANG = process.argv[2] || "fr";
const T = JSON.parse(fs.readFileSync(path.join(__dirname, "lines.json"), "utf8"))[LANG];
const OUT = path.join(__dirname, "build", "text", LANG);
fs.mkdirSync(OUT, { recursive: true });

const css = `
@font-face { font-family: Sans; src: url(assets/inter-tight-800.woff2); font-weight: 800; }
@font-face { font-family: SerifFace; src: url(assets/instrument-serif.woff2); }
html, body { margin: 0; width: 1080px; height: 810px; overflow: hidden; background: transparent; }
#t { position: absolute; left: 0; right: 0; top: 50%; transform: translateY(-52%); text-align: center; white-space: nowrap; }
.sans { font: 800 58px/1 Sans; letter-spacing: -0.028em; word-spacing: 0.05em; }
.serif { font: 400 66px/1 SerifFace; letter-spacing: -0.01em; }
`;

// [fichier, texte, fond, police, couleur]
const items = [
  ["l1-serif", T[0], null, "serif", "#fff"],
  ["l1-sans", T[0], null, "sans", "#fff"],
  ["card1", T[0], "#000", "sans", "#fff"],
  ["card2", T[1], "#fff", "sans", "#000"],
  ["card3", T[2], "#000", "sans", "#fff"],
  ["card4", T[3], "#fff", "sans", "#000"],
  ["card5", T[4], "#000", "sans", "#fff"],
  ["locked", T[5], null, "sans", "#fff"],
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 810 } });
  await page.goto("file://" + path.join(__dirname, "index-text.html"));
  await page.addStyleTag({ content: css });
  for (const [name, text, bg, font, color] of items) {
    await page.evaluate(({ text, bg, font, color }) => {
      document.body.style.background = bg || "transparent";
      document.body.innerHTML = `<div id="t" class="${font}" style="color:${color}">${text}</div>`;
      return document.fonts.ready;
    }, { text, bg, font, color });
    await page.screenshot({ path: path.join(OUT, name + ".png"), omitBackground: !bg });
  }
  await browser.close();
  console.log("textes", LANG, "OK");
})();
