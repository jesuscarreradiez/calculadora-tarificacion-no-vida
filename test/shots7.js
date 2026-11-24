const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const out = require('os').tmpdir() + '/';
  const p = await b.newPage({ viewport: { width: 1400, height: 1000 } });
  await p.goto('file://' + require('path').resolve(__dirname, '../dist/Calculadora_Tarificacion_No_Vida.html'));
  for (const [n, id, ex] of [[8, 't8-recargos', 'oct6-cp'], [4, 't4-medidas', 'oct6-sl']]) {
    await p.evaluate(([n, id, ex]) => UI.go(n, id, ex), [n, id, ex]);
    await p.waitForFunction(() => !document.querySelector('.res.busy') && document.querySelector('.res .tiles, .res .err'), null, { timeout: 60000 });
    await p.waitForTimeout(100);
    await (await p.$('.res')).screenshot({ path: out + 'res_' + ex + '.png' });
  }
  await b.close();
})();
