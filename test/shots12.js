const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const out = process.argv[2];
  const p = await b.newPage({ viewport: { width: 1400, height: 1000 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + process.cwd() + '/dist/Calculadora_Tarificacion_No_Vida.html');
  await p.evaluate(() => UI.go(0)); await p.waitForTimeout(200); await p.screenshot({ path: out + '/k_home.png' });
  await p.evaluate(() => UI.go('p3', 't10-cred')); await p.waitForTimeout(200);
  await p.evaluate(() => { document.querySelectorAll('.pr-guide')[1].open = true; }); await p.waitForTimeout(100);
  await p.screenshot({ path: out + '/k_p3.png' });
  console.log(await p.$eval('#crumb', e => e.innerText), errs);
  await b.close();
})();
