// Muestra el texto plano que se copia (para revisar cómo queda al pegarlo)
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + require('path').resolve(__dirname, '../dist/Calculadora_Tarificacion_No_Vida.html'));
  const [id, e] = process.argv[2].split(':');
  await p.evaluate(([id, e]) => { window.__TNV_LAST = null; UI.goTool(id, e); }, [id, e]);
  await p.waitForFunction(() => window.__TNV_LAST, null, { timeout: 60000 }); await p.waitForTimeout(100);
  console.log(await p.evaluate(() => UI.answerPlain(document.querySelector('.caja-examen-body')).txt));
  await b.close();
})();
