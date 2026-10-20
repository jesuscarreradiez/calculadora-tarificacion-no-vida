/* ════════════════════════════════════════════════════════════════
   TEMA 8 — Métodos de tarificación: recargos de la cartera y de cada
   póliza, efecto del reaseguro (§8.3) y de la cartera de valores (§8.4)
   ════════════════════════════════════════════════════════════════ */
'use strict';
(function () {
  const T = TNV, f = T.fmt, eq = UI.eq, vv = UI.v, rn = P.rn;
  const pct = x => T.fmtPct(x);

  UI.tema({
    n: 8, short: 'Recargos', title: 'Métodos de tarificación: recargos', color: 'var(--t8)',
    desc: 'Principio Π(y) = (1 + k₁)𝔼(y) + k₂ρ(−y): recargos máximos y mínimos de seguridad y riesgo de la cartera y de cada póliza, y cómo cambian con un reaseguro o invirtiendo las primas.',
    formulas: [
      ['Prima de la cartera (71)', 'Π = ρ(−y) − R₀'],
      ['Relación de recargos (73)', 'k₂ = 1 − R₀/ρ(−y) − (𝔼(y)/ρ(−y))(1 + k₁)'],
      ['Normal (74)', 'ρ(−y) = m + ρ<sub>(0,1)</sub>s'],
      ['Con reaseguro (78)', 'k̃₂ = (ρ(−y<sub>r</sub>) + Π<sub>R</sub>)/ρ(−y) − R₀/ρ(−y) − (𝔼(y)/ρ(−y))(1 + k̃₁)'],
      ['Conviene reasegurar (76)', 'Π<sub>R</sub> < ρ(−y) − ρ(−y<sub>r</sub>) = ρ(−y<sub>c</sub>)'],
      ['Cada póliza (88)', 'k₁ igual; k₂<sup>(p)</sup> = k₂·ρ(−y)/Σρ(−yᵢ)'],
      ['Cartera de valores (80–83)', 'B = A<sup>−1</sup>𝔼(r − r₀)/ρ<sub>(0,1)</sub>; M = 1/√(1 − BᵗAB); x = Mσ(y)B/Π; Π* = Π + ρ(R)/(1 + r₀)'],
      ['Riesgo con inversión (79)', 'ρ(R) = −R₀ − Π + 𝔼(y) + Π(−r₀x₀ − 𝔼(r)x + ρ<sub>(0,1)</sub>√(xᵗAx + σ²(y)/Π²))']
    ]
  });

  // ── álgebra lineal pequeña ──
  function inv(M) {
    const n = M.length, A = M.map((r, i) => [...r, ...M.map((_, j) => (i === j ? 1 : 0))]);
    for (let c = 0; c < n; c++) {
      let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
      if (Math.abs(A[p][c]) < 1e-15) throw new Error('La matriz de covarianzas no es invertible.');
      [A[c], A[p]] = [A[p], A[c]];
      const d = A[c][c]; for (let j = 0; j < 2 * n; j++) A[c][j] /= d;
      for (let r = 0; r < n; r++) if (r !== c) { const k = A[r][c]; for (let j = 0; j < 2 * n; j++) A[r][j] -= k * A[c][j]; }
    }
    return A.map(r => r.slice(n));
  }
  const mv = (M, x) => M.map(r => r.reduce((a, v, j) => a + v * x[j], 0));
  const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);

  const C_J25 = [{ n: '1000', E: '100', s: '1000', r: '1500' }, { n: '500', E: '80', s: '900', r: '1000' }, { n: '2000', E: '150', s: '1200', r: '1500' }, { n: '600', E: '100', s: '600', r: '1000' }];

  UI.tool({
    id: 't8-recargos', tema: 8, title: 'Recargos de la cartera y de cada póliza', tag: 'Ej. 2 de casi todos los exámenes',
    short: 'Prima global, recargos máximos y mínimos de seguridad y riesgo, recargos y primas por póliza; con reaseguro y con inversión de las primas.',
    cuando: '«Calcule los recargos máximo y mínimo de seguridad y riesgo para esta cartera… y para cada una de las pólizas, así como la prima correspondiente». También para «vuelva a calcular los recargos si hay un reaseguro…» y «si lo recaudado se diversifica entre un activo sin riesgo y…».',
    que: 'La cartera de pólizas independientes es normal (teoría del riesgo individual). Sin reservas, la prima que anula el riesgo es Π = ρ(−y) (ec. 71) y los recargos cumplen la relación lineal (73): con k₂ = 0 sale el recargo de seguridad máximo y con k₁ = 0 el recargo por riesgo máximo. Cada póliza conserva k₁ y multiplica k₂ por ρ(−y)/Σρ(−yᵢ) (ec. 88). El reaseguro desplaza la relación en (Π<sub>R</sub> − ρ(−y<sub>c</sub>))/ρ(−y) y la inversión de las primas reduce la prima en ρ(R)/(1 + r₀).',
    groups: [
      {
        title: 'Cartera', fields: [
          { id: 'src', type: 'sel', label: 'Datos', def: 'tabla', opts: [['tabla', 'Tabla de pólizas (nº, coste, desviación, riesgo)'], ['normal', 'Siniestralidad normal N(m; s) ya conocida']], wide: true },
          { id: 'cart', type: 'rows', label: 'Pólizas independientes', cols: [{ id: 'n', label: 'Nº' }, { id: 'E', label: 'Coste esp.' }, { id: 's', label: 'Desviación' }, { id: 'r', label: 'Riesgo' }], def: C_J25, show: v => v.src === 'tabla', help: '«Riesgo» = ρ(−yᵢ) de cada póliza (sirve para repartir k₂ entre las pólizas).' },
          { id: 'm', type: 'num', label: 'm = 𝔼(y)', def: '15', show: v => v.src === 'normal' },
          { id: 's', type: 'num', label: 's = σ(y)', def: '2,5', show: v => v.src === 'normal' },
          { id: 'sumR', type: 'num', label: 'Σ riesgos de las pólizas', def: '30', show: v => v.src === 'normal', help: 'Opcional: para los recargos por póliza' }
        ]
      },
      {
        title: 'Medida de riesgo y recargos', fields: [
          ...P.measFields('m_', { type: 'SW', a: '1' }),
          { id: 'R0', type: 'num', label: 'Reservas iniciales R₀', def: '0' },
          { id: 'r01o', type: 'num', label: 'ρ(0,1) a usar (opcional)', def: '', ph: 'exacto', help: 'Si el examen da o simula ρ(0,1) (p. ej. SW₁ = 1,603621301), escríbelo para reproducir su solución' },
          { id: 'k1', type: 'num', label: 'k₁ fijado (opcional)', def: '', ph: 'p. ej. 10 %', help: 'Calcula el k₂ que le corresponde' }
        ]
      },
      {
        title: 'Reaseguro (§8.3)', optional: true, openIf: v => v.reOn, fields: [
          { id: 'reOn', type: 'check', label: 'Hay reaseguro', def: false },
          { id: 're', type: 'text', label: 'Tratado', def: '0,5(y − 1.600.000)+', wide: true, show: v => v.reOn, help: 'Ej.: 0,2y (cuota-parte con retención del 80 %) · (y − U)+ · tramos: 0:0,2; 425.000:0,6' },
          { id: 'reT', type: 'sel', label: 'La expresión es', def: 'c', opts: [['c', 'el riesgo cedido y_c'], ['r', 'el riesgo retenido y_r']], show: v => v.reOn },
          { id: 'k1r', type: 'num', label: 'k₁ʳ de la reaseguradora', def: '0', show: v => v.reOn },
          { id: 'k2r', type: 'num', label: 'k₂ʳ de la reaseguradora', def: '0,04', show: v => v.reOn }
        ]
      },
      {
        title: 'Inversión de las primas (§8.4)', optional: true, openIf: v => v.invOn, fields: [
          { id: 'invOn', type: 'check', label: 'Se invierte lo recaudado', def: false },
          { id: 'r0', type: 'num', label: 'Rentabilidad sin riesgo r₀', def: '0', show: v => v.invOn, help: '0,5 % ⇒ 0,005' },
          { id: 'act', type: 'rows', label: 'Activos arriesgados (normales)', cols: [{ id: 'mu', label: 'Rentab. esperada' }, { id: 'sd', label: 'Desviación' }], def: [{ mu: '4%', sd: '10%' }, { mu: '5%', sd: '12%' }], show: v => v.invOn },
          { id: 'corr', type: 'text', label: 'Correlaciones', def: '1-2: 0,5', wide: true, show: v => v.invOn, help: 'Formato «1-2: 0,8; 1-3: 0». Las no indicadas son 0 (independientes).' },
          { id: 'iter', type: 'check', label: 'Repetir el cálculo con la nueva prima hasta riesgo nulo', def: false, show: v => v.invOn }
        ]
      }
    ],
    solve(V, { result }) {
      const R = result();
      const sp = P.buildMeas(V, 'm_');
      if (sp.type === 'Entropica') throw new Error('La medida entrópica no es homogénea: no sirve para este principio de prima.');
      const R0 = V.n('R0');
      // ── siniestralidad de la cartera ──
      let m, s, sumR = null, rows = null;
      if (V.s('src') === 'tabla') {
        rows = V.rows('cart'); if (!rows.length) throw new Error('La tabla de pólizas está vacía.');
        m = rows.reduce((a, r) => a + r.n * r.E, 0); s = Math.sqrt(rows.reduce((a, r) => a + r.n * r.s * r.s, 0));
        if (rows.every(r => r.r !== null && isFinite(r.r))) sumR = rows.reduce((a, r) => a + r.n * r.r, 0);
      } else { m = V.n('m'); s = V.n('s', { pos: 1 }); sumR = V.nOpt('sumR'); }
      const r01o = V.nOpt('r01o'), r01 = r01o !== null ? r01o : T.rhoStd(sp), rho = m + r01 * s, P0 = rho - R0, D = T.normal(m, s);
      const ratio = m / rho;
      const ext = (Pp) => ({ k1: (Pp - m) / m, k2: (Pp - m) / rho, k2m1: Pp / rho });
      const e0 = ext(P0 + 0); // con R0 la prima es ρ − R0
      let c = sumR ? rho / sumR : null;
      if (c && c > 1) { R.warn(`Σ nᵢρ(−yᵢ) = ${f(sumR)} es menor que ρ(−y) = ${f(rho)}: con estos datos el riesgo no es subaditivo, así que no se reparte k₂ entre las pólizas (la macro del profesor muestra «Riesgo no subaditivo»).`); c = null; }
      const lvl = RN => RN;
      R.tile('Prima de la cartera Π', P0, { main: true }).tile(rn(sp), rho).tile('Recargo de seguridad máx. (k₂ = 0)', e0.k1, { main: true }).tile('Recargo por riesgo máx. (k₁ = 0)', e0.k2, { main: true }).tile('Ratio de sustitución 𝔼(y)/ρ(−y)', ratio);
      if (c) R.tile('Factor por póliza ρ(−y)/Σρ(−yᵢ)', c);
      if (e0.k1 < 0 || e0.k2 < 0) R.warn('Algún recargo extremo sale negativo (la prima no supera la siniestralidad esperada); las macros del profesor lo toman como 0.');
      R.key('rho', rho).key('prima', P0).key('k1max', e0.k1).key('k2max', e0.k2).key('k2m1', e0.k2m1).key('ratio', ratio).key('c', c).key('m', m).key('s', s);
      if (T.profPi()) R.note('Modo «2π ≈ 6,28» activado: se reproduce la aproximación de las macros del profesor.');
      // Paso 1–3
      R.step('Siniestralidad de la cartera', rows ? `Pólizas independientes ⇒ normal (teoría del riesgo individual, ec. 61):` + eq(`m = Σ nᵢ𝔼(yᵢ) = ${rows.map(r => `${f(r.n)}·${f(r.E)}`).join(' + ')} = ${vv(m)}<br>s = √(Σ nᵢσ²(yᵢ)) = √(${rows.map(r => `${f(r.n)}·${f(r.s)}²`).join(' + ')}) = ${vv(s)}`) : eq(`y ∼ N(${f(m)}; ${f(s)})`));
      R.step('Riesgo y prima de la cartera', (r01o !== null ? eq(`ρ<sub>(0,1)</sub> = ${vv(r01)} (valor indicado; el exacto sería ${f(T.rhoStd(sp))})`) : eq(P.std01Explain(sp))) + eq(`${rn(sp)} = m + ρ<sub>(0,1)</sub>s = ${f(m)} + ${f(r01)} × ${f(s)} = ${vv(rho)}`) + eq(`Π = ${rn(sp)} − R₀ = ${vv(P0)}`));
      const relTxt = (shift) => `k₂ = ${R0 ? `1 − ${f(R0)}/${f(rho)}` : '1'}${shift ? (shift < 0 ? ' − ' : ' + ') + f(Math.abs(shift)) : ''} − ${f(ratio)}(1 + k₁)`;
      R.step('Relación entre recargos (ec. 73)', eq(`k₂ = 1 − R₀/${rn(sp)} − (𝔼(y)/${rn(sp)})(1 + k₁) ⇒ ${relTxt(0)}`) +
        eq(`k₂ = 0 ⇒ k₁ = Π/𝔼(y) − 1 = ${vv(e0.k1)} &nbsp;&nbsp; k₁ = 0 ⇒ k₂ = (Π − 𝔼(y))/${rn(sp)} = ${vv(e0.k2)} &nbsp;&nbsp; (k₁ = −1 ⇒ k₂ = ${f(e0.k2m1)})`) +
        `Los recargos válidos son los pares (k₁, k₂) de esa recta con k₁ entre 0 y ${f(e0.k1)} y k₂ entre 0 y ${f(e0.k2)}. La ratio de sustitución es ${f(ratio)}: cada punto de k₁ equivale a ${f(ratio)} puntos de k₂.`);
      R.uses(rows ? 'tcl61' : null, 'norm44', 'prima71', 'k73');
      R.ans('Prima y recargos de la cartera.', `${rows ? `La siniestralidad de la cartera es normal de media ${f(m)} y desviación ${f(s)}.` : ''} Como ${rn(sp)} = ${f(m)} + ${f(r01)} × ${f(s)} = ${vv(rho)}, la prima de la cartera es Π = ${vv(P0)} y la relación entre recargos es` + eq(`${relTxt(0)}`) +
        `Por tanto, los recargos extremos son (k₁; k₂) = (${vv(e0.k1)}; 0) y (0; ${vv(e0.k2)}). Ambos conducen a la misma prima: ${f(m)} × (1 + ${f(e0.k1)}) = ${f(m)} + ${f(e0.k2)} × ${f(rho)} = ${f(P0)}.`);
      const k1g = V.nOpt('k1');
      if (k1g !== null) {
        const k2g = 1 - R0 / rho - ratio * (1 + k1g);
        R.tile(`k₂ para k₁ = ${pct(k1g)}`, k2g); R.key('k2g', k2g);
        R.step(`k₂ correspondiente a k₁ = ${f(k1g)}`, eq(`k₂ = ${relTxt(0).replace('k₂ = ', '')} con k₁ = ${f(k1g)} ⇒ k₂ = ${vv(k2g)}`) + (c ? eq(`Por póliza: k₂<sup>(p)</sup> = ${f(k2g)} × ${f(c)} = ${vv(k2g * c)}`) : ''));
        R.ans(`Con k₁ = ${pct(k1g)}.`, `De la relación anterior, k₂ = ${vv(k2g)}${c ? ` para la cartera y ${vv(k2g * c)} para cada póliza` : ''}.`);
        if (c) R.key('k2gp', k2g * c);
      }
      // ── por póliza ──
      // Las cuatro combinaciones habituales de recargos (como en las hojas del profesor):
      // (k₁ máx; 0), (−1; k₂), (0; k₂ máx) y (k₁ fijado; k₂). k₂ = (Π − (1 + k₁)𝔼(y))/ρ(−y); por póliza × c.
      const combos = Pp => {
        const k2of = k1 => (Pp - (1 + k1) * m) / rho;
        const cs = [{ lab: 'Seguridad máx. (k₂ = 0)', k1: Pp / m - 1 }, { lab: 'k₁ = −1', k1: -1 }, { lab: 'Riesgo máx. (k₁ = 0)', k1: 0 }];
        if (k1g !== null) cs.push({ lab: `k₁ = ${f(k1g)}`, k1: k1g });
        cs.forEach(x => { x.k2 = k2of(x.k1); x.k2p = c ? x.k2 * c : null; });
        cs[0].k2 = 0; if (c) cs[0].k2p = 0;
        return cs;
      };
      const polTable = (title, Pp, tag) => {
        const cs = combos(Pp);
        R.table(`${title}: recargos de la cartera${c ? ' y de cada póliza' : ''}`, ['Combinación', 'k₁', 'k₂ cartera', ...(c ? ['k₂ por póliza = k₂·' + f(c, 6)] : []), 'Prima cartera (1 + k₁)𝔼 + k₂ρ'],
          cs.map(x => [x.lab, x.k1, x.k2, ...(c ? [x.k2p] : []), (1 + x.k1) * m + x.k2 * rho]));
        if (!rows || !c) return;
        const pr = (x, r) => (1 + x.k1) * r.E + x.k2p * r.r;
        R.table(`${title}: prima de cada póliza`, ['Pólizas nᵢ', '𝔼(yᵢ)', 'ρ(−yᵢ)', ...cs.map(x => `(${f(x.k1, 6)}; ${f(x.k2p, 6)})`), 'Proporcional al riesgo (86)'],
          [...rows.map(r => [f(r.n), r.E, r.r, ...cs.map(x => pr(x, r)), Pp * r.r / sumR]),
            ['<b>Σ nᵢ·Πᵢ</b>', '', '', ...cs.map(x => rows.reduce((a, r) => a + r.n * pr(x, r), 0)), Pp]]);
        cs.forEach((x, k) => rows.forEach((r, i) => R.key(`${tag}c${k + 1}_${i + 1}`, pr(x, r))));
        R.ans(`${title}: primas por póliza.`, `Con k₂ por póliza = k₂ de la cartera × ${f(c)}, la prima de cada tipo es Πᵢ = (1 + k₁)𝔼(yᵢ) + k₂ρ(−yᵢ):` +
          eq(cs.map(x => `${x.lab}: (k₁; k₂) = (${f(x.k1)}; ${f(x.k2p)}) ⇒ ${rows.map((r, i) => `Π${i + 1} = ${f(pr(x, r))}`).join(', ')}; Σ nᵢΠᵢ = ${f(rows.reduce((a, r) => a + r.n * pr(x, r), 0))}`).join('<br>')) +
          `En todos los casos la suma de las primas de las pólizas reproduce la prima de la cartera, ${vv(Pp)}.`);
      };
      if (c) {
        const k2p = e0.k2 * c;
        R.key('k2p', k2p);
        R.tile('Recargo por riesgo máx. por póliza', k2p);
        R.step('Recargos de cada póliza (ec. 88)', `El recargo de seguridad es el mismo para todas las pólizas; el recargo por riesgo se multiplica por la ratio de riesgo no eliminada por la diversificación:` +
          eq(`ρ(−y)/Σ nᵢρ(−yᵢ) = ${f(rho)}/${rows ? rows.map(r => `${f(r.n)}·${f(r.r)}`).join(' + ') : f(sumR)} = ${f(rho)}/${f(sumR)} = ${vv(c)}`) +
          eq(`Pólizas: (k₁; k₂) = (${vv(e0.k1)}; 0) y (0; ${f(e0.k2)} × ${f(c)}) = (0; ${vv(k2p)}); ratio de sustitución por póliza ${f(ratio)} × ${f(c)} = ${f(ratio * c)}`));
        R.uses('k88');
        R.ans('Recargos y primas de cada póliza.', `El recargo de seguridad máximo de cada póliza sigue siendo ${vv(e0.k1)}, y el recargo por riesgo máximo se obtiene multiplicando ${f(e0.k2)} por ${f(rho)}/${f(sumR)} = ${f(c)}, es decir, k₂ = ${vv(k2p)}. ${rows ? 'Las primas de cada tipo de póliza son: ' + rows.map((r, i) => `tipo ${i + 1}: ${f((1 + e0.k1) * r.E)} (con k₁) y ${f(r.E + k2p * r.r)} (con k₂)`).join('; ') + '.' : ''}`);
        if (rows) rows.forEach((r, i) => R.key('pk1_' + (i + 1), (1 + e0.k1) * r.E).key('pk2_' + (i + 1), r.E + k2p * r.r));
      } else R.note('Para repartir los recargos entre las pólizas hace falta el riesgo ρ(−yᵢ) de cada una (columna «Riesgo»).');
      polTable('Sin reaseguro', P0, '');

      // ── reaseguro ──
      if (V.b('reOn')) {
        let tr; try { tr = T.parseTreaty(V.s('re')); } catch (e) { throw new Error('Reaseguro: ' + e.message); }
        const yc = V.s('reT') === 'r' ? T.plComplement(tr) : tr, yr = T.plComplement(yc);
        const k1r = V.n('k1r'), k2r = V.n('k2r');
        const C = T.transformDist(D, yc), Rr = T.transformDist(D, yr);
        const Eyc = C.mean, rhoc = T.risk(C, sp), PR = (1 + k1r) * Eyc + k2r * rhoc, rhor = T.risk(Rr, sp);
        const shift = (PR - rhoc) / rho, Pt = P0 + PR - rhoc, e1 = ext(Pt);
        const conv = PR < rhoc;
        R.tile('Precio del reaseguro Π<sub>R</sub>', PR).tile('Prima de la cartera con reaseguro', Pt, { main: true }).tile('k₁ máx. con reaseguro', e1.k1).tile('k₂ máx. con reaseguro', e1.k2);
        R.key('Eyc', Eyc).key('rhoc', rhoc).key('PR', PR).key('primaRe', Pt).key('k1Re', e1.k1).key('k2Re', e1.k2).key('shift', shift);
        R.step('Reaseguro: riesgo cedido y precio', eq(`y<sub>c</sub> = ${T.treatyToString(yc)}; &nbsp; y<sub>r</sub> = ${T.treatyToString(yr)}`) +
          yc.layers.map(l => eq(P.slFormula({ D, normal: true, m, s }, l.U))).join('') +
          eq(`𝔼(y<sub>c</sub>) = ${vv(Eyc)}; &nbsp; ${rn(sp, '−y<sub>c</sub>')} = ${vv(rhoc)}`) +
          eq(`Π<sub>R</sub> = (1 + ${f(k1r)})·${f(Eyc)} + ${f(k2r)}·${f(rhoc)} = ${vv(PR)}`));
        R.step('Nueva relación de recargos (ec. 78)', eq(`(Π<sub>R</sub> − ${rn(sp, '−y<sub>c</sub>')})/${rn(sp)} = (${f(PR)} − ${f(rhoc)})/${f(rho)} = ${vv(shift)}`) +
          eq(relTxt(shift)) + eq(`k₂ = 0 ⇒ k₁ = ${vv(e1.k1)}; &nbsp; k₁ = 0 ⇒ k₂ = ${vv(e1.k2)}; &nbsp; prima de la cartera = ${f(rho)} ${PR - rhoc < 0 ? '−' : '+'} ${f(Math.abs(PR - rhoc))} = ${vv(Pt)}`) +
          (conv ? '<span class="okb">El reaseguro conviene</span> (ec. 77): Π<sub>R</sub> < ρ(−y<sub>c</sub>), así que la prima baja.' : '<span class="badb">El reaseguro no conviene</span>: Π<sub>R</sub> ≥ ρ(−y<sub>c</sub>), la prima sube.'));
        R.uses('rea58', 'k78');
        R.ans('Con reaseguro.', `El riesgo cedido es y<sub>c</sub> = ${T.treatyToString(yc)}, con 𝔼(y<sub>c</sub>) = ${f(Eyc)} y ${rn(sp, '−y<sub>c</sub>')} = ${f(rhoc)}. El precio del reaseguro será ${f(1 + k1r)} × ${f(Eyc)} + ${f(k2r)} × ${f(rhoc)} = ${vv(PR)}. Por consiguiente, las relaciones entre los recargos son las anteriores ${shift < 0 ? 'menos' : 'más'} (${f(PR)} − ${f(rhoc)})/${f(rho)} = ${f(Math.abs(shift))}, es decir,` + eq(relTxt(shift)) +
          `Se obtiene (k₁; k₂) = (${vv(e1.k1)}; 0) y (0; ${vv(e1.k2)}). La prima de la cartera será ${f(rho)} ${PR - rhoc < 0 ? '−' : '+'} ${f(Math.abs(PR - rhoc))} = ${vv(Pt)}${c ? `, y para cada póliza k₂ se multiplica por ${f(c)}: k₂ = ${vv(e1.k2 * c)}` : ''}. ${conv ? 'El reaseguro abarata la prima, así que conviene a la cedente.' : 'El reaseguro encarece la prima.'}`);
        if (c) R.key('k2Rep', e1.k2 * c);
        polTable('Con reaseguro', Pt, 're');
        const plr = C.sf(PR); R.key('plr', plr);
        R.step('Probabilidad de pérdidas para la reaseguradora', eq(`IP(y<sub>c</sub> > Π<sub>R</sub>) = ${vv(plr)}`));
        R.ans('Pérdidas de la reaseguradora.', `La reaseguradora pierde dinero si y<sub>c</sub> > ${f(PR)}, lo que ocurre con probabilidad ${vv(plr)}.`);
      }

      // ── inversión ──
      if (V.b('invOn')) {
        const r0 = V.n('r0'), act = V.rows('act');
        if (!act.length) throw new Error('Añade al menos un activo arriesgado.');
        const n = act.length, A = act.map((a, i) => act.map((b, j) => i === j ? a.sd * a.sd : 0));
        const cs = V.s('corr').trim();
        if (cs) for (const part of cs.split(/[;|]+/)) {
          const mm = part.trim().match(/^(\d+)\s*-\s*(\d+)\s*:\s*(.+)$/);
          if (!mm) throw new Error('Correlaciones: usa el formato «1-2: 0,5».');
          const i = +mm[1] - 1, j = +mm[2] - 1, rv = T.parseNum(mm[3]);
          if (!(i >= 0 && j >= 0 && i < n && j < n) || isNaN(rv)) throw new Error('Correlación fuera de rango: ' + part);
          A[i][j] = A[j][i] = rv * act[i].sd * act[j].sd;
        }
        const ex = act.map(a => a.mu - r0), Ai = inv(A), B = mv(Ai, ex).map(v => v / r01);
        const BAB = dot(B, mv(A, B));
        if (!(BAB < 1)) throw new Error('BᵗAB ≥ 1: con estos activos el riesgo se puede hacer tan negativo como se quiera (revisa los datos).');
        const M = 1 / Math.sqrt(1 - BAB);
        const step = Pp => {
          const x = B.map(b => M * s / Pp * b), x0 = 1 - x.reduce((a, b) => a + b, 0);
          const Er = dot(act.map(a => a.mu), x);
          const rr = -R0 - Pp + m + Pp * (-r0 * x0 - Er + r01 * Math.sqrt(dot(x, mv(A, x)) + s * s / (Pp * Pp)));
          return { x, x0, rr, Pn: Pp + rr / (1 + r0) };
        };
        const it = [step(P0)];
        if (V.b('iter')) for (let k = 0; k < 30 && Math.abs(it[it.length - 1].rr) > 1e-9 * P0; k++) it.push(step(it[it.length - 1].Pn));
        const last = it[it.length - 1], first = it[0];
        const Pf = V.b('iter') ? last.Pn : first.Pn, e2 = ext(Pf);
        R.tile('Riesgo con la inversión ρ(R)', first.rr).tile('Nueva prima Π*', Pf, { main: true }).tile('k₁ máx. con inversión', e2.k1).tile('k₂ máx. con inversión', e2.k2);
        R.key('rhoR', first.rr).key('primaInv', Pf).key('k1Inv', e2.k1).key('k2Inv', e2.k2).key('x0', first.x0); first.x.forEach((v, i) => R.key('x' + (i + 1), v));
        if (c) R.key('k2Invp', e2.k2 * c);
        const wtxt = o => `x₀ = ${f(o.x0)} (sin riesgo)${o.x.map((v, i) => `, x${i + 1} = ${f(v)}`).join('')}`;
        R.step('Cartera de valores óptima (ec. 80–82)', eq(`A = matriz de covarianzas; 𝔼(r − r₀) = (${ex.map(v => f(v)).join('; ')})`) +
          eq(`B = (1/ρ<sub>(0,1)</sub>)A<sup>−1</sup>𝔼(r − r₀) = (${B.map(v => f(v)).join('; ')}); &nbsp; BᵗAB = ${f(BAB)}; &nbsp; M = 1/√(1 − BᵗAB) = ${vv(M)}`) +
          eq(`x = M·σ(y)/Π·B ⇒ ${wtxt(first)}`) +
          eq(`ρ(R) = −R₀ − Π + 𝔼(y) + Π(−r₀x₀ − 𝔼(r)x + ρ<sub>(0,1)</sub>√(xᵗAx + σ²(y)/Π²)) = ${vv(first.rr)}`) +
          eq(`Π* = Π + ρ(R)/(1 + r₀) = ${f(P0)} ${first.rr < 0 ? '−' : '+'} ${f(Math.abs(first.rr))}/${f(1 + r0)} = ${vv(first.Pn)}`) +
          (V.b('iter') ? `Repitiendo el cálculo con la nueva prima (${it.length} iteraciones) el riesgo global se anula: Π* = ${vv(last.Pn)}, ${wtxt(last)}.` : '') +
          eq(`Nuevos recargos: k₂ = 0 ⇒ k₁ = ${vv(e2.k1)}; &nbsp; k₁ = 0 ⇒ k₂ = ${vv(e2.k2)}${c ? ` (por póliza ${f(e2.k2 * c)})` : ''}`));
        R.uses('inv80');
        R.ans('Inversión de las primas.', `Con las notaciones del curso, B = (1/ρ<sub>(0,1)</sub>)A<sup>−1</sup>𝔼(r − r₀) = (${B.map(v => f(v)).join('; ')}), M = ${f(M)} y x = Mσ(y)B/Π, de donde la estrategia óptima de inversión es ${wtxt(first)}. El riesgo global actuarial/financiero es ρ(R) = ${vv(first.rr)}, por lo que la prima ${first.rr < 0 ? 'puede reducirse' : 'debe aumentar'} hasta Π* = ${f(P0)} ${first.rr < 0 ? '−' : '+'} ${f(Math.abs(first.rr))}${r0 ? '/' + f(1 + r0) : ''} = ${vv(first.Pn)}${V.b('iter') ? ` (iterando hasta riesgo nulo: ${vv(last.Pn)})` : ''}. Los recargos saldrán de (1 + k₁)${f(m)} + ${f(rho)}k₂ = ${f(Pf)}: k₂ = 0 ⇒ k₁ = ${vv(e2.k1)}; k₁ = 0 ⇒ k₂ = ${vv(e2.k2)}${c ? `; por póliza, k₂ = ${f(e2.k2)} × ${f(c)} = ${vv(e2.k2 * c)}` : ''}.`);
      }
      return R;
    },
    examples: [
      { id: 'oct6-cp', label: 'Clase 6 oct. 2026 · cartera 1.000/5.000/10.000, CVaR 95 %, cuota-parte con retención del 60 % (PPVE 1 %)', values: { src: 'tabla', cart: [{ n: '1000', E: '5', s: '10', r: '100' }, { n: '5000', E: '8', s: '12', r: '200' }, { n: '10000', E: '12', s: '25', r: '280' }], m_rho: 'CVaR', m_lvl: '95', R0: '0', r01o: '', k1: '0,005', reOn: true, re: '0,4y', reT: 'c', k1r: '0,01', k2r: '0', invOn: false },
        expect: [{ k: 'rho', l: 'CVaR<sub>95%</sub>(−y) = prima', v: 170484.6444, src: 'hoja Octubre_6' }, { k: 'k1max', l: 'k₁ máx.', v: 0.033240269 }, { k: 'k2max', l: 'k₂ máx.', v: 0.0321708995 }, { k: 'k2g', l: 'k₂ con k₁ = 0,005', v: 0.027331754 }, { k: 'c', l: 'Coeficiente reductor ρ/Σρᵢ', v: 0.0437140114 }, { k: 'PR', l: 'Coste del reaseguro 1,01·0,4·𝔼(y)', v: 66660 }, { k: 'primaRe', l: 'Nueva prima', v: 168950.7866 }, { k: 'k1Re', l: 'k₁ máx. con reaseguro', v: 0.0239441613 }, { k: 'k2Re', l: 'k₂ máx. con reaseguro', v: 0.0231738561 }],
        note: 'Hoja de clase (no es de examen). Reproduce las cuatro combinaciones del profesor: (k₁ máx; 0), (−1; k₂), (0; k₂ máx) y (0,005; k₂), con las primas de cada póliza y su suma.' },
      { id: 'oct6-sl', label: 'Clase 6 oct. 2026 · misma cartera con stop-loss de deducible 165.000 (PPVE 1 %)', values: { src: 'tabla', cart: [{ n: '1000', E: '5', s: '10', r: '100' }, { n: '5000', E: '8', s: '12', r: '200' }, { n: '10000', E: '12', s: '25', r: '280' }], m_rho: 'CVaR', m_lvl: '95', R0: '0', r01o: '', k1: '0,005', reOn: true, re: '(y − 165.000)+', reT: 'c', k1r: '0,01', k2r: '0', invOn: false },
        expect: [{ k: 'Eyc', l: '𝔼(y<sub>c</sub>)', v: 1055.634204, src: 'simulado (macro Riesgos_SL)' }, { k: 'rhoc', l: 'CVaR<sub>95%</sub>(−y<sub>c</sub>)', v: 5483.593023, src: 'simulado' }, { k: 'primaRe', l: 'Nueva prima', v: 166067.2419, src: 'con los valores simulados' }],
        note: 'La hoja usa 𝔼(y<sub>c</sub>) y el CVaR cedido simulados con la macro «Riesgos_SL»; los valores exactos son 𝔼(y<sub>c</sub>) = s·φ(0) = 1.060,766 y CVaR = s·2,0627 = 5.484,644.' },
      { id: 'j25-2a', label: 'Junio 2025 · Ej. 2a · SW₁, cartera de 4 tipos', values: { r01o: '1,603621301' }, expect: [{ k: 'prima', l: 'Prima de la cartera', v: 607586.1392, src: 'SW₁(N(0,1)) simulada 1,6036' }, { k: 'pk1_1', l: 'Prima tipo I (k₁)', v: 121.5172278 }, { k: 'pk2_1', l: 'Prima tipo I (k₂)', v: 128.8177159 }, { k: 'pk1_3', l: 'Prima tipo III (k₁)', v: 182.2758418 }, { k: 'pk2_3', l: 'Prima tipo III (k₂)', v: 178.8177159 }] },
      {
        id: 'e19-2abc', label: 'Enero 2019 · Ej. 2 · CVaR 95 %, reaseguro 0,5(y − 1,6M)+, inversión', values: { cart: [{ n: '1000', E: '100', s: '1000', r: '1800' }, { n: '2500', E: '100', s: '950', r: '1600' }, { n: '4000', E: '150', s: '1800', r: '2800' }, { n: '3000', E: '200', s: '3000', r: '4500' }], m_rho: 'CVaR', m_lvl: '95', r01o: '2,064381357', reOn: true, re: '0,5(y − 1.600.000)+', reT: 'c', k1r: '0', k2r: '0,04', invOn: true, r0: '0', act: [{ mu: '4%', sd: '10%' }, { mu: '5%', sd: '12%' }], corr: '1-2: 0,5' },
        expect: [{ k: 'rho', l: 'CVaR<sub>95%</sub>(−y)', v: 1979154.3, src: 'ρ(0,1) simulado 2,064381357' }, { k: 'ratio', l: 'Ratio 𝔼/ρ', v: 0.783162788 }, { k: 'c', l: 'Factor por póliza', v: 0.064890305 }, { k: 'PR', l: 'Precio del reaseguro', v: 37589.464 }, { k: 'k2Re', l: 'k₂ con reaseguro', v: 0.140151349 }, { k: 'k1Re', l: 'k₁ con reaseguro', v: 0.178955578 }, { k: 'rhoR', l: 'ρ(R) con inversión', v: -11357.94322 }, { k: 'k2Inv', l: 'k₂ con inversión', v: 0.211098425 }, { k: 'k1Inv', l: 'k₁ con inversión', v: 0.269546036 }]
      },
      {
        id: 'e20-2', label: 'Enero 2020 · Ej. 2 · SW₁, reaseguro 0,1y + 0,5(y − 1,7M)+, inversión', values: { cart: [{ n: '1000', E: '100', s: '1000', r: '10000' }, { n: '2500', E: '100', s: '950', r: '9000' }, { n: '4000', E: '150', s: '1800', r: '20000' }, { n: '3000', E: '200', s: '3000', r: '35000' }], m_rho: 'SW', m_a: '1', r01o: '1,603621301', reOn: true, re: '0,1y + 0,5(y − 1.700.000)+', reT: 'c', k1r: '0', k2r: '0,04', invOn: true, r0: '0', act: [{ mu: '6%', sd: '10%' }, { mu: '7%', sd: '12%' }], corr: '1-2: 0,4' },
        expect: [{ k: 'rho', l: 'SW<sub>1</sub>(−y)', v: 1883369.11, src: 'SW₁ simulada' }, { k: 'c', l: 'Factor por póliza', v: 0.008659168 }, { k: 'primaRe', l: 'Prima con reaseguro', v: 1778540.978 }, { k: 'k1Re', l: 'k₁ con reaseguro', v: 0.147445792 }, { k: 'k2Re', l: 'k₂ con reaseguro', v: 0.121346887 }, { k: 'x0', l: 'x₀', v: 0.403986972 }, { k: 'x1', l: 'x₁', v: 0.334781786 }, { k: 'x2', l: 'x₂', v: 0.261231242 }, { k: 'rhoR', l: 'ρ(R)', v: -34182.63398 }, { k: 'primaInv', l: 'Prima con inversión', v: 1849186.476 }]
      },
      {
        id: 'e18-2', label: 'Enero 2018 · Ej. 2 · SW₂, reaseguro mixto, inversión en 3 activos', values: { cart: [{ n: '1000', E: '100', s: '1000', r: '1800' }, { n: '2500', E: '100', s: '950', r: '1600' }, { n: '4000', E: '150', s: '1800', r: '2800' }, { n: '3000', E: '200', s: '2000', r: '3000' }], m_rho: 'SW', m_a: '2', reOn: true, re: '0,7y − 0,4(y − 1.600.000)+ − 0,3(y − 1.900.000)+', reT: 'c', k1r: '0', k2r: '0,1', invOn: true, r0: '0,5%', act: [{ mu: '4%', sd: '14%' }, { mu: '5%', sd: '16%' }, { mu: '1,8%', sd: '12%' }], corr: '1-2: 0,8' },
        expect: [{ k: 'rho', l: 'SW<sub>2</sub>(−y)', v: 1960647.987 }, { k: 'PR', l: 'Precio del reaseguro', v: 1188932.911 }, { k: 'k2Re', l: 'k₂ con reaseguro', v: 0.194719443 }, { k: 'k1Re', l: 'k₁ con reaseguro', v: 0.24630728 }, { k: 'rhoR', l: 'ρ(R)', v: -12937.57273 }, { k: 'k2Inv', l: 'k₂ con inversión', v: 0.202846414 }, { k: 'k1Inv', l: 'k₁ con inversión', v: 0.256587364 }]
      },
      { id: 'e17-2', label: 'Enero 2017 · Ej. 2 · SW₁, 0,7y − 0,4(y − 9M)+ con k₂ʳ = 90 %, inversión', values: { cart: [{ n: '10000', E: '100', s: '1000', r: '1500' }, { n: '2500', E: '100', s: '900', r: '1000' }, { n: '10000', E: '150', s: '1200', r: '1800' }, { n: '4000', E: '150', s: '1100', r: '1500' }, { n: '30000', E: '200', s: '1400', r: '2000' }], m_rho: 'SW', m_a: '1', reOn: true, re: '0,7y − 0,4(y − 9.000.000)+', reT: 'c', k1r: '0', k2r: '0,9', invOn: true, r0: '0,5%', act: [{ mu: '2%', sd: '5%' }, { mu: '3%', sd: '6%' }], corr: '1-2: 0,8' } },
      { id: 'e16-2', label: 'Enero 2016 · Ej. 2 · SW₁, 0,7y − 0,2(y − 2M)+ con k = 2 %, inversión', values: { cart: [{ n: '1000', E: '100', s: '1000', r: '1500' }, { n: '2000', E: '100', s: '900', r: '1000' }, { n: '3000', E: '150', s: '1200', r: '1800' }, { n: '4000', E: '100', s: '800', r: '1200' }, { n: '3000', E: '150', s: '1200', r: '1600' }, { n: '2000', E: '200', s: '1400', r: '2000' }], m_rho: 'SW', m_a: '1', reOn: true, re: '0,7y − 0,2(y − 2.000.000)+', reT: 'c', k1r: '0,02', k2r: '0,02', invOn: true, r0: '0,5%', act: [{ mu: '2%', sd: '4%' }], corr: '' } },
      { id: 'e15-3', label: 'Enero 2015 · Ej. 3 · SW₁, cuota-parte 80 % retenido, inversión', values: { cart: [{ n: '1000', E: '100', s: '800', r: '1500' }, { n: '2000', E: '100', s: '700', r: '1000' }, { n: '3000', E: '150', s: '1000', r: '1600' }, { n: '4000', E: '100', s: '600', r: '1000' }, { n: '5000', E: '250', s: '1100', r: '1800' }], m_rho: 'SW', m_a: '1', reOn: true, re: '0,2y', reT: 'c', k1r: '0,04', k2r: '0,02', invOn: true, r0: '1%', act: [{ mu: '5%', sd: '10%' }], corr: '' } },
      { id: 'e14-2', label: 'Enero 2014 · Ej. 2 · CVaR 70 %, cuota-parte 80 % retenido', values: { cart: [{ n: '1000', E: '100', s: '1000', r: '1500' }, { n: '2000', E: '100', s: '900', r: '1000' }, { n: '3000', E: '150', s: '1200', r: '1600' }, { n: '2000', E: '100', s: '800', r: '1000' }, { n: '1000', E: '150', s: '1200', r: '1500' }, { n: '1000', E: '200', s: '1400', r: '1800' }], m_rho: 'CVaR', m_lvl: '70', reOn: true, re: '0,2y', reT: 'c', k1r: '0,02', k2r: '0,02' } },
      { id: 'e22-2', label: 'Enero 2022 · Ej. 2a-b · CVaR 99 %, stop-loss (y − 1.550.000)+', values: { cart: [{ n: '1000', E: '100', s: '1000', r: '10000' }, { n: '2500', E: '100', s: '950', r: '9000' }, { n: '4000', E: '150', s: '1800', r: '20000' }, { n: '3000', E: '200', s: '3000', r: '35000' }], m_rho: 'CVaR', m_lvl: '99', reOn: true, re: '(y − 1.550.000)+', reT: 'c', k1r: '0,01', k2r: '0,01' } },
      { id: 'e23-2', label: 'Enero 2023 · Ej. 2a · SW₁', values: { cart: [{ n: '2000', E: '150', s: '1000', r: '10000' }, { n: '5000', E: '150', s: '2000', r: '20000' }, { n: '3000', E: '200', s: '3000', r: '40000' }], m_rho: 'SW', m_a: '1' } },
      { id: 'e24-2', label: 'Enero 2024 · Ej. 2a-b · SDPT₁, reaseguro 0,8y − 0,7(y − 2,45M)+', values: { cart: [{ n: '2000', E: '150', s: '1000', r: '10000' }, { n: '5000', E: '250', s: '2000', r: '20000' }, { n: '3000', E: '300', s: '3000', r: '40000' }], m_rho: 'SDPT', m_a: '1', r01o: '0,906229677', reOn: true, re: '0,8y − 0,7(y − 2.450.000)+', reT: 'c', k1r: '0,01', k2r: '0,01' }, expect: [{ k: 'k1Re', l: 'Recargo de seguridad máx. tras reaseguro', v: 0.068270823 }, { k: 'k2Re', l: 'Recargo por riesgo máx. tras reaseguro', v: 0.063103962 }] },
      { id: 'j24-2', label: 'Junio 2024 · Ej. 2a · SW₁ (b: cambia a ρ = 2∫μCVaR → g(t)=t², a = 2)', values: { cart: [{ n: '2000', E: '150', s: '1000', r: '10000' }, { n: '5000', E: '250', s: '2000', r: '20000' }, { n: '3000', E: '300', s: '3000', r: '40000' }], m_rho: 'SW', m_a: '1' } },
      { id: 'e26-1', label: 'Enero 2026 · Ej. 1 · CVaR 95 %, y_r = 0,9y − 0,5(y − 1,7M)+, PPVE 10 %', values: { cart: [{ n: '4000', E: '100', s: '1000', r: '1500' }, { n: '5000', E: '80', s: '900', r: '1000' }, { n: '2000', E: '150', s: '1200', r: '1500' }, { n: '6000', E: '100', s: '600', r: '1000' }], m_rho: 'CVaR', m_lvl: '95', reOn: true, re: '0,9y − 0,5(y − 1.700.000)+', reT: 'r', k1r: '0,1', k2r: '0' }, expect: [{ k: 'primaRe', l: 'Prima con reaseguro', v: 1836503.238, src: 'fórmula cerrada' }, { k: 'k1Re', l: 'Recargo de seguridad máx.', v: 0.080296022 }, { k: 'k2Re', l: 'Recargo por riesgo máx.', v: 0.070507938 }] },
      { id: 'j26-1', label: 'Junio 2026 · Ej. 1a · expectil 𝔈₀,₃', values: { cart: [{ n: '4000', E: '100', s: '1000', r: '1500' }, { n: '5000', E: '80', s: '900', r: '1000' }, { n: '2000', E: '150', s: '1200', r: '1500' }, { n: '6000', E: '100', s: '600', r: '1000' }], m_rho: 'Expectil', m_mu: '0,3' }, expect: [{ k: 'm', l: 'm', v: 1700000 }, { k: 's', l: 's', v: 114411.5379 }] },
      { id: 'e25-2', label: 'Enero 2025 · Ej. 2a-b · CVaR 90 %, tramos 0,2 / 0,6 desde 425.000, PPVE 10 %', values: { cart: [{ n: '1000', E: '100', s: '1000', r: '1500' }, { n: '500', E: '80', s: '900', r: '1000' }, { n: '2000', E: '150', s: '1200', r: '1500' }, { n: '600', E: '100', s: '600', r: '1000' }], m_rho: 'CVaR', m_lvl: '90', reOn: true, re: 'tramos: 0:0,2; 425.000:0,6', reT: 'c', k1r: '0,1', k2r: '0' }, expect: [{ k: 'rho', l: 'CVaR<sub>90%</sub>(−y)', v: 617770.7964, src: 'con ρ(0,1) = 1,755428339 (2π ≈ 6,28)' }] }
    ]
  });
})();
