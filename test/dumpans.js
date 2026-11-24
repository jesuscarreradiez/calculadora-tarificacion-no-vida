// Vuelca el texto de la «Respuesta de examen» de varios ejemplos (para revisarlo como un corrector)
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + require('path').resolve(__dirname, '../dist/Calculadora_Tarificacion_No_Vida.html'));
  for (const ex of process.argv.slice(2)) {
    const [id, e] = ex.split(':');
    await p.evaluate(([id, e]) => { window.__TNV_LAST = null; UI.goTool(id, e); }, [id, e]);
    await p.waitForFunction(() => window.__TNV_LAST, null, { timeout: 60000 }); await p.waitForTimeout(100);
    console.log('\n######## ' + ex + '\n' + await p.$eval('.caja-examen-body', x => x.innerText.replace(/⧉/g, '')));
  }
  await b.close();
})();
