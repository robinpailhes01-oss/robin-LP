const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, locale: 'fr-FR', reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  // Les requêtes passent par Node, qui vérifie les certificats avec le magasin de confiance du proxy.
  await p.route('**/*', async (route) => {
    try {
      const r = await fetch(route.request().url(), { method: route.request().method(), headers: { 'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1', 'accept-language': 'fr-FR' } });
      const body = Buffer.from(await r.arrayBuffer());
      const headers = {}; r.headers.forEach((v, k) => { if (!['content-encoding','content-length','transfer-encoding'].includes(k)) headers[k] = v; });
      await route.fulfill({ status: r.status, headers, body });
    } catch (e) { await route.abort(); }
  });
  await p.goto('https://harmonie-yacht.fr/', { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(2500);
  // accepter / fermer un éventuel bandeau cookies
  for (const t of ['Accepter', 'Tout accepter', 'OK', "J'accepte"]) { const l = p.getByRole('button', { name: t }); if (await l.count()) { await l.first().click().catch(()=>{}); break; } }
  const H = await p.evaluate(() => document.body.scrollHeight);
  let i = 0;
  for (let y = 0; y < H; y += 700) {
    if (y > 0) { for (let k = 0; k < 7; k++) { await p.mouse.wheel(0, 100); await p.waitForTimeout(60); } }
    await p.waitForTimeout(1600);
    await p.screenshot({ path: `caps/v-${String(i).padStart(2, '0')}.png` });
    i++;
  }
  console.log('captures', i, 'height', H);
  await b.close();
})();
