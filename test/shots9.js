const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const out = '/tmp/claude-0/-home-user/9451f465-8866-565a-82e6-9cb62b052902/scratchpad/';
  const p = await b.newPage({ viewport: { width: 1400, height: 1000 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file:///home/user/tnv/dist/Calculadora_Tarificacion_No_Vida.html');
  for (const g of ['gA', 'gB']) { await p.evaluate(g => UI.go(g), g); await p.waitForTimeout(200); await p.screenshot({ path: out + 'g_' + g + '.png', fullPage: true }); }
  await p.click('.gd-go'); await p.waitForTimeout(200);
  console.log(await p.$eval('#crumb', e => e.innerText), errs);
  await b.close();
})();
