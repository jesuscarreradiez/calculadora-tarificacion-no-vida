const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1400, height: 1000 } });
 const errs=[]; p.on('pageerror', e => errs.push(e.message));
 await p.goto('file:///home/user/tnv/dist/Calculadora_Tarificacion_No_Vida.html'); await p.waitForTimeout(300);
 for (const prof of [false, true]) {
  await p.evaluate(v => { const c=document.getElementById('profPi'); c.checked=v; c.dispatchEvent(new Event('change')); }, prof);
  console.log('\n######## 2π≈6,28 =', prof);
  const ids = await p.evaluate(() => UI.toolById('t8-recargos').examples.map(e => e.id));
  for (const id of ids) {
   await p.evaluate(id => UI.go(8, 't8-recargos', id), id);
   await p.waitForFunction(() => !document.querySelector('.res.busy') && document.querySelector('.res .tiles, .res .err'), null, { timeout: 60000 }); await p.waitForTimeout(50);
   const out = await p.evaluate(() => { const r=document.querySelector('.res'); if (r.querySelector('.err')) return 'ERROR '+r.querySelector('.err').innerText;
     const tb=[...r.querySelectorAll('h3')].find(h=>h.textContent.includes('Comparación')); if(!tb) return 'ok'; return [...tb.nextElementSibling.querySelectorAll('tr')].slice(1).map(x=>[...x.children].slice(0,4).map(c=>c.innerText).join(' | ')).join('\n      '); });
   console.log(' -', id + ':', out);
  }
 }
 console.log('errores', errs); await b.close(); })();
