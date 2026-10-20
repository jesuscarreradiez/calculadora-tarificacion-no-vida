const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1400, height: 1000 } });
 await p.goto('file:///home/user/tnv/dist/Calculadora_Tarificacion_No_Vida.html');
 await p.evaluate(() => UI.go(5, 't5-reaseguro', 'e23-2b'));
 await p.waitForFunction(() => !document.querySelector('.res.busy') && document.querySelector('.caja-examen'), null, { timeout: 60000 });
 const el = await p.$('.caja-examen'); await el.screenshot({ path: '/tmp/claude-0/-home-user/9451f465-8866-565a-82e6-9cb62b052902/scratchpad/caja_t5.png' }); await b.close(); })();
