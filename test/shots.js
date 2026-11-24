const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const out = require('os').tmpdir() + '/';
  for (const [w, h, tag] of [[1400, 1000, 'd'], [390, 844, 'm']]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto('file://' + require('path').resolve(__dirname, '../dist/Calculadora_Tarificacion_No_Vida.html'));
    await p.waitForTimeout(300);
    await p.screenshot({ path: out + tag + '_home.png', fullPage: false });
    for (const [n, id, ex] of [[3, 't3-agregado', 'j26-2ab'], [5, 't5-reaseguro', 'e26-1'], [4, 't4-medidas', 'e23-2a']]) {
      await p.evaluate(([n, id, ex]) => UI.go(n, id, ex), [n, id, ex]);
      await p.waitForFunction(() => !document.querySelector('.res.busy') && document.querySelector('.res .tiles, .res .err'), null, { timeout: 60000 });
      await p.waitForTimeout(100);
      await p.screenshot({ path: out + tag + '_' + id + '.png', fullPage: true });
    }
    await p.close();
  }
  await b.close();
})();
