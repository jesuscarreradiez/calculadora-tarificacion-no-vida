/* ════════════════════════════════════════════════════════════════
   INICIO y EJERCICIOS DE EXAMEN
   ════════════════════════════════════════════════════════════════ */
'use strict';
const VIEWS = (function () {
  const INTENTS = [
    { q: 'Frecuencia y severidad: media, desviación, CVaR, prima', a: '«La frecuencia es binomial negativa… la severidad es log-normal…»', tema: 3, tool: 't3-agregado' },
    { q: 'Franquicia o indemnización máxima', a: 'Por siniestro (S − d)⁺, min{S, L} o anual min{y, F}', tema: 3, tool: 't3-agregado' },
    { q: 'Probabilidad de perder dinero o n mínimo de pólizas', a: 'IP(y > Π), k mínimo, cartera de n pólizas independientes', tema: 3, tool: 't3-agregado' },
    { q: 'Recargos máximos y mínimos de la cartera y de cada póliza', a: 'Tabla de pólizas + ρ: prima, k₁, k₂, primas por póliza; con reaseguro o inversión', tema: 8, tool: 't8-recargos' },
    { q: 'Reaseguro cuota-parte, stop-loss o mixto', a: 'y_c = 0,8y − 0,7(y − U)⁺: riesgo cedido, prima de la cartera, comonotonía', tema: 5, tool: 't5-reaseguro' },
    { q: 'VaR, CVaR, Wang, SW, expectil… de una cartera', a: 'ρ(0,1) de la normal estándar o ρ(−y) de la cartera', tema: 4, tool: 't4-medidas' },
    { q: 'Grupos de asegurados con su cuadro de probabilidades', a: 'Asegurado genérico, cuadro por grupo, Bayes tras observar años sin siniestros', tema: 3, tool: 't3-tipos' },
    { q: 'Dos primas dadas: hallar m y s', a: 'Π = 1,05𝔼 + 0,1VaR90 = 11,88 y …', tema: 4, tool: 't4-normal' },
    { q: 'Hallar μ o a para un riesgo o recargo dado', a: '«Determine μ para que el recargo máximo sea del 10 %»', tema: 4, tool: 't4-param' },
    { q: 'Prioridad óptima de un stop-loss', a: 'Barrido de U: la que minimiza la prima de la cartera', tema: 5, tool: 't5-optimo' },
    { q: 'Mixtura e índice de mixtura', a: 'y|λ … y λ ∼ …: 𝔼(y), σ²(y), I', tema: 3, tool: 't3-mixtura' },
    { q: 'Parámetros, percentiles o exceso de una severidad', a: 'Log-normal ↔ media y desviación, Pareto, gamma…', tema: 1, tool: 't1-dist' },
    { q: 'Distribución de la frecuencia', a: 'Poisson, binomial negativa, Poisson–Gamma, tabla de probabilidades', tema: 2, tool: 't2-freq' }
  ];
  // [examen, ejercicio, descripción, tema, herramienta, ejemplo]
  const EXAMS = [
    ['Junio 2026', '1a', 'Recargos de la cartera y de cada póliza con 𝔈₀,₃', 8, 't8-recargos', 'j26-1'],
    ['Junio 2026', '1b', 'μ del expectil para recargo máximo del 10 %', 4, 't4-param', 'j26-1b'],
    ['Junio 2026', '2a-b', 'BN + log-normal, prima con CVaR95, riesgo del asegurador', 3, 't3-agregado', 'j26-2ab'],
    ['Junio 2026', '2c', 'Indemnización máxima anual 3000', 3, 't3-agregado', 'j26-2c'],
    ['Junio 2026', '2d', 'Indemnización máxima por siniestro 1200', 3, 't3-agregado', 'j26-2d'],
    ['Junio 2026', '3', 'Bonus-malus gamma-Poisson', 10, null, null],
    ['Enero 2026', '1a, 1c', 'Recargos de la cartera y de cada póliza (CVaR95), con reaseguro', 8, 't8-recargos', 'e26-1'],
    ['Enero 2026', '1b-c', 'Reaseguro y_r = 0,9y − 0,5(y − 1.700.000)⁺', 5, 't5-reaseguro', 'e26-1'],
    ['Enero 2026', '2a', 'Bonus-malus con distribuciones conjugadas', 10, null, null],
    ['Enero 2026', '2b', 'Prima a priori / a posteriori con CVaR (compuesta)', 3, 't3-agregado', 'e26-2b-pri'],
    ['Enero 2026', '2c', 'Índice de mixtura (BN|λ, λ exponencial)', 3, 't3-mixtura', 'e26-2c'],
    ['Enero 2026', '3', 'Regresión logística y cuantílica', 12, null, null],
    ['Junio 2025', '1', 'Normal: m y s a partir de dos primas; prima con 𝔈₀,₁₅', 4, 't4-normal', 'j25-1'],
    ['Junio 2025', '2a', 'Recargos de la cartera y primas por póliza con SW₁', 8, 't8-recargos', 'j25-2a'],
    ['Junio 2025', '2b', 'Stop-loss (y − 500.000)⁺ con SW₁', 5, 't5-reaseguro', 'j25-2b'],
    ['Junio 2025', '2c', 'k óptimo del stop-loss', 5, 't5-optimo', 'j25-2c'],
    ['Junio 2025', '3a', 'Poisson + exponencial, CVaR99', 3, 't3-agregado', 'j25-3a'],
    ['Junio 2025', '3b', 'Franquicia 95: probabilidad de no perder', 3, 't3-agregado', 'j25-3b'],
    ['Junio 2025', '4a-b', 'Mixtura exponencial–normal, índice de mixtura', 3, 't3-mixtura', 'j25-4'],
    ['Junio 2025', '4c', 'Credibilidad de Bühlmann', 10, null, null],
    ['Enero 2025', '2a-b', 'Recargos con CVaR90 y con reaseguro por tramos', 8, 't8-recargos', 'e25-2'],
    ['Enero 2025', '2b', 'Reaseguro por tramos 0,2 / 0,6', 5, 't5-reaseguro', 'e25-2b'],
    ['Enero 2025', '2c', 'Expectil 𝔈₀,₃ de la N(0,1)', 4, 't4-medidas', 'e25-2c'],
    ['Enero 2025', '3a, 3c', 'Bonus-malus conjugado y Bühlmann', 10, null, null],
    ['Enero 2025', '3b', 'Primas a priori / a posteriori (Poisson + log-normal)', 3, 't3-agregado', 'e25-3b-pri'],
    ['Enero 2025', '4', 'Regresión lineal y cuantílica', 12, null, null],
    ['Junio 2024', '1a, 2b', 'ρ = 2∫μ·CVaR dμ', 4, 't4-medidas', 'j24-1'],
    ['Junio 2024', '2a', 'Recargos con SW₁ (tabla 2.000/5.000/3.000)', 8, 't8-recargos', 'j24-2'],
    ['Junio 2024', '2c', 'Reaseguro 0,9y − 0,6(y − 2.450.000)⁺', 5, 't5-reaseguro', 'j24-2c'],
    ['Junio 2024', '3', 'BN + suma de exponenciales con franquicia; n mínimo', 3, 't3-agregado', 'j24-3'],
    ['Junio 2024', '4', 'Bonus-malus gamma-Poisson', 10, null, null],
    ['Enero 2024', '2a-b', 'Recargos con SDPT₁ y con reaseguro', 8, 't8-recargos', 'e24-2'],
    ['Enero 2024', '2b', 'Reaseguro 0,8y − 0,7(y − 2.450.000)⁺', 5, 't5-reaseguro', 'e24-2b'],
    ['Enero 2024', '2c', 'SDPT₁ de un stop-loss sobre dos carteras', 5, 't5-reaseguro', 'e24-2c'],
    ['Enero 2024', '3', 'BN + suma de exponenciales, franquicia 100, 1.800 pólizas', 3, 't3-agregado', 'e24-3'],
    ['Enero 2024', '4', 'Credibilidad de Bühlmann', 10, null, null],
    ['Enero 2024', '5', 'Regresión lineal y cuantílica', 12, null, null],
    ['Junio 2023', '2a-b', 'BN + log-normal, CVaR94, cartera de 10.000 pólizas', 3, 't3-agregado', 'j23-2'],
    ['Junio 2023', '2c', 'Reaseguro por capas (y − 950.000)⁺ − (y − 1.150.000)⁺', 5, 't5-reaseguro', 'j23-2c'],
    ['Junio 2023', '3', 'Dos tipos de asegurados, Bayes y CVaR86', 3, 't3-tipos', 'j23-3'],
    ['Junio 2023', '4', 'Regresión logística', 11, null, null],
    ['Enero 2023', '2a', 'Recargos con SW₁', 8, 't8-recargos', 'e23-2'],
    ['Enero 2023', '2b-c', 'Compara cuota-parte, stop-loss y mixto', 5, 't5-reaseguro', 'e23-2b'],
    ['Enero 2023', '3', 'BN + exponencial: franquicia, límite, k mínimo', 3, 't3-agregado', 'e23-3i'],
    ['Enero 2023', '4', 'Bonus-malus y beta', 10, null, null],
    ['Enero 2022', '2a-b', 'Recargos con CVaR99 y con stop-loss', 8, 't8-recargos', 'e22-2'],
    ['Enero 2022', '2b', 'Stop-loss (y − 1.550.000)⁺, k₁ = k₂ = 1 %', 5, 't5-reaseguro', 'e22-2b'],
    ['Enero 2022', '2c', 'Algoritmo para el k óptimo del stop-loss', 5, 't5-optimo', 'e22-2c'],
    ['Enero 2022', '3a', 'N ∈ {0,1,2} y severidad normal: distribución del coste', 3, 't3-agregado', 'e22-3a'],
    ['Enero 2022', '3b', 'N ∈ {0,1,2} y severidad exponencial: distribución del coste', 3, 't3-agregado', 'e22-3b'],
    ['Enero 2022', '4a', 'Dos grupos, Bayes tras dos años sin siniestros', 3, 't3-tipos', 'e22-4a'],
    ['Enero 2022', '4b', 'IP(N = 0) beta: distribución a posteriori', 10, null, null],
    ['Enero 2020', '2a', 'Recargos con SW₁ (cartera y pólizas)', 8, 't8-recargos', 'e20-2'],
    ['Enero 2020', '2b-c', 'Reaseguro 0,1y + 0,5(y − 1.700.000)⁺, comonotonía, k₂ = 4 %', 5, 't5-reaseguro', 'e20-2bc'],
    ['Enero 2020', '2c-d', 'Recargos con reaseguro y con inversión en dos activos', 8, 't8-recargos', 'e20-2'],
    ['Enero 2020', '3', 'BN(2; 0,6) + log-normal, CVaR90, IP(beneficio = prima)', 3, 't3-agregado', 'e20-3'],
    ['Enero 2020', '4a-b', 'IP(N = 0) beta: a posteriori y recargo', 10, null, null],
    ['Enero 2020', '4c', 'Media, varianza e «índice de mixtura» de N', 3, 't3-mixtura', 'e20-4c'],
    ['Enero 2019', '2a', 'Recargos con CVaR95 (cartera y pólizas)', 8, 't8-recargos', 'e19-2abc'],
    ['Enero 2019', '2b', 'Reaseguro 0,5(y − 1.600.000)⁺, k₂ = 4 %', 5, 't5-reaseguro', 'e19-2b'],
    ['Enero 2019', '2b-c', 'Recargos con reaseguro y con inversión', 8, 't8-recargos', 'e19-2abc'],
    ['Enero 2019', '3', 'Cuadro por grupo con VaR85 (severidad 1000)', 3, 't3-tipos', 'e19-34'],
    ['Enero 2019', '4', 'Bonus-malus: tres años sin siniestros', 3, 't3-tipos', 'e19-34'],
    ['Enero 2018', '2a', 'Recargos con SW₂ (cartera y pólizas)', 8, 't8-recargos', 'e18-2'],
    ['Enero 2018', '2b', 'Reaseguro 0,7y − 0,4(y − 1,6M)⁺ − 0,3(y − 1,9M)⁺', 5, 't5-reaseguro', 'e18-2b'],
    ['Enero 2018', '2b-c', 'Recargos con reaseguro y con inversión en tres activos', 8, 't8-recargos', 'e18-2'],
    ['Enero 2018', '3a-b', 'BN + severidad normal, VaR99, IP(ganar | N = 1)', 3, 't3-agregado', 'e18-3ab'],
    ['Enero 2018', '3c', 'N ∈ {0, 3} equiprobables', 3, 't3-agregado', 'e18-3c'],
    ['Enero 2018', '4', 'Poisson–Gamma y beta a posteriori', 10, null, null],
    ['Enero 2017', '2a', 'Recargos con SW₁ (cartera y pólizas)', 8, 't8-recargos', 'e17-2'],
    ['Enero 2017', '2b', 'Reaseguro 0,7y − 0,4(y − 9.000.000)⁺, k₂ = 90 %', 5, 't5-reaseguro', 'e17-2b'],
    ['Enero 2017', '2c-d', 'Pérdidas de la reaseguradora; recargos con inversión', 8, 't8-recargos', 'e17-2'],
    ['Enero 2017', '3a-b', 'BN(3; 0,5) + exponencial, 0,5CVaR80 + 0,5CVaR90', 3, 't3-agregado', 'e17-3ab'],
    ['Enero 2017', '3c', 'Franquicia de 800', 3, 't3-agregado', 'e17-3c'],
    ['Enero 2017', '4a', 'Cuatro grupos, Bayes con N = 3 y N = 2', 3, 't3-tipos', 'e17-4a'],
    ['Enero 2017', '4b', 'Credibilidad de Bühlmann', 10, null, null],
    ['Enero 2016', '2a', 'Distribución de la cartera y SW₁ (recargos: tema 8)', 4, 't4-medidas', 'e16-2a'],
    ['Enero 2016', '2b', 'Recargos con SW₁ (cartera y pólizas)', 8, 't8-recargos', 'e16-2'],
    ['Enero 2016', '2c-d', 'Reaseguro 0,7y − 0,2(y − 2.000.000)⁺; pérdidas de la reaseguradora', 5, 't5-reaseguro', 'e16-2cd'],
    ['Enero 2016', '2e', 'Recargos con inversión en un activo', 8, 't8-recargos', 'e16-2'],
    ['Enero 2016', '3', 'BN(3; 0,5) + exponencial, CVaR80, ganar ≥ ½ prima, N ≤ 1', 3, 't3-agregado', 'e16-3'],
    ['Enero 2016', '4', 'Poisson–Gamma y beta para IP(N = 0)', 10, null, null],
    ['Enero 2015', '2', 'BN (media 2, varianza 10) + Erlang; VaR90, CVaR90, IP(pérdida)', 3, 't3-agregado', 'e15-2b'],
    ['Enero 2015', '3a', 'SW₁ de la cartera (recargos: tema 8)', 4, 't4-medidas', 'e15-3a'],
    ['Enero 2015', '3b', 'Cuota-parte con retención del 80 %', 5, 't5-reaseguro', 'e15-3b'],
    ['Enero 2015', '3a, 3c', 'Recargos con SW₁ y con inversión', 8, 't8-recargos', 'e15-3'],
    ['Enero 2015', '4', 'Credibilidad de Bühlmann con tres tipos', 10, null, null],
    ['Enero 2015', '5', 'Reaseguro por tramos, precio y pérdidas de la reaseguradora', 5, 't5-reaseguro', 'e15-5'],
    ['Enero 2014', '2a', 'Distribución de la cartera, CVaR(μ) y sensibilidad', 4, 't4-medidas', 'e14-2a'],
    ['Enero 2014', '2b-d', 'Recargos con CVaR70 y con cuota-parte', 8, 't8-recargos', 'e14-2'],
    ['Enero 2014', '2d', 'Cuota-parte con retención del 80 %', 5, 't5-reaseguro', 'e14-2d'],
    ['Enero 2014', '3', 'Poisson(2) + severidad discreta: Panjer, primas, IP(pérdida)', 3, 't3-agregado', 'e14-3c'],
    ['Enero 2014', '4', 'Poisson–Gamma y Bühlmann', 10, null, null],
    ['Enero 2014', '5', 'Reaseguro por tramos, precio y pérdidas de la reaseguradora', 5, 't5-reaseguro', 'e14-5']
  ];
  const examOrder = e => { const [m, y] = e.split(' '); return +y * 10 + (m === 'Junio' ? 6 : 1); };
  const exams = [...new Set(EXAMS.map(r => r[0]))].sort((a, b) => examOrder(b) - examOrder(a));
  const ready = EXAMS.filter(r => r[4]).length;

  function home(h, go) {
    const box = h('div', { class: 'home' });
    box.append(h('section', { class: 'hero' },
      h('div', { class: 'hero-l' },
        h('h2', null, '¿Qué te piden?'),
        h('p', { html: 'Elige el tipo de ejercicio, mete los datos del enunciado y pulsa <b>Resolver</b>. Obtienes el resultado, la <b>respuesta redactada para el examen</b> y el procedimiento paso a paso con la notación del curso.' }),
        h('div', { class: 'how' }, ['Elige el ejercicio', 'Mete los datos', 'Copia la respuesta'].map((t, i) => h('div', { class: 'how-i' }, h('span', null, i + 1), t)))),
      h('div', { class: 'stats' },
        h('div', { class: 'stat' }, h('b', null, exams.length), h('span', null, 'exámenes analizados')),
        h('div', { class: 'stat' }, h('b', null, ready), h('span', null, 'apartados resolubles ya')),
        h('div', { class: 'stat' }, h('b', null, '1–8'), h('span', null, 'temas cubiertos')),
        h('button', { class: 'stat link', type: 'button', onclick: () => go('ex') }, h('b', null, '→'), h('span', null, 'ver ejercicios de examen')))));
    box.append(h('h3', { class: 'gd-h' }, 'Elige el ejercicio práctico del examen'));
    box.append(h('div', { class: 'pr-cards' }, PRAC.map(P => h('button', { type: 'button', class: 'pr-card' + (P.tools.length ? '' : ' off'), style: { '--tc': P.color }, onclick: () => go(P.id) },
      h('div', { class: 'pr-k' }, `Parte ${P.parte} · Práctico ${P.n}`), h('div', { class: 'pr-t' }, P.short),
      h('div', { class: 'pr-tm' }, P.temas.map(n => h('span', { class: 'pill', style: { '--tc': `var(--t${n})` } }, 'T' + n))),
      h('div', { class: 'pr-w', html: P.whenShort + (P.tools.length ? (P.soon ? ' · <i>tema 10 pendiente</i>' : '') : ' · <i>próximamente</i>') })))));
    box.append(h('h3', { class: 'gd-h' }, 'O busca directamente lo que te piden'));
    box.append(h('div', { class: 'intents' }, INTENTS.map(it => h('button', { class: 'intent', type: 'button', style: { '--tc': `var(--t${it.tema})` }, onclick: () => UI.goTool(it.tool) },
      h('span', { class: 'intent-n' }, 'T' + it.tema), h('div', { class: 'q' }, it.q), h('div', { class: 'a' }, it.a)))));
    box.append(h('div', { class: 'foot', html: '<b>Sobre los números.</b> Las soluciones oficiales suelen estimar CVaR, medidas espectrales y capas de reaseguro con Monte Carlo en Excel. La calculadora obtiene esos valores de forma exacta (fórmulas cerradas, integración numérica o distribución exacta del coste agregado), así que pueden diferir en torno a un 1 % de los del examen; al cargar un ejercicio verás ambas cifras.<br><b>Formato de los datos.</b> Acepta 0,95 o 0.95; 1.700.000 o 1700000; fracciones como 1/4 y porcentajes como 95 %. Pulsa <b>/</b> para buscar.' }));
    return box;
  }

  let filter = 'todos';
  function examsView(h, go) {
    const box = h('div', { class: 'exams-v' });
    box.append(h('div', { class: 'page-h' }, h('div', { class: 'page-k' }, 'Índice'), h('h2', null, 'Ejercicios de examen'),
      h('p', null, 'Cada convocatoria con sus ejercicios prácticos. Los de la parte 1 (temas 1–8) se abren ya cargados y resueltos; los de los temas 10–13 se añadirán más adelante.')));
    const list = h('div', { class: 'ex-grid' });
    const draw = () => {
      list.innerHTML = '';
      for (const ex of exams) {
        const rows = EXAMS.filter(r => r[0] === ex && (filter === 'todos' || (filter === 'ya' ? r[4] : !r[4])));
        if (!rows.length) continue;
        const n = EXAMS.filter(r => r[0] === ex && r[4]).length, tot = EXAMS.filter(r => r[0] === ex).length;
        list.append(h('div', { class: 'ex-card' },
          h('div', { class: 'ex-h' }, h('b', null, ex), h('span', { class: 'ex-prog' }, h('i', { style: { width: (100 * n / tot) + '%' } })), h('small', null, `${n}/${tot}`)),
          rows.map(([, ej, d, tm, tool, exid]) => h(tool ? 'button' : 'div', { class: 'ex-row' + (tool ? '' : ' off'), type: tool ? 'button' : null, onclick: tool ? () => UI.goTool(tool, exid) : null },
            h('span', { class: 'ex-ej' }, ej), h('span', { class: 'ex-d', html: d }),
            h('span', { class: 'pill' + (tool ? ' t' + tm : ''), style: tool ? { '--tc': `var(--t${tm})` } : null }, 'T' + tm),
            h('span', { class: 'ex-go' }, tool ? 'Abrir →' : 'pronto')))));
      }
    };
    const chips = h('div', { class: 'chips' }, [['todos', 'Todos'], ['ya', 'Resolubles ya'], ['no', 'Pendientes']].map(([k, l]) => h('button', {
      type: 'button', class: 'chip' + (filter === k ? ' on' : ''), onclick: e => { filter = k; chips.querySelectorAll('.chip').forEach(c => c.classList.remove('on')); e.target.classList.add('on'); draw(); }
    }, l)));
    box.append(chips, list);
    draw();
    return box;
  }

  /* ───────── Ejercicios prácticos del examen ─────────
     Revisadas las 16 convocatorias (2014–2026): los prácticos siempre agrupan los mismos temas. */
  const P1T = ['t8-recargos', 't5-reaseguro', 't4-medidas', 't5-optimo', 't4-normal', 't4-param'];
  const P3T = ['t3-tipos', 't3-mixtura'];
  const pracOfRow = r => P1T.includes(r[4]) ? 'p1' : (P3T.includes(r[4]) || r[3] === 10) ? 'p3' : (r[3] === 11 || r[3] === 12) ? 'p4' : 'p2';
  const PRAC = [
    {
      id: 'p1', whenShort: 'Ej. 1 en 2026 · Ej. 2 en los anteriores', n: 1, parte: 1, color: 'var(--t8)', nav: 'Práctico 1 · Cartera: recargos y reaseguro', short: 'Cartera: recargos y reaseguro',
      title: 'Cartera de pólizas: recargos, reaseguro e inversión', temas: [4, 5, 6, 8],
      when: 'Ej. 1 en Enero y Junio 2026 · Ej. 1 y 2 en Junio 2025 · Ej. 2 de Enero 2014 a Enero 2025 y en Junio 2024 (Ej. 3 en Enero 2015; Enero 2014 y 2015 añaden un Ej. 5 de reaseguro por tramos). Sólo falta en Junio 2023.',
      intro: 'Empieza con una <b>tabla de pólizas</b> (nº, coste esperado, desviación y riesgo). Casi todo se hace en <b>Recargos</b>: metes la tabla una vez y vas abriendo «Reaseguro» e «Inversión» según los apartados.',
      tools: P1T,
      steps: [
        ['Distribución de la cartera, ρ(−y), prima; recargos máximos y mínimos de seguridad y riesgo de la cartera y de cada póliza; primas por póliza; «con k₁ = …, k₂ = ?»', 't8-recargos', 'Tabla de pólizas (con «Riesgo»), medida, R₀ y k₁ si lo dan. Si el examen da ρ(0,1) simulado, en «ρ(0,1) a usar».'],
        ['«Vuelva a calcular los recargos si se compra el reaseguro …»', 't8-recargos', 'Misma pantalla: «Reaseguro» → tratado tal cual y k₁ʳ, k₂ʳ.'],
        ['«Lo recaudado se diversifica entre un activo sin riesgo y…»', 't8-recargos', 'Misma pantalla: «Inversión» → r₀, activos y correlaciones.'],
        ['Comonotonía, riesgo cedido y retenido, precio como suma de capas, comparar tratados, IP(pérdida de la reaseguradora)', 't5-reaseguro', 'Tabla de pólizas o normal, medida y uno o varios tratados.'],
        ['ρ(0,1) de la N(0,1), CVaR(μ) y sensibilidad, PELVE, riesgos de un stop-loss', 't4-medidas', 'Siniestralidad, medidas (una por fila) y, si procede, el deducible U.'],
        ['«Establezca un procedimiento para estimar el k óptimo» del stop-loss', 't5-optimo', 'Tabla de pólizas, medida, recargos de la reaseguradora.'],
        ['«Bajo Π = … la prima es …: determine m y s»', 't4-normal', 'Los dos principios de prima y sus valores.'],
        ['«Determine μ para que el recargo máximo sea del 10 %»', 't4-param', 'm, s, la medida y el objetivo.']
      ]
    },
    {
      id: 'p2', whenShort: 'Ej. 2 en 2026 · Ej. 3 en los anteriores', n: 2, parte: 1, color: 'var(--t3)', nav: 'Práctico 2 · Frecuencia × severidad', short: 'Frecuencia × severidad',
      title: 'Frecuencia × severidad: coste agregado de una póliza', temas: [1, 2, 3, 4, 7],
      when: 'Ej. 2 en Enero y Junio 2026, Junio 2023 y Enero 2015 · Ej. 3 en todas las demás. Sale en las 16 convocatorias.',
      intro: '«La frecuencia es … y la severidad es …». Casi todo sale de <b>Coste agregado</b>, rellenando sólo los campos opcionales que correspondan a lo que preguntan.',
      tools: ['t3-agregado', 't1-dist', 't2-freq', 't1-suma', 't2-suma'],
      steps: [
        ['Media y desviación, VaR/CVaR, prima Π = a𝔼 + bρ, riesgo del asegurador, IP(pérdida), IP(y = 0)', 't3-agregado', 'Frecuencia, severidad, medida y a, b.'],
        ['Franquicia, indemnización máxima por siniestro o anual', 't3-agregado', 'Grupo «Franquicia e indemnizaciones máximas».'],
        ['Segunda prima, k mínimo, IP(ganar ≥ ½Π), condicionado a N, tabla de Panjer', 't3-agregado', 'Campos opcionales del grupo «Medida de riesgo y principio de prima».'],
        ['Cartera de n pólizas, n mínimo', 't3-agregado', 'Grupo «Cartera de n pólizas».'],
        ['Prima a priori / a posteriori y % de reducción', 't3-agregado', 'Dos veces; en la segunda, la prima a priori en «Prima de referencia».'],
        ['Parámetros de la severidad, percentiles, 𝔼((S − d)⁺)', 't1-dist', 'La distribución de la severidad.'],
        ['Distribución de N, Poisson–Gamma → BN, IP(N = x)', 't2-freq', 'La frecuencia.'],
        ['Suma de exponenciales o de normales; suma de frecuencias', 't1-suma', 'Los sumandos.']
      ]
    },
    {
      id: 'p3', whenShort: 'Ej. 4 casi siempre (Ej. 2–3 en 2025–2026)', n: 3, parte: 2, color: 'var(--t2)', nav: 'Práctico 3 · Bonus-malus y credibilidad', short: 'Bonus-malus y credibilidad', soon: true,
      title: 'Bonus-malus, credibilidad y mixturas', temas: [3, 10],
      when: 'Ej. 4 en casi todas las convocatorias (Ej. 3 en Junio 2026, Enero 2025 y Junio 2023; Ej. 2 en Enero 2026; Ej. 3-4 en Enero 2019).',
      intro: 'Mezcla el tema 3 (mixturas, índice de mixtura, grupos de asegurados con Bayes) con el tema 10 (Poisson–Gamma, beta para IP(N = 0), Bühlmann). Lo del tema 3 ya está; <b>lo del tema 10 llegará próximamente</b>.',
      tools: P3T,
      steps: [
        ['Grupos o tipos con su cuadro de probabilidades: asegurado genérico, cuadro por grupo, Bayes tras observar siniestros, % de reducción', 't3-tipos', 'Valores de N, una fila por tipo (peso y probabilidades), severidad constante y observaciones.'],
        ['«y|λ es … y λ sigue …»: 𝔼(y), σ²(y), índice de mixtura, simulación', 't3-mixtura', 'La condicionada y la distribución de Λ.']
      ]
    },
    {
      id: 'p4', whenShort: 'Ej. 3–5 en algunas convocatorias', n: 4, parte: 2, color: 'var(--faint)', nav: 'Práctico 4 · Regresiones', short: 'Regresiones',
      title: 'Regresión lineal, logística y cuantílica', temas: [11, 12, 13],
      when: 'Enero 2026 Ej. 3, Enero 2025 Ej. 4, Enero 2024 Ej. 5, Junio 2023 Ej. 4.',
      intro: 'Temas 11–13. Próximamente.', tools: [], steps: []
    }
  ];
  const guideOpen = {};
  for (const P of PRAC) {
    P.top = (h, goTool, curId, pick) => {
      const box = h('div', { class: 'pr-top' });
      box.append(h('div', { class: 'pr-when' }, h('span', { class: 'pr-tm' }, P.temas.map(n => h('span', { class: 'pill', style: { '--tc': `var(--t${n})` } }, 'T' + n))), h('span', { html: '<b>En el examen:</b> ' + P.when })));
      if (P.steps.length) {
        const det = h('details', { class: 'pr-guide' }, h('summary', null, '¿Qué herramienta uso para cada apartado?'),
          h('p', { class: 'pr-intro', html: P.intro }),
          h('div', { class: 'gd-steps' }, P.steps.map(([q, id, how], i) => {
            const t = UI.toolById(id);
            return h('div', { class: 'gd-step' + (id === curId ? ' cur' : ''), style: { '--tc': `var(--t${t.tema})` } },
              h('div', { class: 'gd-n' }, i + 1),
              h('div', { class: 'gd-b' }, h('div', { class: 'gd-q', html: 'Si te piden: ' + q }), h('div', { class: 'gd-how', html: '<b>Qué meter:</b> ' + how })),
              h('button', { type: 'button', class: 'gd-go', onclick: () => pick(id) }, h('span', { class: 'pill', style: { '--tc': `var(--t${t.tema})` } }, 'T' + t.tema), ' ' + t.title + (id === curId ? ' (abierta)' : ' →')));
          })));
        det.open = guideOpen[P.id] !== undefined ? guideOpen[P.id] : !curId;
        det.addEventListener('toggle', () => { guideOpen[P.id] = det.open; });
        box.append(det);
      } else box.append(h('p', { class: 'pr-intro', html: P.intro }));
      return box;
    };
    P.bottom = (h, goTool) => {
      const det = h('details', { class: 'pr-exams' }, h('summary', null, 'Exámenes con este práctico (se abren ya cargados)'));
      const list = h('div', { class: 'ex-grid' });
      for (const ex of exams) {
        const rows = EXAMS.filter(r => r[0] === ex && pracOfRow(r) === P.id);
        if (!rows.length) continue;
        list.append(h('div', { class: 'ex-card' }, h('div', { class: 'ex-h' }, h('b', null, ex)),
          rows.map(([, ej, d, tm, tool, exid]) => h(tool ? 'button' : 'div', { class: 'ex-row' + (tool ? '' : ' off'), type: tool ? 'button' : null, onclick: tool ? () => goTool(tool, exid) : null },
            h('span', { class: 'ex-ej' }, ej), h('span', { class: 'ex-d', html: d }), h('span', { class: 'pill t' + tm, style: { '--tc': `var(--t${tm})` } }, 'T' + tm), h('span', { class: 'ex-go' }, tool ? 'Abrir →' : 'pronto')))));
      }
      det.append(list);
      det.open = !P.tools.length;
      return det;
    };
    UI.practico(P);
  }
  return { home, exams: examsView, PRAC };
})();
UI.start(VIEWS);
