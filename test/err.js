const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage();
 p.on('pageerror', e => console.log('PAGEERROR', e.message)); p.on('console', m => console.log('CONSOLE', m.type(), m.text()));
 await p.goto('file:///home/user/tnv/dist/Calculadora_Tarificacion_No_Vida.html'); await p.waitForTimeout(500); await b.close(); })();
