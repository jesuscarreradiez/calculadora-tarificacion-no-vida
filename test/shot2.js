const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1400, height: 1000 } });
 await p.goto('file://' + require('path').resolve(__dirname, '../dist/Calculadora_Tarificacion_No_Vida.html'));
 await p.evaluate(() => UI.go(5, 't5-reaseguro', 'e23-2b'));
 await p.waitForFunction(() => !document.querySelector('.res.busy') && document.querySelector('.caja-examen'), null, { timeout: 60000 });
 const el = await p.$('.caja-examen'); await el.screenshot({ path: require('os').tmpdir() + '/caja_t5.png' }); await b.close(); })();
