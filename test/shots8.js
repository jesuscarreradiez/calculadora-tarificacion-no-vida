const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const out = '/tmp/claude-0/-home-user/9451f465-8866-565a-82e6-9cb62b052902/scratchpad/';
  const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
  await p.goto('file:///home/user/tnv/dist/Calculadora_Tarificacion_No_Vida.html');
  await p.waitForTimeout(300);
  await p.screenshot({ path: out + 'u_home.png' });
  await p.evaluate(() => UI.go('ex'));
  await p.waitForTimeout(300);
  await p.screenshot({ path: out + 'u_ex.png' });
  await p.evaluate(() => UI.go(8, 't8-recargos'));
  await p.waitForTimeout(300);
  await p.screenshot({ path: out + 'u_t8.png' });
  await b.close();
})();
