const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const out = '/tmp/claude-0/-home-user/9451f465-8866-565a-82e6-9cb62b052902/scratchpad/';
  const p = await b.newPage({ viewport: { width: 1400, height: 1000 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file:///home/user/tnv/dist/Calculadora_Tarificacion_No_Vida.html');
  await p.evaluate(() => UI.go(0)); await p.waitForTimeout(200);
  await p.screenshot({ path: out + 'h_home.png' });
  for (const g of ['p1', 'p2', 'p3', 'p4']) { await p.evaluate(g => UI.go(g), g); await p.waitForTimeout(200); await p.screenshot({ path: out + 'h_' + g + '.png' }); }
  await p.evaluate(() => UI.goTool('t5-reaseguro', 'e26-1'));
  await p.waitForFunction(() => !document.querySelector('.res.busy') && document.querySelector('.res .tiles, .res .err'), null, { timeout: 60000 });
  await p.screenshot({ path: out + 'h_p1ex.png' });
  console.log(await p.$eval('#crumb', e => e.innerText), errs);
  await b.close();
})();
