/* ════════════════════════════════════════════════════════════════
   TEMAS Y EJERCICIOS (temas 1–5 del resumen teórico)
   ════════════════════════════════════════════════════════════════ */
'use strict';
(function () {
  const T = TNV, f = T.fmt, eq = UI.eq, vv = UI.v;
  const pct = x => T.fmtPct(x);
  const rn = P.rn;
  const MK = t => ({ VaR: 'var31', CVaR: 'cvar33', WCVaR: 'wcvar34', Expectil: 'exp43', Wang: 'dist35', DPT: 'dist35', SW: 'spec40', SDPT: 'spec40', SPow: 'spec40' })[t];

  /* ═════════ TEMAS ═════════ */
  UI.tema({
    n: 1, short: 'Continuas', title: 'Distribuciones continuas', color: 'var(--t1)',
    desc: 'Normal, log-normal, Wald, gamma (exponencial, Erlang, χ²), beta, valores extremos (Gumbel, Fréchet, Weibull), Pareto, Pareto generalizada y t de Student. Sirven para la severidad o para el coste agregado.',
    formulas: [
      ['Normal', 'ỹ = (y − m)/s ∼ N(0,1); y = m + sỹ (ec. 2)'],
      ['Log-normal (6)', '𝔼(y) = e<sup>m+s²/2</sup>; σ²(y) = (e<sup>s²</sup> − 1)e<sup>2m+s²</sup>'],
      ['Log-normal (7)', 's² = log(σ²/𝔼² + 1); m = log 𝔼 − s²/2'],
      ['Gamma (12)', '𝔼 = αβ; σ² = αβ². Suma de gammas de igual β: Gamma(Σαᵢ, β)'],
      ['Exponencial', 'F(x) = 1 − e<sup>−x/β</sup>; se autorreplica en cola: (y − s)|y > s ∼ y'],
      ['Pareto (14–17)', 'F(x) = 1 − (β/(x+β))<sup>α</sup>; 𝔼 = β/(α−1); σ² = αβ²/((α−1)²(α−2)); (y − s)|y > s ∼ Pareto(α, β + s)'],
      ['Wald', '𝔼 = m; σ² = m³/β'],
      ['Beta (13)', '𝔼 = u/(u+v); σ² = uv/((u+v+1)(u+v)²)']
    ]
  });
  UI.tema({
    n: 2, short: 'Discretas', title: 'Distribuciones discretas', color: 'var(--t2)',
    desc: 'Modelos para la frecuencia N (número de siniestros): binomial, Poisson, binomial negativa y geométrica.',
    formulas: [
      ['Binomial (23)', 'IP(N = x) = C(n,x)pˣ(1−p)<sup>n−x</sup>; 𝔼 = np; σ² = np(1−p)'],
      ['Poisson', 'IP(N = x) = e<sup>−λ</sup>λˣ/x!; 𝔼 = σ² = λ. Suma de Poisson indep.: Poisson(Σλᵢ)'],
      ['Binomial negativa (24)', 'IP(N = x) = Γ(x+α)/(Γ(α)x!)·θ<sup>α</sup>(1−θ)ˣ; 𝔼 = α(1−θ)/θ; σ² = α(1−θ)/θ²'],
      ['Geométrica', 'BN con α = 1'],
      ['Poisson–Gamma (29)', 'λ ∼ Gamma(α, β), N|λ ∼ Poisson(λ) ⇒ N ∼ BN(α, θ = 1/(1+β)); índice de mixtura β'],
      ['Clase (c, d, 0)', 'IP(N = x) = (c + d/x)·IP(N = x−1): Poisson c = 0, d = λ; BN c = 1−θ, d = (1−θ)(α−1)']
    ]
  });
  UI.tema({
    n: 3, short: 'Compuestas y mixturas', title: 'Distribuciones compuestas y mixturas', color: 'var(--t3)',
    desc: 'Coste agregado y = S₁ + … + S<sub>N</sub> (frecuencia × severidad), con franquicias e indemnizaciones máximas, prima, probabilidad de pérdida y riesgo. Mixturas e índice de mixtura.',
    formulas: [
      ['Compuesta (26)', '𝔼(y) = 𝔼(N)𝔼(S); σ²(y) = 𝔼(N)σ²(S) + σ²(N)𝔼(S)²'],
      ['Mixtura (27)', '𝔼(y) = 𝔼(𝔼(y|Λ)); σ²(y) = 𝔼(σ²(y|Λ)) + σ²(𝔼(y|Λ))'],
      ['Índice de mixtura (28)', 'I = σ²(𝔼(y|Λ))/𝔼(σ²(y|Λ)); composición: I = σ²(N)𝔼(S)²/(𝔼(N)σ²(S))'],
      ['Franquicia d', 'cada siniestro paga (S − d)<sup>+</sup>'],
      ['Indemnización máxima L', 'cada siniestro paga min{S, L}; anual: min{y, F}'],
      ['Prima', 'Π(y) = a·𝔼(y) + b·ρ(−y); riesgo del asegurador ρ(Π(y) − y) = ρ(−y) − Π(y)']
    ]
  });
  UI.tema({
    n: 4, short: 'Medidas de riesgo', title: 'Medidas de riesgo', color: 'var(--t4)',
    desc: 'VaR, CVaR, CVaR ponderado, distorsiones (Wang, DPT), medidas espectrales (SWₐ, SDPTₐ), expectiles, entrópica y ρσ; riesgo de normales y log-normales. Convención: y es la pérdida (indemnización) y se calcula ρ(−y).',
    formulas: [
      ['Normal (44)', 'ρ(−y) = m + ρ<sub>(0,1)</sub>·s'],
      ['VaR, CVaR normal (45)', 'VaR<sub>1−μ</sub> = Φ<sup>−1</sup>(1−μ); CVaR<sub>1−μ</sub> = φ(Φ<sup>−1</sup>(μ))/μ'],
      ['CVaR (33)', 'CVaR<sub>1−μ</sub> = (1/μ)∫₀<sup>μ</sup> VaR<sub>1−t</sub> dt = VaR + 𝔼((y − VaR)<sup>+</sup>)/μ'],
      ['Distorsión (35)', 'ρ<sub>g</sub> = ∫₀¹ VaR<sub>1−t</sub> g′(t)dt; Wang: g(t) = Φ(Φ<sup>−1</sup>(t) + a); DPT: g(t) = 1 − (1 − t)<sup>a</sup>'],
      ['Espectral (40)', 'ρ = ∫₀¹ CVaR<sub>1−t</sub> g′(t)dt (SWₐ y SDPTₐ)'],
      ['Expectil (42–43)', 'μ𝔼((y − x)<sup>+</sup>) = (1−μ)𝔼((x − y)<sup>+</sup>); 𝔈<sub>μ</sub> = −E<sub>μ</sub>, 0 < μ ≤ 1/2'],
      ['Log-normal (49)', 'VaR<sub>1−μ</sub>(−y) = e<sup>m+sΦ⁻¹(1−μ)</sup>; CVaR<sub>1−μ</sub>(−y) = (e<sup>m+s²/2</sup>/μ)[1 − Φ(Φ<sup>−1</sup>(1−μ) − s)]'],
      ['Entrópica', 'ℰ<sub>μ</sub>(y) = (1/μ)log 𝔼(e<sup>−μy</sup>); normal: m + μs²/2 (pérdidas)'],
      ['Cota (56)', 'CVaR<sub>1−ν</sub> ≤ 𝔈<sub>μ</sub> + μ(𝔼(y) + 𝔈<sub>μ</sub>(y))/(ν(1−2μ))']
    ]
  });
  UI.tema({
    n: 5, short: 'Reaseguro', title: 'Reaseguro', color: 'var(--t5)',
    desc: 'Cuota-parte, stop-loss y reaseguros mixtos y<sub>c</sub> = Σ aᵢ(y − Uᵢ)<sup>+</sup>; comonotonía, riesgo cedido y retenido, prima del reaseguro y prima de la cartera.',
    formulas: [
      ['Descomposición (58)', 'y = y<sub>r</sub> + y<sub>c</sub>'],
      ['Cuota-parte', 'y<sub>c</sub> = αy; y<sub>r</sub> = (1−α)y'],
      ['Stop-loss', 'y<sub>c</sub> = (y − U)<sup>+</sup>; y<sub>r</sub> = min{y, U}'],
      ['Mixto (59)', 'y<sub>c</sub> = Σ aᵢ(y − Uᵢ)<sup>+</sup>, U₁ = 0 es la cuota-parte'],
      ['Comonotonía', '0 ≤ a₁ + … + aₖ ≤ 1 para todo k (pendientes de y<sub>c</sub> y de y<sub>r</sub> entre 0 y 1)'],
      ['Aditividad (tema 8)', 'ρ(−y<sub>c</sub>) = Σ aᵢρ(−(y − Uᵢ)<sup>+</sup>) si ρ es comonótona aditiva y homogénea'],
      ['Prima de la cartera (71)', 'Π = ρ(−y) − R₀; con reaseguro: ρ(−y) − R₀ + (Π<sub>r</sub> − ρ(−y<sub>c</sub>))']
    ]
  });
  UI.tema({ n: 99, short: 'Próximamente', offLabel: '11–13', title: '', color: 'var(--faint)', off: true });

  /* ═════════ Utilidades comunes ═════════ */
  const level = sp => T.fmtPctLevel(1 - sp.mu);
  // «VaR 95; CVaR 95; SW 1; Expectil 0,3» → especificaciones de medidas
  const MEAS_ALIAS = { var: 'VaR', cvar: 'CVaR', sw: 'SW', wang: 'Wang', w: 'Wang', dpt: 'DPT', sdpt: 'SDPT', expectil: 'Expectil', e: 'Expectil', entropica: 'Entropica', spow: 'SPow' };
  function parseMeasList(str) {
    return String(str || '').split(/[;|\n]+/).map(x => x.trim()).filter(Boolean).map(tok => {
      const m = tok.match(/^([A-Za-zñÑáéíóú𝔈]+)\s*[_ ]?\s*([−\-+]?[\d.,]+)\s*%?$/);
      if (!m) throw new Error(`No entiendo la medida «${tok}». Escribe p. ej. «VaR 95; CVaR 95; SW 1».`);
      const t = MEAS_ALIAS[m[1].toLowerCase().replace('𝔈', 'e')];
      if (!t) throw new Error(`Medida desconocida «${m[1]}». Usa VaR, CVaR, SW, Wang, DPT, SDPT o Expectil.`);
      return P.specOf(t, T.parseNum(m[2]), `«${tok}»`);
    });
  }
  function normalCartera(n, E, sd, sp, Pi) {
    // aproximación normal de la cartera de n pólizas (TCL, tema 6)
    const mN = n * E, sN = Math.sqrt(n) * sd;
    const r01 = T.rhoStd(sp);
    const rhoN = sp.type === 'Entropica' ? mN + sp.mu * sN * sN / 2 : mN + r01 * sN;
    return { mN, sN, r01, rhoN, ploss: Pi !== null ? T.Phi(-(n * Pi - mN) / sN) : null };
  }

  /* ═════════ T1 · Distribución continua ═════════ */
  UI.tool({
    id: 't1-dist', tema: 1, title: 'Momentos, probabilidades y cuantiles',
    short: 'Parámetros ↔ media y desviación, F(x), percentiles, exceso sobre un umbral.',
    cuando: 'te dan una severidad o un coste continuo (p. ej. «log-normal de media 1000 y desviación 250») y necesitas sus parámetros, probabilidades o percentiles.',
    que: 'Identifica la distribución continua del enunciado, pasa de sus parámetros a su media y desviación (o al revés) con las fórmulas del tema 1, y calcula probabilidades F(x), percentiles y lo que queda por encima de un umbral (útil para franquicias, límites y stop-loss).',
    groups: [
      { title: 'Distribución', fields: P.famFields('d_', P.CF, P.CF_ALL, 'lognormal') },
      {
        title: 'Consultas (opcionales)', fields: [
          { id: 'x', type: 'num', label: 'Valor x para F(x) = IP(y ≤ x)', def: '', ph: 'opcional' },
          { id: 'p', type: 'num', label: 'Probabilidad p para el cuantil', def: '0,95', help: 'Admite 0,95 o 95 %' },
          { id: 's', type: 'num', label: 'Umbral s (exceso, franquicia, límite)', def: '', ph: 'opcional', help: 'Calcula 𝔼((y − s)⁺), 𝔼(min{y, s}) y la cola por encima de s' }
        ]
      }
    ],
    solve(V, { result }) {
      const R = result();
      const b = P.buildFam(V, 'd_', P.CF), D = b.D;
      R.tile('𝔼(y)', D.mean, { main: true }).tile('σ(y)', D.sd, { main: true }).tile('σ²(y)', D.var).tile('Coef. de variación σ/𝔼', D.sd / D.mean);
      R.step('Identificación de la distribución', b.ex);
      R.key('E', D.mean).key('sd', D.sd);
      R.uses(b.fam === 'normal' ? 'norm2' : b.fam === 'lognormal' ? 'ln67' : (b.fam === 'gamma' || b.fam === 'exponencial') ? 'gam12' : b.fam === 'pareto' ? 'par17' : null);
      R.ans('Distribución.', `${b.ex} Por tanto, 𝔼(y) = ${vv(D.mean)} y σ(y) = ${vv(D.sd)}.`);
      const x = V.nOpt('x');
      if (x !== null) {
        const F = D.cdf(x);
        R.tile(`F(${f(x)}) = IP(y ≤ ${f(x)})`, F).tile(`IP(y > ${f(x)})`, 1 - F);
        let extra = '';
        if (b.fam === 'normal') extra = `IP(y ≤ x) = Φ((x − m)/s) = Φ(${f((x - D.mean) / D.sd, 8)})`;
        else if (b.fam === 'lognormal') extra = `IP(y ≤ x) = Φ((log x − m)/s) = Φ(${f((Math.log(x) - D.mu) / D.sg, 8)})`;
        else if (b.fam === 'exponencial') extra = `IP(y ≤ x) = 1 − e<sup>−x/β</sup> (ec. 11)`;
        else if (b.fam === 'pareto') extra = `IP(y ≤ x) = 1 − (β/(x+β))<sup>α</sup> (ec. 15)`;
        R.step('Función de distribución', (extra ? eq(extra + ` = ${vv(F)}`) : '') + `IP(y > ${f(x)}) = 1 − F(${f(x)}) = ${vv(1 - F)}` + (D.pdf ? `; densidad f(${f(x)}) = ${f(D.pdf(x))}` : ''));
        R.key('F', F);
        R.ans('Probabilidad.', `${extra ? extra + ' = ' + vv(F) : 'F(' + f(x) + ') = ' + vv(F)}, es decir, IP(y ≤ ${f(x)}) = ${vv(F)} e IP(y > ${f(x)}) = ${vv(1 - F)}.`);
      }
      let p = V.nOpt('p');
      if (p !== null) {
        if (p >= 1) p /= 100;
        if (!(p > 0 && p < 1)) throw new Error('La probabilidad p debe estar entre 0 y 1.');
        const q = D.q(p);
        R.tile(`Cuantil al ${T.fmtPctLevel(p)}`, q);
        let how = 'inversión numérica de F';
        if (b.fam === 'normal') how = `m + s·Φ<sup>−1</sup>(p) = ${f(D.mean)} + ${f(D.sd)}·${f(T.PhiInv(p), 8)}`;
        else if (b.fam === 'lognormal') how = `e<sup>m + sΦ⁻¹(p)</sup> = e<sup>${f(D.mu, 8)} + ${f(D.sg, 8)}·${f(T.PhiInv(p), 8)}</sup>`;
        else if (b.fam === 'exponencial') how = `−β·log(1 − p)`;
        else if (b.fam === 'pareto') how = `β((1 − p)<sup>−1/α</sup> − 1)`;
        R.step(`Cuantil (percentil ${T.fmtPctLevel(p)})`, eq(`F<sup>−1</sup>(${f(p)}) = ${how} = ${vv(q)}`) + `Coincide con VaR<sub>${T.fmtPctLevel(p)}</sub>(−y) si y es una pérdida (ec. 31).`);
        R.key('q', q); R.uses('var31');
        R.ans('Percentil.', `El percentil ${T.fmtPctLevel(p)} es F<sup>−1</sup>(${f(p)}) = ${how} = ${vv(q)}${p > 0.5 ? `, que coincide con VaR<sub>${T.fmtPctLevel(p)}</sub>(−y) si y representa pérdidas` : ''}.`);
      }
      const s = V.nOpt('s');
      if (s !== null) {
        const sl = D.SL(s), sf = D.sf ? D.sf(s) : 1 - D.cdf(s);
        R.tile(`𝔼((y − ${f(s)})<sup>+</sup>)`, sl).tile(`𝔼(min{y, ${f(s)}})`, D.mean - sl).tile(`𝔼(y − s | y > s)`, sl / sf);
        let auto = '';
        if (b.fam === 'exponencial') auto = `Autorréplica (prop. 1.3.2.2): (y − s)|y > s es otra exponencial de media ${f(D.mean)}.`;
        if (b.fam === 'pareto') auto = `Prop. 1.6.1: (y − s)|y > s es Pareto(α = ${f(D.al)}; β + s = ${f(D.be + s)}), de media ${f((D.be + s) / (D.al - 1))}.`;
        if (b.fam === 'gpd') auto = `Prop. 1.7.1: (y − s)|y > s es Pareto generalizada(ξ = ${f(D.xi)}; ξs + η = ${f(D.xi * s + D.eta)}).`;
        R.step(`Umbral s = ${f(s)}`, eq(`𝔼((y − s)<sup>+</sup>) = ${vv(sl)} &nbsp; (lo que paga una franquicia s, o un stop-loss de prioridad s)`) +
          eq(`𝔼(min{y, s}) = 𝔼(y) − 𝔼((y − s)<sup>+</sup>) = ${vv(D.mean - sl)} &nbsp; (indemnización máxima s)`) +
          eq(`IP(y > s) = ${vv(sf)}; &nbsp; 𝔼(y − s | y > s) = 𝔼((y − s)<sup>+</sup>)/IP(y > s) = ${vv(sl / sf)}`) + auto);
        R.key('sl', sl);
        R.ans(`Umbral ${f(s)}.`, `Por encima de s = ${f(s)} se tiene 𝔼((y − ${f(s)})<sup>+</sup>) = ${vv(sl)} (lo que pagaría una franquicia o un stop-loss de prioridad ${f(s)}), 𝔼(min{y, ${f(s)}}) = 𝔼(y) − 𝔼((y − ${f(s)})<sup>+</sup>) = ${vv(D.mean - sl)} e IP(y > ${f(s)}) = ${vv(sf)}. ${auto}`);
      }
      const ps = [0.5, 0.75, 0.9, 0.95, 0.99, 0.995];
      R.table('Percentiles', ['p', 'F<sup>−1</sup>(p)'], ps.map(q => [T.fmtPctLevel(q), D.q(q)]));
      return R;
    },
    examples: [
      { id: 'j26', label: 'Junio 2026 · Ej. 2 · severidad log-normal (1000; 250)', values: { d_fam: 'lognormal', d_lognormal_mode: 'mom', d_lognormal_mom_E: '1000', d_lognormal_mom_sd: '250', s: '1200' } },
      { id: 'j23', label: 'Junio 2023 · Ej. 2 · severidad log-normal (100; 150)', values: { d_fam: 'lognormal', d_lognormal_mode: 'mom', d_lognormal_mom_E: '100', d_lognormal_mom_sd: '150' } },
      { id: 'j24', label: 'Junio 2024 · Ej. 3 · suma de 3 exponenciales de media 70', values: { d_fam: 'gamma', d_gamma_mode: 'sum', d_gamma_sum_k: '3', d_gamma_sum_b: '70', s: '100' } },
      { id: 'j25', label: 'Junio 2025 · Ej. 3 · exponencial de media 100 con franquicia 95', values: { d_fam: 'exponencial', d_exponencial_p_b: '100', s: '95' } }
    ]
  });

  /* ═════════ T1 · Sumas ═════════ */
  UI.tool({
    id: 't1-suma', tema: 1, title: 'Sumas de variables independientes',
    short: 'Combinaciones de normales, sumas de gammas o exponenciales (Erlang).',
    cuando: 'el enunciado suma variables: varias carteras normales independientes, «suma de dos exponenciales», etc.',
    que: 'Obtiene la distribución de una suma de variables independientes: una combinación lineal de normales sigue siendo normal (se suman medias y varianzas) y la suma de gammas con la misma escala β es otra gamma (Erlang si los α son enteros).',
    groups: [
      { title: 'Tipo de suma', fields: [{ id: 'tipo', type: 'sel', label: 'Variables', def: 'normal', opts: [['normal', 'Normales independientes: Σ cᵢ·yᵢ'], ['gamma', 'Gammas independientes con el mismo β']], wide: true }] },
      {
        title: 'Variables', fields: [
          { id: 'nr', type: 'rows', label: 'Normales N(mᵢ; sᵢ) con coeficiente cᵢ', cols: [{ id: 'c', label: 'cᵢ', def: '1' }, { id: 'm', label: 'mᵢ' }, { id: 's', label: 'sᵢ' }], def: [{ c: '1', m: '2.450.000', s: '221.359,4362' }, { c: '1', m: '1.500.000', s: '134.164,0786' }], show: v => v.tipo === 'normal' },
          { id: 'gr', type: 'rows', label: 'Gammas: parámetro αᵢ (exponencial ⇒ α = 1)', cols: [{ id: 'a', label: 'αᵢ' }], def: [{ a: '1' }, { a: '1' }], show: v => v.tipo === 'gamma' },
          { id: 'gb', type: 'num', label: 'β común (escala)', def: '100', show: v => v.tipo === 'gamma' }
        ]
      },
      { title: 'Consulta (opcional)', fields: [{ id: 'x', type: 'num', label: 'x para IP(suma ≤ x)', def: '', ph: 'opcional' }] }
    ],
    solve(V, { result }) {
      const R = result();
      let D;
      if (V.s('tipo') === 'normal') {
        const rows = V.rows('nr'); if (!rows.length) throw new Error('Añade al menos una normal.');
        const m = rows.reduce((a, r) => a + r.c * r.m, 0), v2 = rows.reduce((a, r) => a + r.c * r.c * r.s * r.s, 0);
        D = T.normal(m, Math.sqrt(v2));
        R.step('Combinación lineal de normales independientes (§1.1)', `Cualquier combinación lineal de normales independientes es normal:` +
          eq(`m = Σ cᵢmᵢ = ${rows.map(r => `${f(r.c)}·${f(r.m)}`).join(' + ')} = ${vv(m)}`) +
          eq(`s² = Σ cᵢ²sᵢ² = ${rows.map(r => `${f(r.c)}²·${f(r.s)}²`).join(' + ')} = ${f(v2)} ⇒ s = ${vv(Math.sqrt(v2))}`));
      } else {
        const rows = V.rows('gr'), be = V.n('gb', { pos: 1 }); if (!rows.length) throw new Error('Añade al menos una gamma.');
        const al = rows.reduce((a, r) => a + r.a, 0);
        D = T.gammaD(al, be);
        R.step('Suma de gammas de igual β (§1.4.5)', eq(`α = Σ αᵢ = ${rows.map(r => f(r.a)).join(' + ')} = ${vv(al)}, &nbsp; β = ${f(be)}`) + `La suma es Gamma(${f(al)}; ${f(be)})${Number.isInteger(al) ? ' — una Erlang' : ''}: 𝔼 = αβ = ${f(D.mean)}, σ² = αβ² = ${f(D.var)}.`);
      }
      R.uses(V.s('tipo') === 'normal' ? 'norm2' : 'gam12');
      R.tile('𝔼(suma)', D.mean, { main: true }).tile('σ(suma)', D.sd, { main: true }).tile('σ²(suma)', D.var);
      R.ans('', V.s('tipo') === 'normal' ? `Al ser una combinación lineal de normales independientes, la suma es normal de media ${vv(D.mean)} y desviación √(Σcᵢ²sᵢ²) = ${vv(D.sd)}, es decir, N(${f(D.mean)}; ${f(D.sd)}).` : `Al sumar gammas independientes con el mismo β = ${f(D.be)}, se obtiene una Gamma(α = ${f(D.al)}; β = ${f(D.be)}), con 𝔼 = αβ = ${vv(D.mean)} y σ = β√α = ${vv(D.sd)}.`);
      R.key('E', D.mean).key('sd', D.sd);
      const x = V.nOpt('x');
      if (x !== null) { R.tile(`IP(suma ≤ ${f(x)})`, D.cdf(x)); R.key('F', D.cdf(x)); }
      return R;
    },
    examples: [
      { id: 'e24', label: 'Enero 2024 · Ej. 2c · suma de las dos carteras (y + ỹ)', values: { tipo: 'normal', nr: [{ c: '1', m: '2.450.000', s: '221.359,4362' }, { c: '1', m: '1.500.000', s: '134.164,0786' }] } },
      { id: 'j24', label: 'Junio 2024 · Ej. 3 · suma de tres exponenciales de media 70', values: { tipo: 'gamma', gr: [{ a: '1' }, { a: '1' }, { a: '1' }], gb: '70' } }
    ]
  });

  /* ═════════ T2 · Frecuencia ═════════ */
  UI.tool({
    id: 't2-freq', tema: 2, title: 'Distribución de la frecuencia N',
    short: 'Probabilidades, media, varianza y parámetros de Panjer de Poisson, BN, geométrica o binomial.',
    cuando: 'necesitas IP(N = x), 𝔼(N), σ²(N), o pasar de una mixtura Poisson–Gamma a binomial negativa.',
    que: 'Describe el número de siniestros N: su media, su varianza y la tabla de probabilidades IP(N = x), junto con los parámetros (c, d) de la fórmula recurrente en la que se basa el método de Panjer.',
    groups: [
      { title: 'Frecuencia', fields: P.famFields('f_', P.FR, Object.keys(P.FR), 'binneg') },
      {
        title: 'Consultas (opcionales)', fields: [
          { id: 'x', type: 'num', label: 'Valor x para IP(N = x)', def: '', ph: 'opcional' },
          { id: 'kmax', type: 'num', label: 'Mostrar la tabla hasta x =', def: '', ph: 'automático' }
        ]
      }
    ],
    solve(V, { result }) {
      const R = result();
      const b = P.buildFam(V, 'f_', P.FR), N = b.D;
      R.tile('𝔼(N)', N.mean, { main: true }).tile('σ²(N)', N.var, { main: true }).tile('σ(N)', Math.sqrt(N.var)).tile('IP(N = 0)', N.pmf(0));
      R.step('Distribución de N', b.ex);
      R.key('E', N.mean).key('V', N.var).key('p0', N.pmf(0));
      R.uses(b.fam === 'poisson' ? 'pois' : b.fam === 'binneg' || b.fam === 'geometrica' ? 'nb24' : null); if (b.mode === 'pg') R.uses('pg29');
      R.ans('', `${b.ex} La probabilidad de no tener siniestros es IP(N = 0) = ${vv(N.pmf(0))}.`);
      if (N.ab) R.step('Fórmula recurrente (clase (c, d, 0), base del método de Panjer)', eq(`IP(N = x) = (c + d/x)·IP(N = x − 1), &nbsp; c = ${vv(N.ab.c)}, d = ${vv(N.ab.d)}`));
      const x = V.nOpt('x');
      if (x !== null) {
        const px = N.pmf(Math.round(x)), Fx = N.cdf(x);
        R.tile(`IP(N = ${f(x)})`, px).tile(`IP(N ≤ ${f(x)})`, Fx).tile(`IP(N > ${f(x)})`, 1 - Fx);
        R.key('px', px);
        R.ans('', `Además, IP(N = ${f(x)}) = ${vv(px)}, IP(N ≤ ${f(x)}) = ${vv(Fx)} e IP(N > ${f(x)}) = ${vv(1 - Fx)}.`);
      }
      let km = V.nOpt('kmax');
      if (km === null) { km = 0; let c = 0; while (c < 0.9999 && km < 40) { c += N.pmf(km); km++; } km = Math.max(km - 1, 5); }
      km = Math.min(200, Math.round(km));
      const rows = []; let c = 0;
      for (let k = 0; k <= km; k++) { const p = N.pmf(k); c += p; rows.push([String(k), p, c, Math.max(0, 1 - c)]); }
      R.table('Tabla de probabilidades', ['x', 'IP(N = x)', 'IP(N ≤ x)', 'IP(N > x)'], rows);
      return R;
    },
    examples: [
      { id: 'j26', label: 'Junio 2026 · Ej. 2 · BN(α = 1; θ = 0,4)', values: { f_fam: 'binneg', f_binneg_mode: 'p', f_binneg_p_a: '1', f_binneg_p_th: '0,4' } },
      { id: 'e26', label: 'Enero 2026 · Ej. 2 · λ ∼ Gamma(1; 2), N|λ Poisson', values: { f_fam: 'binneg', f_binneg_mode: 'pg', f_binneg_pg_a: '1', f_binneg_pg_b: '2' } },
      { id: 'j24', label: 'Junio 2024 · Ej. 4 · λ ∼ Gamma(5; 0,1), N|λ Poisson', values: { f_fam: 'binneg', f_binneg_mode: 'pg', f_binneg_pg_a: '5', f_binneg_pg_b: '0,1' } }
    ]
  });

  UI.tool({
    id: 't2-suma', tema: 2, title: 'Suma de frecuencias independientes',
    short: 'Poisson + Poisson, BN de igual θ, binomiales de igual p.',
    cuando: 'agregas carteras o tipos de pólizas cuya frecuencia es de la misma familia.',
    que: 'Suma frecuencias independientes de la misma familia, que se mantiene: Poisson con Poisson, binomial negativa con el mismo θ, binomial con el mismo p.',
    groups: [
      { title: 'Familia', fields: [{ id: 'tipo', type: 'sel', label: 'Frecuencias', def: 'poisson', opts: [['poisson', 'Poisson(λᵢ)'], ['binneg', 'Binomial negativa(αᵢ; θ) con θ común'], ['binomial', 'Binomial(nᵢ; p) con p común']], wide: true }] },
      {
        title: 'Sumandos', fields: [
          { id: 'rows', type: 'rows', label: 'Parámetro de cada sumando (λᵢ, αᵢ o nᵢ)', cols: [{ id: 'k', label: 'Parámetro' }], def: [{ k: '0,5' }, { k: '1,2' }] },
          { id: 'th', type: 'num', label: 'θ común', def: '0,5', show: v => v.tipo === 'binneg' },
          { id: 'p', type: 'num', label: 'p común', def: '0,1', show: v => v.tipo === 'binomial' }
        ]
      }
    ],
    solve(V, { result }) {
      const R = result(); const rows = V.rows('rows'); const s = rows.reduce((a, r) => a + r.k, 0); const t = V.s('tipo');
      let N, txt;
      if (t === 'poisson') { N = T.poisson(s); txt = `La suma de Poisson independientes es Poisson de parámetro Σλᵢ = ${vv(s)} (§2.2).`; }
      else if (t === 'binneg') { const th = V.n('th', { prob: 1 }); N = T.negbin(s, th); txt = `La suma de BN independientes con el mismo θ es BN(Σαᵢ = ${vv(s)}; θ = ${f(th)}) (§2.3.1).`; }
      else { const p = V.n('p', { prob: 1 }); N = T.binomial(s, p); txt = `La suma de binomiales independientes con el mismo p es Bin(Σnᵢ = ${vv(s)}; p = ${f(p)}).`; }
      R.step('Distribución de la suma', txt);
      R.uses(t === 'poisson' ? 'pois' : t === 'binneg' ? 'nb24' : null);
      R.ans('', `${txt} Por tanto 𝔼(N) = ${vv(N.mean)} y σ²(N) = ${vv(N.var)}.`);
      R.tile('𝔼(N)', N.mean, { main: true }).tile('σ²(N)', N.var, { main: true }).tile('IP(N = 0)', N.pmf(0));
      R.key('E', N.mean).key('V', N.var);
      return R;
    }
  });

  /* ═════════ T3 · Coste agregado ═════════ */
  UI.tool({
    id: 't3-agregado', tema: 3, title: 'Coste agregado: frecuencia × severidad', tag: 'el más frecuente',
    short: 'Media, desviación, CVaR, prima, probabilidad de pérdida; franquicias e indemnizaciones máximas; cartera de n pólizas.',
    cuando: '«La frecuencia es … y la severidad es …». Sirve para los apartados de media, desviación, CVaR, prima, riesgo del asegurador, probabilidad de perder dinero y n mínimo de pólizas.',
    que: 'Construye la indemnización anual de una póliza y = S₁ + … + S<sub>N</sub> (composición de frecuencia y severidad, tema 3). La media y la desviación salen de la fórmula (26); el CVaR (o la medida elegida) necesita la distribución completa de y, que se obtiene discretizando la severidad y componiendo de forma exacta (equivale al método de Panjer; el profesor usa Monte Carlo). Con ello se calculan la prima, el riesgo que asume el asegurador y la probabilidad de perder dinero.',
    groups: [
      { title: 'Frecuencia N', fields: P.famFields('N_', P.FR, Object.keys(P.FR), 'binneg') },
      { title: 'Severidad S', fields: P.famFields('S_', P.CF, P.CF_POS.concat(['mixtura', 'constante', 'discreta']), 'lognormal') },
      {
        title: 'Franquicia e indemnizaciones máximas', optional: true, openIf: v => v.d || v.L || v.F || v.Dg, fields: [
          { id: 'd', type: 'num', label: 'Franquicia por siniestro d', def: '', ph: 'sin franquicia', help: 'Cada siniestro paga (S − d)⁺' },
          { id: 'L', type: 'num', label: 'Indemnización máx. por siniestro', def: '', ph: 'sin límite', help: 'Cada siniestro paga min{S, L}' },
          { id: 'F', type: 'num', label: 'Indemnización máx. anual F', def: '', ph: 'sin límite', help: 'Se paga min{y, F}', wide: true },
          { id: 'Dg', type: 'num', label: 'Franquicia sobre el coste anual D: se paga (y − D)⁺', def: '', ph: 'sin franquicia anual', help: '«Franquicia igual a 5» aplicada al coste agregado: calcula todo también para (y − D)⁺', wide: true }
        ]
      },
      {
        title: 'Medida de riesgo y principio de prima', fields: [
          ...P.measFields('m_'),
          { id: 'info_p', type: 'info', html: 'Π(y) = a·𝔼(y) + b·ρ(−y). &nbsp;Ej.: 1,05·𝔼(y) + 0,1·CVaR<sub>99%</sub>(−y) ⇒ a = 1,05, b = 0,1. Sin prima: b = 0.' },
          { id: 'A', type: 'num', label: 'a (coeficiente de 𝔼(y))', def: '1,05' },
          { id: 'B', type: 'num', label: 'b (coeficiente de ρ(−y))', def: '0,1' },
          { id: 'A2', type: 'num', label: 'Segunda prima Π₂: a₂', def: '', ph: 'opcional', help: 'Si el enunciado da dos principios (Π₁ y Π₂)' },
          { id: 'B2', type: 'num', label: 'Segunda prima Π₂: b₂', def: '', ph: 'opcional' },
          { id: 'refP', type: 'num', label: 'Prima de referencia (a priori)', def: '', ph: 'opcional', help: 'Calcula el % de reducción/recargo de Π frente a ella', wide: true },
          { id: 'eps', type: 'num', label: 'Objetivo IP(pérdida) ≤ ε ⇒ k mínimo', def: '', ph: 'opcional (p. ej. 20 %)', help: 'Calcula el k mínimo de Π = (1+k)𝔼(y) + b·ρ(−y)', wide: true },
          { id: 'gfrac', type: 'num', label: 'IP(ganar al menos esta fracción de Π)', def: '', ph: 'p. ej. 0,5', help: 'IP(Π − y ≥ f·Π) = IP(y ≤ (1 − f)Π)' },
          { id: 'ncond', type: 'num', label: 'Condicionar a N = n y a N ≤ n', def: '', ph: 'p. ej. 1', help: 'IP(ganar | N = n) e IP(ganar | N ≤ n); usa la fracción anterior si la hay' },
          { id: 'extra', type: 'text', label: 'Otras medidas a calcular', def: '', ph: 'p. ej. VaR 95; CVaR 95; SW 1', help: 'Se calculan para y (y para (y − D)⁺ si hay franquicia anual)', wide: true },
          { id: 'lossF', type: 'num', label: 'IP(pérdidas > f·Π): f =', def: '', ph: 'p. ej. 0,85', help: 'Pérdidas = y − Π; IP(y − Π > f·Π) = IP(y > (1 + f)Π)' },
          { id: 'panjP', type: 'num', label: 'Panjer: hasta U con IP(y > U) ≤', def: '', ph: 'p. ej. 0,3', help: 'Sólo con severidad discreta: tabla de Panjer hasta ese umbral', wide: true }
        ]
      },
      {
        title: 'Cartera de n pólizas independientes (riesgo individual y colectivo)', optional: true, openIf: v => v.n || v.epsN, fields: [
          { id: 'n', type: 'num', label: 'Número de pólizas n', def: '', ph: 'opcional' },
          { id: 'epsN', type: 'num', label: 'ε para el n mínimo', def: '', ph: 'p. ej. 5 %', help: 'n mínimo con IP(pérdida) ≤ ε y con ρ(nΠ − Y) ≤ 0' },
          { id: 'nD', type: 'num', label: 'De ellas, con la franquicia anual D', def: '', ph: 'p. ej. 2500 (la mitad)', help: 'Necesita la franquicia anual D del grupo de arriba' },
          { id: 'colOn', type: 'check', label: 'Riesgo colectivo: distribución exacta de la cartera (sin aproximar por la normal) y comparación', def: false, wide: true },
          { id: 'mkOn', type: 'check', label: 'La cartera usa otra medida de riesgo', def: false, wide: true },
          ...P.withShow(P.measFields('mk_', { type: 'CVaR', lvl: '95' }, 'Medida de riesgo de la cartera'), v => v.mkOn)
        ]
      },
      {
        title: 'Contraste por Monte Carlo', optional: true, openIf: v => v.mc, fields: [
          { id: 'mc', type: 'check', label: 'Simular también por Monte Carlo (como el profesor)', def: false },
          { id: 'mcn', type: 'num', label: 'Nº de simulaciones', def: '100000' },
          { id: 'seed', type: 'num', label: 'Semilla', def: '12345' }
        ]
      }
    ],
    solve(V, { result }) {
      const R = result();
      const Nb = P.buildFam(V, 'N_', P.FR), Sb = P.buildFam(V, 'S_', P.CF);
      const d = V.nOpt('d') || 0, L = V.nOpt('L'), F = V.nOpt('F');
      if (d < 0) throw new Error('La franquicia no puede ser negativa.');
      if (L !== null && !(L > 0)) throw new Error('La indemnización máxima por siniestro debe ser positiva.');
      if (F !== null && !(F > 0)) throw new Error('La indemnización máxima anual debe ser positiva.');
      const Dg = V.nOpt('Dg'); if (Dg !== null && !(Dg > 0)) throw new Error('La franquicia anual debe ser positiva.');
      const sp = P.buildMeas(V, 'm_'); const A = V.n('A'), B = V.n('B');
      const mc = V.b('mc') ? { n: Math.min(2e6, Math.round(V.n('mcn', { pos: 1 }))), seed: Math.round(V.n('seed')) } : null;
      const r = T.compound({ freq: Nb.D, sev: Sb.D, d, L, F, mc });
      const D = r.dist;
      const Ey = F !== null ? D.mean : r.Ey, sdy = F !== null ? D.sd : r.sdy;
      const rho = T.risk(D, sp), Pi = A * Ey + B * rho, ploss = D.sf(Pi), p0 = r.Py0;
      const RN = rn(sp);
      R.tile('𝔼(y)', Ey, { main: true }).tile('σ(y)', sdy, { main: true }).tile(RN, rho, { main: true });
      if (A !== 1 || B !== 0) R.tile('Prima Π(y)', Pi, { main: true }).tile(`Riesgo ${rn(sp, 'Π(y) − y')}`, rho - Pi);
      R.tile('IP(pérdida) = IP(y > Π)', ploss, { hint: 'probabilidad de que la compañía pierda dinero' }).tile('IP(y = 0)', p0, { hint: 'se queda con el 100 % de la prima' });
      R.key('E', Ey).key('sd', sdy).key('rho', rho).key('prima', Pi).key('riesgo', rho - Pi).key('ploss', ploss).key('p0', p0);
      if (sp.type === 'CVaR') { const va = D.VaR(sp.mu); R.tiles.splice(3, 0, { l: `VaR<sub>${level(sp)}</sub>(−y)`, v: va }); R.key('var', va); }
      R.uses(Nb.fam === 'poisson' ? 'pois' : Nb.fam === 'binneg' || Nb.fam === 'geometrica' ? 'nb24' : null);
      if (Nb.mode === 'pg') R.uses('pg29');
      if (Sb.fam === 'mixtura') R.uses('mixt27');
      if (Sb.fam === 'lognormal') R.uses('ln67'); if (Sb.fam === 'gamma' || Sb.fam === 'exponencial') R.uses('gam12');
      R.uses('comp26'); if (d > 0 || L !== null || F !== null) R.uses('franq');

      R.step('Frecuencia N', Nb.ex);
      R.step('Severidad S', Sb.ex);
      const mods = d > 0 || L !== null;
      if (mods) {
        const pay = (d > 0 ? `(S − ${f(d)})<sup>+</sup>` : 'S');
        R.step('Indemnización por siniestro', `Cada siniestro paga P = ${L !== null ? `min{${pay}, ${f(L)}}` : pay}.` +
          eq(`𝔼(P) = ${vv(r.EP)}, &nbsp; σ²(P) = ${vv(r.VP)}${d > 0 ? `, &nbsp; IP(P = 0) = F<sub>S</sub>(${f(d)}) = ${f(r.P0pay)}` : ''}`) +
          (Sb.fam === 'exponencial' && d > 0 && L === null ? `Comprobación (autorréplica): 𝔼((S − d)<sup>+</sup>) = β·e<sup>−d/β</sup> = ${f(Sb.D.mean * Math.exp(-d / Sb.D.mean))}.` : ''));
      }
      const S_ = mods ? 'P' : 'S';
      R.step('Momentos del coste agregado (ec. 26)', eq(`𝔼(y) = 𝔼(N)·𝔼(${S_}) = ${f(r.EN)} × ${f(r.EP)} = ${vv(r.Ey)}`) +
        eq(`σ²(y) = 𝔼(N)σ²(${S_}) + σ²(N)𝔼(${S_})² = ${f(r.EN)} × ${f(r.VP)} + ${f(r.VN)} × ${f(r.EP)}² = ${f(r.Vy)} ⇒ σ(y) = ${vv(r.sdy)}`));
      if (F !== null) R.step(`Indemnización máxima anual F = ${f(F)}`, `La compañía paga min{y, F}:` + eq(`𝔼(min{y, F}) = 𝔼(y) − 𝔼((y − F)<sup>+</sup>) = ${f(r.Ey)} − ${f(r.Ey - D.mean)} = ${vv(D.mean)}; &nbsp; σ = ${vv(D.sd)}; &nbsp; IP(y ≥ F) = ${f(D.pAt(F))}`));
      R.step(`Riesgo ${RN}`, `No hay fórmula cerrada para la distribución de y. Se discretiza la severidad (paso h = ${f(r.h, 4)}) y se compone exactamente (resultado equivalente al de la fórmula de Panjer, ec. 65; el profesor lo estima por Monte Carlo con 100.000 simulaciones).` +
        eq(P.genExplain(sp, D, rho, 'compuesta')));
      if (A !== 1 || B !== 0) {
        R.step('Prima', eq(`Π(y) = ${f(A)}·𝔼(y) + ${f(B)}·${RN} = ${f(A)} × ${f(Ey)} + ${f(B)} × ${f(rho)} = ${vv(Pi)}`));
        R.step('Riesgo del asegurador tras cobrar la prima', eq(`${rn(sp, 'Π(y) − y')} = ${RN} − Π(y) = ${f(rho)} − ${f(Pi)} = ${vv(rho - Pi)}`) +
          'Por invarianza por traslaciones. ' + (rho - Pi > 0 ? 'Es positivo: póliza a póliza el asegurador asume un riesgo alto, pero lo acepta porque se mitiga diversificando con muchos asegurados; el riesgo conjunto de la cartera tras cobrar las primas debe ser nulo o negativo.' : 'Es ≤ 0: la prima cubre el riesgo de la póliza.'));
      }
      {
        const modTxt = mods ? ` Con ${d > 0 ? `una franquicia por siniestro de ${f(d)}` : ''}${d > 0 && L !== null ? ' y ' : ''}${L !== null ? `una indemnización máxima por siniestro de ${f(L)}` : ''}, cada siniestro paga P = ${L !== null ? `min{${d > 0 ? '(S − ' + f(d) + ')<sup>+</sup>' : 'S'}, ${f(L)}}` : `(S − ${f(d)})<sup>+</sup>`}, con 𝔼(P) = ${vv(r.EP)} y σ²(P) = ${vv(r.VP)}.` : '';
        R.ans('Media y desviación.', `${Nb.ex} ${Sb.ex}${modTxt} Por (26):` +
          eq(`𝔼(y) = 𝔼(N)𝔼(${S_}) = ${f(r.EN)} × ${f(r.EP)} = ${vv(r.Ey)}<br>σ(y) = √(𝔼(N)σ²(${S_}) + σ²(N)𝔼(${S_})²) = √(${f(r.EN)} × ${f(r.VP)} + ${f(r.VN)} × ${f(r.EP)}²) = ${vv(r.sdy)}`) +
          (F !== null ? `Como la compañía paga como máximo ${f(F)} al año, la indemnización es min{y, ${f(F)}}, de media ${vv(D.mean)} y desviación ${vv(D.sd)}.` : ''));
        R.uses(MK(sp.type)); if (r.unit && !(Nb.D.ab && F === null)) R.uses('panjer65');
        R.ans(`${RN}.`, `No existe fórmula cerrada para la distribución de y, así que hay que recurrir a métodos numéricos (método de Panjer tras discretizar la severidad, o simulación de Monte Carlo). Se obtiene ${RN} = ${vv(rho)}${sp.type === 'CVaR' ? ` (con VaR<sub>${level(sp)}</sub>(−y) = ${vv(D.VaR(sp.mu))})` : ''}.`);
        R.uses('mc72');
        R.ans('Modelo de simulación (si lo piden).', `Paso 1: generar una realización de N (${Nb.fam === 'poisson' ? 'Poisson' : Nb.fam === 'tabla' ? 'según su tabla' : 'binomial negativa'}). Paso 2: si N = 0, y = 0. Paso 3: si N > 0, generar S₁, …, S<sub>N</sub> independientes${Sb.fam === 'mixtura' ? ' (para cada siniestro se elige primero su tipo con sus probabilidades y después se genera su severidad, p. ej. log-normal S = e<sup>m+sZ</sup>)' : Sb.fam === 'lognormal' ? ' (S = e<sup>m+sZ</sup>, Z ∼ N(0,1))' : Sb.fam === 'exponencial' ? ' (S = −β·log(1 − U), U uniforme)' : ''}${mods ? ' y aplicar ' + (d > 0 ? `la franquicia (S − ${f(d)})<sup>+</sup>` : '') + (d > 0 && L !== null ? ' y ' : '') + (L !== null ? `el límite min{·, ${f(L)}}` : '') : ''}, y tomar y = Σ Sᵢ${F !== null ? `, min{y, ${f(F)}}` : ''}. Paso 4: repetir M veces (p. ej. 100.000). Con la muestra ordenada, 𝔼(y) y σ(y) son la media y la desviación muestrales, el VaR es el percentil y el CVaR es la media de los ${sp.type === 'CVaR' ? T.fmtPctLevel(sp.mu) : 'μ·M'} peores valores (§7.2)${['SW', 'SDPT', 'Wang', 'DPT'].includes(sp.type) ? '; las medidas espectrales y de distorsión se estiman ponderando los valores ordenados con su función de pesos' : ''}.`);
        if (A !== 1 || B !== 0) {
          R.uses('prima66');
          R.ans('Prima.', `Π(y) = ${f(A)}·𝔼(y) + ${f(B)}·${RN} = ${f(A)} × ${f(Ey)} + ${f(B)} × ${f(rho)} = ${vv(Pi)}.`);
          R.uses('trasl');
          R.ans('Riesgo del asegurador.', `Por la invarianza por traslaciones, ${rn(sp, 'Π(y) − y')} = ${RN} − Π(y) = ${f(rho)} − ${f(Pi)} = ${vv(rho - Pi)}.` +
            (rho - Pi > 0 ? ` El asegurador acepta una prima que le deja un riesgo tan superior a cero porque ese riesgo se mitiga diversificando con otros asegurados: tras cobrar las primas, el riesgo global de la cartera debe ser nulo o negativo.` : ` La prima cubre el riesgo de la póliza.`));
        }
        R.ans('Probabilidad de pérdida.', `La compañía pierde dinero cuando la indemnización supera la prima: IP(y > ${f(Pi)}) = ${vv(ploss)}, luego no pierde con probabilidad ${vv(1 - ploss)}. Se queda con el 100 % de la prima cuando no paga nada: IP(y = 0) = ${vv(p0)}.`);
      }
      R.step('Probabilidad de pérdida', eq(`IP(pérdida) = IP(y > Π(y)) = IP(y > ${f(Pi)}) = ${vv(ploss)} ⇒ IP(no perder) = ${vv(1 - ploss)}`) + eq(`IP(y = 0) = ${vv(p0)} &nbsp; (la compañía se queda con el 100 % de la prima)`));
      // Segunda prima
      const A2 = V.nOpt('A2'), B2 = V.nOpt('B2');
      if (A2 !== null || B2 !== null) {
        const a2 = A2 === null ? 1 : A2, b2 = B2 === null ? 0 : B2, P2 = a2 * Ey + b2 * rho, pl2 = D.sf(P2);
        R.tile('Prima Π₂(y)', P2, { main: true }).tile('IP(pérdida) con Π₂', pl2);
        R.key('prima2', P2).key('ploss2', pl2);
        R.step('Segunda prima Π₂', eq(`Π₂(y) = ${f(a2)}·𝔼(y)${b2 ? ` + ${f(b2)}·${RN}` : ''} = ${f(a2)} × ${f(Ey)}${b2 ? ` + ${f(b2)} × ${f(rho)}` : ''} = ${vv(P2)}`) + eq(`IP(y > Π₂) = ${vv(pl2)}`));
        R.ans('Segunda prima.', `Con el segundo principio, Π₂(y) = ${f(a2)} × ${f(Ey)}${b2 ? ` + ${f(b2)} × ${f(rho)}` : ''} = ${vv(P2)}, y la probabilidad de que la compañía pierda dinero es IP(y > ${f(P2)}) = ${vv(pl2)}.`);
      }
      // ── Otras medidas y franquicia sobre el coste anual (y − D)⁺ ──
      const extra = parseMeasList(V.s('extra'));
      let Zd = null;
      if (Dg !== null) {
        Zd = T.makeDisc(Array.from(D.xs, x => Math.max(x - Dg, 0)), Array.from(D.ps));
        Zd.VaR = mu => Math.max(D.VaR(mu) - Dg, 0);
        Zd.CVaR = mu => { if (mu >= 1) return Zd.mean; const v = D.VaR(mu); return Math.max(v - Dg, 0) + D.SL(Math.max(v, Dg)) / mu; };
        Zd.CVaRz = z => Zd.CVaR(T.Phi(z));
      }
      const lossF = V.nOpt('lossF');
      if (extra.length) {
        R.table(`Medidas de riesgo${Zd ? ' sin y con franquicia anual' : ''}`, ['Medida', 'De y', ...(Zd ? [`De (y − ${f(Dg)})<sup>+</sup>`] : [])], extra.map(e => [rn(e), T.risk(D, e), ...(Zd ? [T.risk(Zd, e)] : [])]), { top: true });
        extra.forEach((e, i) => { R.key('x' + (i + 1), T.risk(D, e)); if (Zd) R.key('xz' + (i + 1), T.risk(Zd, e)); });
        R.uses(...extra.map(e => MK(e.type)));
        R.ans('Medidas de riesgo.', `Sobre la distribución de y (${r.unit ? 'exacta' : 'obtenida numéricamente'}): ${extra.map(e => `${rn(e)} = ${vv(T.risk(D, e))}`).join('; ')}.`);
      }
      if (lossF !== null) {
        const pl = D.sf((1 + lossF) * Pi); R.tile(`IP(pérdidas > ${f(lossF)}·Π)`, pl); R.key('plossF', pl);
        R.ans(`Pérdidas superiores al ${pct(lossF)} de la prima.`, `Las pérdidas son y − Π; superan ${f(lossF)}·Π si y > ${f(1 + lossF)} × ${f(Pi)} = ${f((1 + lossF) * Pi)}, lo que ocurre con probabilidad IP(y > ${f((1 + lossF) * Pi)}) = ${vv(pl)}.`);
      }
      if (Zd) {
        const Ez = Zd.mean, sdz = Zd.sd, rz = T.risk(Zd, sp), Pz = A * Ez + B * rz, plz = Zd.sf(Pz);
        R.tile(`𝔼((y − ${f(Dg)})<sup>+</sup>)`, Ez, { main: true }).tile(`σ((y − ${f(Dg)})<sup>+</sup>)`, sdz).tile(`${rn(sp, '−(y − ' + f(Dg) + ')<sup>+</sup>')}`, rz).tile('Prima con franquicia anual', Pz, { main: true }).tile('IP(pérdida) con franquicia', plz);
        R.key('Ez', Ez).key('sdz', sdz).key('rhoz', rz).key('primaz', Pz).key('plossz', plz);
        R.step(`Franquicia sobre el coste anual: z = (y − ${f(Dg)})<sup>+</sup>`, `La compañía sólo paga el exceso del coste anual sobre ${f(Dg)}. Como z es función no decreciente de y, VaR(−z) = (VaR(−y) − D)<sup>+</sup> y CVaR<sub>1−μ</sub>(−z) = (VaR − D)<sup>+</sup> + 𝔼((y − max{VaR, D})<sup>+</sup>)/μ:` +
          eq(`𝔼(z) = 𝔼((y − ${f(Dg)})<sup>+</sup>) = ${vv(Ez)}; &nbsp; σ(z) = ${vv(sdz)}; &nbsp; IP(z = 0) = IP(y ≤ ${f(Dg)}) = ${vv(D.cdf(Dg))}`) +
          eq(`${rn(sp, '−z')} = ${vv(rz)}; &nbsp; Π(z) = ${f(A)} × ${f(Ez)} + ${f(B)} × ${f(rz)} = ${vv(Pz)}; &nbsp; IP(z > Π) = ${vv(plz)}`));
        R.ans(`Con franquicia anual de ${f(Dg)}.`, `Con la franquicia la compañía paga z = (y − ${f(Dg)})<sup>+</sup>. Su esperanza es 𝔼((y − ${f(Dg)})<sup>+</sup>) = ${vv(Ez)} y su desviación ${vv(sdz)}; ${rn(sp, '−z')} = ${vv(rz)}${extra.length ? `; además ${extra.map(e => `${rn(e, '−z')} = ${vv(T.risk(Zd, e))}`).join(', ')}` : ''}. La prima es Π(z) = ${f(A)} × ${f(Ez)} + ${f(B)} × ${f(rz)} = ${vv(Pz)} (frente a ${f(Pi)} sin franquicia) y la probabilidad de pérdidas es IP(z > ${f(Pz)}) = ${vv(plz)}${lossF !== null ? `; la de que las pérdidas superen el ${pct(lossF)} de la prima, IP(z > ${f((1 + lossF) * Pz)}) = ${vv(Zd.sf((1 + lossF) * Pz))}` : ''}.`);
        if (lossF !== null) R.key('plossFz', Zd.sf((1 + lossF) * Pz));
      }
      // Relación entre k1 y k2 para reproducir la prima
      if ((A !== 1 || B !== 0) && rho > 0) {
        const c0 = Pi / rho, c1 = Ey / rho;
        R.step('Relación entre k₁ y k₂ para obtener la misma prima', eq(`(1 + k₁)𝔼(y) + k₂·${RN} = Π ⇔ k₂ = Π/${RN} − (𝔼(y)/${RN})(1 + k₁) = ${f(c0)} − ${f(c1)}(1 + k₁)`) +
          `Por ejemplo, k₁ = 0 ⇒ k₂ = ${f(c0 - c1)}; k₂ = 0 ⇒ k₁ = ${f(Pi / Ey - 1)}. Cuanto más recargo de seguridad, menos recargo por riesgo (relación lineal decreciente).`);
        R.ans('Relación entre recargos.', `Para que Π₃(y) = (1 + k₁)𝔼(y) + k₂${RN} coincida con Π(y) = ${f(Pi)} debe cumplirse k₂ = ${f(Pi)}/${f(rho)} − (${f(Ey)}/${f(rho)})(1 + k₁) = ${f(c0)} − ${f(c1)}(1 + k₁): una recta decreciente (k₁ = 0 ⇒ k₂ = ${f(c0 - c1)}; k₂ = 0 ⇒ k₁ = ${f(Pi / Ey - 1)}). Ambos recargos son sustitutivos.`);
        R.key('kRel0', c0 - c1);
      }
      // Reducción frente a una prima de referencia
      const refP = V.nOpt('refP');
      if (refP !== null) {
        const red = (refP - Pi) / refP;
        R.tile(red >= 0 ? 'Reducción de prima' : 'Recargo de prima', Math.abs(red), { pct: 1, main: true }); R.key('red', red);
        R.step('Variación frente a la prima de referencia', eq(`(${f(refP)} − ${f(Pi)})/${f(refP)} = ${vv(red)} ⇒ ${red >= 0 ? 'reducción' : 'recargo'} del ${pct(Math.abs(red))}`));
        R.ans(red >= 0 ? 'Reducción.' : 'Recargo.', `Frente a la prima de referencia ${f(refP)}, el porcentaje de ${red >= 0 ? 'reducción' : 'recargo'} es (${f(refP)} − ${f(Pi)})/${f(refP)} = ${vv(Math.abs(red))} ≈ ${pct(Math.abs(red))}.`);
      }
      const eps0 = V.nOpt('eps');
      if (eps0 !== null) {
        const eps = eps0 >= 1 ? eps0 / 100 : eps0;
        const Pst = D.q(1 - eps), k = (Pst - B * rho) / Ey - 1;
        R.tile(`k mínimo (IP(pérdida) ≤ ${pct(eps)})`, k, { main: true });
        R.key('kmin', k);
        R.ans('Recargo mínimo.', `Para que IP(pérdida) ≤ ${pct(eps)} la prima debe alcanzar el percentil ${T.fmtPctLevel(1 - eps)} de y, que vale ${f(Pst)}. De (1 + k) × ${f(Ey)} + ${f(B)} × ${f(rho)} = ${f(Pst)} se obtiene k = ${vv(k)} (${pct(k)}).`);
        R.step(`Recargo k mínimo para IP(pérdida) ≤ ${pct(eps)}`, `Hace falta Π ≥ percentil ${T.fmtPctLevel(1 - eps)} de y = ${f(Pst)}. Con Π = (1 + k)𝔼(y) + ${f(B)}·${RN}:` +
          eq(`k = (${f(Pst)} − ${f(B)} × ${f(rho)})/${f(Ey)} − 1 = ${vv(k)}`) + `Si el enunciado pide «inferior» estrictamente, cualquier k ligeramente mayor sirve.`);
      }
      const gfr = V.nOpt('gfrac');
      if (gfr !== null) {
        const thr = (1 - gfr) * Pi, pg = D.cdf(thr);
        R.tile(`IP(ganar ≥ ${f(gfr)}·Π)`, pg); R.key('pgan', pg);
        R.step(`Probabilidad de ganar al menos ${f(gfr)}·Π`, eq(`IP(Π − y ≥ ${f(gfr)}Π) = IP(y ≤ ${f(1 - gfr)} × ${f(Pi)}) = IP(y ≤ ${f(thr)}) = ${vv(pg)}`));
        R.ans(`Ganar al menos ${pct(gfr)} de la prima.`, `La compañía gana al menos ${f(gfr)}·Π si Π − y ≥ ${f(gfr)}Π, es decir, si y ≤ ${f(thr)}; esa probabilidad es ${vv(pg)}.`);
      }
      const nc = V.nOpt('ncond');
      if (nc !== null) {
        const k = Math.round(nc), thr = gfr !== null ? (1 - gfr) * Pi : Pi;
        const objTxt = gfr !== null ? `ganar al menos ${f(gfr)}·Π, es decir, y ≤ ${f(thr)}` : `ganar dinero, es decir, y ≤ Π = ${f(Pi)}`;
        const pS = j => j === 0 ? 1 : T.compound({ freq: T.freqTable([j], [1]), sev: Sb.D, d, L }).dist.cdf(thr);
        const pk = pS(k);
        let how = `IP(P₁ + … + P${k === 1 ? '₁' : '<sub>' + k + '</sub>'} ≤ ${f(thr)})`;
        if (Sb.fam === 'normal' && !mods) how = `IP(S₁ + … + S<sub>${k}</sub> ≤ ${f(thr)}) = Φ((${f(thr)} − ${k}m)/(s√${k})) = Φ(${f((thr - k * Sb.D.mean) / (Sb.D.sd * Math.sqrt(k)), 8)})`;
        else if (Sb.fam === 'exponencial' && !mods) how = `IP(Erlang(${k}; ${f(Sb.D.mean)}) ≤ ${f(thr)})`;
        let num = 0, den = 0; const parts = [];
        for (let j = 0; j <= k; j++) { const pj = Nb.D.pmf(j), q = pS(j); num += pj * q; den += pj; parts.push(`${f(pj)} × ${f(q)}`); }
        const pLe = num / den;
        R.tile(`IP(${gfr !== null ? 'ganar ≥ ' + f(gfr) + 'Π' : 'ganar'} | N = ${k})`, pk).tile(`IP(${gfr !== null ? 'ganar ≥ ' + f(gfr) + 'Π' : 'ganar'} | N ≤ ${k})`, pLe);
        R.key('pcond', pk).key('pcondLe', pLe);
        R.step(`Probabilidades condicionadas al número de siniestros`, eq(`N = ${k}: ${how} = ${vv(pk)}`) +
          eq(`N ≤ ${k}: Σ<sub>j≤${k}</sub> IP(N = j)·IP(y ≤ ${f(thr)} | N = j) / IP(N ≤ ${k}) = (${parts.join(' + ')})/${f(den)} = ${vv(pLe)}`));
        R.ans(`Condicionando al número de siniestros.`, `Se quiere ${objTxt}. Si hubo exactamente ${k} siniestro${k === 1 ? '' : 's'}, la probabilidad es ${how} = ${vv(pk)}. Si sólo se sabe que no hubo más de ${k}, por el teorema de las probabilidades totales y de Bayes, IP = Σ<sub>j≤${k}</sub> IP(N = j)·IP(y ≤ ${f(thr)} | N = j)/IP(N ≤ ${k}) = ${vv(pLe)}.`);
      }
      // Recursión de Panjer explícita cuando la severidad es discreta en retícula
      if (r.unit && Nb.D.ab && F === null) {
        const u = r.unit, { c, d: dd } = Nb.D.ab, fP = r.fP;
        const rows = []; let cum = 0;
        const pthr = V.nOpt('panjP'); let Uthr = null;
        for (let z = 0; z < 60; z++) { const pz = D.pAt(z * u); cum += pz; rows.push([f(z * u), pz, cum, Math.max(0, 1 - cum)]); if (pthr !== null && Uthr === null && 1 - cum <= pthr + 1e-12) Uthr = z * u; if (pthr !== null ? (Uthr !== null && z > 2) : (1 - cum < 0.005 && z > 4)) break; }
        if (Uthr !== null) { R.tile(`Umbral U con IP(y > U) ≤ ${f(pthr)}`, Uthr); R.key('Upanj', Uthr); }
        const g0 = D.pAt(0), g1 = D.pAt(u);
        R.table(`Distribución de y por la fórmula de Panjer (unidad ${f(u)})`, ['y', 'IP(y = z)', 'IP(y ≤ z)', 'IP(y > z)'], rows);
        R.step('Fórmula recursiva de Panjer (ec. 65)', `N es de la clase (c, d, 0) con c = ${f(c)} y d = ${f(dd)}. Trabajando en unidades de ${f(u)}, la severidad toma los valores ${fP.map((p, j) => p > 0 ? `${j}` : null).filter(Boolean).slice(0, 8).join(', ')} con probabilidades ${fP.filter(p => p > 0).slice(0, 8).map(p => f(p)).join(', ')}.` +
          eq(`IP(y = 0) = P<sub>N</sub>(IP(S = 0)) = ${vv(g0)}`) +
          eq(`IP(y = z) = (1/(1 − c·IP(S = 0))) Σ<sub>x=1</sub><sup>z</sup> (c + d·x/z)·IP(S = x)·IP(y = z − x)`) +
          eq(`IP(y = ${f(u)}) = (c + d)·IP(S = 1)·IP(y = 0)/(1 − c·IP(S = 0)) = ${vv(g1)}`) + 'La tabla siguiente recoge los primeros valores.');
        R.uses('panjer65');
        R.ans('Fórmula de Panjer.', `Con la unidad monetaria ${f(u)}, N pertenece a la clase (c, d, 0) con c = ${f(c)}, d = ${f(dd)}. La recursión IP(y = z) = (1/(1 − c·IP(S = 0)))Σ<sub>x=1</sub><sup>z</sup>(c + dx/z)IP(S = x)IP(y = z − x), partiendo de IP(y = 0) = ${f(g0)}, da: ${rows.slice(1, Uthr !== null ? rows.length : 10).map(r0 => `IP(y = ${r0[0]}) = ${f(r0[1])}`).join('; ')}.${Uthr !== null ? ` Como IP(y > ${f(Uthr)}) = ${f(1 - rows.find(x => x[0] === f(Uthr))[2])} ≤ ${f(pthr)}, basta llegar hasta U = ${f(Uthr)}.` : ''}`);
      }
      // Distribución explícita de y cuando N toma pocos valores (Teorema de las probabilidades totales)
      if (Nb.fam === 'tabla' && !mods && F === null && Nb.D.nmax <= 6) {
        const pm = Nb.D.pmTab, S0 = Sb.D, terms = [];
        let ok = true;
        for (let n = 1; n <= Nb.D.nmax; n++) {
          if (!(pm[n] > 0)) continue;
          let t;
          if (Sb.fam === 'normal') t = `Φ((x − ${f(n * S0.mean)})/${n === 1 ? f(S0.sd) : f(S0.sd) + '√' + n})`;
          else if (Sb.fam === 'exponencial' || (Sb.fam === 'gamma' && S0.al)) t = `F<sub>Gamma(${f(n * S0.al)}; ${f(S0.be)})</sub>(x)`;
          else if (Sb.fam === 'constante') t = `𝟙(x ≥ ${f(n * S0.xs[0])})`;
          else { ok = false; break; }
          terms.push(`${f(pm[n])}·${t}`);
        }
        if (ok) {
          const expr = `F<sub>y</sub>(x) = ${f(pm[0])} + ${terms.join(' + ')}`;
          R.step('Distribución del coste global (teorema de las probabilidades totales)', `F<sub>y</sub>(x) = IP(N = 0) + Σ IP(N = n)·F<sub>y|N=n</sub>(x), y y|N = n es la suma de n severidades independientes:` + eq(expr + ', x ≥ 0') +
            (Sb.fam === 'exponencial' ? 'La suma de n exponenciales de media β es una Erlang (Gamma(n, β)).' : Sb.fam === 'normal' ? 'La suma de n normales independientes es N(n·m; s√n).' : ''));
          R.uses('tpt');
          R.ans('Distribución del coste global.', `Por la teoría del riesgo colectivo y el teorema de las probabilidades totales, F<sub>y</sub>(x) = IP(N = 0) + Σ<sub>n≥1</sub> IP(N = n) F<sub>y|N=n</sub>(x). En nuestro caso` + eq(expr) + `para x ≥ 0 (IP(y = 0) = ${f(pm[0])}).`);
        }
      }
      R.step('Índice de mixtura de la composición (§3.2)', eq(`I = σ²(N)𝔼(${S_})²/(𝔼(N)σ²(${S_})) = ${vv(r.Imix)}`));

      // Cartera de n pólizas
      const n = V.nOpt('n'), eN0 = V.nOpt('epsN');
      if (n !== null || eN0 !== null) {
        const spK = V.b('mkOn') ? P.buildMeas(V, 'mk_') : sp, r01 = T.rhoStd(spK);
        R.uses('tcl61', 'norm45');
        let html = 'Por el Teorema Central del Límite, la cartera de n pólizas independientes es aproximadamente normal (teoría del riesgo individual, tema 6).';
        if (n !== null) {
          const c = normalCartera(n, Ey, sdy, spK, (A !== 1 || B !== 0) ? Pi : null);
          html += eq(`Y ∼ N(n𝔼(y); √n σ(y)) = N(${f(c.mN)}; ${f(c.sN)})`) + eq(`${rn(spK, '−Y')} = ${f(c.mN)} + ${f(c.r01)} × ${f(c.sN)} = ${vv(c.rhoN)} &nbsp; (ρ<sub>(0,1)</sub> = ${f(c.r01)})`) +
            eq(`Prima por póliza = ${rn(spK, '−Y')}/n = ${vv(c.rhoN / n)}; &nbsp; con Π = 𝔼(y) + k·${RN}: k = (${f(c.rhoN / n)} − ${f(Ey)})/${f(rho)} = ${vv((c.rhoN / n - Ey) / rho)}`);
          R.tile(`${rn(spK, '−Y')} de la cartera`, c.rhoN).tile('Prima por póliza (cartera)', c.rhoN / n);
          R.key('rhoCart', c.rhoN).key('kEq', (c.rhoN / n - Ey) / rho);
          R.ans(`Cartera de ${f(n)} pólizas.`, `La cartera se puede aproximar por una normal de media ${f(Ey)} × ${f(n)} = ${f(c.mN)} y desviación ${f(sdy)} × √${f(n)} = ${f(c.sN)}. Por tanto ${rn(spK, '−Y')} = ${f(c.mN)} + ${f(c.r01)} × ${f(c.sN)} = ${vv(c.rhoN)}, donde ${f(c.r01)} es el riesgo de la normal estándar. La prima de toda la cartera es ${f(c.rhoN)}, es decir, ${vv(c.rhoN / n)} por póliza; de ${f(c.rhoN / n)} = ${f(Ey)} + k × ${f(rho)} se obtiene k = ${vv((c.rhoN / n - Ey) / rho)}.`);
          if (c.ploss !== null) {
            html += eq(`IP(pérdida de la cartera) = IP(Y > nΠ) = 1 − Φ(√n(Π − 𝔼(y))/σ(y)) = 1 − Φ(${f(Math.sqrt(n) * (Pi - Ey) / sdy, 8)}) = ${vv(c.ploss)}`);
            R.tile('IP(pérdida) de la cartera', c.ploss);
            R.key('plossCart', c.ploss);
            R.ans('Pérdida de la cartera.', `Con n = ${f(n)} pólizas, IP(Y > nΠ) = 1 − Φ(√n(Π − 𝔼(y))/σ(y)) = 1 − Φ(${f(Math.sqrt(n) * (Pi - Ey) / sdy, 8)}) = ${vv(c.ploss)}.`);
          }
        }
        if (eN0 !== null && (A !== 1 || B !== 0)) {
          const eN = eN0 >= 1 ? eN0 / 100 : eN0;
          if (!(Pi > Ey)) html += '<div class="warn">La prima no supera la siniestralidad esperada: no existe n que reduzca la probabilidad de pérdida.</div>';
          else {
            const z = T.PhiInv(1 - eN), n1 = Math.ceil((sdy * z / (Pi - Ey)) ** 2 - 1e-9), n2 = Math.ceil((sdy * r01 / (Pi - Ey)) ** 2 - 1e-9);
            html += eq(`IP(pérdida) = 1 − Φ(√n(Π − 𝔼)/σ) ≤ ${pct(eN)} ⇔ √n ≥ σ·Φ<sup>−1</sup>(${f(1 - eN)})/(Π − 𝔼) = ${f(sdy)} × ${f(z, 8)}/${f(Pi - Ey)} ⇒ n ≥ ${f((sdy * z / (Pi - Ey)) ** 2)} ⇒ <b>n = ${n1}</b>`) +
              eq(`${rn(spK, 'nΠ − Y')} = n𝔼 + √n σ ρ<sub>(0,1)</sub> − nΠ ≤ 0 ⇔ √n ≥ σρ<sub>(0,1)</sub>/(Π − 𝔼) = ${f(sdy)} × ${f(r01)}/${f(Pi - Ey)} ⇒ n ≥ ${f((sdy * r01 / (Pi - Ey)) ** 2)} ⇒ <b>n = ${n2}</b>`);
            R.tile(`n mínimo con IP(pérdida) ≤ ${pct(eN)}`, String(n1)).tile(`n mínimo con ${rn(spK, 'nΠ − Y')} ≤ 0`, String(n2));
            R.key('nP', n1).key('nR', n2);
            R.ans('Número mínimo de pólizas.', `Con n pólizas la siniestralidad es aproximadamente N(n𝔼(y); √n σ(y)). La compañía pierde dinero con probabilidad 1 − Φ(√n(Π − 𝔼(y))/σ(y)) ≤ ${pct(eN)} si √n ≥ ${f(sdy)} × ${f(z, 8)}/${f(Pi - Ey)}, es decir, n ≥ ${f((sdy * z / (Pi - Ey)) ** 2)}: el mínimo es <b>n = ${n1}</b>. Para que ${rn(spK, 'nΠ − Y')} = n(𝔼(y) − Π) + √n σ(y)·${f(r01)} ≤ 0 hace falta n ≥ ${f((sdy * r01 / (Pi - Ey)) ** 2)}: el mínimo es <b>n = ${n2}</b>.`);
          }
        }
        // Parte de la cartera con franquicia anual y riesgo colectivo exacto
        if (n !== null) {
          const nD = V.nOpt('nD') || 0;
          if (nD && !Zd) throw new Error('Para «De ellas, con la franquicia anual» indica la franquicia anual D.');
          if (nD < 0 || nD > n) throw new Error('El nº de pólizas con franquicia debe estar entre 0 y n.');
          const n0 = n - nD, mI = n0 * Ey + (nD ? nD * Zd.mean : 0), sI = Math.sqrt(n0 * sdy * sdy + (nD ? nD * Zd.var : 0)), rI = spK.type === 'Entropica' ? mI + spK.mu * sI * sI / 2 : mI + r01 * sI;
          if (nD) {
            R.tile('Prima de la cartera mixta', rI, { main: true }); R.key('rhoMix', rI);
            const k1 = rI / mI - 1;
            html += eq(`${f(n0)} pólizas sin franquicia y ${f(nD)} con ella: m = ${f(n0)} × ${f(Ey)} + ${f(nD)} × ${f(Zd.mean)} = ${f(mI)}; s = √(${f(n0)} × ${f(sdy)}² + ${f(nD)} × ${f(Zd.sd)}²) = ${f(sI)}`) + eq(`${rn(spK, '−Y')} = ${f(mI)} + ${f(r01)} × ${f(sI)} = ${vv(rI)}`);
            R.ans('Cartera con la mitad de pólizas con franquicia.', `Con ${f(n0)} pólizas sin franquicia (𝔼 = ${f(Ey)}, σ = ${f(sdy)}) y ${f(nD)} con franquicia (𝔼 = ${f(Zd.mean)}, σ = ${f(Zd.sd)}), la cartera es aproximadamente normal de media ${f(mI)} y desviación ${f(sI)}, luego hay que cobrar ${rn(spK, '−Y')} = ${f(mI)} + ${f(r01)} × ${f(sI)} = ${vv(rI)}. Con el recargo de seguridad máximo k₁ = ${vv(k1)} (k₂ = 0), cada asegurado sin franquicia paga ${f(Ey)} × ${f(1 + k1)} = ${vv(Ey * (1 + k1))} y cada uno con franquicia ${f(Zd.mean)} × ${f(1 + k1)} = ${vv(Zd.mean * (1 + k1))}. (Para repartir con k₂ usa «Recargos» con dos filas: 𝔼, σ y riesgo de cada tipo de póliza.)`);
          }
          if (V.b('colOn')) {
            const parts = [{ dist: D, n: n0 }]; if (nD) parts.push({ dist: Zd, n: nD });
            const Y = T.sumIID(parts), rC = T.risk(Y, spK), dif = (rC - rI) / rI;
            R.tile(`${rn(spK, '−Y')} (riesgo colectivo)`, rC, { main: true }).tile('Prima por póliza (colectivo)', rC / n);
            R.key('rhoCol', rC).key('difCol', dif);
            R.table('Riesgo individual (normal) frente a riesgo colectivo (distribución exacta de la cartera)', ['', 'Individual (normal)', 'Colectivo (exacto)'],
              [['𝔼(Y)', mI, Y.mean], ['σ(Y)', sI, Y.sd], [rn(spK, '−Y') + ' = prima de la cartera', rI, rC], ['Prima media por póliza', rI / n, rC / n]], { top: true });
            html += eq(`Riesgo colectivo: la distribución de Y = suma de las ${f(n)} pólizas se obtiene exactamente elevando la función característica de cada póliza a su nº de pólizas (FFT) ⇒ ${rn(spK, '−Y')} = ${vv(rC)} (${dif >= 0 ? '+' : '−'}${pct(Math.abs(dif))} respecto de la normal)`);
            R.ans('Riesgo colectivo y comparación.', `Si en lugar de aproximar por la normal se obtiene la distribución de la cartera a partir de la de cada póliza (riesgo colectivo), ${rn(spK, '−Y')} = ${vv(rC)}, frente a ${f(rI)} con la teoría del riesgo individual (${dif >= 0 ? 'un ' + pct(dif) + ' más' : 'un ' + pct(-dif) + ' menos'}). Ambos enfoques deberían coincidir, pero la convergencia a la normal (TCL) es sólo en el límite: con ${f(n)} pólizas aún queda algo de asimetría${Sb.D.heavy ? ' (la severidad tiene cola pesada)' : ''}, que la normal ignora; si además se simula, hay error de Monte Carlo. Por prudencia se suele cobrar la prima mayor${rC >= rI ? ', la del riesgo colectivo' : ''}.`);
          }
          R.ans('Modelo de simulación de la cartera (si lo piden).', `Se simulan muchos costes anuales de una póliza (p. ej. 1.000.000) como en el modelo anterior${nD ? ', sin y con franquicia' : ''}; después se eligen al azar ${f(n)} de esos valores${nD ? ` (${f(nD)} de la muestra con franquicia)` : ''} y se suman, y se repite la operación (p. ej. 10.000 veces). La muestra de sumas es una muestra del coste de la cartera: su histograma y un test de normalidad dicen si se puede aplicar la teoría del riesgo individual, y su percentil y la media de su cola dan el VaR y el CVaR de la cartera.`);
        }
        R.step('Cartera de n pólizas independientes', html);
      }
      if (r.mcDist) {
        const M = r.mcDist, rm = T.risk(M, sp), Pm = A * M.mean + B * rm;
        R.table('Distribución exacta frente a Monte Carlo', ['Magnitud', 'Exacta (discretización)', `Monte Carlo (${f(mc.n)} sim., semilla ${mc.seed})`], [
          ['𝔼(y)', Ey, M.mean], ['σ(y)', sdy, M.sd], [RN, rho, rm], ['Π(y)', Pi, Pm], ['IP(y > Π)', ploss, M.sf(Pm)], ...extra.map(e => [rn(e), T.risk(D, e), T.risk(M, e)]),
          ...(Zd ? (() => { const Mz = M.map(x => Math.max(x - Dg, 0)), rmz = T.risk(Mz, sp); return [[`𝔼((y − ${f(Dg)})<sup>+</sup>)`, Zd.mean, Mz.mean], [`σ((y − ${f(Dg)})<sup>+</sup>)`, Zd.sd, Mz.sd], [rn(sp, '−z'), T.risk(Zd, sp), rmz], ...extra.map(e => [rn(e, '−z'), T.risk(Zd, e), T.risk(Mz, e)])]; })() : [])]);
        R.ans('Por simulación (Monte Carlo).', `Procediendo por ${f(mc.n)} simulaciones de Monte Carlo se obtiene 𝔼(y) ≈ ${f(M.mean)}, σ(y) ≈ ${f(M.sd)} y ${RN} ≈ ${f(rm)}${extra.length ? ', ' + extra.map(e => `${rn(e)} ≈ ${f(T.risk(M, e))}`).join(', ') : ''}, de donde Π(y) ≈ ${f(Pm)}. (Valores exactos: ${f(Ey)}, ${f(sdy)} y ${f(rho)}.)`);
        R.note('Monte Carlo cambia con la semilla: diferencias del 1 % en el CVaR son normales. Por eso los valores del examen (simulados) no coinciden exactamente con los exactos.');
      }
      return R;
    },
    examples: [
      { id: 'nov10-ag', label: 'Clase 10 nov. 2026 · a)–g), k)–l) · N ∈ {0…4}, severidad leve/moderada/grave (log-normales), franquicia anual 5, cartera de 5.000', values: { N_fam: 'tabla', N_tx: '0; 1; 2; 3; 4', N_tp: '0,4; 0,2; 0,2; 0,1; 0,1', S_fam: 'mixtura', S_mx: [{ nom: 'Leve', p: '0,8', fam: 'lognormal', E: '1', sd: '0,5' }, { nom: 'Moderado', p: '0,15', fam: 'lognormal', E: '3', sd: '2' }, { nom: 'Grave', p: '0,05', fam: 'lognormal', E: '10', sd: '10' }], m_rho: 'SW', m_a: '1', A: '1,1', B: '0,1', extra: 'VaR 95; CVaR 95; SW 1', Dg: '5', lossF: '0,85', n: '5000', colOn: true, mkOn: true, mk_rho: 'CVaR', mk_lvl: '95' },
        expect: [{ k: 'E', l: '𝔼(y)', v: 2.275, src: 'analítico' }, { k: 'sd', l: 'σ(y)', v: 4.289157842747222 }, { k: 'x2', l: 'CVaR<sub>95%</sub>(−y)', v: 15.819965325458567, src: '1.000.000 sim.' }, { k: 'Ez', l: '𝔼((y − 5)<sup>+</sup>)', v: 0.6368078762429434, src: 'simulado' }, { k: 'sdz', l: 'σ((y − 5)<sup>+</sup>)', v: 3.30753588354234, src: 'simulado' }, { k: 'rhoCart', l: 'Prima de la cartera (riesgo individual)', v: 11873.86644, src: 'solución (usa ρ(0,1) = 1,6449, el del VaR)' }, { k: 'rhoCol', l: 'Prima de la cartera (riesgo colectivo)', v: 12041.28381, src: 'simulado' }],
        note: 'Ejercicio de clase (no es de examen). <b>Posible errata en g):</b> la solución usa ρ(0,1) = 1,6449, que es el de VaR<sub>95%</sub>, aunque el enunciado pide CVaR<sub>95%</sub> (ρ(0,1) = 2,0627). Con el CVaR la prima de la cartera sale ≈ 12.000,6 y el riesgo colectivo exacto ≈ 12.018, muy cerca de su 12.041 simulado. Los momentos con franquicia y los CVaR de la solución están simulados.' },
      { id: 'nov10-j', label: 'Clase 10 nov. 2026 · j)–l) · la mitad de las 5.000 pólizas con franquicia anual 5', values: { N_fam: 'tabla', N_tx: '0; 1; 2; 3; 4', N_tp: '0,4; 0,2; 0,2; 0,1; 0,1', S_fam: 'mixtura', S_mx: [{ nom: 'Leve', p: '0,8', fam: 'lognormal', E: '1', sd: '0,5' }, { nom: 'Moderado', p: '0,15', fam: 'lognormal', E: '3', sd: '2' }, { nom: 'Grave', p: '0,05', fam: 'lognormal', E: '10', sd: '10' }], m_rho: 'SW', m_a: '1', A: '1,1', B: '0,1', extra: 'VaR 95; CVaR 95; SW 1', Dg: '5', lossF: '0,85', n: '5000', colOn: true, mkOn: true, mk_rho: 'CVaR', mk_lvl: '95', nD: '2500' },
        expect: [{ k: 'rhoMix', l: 'Prima de la cartera (individual)', v: 7724.973481, src: 'solución (con ρ(0,1) del VaR)' }, { k: 'rhoCol', l: 'Prima de la cartera (colectivo)', v: 7871.248224, src: 'simulado' }],
        note: 'Misma errata que en g): la solución usa el ρ(0,1) del VaR<sub>95%</sub>.' },
      { id: 'e16-3', label: 'Enero 2016 · Ej. 3 · BN(3; 0,5), exponencial(1000), CVaR 80 %, ganar ≥ ½ prima (y con N ≤ 1)', values: { N_fam: 'binneg', N_binneg_mode: 'p', N_binneg_p_a: '3', N_binneg_p_th: '0,5', S_fam: 'exponencial', S_exponencial_p_b: '1000', m_rho: 'CVaR', m_lvl: '80', A: '1,05', B: '0,1', gfrac: '0,5', ncond: '1' } },
      { id: 'e15-2b', label: 'Enero 2015 · Ej. 2 · BN de media 2 y varianza 10, gamma(100; 5000), Π₁ = 1,1𝔼 y Π₂ con CVaR 90 %', values: { N_fam: 'binneg', N_binneg_mode: 'mv', N_binneg_mv_E: '2', N_binneg_mv_V: '10', S_fam: 'gamma', S_gamma_mode: 'mom', S_gamma_mom_E: '100', S_gamma_mom_sd: 'sqrt(5000)', m_rho: 'CVaR', m_lvl: '90', A: '1,05', B: '0,05', A2: '1,1', B2: '0' } },
      { id: 'e14-3c', label: 'Enero 2014 · Ej. 3 · Poisson(2), severidad 100–400 equiprobable, Panjer hasta IP(y > U) ≤ 0,3, VaR 70 %, PPVE 10 %', values: { N_fam: 'poisson', N_poisson_p_lam: '2', S_fam: 'discreta', S_dx: '100; 200; 300; 400', S_dp: '0,25; 0,25; 0,25; 0,25', m_rho: 'VaR', m_lvl: '70', A: '1,05', B: '0,05', A2: '1,1', B2: '0', panjP: '0,3' } },
      { id: 'e22-3a', label: 'Enero 2022 · Ej. 3a · N ∈ {0, 1, 2}, severidad N(100; 10): distribución del coste', values: { N_fam: 'tabla', N_tx: '0; 1; 2', N_tp: '0,5; 0,3; 0,2', S_fam: 'normal', S_normal_p_m: '100', S_normal_p_s: '10', m_rho: 'CVaR', m_lvl: '95', A: '1', B: '0' } },
      { id: 'e22-3b', label: 'Enero 2022 · Ej. 3b · N ∈ {0, 1, 2}, severidad exponencial(100)', values: { N_fam: 'tabla', N_tx: '0; 1; 2', N_tp: '0,5; 0,3; 0,2', S_fam: 'exponencial', S_exponencial_p_b: '100', m_rho: 'CVaR', m_lvl: '95', A: '1', B: '0' } },
      { id: 'e20-3', label: 'Enero 2020 · Ej. 3 · BN(2; 0,6), log-normal(1000; 300), CVaR 90 %', values: { N_fam: 'binneg', N_binneg_mode: 'p', N_binneg_p_a: '2', N_binneg_p_th: '0,6', S_fam: 'lognormal', S_lognormal_mode: 'mom', S_lognormal_mom_E: '1000', S_lognormal_mom_sd: '300', m_rho: 'CVaR', m_lvl: '90', A: '1,2', B: '0,05' },
        expect: [{ k: 'E', l: '𝔼(y)', v: 1333.33 }, { k: 'sd', l: 'σ(y)', v: Math.sqrt(2342222.222) }, { k: 'rho', l: 'CVaR<sub>90%</sub>(−y)', v: 4770.029014, src: 'Monte Carlo (Ej_3a)' }, { k: 'prima', l: 'Π(y)', v: 1838.50 }, { k: 'p0', l: 'IP(beneficio = prima) = IP(N = 0)', v: 0.36 }] },
      { id: 'e18-3ab', label: 'Enero 2018 · Ej. 3a-b · BN(1; 0,4), severidad N(1000; 100), VaR 99 %', values: { N_fam: 'binneg', N_binneg_mode: 'p', N_binneg_p_a: '1', N_binneg_p_th: '0,4', S_fam: 'normal', S_normal_p_m: '1000', S_normal_p_s: '100', m_rho: 'VaR', m_lvl: '99', A: '1,05', B: '0,1', ncond: '1' },
        expect: [{ k: 'prima', l: 'Π(y)', v: 2434.400395, src: 'Monte Carlo (Ejercicio_3a)' }, { k: 'pcond', l: 'IP(ganar | N = 1)', v: 1, src: 'Φ(14,34) ≃ 1' }] },
      { id: 'e18-3c', label: 'Enero 2018 · Ej. 3c · N ∈ {0, 3} equiprobables, severidad N(1000; 100)', values: { N_fam: 'tabla', N_tx: '0; 3', N_tp: '0,5; 0,5', S_fam: 'normal', S_normal_p_m: '1000', S_normal_p_s: '100', m_rho: 'VaR', m_lvl: '99', A: '1,05', B: '0,1' },
        expect: [{ k: 'rho', l: 'VaR<sub>99%</sub>(−y)', v: 3355.719746, src: 'fórmula cerrada' }, { k: 'prima', l: 'Π(y)', v: 1910.571975 }] },
      { id: 'e17-3ab', label: 'Enero 2017 · Ej. 3a-b · BN(3; 0,5), exponencial(1000), 0,5CVaR80 + 0,5CVaR90', values: { N_fam: 'binneg', N_binneg_mode: 'p', N_binneg_p_a: '3', N_binneg_p_th: '0,5', S_fam: 'exponencial', S_exponencial_p_b: '1000', m_rho: 'WCVaR', m_wl: '80; 90', m_wk: '0,5; 0,5', A: '1,05', B: '0,1', gfrac: '0,5' } },
      { id: 'e17-3c', label: 'Enero 2017 · Ej. 3c · con franquicia de 800', values: { N_fam: 'binneg', N_binneg_mode: 'p', N_binneg_p_a: '3', N_binneg_p_th: '0,5', S_fam: 'exponencial', S_exponencial_p_b: '1000', d: '800', m_rho: 'WCVaR', m_wl: '80; 90', m_wk: '0,5; 0,5', A: '1,05', B: '0,1' } },
      {
        id: 'j26-2ab', label: 'Junio 2026 · Ej. 2a-b · BN(1; 0,4) y log-normal(1000; 250)',
        values: { N_fam: 'binneg', N_binneg_mode: 'p', N_binneg_p_a: '1', N_binneg_p_th: '0,4', S_fam: 'lognormal', S_lognormal_mode: 'mom', S_lognormal_mom_E: '1000', S_lognormal_mom_sd: '250', m_rho: 'CVaR', m_lvl: '95', A: '1,03', B: '0,05' },
        expect: [{ k: 'E', l: '𝔼(y)', v: 1500, src: 'ec. 26' }, { k: 'rho', l: 'CVaR<sub>95%</sub>(−y)', v: 7516.528836, src: 'Monte Carlo (macro Ej_2ab)' }, { k: 'prima', l: 'Π(y)', v: 1920.826442, src: 'con el CVaR simulado' }, { k: 'riesgo', l: 'CVaR<sub>95%</sub>(Π(y) − y)', v: 5595.702394, src: 'ρ(−y) − Π(y)' }],
        note: 'El examen estima el CVaR con 100.000 simulaciones; la calculadora obtiene la distribución exacta. La diferencia (≈1 %) es ruido de simulación. Activa «Contraste por Monte Carlo» para verlo.'
      },
      {
        id: 'j26-2c', label: 'Junio 2026 · Ej. 2c · con indemnización máxima anual 3000',
        values: { N_fam: 'binneg', N_binneg_mode: 'p', N_binneg_p_a: '1', N_binneg_p_th: '0,4', S_fam: 'lognormal', S_lognormal_mode: 'mom', S_lognormal_mom_E: '1000', S_lognormal_mom_sd: '250', F: '3000', m_rho: 'CVaR', m_lvl: '95', A: '1,03', B: '0,05' },
        expect: [{ k: 'E', l: '𝔼(min{y, 3000})', v: 1159.937477, src: 'Monte Carlo (Ej_2c)' }, { k: 'rho', l: 'CVaR<sub>95%</sub>(−y)', v: 3001.2, src: 'Monte Carlo (debe ser 3000)' }, { k: 'prima', l: 'Π(y)', v: 1344.795601, src: '' }]
      },
      {
        id: 'j26-2d', label: 'Junio 2026 · Ej. 2d · con indemnización máxima por siniestro 1200',
        values: { N_fam: 'binneg', N_binneg_mode: 'p', N_binneg_p_a: '1', N_binneg_p_th: '0,4', S_fam: 'lognormal', S_lognormal_mode: 'mom', S_lognormal_mom_E: '1000', S_lognormal_mom_sd: '250', L: '1200', m_rho: 'CVaR', m_lvl: '95', A: '1,03', B: '0,05' },
        expect: [{ k: 'E', l: '𝔼(y)', v: 1450.197903, src: 'Monte Carlo (Ej_2d)' }, { k: 'rho', l: 'CVaR<sub>95%</sub>(−y)', v: 7165.192972, src: 'Monte Carlo' }, { k: 'prima', l: 'Π(y)', v: 1851.963488, src: '' }]
      },
      {
        id: 'j25-3a', label: 'Junio 2025 · Ej. 3a · Poisson(1) y exponencial(100), CVaR 99 %',
        values: { N_fam: 'poisson', N_poisson_p_lam: '1', S_fam: 'exponencial', S_exponencial_p_b: '100', m_rho: 'CVaR', m_lvl: '99', A: '1,05', B: '0,1' },
        expect: [{ k: 'rho', l: 'CVaR<sub>99%</sub>(−y)', v: 755.1252288, src: 'Monte Carlo (Jun_Ej_3a)' }, { k: 'prima', l: 'Π(y)', v: 180.5125229, src: '' }]
      },
      {
        id: 'j25-3b', label: 'Junio 2025 · Ej. 3b · con franquicia 95',
        values: { N_fam: 'poisson', N_poisson_p_lam: '1', S_fam: 'exponencial', S_exponencial_p_b: '100', d: '95', m_rho: 'CVaR', m_lvl: '99', A: '1,05', B: '0,1' },
        expect: [{ k: 'prima', l: 'Π(y)', v: 94.057083, src: 'Monte Carlo (Jun_Ej_3b)' }, { k: 'ploss', l: 'IP(pérdida)', v: 0.14995, src: 'proporción simulada' }]
      },
      {
        id: 'j24-3', label: 'Junio 2024 · Ej. 3 · BN(1; 1/4), suma de 3 exponenciales(70), franquicia 100',
        values: { N_fam: 'binneg', N_binneg_mode: 'p', N_binneg_p_a: '1', N_binneg_p_th: '1/4', S_fam: 'gamma', S_gamma_mode: 'sum', S_gamma_sum_k: '3', S_gamma_sum_b: '70', d: '100', m_rho: 'CVaR', m_lvl: '95', A: '1,05', B: '0,02', epsN: '5%' }
      },
      {
        id: 'j23-2', label: 'Junio 2023 · Ej. 2a-b · BN(1,1; 0,5), log-normal(100; 150), 10.000 pólizas',
        values: { N_fam: 'binneg', N_binneg_mode: 'p', N_binneg_p_a: '1,1', N_binneg_p_th: '0,5', S_fam: 'lognormal', S_lognormal_mode: 'mom', S_lognormal_mom_E: '100', S_lognormal_mom_sd: '150', m_rho: 'CVaR', m_lvl: '94', A: '1', B: '0', n: '10000' },
        expect: [{ k: 'E', l: '𝔼(y)', v: 110 }, { k: 'sd', l: 'σ(y)', v: 216.2174831 }, { k: 'rho', l: 'CVaR<sub>94%</sub>(−y)', v: 766.0145962, src: 'Monte Carlo (Ej_2a)' }, { k: 'rhoCart', l: 'CVaR<sub>94%</sub> de la cartera', v: 1142927.457, src: 'aprox. normal' }, { k: 'kEq', l: 'k de cada póliza', v: 0.005604, src: '' }]
      },
      {
        id: 'e24-3', label: 'Enero 2024 · Ej. 3 · BN(1; 1/2), suma de 2 exponenciales(100), franquicia 100, 1.800 pólizas',
        values: { N_fam: 'binneg', N_binneg_mode: 'p', N_binneg_p_a: '1', N_binneg_p_th: '1/2', S_fam: 'gamma', S_gamma_mode: 'sum', S_gamma_sum_k: '2', S_gamma_sum_b: '100', d: '100', m_rho: 'CVaR', m_lvl: '95', A: '1,05', B: '0,04', n: '1800' }
      },
      {
        id: 'e23-3i', label: 'Enero 2023 · Ej. 3 (i) · BN(1; 1/2), exponencial(100), k mínimo para IP(pérdida) < 20 %',
        values: { N_fam: 'binneg', N_binneg_mode: 'p', N_binneg_p_a: '1', N_binneg_p_th: '1/2', S_fam: 'exponencial', S_exponencial_p_b: '100', m_rho: 'CVaR', m_lvl: '90', A: '1', B: '0,02', eps: '20%' }
      },
      {
        id: 'e23-3ii', label: 'Enero 2023 · Ej. 3 (ii) · con franquicia 40',
        values: { N_fam: 'binneg', N_binneg_mode: 'p', N_binneg_p_a: '1', N_binneg_p_th: '1/2', S_fam: 'exponencial', S_exponencial_p_b: '100', d: '40', m_rho: 'CVaR', m_lvl: '90', A: '1', B: '0,02', eps: '20%' }
      },
      {
        id: 'e23-3iii', label: 'Enero 2023 · Ej. 3 (iii) · con indemnización máxima 120 por siniestro',
        values: { N_fam: 'binneg', N_binneg_mode: 'p', N_binneg_p_a: '1', N_binneg_p_th: '1/2', S_fam: 'exponencial', S_exponencial_p_b: '100', L: '120', m_rho: 'CVaR', m_lvl: '90', A: '1', B: '0,02', eps: '20%' },
        note: 'Apartado b): si se pide un único k válido para las tres modalidades, toma el mayor de los tres k mínimos (i), (ii) y (iii). Para el apartado c) (cartera de 1.000 pólizas de cada modalidad) usa el ejemplo «Enero 2023 · Ej. 3c» de la Calculadora de medidas de riesgo.'
      },
      {
        id: 'e26-2b-pri', label: 'Enero 2026 · Ej. 2b · a priori: λ ∼ Gamma(1; 2), log-normal(1000; 500)',
        values: { N_fam: 'binneg', N_binneg_mode: 'pg', N_binneg_pg_a: '1', N_binneg_pg_b: '2', S_fam: 'lognormal', S_lognormal_mode: 'mom', S_lognormal_mom_E: '1000', S_lognormal_mom_sd: '500', m_rho: 'CVaR', m_lvl: '95', A: '1,05', B: '0,05' },
        expect: [{ k: 'rho', l: 'CVaR<sub>95%</sub>(−y) a priori', v: 9770.040799, src: 'Monte Carlo (Ej_2b_1)' }],
        note: 'La solución oficial escribe la prima como 1,05 × 2 + 0,05 × CVaR (usa 𝔼(N) = 2 en vez de 𝔼(y) = 2000). Revisa ese paso si lo vas a copiar.'
      },
      {
        id: 'e26-2b-pos', label: 'Enero 2026 · Ej. 2b · a posteriori: λ ∼ Gamma(5; 2/9)',
        values: { N_fam: 'binneg', N_binneg_mode: 'pg', N_binneg_pg_a: '5', N_binneg_pg_b: '2/9', S_fam: 'lognormal', S_lognormal_mode: 'mom', S_lognormal_mom_E: '1000', S_lognormal_mom_sd: '500', m_rho: 'CVaR', m_lvl: '95', A: '1,05', B: '0,05', refP: '2586,565' },
        note: 'La prima de referencia es la prima a priori calculada con el ejemplo anterior (valores exactos): así sale directamente el % de reducción.',
        expect: [{ k: 'rho', l: 'CVaR<sub>95%</sub>(−y) a posteriori', v: 4730.701926, src: 'Monte Carlo (Ej_2b_2)' }]
      },
      {
        id: 'e25-3b-pri', label: 'Enero 2025 · Ej. 3b · a priori: Poisson(0,8), log-normal(100; 50)',
        values: { N_fam: 'poisson', N_poisson_p_lam: '0,8', S_fam: 'lognormal', S_lognormal_mode: 'mom', S_lognormal_mom_E: '100', S_lognormal_mom_sd: '50', m_rho: 'CVaR', m_lvl: '90', A: '1,1', B: '0,1' },
        expect: [{ k: 'prima', l: 'Π(y) a priori', v: 118.5384821, src: 'Monte Carlo (Ej_3b_1)' }]
      },
      {
        id: 'e25-3b-pos', label: 'Enero 2025 · Ej. 3b · a posteriori: Poisson(0,571428571)',
        values: { N_fam: 'poisson', N_poisson_p_lam: '4*0,2/(1+2*0,2)', S_fam: 'lognormal', S_lognormal_mode: 'mom', S_lognormal_mom_E: '100', S_lognormal_mom_sd: '50', m_rho: 'CVaR', m_lvl: '90', A: '1,1', B: '0,1', refP: '118,3596253' },
        note: 'La prima de referencia es la prima a priori calculada con el ejemplo anterior (valores exactos): así sale directamente el % de reducción.',
        expect: [{ k: 'prima', l: 'Π(y) a posteriori', v: 87.84963941, src: 'Monte Carlo (Ej_3b_2)' }]
      }
    ]
  });

  /* ═════════ T3 · Momentos: severidad por tipos y coste agregado ═════════ */
  UI.tool({
    id: 't3-momentos', tema: 3, title: 'Momentos e índices de mixtura: severidad por tipos',
    short: 'Severidad mezcla de tipos (leve/grave…) y coste agregado: medias, varianzas, índices de mixtura y ratios; con severidades correlacionadas.',
    cuando: '«Los siniestros pueden ser leves (media …, desviación …, probabilidad …) o graves (…)» y «la frecuencia es …»: media, varianza, índice de mixtura de la severidad y del coste agregado.',
    que: 'Trabaja sólo con momentos. La severidad es una mixtura de tipos: su media es la media de las medias y su varianza = varianza de las medias + media de las varianzas (ec. 27). El coste agregado y = S₁ + … + S<sub>N</sub> es otra mixtura (condicionando a N): media de varianzas 𝔼(N)σ²(S) y varianza de medias 𝔼(S)²σ²(N) (ec. 26). Si las severidades están correlacionadas, la media de varianzas añade rσ²(S)𝔼(N(N − 1)).',
    groups: [
      {
        title: 'Severidad S', fields: [
          { id: 'sm', type: 'sel', label: 'La severidad es', def: 'tipos', opts: [['tipos', 'Mixtura de tipos (probabilidad, media, desviación)'], ['una', 'Una sola: media y desviación']], wide: true },
          { id: 'sev', type: 'rows', label: 'Tipos de siniestro', cols: [{ id: 'nom', label: 'Tipo', type: 'text' }, { id: 'p', label: 'Probabilidad' }, { id: 'E', label: 'Media' }, { id: 'sd', label: 'Desviación' }], def: [{ nom: 'Leve', p: '0,99', E: '10', sd: '100' }, { nom: 'Grave', p: '0,01', E: '1000', sd: '1.000.000' }], show: v => v.sm === 'tipos' },
          { id: 'SE', type: 'num', label: '𝔼(S)', def: '20', show: v => v.sm === 'una' }, { id: 'Ssd', type: 'num', label: 'σ(S)', def: '100', show: v => v.sm === 'una' }
        ]
      },
      { title: 'Frecuencia N', fields: P.famFields('N_', P.FR, Object.keys(P.FR), 'tabla', { N_tp: '0,7; 0,2; 0,1' }) },
      { title: 'Correlación entre severidades (opcional)', optional: true, openIf: v => v.rc, fields: [{ id: 'rc', type: 'num', label: 'Correlación r entre dos severidades del mismo año', def: '', ph: 'independientes (0)', wide: true }] }
    ],
    solve(V, { result }) {
      const R = result();
      let ES, VS, txtS;
      if (V.s('sm') === 'tipos') {
        const ts = V.raw.sev ? V.raw.sev.map((r, i) => {
          const p = T.parseNum(r.p), E = T.parseNum(r.E), sd = T.parseNum(r.sd);
          if ([p, E, sd].some(isNaN)) throw new Error(`Revisa el tipo ${i + 1}.`);
          return { nom: String(r.nom || 'Tipo ' + (i + 1)), p, E, sd };
        }) : [];
        if (!ts.length) throw new Error('Añade al menos un tipo de siniestro.');
        const nPm = P.normP(ts.map(t => t.p), 'los tipos de siniestro'); ts.forEach((t, i) => { t.p = nPm.ps[i]; }); if (nPm.note) R.warn(nPm.note.trim());
        ES = ts.reduce((a, t) => a + t.p * t.E, 0);
        const Vm = ts.reduce((a, t) => a + t.p * t.E * t.E, 0) - ES * ES, Ev = ts.reduce((a, t) => a + t.p * t.sd * t.sd, 0);
        VS = Vm + Ev;
        R.tile('𝔼(S)', ES).tile('σ²(S)', VS).tile('Índice de mixtura de S', Vm / Ev);
        R.key('ES', ES).key('VmS', Vm).key('EvS', Ev).key('VS', VS).key('IS', Vm / Ev);
        R.table('Severidad (mixtura de tipos)', ['Concepto', 'Valor'], [['Esperanza 𝔼(S)', ES], ['Varianza de medias', Vm], ['Media de varianzas', Ev], ['Varianza σ²(S)', VS], ['Índice de mixtura', Vm / Ev], ['Desviación σ(S)', Math.sqrt(VS)], ['Ratio media/desviación', ES / Math.sqrt(VS)], ['Ratio desviación/media', Math.sqrt(VS) / ES]]);
        R.step('Severidad: mixtura de tipos (ec. 27–28)', eq(`𝔼(S) = Σ pᵢ𝔼ᵢ = ${ts.map(t => `${f(t.p)} × ${f(t.E)}`).join(' + ')} = ${vv(ES)}`) +
          eq(`Varianza de medias = Σ pᵢ𝔼ᵢ² − 𝔼(S)² = ${ts.map(t => `${f(t.p)} × ${f(t.E)}²`).join(' + ')} − ${f(ES)}² = ${vv(Vm)}`) +
          eq(`Media de varianzas = Σ pᵢσᵢ² = ${ts.map(t => `${f(t.p)} × ${f(t.sd)}²`).join(' + ')} = ${vv(Ev)}`) +
          eq(`σ²(S) = ${f(Vm)} + ${f(Ev)} = ${vv(VS)}; &nbsp; I = ${f(Vm)}/${f(Ev)} = ${vv(Vm / Ev)}`));
        R.uses('mixt27', 'mixt28');
        R.ans('Severidad.', `La severidad es una mixtura de ${ts.map(t => `${t.nom.toLowerCase()} (probabilidad ${f(t.p)}, media ${f(t.E)}, desviación ${f(t.sd)})`).join(' y ')}. Su esperanza es ${ts.map(t => `${f(t.p)} × ${f(t.E)}`).join(' + ')} = ${vv(ES)}; la varianza de las medias vale ${vv(Vm)} y la media de las varianzas ${vv(Ev)}, luego σ²(S) = ${vv(VS)} (σ(S) = ${vv(Math.sqrt(VS))}) y el índice de mixtura es ${f(Vm)}/${f(Ev)} = ${vv(Vm / Ev)}. Ratio media/desviación = ${vv(ES / Math.sqrt(VS))}; desviación/media = ${vv(Math.sqrt(VS) / ES)}.`);
        txtS = 'mixtura';
      } else {
        ES = V.n('SE'); const sd = V.n('Ssd', { pos: 1 }); VS = sd * sd; txtS = 'dada';
        R.tile('𝔼(S)', ES).tile('σ²(S)', VS);
      }
      const Nb = P.buildFam(V, 'N_', P.FR), N = Nb.D, EN = N.mean, VN = N.var, ENN = VN + EN * EN - EN;
      const agg = r => { const Ev = EN * VS + r * VS * ENN, Vm = ES * ES * VN, Vy = Ev + Vm, E = EN * ES; return { E, Ev, Vm, Vy, I: Vm / Ev, sd: Math.sqrt(Vy) }; };
      const a0 = agg(0), rc = V.nOpt('rc'), a1 = rc ? agg(rc) : null;
      R.tile('𝔼(y)', a0.E, { main: true }).tile('σ²(y)', a0.Vy, { main: true }).tile('Índice de mixtura de y', a0.I, { main: true });
      if (a1) R.tile(`σ²(y) con r = ${f(rc)}`, a1.Vy, { main: true }).tile(`Índice con r = ${f(rc)}`, a1.I);
      R.key('Ey', a0.E).key('Evy', a0.Ev).key('Vmy', a0.Vm).key('Vy', a0.Vy).key('Iy', a0.I);
      if (a1) R.key('Evy_r', a1.Ev).key('Vy_r', a1.Vy).key('Iy_r', a1.I);
      const cols = ['Concepto', 'Independientes', ...(a1 ? [`Correlación r = ${f(rc)}`] : [])];
      const rowv = (l, k) => [l, a0[k], ...(a1 ? [a1[k]] : [])];
      R.table('Coste agregado y = S₁ + … + S<sub>N</sub>', cols, [rowv('Esperanza 𝔼(y)', 'E'), rowv('Media de varianzas 𝔼(σ²(y|N))', 'Ev'), rowv('Varianza de medias σ²(𝔼(y|N))', 'Vm'), rowv('Varianza σ²(y)', 'Vy'), rowv('Índice de mixtura', 'I'), rowv('Desviación σ(y)', 'sd'),
        ['Ratio media/desviación', a0.E / a0.sd, ...(a1 ? [a1.E / a1.sd] : [])], ['Ratio desviación/media', a0.sd / a0.E, ...(a1 ? [a1.sd / a1.E] : [])]]);
      R.step('Frecuencia', Nb.ex + eq(`𝔼(N) = ${vv(EN)}, σ²(N) = ${vv(VN)}, 𝔼(N(N − 1)) = σ²(N) + 𝔼(N)² − 𝔼(N) = ${vv(ENN)}`));
      R.step('Coste agregado (ec. 26)', eq(`𝔼(y) = 𝔼(N)𝔼(S) = ${f(EN)} × ${f(ES)} = ${vv(a0.E)}`) + eq(`Media de varianzas = 𝔼(N)σ²(S) = ${f(EN)} × ${f(VS)} = ${vv(a0.Ev)}`) +
        eq(`Varianza de medias = 𝔼(S)²σ²(N) = ${f(ES)}² × ${f(VN)} = ${vv(a0.Vm)}`) + eq(`σ²(y) = ${vv(a0.Vy)}; &nbsp; I = ${vv(a0.I)}`) +
        (a1 ? eq(`Con correlación r = ${f(rc)}: media de varianzas = ${f(EN)} × ${f(VS)} + ${f(rc)} × ${f(VS)} × ${f(ENN)} = ${vv(a1.Ev)}; σ²(y) = ${vv(a1.Vy)}; I = ${vv(a1.I)}`) : ''));
      R.uses(Nb.fam === 'poisson' ? 'pois' : Nb.fam === 'binneg' ? 'nb24' : null, 'comp26');
      R.ans('Coste agregado.', `${Nb.ex} Condicionando al número de siniestros, 𝔼(y) = 𝔼(N)𝔼(S) = ${f(EN)} × ${f(ES)} = ${vv(a0.E)}; la media de las varianzas es 𝔼(N)σ²(S) = ${vv(a0.Ev)} y la varianza de las medias 𝔼(S)²σ²(N) = ${vv(a0.Vm)}. Por tanto σ²(y) = ${vv(a0.Vy)}, σ(y) = ${vv(a0.sd)} y el índice de mixtura es ${f(a0.Vm)}/${f(a0.Ev)} = ${vv(a0.I)}.`);
      if (a1) {
        R.uses('corrS');
        R.ans('Severidades correlacionadas.', `Si dos severidades del mismo año tienen correlación ${f(rc)}, σ²(S₁ + … + S<sub>n</sub>) = nσ²(S) + n(n − 1)·${f(rc)}·σ²(S), y la media de las varianzas pasa a ser ${f(EN)} × ${f(VS)} + ${f(rc)} × ${f(VS)} × 𝔼(N(N − 1)) = ${vv(a1.Ev)} (𝔼(N(N − 1)) = ${f(ENN)}). La varianza de las medias no cambia, así que σ²(y) = ${vv(a1.Vy)}, σ(y) = ${vv(a1.sd)} y el índice de mixtura baja a ${vv(a1.I)}: la correlación aumenta el riesgo.`);
      }
      return R;
    },
    examples: [{
      id: 'oct20-mix', label: 'Clase 20 oct. 2026 · severidad leve/grave, N ∈ {0, 1, 2}, correlación 0,2',
      values: { sm: 'tipos', sev: [{ nom: 'Leve', p: '0,99', E: '10', sd: '100' }, { nom: 'Grave', p: '0,01', E: '1000', sd: '1.000.000' }], N_fam: 'tabla', N_tx: '0; 1; 2', N_tp: '0,7; 0,2; 0,1', rc: '0,2' },
      expect: [{ k: 'ES', l: '𝔼(S)', v: 19.9, src: 'hoja Oct_20_II' }, { k: 'VmS', l: 'Varianza de medias de S', v: 9702.99 }, { k: 'IS', l: 'Índice de mixtura de S', v: 9702.99 / 10000009900 }, { k: 'Ey', l: '𝔼(y)', v: 7.96 }, { k: 'Vy', l: 'σ²(y)', v: 0.4 * (9702.99 + 10000009900) + 19.9 * 19.9 * 0.44 }, { k: 'Vy_r', l: 'σ²(y) con r = 0,2', v: (9702.99 + 10000009900) * (0.2 + 0.1 * 2.4) + 19.9 * 19.9 * 0.44 }],
      note: 'Hoja de clase (no es de examen). En la hoja la desviación del siniestro grave es 1.000.000 (así se usa en «Media Varianzas»); si en un enunciado te dan la varianza, escribe su raíz.'
    }]
  });

  /* ═════════ T3 · Mixtura paramétrica ═════════ */
  const COND = {
    poisson: { lab: 'Poisson(Λ)', c: () => [1, 0], d: () => [0, 1, 0], txt: '𝔼(y|Λ) = Λ, σ²(y|Λ) = Λ' },
    exponencial: { lab: 'Exponencial de media Λ', c: () => [1, 0], d: () => [1, 0, 0], txt: '𝔼(y|Λ) = Λ, σ²(y|Λ) = Λ²' },
    normal: { lab: 'Normal N(Λ; σ₀)', c: () => [1, 0], d: V => [0, 0, V.n('s0') ** 2], txt: '𝔼(y|Λ) = Λ, σ²(y|Λ) = σ₀²' },
    binomial: { lab: 'Binomial(n; Λ)', c: V => [V.n('nb'), 0], d: V => [-V.n('nb'), V.n('nb'), 0], txt: '𝔼(y|Λ) = nΛ, σ²(y|Λ) = nΛ(1 − Λ)' },
    binneg: { lab: 'BN(α; θ = 1/(1+Λ))', c: V => [V.n('ab'), 0], d: V => [V.n('ab'), V.n('ab'), 0], txt: '𝔼(y|Λ) = αΛ, σ²(y|Λ) = α(Λ + Λ²)' },
    gamma: { lab: 'Gamma(α₀; β = Λ)', c: V => [V.n('ag'), 0], d: V => [V.n('ag'), 0, 0], txt: '𝔼(y|Λ) = α₀Λ, σ²(y|Λ) = α₀Λ²' },
    general: { lab: 'General: 𝔼(y|Λ) = c₁Λ + c₀, σ²(y|Λ) = d₂Λ² + d₁Λ + d₀', c: V => [V.n('c1'), V.n('c0')], d: V => [V.n('d2'), V.n('d1'), V.n('d0')], txt: 'según los coeficientes indicados' }
  };
  UI.tool({
    id: 't3-mixtura', tema: 3, title: 'Mixtura con parámetro aleatorio Λ',
    short: 'Media, varianza e índice de mixtura de y cuando y|Λ tiene una distribución conocida.',
    cuando: '«y|λ es … y λ sigue …»: calcular 𝔼(y), σ²(y) e índice de mixtura (heterogeneidad de la cartera).',
    que: 'La población es heterogénea: cada asegurado tiene un parámetro Λ distinto. Con el teorema de las probabilidades totales (ec. 27) se integra esa heterogeneidad: la media de y es la media de las medias condicionadas y la varianza se reparte en «varianza dentro» 𝔼(σ²(y|Λ)) y «varianza entre» σ²(𝔼(y|Λ)). Su cociente es el índice de mixtura I (ec. 28).',
    groups: [
      {
        title: 'Distribución condicionada y|Λ', fields: [
          { id: 'cond', type: 'sel', label: 'y|Λ', def: 'exponencial', opts: Object.entries(COND).map(([k, o]) => [k, o.lab]), wide: true },
          { id: 's0', type: 'num', label: 'σ₀', def: '1', show: v => v.cond === 'normal' },
          { id: 'nb', type: 'num', label: 'n', def: '10', show: v => v.cond === 'binomial' },
          { id: 'ab', type: 'num', label: 'α', def: '1', show: v => v.cond === 'binneg' },
          { id: 'ag', type: 'num', label: 'α₀', def: '1', show: v => v.cond === 'gamma' },
          { id: 'c1', type: 'num', label: 'c₁', def: '1', show: v => v.cond === 'general' }, { id: 'c0', type: 'num', label: 'c₀', def: '0', show: v => v.cond === 'general' },
          { id: 'd2', type: 'num', label: 'd₂', def: '0', show: v => v.cond === 'general' }, { id: 'd1', type: 'num', label: 'd₁', def: '1', show: v => v.cond === 'general' }, { id: 'd0', type: 'num', label: 'd₀', def: '0', show: v => v.cond === 'general' }
        ]
      },
      { title: 'Distribución del parámetro Λ', fields: P.famFields('L_', P.CF, ['gamma', 'normal', 'exponencial', 'uniforme', 'beta', 'lognormal', 'discreta'], 'normal', { L_normal_p_m: '100', L_normal_p_s: '10' }) },
      { title: 'Dato adicional (opcional)', fields: [{ id: 'sdy', type: 'num', label: 'σ(y) conocida (p. ej. simulada)', def: '', ph: 'opcional', help: 'Si el enunciado da σ(y), el índice se calcula también con ese dato', wide: true }] },
      {
        title: 'Credibilidad de Bühlmann (bonus-malus, tema 10)', optional: true, openIf: v => v.bh || v.bobs || v.btg, fields: [
          { id: 'bobs', type: 'text', label: 'Observaciones del asegurado', def: '', ph: 'p. ej. 0; 0; 0 (o vacío y usa h y la media)', wide: true },
          { id: 'bh', type: 'num', label: 'o bien: nº de datos h', def: '', ph: 'p. ej. 10' }, { id: 'bxb', type: 'num', label: 'y su media muestral', def: '', ph: '0 si no hubo siniestros' },
          { id: 'btg', type: 'num', label: 'Descuento objetivo (años sin siniestros)', def: '', ph: 'p. ej. 20 %', help: 'Cuántos años sin siniestros hacen falta para ese descuento', wide: true }
        ]
      }
    ],
    solve(V, { result }) {
      const R = result();
      const C = COND[V.s('cond')];
      const Lb = P.buildFam(V, 'L_', P.CF), Lam = Lb.D;
      const EL = Lam.mean, VL = Lam.var, EL2 = VL + EL * EL;
      const [c1, c0] = C.c(V), [d2, d1, d0] = C.d(V);
      const Ey = c1 * EL + c0, Ev = d2 * EL2 + d1 * EL + d0, Ve = c1 * c1 * VL, Vy = Ev + Ve, I = Ve / Ev;
      R.tile('𝔼(y)', Ey, { main: true }).tile('σ²(y)', Vy, { main: true }).tile('σ(y)', Math.sqrt(Vy)).tile('Índice de mixtura I', I, { main: true }).tile('1/I = h̃ (Bühlmann)', 1 / I, { hint: 'media de varianzas entre varianza de medias' });
      R.key('Iinv', 1 / I);
      R.key('E', Ey).key('V', Vy).key('sd', Math.sqrt(Vy)).key('I', I);
      R.step('Planteamiento', `y|Λ: ${C.lab} ⇒ ${C.txt}.<br>Λ: ${Lb.ex}` + eq(`𝔼(Λ) = ${vv(EL)}, &nbsp; σ²(Λ) = ${vv(VL)}, &nbsp; 𝔼(Λ²) = σ²(Λ) + 𝔼(Λ)² = ${vv(EL2)}`));
      R.step('Esperanza (ec. 27)', eq(`𝔼(y) = 𝔼(𝔼(y|Λ)) = ${c1 !== 1 ? f(c1) + '·' : ''}𝔼(Λ)${c0 ? ' + ' + f(c0) : ''} = ${vv(Ey)}`));
      R.step('Varianza (ec. 27)', eq(`𝔼(σ²(y|Λ)) = ${[d2 ? f(d2) + '·𝔼(Λ²)' : '', d1 ? f(d1) + '·𝔼(Λ)' : '', d0 ? f(d0) : ''].filter(Boolean).join(' + ') || '0'} = ${vv(Ev)}`) +
        eq(`σ²(𝔼(y|Λ)) = ${c1 !== 1 ? f(c1) + '²·' : ''}σ²(Λ) = ${vv(Ve)}`) + eq(`σ²(y) = 𝔼(σ²(y|Λ)) + σ²(𝔼(y|Λ)) = ${f(Ev)} + ${f(Ve)} = ${vv(Vy)} ⇒ σ(y) = ${vv(Math.sqrt(Vy))}`));
      R.step('Índice de mixtura (ec. 28)', eq(`I = σ²(𝔼(y|Λ))/𝔼(σ²(y|Λ)) = ${f(Ve)}/${f(Ev)} = ${vv(I)}`) +
        `Algunos enunciados llaman «índice de mixtura» al cociente inverso, media de varianzas entre varianza de medias: 1/I = ${f(Ev)}/${f(Ve)} = ${vv(1 / I)} (es el h̃ de la credibilidad de Bühlmann). ` +
        `Cuanto menor es I, más homogénea es la población (las medias condicionadas apenas varían) y menos necesario es un sistema <i>bonus–malus</i>. I no tiene unidades.`);
      R.uses('mixt27');
      R.ans('Esperanza.', `Como y es una mixtura, 𝔼(y) = 𝔼(𝔼(y|Λ)) = ${c1 !== 1 ? f(c1) + '·' : ''}𝔼(Λ)${c0 ? ' + ' + f(c0) : ''} = ${vv(Ey)}.`);
      R.ans('Varianza.', `σ²(y) = 𝔼(σ²(y|Λ)) + σ²(𝔼(y|Λ)), con ${C.txt}. Como 𝔼(Λ) = ${f(EL)} y 𝔼(Λ²) = ${f(EL2)}, se obtiene 𝔼(σ²(y|Λ)) = ${vv(Ev)} y σ²(𝔼(y|Λ)) = ${vv(Ve)}, luego σ²(y) = ${vv(Vy)} y σ(y) = ${vv(Math.sqrt(Vy))}.`);
      R.uses('mixt28');
      R.ans('Índice de mixtura.', `I = σ²(𝔼(y|Λ))/𝔼(σ²(y|Λ)) = ${f(Ve)}/${f(Ev)} = ${vv(I)}. ${I < 0.1 ? 'Es pequeño: la cartera es bastante homogénea.' : 'Indica una heterogeneidad apreciable entre asegurados, que justifica un sistema <i>bonus–malus</i>.'}`);
      R.ans('Simulación (si la piden).', `Para simular y: (1) se genera un valor λ de Λ (${Lb.ex.split(':')[0].replace(/<[^>]+>/g, '').replace(/^y ∼/, 'Λ ∼').replace(/\.$/, '')}) — p. ej. por inversión, λ = F<sub>Λ</sub><sup>−1</sup>(u) con u ∼ U(0, 1)${Lb.fam === 'normal' ? ', descartando valores no positivos' : ''}; (2) dado λ, se genera y|λ (${C.lab}), p. ej. también por inversión con otro uniforme independiente; (3) se repite M veces (p. ej. M = 100.000) y se estiman 𝔼(y) y σ(y) con la media y la desviación muestrales, y el índice de mixtura con I = σ²(𝔼(y|Λ))/(σ̂²(y) − σ²(𝔼(y|Λ))).`);
      if (V.s('cond') === 'poisson' && Lb.fam === 'gamma') R.note(`Poisson–Gamma: N ∼ BN(α = ${f(Lam.al)}; θ = 1/(1+β) = ${f(1 / (1 + Lam.be))}) y el índice de mixtura es β = ${f(Lam.be)} (ec. 29).`);
      if (Lb.fam === 'normal' && Lam.cdf(0) > 1e-6) R.warn(`Λ normal toma valores negativos con probabilidad ${f(Lam.cdf(0))}; el cálculo usa sólo sus momentos.`);
      const sdy = V.nOpt('sdy');
      if (sdy !== null) {
        const Ev2 = sdy * sdy - Ve, I2 = Ve / Ev2;
        R.tile('I con la σ(y) dada', I2, { main: true }); R.key('I2', I2);
        R.ans('Con la desviación del enunciado.', `Como σ²(y) = ${f(sdy)}² = 𝔼(σ²(y|Λ)) + σ²(𝔼(y|Λ)) y σ²(𝔼(y|Λ)) = ${f(Ve)}, el índice de mixtura vale I = ${f(Ve)}/(${f(sdy)}² − ${f(Ve)}) = ${vv(I2)}.`);
        R.step('Índice con la σ(y) del enunciado', eq(`𝔼(σ²(y|Λ)) = σ²(y) − σ²(𝔼(y|Λ)) = ${f(sdy)}² − ${f(Ve)} = ${f(Ev2)} ⇒ I = ${f(Ve)}/${f(Ev2)} = ${vv(I2)}`) +
          `La diferencia con el valor exacto (${f(I)}) se debe a que la σ(y) dada procede de una simulación.`);
      }
      const bob = V.list('bobs', { opt: true }), bh = V.nOpt('bh'), btg = V.nOpt('btg');
      if (bob.length || bh !== null || btg !== null) {
        const h = bob.length || bh || 0, xb = bob.length ? bob.reduce((a, b) => a + b, 0) / bob.length : (V.nOpt('bxb') || 0);
        const EvB = sdy !== null ? sdy * sdy - Ve : Ev;
        if (h > 0) P.buhlmann(R, { E: Ey, Ev: EvB, Ve, h, xb, sym: 'y', target: btg });
        else if (btg !== null) { const ht = EvB / Ve, X = btg >= 1 ? btg / 100 : btg, hx = ht * X / (1 - X); R.tile(`Años para un descuento del ${pct(X)}`, String(Math.ceil(hx - 1e-9))); R.key('hTarget', hx); R.uses('buhl'); R.ans(`Años sin siniestros para un descuento del ${pct(X)}.`, `Por Bühlmann, sin siniestros 𝔼 a posteriori = 𝔼(y)/(Ih + 1) con I = ${f(1 / ht)}. La reducción hI/(hI + 1) ≥ ${f(X)} exige h ≥ (1/I)(1/(1 − ${f(X)}) − 1) = ${vv(hx)}, es decir, ${Math.ceil(hx - 1e-9)} años.`); }
        if (sdy !== null) R.note('Bühlmann se ha calculado con la σ(y) del enunciado (como hace la solución oficial).');
      }
      return R;
    },
    examples: [
      { id: 'e20-4c', label: 'Enero 2020 · Ej. 4c · N ∈ {0, 1, 2} con p = IP(N = 0) ∼ Beta(1; 1)', values: { cond: 'general', c1: '−1,5', c0: '1,5', d2: '−2,25', d1: '2', d0: '0,25', L_fam: 'beta', L_beta_mode: 'p', L_beta_p_u: '1', L_beta_p_v: '1', bobs: '2; 2; 2; 0' },
        expect: [{ k: 'E', l: '𝔼(N)', v: 0.75 }, { k: 'V', l: 'σ²(N)', v: 0.6875 }, { k: 'Iinv', l: '«Índice» = media de varianzas / varianza de medias', v: 2.666666667 }, { k: 'Eb', l: '𝔼(N|2, 2, 2, 0) por Bühlmann', v: 1.2, src: 'cálculo' }],
        note: '𝔼(N|p) = (3/2)(1 − p) = 1,5 − 1,5p y σ²(N|p) = (5/2)(1 − p) − (9/4)(1 − p)² = 0,25 + 2p − 2,25p². El examen llama «índice de mixtura» al cociente inverso del de la ec. (28).' },
      {
        id: 'j25-4', label: 'Junio 2025 · Ej. 4 · y|λ exponencial, λ ∼ N(100; 10); Bühlmann tras diez años sin siniestros',
        values: { cond: 'exponencial', L_fam: 'normal', L_normal_p_m: '100', L_normal_p_s: '10', sdy: '100,47', bh: '10', bxb: '0' },
        expect: [{ k: 'E', l: '𝔼(y)', v: 100 }, { k: 'I2', l: 'Índice I (con σ(y) = 100,47)', v: 0.010005782, src: 'σ(y) por Monte Carlo' }, { k: 'ht', l: 'h̃ = 1/I', v: 99.942209, src: 'solución' }]
      },
      {
        id: 'nov10-buhl', label: 'Clase 10 nov. 2026 · y|Λ exponencial, Λ ∼ N(100; 10): diez años sin siniestros y años para un 20 %',
        values: { cond: 'exponencial', L_fam: 'normal', L_normal_p_m: '100', L_normal_p_s: '10', bh: '10', bxb: '0', btg: '20%' },
        expect: [{ k: 'I', l: 'I', v: 0.00990099 }, { k: 'Eb', l: '𝔼 a posteriori', v: 90.99099099 }, { k: 'redB', l: 'Reducción', v: 0.09009009 }, { k: 'hTarget', l: 'h para un 20 %', v: 25.25 }]
      },
      {
        id: 'e26-2c', label: 'Enero 2026 · Ej. 2c · N|λ BN(1; 1/(1+λ)), λ exponencial de media 2; Bühlmann con 0, 2, 2, 0',
        values: { cond: 'binneg', ab: '1', L_fam: 'exponencial', L_exponencial_p_b: '2', bobs: '0; 2; 2; 0' },
        expect: [{ k: 'I', l: 'Índice de mixtura I', v: 0.4, src: 'fórmula cerrada' }, { k: 'Eb', l: '𝔼 a posteriori (Bühlmann)', v: 1.076923077, src: 'solución (errata)' }, { k: 'redB', l: 'Reducción', v: 0.461538462, src: 'solución (errata)' }],
        note: '<b>Errata en la solución oficial del apartado c):</b> con I = 0,4, h̃ = 2,5 y media muestral (0 + 2 + 2 + 0)/4 = 1, su propia fórmula 1/(1 + 4I)·𝔼(λ) + 4I/(1 + 4I)·1 da 0,3846 × 2 + 0,6154 × 1 = 1,3846 (reducción del 30,77 %), no 1,0769 (que saldría con una media muestral de 0,5).'
      },
      { id: 'j24-4', label: 'Junio 2024 · Ej. 4 · N|λ Poisson, λ ∼ Gamma(5; 0,1)', values: { cond: 'poisson', L_fam: 'gamma', L_gamma_mode: 'p', L_gamma_p_a: '5', L_gamma_p_b: '0,1' }, expect: [{ k: 'I', l: 'Índice de mixtura (= β)', v: 0.1 }] }
    ]
  });

  /* ═════════ T3 · Mixtura de tipos ═════════ */
  UI.tool({
    id: 't3-tipos', tema: 3, title: 'Mixtura de tipos de asegurados',
    short: 'Varios tipos con distinta distribución de N: distribución conjunta, índice de mixtura, CVaR y prima.',
    cuando: '«Los dos tipos de asegurados son los del cuadro…»: distribución del asegurado genérico, su riesgo y su prima. Opcionalmente actualiza los pesos con Bayes tras observar siniestros.',
    que: 'Mezcla las distribuciones de los tipos de asegurado con sus pesos (teorema de las probabilidades totales) para obtener la distribución del asegurado genérico, su media, su CVaR y su prima. Si hay observaciones, el teorema de Bayes actualiza los pesos y se compara la prima del asegurado observado con la del genérico.',
    groups: [
      {
        title: 'Tipos', fields: [
          { id: 'vals', type: 'text', label: 'Valores de N (separados por «;»)', def: '0; 1; 2; 3', wide: true },
          { id: 'tipos', type: 'rows', label: 'Cada tipo: peso en la cartera y probabilidades de cada valor', cols: [{ id: 'w', label: 'Peso', w: '22%' }, { id: 'p', label: 'Probabilidades (separadas por «;»)', type: 'text' }], def: [{ w: '0,5', p: '0,5; 0,3; 0,2; 0' }, { w: '0,5', p: '0,3; 0,4; 0,2; 0,1' }] },
          { id: 'obs', type: 'text', label: 'Observaciones de un asegurado (opcional)', def: '', ph: 'p. ej. 0; 0 (dos años sin siniestros)', help: 'Valores observados de N (o del coste, si los valores de la tabla son costes). Activa Bayes y Bühlmann', wide: true },
          { id: 'buOn', type: 'check', label: 'Calcular también con la credibilidad de Bühlmann', def: true, wide: true }
        ]
      },
      {
        title: 'Riesgo y prima', fields: [
          { id: 'sevc', type: 'num', label: 'Severidad constante (y = c·N)', def: '1', help: '1 si sólo interesa N; 1000 si «la severidad será siempre 1000»', wide: true },
          ...P.measFields('m_', { type: 'CVaR', lvl: '86' }),
          { id: 'A', type: 'num', label: 'a (de 𝔼)', def: '1,1' }, { id: 'B', type: 'num', label: 'b (de ρ)', def: '0,1' }
        ]
      }
    ],
    solve(V, { result }) {
      const R = result();
      const xs = V.list('vals'); const tipos = (V.raw.tipos || []).map((r, i) => {
        const w = T.parseNum(r.w); if (!(w >= 0)) throw new Error(`Peso no válido en el tipo ${i + 1}.`);
        const ps = String(r.p || '').split(/[;|]+/).map(s => s.trim()).filter(Boolean).map(T.parseNum);
        if (ps.length !== xs.length || ps.some(isNaN)) throw new Error(`El tipo ${i + 1} debe tener ${xs.length} probabilidades.`);
        const nP = P.normP(ps, `el tipo ${i + 1}`);
        return { w, w0: w, ps: nP.ps, note: nP.note };
      });
      tipos.forEach(t => { if (t.note) R.warn(t.note.trim()); });
      const cS = V.n('sevc'), ys = xs.map(x => x * cS), yl = cS === 1 ? 'N' : 'y';
      if (!tipos.length) throw new Error('Añade al menos un tipo.');
      const sw = tipos.reduce((a, t) => a + t.w, 0); tipos.forEach(t => t.w /= sw);
      tipos.forEach(t => { t.E = t.ps.reduce((a, p, i) => a + p * xs[i], 0); t.V = t.ps.reduce((a, p, i) => a + p * (xs[i] - t.E) ** 2, 0); });
      const sp = P.buildMeas(V, 'm_'), A = V.n('A'), B = V.n('B');
      R.step('Media y varianza de cada tipo', eq(tipos.map((t, i) => `Tipo ${i + 1}: 𝔼(N|tipo) = ${t.ps.map((p, j) => `${f(p)} × ${f(xs[j])}`).join(' + ')} = ${vv(t.E)}, &nbsp; σ² = ${f(t.V)}`).join('<br>')));
      const analyse = (ws, title) => {
        const pm = xs.map((_, j) => tipos.reduce((a, t, i) => a + ws[i] * t.ps[j], 0));
        const D = T.discreteTable(ys, pm);
        const Ev = tipos.reduce((a, t, i) => a + ws[i] * t.V, 0), EE = tipos.reduce((a, t, i) => a + ws[i] * t.E, 0), Ve = tipos.reduce((a, t, i) => a + ws[i] * (t.E - EE) ** 2, 0);
        const rho = T.risk(D, sp), Pi = A * D.mean + B * rho;
        R.step(title, `Teorema de las probabilidades totales:` + eq(xs.map((x, j) => `IP(${yl} = ${f(ys[j])}) = ${tipos.map((t, i) => `${f(ws[i])} × ${f(t.ps[j])}`).join(' + ')} = ${vv(pm[j])}`).join('<br>')) +
          eq(`𝔼(${yl}) = ${vv(D.mean)}, &nbsp; σ²(${yl}) = ${f(D.var)}, &nbsp; I = σ²(𝔼(N|tipo))/𝔼(σ²(N|tipo)) = ${f(Ve)}/${f(Ev)} = ${vv(Ve / Ev)}`) +
          eq(P.genExplain(sp, D, rho, 'discreta')) + eq(`Π = ${f(A)} × ${f(D.mean)} + ${f(B)} × ${f(rho)} = ${vv(Pi)}`));
        return { D, rho, Pi, I: Ve / Ev };
      };
      // Cuadro por tipo (pólizas, coste esperado, desviación, riesgo)
      const per = tipos.map(t => { const Dt = T.discreteTable(ys, t.ps); return { Dt, rho: T.risk(Dt, sp) }; });
      R.table(`Cuadro por tipo de asegurado (y = ${cS === 1 ? 'N' : f(cS) + '·N'})`, ['Tipo', 'Pólizas / peso', 'Coste esperado', 'Desviación', rn(sp)], tipos.map((t, i) => [String(i + 1), t.w0, per[i].Dt.mean, per[i].Dt.sd, per[i].rho]), { top: true });
      per.forEach((x, i) => R.key('Et' + (i + 1), x.Dt.mean).key('sdt' + (i + 1), x.Dt.sd).key('rt' + (i + 1), x.rho));
      R.step('Coste de cada tipo', `Para cada tipo, y = ${cS === 1 ? 'N' : f(cS) + '·N'} toma los valores ${ys.map(y => f(y)).join(', ')}:` + eq(tipos.map((t, i) => `Tipo ${i + 1}: 𝔼(y) = ${f(per[i].Dt.mean)}, σ(y) = ${f(per[i].Dt.sd)}, ${rn(sp)} = ${vv(per[i].rho)}`).join('<br>')));
      R.ans('Cuadro por tipo.', `Para cada grupo (con y = ${cS === 1 ? 'N' : f(cS) + '·N'}), el coste esperado es 𝔼(y|G) = Σ y·IP(y|G), la desviación σ(y|G) = √(Σ y²·IP(y|G) − 𝔼(y|G)²) y el riesgo ${rn(sp)} se obtiene de la distribución del grupo. El cuadro pedido es:<br>${tipos.map((t, i) => `G${i + 1} (${f(t.w0)} pólizas/peso): coste esperado ${f(per[i].Dt.mean)}; desviación ${f(per[i].Dt.sd)}; ${rn(sp)} = ${vv(per[i].rho)}`).join('<br>')}.`);
      const g = analyse(tipos.map(t => t.w), 'Asegurado genérico');
      R.tile('𝔼(N) genérico', g.D.mean, { main: true }).tile(rn(sp, '−y') + ' genérico', g.rho, { main: true }).tile('Prima genérica', g.Pi).tile('Índice de mixtura', g.I);
      R.key('E', g.D.mean).key('rho', g.rho).key('prima', g.Pi).key('I', g.I);
      R.uses('tpt', 'mixt28', MK(sp.type), 'prima66');
      const ansTipo = (q, ws, quien) => `Para ${quien}, por el teorema de las probabilidades totales, ${xs.map((x, j) => `IP(N = ${f(x)}) = ${vv(xs.map((_, jj) => tipos.reduce((a, t, i) => a + ws[i] * t.ps[jj], 0))[j])}`).join('; ')}. Su frecuencia esperada es ${vv(q.D.mean)}, ${rn(sp)} = ${vv(q.rho)} y la prima es ${f(A)} × ${f(q.D.mean)} + ${f(B)} × ${f(q.rho)} = ${vv(q.Pi)}.`;
      R.ans('Asegurado genérico.', ansTipo(g, tipos.map(t => t.w), 'un asegurado genérico'));
      const obs = V.list('obs', { opt: true });
      if (obs.length) {
        const lik = tipos.map(t => obs.reduce((a, o) => { const j = xs.findIndex(x => Math.abs(x - o) < 1e-12); if (j < 0) throw new Error(`El valor observado ${f(o)} no está entre los valores de N.`); return a * t.ps[j]; }, 1));
        const den = tipos.reduce((a, t, i) => a + t.w * lik[i], 0);
        const post = tipos.map((t, i) => t.w * lik[i] / den);
        R.step('Pesos a posteriori (teorema de Bayes)', eq(post.map((p, i) => `IP(tipo ${i + 1} | obs.) = ${f(tipos[i].w)} × ${f(lik[i])}/${f(den)} = ${vv(p)}`).join('<br>')));
        const q = analyse(post, 'Asegurado observado (pesos a posteriori)');
        const redE = (g.D.mean - q.D.mean) / g.D.mean, redP = (g.Pi - q.Pi) / g.Pi;
        R.tile('𝔼(N) a posteriori', q.D.mean).tile(rn(sp, '−y') + ' a posteriori', q.rho).tile(redE >= 0 ? 'Reducción con PPVE' : 'Recargo con PPVE', Math.abs(redE), { pct: 1 }).tile(redP >= 0 ? 'Reducción con Π' : 'Recargo con Π', Math.abs(redP), { pct: 1 });
        R.uses('bayes'); R.key('post1', post[0]).key('rhoPost', q.rho).key('primaPost', q.Pi).key('redE', redE).key('redP', redP);
        R.ans('Probabilidades a posteriori.', `Aplicando el teorema de Bayes a las observaciones (${obs.map(o => f(o)).join(', ')}): ${post.map((p, i) => `IP(tipo ${i + 1}) = ${vv(p)}`).join('; ')}.`);
        R.ans('Asegurado observado.', ansTipo(q, post, 'nuestro asegurado'));
        R.ans('Reducción / recargo.', `Bajo el principio del valor esperado, el porcentaje de ${redE >= 0 ? 'reducción' : 'recargo'} es |${f(g.D.mean)} − ${f(q.D.mean)}|/${f(g.D.mean)} = ${vv(Math.abs(redE))} ≈ ${pct(Math.abs(redE))}. Con el principio Π, el de ${redP >= 0 ? 'reducción' : 'recargo'} es |${f(g.Pi)} − ${f(q.Pi)}|/${f(g.Pi)} = ${vv(Math.abs(redP))} ≈ ${pct(Math.abs(redP))}.`);
        R.step('Recargo / reducción', eq(`PPVE: (${f(g.D.mean)} − ${f(q.D.mean)})/${f(g.D.mean)} = ${vv(redE)} (${pct(redE)})`) + eq(`Principio Π: (${f(g.Pi)} − ${f(q.Pi)})/${f(g.Pi)} = ${vv(redP)} (${pct(redP)})`) + 'Positivo = reducción; negativo = recargo.');
        if (obs.length > 1) { // Bayes paso a paso, como en las soluciones del profesor
          let w = tipos.map(t => t.w); const rowsB = [];
          obs.forEach((o, k) => { const j = xs.findIndex(x => Math.abs(x - o) < 1e-12); const den2 = tipos.reduce((a, t, i) => a + w[i] * t.ps[j], 0); w = tipos.map((t, i) => w[i] * t.ps[j] / den2); rowsB.push([`Tras ${f(o)} (${k + 1}ª)`, ...w]); });
          R.table('Teorema de Bayes aplicado observación a observación', ['Observación', ...tipos.map((_, i) => `IP(tipo ${i + 1})`)], rowsB);
        }
        if (V.b('buOn')) {
          const Evy = tipos.reduce((a, t) => a + t.w * t.V, 0) * cS * cS, EE = tipos.reduce((a, t) => a + t.w * t.E, 0), Vey = tipos.reduce((a, t) => a + t.w * (t.E - EE) ** 2, 0) * cS * cS;
          const xb = obs.reduce((a, b) => a + b, 0) / obs.length * cS;
          const B = P.buhlmann(R, { E: g.D.mean, Ev: Evy, Ve: Vey, h: obs.length, xb, sym: yl === 'N' ? 'N' : 'y', quien: 'este asegurado' });
          R.ans('¿Por qué no coinciden Bayes y Bühlmann?', `Por Bayes (exacto) el ${redE >= 0 ? 'descuento' : 'recargo'} es ${pct(Math.abs(redE))} y por Bühlmann ${pct(Math.abs(B.red))}. Bühlmann aproxima 𝔼(Λ|datos) por una recta en la media muestral (ec. 111): exige que el error tenga covarianza nula con la muestra, y la covarianza nula no implica independencia, así que 𝔼(ε|datos) no es exactamente cero. Sólo hay coincidencia exacta en casos como Gamma–Poisson, Beta–Binomial o con normalidad; aquí la respuesta exacta es la bayesiana y la de Bühlmann es una aproximación.`);
        }
      }
      return R;
    },
    examples: [
      { id: 'e22-4a', label: 'Enero 2022 · Ej. 4a · dos grupos, dos años sin siniestros', values: { vals: '0; 1; 2', tipos: [{ w: '0,5', p: '0,5; 0,4; 0,1' }, { w: '0,5', p: '0,4; 0,3; 0,3' }], obs: '0; 0', sevc: '1', m_rho: 'CVaR', m_lvl: '90', A: '1', B: '0' },
        expect: [{ k: 'post1', l: 'IP(G1 | 0, 0)', v: 0.609756098 }, { k: 'redE', l: 'Reducción PPVE', v: 0.043902439 }] },
      { id: 'e19-34', label: 'Enero 2019 · Ej. 3-4 · tres grupos, severidad 1000, VaR 85 %, tres años sin siniestros', values: { vals: '0; 1; 2', tipos: [{ w: '30000', p: '0,5; 0,4; 0,1' }, { w: '30000', p: '0,4; 0,4; 0,2' }, { w: '40000', p: '0,4; 0,3; 0,3' }], obs: '0; 0; 0', sevc: '1000', m_rho: 'VaR', m_lvl: '85', A: '1', B: '0' },
        expect: [{ k: 'Et1', l: '𝔼(y|G1)', v: 600 }, { k: 'sdt1', l: 'σ(y|G1)', v: 663.3249581 }, { k: 'rt1', l: 'VaR<sub>85%</sub>(y|G1)', v: 1000 }, { k: 'rt2', l: 'VaR<sub>85%</sub>(y|G2)', v: 2000 }, { k: 'rt3', l: 'VaR<sub>85%</sub>(y|G3)', v: 2000 }, { k: 'post1', l: 'IP(G1 | 0, 0, 0)', v: 0.455650061 }, { k: 'redE', l: 'Reducción PPVE', v: 0.05408867, src: 'errata: debe ser 5,13 %' }],
        note: '<b>Errata en la solución oficial:</b> con sus propias cifras, (0,78 − 0,739975699)/0,78 = 0,0513 ≈ 5,13 %, no 5,41 %. La media a posteriori 0,739975699 y las probabilidades a posteriori sí coinciden.' },
      { id: 'bu-ej1', label: 'Clase · Bühlmann frente a Bayes · grupos A (80 %) y B, una observación Λ = 2', values: { vals: '0; 1; 2; 3', tipos: [{ w: '0,8', p: '0,5; 0,3; 0,2; 0' }, { w: '0,2', p: '0,3; 0,3; 0,3; 0,1' }], obs: '2', buOn: true, sevc: '1', m_rho: 'CVaR', m_lvl: '90', A: '1', B: '0' },
        expect: [{ k: 'post1', l: 'IP(A | Λ = 2)', v: 0.727272727 }, { k: 'redE', l: 'Bayes: recargo (negativo)', v: -0.045454545 }, { k: 'ht', l: 'h̃', v: 17 }, { k: 'redB', l: 'Bühlmann: recargo (negativo)', v: -0.083333333 }] },
      { id: 'bu-ej2', label: 'Clase · Bühlmann frente a Bayes · grupos A/B/C con valores del coste, y = 1000, 3000, 3000, 2000; Π = 1,1𝔼 + 0,09VaR99', values: { vals: '1000; 1500; 2000; 3000', tipos: [{ w: '0,5', p: '0,1; 0,3; 0,4; 0,2' }, { w: '0,4', p: '0,2; 0,3; 0,4; 0,1' }, { w: '0,1', p: '0,4; 0,3; 0,3; 0' }], obs: '1000; 3000; 3000; 2000', buOn: true, sevc: '1', m_rho: 'VaR', m_lvl: '99', A: '1,1', B: '0,09' },
        expect: [{ k: 'ht', l: 'h̃', v: 13.63070539 }, { k: 'z', l: 'z', v: 0.226876912 }, { k: 'Eb', l: '𝔼 Bühlmann', v: 1917.557072 }, { k: 'redB', l: 'Bühlmann: recargo (negativo)', v: -0.053602787 }, { k: 'post1', l: 'IP(A | datos)', v: 0.714285714 }, { k: 'redE', l: 'Bayes: recargo (negativo)', v: -0.040031397 }, { k: 'prima', l: 'Prima a priori', v: 2272 }, { k: 'primaPost', l: 'Prima a posteriori', v: 2352.142857 }, { k: 'redP', l: 'Recargo con Π (negativo)', v: -0.035274145 }] },
      { id: 'e15-4', label: 'Enero 2015 · Ej. 4 · tres tipos k (30/30/40 %), datos 0, 1, 0, 2, 0: Bühlmann y Bayes', values: { vals: '0; 1; 2; 3', tipos: [{ w: '0,3', p: '0,1; 0,2; 0,3; 0,4' }, { w: '0,3', p: '0,15; 0,25; 0,3; 0,3' }, { w: '0,4', p: '0,2; 0,2; 0,3; 0,3' }], obs: '0; 1; 0; 2; 0', buOn: true, sevc: '1', m_rho: 'CVaR', m_lvl: '90', A: '1', B: '0' } },
      { id: 'e14-4b', label: 'Enero 2014 · Ej. 4b · dos distribuciones del coste (50/50), y = 100, 150, 100: Bühlmann', values: { vals: '100; 150; 200', tipos: [{ w: '0,5', p: '0,8; 0,2; 0' }, { w: '0,5', p: '0,5; 0,3; 0,2' }], obs: '100; 150; 100', buOn: true, sevc: '1', m_rho: 'CVaR', m_lvl: '90', A: '1', B: '0' }, note: 'El peso de la muestra en función de h es z = h/(h + h̃), con el h̃ que da la calculadora.' },
      { id: 'e17-4a', label: 'Enero 2017 · Ej. 4a · cuatro grupos, observaciones N = 3 y N = 2', values: { vals: '0; 1; 2; 3; 4', tipos: [{ w: '50', p: '0,5; 0,2; 0,2; 0,1; 0' }, { w: '30', p: '0,4; 0,2; 0,2; 0,1; 0,1' }, { w: '15', p: '0,3; 0,2; 0,2; 0,2; 0,1' }, { w: '5', p: '0,1; 0,2; 0,2; 0,2; 0,3' }], obs: '3; 2', sevc: '1', m_rho: 'CVaR', m_lvl: '90', A: '1', B: '0' } },{
      id: 'j23-3', label: 'Junio 2023 · Ej. 3 · dos tipos, dos años sin siniestros',
      values: { vals: '0; 1; 2; 3', tipos: [{ w: '0,5', p: '0,5; 0,3; 0,2; 0' }, { w: '0,5', p: '0,3; 0,4; 0,2; 0,1' }], obs: '0; 0', m_rho: 'CVaR', m_lvl: '86', A: '1,1', B: '0,1' },
      expect: [{ k: 'post1', l: 'IP(tipo I | 0, 0)', v: 0.735294118 }, { k: 'redE', l: 'Reducción PPVE', v: 0.104575163 }, { k: 'rho', l: 'CVaR<sub>86%</sub> genérico', v: 2.357142857 }, { k: 'rhoPost', l: 'CVaR<sub>86%</sub> particular', v: 2.18907563 }, { k: 'prima', l: 'Prima genérica', v: 1.225714286 }, { k: 'primaPost', l: 'Prima particular', v: 1.105378151 }, { k: 'redP', l: 'Reducción con Π', v: 0.098176333 }]
    }]
  });

  /* ═════════ T4 · Medidas de riesgo ═════════ */
  UI.tool({
    id: 't4-medidas', tema: 4, title: 'Calculadora de medidas de riesgo', tag: 'normal, log-normal, cartera…',
    short: 'VaR, CVaR, Wang, SW, DPT, expectil, entrópica… de una normal, una cartera, una compuesta o una discreta; y la prima.',
    cuando: 'te piden ρ(−y) o ρ<sub>(0,1)</sub> (p. ej. «la SW₁ de la normal estándar», «el expectil 𝔈₀,₃»), o una prima Π = a𝔼(y) + bρ(−y).',
    que: 'Calcula el riesgo ρ(−y) de la siniestralidad y (y es una pérdida, como en los exámenes). Si y es normal —por ejemplo una cartera de pólizas independientes— basta con el riesgo de la normal estándar: ρ(−y) = m + ρ<sub>(0,1)</sub>·s (ec. 44). En otro caso se usa la definición de cada medida sobre la distribución de y.',
    groups: [
      { title: 'Siniestralidad y', fields: P.srcFields('y_', ['cont', 'cartera', 'compuesta', 'discreta'], 'cont') },
      {
        title: 'Stop-loss: riesgos de (y − U)⁺ (opcional)', optional: true, openIf: v => v.slU, fields: [
          { id: 'slU', type: 'num', label: 'Deducible / prioridad U', def: '', ph: 'vacío = riesgos de y', help: 'Calcula las medidas del riesgo cedido (y − U)⁺, como la macro «Riesgos_SL». Con U = 0 se recupera y si y ≥ 0.', wide: true }
        ]
      },
      {
        title: 'Medidas', fields: [
          { id: 'meds', type: 'rows', label: 'Una fila por medida. Parámetro: nivel en % (VaR, CVaR), a (Wang, SW, DPT…) o μ (expectil, entrópica)', cols: [{ id: 't', label: 'Medida', type: 'sel', opts: P.MEAS.map(m => [m[0], m[0] === 'SigmaE' ? 'ρσ' : m[0] === 'Entropica' ? 'Entrópica' : m[0] === 'SPow' ? 'g(t)=tᵃ' : m[0]]), def: 'CVaR', w: '46%' }, { id: 'p', label: 'Parámetro', type: 'text' }], def: [{ t: 'VaR', p: '95' }, { t: 'CVaR', p: '95' }, { t: 'SW', p: '1' }, { t: 'Expectil', p: '0,3' }] }
        ]
      },
      {
        title: 'Prima (opcional)', optional: true, openIf: v => v.pr, fields: [
          { id: 'pr', type: 'check', label: 'Calcular Π(y) = a·𝔼(y) + b·ρ(−y)', def: false },
          { id: 'A', type: 'num', label: 'a', def: '1,05', show: v => v.pr }, { id: 'B', type: 'num', label: 'b', def: '0,1', show: v => v.pr },
          { id: 'prow', type: 'num', label: 'ρ = medida de la fila nº', def: '1', show: v => v.pr }
        ]
      }
    ],
    solve(V, { result }) {
      const R = result();
      let src = P.buildSrc(V, 'y_'), D = src.D;
      const slU = V.nOpt('slU');
      if (slU !== null) {
        const y0 = src;
        D = T.transformDist(y0.D, { a0: 0, layers: [{ a: 1, U: slU }] });
        src = { D, normal: false, kind: 'stoploss', y0, U: slU, m: D.mean, s: D.sd,
          ex: `${y0.ex}<br>Se pide el riesgo del stop-loss z = (y − ${f(slU)})<sup>+</sup> (lo que paga la reaseguradora con deducible ${f(slU)}):` +
            eq(P.slFormula(y0, slU)) + eq(`IP(z = 0) = IP(y ≤ ${f(slU)}) = ${vv(y0.D.cdf(slU))}; &nbsp; σ(z) = ${vv(D.sd)}`) +
            `z es función no decreciente de y, luego VaR<sub>1−t</sub>(−z) = (VaR<sub>1−t</sub>(−y) − U)<sup>+</sup> para todo t: las medidas de distorsión y espectrales se obtienen integrando esos VaR con su función de pesos.` };
      }
      const specs = (V.raw.meds || []).map((r, i) => {
        if (r.t === 'WCVaR') { // «80:0,5; 90:0,5»
          const pr = String(r.p || '').split(/[;|]+/).map(x => x.trim()).filter(Boolean).map(x => x.split(':').map(T.parseNum));
          if (!pr.length || pr.some(x => x.length !== 2 || x.some(isNaN))) throw new Error(`Fila ${i + 1}: escribe el WCVaR como «80:0,5; 90:0,5» (nivel:peso).`);
          return { type: 'WCVaR', mus: pr.map(x => P.specOf('CVaR', x[0]).mu), ks: pr.map(x => x[1]) };
        }
        const par = r.t === 'SigmaE' ? NaN : T.parseNum(r.p); return P.specOf(r.t, par, 'la fila ' + (i + 1));
      });
      if (!specs.length) throw new Error('Añade al menos una medida.');
      R.step('Distribución de y', src.ex);
      const vals = specs.map(sp => T.risk(D, sp));
      const rows = specs.map((sp, i) => src.normal ? [String(i + 1), rn(sp), sp.type === 'Entropica' ? '—' : T.rhoStd(sp), vals[i], sp.type === 'Entropica' ? '—' : T.fmtPctLevel(T.Phi(T.rhoStd(sp)))] : [String(i + 1), rn(sp), vals[i]]);
      R.table('Resultados', src.normal ? ['#', 'Medida', 'ρ<sub>(0,1)</sub>', 'ρ(−y)', 'Nivel de VaR equivalente Φ(ρ<sub>(0,1)</sub>)'] : ['#', 'Medida', 'ρ(−y)'], rows, { top: true });
      specs.forEach((sp, i) => R.key('r' + (i + 1), vals[i]).key('s' + (i + 1), src.normal && sp.type !== 'Entropica' ? T.rhoStd(sp) : null));
      R.tile('𝔼(y)', D.mean).tile('σ(y)', D.sd);
      let cvAns = null;
      specs.slice(0, 4).forEach((sp, i) => R.tile(rn(sp), vals[i], { main: true }));
      if (src.normal) {
        R.step('Riesgo de una normal (ec. 44)', `Todas estas medidas (salvo la entrópica) son invariantes por traslaciones y homogéneas, luego` + eq(`ρ(−y) = m + ρ<sub>(0,1)</sub>·s = ${f(src.m)} + ρ<sub>(0,1)</sub> × ${f(src.s)}`) + 'donde ρ<sub>(0,1)</sub> es el riesgo de la N(0,1).');
        specs.forEach((sp, i) => R.step(rn(sp), sp.type === 'Entropica' ? eq(`ℰ<sub>μ</sub>(−y) = m + μs²/2 = ${f(src.m)} + ${f(sp.mu)} × ${f(src.s)}²/2 = ${vv(vals[i])}`) :
          eq(P.std01Explain(sp)) + (src.m !== 0 || src.s !== 1 ? eq(`${rn(sp)} = ${f(src.m)} + ${f(T.rhoStd(sp))} × ${f(src.s)} = ${vv(vals[i])}`) : '')));
        const cv = specs.filter(sp => sp.type === 'CVaR');
        if (cv.length) {
          const sens = mu => { const z = T.PhiInv(mu); return src.s * (-z * mu - T.phi(z)) / (mu * mu); };
          R.step('CVaR en función de μ y su sensibilidad', eq(`CVaR<sub>1−μ</sub>(−y) = m + s·φ(Φ<sup>−1</sup>(μ))/μ = ${f(src.m)} + ${f(src.s)}·φ(Φ<sup>−1</sup>(μ))/μ`) +
            eq(`∂CVaR<sub>1−μ</sub>(−y)/∂μ = −s·(μΦ<sup>−1</sup>(μ) + φ(Φ<sup>−1</sup>(μ)))/μ² < 0`) +
            eq(cv.map(sp => `μ = ${f(sp.mu)}: ∂CVaR/∂μ = ${vv(sens(sp.mu))}`).join('<br>')) + 'El CVaR decrece al aumentar μ (al bajar el nivel de confianza 1 − μ); la sensibilidad es mayor cuanto menor es μ.');
          cvAns = () => R.ans('CVaR en función de μ.', `Para la normal, CVaR<sub>1−μ</sub>(−y) = ${f(src.m)} + ${f(src.s)}·φ(Φ<sup>−1</sup>(μ))/μ, con derivada −s(μΦ<sup>−1</sup>(μ) + φ(Φ<sup>−1</sup>(μ)))/μ², negativa: ${cv.map(sp => `en μ = ${f(sp.mu)} vale ${vv(sens(sp.mu))}`).join('; ')}.`);
        }
        if (cv.length) R.table('PELVE: CVaR<sub>1−μ</sub> = VaR<sub>1−ν</sub> en el mundo normal (§4.3.1)', ['CVaR', 'ν = Φ(−φ(Φ<sup>−1</sup>(μ))/μ)', 'Nivel equivalente del VaR'], cv.map(sp => { const nu = T.Phi(-T.phi(T.PhiInv(sp.mu)) / sp.mu); return [rn(sp), nu, T.fmtPctLevel(1 - nu)]; }));
      } else specs.forEach((sp, i) => R.step(rn(sp), eq(src.y0 && src.y0.normal && sp.type === 'CVaR' ? P.layerFormula(src.y0, sp, src.U, vals[i]) : P.genExplain(sp, D, vals[i], src.kind))));
      const ex = specs.find(sp => sp.type === 'Expectil'), cvs = specs.filter(sp => sp.type === 'CVaR');
      if (ex && cvs.length && ex.mu < 0.5) {
        const z = T.risk(D, ex);
        R.table(`Cota (56) del CVaR mediante el expectil 𝔈<sub>${f(ex.mu)}</sub>`, ['CVaR', 'Cota: 𝔈 + μ(𝔈 − 𝔼(y))/(ν(1 − 2μ))', 'Valor real'], cvs.map(sp => [rn(sp), z + ex.mu * (z - D.mean) / (sp.mu * (1 - 2 * ex.mu)), T.risk(D, sp)]));
      }
      if (V.s('y_src') === 'cartera') R.uses('tcl61'); else if (V.s('y_src') === 'compuesta') R.uses('comp26');
      if (src.normal) R.uses('norm44');
      if (src.y0) R.uses(src.y0.normal ? 'slN' : null);
      if (src.normal) R.ans('', `${src.ex.replace(/<div class="eq">/g, '<div class="eq">')} Las medidas invariantes por traslaciones y homogéneas cumplen ρ(−y) = m + ρ<sub>(0,1)</sub>·s (ec. 44), donde ρ<sub>(0,1)</sub> es el riesgo de la normal estándar:`);
      else R.ans('', src.ex);
      specs.forEach((sp, i) => R.uses(src.normal && sp.type !== 'Entropica' ? 'norm45' : null, MK(sp.type), src.y0 && src.y0.normal && sp.type === 'CVaR' ? 'cvarslN' : null) && R.ans('', src.normal && sp.type !== 'Entropica' ? `${P.std01Explain(sp)}${src.m !== 0 || src.s !== 1 ? `, de donde ${rn(sp)} = ${f(src.m)} + ${f(T.rhoStd(sp))} × ${f(src.s)} = ${vv(vals[i])}` : ''}.` : `${src.y0 && src.y0.normal && sp.type === 'CVaR' ? P.layerFormula(src.y0, sp, src.U, vals[i]) : P.genExplain(sp, D, vals[i], src.kind)}.`));
      if (cvAns) cvAns();
      if (V.b('pr')) {
        const A = V.n('A'), B = V.n('B'), k = Math.round(V.n('prow'));
        if (!(k >= 1 && k <= specs.length)) throw new Error('El nº de fila de la prima no existe.');
        const Pi = A * D.mean + B * vals[k - 1];
        R.tiles.unshift({ l: 'Prima Π(y)', v: Pi, main: true });
        R.key('prima', Pi); R.uses('prima66');
        R.step('Prima', eq(`Π(y) = ${f(A)}·𝔼(y) + ${f(B)}·${rn(specs[k - 1])} = ${f(A)} × ${f(D.mean)} + ${f(B)} × ${f(vals[k - 1])} = ${vv(Pi)}`));
        R.ans('Prima.', `Por tanto, Π(y) = ${f(A)} × ${f(D.mean)} + ${f(B)} × ${f(vals[k - 1])} = ${vv(Pi)}.`);
      }
      if (specs.some(sp => sp.type === 'SW' || sp.type === 'SDPT')) R.note('Las medidas espectrales se calculan aquí integrando numéricamente (valor exacto). En los exámenes el profesor las estima por Monte Carlo (p. ej. SW₁ ≈ 1,6036 y SDPT₁ ≈ 0,9062 para la N(0,1), cuando los valores exactos son 1,5882 y 0,9032). Si quieres reproducir su solución, usa su valor.');
      return R;
    },
    examples: [
      { id: 'e14-2a', label: 'Enero 2014 · Ej. 2a · distribución de la cartera, CVaR en función de μ y sensibilidad', values: { y_src: 'cartera', y_cart: [{ n: '1000', E: '100', s: '1000' }, { n: '2000', E: '100', s: '900' }, { n: '3000', E: '150', s: '1200' }, { n: '2000', E: '100', s: '800' }, { n: '1000', E: '150', s: '1200' }, { n: '1000', E: '200', s: '1400' }], meds: [{ t: 'CVaR', p: '70' }, { t: 'CVaR', p: '95' }, { t: 'CVaR', p: '99' }] } },
      { id: 'e16-2a', label: 'Enero 2016 · Ej. 2a-b · distribución de la cartera y SW₁', values: { y_src: 'cartera', y_cart: [{ n: '1000', E: '100', s: '1000' }, { n: '2000', E: '100', s: '900' }, { n: '3000', E: '150', s: '1200' }, { n: '4000', E: '100', s: '800' }, { n: '3000', E: '150', s: '1200' }, { n: '2000', E: '200', s: '1400' }], meds: [{ t: 'SW', p: '1' }] } },
      { id: 'e15-3a', label: 'Enero 2015 · Ej. 3a · SW₁ de la cartera', values: { y_src: 'cartera', y_cart: [{ n: '1000', E: '100', s: '800' }, { n: '2000', E: '100', s: '700' }, { n: '3000', E: '150', s: '1000' }, { n: '4000', E: '100', s: '600' }, { n: '5000', E: '250', s: '1100' }], meds: [{ t: 'SW', p: '1' }] } },
      { id: 'e19-2a', label: 'Enero 2019 · Ej. 2a · CVaR 95 % de la N(0,1) y de la cartera', values: { y_src: 'cartera', y_cart: [{ n: '1000', E: '100', s: '1000' }, { n: '2500', E: '100', s: '950' }, { n: '4000', E: '150', s: '1800' }, { n: '3000', E: '200', s: '3000' }], meds: [{ t: 'CVaR', p: '95' }] }, expect: [{ k: 's1', l: 'CVaR<sub>95%</sub>(−ỹ)', v: 2.064381357, src: 'Monte Carlo (Ej_2a_1)' }, { k: 'r1', l: 'CVaR<sub>95%</sub>(−y)', v: 1979154.3 }] },
      { id: 'e20-2a', label: 'Enero 2020 · Ej. 2a · SW₁ de la cartera', values: { y_src: 'cartera', y_cart: [{ n: '1000', E: '100', s: '1000' }, { n: '2500', E: '100', s: '950' }, { n: '4000', E: '150', s: '1800' }, { n: '3000', E: '200', s: '3000' }], meds: [{ t: 'SW', p: '1' }] }, expect: [{ k: 'r1', l: 'SW<sub>1</sub>(−y)', v: 1883369.11, src: 'con 1,603621301 simulado' }] },
      { id: 'e18-2a', label: 'Enero 2018 · Ej. 2a · SW₂ de la cartera', values: { y_src: 'cartera', y_cart: [{ n: '1000', E: '100', s: '1000' }, { n: '2500', E: '100', s: '950' }, { n: '4000', E: '150', s: '1800' }, { n: '3000', E: '200', s: '2000' }], meds: [{ t: 'SW', p: '2' }] }, expect: [{ k: 'r1', l: 'SW<sub>2</sub>(−y)', v: 1960647.987, src: 'macro' }] },
      { id: 'e17-2a', label: 'Enero 2017 · Ej. 2a · SW₁ de la cartera (5 tipos de póliza)', values: { y_src: 'cartera', y_cart: [{ n: '10000', E: '100', s: '1000' }, { n: '2500', E: '100', s: '900' }, { n: '10000', E: '150', s: '1200' }, { n: '4000', E: '150', s: '1100' }, { n: '30000', E: '200', s: '1400' }], meds: [{ t: 'SW', p: '1' }] } },
      { id: 'e25-2a', label: 'Enero 2025 · Ej. 2a · CVaR 90 % de la N(0,1)', values: { y_src: 'cont', y_c_fam: 'normal', y_c_normal_p_m: '0', y_c_normal_p_s: '1', meds: [{ t: 'CVaR', p: '90' }] }, expect: [{ k: 'r1', l: 'CVaR<sub>90%</sub>(−ỹ)', v: 1.755428339, src: 'fórmula cerrada (Ej_2a_1)' }], note: 'El valor exacto φ(Φ⁻¹(0,1))/0,1 es 1,754983319; el del examen tiene un pequeño error de redondeo.' },
      { id: 'e26-1a', label: 'Enero 2026 · Ej. 1a · CVaR 95 % de la N(0,1)', values: { y_src: 'cont', y_c_fam: 'normal', y_c_normal_p_m: '0', y_c_normal_p_s: '1', meds: [{ t: 'CVaR', p: '95' }] }, expect: [{ k: 'r1', l: 'CVaR<sub>95%</sub>(−ỹ)', v: 2.062712808, src: 'fórmula cerrada' }] },
      { id: 'e23-2a', label: 'Enero 2023 / Junio 2025 · SW₁ de la N(0,1)', values: { y_src: 'cont', y_c_fam: 'normal', y_c_normal_p_m: '0', y_c_normal_p_s: '1', meds: [{ t: 'SW', p: '1' }] }, expect: [{ k: 'r1', l: 'SW<sub>1</sub>(−ỹ)', v: 1.603621301, src: 'Monte Carlo (Ej_2a0)' }] },
      { id: 'e24-2a', label: 'Enero 2024 · Ej. 2a · SDPT₁ de la N(0,1)', values: { y_src: 'cont', y_c_fam: 'normal', y_c_normal_p_m: '0', y_c_normal_p_s: '1', meds: [{ t: 'SDPT', p: '1' }] }, expect: [{ k: 'r1', l: 'SDPT<sub>1</sub>(−ỹ)', v: 0.906229677, src: 'Monte Carlo, 50.000 sim. (Ej_2a1)' }] },
      { id: 'j26-1a', label: 'Junio 2026 · Ej. 1a · expectil 𝔈₀,₃ de la N(0,1)', values: { y_src: 'cont', y_c_fam: 'normal', y_c_normal_p_m: '0', y_c_normal_p_s: '1', meds: [{ t: 'Expectil', p: '0,3' }] }, expect: [{ k: 'r1', l: '𝔈<sub>0,3</sub>(−ỹ)', v: 0.337403898, src: 'interpolación en tabla simulada' }], note: 'El examen interpola en la tabla de la macro «I2_ExpectilN01» (100.000 simulaciones), que da 0,337404647 para μ = 0,299894279 y 0,337139093 para μ = 0,300035142. El valor exacto de 𝔈₀,₃ es 0,3371198815.' },
      { id: 'e25-2c', label: 'Enero 2025 · Ej. 2c · expectil 𝔈₀,₃ de la N(0,1)', values: { y_src: 'cont', y_c_fam: 'normal', y_c_normal_p_m: '0', y_c_normal_p_s: '1', meds: [{ t: 'Expectil', p: '0,3' }] }, expect: [{ k: 'r1', l: '𝔈<sub>0,3</sub>(−ỹ)', v: 0.337139093, src: 'Excel Ej_2c_1' }], note: 'Es la fila μ = 0,300035142 de la tabla simulada de la macro «I2_ExpectilN01»; el valor exacto para μ = 0,3 es 0,3371198815.' },
      { id: 'j25-1b', label: 'Junio 2025 · Ej. 1b · Π = 1,05𝔼(y) + 0,1𝔈₀,₁₅(−y), N(11,5569; 3,0278)', values: { y_src: 'cont', y_c_fam: 'normal', y_c_normal_p_m: '11,55693385', y_c_normal_p_s: '3,027783536', meds: [{ t: 'Expectil', p: '0,15' }], pr: true, A: '1,05', B: '0,1', prow: '1' }, expect: [{ k: 'r1', l: '𝔈<sub>0,15</sub>(−y)', v: 13.62906221, src: 'macro Jun_Ej_1' }, { k: 'prima', l: 'Π(y)', v: 13.49768676 }] },
      { id: 'j24-1', label: 'Junio 2024 · Ej. 1-2 · ρ = 2∫μ CVaR dμ y SW₁ de la N(0,1)', values: { y_src: 'cont', y_c_fam: 'normal', y_c_normal_p_m: '0', y_c_normal_p_s: '1', meds: [{ t: 'SPow', p: '2' }, { t: 'SW', p: '1' }] } },
      { id: 'e23-3c', label: 'Enero 2023 · Ej. 3c · cartera de 1.000 pólizas de cada modalidad (sin franquicia, franquicia 40, máximo 120)', values: { y_src: 'cartera', y_cart: [{ n: '1000', E: '100', s: '173,2050808' }, { n: '1000', E: '67,03200460', s: '133,7897252' }, { n: '1000', E: '69,88057881', s: '107,8459548' }], meds: [{ t: 'CVaR', p: '90' }], pr: true, A: '1', B: '0,02', prow: '1' },
        note: '𝔼 y σ de cada modalidad salen del «Coste agregado» (ejemplos Enero 2023 Ej. 3 i–iii): (i) 𝔼 = 100, σ = √30.000; (ii) franquicia 40: 𝔼 = 100e<sup>−0,4</sup>; (iii) máximo 120: 𝔼 = 100(1 − e<sup>−1,2</sup>). Por el TCL, la cartera es aproximadamente normal.' },
      { id: 'oct6-sl', label: 'Clase 6 oct. 2026 · riesgos del stop-loss (y − 165.000)⁺ de la cartera (macro Riesgos_SL)', values: { y_src: 'cartera', y_cart: [{ n: '1000', E: '5', s: '10' }, { n: '5000', E: '8', s: '12' }, { n: '10000', E: '12', s: '25' }], slU: '165.000', meds: [{ t: 'VaR', p: '95' }, { t: 'CVaR', p: '95' }, { t: 'Wang', p: '1' }, { t: 'SW', p: '1' }, { t: 'DPT', p: '2' }, { t: 'SDPT', p: '2' }] },
        expect: [{ k: 'r2', l: 'CVaR<sub>95%</sub>(−(y − U)<sup>+</sup>)', v: 5483.593023, src: 'Monte Carlo, 30.000 sim.' }],
        note: 'La macro «Sub Riesgos_SL» simula y (normal, uniforme, log-normal o Erlang por media y desviación), calcula (y − U)<sup>+</sup> y estima VaR, CVaR, Wang, SW, DPT y SDPT con 1.000 puntos. Aquí el cálculo es exacto. Ojo: en la macro la uniforme usa a = 2𝔼 − σ√3, b = 2𝔼 + σ√3, que tiene media 2𝔼 (errata); lo correcto es a = 𝔼 − σ√3, b = 𝔼 + σ√3 (modo «media y desviación» de la uniforme).' },
      { id: 'e24-cart', label: 'Enero 2024 · Ej. 2a · SDPT₁ de la cartera (2.000/5.000/3.000 pólizas)', values: { y_src: 'cartera', y_cart: [{ n: '2.000', E: '150', s: '1.000' }, { n: '5.000', E: '250', s: '2.000' }, { n: '3.000', E: '300', s: '3.000' }], meds: [{ t: 'SDPT', p: '1' }] }, expect: [{ k: 'r1', l: 'SDPT<sub>1</sub>(−y)', v: 2650602.49, src: 'con la SDPT₁ simulada' }] }
    ]
  });

  /* ═════════ T4 · Normal: hallar m y s ═════════ */
  const eqFields = (k, d) => [
    { id: `e${k}A`, type: 'num', label: 'a (de 𝔼(y))', def: d.A }, { id: `e${k}B`, type: 'num', label: 'b (de ρ(−y))', def: d.B },
    ...P.measFields(`e${k}_`, { type: d.t, lvl: d.lvl, mu: d.mu }),
    ...(d.P !== undefined ? [{ id: `e${k}P`, type: 'num', label: 'Valor de la prima Π', def: d.P }] : [])
  ];
  UI.tool({
    id: 't4-normal', tema: 4, title: 'Normal: hallar m y s a partir de dos primas',
    short: 'Sistema lineal con dos principios de prima conocidos; después, cualquier otra prima.',
    cuando: '«Bajo Π(y) = … se obtiene una prima de … y bajo Π̃(y) = … la prima es …. Determine m y s».',
    que: 'Si y ∼ N(m; s), toda medida invariante por traslaciones y homogénea cumple ρ(−y) = m + ρ<sub>(0,1)</sub>·s. Cada prima conocida es entonces una ecuación lineal en m y s; con dos primas se resuelve el sistema y, ya conocida la normal, se calcula cualquier otra prima.',
    groups: [
      { title: 'Primera prima: Π₁ = a·𝔼(y) + b·ρ₁(−y)', fields: eqFields(1, { A: '1,05', B: '0,1', t: 'VaR', lvl: '90', P: '11,88' }) },
      { title: 'Segunda prima: Π₂ = a·𝔼(y) + b·ρ₂(−y)', fields: eqFields(2, { A: '1,05', B: '0,1', t: 'VaR', lvl: '95', P: '11,99' }) },
      { title: 'Prima a calcular después (opcional)', optional: true, open: true, fields: [{ id: 'e3on', type: 'check', label: 'Calcular otra prima con la normal obtenida', def: true }, ...P.withShow(eqFields(3, { A: '1,05', B: '0,1', t: 'Expectil', mu: '0,15' }), v => v.e3on)] }
    ],
    solve(V, { result }) {
      const R = result();
      const eqs = [1, 2].map(k => { const sp = P.buildMeas(V, `e${k}_`); if (sp.type === 'Entropica') throw new Error('La medida entrópica no es homogénea: no se puede usar aquí.'); return { A: V.n(`e${k}A`), B: V.n(`e${k}B`), sp, P: V.n(`e${k}P`), r: T.rhoStd(sp) }; });
      eqs.forEach((e, i) => R.step(`Riesgo de la N(0,1) para ρ${i + 1}`, eq(P.std01Explain(e.sp))));
      R.step('Planteamiento', `Por (44), ρ(−y) = m + ρ<sub>(0,1)</sub>·s, luego cada prima es lineal en (m, s):` + eq(eqs.map((e, i) => `Π${i + 1} = ${f(e.A)}m + ${f(e.B)}(m + ${f(e.r)}s) = ${f(e.A + e.B)}m + ${f(e.B * e.r)}s = ${f(e.P)}`).join('<br>')));
      const [a, b] = eqs, det = (a.A + a.B) * (b.B * b.r) - (b.A + b.B) * (a.B * a.r);
      if (Math.abs(det) < 1e-14) throw new Error('El sistema no tiene solución única (las dos primas no son independientes).');
      const m = (a.P * (b.B * b.r) - b.P * (a.B * a.r)) / det, s = ((a.A + a.B) * b.P - (b.A + b.B) * a.P) / det;
      R.tile('m', m, { main: true }).tile('s', s, { main: true }); R.key('m', m).key('s', s);
      R.uses('prima66', 'norm44', 'norm45', ...eqs.map(e => MK(e.sp.type)));
      R.ans('', `Se sabe que ${eqs.map(e => `${rn(e.sp)} = m + s·${f(e.r)}`).join(' y ')} (riesgo de la N(0,1): ${eqs.map(e => f(e.r)).join(' y ')}). Por consiguiente,` +
        eq(eqs.map(e => `${f(e.A + e.B)}m + ${f(e.B * e.r)}s = ${f(e.P)}`).join('<br>')) + `cuya solución es m = ${vv(m)}, s = ${vv(s)}.`);
      R.step('Solución del sistema', eq(`m = ${vv(m)}, &nbsp; s = ${vv(s)}`) + (s <= 0 ? '<div class="warn">s ≤ 0: revisa los datos.</div>' : ''));
      if (V.b('e3on')) {
        const sp = P.buildMeas(V, 'e3_'), A = V.n('e3A'), B = V.n('e3B'), D = T.normal(m, s), rho = T.risk(D, sp), Pi = A * m + B * rho;
        R.tile(rn(sp), rho).tile('Nueva prima', Pi, { main: true }); R.key('rho3', rho).key('P3', Pi); R.uses(MK(sp.type));
        R.ans('Nueva prima.', `Para la normal obtenida, ${rn(sp)} = ${f(m)} + ${f(T.rhoStd(sp))} × ${f(s)} = ${vv(rho)}. Por tanto, Π(y) = ${f(A)} × ${f(m)} + ${f(B)} × ${f(rho)} = ${vv(Pi)}.`);
        R.step('Nueva prima', eq(P.std01Explain(sp)) + eq(`${rn(sp)} = ${f(m)} + ${f(T.rhoStd(sp))} × ${f(s)} = ${f(rho)}`) + eq(`Π = ${f(A)} × ${f(m)} + ${f(B)} × ${f(rho)} = ${vv(Pi)}`));
      }
      return R;
    },
    examples: [{ id: 'j25-1', label: 'Junio 2025 · Ej. 1 · VaR 90 % y VaR 95 % ⇒ m, s; después 𝔈₀,₁₅', values: {}, expect: [{ k: 'm', l: 'm', v: 11.55693385, src: 'solución oficial' }, { k: 's', l: 's', v: 3.027783536 }, { k: 'rho3', l: '𝔈<sub>0,15</sub>(−y)', v: 13.62906221, src: 'macro, con la m oficial' }, { k: 'P3', l: 'Π̂(y)', v: 13.49768676 }], note: '<b>Ojo, posible errata en la solución oficial.</b> El sistema que plantea (1,15m + 0,1281551566s = 11,88; 1,15m + 0,1644853627s = 11,99) da s = 3,027783536, igual que la oficial, pero m = 9,993020806. La m oficial (11,55693385) no cumple la primera ecuación: 1,15 × 11,5569 + 0,1282 × 3,0278 = 13,68 ≠ 11,88. Si quieres reproducir el apartado b) oficial, usa la herramienta «Calculadora de medidas de riesgo» con m = 11,55693385.' }]
  });

  /* ═════════ T4 · Parámetro para un riesgo objetivo ═════════ */
  UI.tool({
    id: 't4-param', tema: 4, title: 'Parámetro de la medida para un riesgo objetivo',
    short: 'Hallar μ (CVaR, expectil…) o a (Wang, SW…) para que el riesgo o el recargo tome un valor dado.',
    cuando: '«Determine μ para que, si se cambia 𝔈₀,₃ por 𝔈μ, el recargo de seguridad máximo sea del 10 %» o «qué nivel de confianza da un riesgo de …».',
    que: 'Traduce el objetivo (un recargo, un valor del riesgo…) a un valor del riesgo de la normal estándar ρ<sub>(0,1)</sub> y busca el parámetro de la medida (μ o a) que lo produce. El examen lo hace interpolando en una tabla simulada; aquí se resuelve exactamente.',
    groups: [
      {
        title: 'Normal N(m; s)', fields: [
          { id: 'm', type: 'num', label: 'm = 𝔼(y)', def: '1.700.000' }, { id: 's', type: 'num', label: 's = σ(y)', def: '114.411,5379' }
        ]
      },
      {
        title: 'Medida y objetivo', fields: [
          { id: 'fam', type: 'sel', label: 'Parámetro a buscar', def: 'Expectil', opts: [['Expectil', 'μ del expectil 𝔈μ'], ['CVaR', 'nivel del CVaR'], ['VaR', 'nivel del VaR'], ['Wang', 'a de Wₐ'], ['SW', 'a de SWₐ'], ['DPT', 'a de DPTₐ'], ['SDPT', 'a de SDPTₐ'], ['Entropica', 'μ de la entrópica']], wide: true },
          { id: 'obj', type: 'sel', label: 'El objetivo es', def: 'rec', opts: [['rec', 'recargo de seguridad máximo k (sin reservas): m(1+k) = ρ(−y)'], ['rho', 'un valor de ρ(−y)'], ['r01', 'un valor de ρ(0,1)']], wide: true },
          { id: 'val', type: 'num', label: 'Valor objetivo', def: '0,1', help: 'Recargo: 0,1 = 10 %' }
        ]
      }
    ],
    solve(V, { result }) {
      const R = result();
      const m = V.n('m'), s = V.n('s', { pos: 1 }), fam = V.s('fam'), obj = V.s('obj'), val = V.n('val');
      let target, txt;
      if (obj === 'rec') { target = val * m / s; txt = `El recargo de seguridad máximo k anula el riesgo con k₂ = 0 (tema 8): m(1 + k) = m + ρ<sub>(0,1)</sub>s ⇒ ρ<sub>(0,1)</sub> = k·m/s = ${f(val)} × ${f(m)}/${f(s)} = ${vv(target)}`; }
      else if (obj === 'rho') { target = (val - m) / s; txt = `ρ(−y) = m + ρ<sub>(0,1)</sub>s ⇒ ρ<sub>(0,1)</sub> = (${f(val)} − ${f(m)})/${f(s)} = ${vv(target)}`; }
      else { target = val; txt = `ρ<sub>(0,1)</sub> = ${vv(target)}`; }
      R.step('Riesgo objetivo de la N(0,1)', eq(txt));
      R.uses('norm44', MK(fam)); if (obj === 'rec') R.uses('k73');
      let par, spF, how;
      if (fam === 'Entropica') {
        const rhoT = m + target * s; par = 2 * (rhoT - m) / (s * s); spF = { type: fam, mu: par };
        how = `ℰ<sub>μ</sub>(−y) = m + μs²/2 ⇒ μ = 2(ρ − m)/s² = ${vv(par)}`;
      } else if (fam === 'VaR') {
        const mu = T.Phi(-target); par = 1 - mu; spF = { type: fam, mu };
        how = `Φ<sup>−1</sup>(1 − μ) = ${f(target)} ⇒ 1 − μ = Φ(${f(target)}) = ${vv(par)}`;
      } else if (fam === 'CVaR' || fam === 'Expectil') {
        const top = fam === 'Expectil' ? 0.5 : 1 - 1e-15;
        const g = lm => T.rhoStd({ type: fam, mu: Math.exp(lm) }) - target;
        if (!(target > T.rhoStd({ type: fam, mu: top }))) throw new Error(`No hay solución: con ${fam} el riesgo de la N(0,1) es al menos ${f(T.rhoStd({ type: fam, mu: top }))}.`);
        const lm = T.bisect(lm2 => -g(lm2), Math.log(1e-14), Math.log(top), 1e-15, 300);
        const mu = Math.exp(lm); spF = { type: fam, mu }; par = fam === 'CVaR' ? 1 - mu : mu;
        how = fam === 'CVaR' ? `CVaR<sub>1−μ</sub>(−ỹ) = φ(Φ<sup>−1</sup>(μ))/μ = ${f(target)} ⇒ μ = ${vv(mu)}, nivel 1 − μ = ${vv(1 - mu)}` : `Se resuelve 𝔈<sub>μ</sub>(−ỹ) = ${f(target)} (el expectil crece cuando μ decrece) ⇒ μ = ${vv(mu)}`;
      } else {
        const g = a => T.rhoStd({ type: fam, a }) - target;
        const a0 = fam === 'Wang' ? target : T.solveIncreasing(g, 1, 0.5);
        par = a0; spF = { type: fam, a: a0 };
        how = fam === 'Wang' ? `W<sub>a</sub>(−ỹ) = a ⇒ a = ${vv(a0)}` : `Se resuelve numéricamente ρ<sub>(0,1)</sub>(a) = ${f(target)} ⇒ a = ${vv(a0)}`;
      }
      R.tile('Parámetro', par, { main: true }); R.key('par', par);
      if (spF.mu !== undefined && fam !== 'VaR' && fam !== 'CVaR') R.key('mu', spF.mu);
      R.step('Despeje del parámetro', eq(how));
      R.ans('', `${txt}. Hay que encontrar el parámetro para el que el riesgo de la normal estándar vale ${f(target)}: ${how}.`);
      const chk = T.risk(T.normal(m, s), spF);
      R.tile(`Comprobación ${rn(spF)}`, chk);
      R.step('Comprobación', eq(`${rn(spF)} = ${vv(chk)}${obj === 'rec' ? `; recargo = ${rn(spF)}/m − 1 = ${vv(chk / m - 1)}` : ''}`));
      R.note('En el examen este parámetro se obtiene interpolando en una tabla simulada; aquí se resuelve exactamente, por lo que puede diferir en la 4ª–5ª cifra.');
      return R;
    },
    examples: [{ id: 'j26-1b', label: 'Junio 2026 · Ej. 1b · μ del expectil para recargo de seguridad del 10 %', values: { m: '1.700.000', s: '114.411,5379', fam: 'Expectil', obj: 'rec', val: '0,1' }, expect: [{ k: 'mu', l: 'μ', v: 0.019591682, src: 'interpolación lineal' }] }]
  });

  /* ═════════ T4 · λ-cuantil (Λ-VaR) ═════════ */
  UI.tool({
    id: 't4-lambda', tema: 4, title: 'λ-cuantil (landa-cuantil)', tag: 'suelto · Ene 2025',
    short: 'Q<sub>λ</sub>(y) con una función λ escalonada: dónde corta F a λ, y cuándo coincide con un VaR.',
    cuando: '«Considere la función λ(x) = … Q<sub>λ</sub> es el landa-cuantil basado en λ. Determine condiciones de F que garantizan VaR<sub>99%</sub>(y) = Q<sub>λ</sub>(y)».',
    que: 'El λ-cuantil generaliza el VaR permitiendo que el nivel dependa del valor: Q<sub>λ</sub>(y) es el punto en el que la función de distribución F de y alcanza a λ. Si F es continua y estrictamente creciente, F(Q<sub>λ</sub>(y)) = λ(Q<sub>λ</sub>(y)) (salvo que el corte caiga justo en un salto de λ), mientras que F(VaR<sub>1−μ</sub>(y)) = μ. Por eso Q<sub>λ</sub> sólo puede coincidir con VaR<sub>1−μ</sub> si μ es uno de los valores que toma λ, y en el tramo adecuado.',
    groups: [
      {
        title: 'Función λ escalonada', fields: [
          { id: 'lam', type: 'rows', label: 'Una fila por tramo: «desde x» (el primero, −∞) y el valor de λ en ese tramo', cols: [{ id: 'desde', label: 'Desde x', type: 'text' }, { id: 'val', label: 'λ(x)' }], def: [{ desde: '−∞', val: '0,01' }, { desde: '−2', val: '0,05' }], wide: true },
          { id: 'niv', type: 'text', label: 'Niveles del VaR a estudiar (%)', def: '99; 90', help: 'p. ej. 99; 95; 90', wide: true }
        ]
      },
      { title: 'Distribución F de y (opcional, para calcular Q<sub>λ</sub>)', optional: true, openIf: v => v.dOn, fields: [{ id: 'dOn', type: 'check', label: 'Calcular Q<sub>λ</sub> con una distribución concreta', def: false, wide: true }, ...P.withShow(P.famFields('d_', P.CF, P.CF_ALL, 'normal'), v => v.dOn)] }
    ],
    solve(V, { result }) {
      const R = result();
      const segs = (V.raw.lam || []).map((r, i) => {
        const t = String(r.desde || '').trim(); const a = (i === 0 && /^[−-]?\s*(∞|inf)/i.test(t)) || t === '' ? -Infinity : T.parseNum(t);
        const v = T.parseNum(r.val); if (isNaN(a) || !(v > 0 && v < 1)) throw new Error(`Revisa el tramo ${i + 1} de λ.`); return { a, v };
      }).sort((x, y) => x.a - y.a);
      if (!segs.length) throw new Error('Añade al menos un tramo de λ.');
      segs.forEach((g, i) => { g.b = i + 1 < segs.length ? segs[i + 1].a : Infinity; });
      const xs = x => (isFinite(x) ? f(x) : (x < 0 ? '−∞' : '+∞'));
      const tramo = g => `${isFinite(g.a) ? xs(g.a) + ' ≤ ' : ''}x${isFinite(g.b) ? ' < ' + xs(g.b) : ''}`;
      R.step('Función λ', eq(segs.map(g => `λ(x) = ${f(g.v)} si ${tramo(g)}`).join('<br>')));
      R.uses('lam42');
      R.ans('Planteamiento.', `λ toma los valores ${segs.map(g => `${f(g.v)} (si ${tramo(g)})`).join(' y ')}. Como F es continua y estrictamente creciente, el λ-cuantil Q<sub>λ</sub>(y) es el punto en el que F alcanza a λ: F(Q<sub>λ</sub>(y)) = λ(Q<sub>λ</sub>(y)) (si el corte no cae en un salto de λ). Por otro lado, F(VaR<sub>1−μ</sub>(y)) = μ. Por tanto, Q<sub>λ</sub>(y) = VaR<sub>1−μ</sub>(y) si y sólo si F(Q<sub>λ</sub>(y)) = μ.`);
      const lv = V.list('niv', { opt: true });
      lv.forEach(L => {
        const lvl = L >= 1 ? L / 100 : L, mu = Math.round((1 - lvl) * 1e12) / 1e12, js = segs.map((g, j) => j).filter(j => Math.abs(segs[j].v - mu) < 1e-12);
        const nm = `VaR<sub>${T.fmtPctLevel(lvl)}</sub>(y)`;
        if (!js.length) { R.tile(`¿${nm} = Q<sub>λ</sub>?`, 'Imposible', { main: true, hint: `λ nunca vale ${f(mu)}` }); R.ans(`¿${nm} = Q<sub>λ</sub>(y)?`, `Debería ser F(Q<sub>λ</sub>(y)) = ${f(mu)}, pero λ nunca toma el valor ${f(mu)} (sólo ${segs.map(g => f(g.v)).join(' y ')}). Por tanto, la igualdad ${nm} = Q<sub>λ</sub>(y) es imposible, cualquiera que sea F.`); return; }
        const conds = js.map(j => {
          const g = segs[j], prev = segs.slice(0, j);
          const le = new Map(), gt = new Map();   // cotas de F en cada punto (se queda la más restrictiva)
          const addLe = (x, v) => le.set(x, le.has(x) ? Math.min(le.get(x), v) : v);
          prev.forEach(p => addLe(p.b, p.v));
          if (isFinite(g.a)) addLe(g.a, mu);
          if (isFinite(g.b)) gt.set(g.b, mu);
          const c = [...[...le].map(([x, v]) => `F(${xs(x)}) ≤ ${f(v)}`), ...[...gt].map(([x, v]) => `F(${xs(x)}) > ${f(v)}`)];
          return { tr: tramo(g), txt: c.length ? c.join(' y ') : 'ninguna condición adicional' };
        });
        R.tile(`¿${nm} = Q<sub>λ</sub>?`, 'Posible', { main: true, hint: 'si ' + conds.map(c => c.txt).join(' o ') });
        R.ans(`¿${nm} = Q<sub>λ</sub>(y)?`, `Hace falta F(Q<sub>λ</sub>(y)) = ${f(mu)}, es decir, que F alcance a λ en el tramo en el que λ vale ${f(mu)} (${conds.map(c => c.tr).join(' o ')}): F<sup>−1</sup>(${f(mu)}) debe caer en ese tramo y F no debe haber alcanzado antes a λ. La condición es ${conds.map(c => c.txt).join(', o bien, ')}.${conds.length === 1 && segs.indexOf(segs[js[0]]) === 0 && isFinite(segs[0].b) ? ` Equivalentemente, F<sup>−1</sup>(${f(mu)}) < ${xs(segs[0].b)}, o sea, el percentil ${T.fmtPctLevel(mu)} de y es menor que ${xs(segs[0].b)}.` : ''}`);
      });
      if (V.b('dOn')) {
        const b = P.buildFam(V, 'd_', P.CF), D = b.D;
        let Q = null, how = '';
        for (const g of segs) {
          const Fa = isFinite(g.a) ? D.cdf(g.a) : 0, Fb = isFinite(g.b) ? D.cdf(g.b) : 1;
          if (Fa > g.v) { Q = g.a; how = `en el salto de λ en x = ${f(g.a)} (F(${f(g.a)}) = ${f(Fa)} ya supera ${f(g.v)})`; break; }
          if (Fb > g.v) { Q = D.q(g.v); how = `en el tramo ${tramo(g)}: F(x) = ${f(g.v)} ⇒ x = F<sup>−1</sup>(${f(g.v)})`; break; }
        }
        if (Q === null) throw new Error('Con esa distribución F nunca alcanza a λ.');
        R.tile('Q<sub>λ</sub>(y)', Q, { main: true }).tile('F(Q<sub>λ</sub>)', D.cdf(Q)); R.key('Q', Q);
        lv.forEach(L => { const lvl = L >= 1 ? L / 100 : L; R.tile(`VaR<sub>${T.fmtPctLevel(lvl)}</sub>(y) = F<sup>−1</sup>(${f(1 - lvl)})`, D.q(1 - lvl)); });
        R.ans('Con la distribución dada.', `${b.ex} F alcanza a λ ${how}, así que Q<sub>λ</sub>(y) = ${vv(Q)} con F(Q<sub>λ</sub>) = ${vv(D.cdf(Q))}. ${lv.map(L => { const lvl = L >= 1 ? L / 100 : L, va = D.q(1 - lvl); return `VaR<sub>${T.fmtPctLevel(lvl)}</sub>(y) = F<sup>−1</sup>(${f(1 - lvl)}) = ${f(va)}${Math.abs(va - Q) < 1e-9 * Math.max(1, Math.abs(Q)) ? ', que coincide con Q<sub>λ</sub>' : ', distinto de Q<sub>λ</sub>'}`; }).join('; ')}.`);
      }
      return R;
    },
    examples: [
      { id: 'e25-1', label: 'Enero 2025 · Ej. 1 · λ = 0,01 si x < −2 y 0,05 si x ≥ −2; VaR 99 % y VaR 90 %', values: { lam: [{ desde: '−∞', val: '0,01' }, { desde: '−2', val: '0,05' }], niv: '99; 90' }, note: 'Solución oficial: a) Q<sub>λ</sub>(y) = VaR<sub>99%</sub>(y) si y sólo si F(Q<sub>λ</sub>(y)) = 0,01 (es decir, F(−2) > 0,01); b) imposible, porque λ nunca vale 0,1. Abre «Distribución F» para verlo con un ejemplo numérico.' },
      { id: 'e25-1n', label: 'Enero 2025 · Ej. 1 con un ejemplo: y ∼ N(0; 1)', values: { lam: [{ desde: '−∞', val: '0,01' }, { desde: '−2', val: '0,05' }], niv: '99; 95; 90', dOn: true, d_fam: 'normal', d_normal_p_m: '0', d_normal_p_s: '1' }, expect: [{ k: 'Q', l: 'Q<sub>λ</sub> = F<sup>−1</sup>(0,01)', v: -2.326347874, src: 'cálculo' }] }
    ]
  });

  /* ═════════ T5 · Reaseguro ═════════ */
  function treatyAnalysis(src, sp, tr0, tipo, k1r, k2r, R0, idx, R, spR0) {
    const spR = spR0 || sp, otraR = !!spR0;
    const D = src.D, EY = D.mean, rhoY = T.risk(D, sp);
    const yr = tipo === 'r' ? tr0 : T.plComplement(tr0), yc = tipo === 'r' ? T.plComplement(tr0) : tr0;
    const slopes = T.plSlopes(yc);
    const como = slopes.every(s => s.slope >= -1e-12 && s.slope <= 1 + 1e-12);
    const C = T.transformDist(D, yc), Rr = T.transformDist(D, yr);
    const Eyc = C.mean, rhoc = T.risk(C, sp), rhocR = otraR ? T.risk(C, spR) : rhoc, Pr = (1 + k1r) * Eyc + k2r * rhocR, net = Pr - rhoc;
    const Eyr = EY - Eyc, rhor = T.risk(Rr, sp), prima = rhoY - R0 + net;
    const add = T.comonotoneAdditive(sp) && como;
    const lab = `y<sub>c</sub> = ${T.treatyToString(yc)}`;
    let h = eq(`${lab}<br>y<sub>r</sub> = y − y<sub>c</sub> = ${T.treatyToString(yr)}`);
    h += `<div class="tbl-wrap"><table class="t"><tr><th>Tramo de y</th><th>Pendiente de y<sub>c</sub></th><th>Pendiente de y<sub>r</sub></th></tr>${slopes.map(s => `<tr><td>${f(s.from)} ≤ y${isFinite(s.to) ? ' < ' + f(s.to) : ''}</td><td class="n">${f(s.slope)}</td><td class="n">${f(1 - s.slope)}</td></tr>`).join('')}</table></div>`;
    h += como ? `<span class="okb">✓ Comonotonía:</span> todas las pendientes están entre 0 y 1, luego y, y<sub>c</sub> e y<sub>r</sub> son comonótonos (sin riesgo moral, §5.4).` : `<span class="badb">✗ No comonótono:</span> alguna pendiente sale de [0, 1].`;
    R.step(`Tratado ${idx}: estructura`, h);
    let e = `𝔼(y<sub>c</sub>) = ${[Math.abs(yc.a0) > 1e-15 ? `${f(yc.a0)}·𝔼(y)` : '', ...yc.layers.map(l => `${l.a < 0 ? '− ' + f(-l.a) : f(l.a)}·𝔼((y − ${f(l.U)})<sup>+</sup>)`)].filter(Boolean).join(' + ').replace(/\+ −/g, '−')}`;
    e = eq(e + ` = ${vv(Eyc)}`) + yc.layers.map(l => eq(P.slFormula(src, l.U))).join('');
    R.step(`Tratado ${idx}: siniestralidad cedida esperada`, e);
    if (add) {
      const parts = yc.layers.map(l => ({ l, v: T.layerRisk(D, sp, l.U) }));
      let t = `${rn(sp)} es comonótona aditiva y homogénea y las capas son comonótonas, así que (tema 8):` +
        eq(`${rn(sp, '−y<sub>c</sub>')} = ${[Math.abs(yc.a0) > 1e-15 ? `${f(yc.a0)}·${rn(sp)}` : '', ...parts.map(p => `${p.l.a < 0 ? '− ' + f(-p.l.a) : f(p.l.a)}·${rn(sp, '−(y − ' + f(p.l.U) + ')<sup>+</sup>')}`)].filter(Boolean).join(' + ').replace(/\+ −/g, '−')} = ${vv(rhoc)}`) +
        (Math.abs(yc.a0) > 1e-15 ? eq(`${rn(sp)} = ${f(rhoY)}`) : '') + parts.map(p => eq(P.layerFormula(src, sp, p.l.U, p.v))).join('');
      R.step(`Tratado ${idx}: riesgo cedido`, t);
    } else R.step(`Tratado ${idx}: riesgo cedido`, eq(`${rn(sp, '−y<sub>c</sub>')} = ${vv(rhoc)}`) + (T.comonotoneAdditive(sp) ? '' : `(${rn(sp)} no es comonótona aditiva: se calcula directamente sobre la distribución de y<sub>c</sub>).`));
    const comps = [...(Math.abs(yc.a0) > 1e-15 ? [{ a: yc.a0, U: null }] : []), ...yc.layers.map(l => ({ a: l.a, U: l.U }))];
    let addAns = null;
    if (add && comps.length > 1) {
      const pc = comps.map(c => {
        const E1 = c.U === null ? EY : D.SL(c.U), r1 = c.U === null ? rhoY : T.layerRisk(D, sp, c.U);
        const r1R = otraR ? (c.U === null ? T.risk(D, spR) : T.layerRisk(D, spR, c.U)) : r1;
        return { c, E1, r1, P: c.a * ((1 + k1r) * E1 + k2r * r1R) };
      });
      const nm = c => c.U === null ? 'y' : `(y − ${f(c.U)})<sup>+</sup>`;
      R.table(`Tratado ${idx}: precio de cada componente del reaseguro`, ['Componente', 'Peso aᵢ', '𝔼', rn(sp, '−·'), 'Precio aᵢ[(1+k₁)𝔼 + k₂ρ]'], pc.map(x => [nm(x.c), x.c.a, x.E1, x.r1, x.P]));
      const sumP = pc.reduce((a, x) => a + x.P, 0);
      R.step(`Tratado ${idx}: el precio es la suma de los precios de las componentes`, `La esperanza es lineal y ${rn(sp)} es comonótona aditiva y homogénea; como y, (y − U)<sup>+</sup>… son funciones crecientes de y (comonótonas), ` +
        eq(`Π<sub>r</sub>(y<sub>c</sub>) = ${pc.map(x => `${f(x.c.a)}·Π<sub>r</sub>(${nm(x.c)})`).join(' + ').replace(/\+ −/g, '−')} = ${pc.map(x => f(x.P)).join(' + ')} = ${vv(sumP)}`));
      addAns = () => R.ans(`${idx > 1 || R.__multi ? `Tratado ${idx}. ` : ''}Aditividad del precio.`, `El principio Π<sub>r</sub>(z) = (1 + k₁)𝔼(z) + k₂ρ(−z) es aditivo para riesgos comonótonos y homogéneo: la esperanza es lineal y ${rn(sp)} es comonótona aditiva (${sp.type === 'VaR' || sp.type === 'Wang' || sp.type === 'DPT' ? 'es una medida de distorsión' : 'es espectral'}). Las componentes ${pc.map(x => nm(x.c)).join(', ')} son funciones no decrecientes de y, luego comonótonas, y por tanto el precio de y<sub>c</sub> es la suma de los precios: ${pc.map(x => `${f(x.c.a)} × Π<sub>r</sub>(${nm(x.c)}) = ${f(x.P)}`).join('; ')}, que suman ${vv(sumP)} = Π<sub>r</sub>.`);
    }
    const plr = C.sf(Pr);
    R.step(`Tratado ${idx}: probabilidad de pérdidas para la reaseguradora`, eq(`IP(y<sub>c</sub> > Π<sub>r</sub>) = IP(y<sub>c</sub> > ${f(Pr)}) = ${vv(plr)}`) + (src.normal ? 'Como y<sub>c</sub> es función creciente de y, equivale a IP(y > y<sub>c</sub><sup>−1</sup>(Π<sub>r</sub>)).' : ''));
    R.__plr = (R.__plr || []).concat([plr]);
    R.step(`Tratado ${idx}: prima del reaseguro y prima de la cartera`,
      (otraR ? eq(`La reaseguradora mide el riesgo con ${rn(spR, '−y<sub>c</sub>')} = ${vv(rhocR)}`) : '') +
      eq(`Π<sub>r</sub> = (1 + ${f(k1r)})·𝔼(y<sub>c</sub>)${k2r ? ` + ${f(k2r)}·${rn(spR, '−y<sub>c</sub>')}` : ''} = ${f(1 + k1r)} × ${f(Eyc)}${k2r ? ` + ${f(k2r)} × ${f(rhocR)}` : ''} = ${vv(Pr)}`) +
      eq(`Coste neto del reaseguro: Π<sub>r</sub> − ${rn(sp, '−y<sub>c</sub>')} = ${f(Pr)} − ${f(rhoc)} = ${vv(net)}`) +
      eq(`Prima de la cartera = ${rn(sp)}${R0 ? ' − R₀' : ''} + (Π<sub>r</sub> − ${rn(sp, '−y<sub>c</sub>')}) = ${f(rhoY)}${R0 ? ' − ' + f(R0) : ''} ${net < 0 ? '−' : '+'} ${f(Math.abs(net))} = ${vv(prima)}`) +
      (add ? `Equivalentemente: ${rn(sp, '−y<sub>r</sub>')} + Π<sub>r</sub>${R0 ? ' − R₀' : ''} = ${f(rhor)} + ${f(Pr)}${R0 ? ' − ' + f(R0) : ''} = ${f(rhor + Pr - R0)}.` : '') +
      eq(`Recargos máximos de la cartera (avance del tema 8): seguridad (k₂ = 0) = Π/𝔼(y) − 1 = ${vv(prima / EY - 1)}; riesgo (k₁ = 0) = (Π − 𝔼(y))/${rn(sp)} = ${vv((prima - EY) / rhoY)}; riesgo (k₁ = −1) = Π/${rn(sp)} = ${vv(prima / rhoY)}`));
    {
      const pre = idx > 1 || R.__multi ? `Tratado ${idx}. ` : '';
      R.uses('rea58', 'comono');
      R.ans(pre + 'Estructura.', `El riesgo cedido es ${lab} y el retenido y<sub>r</sub> = ${T.treatyToString(yr)}. Sus pendientes son ${slopes.map(x => `${f(x.slope)} (cedido) y ${f(1 - x.slope)} (retenido) ${isFinite(x.to) ? 'si y < ' + f(x.to) : (x.from > 0 ? 'si y > ' + f(x.from) : '')}`).join('; ')}. ${como ? 'Como todas están entre cero y uno, riesgo retenido, riesgo cedido y riesgo global son comonótonos.' : 'Alguna pendiente no está entre 0 y 1: no se cumple la comonotonía.'}`);
      let t = `𝔼(y<sub>c</sub>) = ${vv(Eyc)}`;
      if (yc.layers.length) t = `Como ${yc.layers.map(l => `𝔼((y − ${f(l.U)})<sup>+</sup>) = ${f(D.SL(l.U))}`).join(' y ')}${src.normal ? ' (fórmula cerrada 𝔼((y − U)<sup>+</sup>) = sφ((U−m)/s) + (m − U)(1 − Φ((U−m)/s)))' : ''}, se obtiene ${t}.`;
      else t += '.';
      if (add) t += ` Por la aditividad comonótona y la homogeneidad, ${rn(sp, '−y<sub>c</sub>')} = ${[Math.abs(yc.a0) > 1e-15 ? `${f(yc.a0)} × ${f(rhoY)}` : '', ...yc.layers.map(l => `${l.a < 0 ? '− ' + f(-l.a) : f(l.a)} × ${f(T.layerRisk(D, sp, l.U))}`)].filter(Boolean).join(' + ').replace(/\+ −/g, '−')} = ${vv(rhoc)}.`;
      else t += ` Calculando sobre la distribución de y<sub>c</sub>, ${rn(sp, '−y<sub>c</sub>')} = ${vv(rhoc)}.`;
      if (src.normal && yc.layers.length) R.uses('slN'); if (add) R.uses('aditiv'); if (src.normal && yc.layers.length && sp.type === 'CVaR') R.uses('cvarslN');
      R.ans(pre + 'Riesgo cedido.', t);
      R.uses('prima71');
      R.ans(pre + 'Primas.', `${otraR ? `La reaseguradora usa ${rn(spR, '−y<sub>c</sub>')} = ${f(rhocR)}. ` : ''}La prima a pagar por el reaseguro es Π<sub>r</sub> = ${f(1 + k1r)} × ${f(Eyc)}${k2r ? ` + ${f(k2r)} × ${f(rhocR)}` : ''} = ${vv(Pr)}, así que la prima del reaseguro menos el riesgo cedido es ${f(Pr)} − ${f(rhoc)} = ${vv(net)}. La prima a cobrar por toda la cartera si se compra el reaseguro será ${f(rhoY)}${R0 ? ' − ' + f(R0) : ''} ${net < 0 ? '−' : '+'} ${f(Math.abs(net))} = ${vv(prima)}${add ? ` (equivalentemente, riesgo retenido + prima del reaseguro = ${f(rhor)} + ${f(Pr)})` : ''}. ${prima < rhoY - R0 ? 'El reaseguro abarata la prima de la cartera.' : 'El reaseguro encarece la prima de la cartera.'}`);
      if (addAns) { R.uses('aditiv'); addAns(); }
      R.ans(pre + 'Pérdidas de la reaseguradora.', `La reaseguradora pierde dinero si la siniestralidad cedida supera lo que cobra: IP(y<sub>c</sub> > ${f(Pr)}) = ${vv(plr)}.`);
      R.ans(pre + 'Recargos máximos.', `El recargo de seguridad máximo será (${f(prima)} − ${f(EY)})/${f(EY)} = ${vv(prima / EY - 1)}; el recargo máximo por riesgo (con recargo de seguridad nulo) será (${f(prima)} − ${f(EY)})/${f(rhoY)} = ${vv((prima - EY) / rhoY)}, y para un recargo de seguridad igual a −1, ${f(prima)}/${f(rhoY)} = ${vv(prima / rhoY)}.`);
    }
    return { Eyc, rhoc, Pr, net, Eyr, rhor, prima, como, segMax: prima / EY - 1, rMax0: (prima - EY) / rhoY, rMax1: prima / rhoY, lab };
  }
  UI.tool({
    id: 't5-reaseguro', tema: 5, title: 'Reaseguro: cuota-parte, stop-loss y mixtos', tag: 'compara tratados',
    short: 'y<sub>c</sub>, y<sub>r</sub>, comonotonía, riesgo cedido, prima del reaseguro y prima de la cartera. Varios tratados a la vez.',
    cuando: '«Vuelva a resolver … si se compra el reaseguro y<sub>c</sub> = …» o «compare los reaseguros …». Escribe el tratado tal cual: <code>0,8y − 0,7(y − 2.450.000)+</code>.',
    que: 'Descompone la siniestralidad en y = y<sub>r</sub> + y<sub>c</sub> (ec. 58), comprueba la comonotonía a partir de las pendientes y calcula el riesgo cedido capa a capa, aprovechando que las medidas espectrales son comonótonas aditivas. La prima de la cartera con reaseguro es el riesgo sin reaseguro más el coste neto del reaseguro (prima que cobra la reaseguradora menos el riesgo que se le cede).',
    groups: [
      { title: 'Siniestralidad global y', fields: P.srcFields('y_', ['cartera', 'cont', 'compuesta'], 'cartera') },
      {
        title: 'Medida de riesgo de la cedente', fields: [
          ...P.measFields('m_', { type: 'CVaR', lvl: '95' }),
          { id: 'R0', type: 'num', label: 'Reservas iniciales R₀', def: '0' }
        ]
      },
      {
        title: 'Tratados de reaseguro', fields: [
          { id: 'trs', type: 'rows', label: 'Uno por fila', cols: [{ id: 'e', label: 'Expresión', type: 'text', w: '68%' }, { id: 't', label: 'Es', type: 'sel', opts: [['c', 'cedido y<sub>c</sub>'.replace(/<[^>]+>/g, '')], ['r', 'retenido yr']], def: 'c' }], def: [{ e: '0,8y − 0,7(y − 2.450.000)+', t: 'c' }] },
          { id: 'info', type: 'info', html: 'Sintaxis: <code>0,3y</code> (cuota-parte) · <code>(y − 1.600.000)+</code> (stop-loss) · <code>0,3y + 0,7(y − U)+</code> · <code>min(y; U)</code> · por tramos de pendiente: <code>tramos: 0:0,2; 425.000:0,6</code>' }
        ]
      },
      {
        title: 'Principio de prima de la reaseguradora', fields: [
          { id: 'info2', type: 'info', html: 'Π<sub>r</sub> = (1 + k₁<sup>r</sup>)·𝔼(y<sub>c</sub>) + k₂<sup>r</sup>·ρ(−y<sub>c</sub>). PPVE con recargo del 10 %: k₁ = 0,1 y k₂ = 0.' },
          { id: 'k1', type: 'num', label: 'k₁ʳ (recargo de seguridad)', def: '0,01' }, { id: 'k2', type: 'num', label: 'k₂ʳ (recargo por riesgo)', def: '0,01' },
          { id: 'mrOn', type: 'check', label: 'La reaseguradora usa otra medida (p. ej. 1,01𝔼 + 0,01·VaR₉₅)', def: false, wide: true },
          ...P.withShow(P.measFields('mr_', { type: 'VaR', lvl: '95' }, 'Medida de la reaseguradora'), v => v.mrOn)
        ]
      }
    ],
    solve(V, { result }) {
      const R = result();
      const src = P.buildSrc(V, 'y_'), D = src.D, sp = P.buildMeas(V, 'm_'), R0 = V.n('R0'), k1 = V.n('k1'), k2 = V.n('k2');
      const trs = (V.raw.trs || []).filter(r => String(r.e || '').trim());
      if (!trs.length) throw new Error('Escribe al menos un tratado.');
      const EY = D.mean, rhoY = T.risk(D, sp);
      R.step('Siniestralidad de la cartera', src.ex + (src.normal ? eq(P.std01Explain(sp)) + eq(`${rn(sp)} = ${f(src.m)} + ${f(T.rhoStd(sp))} × ${f(src.s)} = ${vv(rhoY)}`) : eq(P.genExplain(sp, D, rhoY, src.kind))) +
        `Sin reaseguro, la prima de la cartera (ec. 71) es ${rn(sp)}${R0 ? ' − R₀' : ''} = ${vv(rhoY - R0)}.`);
      R.key('rhoY', rhoY).key('E', EY);
      if (V.s('y_src') === 'cartera') R.uses('tcl61'); if (src.normal) R.uses('norm44', 'norm45'); R.uses(MK(sp.type));
      R.__multi = trs.length > 1;
      R.ans('Cartera.', `${src.normal ? `La siniestralidad de la cartera es normal de media ${f(src.m)} y desviación ${f(src.s)} (teoría del riesgo individual). Con ρ<sub>(0,1)</sub> = ${f(T.rhoStd(sp))}, ${rn(sp)} = ${f(src.m)} + ${f(T.rhoStd(sp))} × ${f(src.s)} = ${vv(rhoY)}` : `${rn(sp)} = ${vv(rhoY)}`}, que sería la prima de la cartera sin reaseguro${R0 ? ' (descontadas las reservas, ' + f(rhoY - R0) + ')' : ''}.`);
      const res = trs.map((t, i) => {
        let tr; try { tr = T.parseTreaty(t.e); } catch (e) { throw new Error(`Tratado ${i + 1}: ${e.message}`); }
        return treatyAnalysis(src, sp, tr, t.t || 'c', k1, k2, R0, i + 1, R, V.b('mrOn') ? P.buildMeas(V, 'mr_') : null);
      });
      if (res.length === 1) {
        const x = res[0];
        R.tile('𝔼(y<sub>c</sub>)', x.Eyc).tile(rn(sp, '−y<sub>c</sub>'), x.rhoc).tile('Prima del reaseguro Π<sub>r</sub>', x.Pr).tile(rn(sp, '−y<sub>r</sub>') + ' (retenido)', x.rhor)
          .tile('Prima de la cartera', x.prima, { main: true }).tile('Sin reaseguro', rhoY - R0).tile('Recargo de seguridad máx.', x.segMax, { main: true }).tile('Recargo por riesgo máx. (k₁ = 0)', x.rMax0);
      } else {
        R.tile(rn(sp) + ' sin reaseguro', rhoY);
        const best = res.reduce((b, x, i) => x.prima < res[b].prima ? i : b, 0);
        R.tile('Tratado más eficiente para la cedente', `Nº ${best + 1}`, { main: true, hint: 'el que da la prima de cartera más baja' });
        R.ans('Conclusión.', `A la vista de los resultados, para la cedente el tratado más eficiente es el nº ${best + 1} (${res[best].lab}), con una prima de cartera de ${vv(res[best].prima)} frente a ${f(rhoY - R0)} sin reaseguro.`);
      }
      if (res.length === 1) R.tile('IP(pérdida de la reaseguradora)', R.__plr[0]);
      (R.__plr || []).forEach((x, i) => R.key('plr' + (res.length > 1 ? String(i + 1) : ''), x));
      res.forEach((x, i) => { const s = res.length > 1 ? String(i + 1) : ''; R.key('Eyc' + s, x.Eyc).key('rhoc' + s, x.rhoc).key('Pr' + s, x.Pr).key('prima' + s, x.prima).key('rhor' + s, x.rhor).key('seg' + s, x.segMax).key('r0' + s, x.rMax0).key('r1' + s, x.rMax1); });
      R.table('Comparación', ['Tratado', '𝔼(y<sub>c</sub>)', rn(sp, '−y<sub>c</sub>'), 'Π<sub>r</sub>', 'Prima de la cartera', 'Ahorro frente a no reasegurar'],
        [['Sin reaseguro', 0, 0, 0, rhoY - R0, 0], ...res.map((x, i) => [`${i + 1}. ${x.lab}${x.como ? '' : ' ⚠'}`, x.Eyc, x.rhoc, x.Pr, x.prima, rhoY - R0 - x.prima])],
        { top: true, hl: i => { if (i === 0) return false; const mn = Math.min(...res.map(x => x.prima)); return Math.abs(res[i - 1].prima - mn) < 1e-9; } });
      if (src.normal) R.note('Las capas (y − U)⁺ de una normal se calculan con fórmulas cerradas (y para medidas espectrales con integración numérica); el examen a veces las simula, de ahí pequeñas diferencias.');
      return R;
    },
    examples: [
      { id: 'e15-5', label: 'Enero 2015 · Ej. 5 · tramos 0,1 / 0,5 / 0,6, y ∼ N(1800; 600), Π = 1,1𝔼 + 0,05VaR70', values: { y_src: 'cont', y_c_fam: 'normal', y_c_normal_p_m: '1800', y_c_normal_p_s: '600', m_rho: 'VaR', m_lvl: '70', R0: '0', trs: [{ e: 'tramos: 0:0,1; 1000:0,5; 2000:0,6', t: 'c' }], k1: '0,1', k2: '0,05' } },
      { id: 'e14-5', label: 'Enero 2014 · Ej. 5 · tramos 0,2 / 0,3 / 0,4, y ∼ N(1500; 500), Π = 1,1𝔼 + 0,1VaR70', values: { y_src: 'cont', y_c_fam: 'normal', y_c_normal_p_m: '1500', y_c_normal_p_s: '500', m_rho: 'VaR', m_lvl: '70', R0: '0', trs: [{ e: 'tramos: 0:0,2; 1000:0,3; 2000:0,4', t: 'c' }], k1: '0,1', k2: '0,1' } },
      { id: 'e16-2cd', label: 'Enero 2016 · Ej. 2c-d · 0,7y − 0,2(y − 2.000.000)+, SW₁, k₁ = k₂ = 2 %', values: { y_src: 'cartera', y_cart: [{ n: '1000', E: '100', s: '1000' }, { n: '2000', E: '100', s: '900' }, { n: '3000', E: '150', s: '1200' }, { n: '4000', E: '100', s: '800' }, { n: '3000', E: '150', s: '1200' }, { n: '2000', E: '200', s: '1400' }], m_rho: 'SW', m_a: '1', R0: '0', trs: [{ e: '0,7y − 0,2(y − 2.000.000)+', t: 'c' }], k1: '0,02', k2: '0,02' } },
      { id: 'e15-3b', label: 'Enero 2015 · Ej. 3b · cuota-parte con retención del 80 %, SW₁, k₁ = 4 %, k₂ = 2 %', values: { y_src: 'cartera', y_cart: [{ n: '1000', E: '100', s: '800' }, { n: '2000', E: '100', s: '700' }, { n: '3000', E: '150', s: '1000' }, { n: '4000', E: '100', s: '600' }, { n: '5000', E: '250', s: '1100' }], m_rho: 'SW', m_a: '1', R0: '0', trs: [{ e: '0,2y', t: 'c' }], k1: '0,04', k2: '0,02' } },
      { id: 'e14-2d', label: 'Enero 2014 · Ej. 2d · cuota-parte con retención del 80 %, CVaR 70 %, k₁ = k₂ = 2 %', values: { y_src: 'cartera', y_cart: [{ n: '1000', E: '100', s: '1000' }, { n: '2000', E: '100', s: '900' }, { n: '3000', E: '150', s: '1200' }, { n: '2000', E: '100', s: '800' }, { n: '1000', E: '150', s: '1200' }, { n: '1000', E: '200', s: '1400' }], m_rho: 'CVaR', m_lvl: '70', R0: '0', trs: [{ e: '0,2y', t: 'c' }], k1: '0,02', k2: '0,02' } },
      { id: 'e22-2b', label: 'Enero 2022 · Ej. 2b · stop-loss (y − 1.550.000)+, CVaR 99 %, k₁ = k₂ = 1 %', values: { y_src: 'cartera', y_cart: [{ n: '1000', E: '100', s: '1000' }, { n: '2500', E: '100', s: '950' }, { n: '4000', E: '150', s: '1800' }, { n: '3000', E: '200', s: '3000' }], m_rho: 'CVaR', m_lvl: '99', R0: '0', trs: [{ e: '(y − 1.550.000)+', t: 'c' }], k1: '0,01', k2: '0,01' } },
      { id: 'e20-2bc', label: 'Enero 2020 · Ej. 2b-c · 0,1y + 0,5(y − 1.700.000)+, SW₁, k₂ = 4 %', values: { y_src: 'cartera', y_cart: [{ n: '1000', E: '100', s: '1000' }, { n: '2500', E: '100', s: '950' }, { n: '4000', E: '150', s: '1800' }, { n: '3000', E: '200', s: '3000' }], m_rho: 'SW', m_a: '1', R0: '0', trs: [{ e: '0,1y + 0,5(y − 1.700.000)+', t: 'c' }], k1: '0', k2: '0,04' },
        expect: [{ k: 'rhoY', l: 'SW<sub>1</sub>(−y)', v: 1883369.11, src: 'con SW₁(N(0,1)) simulada' }, { k: 'Eyc', l: '𝔼(y<sub>c</sub>)', v: 169032.2937, src: 'Monte Carlo' }, { k: 'rhoc', l: 'SW<sub>1</sub>(−y<sub>c</sub>)', v: 285271.2768 }, { k: 'Pr', l: 'Π(y<sub>c</sub>)', v: 180443.1448 }, { k: 'prima', l: 'Nueva prima', v: 1778540.978 }, { k: 'seg', l: 'k₁ máximo', v: 0.147445792 }, { k: 'r0', l: 'k₂ máximo', v: 0.121346887 }] },
      { id: 'e19-2b', label: 'Enero 2019 · Ej. 2b · 0,5(y − 1.600.000)+, CVaR 95 %, k₂ = 4 %', values: { y_src: 'cartera', y_cart: [{ n: '1000', E: '100', s: '1000' }, { n: '2500', E: '100', s: '950' }, { n: '4000', E: '150', s: '1800' }, { n: '3000', E: '200', s: '3000' }], m_rho: 'CVaR', m_lvl: '95', R0: '0', trs: [{ e: '0,5(y − 1.600.000)+', t: 'c' }], k1: '0', k2: '0,04' },
        expect: [{ k: 'rhoY', l: 'CVaR<sub>95%</sub>(−y)', v: 1979154.3, src: 'con 2,064381357 simulado' }, { k: 'Eyc', l: '𝔼(y<sub>c</sub>)', v: 30014.95928 }, { k: 'rhoc', l: 'CVaR<sub>95%</sub>(−y<sub>c</sub>)', v: 189362.618 }, { k: 'Pr', l: 'Precio del reaseguro', v: 37589.464 }, { k: 'prima', l: 'Prima de la cartera', v: 1827381.146 }, { k: 'r0', l: 'k₂ (k₁ = 0)', v: 0.140151349 }, { k: 'seg', l: 'k₁ (k₂ = 0)', v: 0.178955578 }] },
      { id: 'e18-2b', label: 'Enero 2018 · Ej. 2b · 0,7y − 0,4(y − 1,6M)+ − 0,3(y − 1,9M)+, SW₂, k₂ = 10 %', values: { y_src: 'cartera', y_cart: [{ n: '1000', E: '100', s: '1000' }, { n: '2500', E: '100', s: '950' }, { n: '4000', E: '150', s: '1800' }, { n: '3000', E: '200', s: '2000' }], m_rho: 'SW', m_a: '2', R0: '0', trs: [{ e: '0,7y − 0,4(y − 1.600.000)+ − 0,3(y − 1.900.000)+', t: 'c' }], k1: '0', k2: '0,1' },
        expect: [{ k: 'rhoY', l: 'SW<sub>2</sub>(−y)', v: 1960647.987, src: 'macro' }, { k: 'Eyc', l: '𝔼(y<sub>c</sub>)', v: 1067152.45 }, { k: 'rhoc', l: 'SW<sub>2</sub>(−y<sub>c</sub>)', v: 1217804.614 }, { k: 'Pr', l: 'Precio del reaseguro', v: 1188932.911 }, { k: 'r0', l: 'k₂ (k₁ = 0)', v: 0.194719443 }, { k: 'seg', l: 'k₁ (k₂ = 0)', v: 0.24630728 }] },
      { id: 'e17-2b', label: 'Enero 2017 · Ej. 2b · 0,7y − 0,4(y − 9.000.000)+, SW₁, k₂ = 90 %', values: { y_src: 'cartera', y_cart: [{ n: '10000', E: '100', s: '1000' }, { n: '2500', E: '100', s: '900' }, { n: '10000', E: '150', s: '1200' }, { n: '4000', E: '150', s: '1100' }, { n: '30000', E: '200', s: '1400' }], m_rho: 'SW', m_a: '1', R0: '0', trs: [{ e: '0,7y − 0,4(y − 9.000.000)+', t: 'c' }], k1: '0', k2: '0,9' } },
      {
        id: 'e26-1', label: 'Enero 2026 · Ej. 1b-c · y_r = 0,9y − 0,5(y − 1.700.000)+, CVaR 95 %, PPVE 10 %',
        values: { y_src: 'cartera', y_cart: [{ n: '4000', E: '100', s: '1000' }, { n: '5000', E: '80', s: '900' }, { n: '2000', E: '150', s: '1200' }, { n: '6000', E: '100', s: '600' }], m_rho: 'CVaR', m_lvl: '95', R0: '0', trs: [{ e: '0,9y − 0,5(y − 1.700.000)+', t: 'r' }], k1: '0,1', k2: '0' },
        expect: [{ k: 'Eyc', l: '𝔼(y<sub>c</sub>)', v: 192821.7999, src: 'fórmula cerrada' }, { k: 'rhoc', l: 'CVaR<sub>95%</sub>(−y<sub>c</sub>)', v: 311598.8868 }, { k: 'Pr', l: 'Π<sub>r</sub>', v: 212103.9799 }, { k: 'prima', l: 'Prima de la cartera', v: 1836503.238 }, { k: 'seg', l: 'Recargo de seguridad máx.', v: 0.080296022 }, { k: 'r1', l: 'Recargo por riesgo máx. (k₁ = −1)', v: 0.948607953 }, { k: 'r0', l: 'Recargo por riesgo (k₁ = 0)', v: 0.070507938 }]
      },
      {
        id: 'e25-2b', label: 'Enero 2025 · Ej. 2b · tramos 0,2 / 0,6 desde 425.000, CVaR 90 %, PPVE 10 %',
        values: { y_src: 'cartera', y_cart: [{ n: '1000', E: '100', s: '1000' }, { n: '500', E: '80', s: '900' }, { n: '2000', E: '150', s: '1200' }, { n: '600', E: '100', s: '600' }], m_rho: 'CVaR', m_lvl: '90', R0: '0', trs: [{ e: 'tramos: 0:0,2; 425.000:0,6', t: 'c' }], k1: '0,1', k2: '0' },
        expect: [{ k: 'Eyc', l: '𝔼(y<sub>c</sub>)', v: 131517.5318, src: 'Monte Carlo, 10.000 sim.' }, { k: 'rhoc', l: 'CVaR<sub>90%</sub>(−y<sub>c</sub>)', v: 200297.6517, src: 'Monte Carlo' }, { k: 'prima', l: 'Prima de la cartera', v: 562142.4297 }, { k: 'seg', l: 'Recargo de seguridad máx.', v: 0.124284859 }, { k: 'r0', l: 'Recargo por riesgo máx. (k₁ = 0)', v: 0.100591401 }]
      },
      {
        id: 'e24-2b', label: 'Enero 2024 · Ej. 2b · 0,8y − 0,7(y − 2.450.000)+, SDPT₁, k₁ = k₂ = 1 %',
        values: { y_src: 'cartera', y_cart: [{ n: '2.000', E: '150', s: '1.000' }, { n: '5.000', E: '250', s: '2.000' }, { n: '3.000', E: '300', s: '3.000' }], m_rho: 'SDPT', m_a: '1', R0: '0', trs: [{ e: '0,8y − 0,7(y − 2.450.000)+', t: 'c' }], k1: '0,01', k2: '0,01' },
        expect: [{ k: 'Eyc', l: '𝔼(y<sub>c</sub>)', v: 1897908.579, src: 'Monte Carlo' }, { k: 'rhoc', l: 'SDPT<sub>1</sub>(−y<sub>c</sub>)', v: 1969925.897, src: 'Monte Carlo' }, { k: 'Pr', l: 'Π<sub>r</sub>', v: 1936586.924 }, { k: 'prima', l: 'Coste global tras reaseguro', v: 2617263.518 }, { k: 'seg', l: 'Recargo de seguridad máx.', v: 0.068270823 }, { k: 'r0', l: 'Recargo por riesgo máx.', v: 0.063103962 }]
      },
      {
        id: 'e24-2c', label: 'Enero 2024 · Ej. 2c · SDPT₁(−(y + ỹ − 3.950.000)+) con las dos carteras',
        values: { y_src: 'cartera', y_cart: [{ n: '2.000', E: '150', s: '1.000' }, { n: '5.000', E: '250', s: '2.000' }, { n: '3.000', E: '300', s: '3.000' }, { n: '2.000', E: '250', s: '1.000' }, { n: '4.000', E: '250', s: '2.000' }], m_rho: 'SDPT', m_a: '1', R0: '0', trs: [{ e: '(y − 3.950.000)+', t: 'c' }], k1: '0', k2: '0' }
      },
      {
        id: 'e23-2b', label: 'Enero 2023 · Ej. 2b · compara 0,3y, (y − 1.600.000)+ y el mixto, SW₁',
        values: { y_src: 'cartera', y_cart: [{ n: '2000', E: '150', s: '1000' }, { n: '5000', E: '150', s: '2000' }, { n: '3000', E: '200', s: '3000' }], m_rho: 'SW', m_a: '1', R0: '0', trs: [{ e: '0,3y', t: 'c' }, { e: '(y − 1.600.000)+', t: 'c' }, { e: '0,3y + 0,7(y − 1.600.000)+', t: 'c' }], k1: '0,01', k2: '0,01' },
        expect: [{ k: 'rhoc2', l: 'SW<sub>1</sub> cedida (stop-loss)', v: 398968.4237, src: 'Monte Carlo (Ej_2b_StopLoss0)' }],
        note: 'La solución oficial (apartado c) concluye que el stop-loss puro es el más eficiente y que añadir cuota-parte empeora a la cedente. Con valores exactos y estos recargos (k₁ = k₂ = 1 %), el mixto sale ligeramente mejor (1.709.463 frente a 1.719.298), porque la propia cuota-parte ya abarata la prima: la reaseguradora cobra 1,01𝔼 + 0,01·SW₁, menos que la SW₁ cedida. Si en el examen te piden comentar, explica este efecto y cita las cifras que uses.'
      },
      {
        id: 'j25-2b', label: 'Junio 2025 · Ej. 2b · stop-loss (y − 500.000)+, SW₁, PPVE 10 %',
        values: { y_src: 'cartera', y_cart: [{ n: '1000', E: '100', s: '1000' }, { n: '500', E: '80', s: '900' }, { n: '2000', E: '150', s: '1200' }, { n: '600', E: '100', s: '600' }], m_rho: 'SW', m_a: '1', R0: '0', trs: [{ e: '(y − 500.000)+', t: 'c' }], k1: '0,1', k2: '0' },
        expect: [{ k: 'rhoY', l: 'SW<sub>1</sub>(−y) = prima sin reaseguro', v: 607586.1392, src: 'con SW₁(N(0,1)) simulada' }, { k: 'rhoc', l: 'SW<sub>1</sub>(−y<sub>c</sub>)', v: 106253.6199, src: 'Monte Carlo' }, { k: 'prima', l: 'Prima de la cartera', v: 530781.3035 }]
      },
      {
        id: 'j23-2c', label: 'Junio 2023 · Ej. 2c · capa (y − 950.000)+ − (y − 1.150.000)+, CVaR 94 %, 1,02𝔼',
        values: { y_src: 'cont', y_c_fam: 'normal', y_c_normal_p_m: '1.100.000', y_c_normal_p_s: '21.621,74831', m_rho: 'CVaR', m_lvl: '94', R0: '0', trs: [{ e: '(y − 950.000)+ − (y − 1.150.000)+', t: 'c' }], k1: '0,02', k2: '0' },
        expect: [{ k: 'rhoY', l: 'CVaR<sub>94%</sub>(−y)', v: 1142927.457 }, { k: 'rhor', l: 'Riesgo retenido', v: 951388.4048, src: 'capas simuladas' }, { k: 'Eyc', l: '𝔼(y<sub>c</sub>)', v: 149698.3965, src: 'simulado' }, { k: 'Pr', l: 'Prima del reaseguro 1,02𝔼(y<sub>c</sub>)', v: 1.02 * 149698.3965, src: 'corregida' }, { k: 'prima', l: 'Prima del seguro directo', v: 951388.4048 + 1.02 * 149698.3965, src: 'corregida' }],
        note: '<b>Errata en la solución oficial:</b> escribe «1,02 × (149.764,5943 − 66,19781827) = 149.698,3965», pero ese producto vale 152.692,36 (olvida el 1,02); por eso su prima del seguro directo (1.101.086,80) es menor de lo debido: con el 1,02 sale 1.104.080,76. Además 𝔼((y − 950.000)<sup>+</sup>) es exactamente 150.000 (la solución lo simula: 149.764,59).'
      },
      {
        id: 'j24-2c', label: 'Junio 2024 · Ej. 2c · 0,9y − 0,6(y − 2.450.000)+, SW₁',
        values: { y_src: 'cartera', y_cart: [{ n: '2.000', E: '150', s: '1.000' }, { n: '5.000', E: '250', s: '2.000' }, { n: '3.000', E: '300', s: '3.000' }], m_rho: 'SW', m_a: '1', R0: '0', trs: [{ e: '0,9y − 0,6(y − 2.450.000)+', t: 'c' }], k1: '0', k2: '0' },
        note: 'El enunciado deja el precio π de la reaseguradora como incógnita: con k₁ = k₂ = 0 obtienes 𝔼(y<sub>c</sub>) y SW₁(−y<sub>c</sub>); la prima de la cartera es SW₁(−y) + π − SW₁(−y<sub>c</sub>).'
      }
    ]
  });

  /* ═════════ T5 · Prioridad óptima ═════════ */
  UI.tool({
    id: 't5-optimo', tema: 5, title: 'Prioridad U óptima de un stop-loss', tag: 'avance tema 9',
    short: 'Barrido de U en y<sub>c</sub> = (y − U)<sup>+</sup>: la U que minimiza la prima de la cartera.',
    cuando: '«Considere un stop-loss genérico (y − k)<sup>+</sup> y establezca un procedimiento para estimar el k óptimo».',
    que: 'Repite el cálculo del reaseguro stop-loss para muchas prioridades U y se queda con la que deja la prima de cartera más baja desde el punto de vista de la cedente (avance del reaseguro óptimo, tema 9).',
    groups: [
      { title: 'Siniestralidad global y', fields: P.srcFields('y_', ['cartera', 'cont', 'compuesta'], 'cartera', { cart: [{ n: '1000', E: '100', s: '1000' }, { n: '500', E: '80', s: '900' }, { n: '2000', E: '150', s: '1200' }, { n: '600', E: '100', s: '600' }] }) },
      { title: 'Medida de la cedente', fields: [...P.measFields('m_', { type: 'SW', a: '1' }), { id: 'R0', type: 'num', label: 'Reservas iniciales R₀', def: '0' }] },
      { title: 'Reaseguradora', fields: [{ id: 'k1', type: 'num', label: 'k₁ʳ', def: '0,1' }, { id: 'k2', type: 'num', label: 'k₂ʳ', def: '0' }] },
      { title: 'Rango de U (opcional)', optional: true, fields: [{ id: 'U1', type: 'num', label: 'U desde', def: '', ph: 'automático' }, { id: 'U2', type: 'num', label: 'U hasta', def: '', ph: 'automático' }, { id: 'nU', type: 'num', label: 'Nº de puntos', def: '41' }] }
    ],
    solve(V, { result }) {
      const R = result();
      const src = P.buildSrc(V, 'y_'), D = src.D, sp = P.buildMeas(V, 'm_'), R0 = V.n('R0'), k1 = V.n('k1'), k2 = V.n('k2');
      const rhoY = T.risk(D, sp);
      let U1 = V.nOpt('U1'), U2 = V.nOpt('U2'); const n = Math.max(3, Math.min(400, Math.round(V.n('nU'))));
      if (U1 === null) U1 = Math.max(0, D.mean - 3 * D.sd);
      if (U2 === null) U2 = D.VaR(0.001);
      const pts = [];
      for (let i = 0; i < n; i++) {
        const U = U1 + (U2 - U1) * i / (n - 1);
        const C = T.transformDist(D, { a0: 0, layers: [{ a: 1, U }] });
        const E = C.mean, rc = T.risk(C, sp), Pr = (1 + k1) * E + k2 * rc, prima = rhoY - R0 + Pr - rc;
        pts.push([U, E, rc, Pr, prima]);
      }
      const bi = pts.reduce((b, p, i) => p[4] < pts[b][4] ? i : b, 0);
      R.tile('U óptima (en la rejilla)', pts[bi][0], { main: true }).tile('Prima mínima de la cartera', pts[bi][4], { main: true }).tile('Prima sin reaseguro', rhoY - R0);
      R.key('Uopt', pts[bi][0]).key('pmin', pts[bi][4]);
      R.uses('rea58', MK(sp.type), 'prima71'); if (src.normal) R.uses('slN');
      R.ans('', `Lo realizado para una prioridad concreta (𝔼((y − U)<sup>+</sup>), ${rn(sp, '−(y − U)<sup>+</sup>')}, prima del reaseguro y prima de la cartera) se repite para una gama amplia de valores de U, entre ${f(U1)} y ${f(U2)}. Queda como óptimo aquel valor de U para el que la prima de la cartera resulta mínima: U ≈ ${vv(pts[bi][0])}, con prima ${vv(pts[bi][4])} (sin reaseguro sería ${f(rhoY - R0)}).`);
      R.step('Procedimiento', `Para cada prioridad U se repite el cálculo del reaseguro y<sub>c</sub> = (y − U)<sup>+</sup>: 𝔼(y<sub>c</sub>), ${rn(sp, '−y<sub>c</sub>')}, Π<sub>r</sub> = (1 + k₁)𝔼(y<sub>c</sub>) + k₂${rn(sp, '−y<sub>c</sub>')} y la prima de la cartera ${rn(sp)} − R₀ + Π<sub>r</sub> − ${rn(sp, '−y<sub>c</sub>')}. La U óptima es la que da la prima mínima (vista de la cedente).` + eq(`U* ≈ ${vv(pts[bi][0])}; &nbsp; prima mínima = ${vv(pts[bi][4])}`) + (bi === 0 || bi === n - 1 ? '<div class="warn">El mínimo está en un extremo del rango: amplía el rango de U.</div>' : 'Afina el resultado estrechando el rango de U alrededor del óptimo.'));
      R.table('Barrido de U', ['U', '𝔼((y − U)<sup>+</sup>)', rn(sp, '−y<sub>c</sub>'), 'Π<sub>r</sub>', 'Prima de la cartera'], pts, { hl: i => i === bi });
      return R;
    },
    examples: [
      { id: 'e22-2c', label: 'Enero 2022 · Ej. 2c · k óptimo con CVaR 99 % y k₁ = k₂ = 1 %', values: { y_src: 'cartera', y_cart: [{ n: '1000', E: '100', s: '1000' }, { n: '2500', E: '100', s: '950' }, { n: '4000', E: '150', s: '1800' }, { n: '3000', E: '200', s: '3000' }], m_rho: 'CVaR', m_lvl: '99', k1: '0,01', k2: '0,01', U1: '900.000', U2: '1.800.000', nU: '91' },
        expect: [{ k: 'Uopt', l: 'k óptimo', v: 1100000, src: 'tanteo con 5 umbrales' }, { k: 'pmin', l: 'Prima mínima', v: 1565624.278 }] },{ id: 'j25-2c', label: 'Junio 2025 · Ej. 2c · k óptimo del stop-loss con SW₁ y PPVE 10 %', values: { y_src: 'cartera', m_rho: 'SW', m_a: '1', k1: '0,1', k2: '0' } }]
  });
})();
