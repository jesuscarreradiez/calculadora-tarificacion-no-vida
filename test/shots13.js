const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const out = require('os').tmpdir();
  const p = await b.newPage({ viewport: { width: 1400, height: 1000 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + require('path').resolve(__dirname, '../dist/Calculadora_Tarificacion_No_Vida.html'));
  for (const ex of process.argv.slice(3)) {
    const [id, e] = ex.split(':');
    await p.evaluate(([id, e]) => UI.goTool(id, e), [id, e]);
    await p.waitForFunction(() => !document.querySelector('.res.busy') && document.querySelector('.res .tiles, .res .err'), null, { timeout: 60000 });
    await p.waitForTimeout(100);
    const el = await p.$('.caja-examen'); if (el) await el.screenshot({ path: process.argv[2] + '/ce_' + e + '.png' });
    console.log(e, await p.$eval('.res', x => (x.querySelector('.err') || {}).innerText || 'ok'));
  }
  console.log(errs); await b.close();
})();
