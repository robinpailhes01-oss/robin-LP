const { chromium } = require('playwright-core');
const { spawn } = require('child_process');
const ffmpeg = require('ffmpeg-static');
const FPS = +(process.env.FPS || 60), START = +(process.env.START || 0), END = process.env.END ? +process.env.END : null, OUT = process.env.OUT || 'Luma-presentation-reel-9x16.mp4';
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox','--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + __dirname + '/reel.html');
  await p.evaluate(() => window.__ready);
  const dur = END ?? await p.evaluate(() => window.DURATION);
  const f0 = Math.round(START * FPS), f1 = Math.round(dur * FPS);
  const ff = spawn(ffmpeg, ['-y','-f','image2pipe','-framerate',String(FPS),'-c:v','png','-i','-','-c:v','libx264','-preset','slow','-crf','14','-pix_fmt','yuv420p','-movflags','+faststart',OUT], { stdio: ['pipe','ignore','inherit'] });
  const t0 = Date.now();
  for (let f = f0; f < f1; f++) {
    await p.evaluate((t) => window.render(t), f / FPS);
    const buf = await p.screenshot({ type: 'png' });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 300 === 0) console.log('frame', f, ((Date.now() - t0) / 1000).toFixed(0) + 's');
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await b.close();
  console.log('done', OUT, ((Date.now() - t0) / 1000).toFixed(0) + 's');
})();
