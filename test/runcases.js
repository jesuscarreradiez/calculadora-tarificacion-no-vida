// Ejecuta en la calculadora una lista de casos {tool, values} y devuelve sus resultados (claves calculadas).
// Uso: node test/runcases.js entrada.json salida.json
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const cases = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const b = await chromium.launch();
  const p = await b.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file:///home/user/tnv/dist/Calculadora_Tarificacion_No_Vida.html');
  const out = [];
  for (const c of cases) {
    const r = await p.evaluate(async ([tool, values]) => {
      const t = UI.toolById(tool), id = 'c' + Math.random().toString(36).slice(2);
      t.examples.push({ id, label: id, values });
      window.__TNV_LAST = null;
      UI.goTool(tool, id);
      for (let i = 0; i < 1200 && !window.__TNV_LAST; i++) await new Promise(r => setTimeout(r, 25));
      const R = window.__TNV_LAST; t.examples.pop();
      if (!R) return { err: 'sin respuesta' };
      if (R.error) return { err: R.error };
      const body = document.querySelector('.caja-examen-body');
      return { keys: R.keys, loose: !!document.querySelector('.ce-left'), nAns: (R.exam || []).length, txt: body ? body.innerText.length : 0, nan: body ? /NaN|undefined|Infinity/.test(body.innerText) : false };
    }, [c.tool, c.values]);
    out.push(Object.assign({ id: c.id }, r));
  }
  fs.writeFileSync(process.argv[3], JSON.stringify({ out, errs }));
  await b.close();
})();
