// Rendu image par image du montage (vidéo + habillage) → MP4 muet 30 i/s.
// Usage : node render.mjs [--stills 1.5,7.2,...]
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const { chromium } = createRequire(import.meta.url)("playwright");
const dir = path.dirname(fileURLToPath(import.meta.url));
const cues = JSON.parse(readFileSync(path.join(dir, "cues.json"), "utf8"));
cues.total = Math.round((cues.duration + 1.7) * 100) / 100; // + carte de fin
cues.frames = readdirSync(path.join(dir, "build", "frames")).filter((f) => f.endsWith(".jpg")).length;
writeFileSync(path.join(dir, "cues.js"), `window.__CUES = ${JSON.stringify(cues)};\n`);
mkdirSync(path.join(dir, "out"), { recursive: true });

const args = process.argv.slice(2);
const stills = args.includes("--stills") ? args[args.indexOf("--stills") + 1].split(",").map(Number) : null;
const FPS = 30;

const browser = await chromium.launch({ args: ["--allow-file-access-from-files"] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await page.goto("file://" + path.join(dir, "index.html"));
await page.evaluate(() => window.__ready);

if (stills) {
  for (const s of stills) {
    await page.evaluate((t) => window.render(t), s);
    await page.screenshot({ path: path.join(dir, "out", `still-${s.toFixed(2)}.png`) });
  }
  await browser.close();
  process.exit(0);
}
const total = Math.round(cues.total * FPS);
const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
  "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p", path.join(dir, "out", "reel-video-only.mp4")], { stdio: ["pipe", "inherit", "inherit"] });
const t0 = Date.now();
for (let f = 0; f < total; f++) {
  await page.evaluate((t) => window.render(t), f / FPS);
  const buf = await page.screenshot({ type: "jpeg", quality: 95 });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
  if (f % 150 === 0) console.log(`${f}/${total}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
ff.stdin.end();
await new Promise((r) => ff.on("close", r));
await browser.close();
console.log("vidéo OK");
