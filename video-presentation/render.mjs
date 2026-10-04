// Rendu image par image de la vidéo de présentation (16:9) → MP4.
// Usage : node render.mjs [--stills 0.5,1.3,...]
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dir = path.dirname(fileURLToPath(import.meta.url));
const cues = JSON.parse(readFileSync(path.join(dir, "cues.json"), "utf8"));
writeFileSync(path.join(dir, "cues.js"), `window.__CUES = ${JSON.stringify(cues)};\n`);
mkdirSync(path.join(dir, "out"), { recursive: true });

const args = process.argv.slice(2);
const stillsArg = args.includes("--stills") ? args[args.indexOf("--stills") + 1] : null;
const FPS = 60; // rendu interne, sortie 30 i/s avec flou de mouvement

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.addInitScript(() => { window.__RENDER = true; });
await page.goto("file://" + path.join(dir, "index.html"));
await page.evaluate(() => window.__ready);

if (stillsArg) {
  for (const s of stillsArg.split(",").map(Number)) {
    await page.evaluate((t) => window.render(t), s);
    await page.screenshot({ path: path.join(dir, "out", `still-${s.toFixed(2)}.png`) });
  }
  await browser.close();
  process.exit(0);
}

const total = Math.round(cues.duration * FPS);
const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
  "-vf", "tmix=frames=2:weights='1 1',fps=30", "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p",
  path.join(dir, "out", "luma-presentation-video-only.mp4")], { stdio: ["pipe", "inherit", "inherit"] });
const t0 = Date.now();
for (let f = 0; f < total; f++) {
  await page.evaluate((t) => window.render(t), f / FPS);
  const buf = await page.screenshot({ type: "jpeg", quality: 96 });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
  if (f % 120 === 0) console.log(`${f}/${total}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
ff.stdin.end();
await new Promise((r) => ff.on("close", r));
await browser.close();
console.log("vidéo OK");
