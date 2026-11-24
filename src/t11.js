/* ════════════════════════════════════════════════════════════════
   TEMAS 11–13 — Regresión: lineal (MCO), modelos lineales generalizados
   (logit, probit, logarítmica: MCO sobre la transformada y máxima
   verosimilitud), regresión de cuantiles (VaR, CVaR por tramos) y de
   expectiles. Datos agrupados con frecuencias absolutas como pesos.
   ════════════════════════════════════════════════════════════════ */
'use strict';
(function () {
  const T = TNV, f = T.fmt, eq = UI.eq, vv = UI.v;
  const pct = x => T.fmtPct(x);

  UI.tema({
    n: 11, short: 'Regresión', title: 'Regresión: lineal, GLM, cuantiles y expectiles', color: 'var(--t11)',
    desc: 'Explicar la siniestralidad (o una probabilidad) con factores: regresión lineal por mínimos cuadrados, modelos lineales generalizados (logit, probit, logaritmo) por máxima verosimilitud, regresión de cuantiles (VaR) y de expectiles.',
    formulas: [
      ['Lineal (11.1)', 'β̂ = (XᵗWX)<sup>−1</sup>XᵗWy (W = frecuencias); R² = 1 − Σwᵢ(yᵢ − ŷᵢ)²/Σwᵢ(yᵢ − ȳ)²'],
      ['Logit (11.2.2)', 'log(p/(1 − p)) = β₀ + β₁X₁ + …; p = 1/(1 + e<sup>−(β₀ + βX)</sup>)'],
      ['Probit (11.2.3)', 'Φ<sup>−1</sup>(p) = β₀ + β₁X₁ + …; p = Φ(β₀ + βX)'],
      ['Logaritmo (11.2.4)', 'log 𝔼(N) = β₀ + β₁X₁ + …'],
      ['Máxima verosimilitud', 'Binomial: ℓ = Σ[kᵢ log pᵢ + (nᵢ − kᵢ) log(1 − pᵢ)]; Poisson: ℓ = Σ[Nᵢ log λᵢ − nᵢλᵢ]'],
      ['Cuantiles (12)', 'VaR<sub>τ</sub>(−y|X) ≈ β₀(τ) + β(τ)X con min Σwᵢρ<sub>τ</sub>(yᵢ − β₀ − βXᵢ), ρ<sub>τ</sub>(r) = r(τ − 𝟙(r < 0)) (programación lineal)'],
      ['CVaR por tramos', 'CVaR<sub>1−μ</sub> = (1/μ)∫<sub>1−μ</sub><sup>1</sup> VaR<sub>τ</sub> dτ ≈ (1/μ)Σ VaR<sub>τ</sub>·Δτ (las rectas cuantílicas son constantes a trozos en τ)'],
      ['Expectiles (13)', 'min Σwᵢ|τ − 𝟙(rᵢ < 0)|rᵢ², τ = 1 − μ']
    ]
  });

  // ── álgebra lineal pequeña ──
  function solve(A, b) {
    const n = b.length, M = A.map((r, i) => [...r, b[i]]);
    for (let c = 0; c < n; c++) {
      let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
      if (Math.abs(M[p][c]) < 1e-12) return null;
      [M[c], M[p]] = [M[p], M[c]];
      for (let r = 0; r < n; r++) if (r !== c) { const k = M[r][c] / M[c][c]; for (let j = c; j <= n; j++) M[r][j] -= k * M[c][j]; }
    }
    return M.map((r, i) => r[n] / r[i]);
  }
  function wls(X, y, w) {   // mínimos cuadrados ponderados
    const p = X[0].length, A = Array.from({ length: p }, () => new Array(p).fill(0)), b = new Array(p).fill(0);
    X.forEach((x, i) => { for (let a = 0; a < p; a++) { b[a] += w[i] * x[a] * y[i]; for (let c = 0; c < p; c++) A[a][c] += w[i] * x[a] * x[c]; } });
    const be = solve(A, b); if (!be) throw new Error('Los factores son linealmente dependientes (o hay menos filas que parámetros).');
    const yh = X.map(x => x.reduce((s, v, j) => s + v * be[j], 0)), W = w.reduce((a, c) => a + c, 0), yb = y.reduce((s, v, i) => s + w[i] * v, 0) / W;
    const R2 = 1 - y.reduce((s, v, i) => s + w[i] * (v - yh[i]) ** 2, 0) / y.reduce((s, v, i) => s + w[i] * (v - yb) ** 2, 0);
    return { be, yh, R2 };
  }
  // Regresión de cuantiles exacta: el óptimo del programa lineal pasa por p observaciones;
  // se recorren todas las combinaciones de p filas (datos agrupados: pocas filas).
  function combos(n, k) { const out = [], c = []; (function rec(s) { if (c.length === k) { out.push(c.slice()); return; } for (let i = s; i < n; i++) { c.push(i); rec(i + 1); c.pop(); } })(0); return out; }
  function qreg(X, y, w, tau, CB) {
    let best = null;
    for (const c of CB) {
      const be = solve(c.map(i => X[i]), c.map(i => y[i])); if (!be) continue;
      let o = 0; for (let i = 0; i < y.length; i++) { const r = y[i] - X[i].reduce((s, v, j) => s + v * be[j], 0); o += w[i] * (r >= 0 ? tau * r : (tau - 1) * r); }
      if (!best || o < best.o - 1e-9 * (1 + Math.abs(best.o))) best = { o, be };
    }
    if (!best) throw new Error('No hay suficientes filas independientes para la regresión de cuantiles.');
    best.be = best.be.map(v => Math.abs(v) < 1e-12 ? 0 : v);
    return best;
  }
  const same = (a, b) => a.every((v, i) => Math.abs(v - b[i]) <= 1e-9 * (1 + Math.abs(v)));
  // Tramos de τ en [t0, 1) en los que la recta cuantílica es constante (cortes localizados por bisección)
  function qrTramos(X, y, w, t0, CB) {
    const G = 600, ts = Array.from({ length: G }, (_, k) => t0 + (1 - t0) * (k + 0.5) / G), bs = ts.map(t => qreg(X, y, w, t, CB).be);
    const out = [{ from: t0, be: qreg(X, y, w, t0 + 1e-12, CB).be }];
    for (let k = 1; k < G; k++) {
      if (same(bs[k], bs[k - 1])) continue;
      let a = ts[k - 1], b = ts[k];
      for (let it = 0; it < 50; it++) { const m = (a + b) / 2; if (same(qreg(X, y, w, m, CB).be, bs[k - 1])) a = m; else b = m; }
      // corte exacto: para β fijo la pérdida es lineal en τ, o(τ) = τΣwᵢrᵢ − Σ_{rᵢ<0}wᵢrᵢ; se igualan las dos rectas vecinas
      const lin = be => { let S = 0, N = 0; X.forEach((x, i) => { const r = y[i] - x.reduce((s, v, j) => s + v * be[j], 0); S += w[i] * r; if (r < 0) N += w[i] * r; }); return [S, N]; };
      const bl = qreg(X, y, w, a, CB).be, br = qreg(X, y, w, b, CB).be, [S1, N1] = lin(bl), [S2, N2] = lin(br);
      const tx = Math.abs(S1 - S2) > 1e-12 ? (N1 - N2) / (S1 - S2) : b;
      out.push({ from: tx > ts[k - 1] - 1e-9 && tx < ts[k] + 1e-9 ? tx : b, be: br });
    }
    const res = []; out.forEach(o => { if (!res.length || !same(res[res.length - 1].be, o.be)) res.push(o); });
    res.forEach((o, i) => { o.to = i + 1 < res.length ? res[i + 1].from : 1; });
    return res;
  }
  function expreg(X, y, w, tau) {   // regresión de expectiles por mínimos cuadrados asimétricos iterados
    let be = wls(X, y, w).be;
    for (let it = 0; it < 200; it++) {
      const ww = y.map((v, i) => { const r = v - X[i].reduce((s, a, j) => s + a * be[j], 0); return w[i] * (r >= 0 ? tau : 1 - tau); });
      const nb = wls(X, y, ww).be; const d = Math.max(...nb.map((v, j) => Math.abs(v - be[j]))); be = nb; if (d < 1e-13) break;
    }
    return be;
  }
  // Máxima verosimilitud (Newton–Raphson / scoring) para logit, probit (binomial) y logaritmo (Poisson)
  function mle(X, k, n, link, b0) {
    const p = X[0].length; let be = b0.slice();
    const Phi = T.Phi, phi = T.phi;
    const ll = b => X.reduce((s, x, i) => { const e = x.reduce((a, v, j) => a + v * b[j], 0);
      if (link === 'log') return s + k[i] * e - n[i] * Math.exp(e);
      const q = link === 'logit' ? 1 / (1 + Math.exp(-e)) : Phi(e); return s + k[i] * Math.log(q) + (n[i] - k[i]) * Math.log(1 - q); }, 0);
    for (let it = 0; it < 200; it++) {
      const g = new Array(p).fill(0), H = Array.from({ length: p }, () => new Array(p).fill(0));
      X.forEach((x, i) => {
        const e = x.reduce((a, v, j) => a + v * be[j], 0); let s, wt;
        if (link === 'log') { const m = n[i] * Math.exp(e); s = k[i] - m; wt = m; }
        else if (link === 'logit') { const q = 1 / (1 + Math.exp(-e)); s = k[i] - n[i] * q; wt = n[i] * q * (1 - q); }
        else { const q = Math.min(1 - 1e-15, Math.max(1e-15, Phi(e))), d = phi(e); s = d * (k[i] - n[i] * q) / (q * (1 - q)); wt = n[i] * d * d / (q * (1 - q)); }
        for (let a = 0; a < p; a++) { g[a] += s * x[a]; for (let c = 0; c < p; c++) H[a][c] += wt * x[a] * x[c]; }
      });
      const st = solve(H, g); if (!st) break;
      let lam = 1, l0 = ll(be), nb;
      do { nb = be.map((v, j) => v + lam * st[j]); lam /= 2; } while (ll(nb) < l0 - 1e-12 && lam > 1e-8);
      const d = Math.max(...nb.map((v, j) => Math.abs(v - be[j]))); be = nb; if (d < 1e-12) break;
    }
    return { be, ll: ll(be) };
  }
  const fmtEq = (lhs, be, names) => {   // «lhs ≈ β₀ + β₁X₁ − …» sin términos nulos ni coeficientes 1
    const t = []; const sm = 1e-12;
    if (Math.abs(be[0]) > sm) t.push([be[0] < 0, f(Math.abs(be[0]))]);
    be.slice(1).forEach((v, j) => { if (Math.abs(v) <= sm) return; t.push([v < 0, (Math.abs(Math.abs(v) - 1) < 1e-12 ? '' : f(Math.abs(v))) + names[j]]); });
    if (!t.length) t.push([false, '0']);
    const body = t.map(([neg, s], i) => i === 0 ? (neg ? '−' : '') + s : ` ${neg ? '−' : '+'} ${s}`).join('');
    return lhs ? `${lhs} ≈ ${body}` : body;
  };
  const dot = (be, x) => be[0] + x.reduce((s, v, j) => s + v * be[j + 1], 0);

  const N1D = [[1000,18,0,120],[2000.0,18,1,280],[500.0,18,3,269],[1000.0,18,5,350],[900,18,7,481.0],[900,18,9,582],[1000,18,11,600],[2000,20,0,125],[2000,20,1,175],[2000,20,3,273],[2000,20,5,376],[1000,20,7,469],[900,20,9,581],[900,20,10,625],[1000,20,11,656],[2000,20,12,732],[2000,20,15,869],[2000,21,0,125],[2000,21,1,176],[1000,21,2,226],[900,21,3,268],[900,21,5,375],[1000,21,7,470],[2000,21,9,578],[2000,21,10,628],[2000,21,11,678],[2000,21,12,728],[1000,21,15,878],[2000,25,0,120],[2000,25,1,170],[2000,25,2,220],[2000,25,3,270],[1000,25,4,320],[900,25,5,370],[900,25,6,420],[1000,25,7,470],[2000,25,9,570],[2000,25,10,602],[2000,25,11,653],[2000,25,12,712],[1000,25,15,874],[900,25,16,813],[900,30,0,103],[2000,30,1,157],[2000,30,2,210],[1000,30,3,260],[900,30,4,310],[900,30,5,360],[1000,30,6,410],[2000,35,0,100],[2000,35,1,150],[2000,35,2,200],[2000,35,3,250],[1000,35,4,300],[2000,35,5,350],[2000,35,6,400],[700,35,7,450.0],[1000,35,10,600],[1500,35,15,850],[1200,48,0,76],[10000,48,1,129],[2000,48,2,175],[3000,48,3,229],[2000,48,4,276],[2000,48,5,329],[2000,48,6,378],[1000,48,7,424],[2000,48,9,524],[2000,48,10,574],[700,48,11,624],[1500,48,12,674],[1600,48,15,824],[1200,48,16,874.0],[10000,58,0,54],[2000,58,1,104],[3000,58,2,154],[3000,58,3,204.0],[2000,58,4,254],[2000,58,5,304],[2000,58,6,354],[1000,58,7,404],[2000,58,9,504],[2000,58,10,554],[700,58,11,604],[1500,58,12,654],[1800,58,15,804],[1200,58,16,854],[2000,65,0,45],[1000,65,1,102],[900,65,2,145],[900,65,3,203],[1000,65,4,250],[2000,65,5,290],[2000,65,6,340],[2000,65,7,390],[2000,65,9,490],[1000,65,10,540],[900,65,11,590],[900,65,12,640],[2000,65,15,790],[2000,65,16,840],[1000,70,0,30],[900,70,1,80],[900,70,2,130],[1000,70,3,180],[2000,70,4,230],[2000,70,5,280],[2000,70,6,330],[2000,70,7,380],[1000,70,9,498],[2000,70,10,549],[2000,70,11,592],[700,70,12,639],[800,70,15,791],[1500,70,16,835]];
  const N2D = [[1000,18,0,700],[2000.0,18,1,1800],[500.0,18,3,700],[1000.0,18,5,1800],[900,18,7,1800],[900,18,9,2250],[1000,18,11,2900],[2000,20,0,1200],[2000,20,1,1660],[2000,20,3,2500],[2000,20,5,3280],[1000,20,7,2000],[900,20,9,2169],[900,20,10,2325],[1000,20,11,2800],[2000,20,12,6000],[2000,20,15,7300],[2000,21,0,1200],[2000,21,1,1620],[1000,21,2,900],[900,21,3,1089],[900,21,5,1440],[1000,21,7,1950],[2000,21,9,4800],[2000,21,10,5210],[2000,21,11,5560],[2000,21,12,5960],[1000,21,15,3680],[2000,25,0,1000],[2000,25,1,1400],[2000,25,2,1800],[2000,25,3,2200],[1000,25,4,1300],[900,25,5,1350],[900,25,6,1530.0],[1000,25,7,1900.0],[2000,25,9,4600],[2000,25,10,5000],[2000,25,11,5400],[2000,25,12,5800.0],[1000,25,15,3500],[900,25,16,3330],[900,30,0,360],[2000,30,1,1200.0],[2000,30,2,1600],[1000,30,3,950],[900,30,4,1080.0],[900,30,5,1260],[1000,30,6,1600],[2000,35,0,640],[2000,35,1,1060],[2000,35,2,1380],[2000,35,3,1880],[1000,35,4,1100],[2000,35,5,2580],[2000,35,6,2968],[700,35,7,1204],[1000,35,10,1175],[1500,35,15,2010],[1200,48,0,48.0],[10000,48,1,2400],[2000,48,2,880.0],[3000,48,3,1920.0],[2000,48,4,1680.0],[2000,48,5,2080],[2000,48,6,2480.0],[1000,48,7,1440.0],[2000,48,9,3680],[2000,48,10,4080],[700,48,11,1568.0],[1500,48,12,1220.0],[1600,48,15,1824],[1200,48,16,3888.0],[10000,58,0,1000],[2000,58,1,200],[3000,58,2,630],[3000,58,3,1320.0],[2000,58,4,1280.0],[2000,58,5,1680.0],[2000,58,6,2080.0],[1000,58,7,1240.0],[2000,58,9,3280.0],[2000,58,10,3680],[700,58,11,1428],[1500,58,12,1120],[1800,58,15,1704],[1200,58,16,3648],[2000,65,0,400],[1000,65,1,200],[900,65,2,180],[900,65,3,405.0],[1000,65,4,650],[2000,65,5,1700],[2000,65,6,2100],[2000,65,7,2500],[2000,65,9,3300],[1000,65,10,1850.0],[900,65,11,1845.0],[900,65,12,2025.0],[2000,65,15,5700],[2000,65,16,6100.0],[1000,70,0,210],[900,70,1,189],[900,70,2,207],[1000,70,3,250],[2000,70,4,1160.0],[2000,70,5,1560.0],[2000,70,6,1960],[2000,70,7,2360],[1000,70,9,1580.0],[2000,70,10,3560.0],[2000,70,11,3960],[700,70,12,1526],[800,70,15,1390],[1500,70,16,4470]];
  const RESP = [['y', 'y: la variable a explicar (coste, indemnización…)'], ['logy', 'log(y): se explica el logaritmo de y'], ['bin', 'Casos favorables: nº de veces que ocurre A en la fila (probabilidad p = k/n)'], ['cnt', 'Recuento: nº total de siniestros de la fila (media por póliza)']];
  const isB = v => v.resp === 'bin' || v.resp === 'cnt';
  const S = v => String(v).replace('.', ',');   // los ejemplos se guardan con coma decimal (el punto es separador de miles)
  const tab = (a, ks) => a.map(r => { const o = { x1: '', x2: '', x3: '' }; ks.forEach((k, j) => { o[k] = S(r[j]); }); return o; });

  UI.tool({
    id: 't11-reg', tema: 11, title: 'Regresión: lineal, logit/probit, cuantiles y expectiles', tag: 'Caso 4',
    short: 'Datos agrupados con frecuencias: MCO, máxima verosimilitud (logit, probit, logaritmo), VaR por regresión cuantílica, CVaR por tramos, expectiles, predicción para un cliente, prima y criterio del caso peor.',
    cuando: '«Se dispone de los datos (frecuencia, X₁, X₂, y)… Estime 𝔼(y) ≈ β₀ + β₁X₁ + … y VaR<sub>95%</sub>(−y) ≈ β̃₀ + β̃₁X₁ + …», «estime P(A) por regresión logística», «calcule la prima si X₁ = …».',
    que: 'Ajusta a los datos agrupados (cada fila se repite tantas veces como su frecuencia) los modelos que pida el enunciado. La regresión lineal estima la esperanza; la logística, probit y logarítmica estiman una probabilidad o una frecuencia media mediante una función de enlace; la regresión de cuantiles estima el VaR (y, integrando sus tramos, el CVaR); la de expectiles, el expectil. Después evalúa los modelos para el cliente que se pida.',
    groups: [
      {
        title: 'Datos (una fila por grupo)', fields: [
          { id: 'dat', type: 'rows', label: 'Frecuencia (nº de casos de la fila), factores X₁, X₂, X₃ (deja vacíos los que no haya) y la respuesta', cols: [{ id: 'w', label: 'Frecuencia' }, { id: 'x1', label: 'X₁' }, { id: 'x2', label: 'X₂', opt: true }, { id: 'x3', label: 'X₃', opt: true }, { id: 'y', label: 'y (o k)' }],
            def: [{ w: '700', x1: '200', x2: '', x3: '', y: '390' }, { w: '500', x1: '250', x2: '', x3: '', y: '485' }, { w: '5', x1: '250', x2: '', x3: '', y: '20.000' }], wide: true },
          { id: 'resp', type: 'sel', label: 'La última columna es', def: 'y', opts: RESP, wide: true },
          { id: 'nom', type: 'text', label: 'Nombres de los factores (opcional)', def: '', ph: 'p. ej. H  ·  o  X₁; X₂', help: 'Sólo para la redacción' }
        ]
      },
      {
        title: 'Modelos que pide el enunciado', fields: [
          { id: 'mSd', type: 'check', label: 'σ(y) por regresión de y²: σ(y) = √(𝔼(y²) − 𝔼(y)²)', def: false, wide: true, show: v => v.resp === 'y' },
          { id: 'mLin', type: 'check', label: 'Regresión lineal (mínimos cuadrados) — con casos favorables: sobre logit(p) / Φ⁻¹(p)', def: true, wide: true },
          { id: 'mML', type: 'check', label: 'Máxima verosimilitud (logit, probit o logaritmo)', def: false, wide: true, show: isB },
          { id: 'link', type: 'sel', label: 'Función de enlace', def: 'logit', opts: [['logit', 'logit: log(p/(1 − p))'], ['probit', 'probit: Φ⁻¹(p)'], ['ambos', 'logit y probit']], show: v => v.resp === 'bin' },
          { id: 'mQR', type: 'check', label: 'Regresión de cuantiles (VaR)', def: true, wide: true },
          { id: 'qrl', type: 'text', label: 'Niveles del VaR (%)', def: '95', ph: 'p. ej. 95; 90', show: v => v.mQR },
          { id: 'mTr', type: 'check', label: 'CVaR por tramos de la regresión cuantílica', def: false, wide: true },
          { id: 'trl', type: 'num', label: 'Nivel del CVaR (%)', def: '95', show: v => v.mTr },
          { id: 'trm', type: 'text', label: 'Niveles de los tramos que usa el enunciado (opcional)', def: '', ph: 'p. ej. 95; 99,8', help: 'Si el enunciado aproxima los tramos con unos niveles concretos; si no, se usan los tramos exactos', show: v => v.mTr },
          { id: 'mEx', type: 'check', label: 'Regresión de expectiles', def: false, wide: true },
          { id: 'exm', type: 'num', label: 'μ del expectil', def: '0,2', show: v => v.mEx }
        ]
      },
      {
        title: 'Clientes / pólizas a evaluar (opcional)', optional: true, openIf: v => (v.cli || []).length, fields: [
          { id: 'cli', type: 'rows', label: 'Una fila por cliente o grupo de pólizas: nº de pólizas (sólo si se forma una cartera) y valores de los factores', cols: [{ id: 'n', label: 'Pólizas', opt: true }, { id: 'x1', label: 'X₁', opt: true }, { id: 'x2', label: 'X₂', opt: true }, { id: 'x3', label: 'X₃', opt: true }], def: [], wide: true },
          { id: 'fd', type: 'check', label: 'Función de distribución en ese punto a partir de las rectas cuantílicas (todos los niveles)', def: false, wide: true },
          { id: 'fneg', type: 'check', label: '… de −y (o −P(A)) en lugar de y', def: false, show: v => v.fd },
          { id: 'worst', type: 'check', label: 'Criterio del caso peor entre los modelos (P(A) o 𝔼)', def: false, wide: true },
          { id: 'wdir', type: 'sel', label: 'Lo más desfavorable es', def: 'min', opts: [['min', 'el valor más bajo (p. ej. menos clientes aceptan)'], ['max', 'el valor más alto (p. ej. más siniestralidad)']], show: v => v.worst }
        ]
      },
      {
        title: 'Prima para ese cliente (opcional)', optional: true, openIf: v => v.prOn, fields: [
          { id: 'prOn', type: 'check', label: 'Calcular Π(y) = a·𝔼(y) + b·ρ(−y)', def: false, wide: true },
          { id: 'A', type: 'num', label: 'a', def: '1,04', show: v => v.prOn }, { id: 'B', type: 'num', label: 'b', def: '0,02', show: v => v.prOn },
          { id: 'prm', type: 'sel', label: 'ρ es', def: 'cvar', opts: [['var', 'el VaR del primer nivel de la regresión cuantílica'], ['cvar', 'el CVaR por tramos']], show: v => v.prOn }
        ]
      }
    ],
    solve(V, { result }) {
      const R = result();
      const rows = V.rows('dat'); if (rows.length < 2) throw new Error('Introduce al menos dos filas de datos.');
      const use = ['x1', 'x2', 'x3'].filter(c => rows.some(r => r[c] !== null && r[c] !== undefined && !isNaN(r[c])));
      if (!use.length) throw new Error('Falta al menos un factor (columna X₁).');
      use.forEach(c => rows.forEach((r, i) => { if (r[c] === null || isNaN(r[c])) throw new Error(`Fila ${i + 1}: falta ${c.toUpperCase()}.`); }));
      const nomIn = String(V.s('nom') || '').split(/[;|]+/).map(s => s.trim()).filter(Boolean);
      const names = use.map((c, j) => nomIn[j] || ['X₁', 'X₂', 'X₃'][['x1', 'x2', 'x3'].indexOf(c)]);
      const X = rows.map(r => [1, ...use.map(c => r[c])]), w = rows.map(r => r.w), resp = V.s('resp');
      if (w.some(v => !(v > 0))) throw new Error('Las frecuencias deben ser positivas.');
      const p = X[0].length;
      let CB0 = null; const nC = (() => { let c = 1; for (let i = 0; i < p; i++) c = c * (rows.length - i) / (i + 1); return c; })();
      const CBget = () => { if (nC > 30000) throw new Error(`La regresión de cuantiles exacta recorre las C(${rows.length}, ${p}) = ${Math.round(nC)} combinaciones de filas: demasiadas. Agrupa los datos o reduce las filas (en los exámenes hay pocas).`); return CB0 || (CB0 = combos(rows.length, p)); };
      let y, ylab, back = v => v, ytxt;
      if (resp === 'y') { y = rows.map(r => r.y); ylab = 'y'; ytxt = 'y'; }
      else if (resp === 'logy') { if (rows.some(r => !(r.y > 0))) throw new Error('Para usar log(y), y debe ser positiva.'); y = rows.map(r => Math.log(r.y)); ylab = 'log(y)'; back = Math.exp; ytxt = 'log(y)'; }
      else if (resp === 'bin') { rows.forEach((r, i) => { if (!(r.y >= 0 && r.y <= r.w)) throw new Error(`Fila ${i + 1}: los casos favorables deben estar entre 0 y la frecuencia.`); }); y = rows.map(r => r.y / r.w); ylab = 'P(A)'; ytxt = 'p = k/n'; }
      else { y = rows.map(r => r.y / r.w); ylab = '𝔼(N)'; ytxt = 'media = total/n'; }
      const CL = V.rows('cli').filter(r => use.some(c => r[c] !== null)).map((r, i) => {
        use.forEach(c => { if (r[c] === null) throw new Error(`Cliente ${i + 1}: falta ${c.toUpperCase()} (hay que dar ${names.join(', ')}).`); });
        const x = use.map(c => r[c]); return { n: r.n, x, txt: `(${names.map((nm, j) => `${nm} = ${f(x[j])}`).join('; ')})` };
      });
      const has0 = CL.length > 0, x0s = has0 ? CL[0].x : [], at0 = be => dot(be, x0s), x0txt = has0 ? CL[0].txt : '', multi = CL.length > 1;
      const EV = [];   // evaluadores por cliente: {h, f(x), k}
      const est = [];   // estimaciones para el cliente (caso peor)
      R.step('Datos', `${rows.length} filas con frecuencias (total ${f(w.reduce((a, b) => a + b, 0))}); factores ${names.join(', ')}; se explica ${ytxt}. Cada fila cuenta tantas veces como su frecuencia (pesos).`);
      R.ans('Planteamiento.', `Se dispone de ${rows.length} grupos de datos con frecuencias absolutas ${w.map(v => f(v)).join(', ')}, que actúan como pesos (cada fila se repite tantas veces como indica su frecuencia). Se explica ${ytxt}${resp === 'bin' ? ' (proporción de casos en los que ocurre A)' : resp === 'cnt' ? ' (número medio de siniestros por póliza)' : ''} mediante ${names.length === 1 ? 'el factor ' + names[0] : 'los factores ' + names.join(', ')}.`);

      // ── Lineal (MCO) ──
      if (V.b('mLin')) {
        const links = resp === 'bin' ? (V.s('link') === 'ambos' ? ['logit', 'probit'] : [V.s('link')]) : [null];
        for (const lk of links) {
          let z = y, zl = ylab, inv = back;
          if (resp === 'bin') {
            if (y.some(v => !(v > 0 && v < 1))) throw new Error('Para MCO sobre logit/probit todas las proporciones deben estar entre 0 y 1 (sin 0 ni 1).');
            z = y.map(v => lk === 'logit' ? Math.log(v / (1 - v)) : T.PhiInv(v)); zl = lk === 'logit' ? 'logit(P(A))' : 'Φ<sup>−1</sup>(P(A))'; inv = lk === 'logit' ? (e => 1 / (1 + Math.exp(-e))) : T.Phi;
          } else if (resp === 'cnt') { z = y.map(v => Math.log(v)); zl = 'log 𝔼(N)'; inv = Math.exp; }
          const L = wls(X, z, w), tag = lk ? `_${lk}` : '';
          EV.push({ h: resp === 'y' ? '𝔼(y)' : resp === 'logy' ? '𝔼(y) ≈ e<sup>𝔼(log y)</sup>' : `${ylab}${lk ? ' ' + lk : ''} (MCO)`, f: x => inv(dot(L.be, x)), k: 'E' + tag });
          R.tile(`MCO: R²${lk ? ' (' + lk + ')' : ''}`, L.R2); R.key('R2' + tag, L.R2); L.be.forEach((v, j) => R.key(`b${j}${tag}`, v));
          R.table(`Regresión lineal por mínimos cuadrados${lk ? ' sobre ' + zl : ''}`, ['Coeficiente', 'Valor'], [['β₀ (término independiente, «Jensen Alfa»)', L.be[0]], ...names.map((n, j) => [`β de ${n}`, L.be[j + 1]]), ['R² («Accuracy»)', L.R2]], { top: true });
          R.uses('ols');
          let txt = `Por mínimos cuadrados ponderados por las frecuencias${lk ? `, aplicados a ${zl}` : resp === 'cnt' ? ', aplicados a log(media)' : ''}, β̂ = (XᵗWX)<sup>−1</sup>XᵗWy da` + eq(fmtEq(resp === 'y' ? '𝔼(y)' : resp === 'logy' ? '𝔼(log(y))' : zl, L.be, names)) + `con R² = ${vv(L.R2)}${L.R2 > 0.9 ? ' (muy cercano a 1: el ajuste es muy bueno)' : ''}.`;
          if (has0) {
            const e0 = at0(L.be), v0 = inv(e0);
            R.tile(`${resp === 'y' || resp === 'logy' ? '𝔼(y)' : ylab + (lk ? ' ' + lk : '') + ' (MCO)'} en ${x0txt}`, v0, { main: true }); R.key('pred' + tag, v0);
            est.push({ m: `MCO${lk ? ' (' + lk + ')' : ''}`, v: v0 });
            txt += ` Para ${x0txt}: ${resp === 'y' ? `𝔼(y) ≈ ${f(L.be[0])} + … = ${vv(v0)}` : resp === 'logy' ? `𝔼(log(y)) ≈ ${f(e0)}, luego 𝔼(y) ≈ e<sup>${f(e0)}</sup> = ${vv(v0)} (aproximación habitual: se toma la exponencial de la media del logaritmo)` : `${zl} ≈ ${f(e0)}, luego ${ylab} ≈ ${lk === 'logit' ? `1/(1 + e<sup>${f(-e0)}</sup>)` : lk === 'probit' ? `Φ(${f(e0)})` : `e<sup>${f(e0)}</sup>`} = ${vv(v0)}${resp === 'bin' ? ' ≈ ' + pct(v0) : ''}`}.`;
          }
          R.ans(`Regresión lineal${lk ? ' (' + lk + ')' : ''}.`, txt);
        }
      }
      // ── Desviación típica por regresión de y² ──
      let SD = null;
      if (V.b('mSd') && resp === 'y') {
        const L1 = wls(X, y, w), L2 = wls(X, y.map(v => v * v), w);
        SD = x => { const m2 = dot(L2.be, x), m = dot(L1.be, x), d = m2 - m * m; return d > 0 ? Math.sqrt(d) : NaN; };
        L2.be.forEach((v, j) => R.key(`s${j}`, v)); R.key('R2sq', L2.R2);
        EV.splice(EV.findIndex(e => e.k === 'E') + 1, 0, { h: 'σ(y)', f: SD, k: 'sd' });
        R.table('Regresión de y² (para la desviación)', ['Coeficiente', 'Valor'], [['β₀', L2.be[0]], ...names.map((n, j) => [`β de ${n}`, L2.be[j + 1]]), ['R²', L2.R2]], { top: true });
        R.uses('sdreg');
        let txt = `Se repite la regresión lineal con y² como variable explicada (cuadro de y² con las mismas frecuencias):` + eq(fmtEq('𝔼(y²)', L2.be, names)) + `con R² = ${vv(L2.R2)}. Como σ²(y) = 𝔼(y²) − 𝔼(y)², se aproxima σ(y) ≈ √(𝔼(y²) − 𝔼(y)²), con 𝔼(y) dada por la regresión lineal de y. (Si en algún punto 𝔼(y²) − 𝔼(y)² < 0, puede usarse log(y²) como vínculo.)`;
        if (has0) { const s0 = SD(x0s); R.tile(`σ(y) en ${x0txt}`, s0, { main: !multi }); R.key('sd0', s0); txt += ` Para ${x0txt}: 𝔼(y²) ≈ ${f(dot(L2.be, x0s))} y σ(y) ≈ √(${f(dot(L2.be, x0s))} − ${f(dot(L1.be, x0s))}²) = ${vv(s0)}.`; }
        R.ans('Desviación típica.', txt);
      }
      // ── Máxima verosimilitud ──
      if (V.b('mML') && isB(V.raw)) {
        const k = rows.map(r => r.y), n = w;
        const links = resp === 'cnt' ? ['log'] : (V.s('link') === 'ambos' ? ['logit', 'probit'] : [V.s('link')]);
        for (const lk of links) {
          const z0 = y.map(v => { const q = Math.min(1 - 1e-6, Math.max(1e-6, v)); return lk === 'log' ? Math.log(Math.max(v, 1e-6)) : lk === 'logit' ? Math.log(q / (1 - q)) : T.PhiInv(q); });
          const M = mle(X, k, n, lk, wls(X, z0, w).be), inv = lk === 'log' ? Math.exp : lk === 'logit' ? (e => 1 / (1 + Math.exp(-e))) : T.Phi;
          EV.push({ h: `${ylab} (MV ${lk})`, f: x => inv(dot(M.be, x)), k: 'ML_' + lk });
          R.table(`Máxima verosimilitud (${lk})`, ['Coeficiente', 'Valor'], [['β₀', M.be[0]], ...names.map((nm, j) => [`β de ${nm}`, M.be[j + 1]]), ['Log-verosimilitud', M.ll]], { top: true });
          M.be.forEach((v, j) => R.key(`ml${j}_${lk}`, v)); R.key('ll_' + lk, M.ll);
          R.uses(lk === 'log' ? 'mlpois' : 'mlbin');
          const lhs = lk === 'log' ? 'log 𝔼(N)' : lk === 'logit' ? 'log(P(A)/(1 − P(A)))' : 'Φ<sup>−1</sup>(P(A))';
          let txt = `Maximizando la log-verosimilitud ${lk === 'log' ? 'de Poisson ℓ = Σ[Nᵢ log λᵢ − nᵢλᵢ]' : 'binomial ℓ = Σ[kᵢ log pᵢ + (nᵢ − kᵢ) log(1 − pᵢ)]'} (numéricamente, por Newton–Raphson) se obtiene` + eq(fmtEq(lhs, M.be, names)) + `con ℓ = ${f(M.ll)}.${lk !== 'log' ? ` Equivalentemente, P(A) ≈ ${lk === 'logit' ? `1/(1 + e<sup>−(${f(M.be[0])} + …)</sup>)` : `Φ(${f(M.be[0])} + …)`}.` : ''}`;
          if (has0) { const e0 = at0(M.be), v0 = inv(e0); R.tile(`MV ${lk} en ${x0txt}`, v0, { main: true }); R.key('predML_' + lk, v0); est.push({ m: `MV (${lk})`, v: v0 }); txt += ` Para ${x0txt}: ${lhs} ≈ ${f(e0)} y ${ylab} ≈ ${vv(v0)}${lk !== 'log' ? ' ≈ ' + pct(v0) : ''}.`; }
          R.ans(`Máxima verosimilitud (${lk}).`, txt);
        }
        R.note('Las macros del profesor maximizan la verosimilitud por búsqueda aleatoria (125.000 simulaciones con paso 0,02), así que sus β son aproximados: aquí se obtiene el máximo exacto (log-verosimilitud igual o mayor).');
      }
      // ── Cuantiles ──
      let QR1 = null;
      if (V.b('mQR')) {
        const lv = V.list('qrl'); if (!lv.length) throw new Error('Indica al menos un nivel para la regresión de cuantiles.');
        lv.forEach((L, i) => {
          const tau = L >= 1 ? L / 100 : L, q = qreg(X, y, w, tau, CBget()), nm = `VaR<sub>${T.fmtPctLevel(tau)}</sub>(−${ylab})`;
          if (i === 0) QR1 = { tau, be: q.be };
          EV.push({ h: `VaR<sub>${T.fmtPctLevel(tau)}</sub>(−${resp === 'logy' ? 'y' : ylab})`, f: x => back(dot(q.be, x)), k: 'VaR' + Math.round(tau * 1000) });
          q.be.forEach((v, j) => R.key(`q${j}_${Math.round(tau * 1000)}`, v));
          R.uses('qreg');
          let txt = `La regresión de cuantiles al nivel ${T.fmtPctLevel(tau)} minimiza Σwᵢρ<sub>τ</sub>(yᵢ − β₀ − βXᵢ) con τ = ${f(tau)} (un problema de programación lineal; la solución pasa por ${p} de las observaciones) y da` + eq(fmtEq(nm, q.be, names));
          if (has0) { const v0 = back(at0(q.be)); R.tile(`${nm.replace('log(y)', 'y')} en ${x0txt}`, v0, { main: true }); R.key(`var_${Math.round(tau * 1000)}`, v0); txt += `Para ${x0txt}: ${resp === 'logy' ? `VaR(−log(y)) ≈ ${f(at0(q.be))} y, como el VaR conserva las transformaciones crecientes, VaR<sub>${T.fmtPctLevel(tau)}</sub>(−y) ≈ e<sup>${f(at0(q.be))}</sup> = ${vv(v0)}` : `${nm} ≈ ${vv(v0)}`}.`; }
          R.ans(`Regresión de cuantiles al ${T.fmtPctLevel(tau)}.`, txt);
        });
      }
      // ── CVaR por tramos ──
      let CV = null;
      if (V.b('mTr')) {
        const L = V.n('trl'), t0 = L >= 1 ? L / 100 : L, mu = 1 - t0;
        const man = V.list('trm', { opt: true }).map(v => (v >= 1 ? v / 100 : v)).sort((a, b) => a - b);
        let tr;
        if (man.length) tr = man.map((t, i) => ({ from: t, to: i + 1 < man.length ? man[i + 1] : 1, be: qreg(X, y, w, t, CBget()).be }));
        else tr = qrTramos(X, y, w, t0, CBget());
        const cb = tr[0].be.map((_, j) => tr.reduce((s, o) => s + o.be[j] * (o.to - o.from), 0) / mu);
        CV = { t0, cb }; cb.forEach((v, j) => R.key(`c${j}`, v));
        EV.push({ h: `CVaR<sub>${T.fmtPctLevel(t0)}</sub>(−${resp === 'logy' ? 'y' : ylab})`, f: x => back(dot(cb, x)), k: 'CVaR' });
        R.table(`Tramos de la regresión cuantílica (${man.length ? 'niveles del enunciado' : 'exactos'})`, ['Desde 1 − μ', 'Hasta', 'Peso Δτ', `VaR(−${ylab})`], tr.map(o => [f(o.from, 6), f(o.to, 6), o.to - o.from, fmtEq('', o.be, names)]), { top: true });
        R.uses('cvtr');
        let txt = `Las rectas cuantílicas son constantes a trozos en el nivel τ = 1 − μ. ${man.length ? 'Con los niveles del enunciado' : 'Calculándolas para todos los niveles desde ' + T.fmtPctLevel(t0)}:<br>${tr.map(o => `${f(o.from, 6)} ≤ τ < ${f(o.to, 6)}: VaR<sub>τ</sub>(−${ylab}) ≈ ${fmtEq('', o.be, names)}`).join('<br>')}<br>Luego CVaR<sub>${T.fmtPctLevel(t0)}</sub> = (1/μ)∫VaR<sub>τ</sub>dτ ≈ (1/${f(mu)})·Σ VaR<sub>τ</sub>·Δτ:` + eq(fmtEq(`CVaR<sub>${T.fmtPctLevel(t0)}</sub>(−${ylab})`, cb, names) + `<br>(cada coeficiente es Σ βₖΔτₖ/μ, p. ej. β̃₀ = (${tr.map(o => `${o.be[0] < 0 ? '(' + f(o.be[0]) + ')' : f(o.be[0])} × ${f(o.to - o.from, 6)}`).join(' + ')})/${f(mu)} = ${f(cb[0])})`);
        if (has0) { const v0 = back(at0(cb)); R.tile(`CVaR<sub>${T.fmtPctLevel(t0)}</sub> en ${x0txt}`, v0, { main: true }); R.key('cvar0', v0); txt += `Para ${x0txt}: CVaR<sub>${T.fmtPctLevel(t0)}</sub>(−${resp === 'logy' ? 'y' : ylab}) ≈ ${vv(v0)}.`; }
        R.ans(`CVaR al ${T.fmtPctLevel(t0)} por tramos.`, txt);
      }
      // ── Expectiles ──
      if (V.b('mEx')) {
        const mu = V.n('exm', { pos: 1 }), tau = mu <= 0.5 ? 1 - mu : mu, be = expreg(X, y, w, tau);
        be.forEach((v, j) => R.key(`e${j}`, v)); R.uses('expreg');
        EV.push({ h: `Expectil (μ = ${f(mu)})`, f: x => back(dot(be, x)), k: 'Ex' });
        let txt = `La regresión de expectiles minimiza Σwᵢ|τ − 𝟙(rᵢ < 0)|rᵢ² con τ = 1 − μ = ${f(tau)} (mínimos cuadrados asimétricos, resueltos de forma iterativa) y da` + eq(fmtEq(`𝔈<sub>${f(mu)}</sub>(−${ylab})`, be, names));
        if (has0) { const v0 = back(at0(be)); R.tile(`Expectil en ${x0txt}`, v0); R.key('ex0', v0); txt += `Para ${x0txt}: ${vv(v0)}.`; }
        R.ans(`Regresión de expectiles (μ = ${f(mu)}).`, txt);
      }
      // ── Función de distribución en el punto (a partir de todas las rectas cuantílicas) ──
      if (has0 && V.b('fd')) {
        const tr = qrTramos(X, y, w, 1e-9, CBget()), neg = V.b('fneg'); tr[0].from = 0;
        const pts = tr.map(o => ({ from: o.from, to: o.to, q: at0(o.be) }));
        const Ey = pts.reduce((s, o) => s + o.q * (o.to - o.from), 0);
        const vlab = neg ? `−${ylab}` : ylab;
        // VaR_τ(−y) = cuantil τ de y; para −y el cuantil 1−τ vale −q
        const segs = (neg ? pts.map(o => ({ a: 1 - o.to, b: 1 - o.from, x: -o.q })) : pts.map(o => ({ a: o.from, b: o.to, x: o.q }))).sort((A, B) => A.x - B.x);
        let acc = 0; const Frows = []; segs.forEach(s => { acc += s.b - s.a; Frows.push([f(s.x), acc > 1 - 1e-9 ? 1 : acc]); });
        R.table(`Función de distribución de ${vlab} en ${x0txt}`, ['x', `F(x) desde x`], Frows, { top: true });
        R.key('Ey0', Ey);
        R.ans(`Función de distribución de ${vlab}.`, `Evaluando en ${x0txt} todas las rectas cuantílicas: ${pts.map(o => `VaR<sub>τ</sub> = ${f(o.q)} si ${f(o.from, 4)} ≤ τ < ${f(o.to, 4)}`).join('; ')}. Representando VaR<sub>τ</sub> en función de τ y «girando la gráfica» (toda función de distribución es continua por la derecha), F(x) = ${segs.map((s, i) => `${f(Frows[i][1])} si ${f(s.x)} ≤ x${i + 1 < segs.length ? ' < ' + f(segs[i + 1].x) : ''}`).join('; ')} (y 0 antes de ${f(segs[0].x)}). Además 𝔼(${ylab}) ≈ Σ VaR<sub>τ</sub>Δτ = ${vv(Ey)}${resp === 'bin' ? ' ≈ ' + pct(Ey) : ''}.`);
        est.push({ m: 'Regresión cuantílica (𝔼 por tramos)', v: Ey });
      }
      // ── Caso peor ──
      if (has0 && V.b('worst') && est.length > 1) {
        const dir = V.s('wdir'), wv = est.reduce((b, e) => (dir === 'min' ? e.v < b.v : e.v > b.v) ? e : b);
        R.tile('Criterio del caso peor', wv.v, { main: true, hint: wv.m }); R.key('worst', wv.v);
        R.ans('Criterio más desfavorable.', `Las estimaciones son ${est.map(e => `${e.m}: ${f(e.v)}${resp === 'bin' ? ' (' + pct(e.v) + ')' : ''}`).join('; ')}. Con el criterio del caso peor (<i>worst case approach</i>) se elige ${dir === 'min' ? 'la menor' : 'la mayor'}, ${vv(wv.v)}${resp === 'bin' ? ' ≈ ' + pct(wv.v) : ''} (${wv.m}), por ser la más desfavorable para la compañía.`);
      }
      // ── Prima ──
      if (has0 && V.b('prOn')) {
        const A = V.n('A'), B = V.n('B'), L = wls(X, y, w), E0 = back(at0(L.be));
        let rho, rn;
        if (V.s('prm') === 'cvar') { if (!CV) throw new Error('Marca «CVaR por tramos» para usarlo en la prima.'); rho = back(at0(CV.cb)); rn = `CVaR<sub>${T.fmtPctLevel(CV.t0)}</sub>(−y)`; }
        else { if (!QR1) throw new Error('Marca «Regresión de cuantiles» para usar el VaR en la prima.'); rho = back(at0(QR1.be)); rn = `VaR<sub>${T.fmtPctLevel(QR1.tau)}</sub>(−y)`; }
        const Pi = A * E0 + B * rho; R.tile('Prima Π(y)', Pi, { main: true }); R.key('prima', Pi);
        const rf = V.s('prm') === 'cvar' ? (x => back(dot(CV.cb, x))) : (x => back(dot(QR1.be, x)));
        EV.push({ h: 'Prima Π(y)', f: x => A * back(dot(L.be, x)) + B * rf(x), k: 'Pi' });
        R.uses('prima66');
        R.ans('Prima.', `Para ${x0txt}, 𝔼(y) ≈ ${f(E0)} y ${rn} ≈ ${f(rho)}, luego Π(y) = ${f(A)} × ${f(E0)} + ${f(B)} × ${f(rho)} = ${vv(Pi)}.`);
      }
      // ── Cuadro con todos los clientes y paso a la cartera (Caso 1) ──
      if (multi && EV.length) {
        const vals = CL.map(c => EV.map(e => e.f(c.x)));
        CL.forEach((c, i) => EV.forEach((e, j) => R.key(`${e.k}@${i + 1}`, vals[i][j])));
        const hasN = CL.every(c => c.n > 0);
        R.table('Cuadro por cliente', [...(hasN ? ['Pólizas'] : []), ...names, ...EV.map(e => e.h)], CL.map((c, i) => [...(hasN ? [c.n] : []), ...c.x, ...vals[i]]), { top: true });
        R.ans('Cuadro por cliente.', `Evaluando las aproximaciones anteriores en cada cliente:<br>${CL.map((c, i) => `${hasN ? f(c.n) + ' pólizas ' : ''}${c.txt}: ${EV.map((e, j) => `${e.h} ≈ ${f(vals[i][j])}`).join('; ')}`).join('<br>')}`);
        const iE = EV.findIndex(e => e.k === 'E'), iS = EV.findIndex(e => e.k === 'sd'), iR = EV.findIndex(e => e.k === 'CVaR') >= 0 ? EV.findIndex(e => e.k === 'CVaR') : EV.findIndex(e => /^VaR/.test(e.k));
        if (hasN && iE >= 0 && iS >= 0 && iR >= 0) {
          const isCV = EV[iR].k === 'CVaR', lvl = isCV ? CV.t0 : QR1.tau;
          R.action('Llevar la cartera a «Recargos» (Caso 1) →', 't8-recargos', { src: 'tabla', cart: CL.map((c, i) => ({ n: String(c.n), E: String(vals[i][iE]), s: String(vals[i][iS]), r: String(vals[i][iR]) })), m_rho: isCV ? 'CVaR' : 'VaR', m_lvl: String(+(lvl * 100).toFixed(8)).replace('.', ',') },
            `Con pólizas independientes la cartera es normal (riesgo individual): el cuadro (nº, 𝔼, σ, ${isCV ? 'CVaR' : 'VaR'}) es justo la tabla de pólizas de la herramienta de recargos, con ρ = ${isCV ? 'CVaR' : 'VaR'}<sub>${T.fmtPctLevel(lvl)}</sub>.`);
        }
      }
      if (!R.exam.length) throw new Error('Marca al menos un modelo.');
      return R;
    },
    examples: [
      {
        id: 'e25-4', label: 'Enero 2025 · Ej. 4 · horas de conducción H e indemnización y: lineal, cuantílica al 95 %, CVaR por tramos y prima con H = 2000',
        values: { dat: [[700, 200, 390], [500, 250, 485], [5, 250, 20000], [800, 300, 580], [1000, 350, 605], [2000, 500, 860], [2000, 700, 1200], [10, 700, 30000], [1000, 1000, 1710], [1000, 1500, 2560], [700, 1800, 2710], [600, 2500, 3760], [8, 2500, 20000], [700, 3000, 4510]].map(r => tab([r], ['w', 'x1', 'y'])[0]), resp: 'y', nom: 'H', mLin: true, mQR: true, qrl: '95', mTr: true, trl: '95', cli: [{ n: '', x1: '2000', x2: '', x3: '' }], prOn: true, A: '1,04', B: '0,02', prm: 'cvar' },
        expect: [{ k: 'b0', l: 'β₀ (lineal)', v: 188.729185 }, { k: 'b1', l: 'β₁ (lineal)', v: 1.48113952 }, { k: 'q0_950', l: 'β̃₀ (VaR 95 %)', v: 85 }, { k: 'q1_950', l: 'β̃₁ (VaR 95 %)', v: 1.65 }, { k: 'c1', l: 'Coeficiente de H en el CVaR', v: 1.3617, src: 'tramos aproximados del profesor' }],
        note: '<b>Erratas en la solución oficial:</b> (1) en b) usa 𝔼(y) = 88,729185 + 1,48113952 × 2000, pero el término independiente es 188,729185; (2) toma dos tramos, 85 + 1,65H en [0,95; 0,998) y 33.888,9 − 5,556H en [0,998; 1), y con ellos el coeficiente de H es (1,65 × 0,048 − 5,556 × 0,002)/0,05 = 1,3617, pero su β̃₀ = 5.530,6 no sale de esos tramos (daría (85 × 0,048 + 33.888,9 × 0,002)/0,05 = 1.437,16). Además, la recta 33.888,9 − 5,556H sólo es la cuantílica óptima desde 0,99894: entre 0,95 y 1 hay en realidad cinco tramos (los que da la calculadora), y con ellos CVaR₉₅(−y) ≈ 1.039,18 + 1,6228H (prima 3.362,75). En el examen puedes dar los tramos exactos explicando el método; el resultado del profesor es una aproximación.'
      },
      {
        id: 'e24-5', label: 'Enero 2024 · Ej. 5 · log(y) con X₁, X₂: lineal, cuantílica al 90 % y prima con X₁ = 6, X₂ = 8',
        values: { dat: [[2000, 5, -8, 20], [5000, -1, 0, 40], [500, 2, 4, 30], [2000, 7, 10, 90]].map(r => tab([r], ['w', 'x1', 'x2', 'y'])[0]), resp: 'logy', mLin: true, mQR: true, qrl: '90', mTr: false, cli: [{ n: '', x1: '6', x2: '8', x3: '' }], prOn: true, A: '1,1', B: '0,02', prm: 'var' },
        expect: [{ k: 'b0', l: 'β₀', v: 3.651340048 }, { k: 'b1', l: 'β₁', v: -0.001753092 }, { k: 'b2', l: 'β₂', v: 0.08056854 }, { k: 'q0_900', l: 'β̃₀ (VaR 90 %)', v: 3.685298566 }, { k: 'q1_900', l: 'β̃₁', v: -0.003580888 }, { k: 'q2_900', l: 'β̃₂', v: 0.083957732 }, { k: 'prima', l: 'Π(y)', v: 81.41956583 }],
        note: 'La solución escribe «VaR<sub>95%</sub>» en c), pero usa (como pide el enunciado) la regresión al 90 %. 𝔼(y) se aproxima por e<sup>𝔼(log y)</sup>, como en la solución.'
      },
      {
        id: 'e26-3', label: 'Enero 2026 · Ej. 3 · P(A) de aceptar la campaña: logit por MCO y por MV, cuantílica, F de −P(A) y caso peor en (55; 40)',
        values: { dat: [[100, 30, 28, 8], [100, 40, 30, 5], [200, 50, 30, 2], [500, 60, 40, 4], [500, 70, 50, 5]].map(r => tab([r], ['w', 'x1', 'x2', 'y'])[0]), resp: 'bin', link: 'logit', mLin: true, mML: true, mQR: false, mTr: false, cli: [{ n: '', x1: '55', x2: '40', x3: '' }], fd: true, fneg: true, worst: true, wdir: 'min' },
        expect: [{ k: 'b0_logit', l: 'β₀ (MCO sobre logit)', v: -2.006742049 }, { k: 'b1_logit', l: 'β₁', v: -0.137222479 }, { k: 'b2_logit', l: 'β₂', v: 0.139018994 }, { k: 'R2_logit', l: 'R²', v: 0.9532774457 }, { k: 'pred_logit', l: 'P(A) por (1)', v: 0.01810638 }, { k: 'predML_logit', l: 'P(A) por MV (2)', v: 0.018092471, src: 'búsqueda aleatoria del profesor' }, { k: 'Ey0', l: '𝔼(P(A)) por (3)', v: 0.029247778, src: 'tramos 0,51 y 0,64 redondeados' }, { k: 'worst', l: 'Caso peor', v: 0.01810638, src: 'con su MV aproximada gana (1)' }],
        note: 'La solución redondea los cortes de la regresión cuantílica a 0,51 y 0,64 (los exactos son 0,5114 y 0,6429), y su MV es aproximada (búsqueda aleatoria). El caso peor es el menor P(A), porque implica menos clientes aceptando la ampliación.'
      },
      {
        id: 'clase-reg', label: 'Ejercicio de clase (Regresiones) · F₁, F₂, F₃: 𝔼(y), σ(y) por y², VaR y CVaR al 95 % y cartera de 6.000 pólizas',
        values: { dat: [[100, 2, -2, 4, 14.064], [10, 3, 2, 0, 15], [1000, 1, -2, 74, 206.684], [1000, 4, 3, 44, 124.204], [5000, -1, 4, 32, 85.512], [500, 2, -19, 21, 69.586], [50, 123, 76, -0.3, 84.1702]].map(r => tab([r], ['w', 'x1', 'x2', 'x3', 'y'])[0]), resp: 'y', nom: 'F₁; F₂; F₃', mSd: true, mLin: true, mQR: true, qrl: '95', mTr: true, trl: '95', trm: '95; 99,5',
          cli: [{ n: '1000', x1: '1', x2: '-10', x3: '30' }, { n: '2000', x1: '4', x2: '3', x3: '32' }, { n: '3000', x1: '2', x2: '-19', x3: '22' }] },
        expect: [{ k: 'b0', l: 'β₀ de 𝔼(y)', v: 0.119966018 }, { k: 'R2', l: 'Precisión', v: 0.9998817445 }, { k: 's0', l: 'β₀ de 𝔼(y²)', v: -15539.83027 }, { k: 'R2sq', l: 'Precisión de 𝔼(y²)', v: 0.9759292745 }, { k: 'q3_950', l: 'β̃₃ del VaR 95 %', v: 2.766 }, { k: 'c0', l: 'β̃₀ del CVaR', v: 1.353120003 }, { k: 'c1', l: 'β̃₁ del CVaR', v: 1.073172507 }, { k: 'c2', l: 'β̃₂ del CVaR', v: -0.636318762 }, { k: 'c3', l: 'β̃₃ del CVaR', v: 2.743041486 },
          { k: 'E@1', l: '𝔼(y) grupo 1', v: 89.02927384 }, { k: 'sd@1', l: 'σ(y) grupo 1', v: 44.43239478 }, { k: 'CVaR@1', l: 'CVaR grupo 1', v: 91.08072471 }, { k: 'sd@2', l: 'σ(y) grupo 2', v: 29.58252562 }, { k: 'CVaR@3', l: 'CVaR grupo 3', v: 75.93643419 }],
        note: 'La solución (y la macro Cuant) cambia de recta cuantílica en 99,5 % porque recorre los niveles de 0,5 en 0,5 puntos; el corte exacto está en 99,418 % (quita los niveles del campo «Niveles de los tramos» para verlo: β̃₀ pasa a 1,5909). En el enunciado (PDF) la 6ª fila aparece con F₁ = −2, pero las macros y la solución usan F₁ = 2 (con −2 no sale 0,119966018). f) se resuelve llevando la cartera a «Recargos» (botón al final) con ρ = CVaR₉₅; La solución usa ρ(0,1) = CVaR₉₅(N(0,1)) = 2,06323586 (el valor exacto es 2,0627128): escríbelo en «ρ(0,1) a usar» de Recargos para reproducir su prima de cartera 488.412,9348 → k₁ máx. 0,011402734. g) con «Mixtura con parámetro aleatorio» o «Credibilidad» (Bühlmann: h̃ = 120.000/91,0442² = 14,4769; reducción 12,14 %).'
      },
      { id: 'mac-J', label: 'Macro J · regresión lineal con 3 factores (10 grupos)', values: { dat: [[10, 1, 2, -89, -246.174], [10, 2, -2, 4, 14.064], [1, 3, 2, 0, 15], [100, 1, -2, 74, 206.684], [10000, 2, 3, -74, -204.184], [100, 4, 3, 44, 124.204], [500, -1, 4, 32, 85.512], [50, 2, -19, 21, 69.586], [50, -10, 9, 0, -14.5], [5, 123, 76, -0.3, 84.1702]].map(r => tab([r], ['w', 'x1', 'x2', 'x3', 'y'])[0]), resp: 'y', mLin: true, mQR: true, qrl: '70', mEx: true, exm: '0,2' },
        expect: [{ k: 'b0', l: 'Jensen Alfa', v: 0.007923832214 }, { k: 'b1', l: 'β₁', v: 1.000551216597 }, { k: 'b3', l: 'β₃', v: 2.766096318206 }, { k: 'R2', l: 'Accuracy', v: 0.999997606801 }, { k: 'q1_700', l: 'β₁ cuantílica 70 % (macro K1)', v: 1 }, { k: 'q3_700', l: 'β₃ cuantílica 70 %', v: 2.766 }, { k: 'e1', l: 'β₁ expectílica μ = 0,2 (macro K2)', v: 1.0008763159016112, src: 'simulación de la macro' }, { k: 'e0', l: 'Alfa expectílica', v: 0.024409256376444036, src: 'simulación de la macro' }] },
      { id: 'mac-N1', label: 'Macro N1 · logit por MCO y por MV (115 grupos; edad X₁ y antigüedad X₂)', values: { dat: tab(N1D, ['w', 'x1', 'x2', 'y']), resp: 'bin', link: 'logit', mLin: true, mML: true, mQR: false },
        expect: [{ k: 'b0_logit', l: 'Jensen Alfa (MCO)', v: -2.368907379635 }, { k: 'b1_logit', l: 'β₁ MCO', v: -0.017724095579 }, { k: 'b2_logit', l: 'β₂ MCO', v: 0.269090899158 }, { k: 'R2_logit', l: 'Accuracy', v: 0.693197174531 }, { k: 'ml0_logit', l: 'Alfa MV', v: -1.895125903708, src: 'búsqueda aleatoria' }, { k: 'ml1_logit', l: 'β₁ MV', v: -0.012761348817, src: 'búsqueda aleatoria' }, { k: 'll_logit', l: 'Log-verosimilitud MV', v: -91618.87674793617, src: 'la exacta es mayor' }] },
      { id: 'mac-N3', label: 'Macro N3 · probit por MCO y por MV (115 grupos)', values: { dat: tab(N1D, ['w', 'x1', 'x2', 'y']), resp: 'bin', link: 'probit', mLin: true, mML: true, mQR: false },
        expect: [{ k: 'b0_probit', l: 'Jensen Alfa (MCO)', v: -1.333290482083 }, { k: 'b1_probit', l: 'β₁ MCO', v: -0.008909764763 }, { k: 'b2_probit', l: 'β₂ MCO', v: 0.144455429794 }, { k: 'R2_probit', l: 'Accuracy', v: 0.7227072155949999 }, { k: 'ml0_probit', l: 'Alfa MV', v: -1.173295624233, src: 'búsqueda aleatoria' }, { k: 'll_probit', l: 'Log-verosimilitud MV', v: -91285.71340491688, src: 'la exacta es mayor' }] },
      { id: 'mac-N2', label: 'Macro N2 · regresión logarítmica de la frecuencia media (115 grupos)', values: { dat: tab(N2D, ['w', 'x1', 'x2', 'y']), resp: 'cnt', mLin: true, mML: true, mQR: false },
        expect: [{ k: 'b0', l: 'Jensen Alfa (MCO sobre log media)', v: -0.205248646005 }, { k: 'b1', l: 'β₁ MCO', v: -0.019967889146 }, { k: 'b2', l: 'β₂ MCO', v: 0.162444174847 }, { k: 'R2', l: 'Accuracy', v: 0.757848290091 }, { k: 'ml0_log', l: 'Alfa MV', v: -0.041049729201, src: 'búsqueda aleatoria' }, { k: 'll_log', l: 'Log-verosimilitud MV', v: -132609.4096221666, src: 'la exacta es mayor' }] }
    ]
  });
})();
