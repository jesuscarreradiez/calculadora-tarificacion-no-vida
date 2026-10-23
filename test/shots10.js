const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const out = '/tmp/claude-0/-home-user/9451f465-8866-565a-82e6-9cb62b052902/scratchpad/';
  const p = await b.newPage({ viewport: { width: 1400, height: 1100 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file:///home/user/tnv/dist/Calculadora_Tarificacion_No_Vida.html');
  await p.evaluate(() => UI.go('p2', 't3-agregado')); await p.waitForTimeout(300);
  await p.evaluate(() => { document.querySelectorAll('.pr-guide')[0].open = true; });
  await p.waitForTimeout(100);
  await p.screenshot({ path: out + 'i_p2.png', fullPage: true });
  console.log(await p.$eval('.def-warn', e => e.innerText), await p.$$eval('.is-def', e => e.length));
  await p.fill('.fld[data-f="A"] input', '1,2'); await p.waitForTimeout(100);
  console.log(await p.$eval('.def-warn', e => e.innerText));
  await p.evaluate(() => UI.goTool('t3-agregado', 'j26-2ab'));
  await p.waitForFunction(() => !document.querySelector('.res.busy') && document.querySelector('.res .tiles, .res .err'), null, { timeout: 60000 });
  console.log('ex:', await p.$$eval('.is-def', e => e.length), await p.$eval('.def-warn', e => e.style.display));
  // empty a field → message
  await p.evaluate(() => UI.goTool('t3-agregado')); await p.fill('.fld[data-f="A"] input', ''); await p.click('.btn');
  await p.waitForSelector('.res .err, .res .tiles'); console.log(await p.$eval('.res', e => (e.querySelector('.err') || {}).innerText));
  console.log(errs);
  await b.close();
})();
