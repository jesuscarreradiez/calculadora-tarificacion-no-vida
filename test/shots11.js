const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const out = require('os').tmpdir() + '/';
  const p = await b.newPage({ viewport: { width: 1400, height: 1000 } });
  await p.goto('file://' + require('path').resolve(__dirname, '../dist/Calculadora_Tarificacion_No_Vida.html'));
  for (const [id, ex] of [['t10-cred', 'e23-4b'], ['t10-cred', 'e23-4c'], ['t3-tipos', 'bu-ej2']]) {
    await p.evaluate(([id, ex]) => UI.goTool(id, ex), [id, ex]);
    await p.waitForFunction(() => !document.querySelector('.res.busy') && document.querySelector('.res .tiles, .res .err'), null, { timeout: 60000 });
    await p.waitForTimeout(100);
    const el = await p.$('.caja-examen'); await el.screenshot({ path: out + 'ce_' + ex + '.png' });
  }
  await p.evaluate(() => UI.go('p3')); await p.waitForTimeout(200); await p.screenshot({ path: out + 'p3.png' });
  await b.close();
})();
