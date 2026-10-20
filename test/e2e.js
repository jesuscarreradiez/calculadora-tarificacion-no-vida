const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1400, height: 1000 } });
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  await p.goto('file:///home/user/tnv/dist/Calculadora_Tarificacion_No_Vida.html');
  await p.waitForTimeout(300);
  const tools = await p.evaluate(() => UI.TOOLS.map(t => ({ id: t.id, tema: t.tema, ex: (t.examples || []).map(e => e.id) })));
  for (const t of tools) {
    // default solve
    await p.evaluate(([n, id]) => UI.go(n, id), [t.tema, t.id]);
    await p.click('.btn');
    await p.waitForSelector('.res .tiles, .res .err', { timeout: 60000 });
    const er = await p.$eval('.res', e => e.querySelector('.err') ? e.querySelector('.err').innerText : null);
    console.log(`\n== ${t.id} [defecto] ${er ? 'ERROR: ' + er : 'ok'}`);
    for (const ex of t.ex) {
      await p.evaluate(([n, id, ex]) => UI.go(n, id, ex), [t.tema, t.id, ex]);
      await p.waitForFunction(() => !document.querySelector('.res.busy') && document.querySelector('.res .tiles, .res .err'), null, { timeout: 60000 });
      await p.waitForTimeout(50);
      const out = await p.evaluate(() => {
        const res = document.querySelector('.res');
        const err = res.querySelector('.err');
        if (err) return 'ERROR: ' + err.innerText;
        if (res.querySelector('.ce-left')) return 'FORMULAS SUELTAS: ' + res.querySelector('.ce-left').innerText.slice(0, 80);
        const tb = [...res.querySelectorAll('h3')].find(h => h.textContent.includes('Comparación con'));
        if (!tb) return 'ok (sin comparación)';
        const rows = [...tb.nextElementSibling.querySelectorAll('tr')].slice(1).map(r => [...r.children].map(c => c.innerText).slice(0, 4).join(' | '));
        return rows.join('\n      ');
      });
      console.log(`  - ${ex}: ${out}`);
    }
  }
  console.log('\nERRORES JS:', errs.length ? errs.join('\n') : 'ninguno');
  await b.close();
})();
