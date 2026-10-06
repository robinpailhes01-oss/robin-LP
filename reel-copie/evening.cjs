// Rend le fond (interface façon app) et le masque arrondi de la carte vidéo du Reel « Good evening, Robin ».
// Usage : NODE_PATH=/opt/node-tools/node_modules node evening.cjs
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "build", "evening");
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto("file://" + path.join(__dirname, "evening.html"));
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(OUT, "bg.png") });
  await page.evaluate(() => document.body.classList.add("mask"));
  await page.screenshot({ path: path.join(OUT, "mask.png") });
  await browser.close();
  console.log("fond OK");
})();
