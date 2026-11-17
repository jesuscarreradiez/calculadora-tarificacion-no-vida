/* ════════════════════════════════════════════════════════════════
   TEMA 10 — Credibilidad y bonus-malus: Gamma–Poisson, Beta para
   probabilidades de N, Bühlmann por momentos y credibilidad clásica.
   (Bühlmann con grupos o con mixtura continua: herramientas del tema 3.)
   ════════════════════════════════════════════════════════════════ */
'use strict';
(function () {
  const T = TNV, f = T.fmt, eq = UI.eq, vv = UI.v, rn = P.rn;
  const pct = x => T.fmtPct(x);
  const redTxt = r => (r >= 0 ? 'reducción' : 'recargo');

  UI.tema({
    n: 10, short: 'Credibilidad', title: 'Credibilidad y bonus-malus', color: 'var(--t10)',
    desc: 'Bonus-malus: actualizar la prima de un asegurado con su propia experiencia. Credibilidad clásica, inferencia bayesiana (Gamma–Poisson, Beta–Binomial, variables discretas) y credibilidad de Bühlmann.',
    formulas: [
      ['Clásica (100)', 'z = (m/s)·θ√h/Φ<sup>−1</sup>((1 + β)/2) ≤ 1; variación z(X̄ − m)/m'],
      ['Gamma–Poisson (101–103)', 'α* = α + ΣNⱼ; β* = β/(1 + hβ); α*β* = zN̄ + (1 − z)αβ, z = hβ/(1 + hβ)'],
      ['Beta–Binomial (104–105)', 'u* = u + w; v* = v + h − w; 𝔼(p) = u*/(u* + v*)'],
      ['Discretas (108–109)', 'IP(Λᵢ|N = m) = p(m|Λᵢ)qᵢ/Σ p(m|Λₗ)qₗ; 𝔼(Λ|N) = Σ Λᵢ IP(Λᵢ|N)'],
      ['Bühlmann (114–116)', 'h̃ = 𝔼(σ²(Θ|Λ))/σ²(𝔼(Θ|Λ)) = 1/I; z = h/(h + h̃); 𝔼(Λ|datos) = zΘ̄ + (1 − z)𝔼(Λ)'],
      ['Bonus-malus (PPVE)', '% reducción = (𝔼 a priori − 𝔼 a posteriori)/𝔼 a priori']
    ]
  });

  const MODOS = [['gp', 'Gamma–Poisson: λ ∼ Gamma(α; β) y N|λ Poisson'], ['beta', 'Beta para IP(N = n) (y beta para IP(N ≤ k))'], ['buhl', 'Bühlmann a partir de los momentos (𝔼, media de varianzas, varianza de medias)'], ['clas', 'Credibilidad clásica (margen de error θ y nivel β)']];
  const isM = (...ms) => v => ms.includes(v.modo);
  const prOn = v => (v.modo === 'gp' || v.modo === 'beta') && v.prOn;

  // Prima Π = a𝔼(y) + bρ(−y) para una frecuencia y una severidad (distribución exacta; Monte Carlo opcional)
  function premium(freq, Sb, sp, A, B, mc) {
    const r = T.compound({ freq, sev: Sb.D, mc });
    const rho = T.risk(r.dist, sp), E = r.Ey, Pi = A * E + B * rho;
    let m = null; if (r.mcDist) { const rm = T.risk(r.mcDist, sp); m = { E: r.mcDist.mean, rho: rm, Pi: A * r.mcDist.mean + B * rm }; }
    return { E, rho, Pi, m };
  }
  function premiumBlock(R, V, fPri, fPost, txtPri, txtPost) {
    const Sb = P.buildFam(V, 'S_', P.CF), sp = P.buildMeas(V, 'm_'), A = V.n('A'), B = V.n('B');
    const mc = V.b('mc') ? { n: Math.min(2e6, Math.round(V.n('mcn', { pos: 1 }))), seed: 12345 } : null;
    const a = premium(fPri, Sb, sp, A, B, mc), b = premium(fPost, Sb, sp, A, B, mc), red = (a.Pi - b.Pi) / a.Pi, RN = rn(sp);
    R.tile('Prima a priori', a.Pi, { main: true }).tile('Prima a posteriori', b.Pi, { main: true }).tile(`${red >= 0 ? 'Reducción' : 'Recargo'} con Π`, Math.abs(red), { pct: 1, main: true });
    R.key('primaPri', a.Pi).key('primaPost', b.Pi).key('rhoPri', a.rho).key('rhoPost', b.rho).key('redP', red);
    R.table('Prima a priori y a posteriori', ['', 'A priori', 'A posteriori'], [['Frecuencia', txtPri, txtPost], ['𝔼(N)', fPri.mean, fPost.mean], ['𝔼(y) = 𝔼(N)𝔼(S)', a.E, b.E], [RN, a.rho, b.rho], [`Π(y) = ${f(A)}𝔼(y) + ${f(B)}${RN}`, a.Pi, b.Pi],
      ...(mc ? [['Monte Carlo: ' + RN, a.m.rho, b.m.rho], ['Monte Carlo: Π(y)', a.m.Pi, b.m.Pi]] : [])], { top: true });
    R.uses('comp26', 'prima66');
    R.ans('Prima con severidad.', `${Sb.ex} A priori la frecuencia es ${txtPri} y a posteriori ${txtPost}; el coste y es la composición de frecuencia y severidad, con 𝔼(y) = 𝔼(N)𝔼(S) = ${vv(a.E)} a priori y ${vv(b.E)} a posteriori. Como no hay fórmula cerrada para ${RN}, se obtiene numéricamente la distribución de y${mc ? ` (o procediendo por ${f(mc.n)} simulaciones de Monte Carlo: ${f(a.m.rho)} y ${f(b.m.rho)})` : ' (o por simulación de Monte Carlo)'}: ${RN} = ${vv(a.rho)} a priori y ${vv(b.rho)} a posteriori. Las primas son ${f(A)} × ${f(a.E)} + ${f(B)} × ${f(a.rho)} = ${vv(a.Pi)} y ${f(A)} × ${f(b.E)} + ${f(B)} × ${f(b.rho)} = ${vv(b.Pi)}, y el porcentaje de ${redTxt(red)} es (${f(a.Pi)} − ${f(b.Pi)})/${f(a.Pi)} ≈ ${pct(Math.abs(red))}.`);
    if (!mc) R.note('Las soluciones oficiales estiman este CVaR por Monte Carlo (100.000 simulaciones), así que difieren en la 3ª–4ª cifra. Marca «Simular también por Monte Carlo» para ver el valor simulado.');
  }

  UI.tool({
    id: 't10-cred', tema: 10, title: 'Credibilidad y bonus-malus', tag: 'Gamma–Poisson, Beta, Bühlmann',
    short: 'Porcentaje de reducción o recargo tras observar al asegurado: distribuciones conjugadas, betas para las probabilidades de N, Bühlmann y credibilidad clásica; también con prima con CVaR.',
    cuando: '«λ es una gamma… N|λ Poisson… de un asegurado se tienen las realizaciones…», «IP(N = 0) es una beta…», «bajo credibilidad de Bühlmann…», «cuántos años sin siniestros para un descuento del …».',
    que: 'El bonus-malus actualiza la frecuencia (o el coste) esperada de un asegurado con su propia experiencia. Con distribuciones conjugadas la actualización es exacta (Gamma–Poisson, Beta–Binomial); Bühlmann da una ponderación lineal z·(media muestral) + (1 − z)·(media a priori). Bajo el PPVE el porcentaje de reducción/recargo es el cambio relativo de la esperanza; con otro principio de prima hay que componer la frecuencia a priori y a posteriori con la severidad.',
    groups: [
      { title: 'Tipo de ejercicio', fields: [{ id: 'modo', type: 'sel', label: 'Modelo', def: 'gp', opts: MODOS, wide: true }] },
      {
        title: 'Datos del asegurado', fields: [
          { id: 'obs', type: 'text', label: 'Observaciones (separadas por «;»)', def: '0; 2; 2; 0', ph: 'p. ej. 0; 1; 0', help: 'Nº de siniestros (o costes, en Bühlmann) de cada año', wide: true, show: isM('gp', 'beta', 'buhl') },
          { id: 'hN', type: 'num', label: 'o bien: nº de datos h', def: '', ph: 'si no hay lista', show: isM('gp', 'buhl', 'clas') },
          { id: 'mN', type: 'num', label: 'y su media muestral', def: '', ph: 'p. ej. 0', show: isM('gp', 'buhl', 'clas') },
          { id: 'tg', type: 'num', label: 'Descuento objetivo: años sin siniestros', def: '', ph: 'p. ej. 50 %', help: 'Cuántos años seguidos sin siniestros hacen falta para ese descuento', show: isM('gp', 'buhl') }
        ]
      },
      {
        title: 'Gamma–Poisson', fields: [
          { id: 'ga', type: 'num', label: 'α de la gamma', def: '1', show: isM('gp') }, { id: 'gb', type: 'num', label: 'β de la gamma', def: '2', show: isM('gp'), help: '𝔼(λ) = αβ, σ²(λ) = αβ²' }
        ]
      },
      {
        title: 'Beta para las probabilidades de N', fields: [
          { id: 'noPri', type: 'check', label: 'No se da la distribución de N (sólo hay beta para IP(N = 0))', def: false, wide: true, show: isM('beta') },
          ...P.withShow(P.famFields('N_', P.FR, Object.keys(P.FR), 'poisson', { N_poisson_p_lam: '1' }, 'Distribución a priori de N'), v => v.modo === 'beta' && !v.noPri),
          { id: 'bt', type: 'rows', label: 'Una fila por probabilidad IP(N = n) con distribución beta', cols: [{ id: 'n', label: 'n' }, { id: 'u', label: 'u' }, { id: 'v', label: 'v' }], def: [{ n: '0', u: '1', v: '1' }], show: isM('beta'), help: 'Admite expresiones: 2*exp(-1)/(1-exp(-1))' },
          { id: 'uAuto', type: 'check', label: 'Calcular u para que no haya contradicción con N: u = v·IP(N = n)/(1 − IP(N = n))', def: false, wide: true, show: v => v.modo === 'beta' && !v.noPri },
          { id: 'grp', type: 'check', label: 'Además: una sola beta para IP(N ≤ k), con k el mayor n de la tabla (apartados tipo «sólo distingue N ≤ 3»)', def: false, wide: true, show: v => v.modo === 'beta' && !v.noPri }
        ]
      },
      {
        title: 'Bühlmann: momentos de la población', fields: [
          { id: 'bE', type: 'num', label: '𝔼 a priori: 𝔼(Λ) = 𝔼(y)', def: '40', show: isM('buhl') },
          { id: 'bVm', type: 'num', label: 'Varianza de medias σ²(𝔼(y|Λ))', def: '320', show: isM('buhl'), help: 'Si 𝔼(y|Λ) = Λ, es σ²(Λ)' },
          { id: 'bEv', type: 'num', label: 'Media de varianzas 𝔼(σ²(y|Λ))', def: '256', show: isM('buhl') },
          { id: 'bI', type: 'num', label: 'o bien: índice de mixtura I', def: '', ph: 'opcional (sustituye a las dos anteriores)', show: isM('buhl') }
        ]
      },
      {
        title: 'Credibilidad clásica', fields: [
          { id: 'cm', type: 'num', label: 'm (media poblacional)', def: '1', show: isM('clas') }, { id: 'cs', type: 'num', label: 's (desviación)', def: '1', show: isM('clas') },
          { id: 'cth', type: 'num', label: 'Margen de error θ', def: '0,05', show: isM('clas') }, { id: 'cbe', type: 'num', label: 'Nivel de confianza β', def: '0,9', show: isM('clas') }
        ]
      },
      {
        title: 'Prima con severidad y medida de riesgo (opcional)', optional: true, openIf: v => v.prOn, show: v => v.modo === 'gp' || (v.modo === 'beta' && !v.noPri), fields: [
          { id: 'prOn', type: 'check', label: 'Calcular la prima a priori y a posteriori con Π(y) = a𝔼(y) + bρ(−y)', def: false, wide: true },
          { id: 'fq', type: 'sel', label: 'Frecuencia para tarificar (Gamma–Poisson)', def: 'bn', opts: [['bn', 'Binomial negativa (mixtura): BN(α; 1/(1 + β)) y BN(α*; 1/(1 + β*))'], ['pois', 'Poisson con la media de λ: Poisson(αβ) y Poisson(α*β*)']], wide: true, show: v => v.modo === 'gp' && v.prOn },
          ...P.withShow(P.famFields('S_', P.CF, P.CF_POS.concat(['mixtura', 'constante', 'discreta']), 'lognormal', {}, 'Severidad S'), prOn),
          ...P.withShow(P.measFields('m_', { type: 'CVaR', lvl: '95' }), prOn),
          { id: 'A', type: 'num', label: 'a (de 𝔼(y))', def: '1,05', show: prOn }, { id: 'B', type: 'num', label: 'b (de ρ(−y))', def: '0,05', show: prOn },
          { id: 'mc', type: 'check', label: 'Simular también por Monte Carlo (como el profesor)', def: false, show: prOn }, { id: 'mcn', type: 'num', label: 'Nº de simulaciones', def: '100000', show: v => prOn(v) && v.mc }
        ]
      }
    ],
    solve(V, { result }) {
      const R = result(), modo = V.s('modo');
      const obs = modo === 'clas' ? [] : V.list('obs', { opt: true });
      const hN = V.nOpt('hN'), mN = V.nOpt('mN');
      const h = obs.length || hN || 0, xb = obs.length ? obs.reduce((a, b) => a + b, 0) / obs.length : (mN || 0), sumN = obs.length ? obs.reduce((a, b) => a + b, 0) : h * xb;
      const tg = V.nOpt('tg');
      const obsTxt = obs.length ? obs.map(o => f(o)).join(', ') : `${f(h)} datos de media ${f(xb)}`;

      if (modo === 'gp') {
        const al = V.n('ga', { pos: 1 }), be = V.n('gb', { pos: 1 });
        if (!(h > 0) && tg === null) throw new Error('Escribe las observaciones del asegurado (o h y la media).');
        const E0 = al * be, als = al + sumN, bes = be / (1 + h * be), E1 = als * bes, z = h * be / (1 + h * be), red = (E0 - E1) / E0;
        R.tile('α*', als).tile('β*', bes).tile('𝔼(λ) a priori = αβ', E0).tile('𝔼(λ) a posteriori = α*β*', E1, { main: true }).tile(red >= 0 ? 'Reducción (PPVE)' : 'Recargo (PPVE)', Math.abs(red), { pct: 1, main: true }).tile('Peso z de la muestra', z);
        R.key('als', als).key('bes', bes).key('E0', E0).key('E1', E1).key('red', red).key('z', z);
        R.step('Distribución a posteriori (ec. 101)', eq(`α* = α + ΣNⱼ = ${f(al)} + ${f(sumN)} = ${vv(als)}; &nbsp; β* = β/(1 + hβ) = ${f(be)}/(1 + ${f(h)} × ${f(be)}) = ${vv(bes)}`) +
          eq(`𝔼(λ) = αβ = ${vv(E0)} (a priori); &nbsp; α*β* = ${vv(E1)} (a posteriori)`) + eq(`z = hβ/(1 + hβ) = ${vv(z)}: α*β* = ${f(z)} × ${f(xb)} + ${f(1 - z)} × ${f(E0)}`) +
          eq(`${redTxt(red)} = |${f(E0)} − ${f(E1)}|/${f(E0)} = ${vv(Math.abs(red))}`));
        R.uses('gp101', 'redpp');
        R.ans('Bonus-malus con distribuciones conjugadas.', `A priori la frecuencia esperada del asegurado medio es 𝔼(λ) = αβ = ${f(al)} × ${f(be)} = ${vv(E0)}. La media de sus observaciones (${obsTxt}) es ${f(xb)}. Por el teorema de Bayes, a posteriori λ es una gamma de parámetros α* = α + ΣNⱼ = ${f(al)} + ${f(sumN)} = ${vv(als)} y β* = β/(1 + hβ) = ${f(be)}/${f(1 + h * be)} = ${vv(bes)}, cuya media es α*β* = ${vv(E1)}. Bajo el PPVE el porcentaje de ${redTxt(red)} es (${f(E0)} − ${f(E1)})/${f(E0)} = ${vv(Math.abs(red))} ≈ ${pct(Math.abs(red))}.`);
        R.ans('Peso de la información muestral.', `α*β* = z·N̄ + (1 − z)αβ con z = hβ/(1 + hβ) = ${vv(z)}: la información muestral pesa un ${pct(z)} y la a priori un ${pct(1 - z)}. z crece con h y con β (a mayor β, mayor índice de mixtura de N y mayor heterogeneidad, luego menos estable es la información a priori). En general, el ${redTxt(red)} es z(N̄ − αβ)/(αβ) = hβ(N̄ − αβ)/(αβ(1 + hβ)): hay recargo si N̄ > αβ y reducción si N̄ < αβ.`);
        R.ans('Con Bühlmann.', `En el caso Gamma–Poisson, h̃ = 𝔼(σ²(N|λ))/σ²(𝔼(N|λ)) = αβ/(αβ²) = 1/β = ${f(1 / be)}, luego z = h/(h + h̃) = hβ/(1 + hβ) = ${f(z)} y se obtiene exactamente el mismo resultado (${pct(Math.abs(red))}).`);
        if (h >= 1) R.ans('¿Qué observación da reducción?', `Tras un solo año con N siniestros, la media a posteriori es (α + N)β/(1 + β), menor que αβ si y sólo si N < αβ = ${f(E0)}. ${E0 <= 1 ? `Como αβ ≤ 1, sólo hay reducción si el asegurado no presenta siniestros (N = 0).` : `Hay reducción con N ≤ ${Math.ceil(E0) - 1}.`}`);
        if (tg !== null) {
          const X = tg >= 1 ? tg / 100 : tg, hx = X / (be * (1 - X)), hn = Math.ceil(hx - 1e-9);
          R.tile(`Años sin siniestros para ${pct(X)}`, String(hn)); R.key('hTarget', hx).key('hYears', hn);
          R.ans(`Años sin siniestros para un descuento del ${pct(X)}.`, `Tras h años sin siniestros, α*β* = αβ/(1 + hβ), y la reducción es hβ/(1 + hβ) ≥ ${f(X)} ⇔ h ≥ ${f(X)}/(β(1 − ${f(X)})) = ${vv(hx)}. Hacen falta ${hn} años seguidos sin siniestros.`);
        }
        if (V.b('prOn')) {
          const bn = V.s('fq') !== 'pois';
          const fPri = bn ? T.negbin(al, 1 / (1 + be)) : T.poisson(E0), fPost = bn ? T.negbin(als, 1 / (1 + bes)) : T.poisson(E1);
          premiumBlock(R, V, fPri, fPost, bn ? `BN(α = ${f(al)}; θ = 1/(1 + β) = ${f(1 / (1 + be))})` : `Poisson(${f(E0)})`, bn ? `BN(α* = ${f(als)}; θ* = ${f(1 / (1 + bes))})` : `Poisson(${f(E1)})`);
        }
        return R;
      }

      if (modo === 'beta') {
        const rows = V.rows('bt'); if (!rows.length) throw new Error('Añade al menos una fila n, u, v.');
        if (!obs.length) throw new Error('Escribe las observaciones de N del asegurado.');
        const noPri = V.b('noPri');
        let N = null, pmf = n => NaN;
        if (!noPri) { N = P.buildFam(V, 'N_', P.FR).D; pmf = n => N.pmf(n); }
        if (noPri && (rows.length !== 1 || rows[0].n !== 0)) throw new Error('Sin distribución de N sólo se puede trabajar con una beta para IP(N = 0).');
        const hh = obs.length;
        const B = rows.map(r => {
          const n = Math.round(r.n), pn = pmf(n), w = obs.filter(o => o === n).length;
          let u = r.u, v = r.v;
          if (V.b('uAuto') && !noPri) u = v * pn / (1 - pn);
          if (!(u > 0 && v > 0)) throw new Error(`Fila n = ${n}: u y v deben ser positivos.`);
          const us = u + w, vs = v + hh - w;
          return { n, u, v, pn, w, us, vs, pri: u / (u + v), post: us / (us + vs) };
        });
        R.table('Betas a priori y a posteriori', ['n', 'u', 'v', 'u/(u + v)', ...(noPri ? [] : ['IP(N = n) de la distribución de N']), 'Veces observado w', 'u* = u + w', 'v* = v + h − w', '𝔼 a posteriori = u*/(u* + v*)'],
          B.map(b => [String(b.n), b.u, b.v, b.pri, ...(noPri ? [] : [b.pn]), String(b.w), b.us, b.vs, b.post]), { top: true });
        B.forEach(b => R.key('post' + b.n, b.post).key('us' + b.n, b.us).key('vs' + b.n, b.vs));
        if (!noPri) {
          const ok = B.every(b => Math.abs(b.pri - b.pn) < 1e-6);
          R.uses('beta104');
          R.ans('Coherencia de la información.', `Para que no haya contradicción, la esperanza de cada beta debe coincidir con la probabilidad que da la distribución de N: ${B.map(b => `IP(N = ${b.n}) = ${f(b.pn)} ${Math.abs(b.pri - b.pn) < 1e-6 ? '=' : '≠'} u/(u + v) = ${f(b.u)}/(${f(b.u)} + ${f(b.v)}) = ${f(b.pri)}`).join('; ')}. ${ok ? 'Se cumple: no hay contradicción.' : '<b>No se cumple</b>: la información es contradictoria (revisa u y v o usa «Calcular u»).'}`);
        } else R.uses('beta104');
        R.ans('Distribución a posteriori.', `En ${hh} años el suceso N = n se ha dado w veces, luego cada beta pasa a ser Beta(u + w; v + h − w): ${B.map(b => `IP(N = ${b.n}) ∼ Beta(${f(b.us)}; ${f(b.vs)}), de media ${vv(b.post)}`).join('; ')}.${B.some(b => b.n === 0) ? ` (IP(N > 0) = 1 − IP(N = 0) sigue una Beta(v; u), es decir, Beta(${f(B.find(b => b.n === 0).v)}; ${f(B.find(b => b.n === 0).u)}) a priori.)` : ''}`);
        const sPri = noPri ? B[0].pri : B.reduce((a, b) => a + b.pn, 0), sPost = B.reduce((a, b) => a + b.post, 0), alpha = (1 - sPost) / (1 - sPri);
        R.tile('α (escala del resto de probabilidades)', alpha); R.key('alpha', alpha);
        let E0, E1, red;
        R.uses('redpp');
        if (noPri) {
          red = 1 - alpha; E0 = null; E1 = null;
          R.ans('Reducción / recargo.', `El resto de probabilidades IP(N = n), n > 0, se multiplica por la misma constante α = (1 − ${f(B[0].post)})/(1 − ${f(B[0].pri)}) = ${vv(alpha)}. Como N = 0 no contribuye a la esperanza, 𝔼 a posteriori(N) = α·𝔼 a priori(N), y bajo el PPVE el porcentaje de ${redTxt(red)} es |1 − α| = ${vv(Math.abs(red))} ≈ ${pct(Math.abs(red))}.`);
        } else {
          E0 = N.mean; const sn = B.reduce((a, b) => a + b.n * b.pn, 0), snPost = B.reduce((a, b) => a + b.n * b.post, 0);
          E1 = snPost + alpha * (E0 - sn); red = (E0 - E1) / E0;
          R.tile('𝔼(N) a priori', E0).tile('𝔼(N) a posteriori', E1, { main: true });
          R.key('E0', E0).key('E1', E1);
          R.step('Esperanza a posteriori', eq(`α = (1 − Σ IP*(N = n))/(1 − Σ IP(N = n)) = ${f(1 - sPost)}/${f(1 - sPri)} = ${vv(alpha)}`) + eq(`𝔼*(N) = Σ n·IP*(N = n) + α(𝔼(N) − Σ n·IP(N = n)) = ${f(snPost)} + ${f(alpha)} × (${f(E0)} − ${f(sn)}) = ${vv(E1)}`));
          R.ans('Reducción / recargo.', `El resto de probabilidades (n fuera de la tabla) se transforma proporcionalmente para que la suma sea uno: α = (1 − ${f(sPost)})/(1 − ${f(sPri)}) = ${vv(alpha)}. El número esperado de siniestros a posteriori es ${B.filter(b => b.n > 0).map(b => `${b.n} × ${f(b.post)}`).join(' + ') || '0'} + ${f(alpha)} × (${f(E0)} − ${f(sn)}) = ${vv(E1)}, frente a ${f(E0)} a priori. Bajo el PPVE procede un${red >= 0 ? 'a reducción' : ' recargo'} del (${f(E0)} − ${f(E1)})/${f(E0)} = ${vv(Math.abs(red))} ≈ ${pct(Math.abs(red))}.`);
        }
        R.tile(red >= 0 ? 'Reducción (PPVE)' : 'Recargo (PPVE)', Math.abs(red), { pct: 1, main: true }); R.key('red', red);
        if (!noPri && V.b('grp')) {
          const k = Math.max(...B.map(b => b.n)), p = Array.from({ length: k + 1 }, (_, n) => N.pmf(n)).reduce((a, b) => a + b, 0);
          const ps = B.length === k + 1 ? sPost : NaN, w = obs.filter(o => o <= k).length;
          if (!isFinite(ps)) throw new Error('Para la beta de IP(N ≤ k) la tabla debe tener todas las n de 0 a k.');
          const v = (w - ps * hh) * (1 - p) / (ps - p), u = p * v / (1 - p);
          const aG = ps / p, bG = (1 - ps) / (1 - p), snk = Array.from({ length: k + 1 }, (_, n) => n * N.pmf(n)).reduce((a, b) => a + b, 0), Eg = aG * snk + bG * (E0 - snk), redg = (E0 - Eg) / E0;
          R.tile(`u de IP(N ≤ ${k})`, u).tile(`v de IP(N ≤ ${k})`, v).tile(`𝔼(N) si sólo distingue N ≤ ${k}`, Eg).tile(`${redg >= 0 ? 'Reducción' : 'Recargo'} (N ≤ ${k})`, Math.abs(redg), { pct: 1 });
          R.key('uG', u).key('vG', v).key('Eg', Eg).key('redG', redg);
          R.ans(`Beta única para IP(N ≤ ${k}).`, `A priori IP(N ≤ ${k}) = p = ${vv(p)} y a posteriori p* = ${vv(ps)}; el suceso N ≤ ${k} salió ${w} veces en ${hh} pruebas, luego u/(u + v) = p y (u + ${w})/(u + v + ${hh}) = p*. La solución es v = (${w} − ${hh}p*)(1 − p)/(p* − p) = ${vv(v)} y u = pv/(1 − p) = ${vv(u)}.`);
          R.ans(`Bonus-malus que sólo distingue N ≤ ${k}.`, `Las probabilidades a posteriori son α·pₙ si n ≤ ${k} y β·pₙ si n > ${k}, con α = p*/p = ${vv(aG)} y β = (1 − p*)/(1 − p) = ${vv(bG)}. Así, 𝔼(N) = ${f(aG)} × Σ<sub>n≤${k}</sub> n·pₙ + ${f(bG)} × (𝔼(N) − Σ<sub>n≤${k}</sub> n·pₙ) = ${f(aG)} × ${f(snk)} + ${f(bG)} × ${f(E0 - snk)} = ${vv(Eg)}, y el porcentaje de ${redTxt(redg)} es ${pct(Math.abs(redg))}.`);
        }
        if (!noPri && V.b('prOn')) {
          // frecuencia a posteriori: tabla con las betas y el resto escalado por α
          const xs = [], pPri = [], pPost = []; let acc = 0;
          for (let n = 0; n < 400; n++) { const pn = N.pmf(n); acc += pn; xs.push(n); pPri.push(pn); const b = B.find(x => x.n === n); pPost.push(b ? b.post : alpha * pn); if (acc > 1 - 1e-13 && n > Math.max(...B.map(x => x.n))) break; }
          const sp2 = pPost.reduce((a, b) => a + b, 0);
          premiumBlock(R, V, N, T.freqTable(xs, pPost.map(x => x / sp2)), 'la distribución dada de N', 'la tabla a posteriori (betas y resto escalado por α)');
        }
        return R;
      }

      if (modo === 'buhl') {
        const E = V.n('bE'), Iin = V.nOpt('bI');
        let Ev, Ve;
        if (Iin !== null) { Ev = 1; Ve = Iin; } else { Ve = V.n('bVm', { pos: 1 }); Ev = V.n('bEv', { pos: 1 }); }
        if (!(h > 0) && tg === null) throw new Error('Escribe las observaciones (o h y la media muestral).');
        if (h > 0) P.buhlmann(R, { E, Ev, Ve, h, xb, sym: 'y', target: tg, quien: 'este asegurado' });
        else {
          const ht = Ev / Ve, X = tg >= 1 ? tg / 100 : tg, hx = ht * X / (1 - X);
          R.tile('h̃', ht).tile(`Años para ${pct(X)}`, String(Math.ceil(hx - 1e-9))); R.key('ht', ht).key('hTarget', hx); R.uses('buhl');
          R.ans(`Años sin siniestros para un descuento del ${pct(X)}.`, `Con h̃ = ${f(ht)}, tras h años sin siniestros 𝔼 a posteriori = h̃/(h + h̃)·𝔼; la reducción h/(h + h̃) ≥ ${f(X)} exige h ≥ h̃·${f(X)}/(1 − ${f(X)}) = ${vv(hx)}: ${Math.ceil(hx - 1e-9)} años.`);
        }
        return R;
      }

      // credibilidad clásica
      const m = V.n('cm'), s = V.n('cs', { pos: 1 }), th = V.n('cth', { pos: 1 }), bt = V.n('cbe', { prob: 1 });
      if (!(h > 0)) throw new Error('Indica el nº de datos h y su media muestral.');
      const k = T.PhiInv((1 + bt) / 2), z0 = (m / s) * th * Math.sqrt(h) / k, z = Math.min(1, z0), va = z * (xb - m) / m;
      R.tile('z', z, { main: true }).tile('Prima pura del subgrupo', z * xb + (1 - z) * m).tile(va >= 0 ? 'Recargo' : 'Reducción', Math.abs(va), { pct: 1, main: true });
      R.key('z', z).key('va', va);
      R.step('Credibilidad clásica (ec. 98–100)', eq(`z = (m/s)·θ√h/Φ<sup>−1</sup>((1 + β)/2) = (${f(m)}/${f(s)}) × ${f(th)} × √${f(h)}/${f(k, 8)} = ${vv(z0)}${z0 > 1 ? ' > 1 ⇒ z = 1 (credibilidad plena)' : ''}`) + eq(`Variación = z(X̄ − m)/m = ${f(z)} × (${f(xb)} − ${f(m)})/${f(m)} = ${vv(va)}`));
      R.uses('clas');
      R.ans('Credibilidad clásica.', `Con margen de error θ = ${f(th)} y nivel β = ${f(bt)}, el peso de la información muestral es z = (m/s)·θ√h/Φ<sup>−1</sup>((1 + β)/2) = ${vv(z0)}${z0 > 1 ? ', que se trunca a 1 (credibilidad plena)' : ''}. La prima pura del subgrupo es z·X̄ + (1 − z)m = ${vv(z * xb + (1 - z) * m)} y la tarifa varía un z(X̄ − m)/m = ${vv(va)} ≈ ${pct(va)}.`);
      return R;
    },
    examples: [
      { id: 'e26-2a', label: 'Enero 2026 · Ej. 2a · λ ∼ Gamma(1; 2), N = 0, 2, 2, 0', values: { modo: 'gp', ga: '1', gb: '2', obs: '0; 2; 2; 0' }, expect: [{ k: 'E1', l: '𝔼 a posteriori', v: 10 / 9 }, { k: 'red', l: 'Reducción', v: 0.444444444 }] },
      { id: 'e26-2b', label: 'Enero 2026 · Ej. 2b · prima 1,05𝔼 + 0,05CVaR95 con log-normal(1000; 500)', values: { modo: 'gp', ga: '1', gb: '2', obs: '0; 2; 2; 0', prOn: true, fq: 'bn', S_fam: 'lognormal', S_lognormal_mode: 'mom', S_lognormal_mom_E: '1000', S_lognormal_mom_sd: '500', m_rho: 'CVaR', m_lvl: '95', A: '1,05', B: '0,05' },
        expect: [{ k: 'rhoPri', l: 'CVaR<sub>95%</sub>(−y) a priori', v: 9770.040799, src: 'Monte Carlo' }, { k: 'rhoPost', l: 'CVaR<sub>95%</sub>(−y) a posteriori', v: 4730.701926, src: 'Monte Carlo' }],
        note: '<b>Errata en la solución oficial:</b> escribe la prima como 1,05 × 2 + 0,05·CVaR (usa 𝔼(N) en lugar de 𝔼(y) = 2.000), y por eso da un 51,55 %. Con 𝔼(y) = 2.000 la reducción sale en torno al 50 %.' },
      { id: 'e25-3a', label: 'Enero 2025 · Ej. 3a-b · λ ∼ Gamma(4; 0,2), dos años sin siniestros; prima con log-normal(100; 50)', values: { modo: 'gp', ga: '4', gb: '0,2', obs: '0; 0', prOn: true, fq: 'pois', S_fam: 'lognormal', S_lognormal_mode: 'mom', S_lognormal_mom_E: '100', S_lognormal_mom_sd: '50', m_rho: 'CVaR', m_lvl: '90', A: '1,1', B: '0,1' },
        expect: [{ k: 'red', l: 'Reducción (PPVE)', v: 0.285714286 }, { k: 'primaPri', l: 'Prima a priori', v: 118.5384821, src: 'Monte Carlo' }, { k: 'primaPost', l: 'Prima a posteriori', v: 87.84963941, src: 'Monte Carlo' }, { k: 'redP', l: 'Reducción con Π', v: 0.258893501, src: 'Monte Carlo' }],
        note: 'La solución compone una Poisson con la media de λ (a priori 0,8 y a posteriori 0,5714). La frecuencia «correcta» de un asegurado anónimo sería la binomial negativa: cámbialo en «Frecuencia para tarificar» si te lo piden así.' },
      { id: 'j24-4', label: 'Junio 2024 · Ej. 4 · λ ∼ Gamma(5; 0,1): dos años sin siniestros y años para un 50 %', values: { modo: 'gp', ga: '5', gb: '0,1', obs: '0; 0', tg: '50%' }, expect: [{ k: 'red', l: 'Reducción tras dos años', v: 1 / 6, src: 'cálculo' }, { k: 'hYears', l: 'Años sin siniestros para un 50 %', v: 10 }] },
      { id: 'j26-3', label: 'Junio 2026 · Ej. 3 · λ ∼ Gamma(1; β), cuatro años de media N̄ (ejemplo β = 0,5, N̄ = 0,25)', values: { modo: 'gp', ga: '1', gb: '0,5', obs: '', hN: '4', mN: '0,25' }, expect: [{ k: 'red', l: 'Reducción = 4(β − N̄)/(1 + 4β)', v: 4 * (0.5 - 0.25) / 3 }], note: 'El examen lo pide con letras: recargo = (1 + 4N̄)/(1 + 4β) − 1 = 4(N̄ − β)/(1 + 4β). La respuesta de la calculadora incluye la fórmula general z(N̄ − αβ)/(αβ); prueba distintos valores para comentar el crecimiento.' },
      { id: 'e23-4b', label: 'Enero 2023 · Ej. 4b · λ ∼ Gamma(20; 0,05), N = 0, 1, 0', values: { modo: 'gp', ga: '20', gb: '0,05', obs: '0; 1; 0' }, expect: [{ k: 'red', l: 'Reducción', v: 0.086956522 }] },
      { id: 'e23-4c', label: 'Enero 2023 · Ej. 4c · IP(N = 0) ∼ Beta(2; 3), N = 0, 1, 0', values: { modo: 'beta', noPri: true, bt: [{ n: '0', u: '2', v: '3' }], obs: '0; 1; 0' }, expect: [{ k: 'post0', l: '𝔼 a posteriori de IP(N = 0)', v: 0.5 }, { k: 'alpha', l: 'k', v: 0.833333333 }, { k: 'red', l: 'Reducción', v: 0.166666667 }] },
      { id: 'e22-4b', label: 'Enero 2022 · Ej. 4b · N Poisson(log 2), IP(N = 0) ∼ Beta(1; 1), tres años sin siniestros', values: { modo: 'beta', noPri: false, N_fam: 'poisson', N_poisson_p_lam: 'ln(2)', bt: [{ n: '0', u: '1', v: '1' }], obs: '0; 0; 0' }, expect: [{ k: 'post0', l: '𝔼 a posteriori de IP(N = 0)', v: 0.8 }, { k: 'red', l: 'Reducción', v: 0.6 }] },
      { id: 'e20-4ab', label: 'Enero 2020 · Ej. 4a-b · N ∈ {0, 1, 2}, IP(N = 0) = p ∼ Beta(1; 1), N = 2, 2, 2, 0', values: { modo: 'beta', noPri: false, N_fam: 'tabla', N_tx: '0; 1; 2', N_tp: '0,5; 0,25; 0,25', bt: [{ n: '0', u: '1', v: '1' }], obs: '2; 2; 2; 0' }, expect: [{ k: 'us0', l: 'u*', v: 2 }, { k: 'vs0', l: 'v*', v: 4 }, { k: 'red', l: 'Recargo (negativo)', v: -1 / 3 }],
        note: 'A priori 𝔼(p) = 0,5 e IP(N = 1) = IP(N = 2) = 0,25, que es la tabla de N que se introduce. El apartado c) (Bühlmann) está en «Mixtura con parámetro aleatorio», ejemplo Enero 2020 Ej. 4c.' },
      { id: 'e18-4', label: 'Enero 2018 · Ej. 4a · λ ∼ Gamma(1; 2), N = 2, 3, 2', values: { modo: 'gp', ga: '1', gb: '2', obs: '2; 3; 2' }, expect: [{ k: 'E1', l: '𝔼 a posteriori', v: 16 / 7 }, { k: 'red', l: 'Recargo (negativo)', v: -1 / 7 }] },
      { id: 'e18-4b', label: 'Enero 2018 · Ej. 4b · IP(N = 0) ∼ Beta(1; 3), N = 1, 1, 2', values: { modo: 'beta', noPri: true, bt: [{ n: '0', u: '1', v: '3' }], obs: '1; 1; 2' }, expect: [{ k: 'us0', l: 'u*', v: 1 }, { k: 'vs0', l: 'v*', v: 6 }, { k: 'post0', l: '𝔼 a posteriori', v: 1 / 7 }] },
      { id: 'e16-4a', label: 'Enero 2016 · Ej. 4a · λ ∼ Gamma(1; 2), N = 0, 0, 2, 1', values: { modo: 'gp', ga: '1', gb: '2', obs: '0; 0; 2; 1' } },
      { id: 'e16-4b', label: 'Enero 2016 · Ej. 4b · IP(N = 0) ∼ Beta(10; 10), N = 0, 2, 2', values: { modo: 'beta', noPri: true, bt: [{ n: '0', u: '10', v: '10' }], obs: '0; 2; 2' } },
      { id: 'e14-4a', label: 'Enero 2014 · Ej. 4a · λ ∼ Gamma(10; 0,2), diez datos', values: { modo: 'gp', ga: '10', gb: '0,2', obs: '3; 3; 4; 3; 4; 3; 0; 3; 3; 4' } },
      { id: 'e24-4', label: 'Enero 2024 · Ej. 4 · 𝔼(y|Λ) ∼ Gamma(5; 8), 𝔼(σ²(y|Λ)) = 256, y = 10, 20, 30', values: { modo: 'buhl', bE: '40', bVm: '320', bEv: '256', obs: '10; 20; 30' }, expect: [{ k: 'ht', l: 'h̃', v: 0.8, src: 'cálculo' }, { k: 'Eb', l: '𝔼 a posteriori', v: (3 * 20 + 0.8 * 40) / 3.8 }],
        note: 'Como 𝔼(y|Λ) = Λ ∼ Gamma(5; 8): 𝔼(Λ) = 40 y σ²(𝔼(y|Λ)) = σ²(Λ) = 5 × 8² = 320.' },
      { id: 'e25-3c', label: 'Enero 2025 · Ej. 3c · Bühlmann con λ ∼ Gamma(4; 0,2), dos años sin siniestros', values: { modo: 'buhl', bE: '0,8', bVm: '0,16', bEv: '0,8', obs: '0; 0' }, expect: [{ k: 'ht', l: 'h̃', v: 5 }, { k: 'Eb', l: '𝔼 a posteriori', v: 0.571428571 }, { k: 'redB', l: 'Reducción', v: 0.285714286 }] },
      { id: 'nov4', label: 'Clase 4 nov. 2026 · λ ∼ Gamma(5; 0,2), N = 0, 1, 0; prima 1,04𝔼 + 0,02CVaR90 con log-normal(1; 3)', values: { modo: 'gp', ga: '5', gb: '0,2', obs: '0; 1; 0', prOn: true, fq: 'bn', S_fam: 'lognormal', S_lognormal_mode: 'mom', S_lognormal_mom_E: '1', S_lognormal_mom_sd: '3', m_rho: 'CVaR', m_lvl: '90', A: '1,04', B: '0,02' },
        expect: [{ k: 'red', l: 'Reducción (PPVE)', v: 0.25 }, { k: 'rhoPri', l: 'CVaR<sub>90%</sub> a priori', v: 6.671699511, src: 'Monte Carlo' }, { k: 'rhoPost', l: 'CVaR<sub>90%</sub> a posteriori', v: 5.359464668, src: 'Monte Carlo' }, { k: 'redP', l: 'Reducción con Π', v: 0.243937622, src: 'Monte Carlo' }] },
      { id: 'nov-beta', label: 'Clase · betas para IP(N = n), n ≤ 3, con N Poisson(1); N = 0, 1, 0, 2; prima con CVaR98', values: { modo: 'beta', noPri: false, N_fam: 'poisson', N_poisson_p_lam: '1', bt: [{ n: '0', u: '2*exp(-1)/(1-exp(-1))', v: '2' }, { n: '1', u: '2*exp(-1)/(1-exp(-1))', v: '2' }, { n: '2', u: '2*exp(-1)/(2-exp(-1))', v: '2' }, { n: '3', u: '2*exp(-1)/(6-exp(-1))', v: '2' }], obs: '0; 1; 0; 2', grp: true, prOn: true, S_fam: 'exponencial', S_exponencial_p_b: '100', m_rho: 'CVaR', m_lvl: '98', A: '1,05', B: '0,05' },
        expect: [{ k: 'post0', l: 'IP*(N = 0)', v: 0.441649077 }, { k: 'post3', l: 'IP*(N = 3)', v: 0.021308753 }, { k: 'alpha', l: 'α', v: 0.530781623 }, { k: 'E1', l: '𝔼(N) a posteriori', v: 0.858414628 }, { k: 'red', l: 'Reducción', v: 0.141585372 }, { k: 'uG', l: 'u de IP(N ≤ 3)', v: 4.438897392 }, { k: 'vG', l: 'v de IP(N ≤ 3)', v: 0.085917903 }, { k: 'Eg', l: '𝔼(N) si sólo distingue N ≤ 3', v: 0.970673851 }, { k: 'primaPri', l: 'Prima a priori', v: 138.017317, src: 'Monte Carlo' }, { k: 'primaPost', l: 'Prima a posteriori', v: 120.9346967, src: 'Monte Carlo' }] }
    ]
  });
})();
