const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 720, height: 1280 } });
  await p.goto("file://" + __dirname + "/text.html"); await p.evaluate(() => document.fonts.ready);
  for (const [id, txt] of [["a", "Laisse-moi en parler à mon équipe…"], ["b", "Mon équipe"]]) {
    await p.evaluate(([id, txt]) => { const el = document.querySelector(".t"); el.id = id; el.textContent = txt; }, [id, txt]);
    await p.screenshot({ path: __dirname + `/txt_${id}.png`, omitBackground: true });
  }
  await b.close();
})();
