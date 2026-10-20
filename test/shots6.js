const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const out = '/tmp/claude-0/-home-user/9451f465-8866-565a-82e6-9cb62b052902/scratchpad/';
  const p = await b.newPage({ viewport: { width: 1400, height: 1000 } });
  await p.goto('file:///home/user/tnv/dist/Calculadora_Tarificacion_No_Vida.html');
  for (const [n, id, ex] of [[3, 't3-agregado', 'e14-3c'], [5, 't5-reaseguro', 'e14-5'], [4, 't4-medidas', 'e14-2a']]) {
    await p.evaluate(([n, id, ex]) => UI.go(n, id, ex), [n, id, ex]);
    await p.waitForFunction(() => !document.querySelector('.res.busy') && document.querySelector('.res .tiles, .res .err'), null, { timeout: 60000 });
    await p.waitForTimeout(100);
    const el = await p.$('.caja-examen, .ce');
    if (el) await el.screenshot({ path: out + 'ce_' + ex + '.png' }); else await p.screenshot({ path: out + 'ce_' + ex + '.png', fullPage: true });
    console.log(ex, await p.$eval('.res', e => e.innerText.slice(0, 200)));
  }
  await b.close();
})();
