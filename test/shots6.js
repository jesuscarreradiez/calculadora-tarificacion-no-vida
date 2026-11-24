const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const out = require('os').tmpdir() + '/';
  const p = await b.newPage({ viewport: { width: 1400, height: 1000 } });
  await p.goto('file://' + require('path').resolve(__dirname, '../dist/Calculadora_Tarificacion_No_Vida.html'));
  for (const [n, id, ex] of [[3, 't3-agregado', 'nov10-j']]) {
    await p.evaluate(([n, id, ex]) => UI.goTool(id, ex), [n, id, ex]);
    await p.waitForFunction(() => !document.querySelector('.res.busy') && document.querySelector('.res .tiles, .res .err'), null, { timeout: 60000 });
    await p.waitForTimeout(100);
    const el = await p.$('.caja-examen, .ce');
    if (el) await el.screenshot({ path: out + 'ce_' + ex + '.png' }); else await p.screenshot({ path: out + 'ce_' + ex + '.png', fullPage: true });
    console.log(ex, await p.$eval('.res', e => e.innerText.slice(0, 200)));
  }
  await b.close();
})();
