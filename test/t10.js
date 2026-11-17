// Casos nuevos (no de examen) del Práctico 3: se comparan con cálculos independientes.
const { chromium } = require('playwright');
const close = (a, b, tol = 1e-7) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file:///home/user/tnv/dist/Calculadora_Tarificacion_No_Vida.html');
  const run = async (tool, values) => p.evaluate(async ([tool, values]) => {
    const t = UI.toolById(tool), id = 'tmp' + Math.random().toString(36).slice(2);
    t.examples.push({ id, label: id, values });
    UI.goTool(tool, id);
    for (let i = 0; i < 600 && (document.querySelector('.res.busy') || !document.querySelector('.res .tiles, .res .err')); i++) await new Promise(r => setTimeout(r, 50));
    const err = document.querySelector('.res .err'); if (err) return { err: err.innerText };
    const loose = document.querySelector('.ce-left');
    return { keys: window.__lastKeys || null, loose: !!loose, text: document.querySelector('.caja-examen-body') ? document.querySelector('.caja-examen-body').innerText : '' };
  }, [tool, values]);
  // acceso a las claves calculadas
  await p.evaluate(() => { const o = UI.result; });
  const out = [];
  const check = (name, got, exp) => { const ok = close(got, exp); out.push(`${ok ? 'OK ' : 'MAL'} ${name}: ${got} vs ${exp}`); };
  const keysOf = async () => p.evaluate(() => { const rows = [...document.querySelectorAll('.tile')].map(t => [t.querySelector('.tl').innerText, t.querySelector('.tv').innerText]); return rows; });
  const num = s => parseFloat(String(s).replace(/\./g, '').replace(',', '.').replace('−', '-').replace(/\s*%$/, ''));
  const tile = async (lab) => { const r = await keysOf(); const x = r.find(([l]) => l.includes(lab)); return x ? num(x[1]) : NaN; };

  // 1) Gamma–Poisson α = 3, β = 0,5, N = 1, 0, 2 → α* = 6, β* = 0,5/2,5 = 0,2, 𝔼 = 1,2; a priori 1,5 ⇒ reducción 20 %
  let r = await run('t10-cred', { modo: 'gp', ga: '3', gb: '0,5', obs: '1; 0; 2' });
  if (r.err) out.push('ERROR gp: ' + r.err); else { check('gp α*', await tile('α*'), 6); check('gp β*', await tile('β*'), 0.2); check('gp 𝔼 post', await tile('a posteriori = α*β*'), 1.2); check('gp reducción %', await tile('Reducción (PPVE)'), 20); if (r.loose) out.push('MAL fórmulas sueltas gp'); }
  // 2) sólo años para un 30 % con β = 0,25: h ≥ 0,3/(0,25·0,7) = 1,714 → 2 años
  r = await run('t10-cred', { modo: 'gp', ga: '2', gb: '0,25', obs: '', hN: '', mN: '', tg: '30%' });
  out.push(r.err ? 'ERROR gp-años: ' + r.err : `OK gp años: ${await tile('Años sin siniestros')} (esperado 2)`);
  // 3) Gamma–Poisson con h y media (sin lista): h = 5, N̄ = 2, α = 2, β = 1 ⇒ α* = 12, β* = 1/6, 𝔼 = 2 (sin cambio)
  r = await run('t10-cred', { modo: 'gp', ga: '2', gb: '1', obs: '', hN: '5', mN: '2' });
  if (r.err) out.push('ERROR gp-media: ' + r.err); else check('gp h-media 𝔼 post', await tile('a posteriori = α*β*'), 2);
  // 4) Beta con N Poisson(0,7), betas para n = 0, 1 con v = 5 y u automático; N = 0, 1, 0, 0
  {
    const lam = 0.7, p0 = Math.exp(-lam), p1 = lam * p0, v = 5, u0 = v * p0 / (1 - p0), u1 = v * p1 / (1 - p1), h = 4;
    const q0 = (u0 + 3) / (u0 + v + h), q1 = (u1 + 1) / (u1 + v + h), al = (1 - q0 - q1) / (1 - p0 - p1), E1 = q1 + al * (lam - p1), red = (lam - E1) / lam;
    r = await run('t10-cred', { modo: 'beta', noPri: false, N_fam: 'poisson', N_poisson_p_lam: '0,7', bt: [{ n: '0', u: '1', v: '5' }, { n: '1', u: '1', v: '5' }], uAuto: true, obs: '0; 1; 0; 0' });
    if (r.err) out.push('ERROR beta: ' + r.err); else { check('beta 𝔼(N) post', await tile('𝔼(N) a posteriori'), E1); check('beta α', await tile('α (escala'), al); check('beta %', await tile(red >= 0 ? 'Reducción (PPVE)' : 'Recargo (PPVE)'), Math.abs(red) * 100); if (r.loose) out.push('MAL fórmulas sueltas beta'); }
  }
  // 5) Beta sin distribución de N: IP(N = 0) ∼ Beta(3; 2), N = 2, 0 ⇒ u* = 4, v* = 3: 4/7; α = (3/7)/(2/5) = 15/14 ⇒ recargo 7,14 %
  r = await run('t10-cred', { modo: 'beta', noPri: true, bt: [{ n: '0', u: '3', v: '2' }], obs: '2; 0' });
  if (r.err) out.push('ERROR beta-noPri: ' + r.err); else check('beta noPri recargo %', await tile('Recargo (PPVE)'), (15 / 14 - 1) * 100);
  // 6) Bühlmann con I dado: I = 0,25, 𝔼 = 10, datos 12, 14 ⇒ h̃ = 4, z = 1/3, 𝔼 = 13/3·… = (1/3)·13 + (2/3)·10 = 11
  r = await run('t10-cred', { modo: 'buhl', bE: '10', bI: '0,25', obs: '12; 14' });
  if (r.err) out.push('ERROR buhl: ' + r.err); else check('buhl 𝔼 post', await tile('𝔼 a posteriori (Bühlmann)'), 11);
  // 7) Clásica: m = 100, s = 50, θ = 0,05, β = 0,9, h = 400, X̄ = 110 ⇒ z = 2·0,05·20/1,6449 = 1,2159 → 1; variación 10 %
  r = await run('t10-cred', { modo: 'clas', cm: '100', cs: '50', cth: '0,05', cbe: '0,9', hN: '400', mN: '110' });
  if (r.err) out.push('ERROR clas: ' + r.err); else { check('clas z', await tile('z'), 1); check('clas recargo %', await tile('Recargo'), 10); }
  // 8) Grupos: 3 tipos, Bühlmann y Bayes frente a cálculo directo
  {
    const xs = [0, 1, 2], W = [0.6, 0.3, 0.1], PS = [[0.7, 0.2, 0.1], [0.4, 0.4, 0.2], [0.2, 0.3, 0.5]], obs = [1, 2, 0];
    const E = PS.map(ps => ps.reduce((a, q, j) => a + q * xs[j], 0)), Vv = PS.map((ps, i) => ps.reduce((a, q, j) => a + q * (xs[j] - E[i]) ** 2, 0));
    const EE = W.reduce((a, w, i) => a + w * E[i], 0), Ev = W.reduce((a, w, i) => a + w * Vv[i], 0), Ve = W.reduce((a, w, i) => a + w * (E[i] - EE) ** 2, 0);
    const z = 3 / (3 + Ev / Ve), Eb = z * 1 + (1 - z) * EE;
    let lik = W.map((w, i) => w * obs.reduce((a, o) => a * PS[i][o], 1)); const s = lik.reduce((a, b) => a + b, 0); lik = lik.map(x => x / s);
    const Ep = lik.reduce((a, q, i) => a + q * E[i], 0);
    r = await run('t3-tipos', { vals: '0; 1; 2', tipos: [{ w: '0,6', p: '0,7; 0,2; 0,1' }, { w: '0,3', p: '0,4; 0,4; 0,2' }, { w: '0,1', p: '0,2; 0,3; 0,5' }], obs: '1; 2; 0', buOn: true, sevc: '1', m_rho: 'CVaR', m_lvl: '90', A: '1', B: '0' });
    if (r.err) out.push('ERROR tipos: ' + r.err); else { check('tipos Bühlmann 𝔼', await tile('𝔼 a posteriori (Bühlmann)'), Eb); check('tipos Bayes 𝔼', await tile('𝔼(N) a posteriori'), Ep); if (r.loose) out.push('MAL fórmulas sueltas tipos'); }
  }
  // 9) Mixtura Poisson–Gamma: Bühlmann debe coincidir con la conjugada (α = 2, β = 0,5; datos 0, 3)
  r = await run('t3-mixtura', { cond: 'poisson', L_fam: 'gamma', L_gamma_mode: 'p', L_gamma_p_a: '2', L_gamma_p_b: '0,5', bobs: '0; 3' });
  if (r.err) out.push('ERROR mixtura: ' + r.err); else check('mixtura Bühlmann = conjugada', await tile('𝔼 a posteriori (Bühlmann)'), (2 + 3) * 0.5 / (1 + 2 * 0.5));
  // 10) Prima con severidad (gamma, BN) — sólo que no falle y que haya texto
  r = await run('t10-cred', { modo: 'gp', ga: '2', gb: '0,5', obs: '0; 0; 1', prOn: true, fq: 'bn', S_fam: 'gamma', S_gamma_mode: 'mom', S_gamma_mom_E: '500', S_gamma_mom_sd: '400', m_rho: 'VaR', m_lvl: '99', A: '1,1', B: '0,05' });
  out.push(r.err ? 'ERROR prima: ' + r.err : `OK prima: a priori ${await tile('Prima a priori')}, a posteriori ${await tile('Prima a posteriori')}`);
  console.log(out.join('\n')); console.log('errores JS', errs);
  await b.close();
})();
