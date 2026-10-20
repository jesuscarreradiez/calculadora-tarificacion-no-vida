/* ════════════════════════════════════════════════════════════════
   SELECTORES REUTILIZABLES: distribuciones, frecuencias, medidas,
   origen de la siniestralidad y. Notación del resumen teórico.
   ════════════════════════════════════════════════════════════════ */
'use strict';
const P = (function () {
  const T = TNV, f = T.fmt;
  const vv = UI.v;

  /* ───────── Familias continuas (tema 1) ───────── */
  const CF = {
    normal: { lab: 'Normal N(m; s)', modes: { p: { lab: 'm y s', f: [['m', 'm = 𝔼(y)', '0'], ['s', 's = σ(y)', '1', { pos: 1 }]], mk: x => T.normal(x.m, x.s), ex: x => `y ∼ N(m = ${f(x.m)}; s = ${f(x.s)}).` } } },
    lognormal: {
      lab: 'Log-normal', modes: {
        mom: { lab: 'su media y su desviación', f: [['E', '𝔼(y)', '1000', { pos: 1 }], ['sd', 'σ(y)', '250', { pos: 1 }]], mk: x => T.lognormalMoments(x.E, x.sd), ex: (x, D) => `Log-normal de media ${f(x.E)} y desviación ${f(x.sd)}. Por (7): s² = log(σ²(y)/𝔼(y)² + 1) = ${f(D.sg * D.sg)}, m = log 𝔼(y) − s²/2 = ${f(D.mu)} (parámetros de z = log y).` },
        log: { lab: 'm y s del logaritmo', f: [['m', 'm (media de log y)', '0'], ['s', 's (desv. de log y)', '1', { pos: 1 }]], mk: x => T.lognormal(x.m, x.s), ex: (x, D) => `y = e<sup>z</sup> con z ∼ N(${f(x.m)}; ${f(x.s)}). Por (6): 𝔼(y) = e<sup>m+s²/2</sup> = ${f(D.mean)}, σ(y) = ${f(D.sd)}.` }
      }
    },
    exponencial: { lab: 'Exponencial (media β)', modes: { p: { lab: 'β', f: [['b', 'β = 𝔼(y)', '100', { pos: 1 }]], mk: x => T.gammaD(1, x.b), ex: x => `Exponencial de media β = ${f(x.b)} (Gamma con α = 1, ec. 11); σ(y) = β = ${f(x.b)}.` } } },
    gamma: {
      lab: 'Gamma / Erlang', modes: {
        p: { lab: 'α y β', f: [['a', 'α (forma)', '2', { pos: 1 }], ['b', 'β (escala)', '100', { pos: 1 }]], mk: x => T.gammaD(x.a, x.b), ex: (x, D) => `Gamma(α = ${f(x.a)}; β = ${f(x.b)}). Por (12): 𝔼(y) = αβ = ${f(D.mean)}, σ²(y) = αβ² = ${f(D.var)}.` },
        sum: { lab: 'suma de k exponenciales de media β', f: [['k', 'k (nº de exponenciales)', '3', { pos: 1 }], ['b', 'β (media de cada una)', '70', { pos: 1 }]], mk: x => T.gammaD(x.k, x.b), ex: (x, D) => `La suma de ${f(x.k)} exponenciales independientes de media ${f(x.b)} es una Gamma (Erlang) con α = ${f(x.k)} y β = ${f(x.b)} (§1.4.5): 𝔼 = αβ = ${f(D.mean)}, σ = β√α = ${f(D.sd)}.` },
        mom: { lab: 'su media y su desviación', f: [['E', '𝔼(y)', '200', { pos: 1 }], ['sd', 'σ(y)', '100', { pos: 1 }]], mk: x => T.gammaD((x.E / x.sd) ** 2, x.sd * x.sd / x.E), ex: (x, D) => `Despejando (12): α = (𝔼/σ)² = ${f(D.al)}, β = σ²/𝔼 = ${f(D.be)}.` },
        erl: { lab: 'Erlang por media y desviación (α redondeado, como la macro)', f: [['E', '𝔼(y)', '200', { pos: 1 }], ['sd', 'σ(y)', '100', { pos: 1 }]], mk: x => T.gammaD(Math.max(1, Math.round((x.E / x.sd) ** 2)), x.sd * x.sd / x.E), ex: (x, D) => `Erlang: β = σ²/𝔼 = ${f(D.be)} y α = 𝔼²/σ² = ${f((x.E / x.sd) ** 2)} redondeado a ${f(D.al)} (así lo hacen las macros del profesor); 𝔼 = αβ = ${f(D.mean)}, σ = β√α = ${f(D.sd)}.` }
      }
    },
    chi2: { lab: 'χ² con n grados de libertad', modes: { p: { lab: 'n', f: [['n', 'n (grados de libertad)', '4', { pos: 1 }]], mk: x => T.gammaD(x.n / 2, 2), ex: x => `χ²(${f(x.n)}) = Gamma(α = n/2 = ${f(x.n / 2)}; β = 2) (§1.4.4).` } } },
    wald: {
      lab: 'Wald (inversa gaussiana)', modes: {
        p: { lab: 'm y β', f: [['m', 'm (media)', '1', { pos: 1 }], ['b', 'β (forma)', '1', { pos: 1 }]], mk: x => T.wald(x.m, x.b), ex: (x, D) => `Wald(m = ${f(x.m)}; β = ${f(x.b)}): 𝔼(y) = m, σ²(y) = m³/β = ${f(D.var)}.` },
        mom: { lab: 'su media y su desviación', f: [['E', '𝔼(y)', '1', { pos: 1 }], ['sd', 'σ(y)', '1', { pos: 1 }]], mk: x => T.wald(x.E, x.E ** 3 / (x.sd * x.sd)), ex: (x, D) => `m = 𝔼(y) = ${f(x.E)}, β = m³/σ² = ${f(D.be)}.` }
      }
    },
    beta: {
      lab: 'Beta (u; v)', modes: {
        p: { lab: 'u y v', f: [['u', 'u', '2', { pos: 1 }], ['v', 'v', '3', { pos: 1 }]], mk: x => T.betaD(x.u, x.v), ex: (x, D) => `Beta(u = ${f(x.u)}; v = ${f(x.v)}). Por (13): 𝔼 = u/(u+v) = ${f(D.mean)}, σ² = uv/((u+v+1)(u+v)²) = ${f(D.var)}.` },
        mom: { lab: 'su media y su desviación', f: [['E', '𝔼(y)', '0,4'], ['sd', 'σ(y)', '0,2', { pos: 1 }]], mk: x => { const k = x.E * (1 - x.E) / (x.sd * x.sd) - 1; if (!(k > 0) || !(x.E > 0 && x.E < 1)) throw new Error('Momentos imposibles para una beta (hace falta 0 < 𝔼 < 1 y σ² < 𝔼(1−𝔼)).'); return T.betaD(x.E * k, (1 - x.E) * k); }, ex: (x, D) => `Despejando (13): u = ${f(D.u)}, v = ${f(D.v)}.` }
      }
    },
    uniforme: { lab: 'Uniforme U(a; b)', modes: { p: { lab: 'a y b', f: [['a', 'a', '0'], ['b', 'b', '1']], mk: x => { if (!(x.b > x.a)) throw new Error('Debe cumplirse a < b.'); return T.uniform(x.a, x.b); }, ex: (x, D) => `U(${f(x.a)}; ${f(x.b)}): 𝔼 = (a+b)/2 = ${f(D.mean)}, σ² = (b−a)²/12 = ${f(D.var)}.` } ,
      mom: { lab: 'su media y su desviación', f: [['E', '𝔼(y)', '0,5'], ['sd', 'σ(y)', '0,2887', { pos: 1 }]], mk: x => T.uniform(x.E - x.sd * Math.sqrt(3), x.E + x.sd * Math.sqrt(3)), ex: (x, D) => `Uniforme con 𝔼 = ${f(x.E)} y σ = ${f(x.sd)}: a = 𝔼 − σ√3 = ${f(D.mean - x.sd * Math.sqrt(3))}, b = 𝔼 + σ√3 = ${f(D.mean + x.sd * Math.sqrt(3))} (pues σ² = (b − a)²/12).` } } },
    gumbel: { lab: 'Gumbel (μ; β)', modes: { p: { lab: 'μ y β', f: [['mu', 'μ (moda)', '0'], ['b', 'β', '1', { pos: 1 }]], mk: x => T.gumbel(x.mu, x.b), ex: (x, D) => `Gumbel (§1.7): 𝔼 = μ + Mβ = ${f(D.mean)} (M ≈ 0,5772156649), σ² = β²π²/6 = ${f(D.var)}.` } } },
    frechet: { lab: 'Fréchet (m; s; α)', modes: { p: { lab: 'm, s, α', f: [['m', 'm', '0'], ['s', 's', '1', { pos: 1 }], ['a', 'α', '3', { pos: 1 }]], mk: x => T.frechet(x.m, x.s, x.a), ex: (x, D) => `Fréchet (§1.8): 𝔼 = m + sΓ(1 − 1/α) = ${f(D.mean)} (α > 1); σ² = s²(Γ(1 − 2/α) − Γ(1 − 1/α)²) = ${f(D.var)} (α > 2).` } } },
    weibull: { lab: 'Weibull (m; α; β)', modes: { p: { lab: 'm, α, β', f: [['m', 'm (umbral)', '0'], ['a', 'α (forma)', '2', { pos: 1 }], ['b', 'β (escala)', '1', { pos: 1 }]], mk: x => T.weibull(x.m, x.a, x.b), ex: (x, D) => `Weibull (§1.9): 𝔼 = m + βΓ(1 + 1/α) = ${f(D.mean)}, σ² = β²(Γ(1 + 2/α) − Γ(1 + 1/α)²) = ${f(D.var)}.` } } },
    pareto: {
      lab: 'Pareto (α; β)', modes: {
        p: { lab: 'α y β', f: [['a', 'α', '3', { pos: 1 }], ['b', 'β', '200', { pos: 1 }]], mk: x => T.pareto(x.a, x.b), ex: (x, D) => `Pareto(α = ${f(x.a)}; β = ${f(x.b)}). Por (16)–(17): 𝔼 = β/(α−1) = ${f(D.mean)}${x.a > 2 ? `, σ² = αβ²/((α−1)²(α−2)) = ${f(D.var)}` : ' (varianza infinita: α ≤ 2)'}.` },
        mom: { lab: 'su media y su desviación', f: [['E', '𝔼(y)', '100', { pos: 1 }], ['sd', 'σ(y)', '150', { pos: 1 }]], mk: x => { const r = x.sd * x.sd / (x.E * x.E); if (!(r > 1)) throw new Error('Una Pareto necesita σ > 𝔼 (coeficiente de variación mayor que 1).'); const a = 2 * r / (r - 1); return T.pareto(a, x.E * (a - 1)); }, ex: (x, D) => `De (17): σ²/𝔼² = α/(α−2) ⇒ α = ${f(D.al)}, β = 𝔼(α−1) = ${f(D.be)}.` }
      }
    },
    gpd: { lab: 'Pareto generalizada (ξ; η)', modes: { p: { lab: 'ξ y η', f: [['xi', 'ξ', '0,3'], ['eta', 'η', '100', { pos: 1 }]], mk: x => T.gpd(x.xi, x.eta), ex: (x, D) => `Pareto generalizada (ec. 18) con ξ = ${f(x.xi)}, η = ${f(x.eta)}: 𝔼 = η/(1−ξ) = ${f(D.mean)}.` } } },
    student: { lab: 't de Student', modes: { p: { lab: 'α (g.l.)', f: [['nu', 'α (grados de libertad)', '5', { pos: 1 }], ['m', 'desplazamiento m', '0'], ['s', 'escala s', '1', { pos: 1 }]], mk: x => T.student(x.nu, x.m, x.s), ex: (x, D) => `t de Student con ${f(x.nu)} g.l.${(x.m || x.s !== 1) ? ', y = m + s·t' : ''}: σ²(t) = α/(α−2) ${x.nu > 2 ? '= ' + f(x.nu / (x.nu - 2)) : '(infinita para α ≤ 2)'}.` } } }
  };
  const CF_ALL = Object.keys(CF);
  const CF_POS = ['exponencial', 'gamma', 'lognormal', 'normal', 'pareto', 'weibull', 'gpd', 'wald', 'uniforme', 'beta', 'chi2', 'frechet'];

  /* ───────── Familias discretas sencillas ───────── */
  const DF = {
    constante: {
      lab: 'Constante (siempre el mismo valor)',
      fields: p => [{ id: p + 'cte', type: 'num', label: 'Valor', def: '1' }],
      build: (V, p) => { const c = V.n(p + 'cte'); return { D: T.constant(c), ex: `Variable constante igual a ${f(c)}.` }; }
    },
    discreta: {
      lab: 'Discreta (valores y probabilidades)',
      fields: p => [
        { id: p + 'dx', type: 'text', label: 'Valores (separados por «;»)', def: '0; 1; 2; 3', wide: true },
        { id: p + 'dp', type: 'text', label: 'Probabilidades (separadas por «;»)', def: '0,4; 0,35; 0,2; 0,05', wide: true }],
      build: (V, p) => {
        const xs = V.list(p + 'dx'), ps = V.list(p + 'dp');
        if (xs.length !== ps.length) throw new Error(`Hay ${xs.length} valores y ${ps.length} probabilidades.`);
        const s = ps.reduce((a, b) => a + b, 0);
        if (Math.abs(s - 1) > 1e-6) throw new Error(`Las probabilidades suman ${f(s)} y deben sumar 1.`);
        const D = T.discreteTable(xs, ps);
        return { D, ex: `Distribución discreta con ${xs.length} valores: 𝔼 = Σ x·p = ${f(D.mean)}, σ² = ${f(D.var)}.` };
      }
    }
  };

  /* ───────── Frecuencias (tema 2) ───────── */
  const FR = {
    poisson: { lab: 'Poisson (λ)', modes: { p: { lab: 'λ', f: [['lam', 'λ = 𝔼(N)', '1', { pos: 1 }]], mk: x => T.poisson(x.lam), ex: x => `N ∼ Poisson(λ = ${f(x.lam)}): 𝔼(N) = σ²(N) = λ = ${f(x.lam)}.` } } },
    binneg: {
      lab: 'Binomial negativa (α; θ)', modes: {
        p: { lab: 'α y θ', f: [['a', 'α', '1', { pos: 1 }], ['th', 'θ', '0,4', { prob: 1 }]], mk: x => T.negbin(x.a, x.th), ex: (x, D) => `N ∼ BN(α = ${f(x.a)}; θ = ${f(x.th)}). Por (24): 𝔼(N) = α(1−θ)/θ = ${f(D.mean)}, σ²(N) = α(1−θ)/θ² = ${f(D.var)}.` },
        pg: { lab: 'mixtura Poisson–Gamma (α y β de λ)', f: [['a', 'α de la gamma', '1', { pos: 1 }], ['b', 'β de la gamma', '2', { pos: 1 }]], mk: x => T.negbin(x.a, 1 / (1 + x.b)), ex: (x, D) => `λ ∼ Gamma(α = ${f(x.a)}; β = ${f(x.b)}) y N|λ ∼ Poisson(λ) ⇒ N ∼ BN(α = ${f(x.a)}; θ = 1/(1+β) = ${f(D.th)}) (ec. 29). 𝔼(N) = ${f(D.mean)}, σ²(N) = ${f(D.var)}.` },
        mv: { lab: '𝔼(N) y σ²(N)', f: [['E', '𝔼(N)', '1,5', { pos: 1 }], ['V', 'σ²(N)', '3,75', { pos: 1 }]], mk: x => { if (!(x.V > x.E)) throw new Error('La binomial negativa exige σ²(N) > 𝔼(N).'); const th = x.E / x.V; return T.negbin(x.E * th / (1 - th), th); }, ex: (x, D) => `De (24): θ = 𝔼(N)/σ²(N) = ${f(D.th)}, α = 𝔼(N)·θ/(1−θ) = ${f(D.al)}.` }
      }
    },
    geometrica: { lab: 'Geométrica (θ)', modes: { p: { lab: 'θ', f: [['th', 'θ', '0,5', { prob: 1 }]], mk: x => T.negbin(1, x.th), ex: (x, D) => `Geométrica(θ) = BN(α = 1; θ = ${f(x.th)}) (§2.3.2): 𝔼(N) = (1−θ)/θ = ${f(D.mean)}, σ²(N) = ${f(D.var)}.` } } },
    tabla: {
      lab: 'Tabla de valores (N = 0, 1, 2…)',
      fields: p => [
        { id: p + 'tx', type: 'text', label: 'Valores de N (separados por «;»)', def: '0; 1; 2', wide: true },
        { id: p + 'tp', type: 'text', label: 'Probabilidades (separadas por «;»)', def: '0,5; 0,3; 0,2', wide: true }],
      build: (V, p) => {
        const xs = V.list(p + 'tx'), ps = V.list(p + 'tp');
        if (xs.length !== ps.length) throw new Error(`Hay ${xs.length} valores de N y ${ps.length} probabilidades.`);
        const s = ps.reduce((a, b) => a + b, 0);
        if (Math.abs(s - 1) > 1e-6) throw new Error(`Las probabilidades de N suman ${f(s)} y deben sumar 1.`);
        const D = T.freqTable(xs, ps);
        return { D, ex: `N toma los valores ${xs.map((x, i) => `${f(x)} (prob. ${f(ps[i])})`).join(', ')}: 𝔼(N) = Σ n·IP(N = n) = ${f(D.mean)}, σ²(N) = ${f(D.var)}.`, xs, ps };
      }
    },
    binomial: { lab: 'Binomial (n; p)', modes: { p: { lab: 'n y p', f: [['n', 'n', '10', { pos: 1 }], ['p', 'p', '0,1', { prob: 1 }]], mk: x => { if (Math.round(x.n) !== x.n) throw new Error('n debe ser entero.'); return T.binomial(x.n, x.p); }, ex: (x, D) => `N ∼ Bin(n = ${f(x.n)}; p = ${f(x.p)}). Por (23): 𝔼(N) = np = ${f(D.mean)}, σ²(N) = np(1−p) = ${f(D.var)}.` } } }
  };

  /* ───────── Generador de campos para familias ───────── */
  function withShow(fields, cond) { return fields.map(fd => Object.assign({}, fd, { show: v => cond(v) && (!fd.show || fd.show(v)) })); }
  function famFields(p, REG, keys, defFam, over, label) {
    over = over || {};
    const fields = [{ id: p + 'fam', type: 'sel', label: label || 'Distribución', def: defFam, opts: keys.map(k => [k, (REG[k] || DF[k]).lab]), wide: true }];
    for (const k of keys) {
      const F = REG[k] || DF[k];
      if (!F.modes) { fields.push(...withShow(F.fields(p), v => v[p + 'fam'] === k).map(fd => over[fd.id] !== undefined ? Object.assign(fd, { def: over[fd.id] }) : fd)); continue; }
      const modes = Object.keys(F.modes);
      if (modes.length > 1) fields.push({ id: `${p}${k}_mode`, type: 'sel', label: 'Introducir mediante', def: modes[0], opts: modes.map(m => [m, F.modes[m].lab]), wide: true, show: v => v[p + 'fam'] === k });
      for (const m of modes) for (const [nm, lab, d] of F.modes[m].f) {
        const id = `${p}${k}_${m}_${nm}`;
        fields.push({ id, type: 'num', label: lab, def: over[id] !== undefined ? over[id] : d, show: v => v[p + 'fam'] === k && (modes.length === 1 || v[`${p}${k}_mode`] === m) });
      }
    }
    return fields;
  }
  function buildFam(V, p, REG) {
    const k = V.s(p + 'fam'), F = REG[k] || DF[k];
    if (!F) throw new Error('Distribución no reconocida.');
    if (!F.modes) return Object.assign({ fam: k }, F.build(V, p));
    const modes = Object.keys(F.modes), m = modes.length > 1 ? V.s(`${p}${k}_mode`) : modes[0], M = F.modes[m] || F.modes[modes[0]];
    const x = {};
    for (const [nm, , , o] of M.f) x[nm] = V.n(`${p}${k}_${m}_${nm}`, o);
    const D = M.mk(x);
    return { D, ex: M.ex ? M.ex(x, D) : '', fam: k, mode: m, x };
  }

  /* ───────── Medidas de riesgo ───────── */
  const MEAS = [
    ['CVaR', 'CVaR — valor en riesgo condicional'], ['VaR', 'VaR — valor en riesgo'],
    ['SW', 'SWₐ — Wang espectral'], ['Wang', 'Wₐ — medida de Wang (distorsión)'],
    ['SDPT', 'SDPTₐ — DPT espectral'], ['DPT', 'DPTₐ — distorsión potencial'],
    ['SPow', 'Espectral con g(t) = tᵃ  (ρ = 2∫μ·CVaR dμ ⇒ a = 2)'],
    ['WCVaR', 'WCVaR — CVaR ponderado (p. ej. 0,5CVaR80 + 0,5CVaR90)'],
    ['Expectil', '𝔈μ — expectil'], ['Entropica', 'ℰμ — medida entrópica'], ['SigmaE', 'ρσ = σ + 𝔼 (desviación típica)']
  ];
  const usesLvl = t => t === 'VaR' || t === 'CVaR', usesA = t => ['SW', 'Wang', 'SDPT', 'DPT', 'SPow'].includes(t), usesMu = t => t === 'Expectil' || t === 'Entropica';
  function measFields(p, def, label) {
    def = Object.assign({ type: 'CVaR', lvl: '95', a: '1', mu: '0,3' }, def || {});
    return [
      { id: p + 'rho', type: 'sel', label: label || 'Medida de riesgo ρ', def: def.type, opts: MEAS, wide: true },
      { id: p + 'lvl', type: 'num', label: 'Nivel de confianza 1 − μ (%)', def: def.lvl, show: v => usesLvl(v[p + 'rho']), help: '95 ⇒ μ = 0,05' },
      { id: p + 'a', type: 'num', label: 'Parámetro a', def: def.a, show: v => usesA(v[p + 'rho']), help: 'SW₁ ⇒ a = 1' },
      { id: p + 'mu', type: 'num', label: 'Parámetro μ', def: def.mu, show: v => usesMu(v[p + 'rho']), help: 'Expectil: 0 < μ ≤ 1/2 (𝔈₀,₃ ⇒ 0,3)' },
      { id: p + 'wl', type: 'text', label: 'Niveles de confianza (%)', def: def.wl || '80; 90', show: v => v[p + 'rho'] === 'WCVaR', help: 'Separados por «;»' },
      { id: p + 'wk', type: 'text', label: 'Pesos kᵢ', def: def.wk || '0,5; 0,5', show: v => v[p + 'rho'] === 'WCVaR', help: 'Deben sumar 1' }
    ];
  }
  function specOf(t, par, what) {
    if (usesLvl(t)) {
      let l = par; if (!(l > 0)) throw new Error(`Nivel de confianza no válido en ${what || 'la medida'}.`);
      if (l >= 1) l = l / 100;
      if (!(l > 0 && l < 1)) throw new Error(`El nivel de confianza debe estar entre 0 y 100 %.`);
      return { type: t, mu: Math.round((1 - l) * 1e12) / 1e12 };
    }
    if (usesA(t)) { if (!isFinite(par)) throw new Error('Falta el parámetro a.'); if (t !== 'SW' && t !== 'Wang' && !(par > 0)) throw new Error('El parámetro a debe ser positivo.'); return { type: t, a: par }; }
    if (t === 'Expectil') { if (!(par > 0 && par <= 0.5)) throw new Error('El expectil 𝔈μ requiere 0 < μ ≤ 1/2.'); return { type: t, mu: par }; }
    if (t === 'Entropica') { if (!(par > 0)) throw new Error('La medida entrópica requiere μ > 0.'); return { type: t, mu: par }; }
    return { type: t };
  }
  function buildMeas(V, p) {
    const t = V.s(p + 'rho');
    if (t === 'WCVaR') {
      const ls = V.list(p + 'wl'), ks = V.list(p + 'wk');
      if (ls.length !== ks.length || !ls.length) throw new Error('El WCVaR necesita tantos pesos como niveles.');
      if (Math.abs(ks.reduce((a, b) => a + b, 0) - 1) > 1e-6) throw new Error('Los pesos del WCVaR deben sumar 1.');
      return { type: t, mus: ls.map(l => specOf('CVaR', l).mu), ks };
    }
    const par = usesLvl(t) ? V.n(p + 'lvl') : usesA(t) ? V.n(p + 'a') : usesMu(t) ? V.n(p + 'mu') : NaN;
    return specOf(t, par);
  }
  const rn = (sp, arg) => T.riskName(sp, arg);

  /* Explicación del riesgo de la N(0,1) (ec. 44–48) */
  function std01Explain(sp) {
    const r = T.rhoStd(sp);
    switch (sp.type) {
      case 'VaR': return `VaR<sub>1−μ</sub>(−ỹ) = Φ<sup>−1</sup>(1 − μ) = Φ<sup>−1</sup>(${f(1 - sp.mu)}) = ${vv(r)} (ec. 45)`;
      case 'CVaR': return `CVaR<sub>1−μ</sub>(−ỹ) = φ(Φ<sup>−1</sup>(μ))/μ = φ(${f(T.PhiInv(sp.mu))})/${f(sp.mu)} = ${vv(r)} (ec. 45)`;
      case 'Wang': return `W<sub>a</sub>(−ỹ) = 𝔼(ỹ + a) = a = ${vv(r)} (la distorsión de Wang desplaza la normal a unidades)`;
      case 'SW': return `SW<sub>a</sub>(−ỹ) = ∫₀¹ CVaR<sub>1−t</sub>(−ỹ) g′<sub>a</sub>(t) dt, con g′<sub>a</sub>(t) = exp(−aΦ<sup>−1</sup>(t) − a²/2) (ec. 36). Con t = Φ(u): ∫ (φ(u)/Φ(u))·φ(u + a) du = ${vv(r)} (integración numérica)`;
      case 'SDPT': return `SDPT<sub>a</sub>(−ỹ) = ∫₀¹ CVaR<sub>1−t</sub>(−ỹ)·a(1 − t)<sup>a−1</sup> dt = ${vv(r)} (integración numérica)`;
      case 'DPT': return `DPT<sub>a</sub>(−ỹ) = ∫₀¹ VaR<sub>1−t</sub>(−ỹ)·a(1 − t)<sup>a−1</sup> dt = ${vv(r)} (ec. 35, integración numérica)`;
      case 'SPow': return `ρ(−ỹ) = ∫₀¹ CVaR<sub>1−t</sub>(−ỹ)·a t<sup>a−1</sup> dt = ${vv(r)} (integración numérica)`;
      case 'Expectil': return `𝔈<sub>μ</sub>(−ỹ) = z, donde z resuelve z = ((1 − 2μ)/μ)·𝔼((ỹ − z)<sup>+</sup>) (ec. 43), con 𝔼((ỹ − z)<sup>+</sup>) = φ(z) − z(1 − Φ(z)) ⇒ z = ${vv(r)}`;
      case 'Entropica': return `ℰ<sub>μ</sub>(−ỹ) = (1/μ)·log 𝔼(e<sup>μỹ</sup>) = μ/2 = ${vv(r)}`;
      case 'SigmaE': return `ρ<sub>σ</sub>(−ỹ) = σ + 𝔼 = 1`;
      case 'WCVaR': return `WCVaR(−ỹ) = Σ kᵢ·φ(Φ<sup>−1</sup>(μᵢ))/μᵢ = ${sp.mus.map((m, i) => `${f(sp.ks[i])} × ${f(T.rhoStd({ type: 'CVaR', mu: m }))}`).join(' + ')} = ${vv(r)} (ec. 34)`;
    }
    return '';
  }
  /* Explicación general del cálculo de ρ(−y) para una distribución D */
  function genExplain(sp, D, val, kind) {
    const nm = rn(sp);
    if (sp.type === 'VaR') return `${nm} = percentil ${T.fmtPctLevel(1 - sp.mu)} de y = ${vv(val)} (ec. 31)`;
    if (sp.type === 'CVaR') {
      if (kind === 'lognormal') return `${nm} = (e<sup>m+s²/2</sup>/μ)·[1 − Φ(Φ<sup>−1</sup>(1 − μ) − s)] = ${vv(val)} (ec. 49)`;
      const va = D.VaR(sp.mu);
      return `${nm} = VaR + 𝔼((y − VaR)<sup>+</sup>)/μ = ${f(va)} + ${f(D.SL(va))}/${f(sp.mu)} = ${vv(val)} (media de y en el ${T.fmtPctLevel(sp.mu)} de peores casos, ec. 33)`;
    }
    if (sp.type === 'Expectil') return `${nm} = z, solución de z = 𝔼(y) + ((1 − 2μ)/μ)·𝔼((y − z)<sup>+</sup>) (ec. 43) ⇒ ${vv(val)}`;
    if (sp.type === 'Wang' && kind === 'lognormal') return `${nm} = e<sup>m + as + s²/2</sup> = ${vv(val)}`;
    if (sp.type === 'Wang') return `${nm} = ∫₀¹ VaR<sub>1−t</sub>(−y) g′(t) dt con g(t) = Φ(Φ<sup>−1</sup>(t) + a) (ec. 35) = ${vv(val)}`;
    if (sp.type === 'DPT') return `${nm} = ∫₀¹ VaR<sub>1−t</sub>(−y)·a(1 − t)<sup>a−1</sup> dt (ec. 35) = ${vv(val)}`;
    if (sp.type === 'SW') return `${nm} = ∫₀¹ CVaR<sub>1−t</sub>(−y)·g′<sub>a</sub>(t) dt, g′<sub>a</sub>(t) = exp(−aΦ<sup>−1</sup>(t) − a²/2) (ec. 40, 36) = ${vv(val)}`;
    if (sp.type === 'SDPT') return `${nm} = ∫₀¹ CVaR<sub>1−t</sub>(−y)·a(1 − t)<sup>a−1</sup> dt (ec. 40) = ${vv(val)}`;
    if (sp.type === 'SPow') return `${nm} = ∫₀¹ CVaR<sub>1−t</sub>(−y)·a t<sup>a−1</sup> dt = ${vv(val)}`;
    if (sp.type === 'Entropica') return `${nm} = (1/μ)·log 𝔼(e<sup>μy</sup>) = ${vv(val)}${D.heavy ? ' (¡cola pesada! en teoría es +∞)' : ''}`;
    if (sp.type === 'WCVaR') return `${nm} = ${sp.mus.map((m, i) => `${f(sp.ks[i])} × ${f(D.CVaR(m))}`).join(' + ')} = ${vv(val)} (ec. 34)`;
    if (sp.type === 'SigmaE') return `${nm} = σ(y) + 𝔼(y) = ${f(D.sd)} + ${f(D.mean)} = ${vv(val)}`;
    return `${nm} = ${vv(val)}`;
  }

  /* ───────── Origen de la siniestralidad y (temas 4 y 5) ───────── */
  const SRC_LAB = { cartera: 'Cartera de pólizas (tabla) → normal', cont: 'Distribución continua (normal, log-normal…)', compuesta: 'Compuesta: frecuencia × severidad', discreta: 'Discreta (valores y probabilidades)' };
  function srcFields(p, kinds, def, over) {
    over = over || {};
    const out = [{ id: p + 'src', type: 'sel', label: 'Siniestralidad y', def: def || kinds[0], opts: kinds.map(k => [k, SRC_LAB[k]]), wide: true }];
    const is = k => v => v[p + 'src'] === k;
    if (kinds.includes('cartera')) out.push(...withShow([
      { id: p + 'cart', type: 'rows', label: 'Pólizas independientes (la columna «Riesgo» del enunciado no se usa aquí)', cols: [{ id: 'n', label: 'Nº pólizas' }, { id: 'E', label: 'Coste esperado' }, { id: 's', label: 'Desviación' }], def: over.cart || [{ n: '2.000', E: '150', s: '1.000' }, { n: '5.000', E: '250', s: '2.000' }, { n: '3.000', E: '300', s: '3.000' }] }
    ], is('cartera')));
    if (kinds.includes('cont')) out.push(...withShow(famFields(p + 'c_', CF, CF_ALL, over.contFam || 'normal', over), is('cont')));
    if (kinds.includes('compuesta')) out.push(...withShow([
      ...famFields(p + 'N_', FR, Object.keys(FR), 'binneg', over, 'Frecuencia N'),
      ...famFields(p + 'S_', CF, CF_POS.concat(['constante', 'discreta']), 'lognormal', over, 'Severidad S'),
      { id: p + 'd', type: 'num', label: 'Franquicia por siniestro d', def: '', ph: 'sin franquicia' },
      { id: p + 'L', type: 'num', label: 'Indemnización máx. por siniestro', def: '', ph: 'sin límite' },
      { id: p + 'F', type: 'num', label: 'Indemnización máx. anual (agregada)', def: '', ph: 'sin límite' }
    ], is('compuesta')));
    if (kinds.includes('discreta')) out.push(...withShow(DF.discreta.fields(p + 'y'), is('discreta')));
    return out;
  }
  function buildSrc(V, p) {
    const k = V.s(p + 'src');
    if (k === 'cartera') {
      const rows = V.rows(p + 'cart');
      if (!rows.length) throw new Error('La tabla de pólizas está vacía.');
      let m = 0, v2 = 0;
      for (const r of rows) { if (!(r.n > 0) || !(r.s >= 0)) throw new Error('Revisa la tabla: nº de pólizas y desviaciones deben ser positivos.'); m += r.n * r.E; v2 += r.n * r.s * r.s; }
      const s = Math.sqrt(v2);
      const D = T.normal(m, s);
      const ex = `Por la teoría del riesgo individual (ec. 61) y el Teorema Central del Límite, la siniestralidad de la cartera es normal:` +
        UI.eq(`𝔼(y) = Σ n<sub>i</sub>·𝔼(y<sub>i</sub>) = ${rows.map(r => `${f(r.n)}·${f(r.E)}`).join(' + ')} = ${vv(m)}<br>σ²(y) = Σ n<sub>i</sub>·σ²(y<sub>i</sub>) = ${rows.map(r => `${f(r.n)}·${f(r.s)}²`).join(' + ')} = ${f(v2)} ⇒ σ(y) = ${vv(s)}`) +
        `Por tanto y ∼ N(${f(m)}; ${f(s)}).`;
      return { D, ex, normal: true, m, s, kind: 'normal' };
    }
    if (k === 'cont') {
      const b = buildFam(V, p + 'c_', CF);
      return { D: b.D, ex: b.ex, normal: b.fam === 'normal', m: b.D.mean, s: b.D.sd, kind: b.fam };
    }
    if (k === 'compuesta') {
      const N = buildFam(V, p + 'N_', FR), S = buildFam(V, p + 'S_', CF);
      const d = V.nOpt(p + 'd') || 0, L = V.nOpt(p + 'L'), F = V.nOpt(p + 'F');
      const r = T.compound({ freq: N.D, sev: S.D, d, L, F });
      let ex = `Frecuencia: ${N.ex}<br>Severidad: ${S.ex}`;
      if (d || L !== null || F !== null) ex += `<br>Modificaciones: ${d ? 'franquicia por siniestro ' + f(d) + '; ' : ''}${L !== null ? 'indemnización máxima por siniestro ' + f(L) + '; ' : ''}${F !== null ? 'indemnización máxima anual ' + f(F) : ''}.`;
      ex += `<br>Distribución de y por discretización de la severidad (paso h = ${f(r.h, 4)}) y composición exacta (equivalente al método de Panjer, ec. 65): 𝔼(y) = ${f(r.dist.mean)}, σ(y) = ${f(r.dist.sd)}.`;
      return { D: r.dist, ex, normal: false, m: r.dist.mean, s: r.dist.sd, kind: 'compuesta' };
    }
    if (k === 'discreta') { const b = DF.discreta.build(V, p + 'y'); return { D: b.D, ex: b.ex, normal: false, m: b.D.mean, s: b.D.sd, kind: 'discreta' }; }
    throw new Error('Origen de y no reconocido.');
  }

  /* ───────── Reaseguro: explicación de capas ───────── */
  function slFormula(src, U) {
    const D = src.D;
    if (src.normal) {
      const z = (U - src.m) / src.s;
      return `𝔼((y − ${f(U)})<sup>+</sup>) = s·φ((U − m)/s) + (m − U)(1 − Φ((U − m)/s)) = ${f(src.s)}·φ(${f(z, 6)}) + (${f(src.m - U)})·${f(T.Phi(-z), 8)} = ${vv(D.SL(U))}`;
    }
    return `𝔼((y − ${f(U)})<sup>+</sup>) = ${vv(D.SL(U))}`;
  }
  function layerFormula(src, sp, U, val) {
    if (src.normal && sp.type === 'CVaR') {
      const va = src.D.VaR(sp.mu);
      if (va >= U) return `CVaR<sub>${T.fmtPctLevel(1 - sp.mu)}</sub>(−(y − ${f(U)})<sup>+</sup>) = (s/μ)·φ(Φ<sup>−1</sup>(μ)) + m − U = ${vv(val)} (pues VaR = ${f(va)} ≥ U)`;
      return `CVaR<sub>${T.fmtPctLevel(1 - sp.mu)}</sub>(−(y − ${f(U)})<sup>+</sup>) = 𝔼((y − U)<sup>+</sup>)/μ = ${vv(val)} (pues VaR = ${f(va)} < U)`;
    }
    return `${rn(sp, '−(y − ' + f(U) + ')<sup>+</sup>')} = ${vv(val)}`;
  }

  return { CF, CF_ALL, CF_POS, DF, FR, MEAS, famFields, buildFam, withShow, measFields, buildMeas, specOf, usesLvl, usesA, usesMu, std01Explain, genExplain, srcFields, buildSrc, slFormula, layerFormula, rn };
})();
