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
    { q: 'Bonus-malus: Gamma–Poisson, beta para IP(N = 0), Bühlmann', a: '% de reducción/recargo tras observar al asegurado; años sin siniestros; prima a priori y a posteriori', tema: 10, tool: 't10-cred' },
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
    ['Junio 2026', '3', 'Bonus-malus gamma-Poisson (con letras)', 10, 't10-cred', 'j26-3'],
    ['Enero 2026', '1a, 1c', 'Recargos de la cartera y de cada póliza (CVaR95), con reaseguro', 8, 't8-recargos', 'e26-1'],
    ['Enero 2026', '1b-c', 'Reaseguro y_r = 0,9y − 0,5(y − 1.700.000)⁺', 5, 't5-reaseguro', 'e26-1'],
    ['Enero 2026', '2a-b', 'Bonus-malus Gamma–Poisson y prima con CVaR95', 10, 't10-cred', 'e26-2a'],
    ['Enero 2026', '2b', 'Prima a priori / a posteriori con CVaR (compuesta)', 3, 't3-agregado', 'e26-2b-pri'],
    ['Enero 2026', '2c', 'Bühlmann con N|λ binomial negativa (índice de mixtura)', 3, 't3-mixtura', 'e26-2c'],
    ['Enero 2026', '3', 'P(A) de aceptar una campaña: logit por MCO y MV, cuantílica, F de −P(A), caso peor', 11, 't11-reg', 'e26-3'],
    ['Junio 2025', '1', 'Normal: m y s a partir de dos primas; prima con 𝔈₀,₁₅', 4, 't4-normal', 'j25-1'],
    ['Junio 2025', '2a', 'Recargos de la cartera y primas por póliza con SW₁', 8, 't8-recargos', 'j25-2a'],
    ['Junio 2025', '2b', 'Stop-loss (y − 500.000)⁺ con SW₁', 5, 't5-reaseguro', 'j25-2b'],
    ['Junio 2025', '2c', 'k óptimo del stop-loss', 5, 't5-optimo', 'j25-2c'],
    ['Junio 2025', '3a', 'Poisson + exponencial, CVaR99', 3, 't3-agregado', 'j25-3a'],
    ['Junio 2025', '3b', 'Franquicia 95: probabilidad de no perder', 3, 't3-agregado', 'j25-3b'],
    ['Junio 2025', '4a-b', 'Mixtura exponencial–normal, índice de mixtura', 3, 't3-mixtura', 'j25-4'],
    ['Junio 2025', '4c', 'Credibilidad de Bühlmann (mixtura exponencial–normal)', 3, 't3-mixtura', 'j25-4'],
    ['Enero 2025', '2a-b', 'Recargos con CVaR90 y con reaseguro por tramos', 8, 't8-recargos', 'e25-2'],
    ['Enero 2025', '2b', 'Reaseguro por tramos 0,2 / 0,6', 5, 't5-reaseguro', 'e25-2b'],
    ['Enero 2025', '1', 'λ-cuantil: cuándo coincide con el VaR (suelto)', 4, 't4-lambda', 'e25-1'],
    ['Enero 2025', '2c', 'Expectil 𝔈₀,₃ de la N(0,1)', 4, 't4-medidas', 'e25-2c'],
    ['Enero 2025', '3a-b', 'Bonus-malus Gamma–Poisson y prima con CVaR90', 10, 't10-cred', 'e25-3a'], ['Enero 2025', '3c', 'Bühlmann con λ gamma', 10, 't10-cred', 'e25-3c'],
    ['Enero 2025', '3b', 'Primas a priori / a posteriori (Poisson + log-normal)', 3, 't3-agregado', 'e25-3b-pri'],
    ['Enero 2025', '4', 'Horas de conducción: lineal, cuantílica 95 %, CVaR por tramos y prima', 11, 't11-reg', 'e25-4'],
    ['Junio 2024', '1a, 2b', 'ρ = 2∫μ·CVaR dμ', 4, 't4-medidas', 'j24-1'],
    ['Junio 2024', '2a', 'Recargos con SW₁ (tabla 2.000/5.000/3.000)', 8, 't8-recargos', 'j24-2'],
    ['Junio 2024', '2c', 'Reaseguro 0,9y − 0,6(y − 2.450.000)⁺', 5, 't5-reaseguro', 'j24-2c'],
    ['Junio 2024', '3', 'BN + suma de exponenciales con franquicia; n mínimo', 3, 't3-agregado', 'j24-3'],
    ['Junio 2024', '4', 'Bonus-malus gamma-Poisson; años para un 50 %', 10, 't10-cred', 'j24-4'],
    ['Enero 2024', '2a-b', 'Recargos con SDPT₁ y con reaseguro', 8, 't8-recargos', 'e24-2'],
    ['Enero 2024', '2b', 'Reaseguro 0,8y − 0,7(y − 2.450.000)⁺', 5, 't5-reaseguro', 'e24-2b'],
    ['Enero 2024', '2c', 'SDPT₁ de un stop-loss sobre dos carteras', 5, 't5-reaseguro', 'e24-2c'],
    ['Enero 2024', '3', 'BN + suma de exponenciales, franquicia 100, 1.800 pólizas', 3, 't3-agregado', 'e24-3'],
    ['Enero 2024', '4', 'Credibilidad de Bühlmann por momentos', 10, 't10-cred', 'e24-4'],
    ['Enero 2024', '5', 'log(y) con dos factores: lineal, cuantílica 90 % y prima', 11, 't11-reg', 'e24-5'],
    ['Junio 2023', '2a-b', 'BN + log-normal, CVaR94, cartera de 10.000 pólizas', 3, 't3-agregado', 'j23-2'],
    ['Junio 2023', '2c', 'Reaseguro por capas (y − 950.000)⁺ − (y − 1.150.000)⁺', 5, 't5-reaseguro', 'j23-2c'],
    ['Junio 2023', '3', 'Dos tipos de asegurados, Bayes y CVaR86', 3, 't3-tipos', 'j23-3'],
    ['Junio 2023', '4', 'Regresión logística por MV a partir de casos favorables (falta el PDF; se resuelve con «Casos favorables» + MV)', 11, 't11-reg', null],
    ['Enero 2023', '2a', 'Recargos con SW₁', 8, 't8-recargos', 'e23-2'],
    ['Enero 2023', '2b-c', 'Compara cuota-parte, stop-loss y mixto', 5, 't5-reaseguro', 'e23-2b'],
    ['Enero 2023', '3', 'BN + exponencial: franquicia, límite, k mínimo', 3, 't3-agregado', 'e23-3i'],
    ['Enero 2023', '4b', 'Bonus-malus Gamma–Poisson', 10, 't10-cred', 'e23-4b'], ['Enero 2023', '4c', 'IP(N = 0) beta y resto proporcional', 10, 't10-cred', 'e23-4c'],
    ['Enero 2022', '2a-b', 'Recargos con CVaR99 y con stop-loss', 8, 't8-recargos', 'e22-2'],
    ['Enero 2022', '2b', 'Stop-loss (y − 1.550.000)⁺, k₁ = k₂ = 1 %', 5, 't5-reaseguro', 'e22-2b'],
    ['Enero 2022', '2c', 'Algoritmo para el k óptimo del stop-loss', 5, 't5-optimo', 'e22-2c'],
    ['Enero 2022', '3a', 'N ∈ {0,1,2} y severidad normal: distribución del coste', 3, 't3-agregado', 'e22-3a'],
    ['Enero 2022', '3b', 'N ∈ {0,1,2} y severidad exponencial: distribución del coste', 3, 't3-agregado', 'e22-3b'],
    ['Enero 2022', '4a', 'Dos grupos, Bayes tras dos años sin siniestros', 3, 't3-tipos', 'e22-4a'],
    ['Enero 2022', '4b', 'IP(N = 0) beta: distribución a posteriori', 10, 't10-cred', 'e22-4b'],
    ['Enero 2020', '2a', 'Recargos con SW₁ (cartera y pólizas)', 8, 't8-recargos', 'e20-2'],
    ['Enero 2020', '2b-c', 'Reaseguro 0,1y + 0,5(y − 1.700.000)⁺, comonotonía, k₂ = 4 %', 5, 't5-reaseguro', 'e20-2bc'],
    ['Enero 2020', '2c-d', 'Recargos con reaseguro y con inversión en dos activos', 8, 't8-recargos', 'e20-2'],
    ['Enero 2020', '3', 'BN(2; 0,6) + log-normal, CVaR90, IP(beneficio = prima)', 3, 't3-agregado', 'e20-3'],
    ['Enero 2020', '4a-b', 'IP(N = 0) beta: a posteriori y recargo', 10, 't10-cred', 'e20-4ab'],
    ['Enero 2020', '4c', '«Índice de mixtura» de N y Bühlmann', 3, 't3-mixtura', 'e20-4c'],
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
    ['Enero 2018', '4a', 'Poisson–Gamma', 10, 't10-cred', 'e18-4'], ['Enero 2018', '4b', 'IP(N = 0) beta a posteriori', 10, 't10-cred', 'e18-4b'],
    ['Enero 2017', '2a', 'Recargos con SW₁ (cartera y pólizas)', 8, 't8-recargos', 'e17-2'],
    ['Enero 2017', '2b', 'Reaseguro 0,7y − 0,4(y − 9.000.000)⁺, k₂ = 90 %', 5, 't5-reaseguro', 'e17-2b'],
    ['Enero 2017', '2c-d', 'Pérdidas de la reaseguradora; recargos con inversión', 8, 't8-recargos', 'e17-2'],
    ['Enero 2017', '3a-b', 'BN(3; 0,5) + exponencial, 0,5CVaR80 + 0,5CVaR90', 3, 't3-agregado', 'e17-3ab'],
    ['Enero 2017', '3c', 'Franquicia de 800', 3, 't3-agregado', 'e17-3c'],
    ['Enero 2017', '4a', 'Cuatro grupos, Bayes con N = 3 y N = 2', 3, 't3-tipos', 'e17-4a'],
    ['Enero 2017', '4b', 'Credibilidad de Bühlmann con cuatro grupos', 3, 't3-tipos', 'e17-4a'],
    ['Enero 2016', '2a', 'Distribución de la cartera y SW₁ (recargos: tema 8)', 4, 't4-medidas', 'e16-2a'],
    ['Enero 2016', '2b', 'Recargos con SW₁ (cartera y pólizas)', 8, 't8-recargos', 'e16-2'],
    ['Enero 2016', '2c-d', 'Reaseguro 0,7y − 0,2(y − 2.000.000)⁺; pérdidas de la reaseguradora', 5, 't5-reaseguro', 'e16-2cd'],
    ['Enero 2016', '2e', 'Recargos con inversión en un activo', 8, 't8-recargos', 'e16-2'],
    ['Enero 2016', '3', 'BN(3; 0,5) + exponencial, CVaR80, ganar ≥ ½ prima, N ≤ 1', 3, 't3-agregado', 'e16-3'],
    ['Enero 2016', '4a', 'Poisson–Gamma', 10, 't10-cred', 'e16-4a'], ['Enero 2016', '4b', 'Beta para IP(N = 0)', 10, 't10-cred', 'e16-4b'],
    ['Enero 2015', '2', 'BN (media 2, varianza 10) + Erlang; VaR90, CVaR90, IP(pérdida)', 3, 't3-agregado', 'e15-2b'],
    ['Enero 2015', '3a', 'SW₁ de la cartera (recargos: tema 8)', 4, 't4-medidas', 'e15-3a'],
    ['Enero 2015', '3b', 'Cuota-parte con retención del 80 %', 5, 't5-reaseguro', 'e15-3b'],
    ['Enero 2015', '3a, 3c', 'Recargos con SW₁ y con inversión', 8, 't8-recargos', 'e15-3'],
    ['Enero 2015', '4', 'Credibilidad de Bühlmann con tres tipos', 3, 't3-tipos', 'e15-4'],
    ['Enero 2015', '5', 'Reaseguro por tramos, precio y pérdidas de la reaseguradora', 5, 't5-reaseguro', 'e15-5'],
    ['Enero 2014', '2a', 'Distribución de la cartera, CVaR(μ) y sensibilidad', 4, 't4-medidas', 'e14-2a'],
    ['Enero 2014', '2b-d', 'Recargos con CVaR70 y con cuota-parte', 8, 't8-recargos', 'e14-2'],
    ['Enero 2014', '2d', 'Cuota-parte con retención del 80 %', 5, 't5-reaseguro', 'e14-2d'],
    ['Enero 2014', '3', 'Poisson(2) + severidad discreta: Panjer, primas, IP(pérdida)', 3, 't3-agregado', 'e14-3c'],
    ['Enero 2014', '4a', 'Poisson–Gamma', 10, 't10-cred', 'e14-4a'], ['Enero 2014', '4b', 'Bühlmann con dos distribuciones del coste', 3, 't3-tipos', 'e14-4b'],
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
        h('div', { class: 'stat' }, h('b', null, '1–8 y 10'), h('span', null, 'temas cubiertos')),
        h('button', { class: 'stat link', type: 'button', onclick: () => go('ex') }, h('b', null, '→'), h('span', null, 'ver ejercicios de examen')))));
    box.append(h('h3', { class: 'gd-h' }, 'Elige el caso práctico del examen'));
    box.append(h('div', { class: 'pr-cards' }, PRAC.map(P => h('button', { type: 'button', class: 'pr-card' + (P.tools.length ? '' : ' off'), style: { '--tc': P.color }, onclick: () => go(P.id) },
      h('div', { class: 'pr-k' }, `Caso práctico ${P.n}`), h('div', { class: 'pr-t' }, P.short),
      h('div', { class: 'pr-tm' }, P.temas.map(n => h('span', { class: 'pill', style: { '--tc': `var(--t${n})` } }, 'T' + n))),
      h('div', { class: 'pr-w', html: P.whenShort + (P.tools.length ? '' : ' · <i>próximamente</i>') })))));
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
      h('p', null, 'Cada convocatoria con sus ejercicios prácticos. Los de los casos prácticos 1, 2 y 3 se abren ya cargados y resueltos; los de regresión (caso 4) se añadirán más adelante.')));
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
  const P1T = ['t8-recargos', 't5-reaseguro', 't4-medidas', 't5-optimo', 't4-normal', 't4-param', 't4-lambda'];
  const P3T = ['t10-cred', 't3-tipos', 't3-mixtura'];
  const pracOfRow = r => P1T.includes(r[4]) ? 'p1' : (P3T.includes(r[4]) || r[3] === 10) ? 'p3' : (r[3] === 11 || r[3] === 12) ? 'p4' : 'p2';
  const PRAC = [
    {
      id: 'p1', glos: [['Tabla «nº de pólizas · coste esperado · desviación · riesgo»', 'Recargos › Cartera: una fila por tipo de póliza. «Riesgo» = ρ(−yᵢ) de cada póliza (sirve para repartir k₂).'], ['«ρ = CVaR al 95 %» · «SW₁» · «SDPT₁» · «𝔈₀,₃» · «Wang W₀,₅»', 'Medida: CVaR con nivel 95 · SW con a = 1 · SDPT con a = 1 · Expectil con μ = 0,3 · Wang con a = 0,5.'], ['«ρ(0,1) = 1,6036 (simulado)» o la solución usa un valor simulado', 'Campo «ρ(0,1) a usar». Si no lo dan, déjalo vacío (valor exacto).'], ['«Reservas iniciales de 50.000»', 'R₀ = 50.000 (si no se dicen, 0).'], ['«Recargo de seguridad máximo / mínimo» · «recargo por riesgo máximo / mínimo»', 'Salen siempre: seguridad máx. = k₁ con k₂ = 0; riesgo máx. = k₂ con k₁ = 0; los mínimos son 0.'], ['«Si k₁ = 5 %, ¿cuánto vale k₂?»', 'Campo «k₁ fijado» = 5 %.'], ['«Reparta la prima: 75 % según coste esperado y 25 % según riesgo»', 'Campo «Reparto mixto» = 0,75.'], ['«Cuota-parte con retención del 80 %» · «se cede el 30 %»', 'Reaseguro: <code>0,2y</code> · <code>0,3y</code> (expresión del riesgo cedido).'], ['«Stop-loss con prioridad (deducible) 1.600.000»', '<code>(y − 1.600.000)+</code>'], ['«y<sub>r</sub> = 0,9y − 0,5(y − 1.700.000)⁺» (dan el retenido)', 'Escríbelo tal cual y en «La expresión es» elige «el riesgo retenido».'], ['«Capa entre 950.000 y 1.150.000»', '<code>(y − 950.000)+ − (y − 1.150.000)+</code>'], ['«Cede el 20 % hasta 425.000 y el 60 % por encima»', '<code>tramos: 0:0,2; 425.000:0,6</code>'], ['«La reaseguradora aplica el PPVE con recargo del 10 %»', 'k₁ʳ = 0,1 y k₂ʳ = 0.'], ['«Π<sub>R</sub> = 1,01𝔼(y<sub>c</sub>) + 0,04·SW₁(−y<sub>c</sub>)»', 'k₁ʳ = 0,01 y k₂ʳ = 0,04.'], ['«La reaseguradora aplica 1,01𝔼(Y) + 0,01VaR₉₅(−Y)» (otra medida que la cedente)', 'k₁ʳ = 0,01, k₂ʳ = 0,01 y marca «La reaseguradora usa otra medida» → VaR 95.'], ['«Lo recaudado se invierte en un activo sin riesgo al 0,5 % y dos activos (4 %, 10 %), (5 %, 12 %) con correlación 0,5»', 'Inversión: r₀ = 0,5 %, una fila por activo (rentabilidad, desviación), correlaciones <code>1-2: 0,5</code>.'], ['«Bajo Π = 1,05𝔼 + 0,1VaR₉₀ la prima es 11,88 y bajo …»', 'Herramienta «Normal: hallar m y s».'], ['«Determine μ para que el recargo de seguridad máximo sea del 10 %»', 'Herramienta «Parámetro de la medida» con objetivo «recargo de seguridad máximo» = 0,1.']], whenShort: 'Suele ser la 1ª práctica · 15 de 16 exámenes', n: 1, parte: 1, color: 'var(--t8)', nav: 'Caso 1 · Cartera con reaseguro', short: 'Cartera con reaseguro',
      title: 'Cartera de pólizas: recargos, reaseguro e inversión', temas: [4, 5, 6, 8],
      when: 'Sale en 15 de los 16 exámenes (todos menos Junio 2023). En el enunciado suele ser el Ej. 2 (Ej. 1 en 2026; Ej. 3 en Enero 2015; Enero 2014 y 2015 añaden un Ej. 5 de reaseguro por tramos).',
      intro: 'Empieza con una <b>tabla de pólizas</b> (nº, coste esperado, desviación y riesgo). Casi todo se hace en <b>Recargos</b>: metes la tabla una vez y vas abriendo «Reaseguro» e «Inversión» según los apartados.',
      tools: P1T,
      steps: [
        ['Recargos máximos y mínimos de seguridad y riesgo de la cartera y de cada póliza, prima, «con k₁ = …, k₂ = ?» — todos los años', 't8-recargos', 'Tabla de pólizas (con «Riesgo»), medida, R₀ y k₁ si lo dan. Si el examen da ρ(0,1) simulado, en «ρ(0,1) a usar».'],
        ['«Vuelva a calcular los recargos si se compra el reaseguro …» — todos los años', 't8-recargos', 'Misma pantalla: «Reaseguro» → tratado tal cual y k₁ʳ, k₂ʳ (y «otra medida» si la reaseguradora usa otra).'],
        ['Comonotonía, riesgo cedido y retenido, comparar tratados, precio como suma de capas, IP(pérdida de la reaseguradora) — 2014, 2015, 2016, 2019, 2020, 2022, 2023, 2024', 't5-reaseguro', 'Tabla de pólizas o normal, medida y uno o varios tratados.'],
        ['«Lo recaudado se diversifica entre un activo sin riesgo y …» — 2015 a 2020', 't8-recargos', 'Misma pantalla: «Inversión» → r₀, activos y correlaciones.'],
        ['ρ(0,1) de la N(0,1) (SW, SDPT, expectil, ∫2μ·CVaR dμ), CVaR(μ) y sensibilidad, PELVE — 2014, 2016, Jun 2024, Ene 2025, 2026', 't4-medidas', 'Siniestralidad, medidas (una por fila) y, si procede, el deducible U.'],
        ['«Establezca un procedimiento para estimar el k óptimo» del stop-loss — 2022, Jun 2025', 't5-optimo', 'Tabla de pólizas, medida, recargos de la reaseguradora.'],
        ['«Determine μ para que el recargo máximo sea del 10 %» — Jun 2026', 't4-param', 'm, s, la medida y el objetivo.'],
        ['«Bajo Π = … la prima es …: determine m y s» — Jun 2025', 't4-normal', 'Los dos principios de prima y sus valores.'],
        ['Suelto · λ-cuantil: «determine condiciones de F para que VaR = Q<sub>λ</sub>» — Ene 2025', 't4-lambda', 'Los tramos de λ (desde x y valor) y los niveles del VaR; opcionalmente una F concreta.']
      ]
    },
    {
      id: 'p2', glos: [['«N binomial negativa de parámetros α = 1, θ = 0,4»', 'Frecuencia: Binomial negativa, modo «α y θ».'], ['«N binomial negativa de media 2 y varianza 10»', 'Binomial negativa, modo «media y varianza».'], ['«λ ∼ Gamma(α; β) y N|λ Poisson(λ)»', 'Binomial negativa, modo «Poisson–Gamma» (α y β de la gamma).'], ['«N toma los valores 0, 1, 2 con probabilidades 0,5; 0,3; 0,2»', 'Frecuencia: Tabla.'], ['«Severidad log-normal de media 1.000 y desviación 250»', 'Severidad: Log-normal, modo «media y desviación».'], ['«Severidad exponencial de media 100»', 'Exponencial, β = 100.'], ['«Suma de 3 exponenciales de media 70» · «Erlang»', 'Gamma, modo «suma de k exponenciales» (k = 3, β = 70).'], ['«Gamma de media 100 y varianza 5.000»', 'Gamma, modo «media y desviación» con σ = <code>sqrt(5000)</code>.'], ['«La severidad será siempre 1.000» · «100, 200, 300, 400 equiprobables»', 'Severidad: Constante · Discreta (valores y probabilidades).'], ['«Π(y) = 1,05𝔼(y) + 0,1·CVaR₉₉(−y)»', 'a = 1,05; b = 0,1; medida CVaR, nivel 99.'], ['«PPVE con recargo del 10 %»', 'a = 1,1; b = 0.'], ['«Dos principios de prima Π₁ y Π₂»', 'El segundo en «Segunda prima» (a₂, b₂).'], ['«Franquicia de 100 por siniestro» · «indemnización máxima por siniestro 1.200» · «máximo anual 3.000»', 'd = 100 · L = 1.200 · F = 3.000.'], ['«¿Probabilidad de que la compañía pierda dinero?» · «IP(y = 0)»', 'Salen siempre en el resultado.'], ['«Recargo k mínimo para que IP(pérdida) < 20 %»', 'Campo ε = 20 % (y la prima tipo (1 + k)𝔼 + bρ con tu b).'], ['«Probabilidad de ganar al menos la mitad de la prima» · «si ha habido como mucho un siniestro»', 'Fracción = 0,5 · Condicionar a N = 1 (da N = 1 y N ≤ 1).'], ['«Distribución de y por el método de Panjer hasta que IP(y > U) ≤ 0,3»', 'Severidad discreta + campo «Panjer: hasta U» = 0,3.'], ['«Cartera de 1.800 pólizas» · «número mínimo de pólizas para IP(pérdida) ≤ 5 %»', 'Grupo «Cartera de n pólizas»: n = 1.800 · ε = 5 %.'], ['«Prima a posteriori y % de reducción respecto de la a priori»', 'Resuelve la a priori; luego cambia la frecuencia y pon la prima a priori en «Prima de referencia».'], ['«Siniestros leves (media, desviación, probabilidad) y graves (…)» · «severidades correlacionadas»', 'Herramienta «Momentos e índices de mixtura».'], ['«Cada siniestro es leve, moderado o grave; la severidad es log-normal con estos parámetros» y piden VaR/CVaR', 'Coste agregado → Severidad «Mixtura de tipos» (una fila por tipo: probabilidad, distribución, media, desviación).'], ['«Determine VaR₉₅, CVaR₉₅ y SW₁»', 'Campo «Otras medidas»: <code>VaR 95; CVaR 95; SW 1</code>.'], ['«Repita si hay una franquicia igual a 5» (sobre el coste y) · «𝔼((y − 5)⁺)»', 'Campo «Franquicia sobre el coste anual D» = 5.'], ['«Probabilidad de que las pérdidas superen el 85 % de la prima»', 'Campo «IP(pérdidas > f·Π)» con f = 0,85.'], ['«5.000 asegurados… ¿cuánto cobrar a la cartera y a cada asegurado?» · «la mitad con franquicia» · «riesgo colectivo»', 'Grupo «Cartera de n pólizas»: n, «De ellas, con la franquicia anual», otra medida para la cartera y «Riesgo colectivo».']], whenShort: 'Suele ser la 2ª práctica · 16 de 16 exámenes', n: 2, parte: 1, color: 'var(--t3)', nav: 'Caso 2 · Frecuencia × severidad', short: 'Frecuencia × severidad',
      title: 'Frecuencia × severidad: coste agregado de una póliza', temas: [1, 2, 3, 4, 7],
      when: 'Sale en los 16 exámenes. En el enunciado suele ser el Ej. 3 (Ej. 2 en 2026, Junio 2023 y Enero 2015).',
      intro: '«La frecuencia es … y la severidad es …». Casi todo sale de <b>Coste agregado</b>, rellenando sólo los campos opcionales que correspondan a lo que preguntan.',
      tools: ['t3-agregado', 't3-momentos', 't1-dist', 't2-freq', 't1-suma', 't2-suma'],
      steps: [
        ['𝔼, σ, VaR/CVaR (por simulación o exactos), prima Π = a𝔼 + bρ, riesgo del asegurador, IP(pérdida), IP(y = 0) — todos los años', 't3-agregado', 'Frecuencia, severidad, medida y a, b.'],
        ['Franquicia (S − d)⁺, tope por siniestro o tope anual — 2017, Ene 2023, Ene 2024, Jun 2024, Jun 2025, Jun 2026', 't3-agregado', 'Grupo «Franquicia e indemnizaciones máximas» (también franquicia sobre el coste anual).'],
        ['Cartera de n pólizas por la normal; n mínimo para una probabilidad o un riesgo — Jun 2023, Ene 2023, Ene 2024, Jun 2024', 't3-agregado', 'Grupo «Cartera de n pólizas» (y riesgo colectivo si lo piden).'],
        ['Segunda prima, k mínimo para IP(pérdida) < ε, IP(ganar ≥ ½Π), condicionado a N — 2015, 2016, 2018, 2020, Ene 2023', 't3-agregado', 'Campos opcionales del grupo «Medida de riesgo y principio de prima».'],
        ['Casos cerrados: tabla de Panjer (2014) y distribución exacta con N ∈ {0, 1, 2} (2018, 2022)', 't3-agregado', 'Severidad discreta + «Panjer: hasta U»; frecuencia «Tabla».'],
        ['Parámetros de la severidad, percentiles, 𝔼((S − d)⁺)', 't1-dist', 'La distribución de la severidad.'],
        ['Distribución de N, Poisson–Gamma → BN, IP(N = x)', 't2-freq', 'La frecuencia.'],
        ['Suma de exponenciales o de normales; suma de frecuencias', 't1-suma', 'Los sumandos.'],
        ['Severidad mezcla de tipos (leve/grave), índices de mixtura, severidades correlacionadas (sólo momentos) — ejercicios de clase', 't3-momentos', 'Tipos con probabilidad, media y desviación; la frecuencia; la correlación si la hay.']
      ]
    },
    {
      id: 'p3', glos: [['«λ ∼ Gamma(α; β) y N|λ Poisson; de un asegurado se tienen las realizaciones 0, 2, 2, 0»', 'Credibilidad y bonus-malus → Gamma–Poisson: α, β y observaciones <code>0; 2; 2; 0</code>.'], ['«Tras dos años sin siniestros»', 'Observaciones <code>0; 0</code>.'], ['«¿Cuántos años sin siniestros para un descuento del 50 %?»', 'Campo «Descuento objetivo» = 50 %.'], ['«De un asegurado se tienen cuatro realizaciones de media N̄» (con letras)', 'Pon h = 4 y una media de prueba; la respuesta da la fórmula general z(N̄ − αβ)/(αβ).'], ['«Prima 1,05𝔼(y) + 0,05CVaR₉₅ con severidad log-normal … a priori y a posteriori»', 'Abre «Prima con severidad…»: frecuencia binomial negativa (o Poisson con la media, si así lo resuelve el enunciado), severidad, medida, a y b.'], ['«IP(N = 0) es una beta de parámetros u y v» · «el resto de probabilidades cambia proporcionalmente»', 'Modelo Beta: una fila n = 0, u, v. Si no dan la distribución de N, marca «No se da la distribución de N».'], ['«Para n ≤ 3, IP(N = n) es una beta…»', 'Una fila por n (admite <code>2*exp(-1)/(1-exp(-1))</code>); «Además: una sola beta para IP(N ≤ k)» para apartados tipo «sólo distingue N ≤ 3».'], ['«Media de las varianzas condicionadas 256; la esperanza sigue una gamma(5; 8)»', 'Modelo Bühlmann: 𝔼 = 40, varianza de medias = 5 × 8² = 320, media de varianzas = 256.'], ['«Utilice inferencia bayesiana / credibilidad de Bühlmann» con grupos', 'Mixtura de tipos: observaciones y casilla «Calcular también con Bühlmann».'], ['«Tipo I: IP(N = 0) = 0,5; IP(N = 1) = 0,3…; Tipo II: …»', 'Mixtura de tipos: «Valores de N» = 0; 1; 2… y una fila por tipo con sus probabilidades.'], ['«El 50 % de los asegurados son del tipo I» · «30.000 pólizas del grupo 1»', 'Columna «Peso» (vale la proporción o el nº de pólizas).'], ['«Un asegurado lleva dos años sin siniestros»', 'Observaciones: <code>0; 0</code>.'], ['«La severidad será siempre 1.000»', 'Severidad constante = 1.000.'], ['«y|λ es exponencial de media λ y λ ∼ N(100; 10)»', 'Mixtura con parámetro aleatorio: condicionada exponencial, Λ normal.'], ['«Se ha simulado σ(y) = 100,47»', 'Campo «σ(y) conocida».']], whenShort: 'Suele ser la 3ª práctica · 16 de 16 exámenes', n: 3, parte: 2, color: 'var(--t2)', nav: 'Caso 3 · Bonus-malus y credibilidad', short: 'Bonus-malus y credibilidad',
      title: 'Bonus-malus, credibilidad y mixturas', temas: [3, 10],
      when: 'Sale en los 16 exámenes. En el enunciado suele ser el Ej. 4 (Ej. 3 en Junio 2026, Enero 2025 y Junio 2023; Ej. 2 en Enero 2026).',
      intro: 'Siempre es un <b>bonus-malus</b>: a priori → datos del asegurado → a posteriori → % de reducción/recargo (con el PPVE, el cambio relativo de la esperanza). Hay cuatro plantillas, ordenadas abajo de más a menos frecuente. Elige la herramienta según cómo describa el enunciado la heterogeneidad: λ gamma o «IP(N = 0) es una beta» → <b>Credibilidad y bonus-malus</b>; grupos o tipos con un cuadro → <b>Mixtura de tipos</b>; «y|λ es … y λ sigue …» → <b>Mixtura con parámetro aleatorio</b>.',
      tools: P3T,
      steps: [
        ['Plantilla 1 · Gamma–Poisson conjugada (la más frecuente): «λ ∼ Gamma(α; β), N|λ Poisson»; % de reducción, peso de la muestra, años sin siniestros — 2014, 2016, 2018, Ene 2023, Jun 2024, Ene 2025, Ene 2026, Jun 2026', 't10-cred', 'Modelo Gamma–Poisson: α, β y las observaciones (o h y la media).'],
        ['Plantilla 2 · Beta sobre IP(N = 0), el resto de probabilidades escala proporcionalmente — 2016, 2018, 2020, 2022, Ene 2023', 't10-cred', 'Modelo Beta: la distribución de N (si la dan), una fila n, u, v y las observaciones.'],
        ['Plantilla 3 · Grupos discretos con Bayes (y cuadro por grupo) — 2014, 2015, 2017, 2019, 2022, Jun 2023', 't3-tipos', 'Valores de N (o del coste), una fila por grupo (peso y probabilidades) y las observaciones: Bayes paso a paso.'],
        ['Plantilla 4 · Bühlmann con el índice de mixtura, a menudo comparando con Bayes — por momentos (Ene 2024, Ene 2025), con grupos (2014, 2015, 2017) o con λ continua (2020, Jun 2025, Ene 2026)', 't10-cred', 'Por momentos aquí; con grupos en «Mixtura de tipos» (casilla Bühlmann); con λ continua en «Mixtura con parámetro aleatorio».'],
        ['Bonus-malus con un principio distinto del PPVE (1,1𝔼 + 0,1CVaR…) — Jun 2023, Ene 2025, Ene 2026', 't10-cred', 'Gamma–Poisson o Beta y abre «Prima con severidad…» (con grupos: a y b en «Mixtura de tipos»).'],
        ['«y|λ es … y λ sigue …»: 𝔼(y), σ²(y), índice de mixtura, simulación, Bühlmann tras h años — 2020, Jun 2025, Ene 2026', 't3-mixtura', 'La condicionada y la distribución de Λ; abre «Credibilidad de Bühlmann» para h, la media y el descuento.']
      ]
    },
    {
      id: 'p4', whenShort: 'Última práctica · desde Junio 2023 (4 de 16)', n: 4, parte: 2, color: 'var(--t11)', nav: 'Caso 4 · Regresión', short: 'Regresión',
      title: 'Regresión lineal, logística y cuantílica', temas: [11],
      when: 'Entra en el examen a partir de <b>Junio 2023</b> (de 2014 a Enero 2023 no hay regresión): Junio 2023 Ej. 4, Enero 2024 Ej. 5, Enero 2025 Ej. 4 y Enero 2026 Ej. 3. En las convocatorias de junio de 2024, 2025 y 2026 no sale.',
      intro: 'Siempre es un <b>cuadro de datos agrupados</b> (frecuencia, factores y respuesta) y piden una o varias aproximaciones; después, evaluarlas para un cliente y usarlas en una prima o en una decisión. Todo se hace en una sola herramienta: metes el cuadro una vez y marcas los modelos que piden los apartados.',
      glos: [['«Se dispone de los datos (frecuencia, X₁, X₂, y)»', 'Una fila por línea del cuadro: frecuencia, X₁, X₂ (X₃ si hay) e y. Deja vacías las columnas de factores que no existan.'], ['«Estime 𝔼(y) ≈ β₀ + β₁X₁ + …» · «por mínimos cuadrados» · «Jensen Alfa / Accuracy»', 'Marca «Regresión lineal». β₀ es el «Jensen Alfa» de la macro y R² × 100 su «Accuracy (%)».'], ['«Explique log(y)» · «utilice el logaritmo como vínculo»', '«La última columna es» → log(y). La calculadora vuelve a y con la exponencial.'], ['«Aproxime σ(y)» · «regrese y²»', 'Marca «σ(y) por regresión de y²»: σ = √(𝔼(y²) − 𝔼(y)²).'], ['«De los n clientes, k aceptaron / tuvieron el suceso A»', '«La última columna es» → casos favorables (k); la frecuencia es n. Regresión lineal = MCO sobre logit(k/n).'], ['«Regresión logística / probit por máxima verosimilitud»', 'Marca «Máxima verosimilitud» y la función de enlace. Las macros del profesor (N1, N3) buscan al azar: su resultado es aproximado.'], ['«Número total de siniestros del grupo» · «regresión logarítmica»', '«La última columna es» → recuento: se explica log(media) y la MV es de Poisson (macro N2).'], ['«VaR₉₅(−y) ≈ β̃₀ + β̃₁X₁ + …» · «regresión de cuantiles»', 'Marca «Regresión de cuantiles» y escribe el nivel (varios con «;»).'], ['«CVaR₉₅(−y)» · «repitiendo la regresión de cuantiles para niveles mayores»', 'Marca «CVaR por tramos». Si la solución usa unos cortes concretos (p. ej. 99,5 %), escríbelos en «Niveles de los tramos».'], ['«Expectil 𝔈₀,₂(−y)»', 'Marca «Regresión de expectiles» con μ = 0,2.'], ['«Para un conductor con H = 2.000» · «cliente con X₁ = 55, X₂ = 40»', 'Grupo «Clientes / pólizas a evaluar»: una fila con los valores de los factores.'], ['«Cartera con 1.000 pólizas de (1, −10, 30), 2.000 de …: complete 𝔼, σ, CVaR»', 'Una fila por grupo con su nº de pólizas. Sale el cuadro y un botón que lo lleva a «Recargos» (Caso 1).'], ['«Distribución de −P(A) a partir de las rectas cuantílicas» · «𝔼(P(A))»', 'Marca «Función de distribución en ese punto» (y «de −y» si piden −P(A)).'], ['«Elija la estimación más prudente / worst case»', 'Marca «Criterio del caso peor» y si lo peor es el valor más bajo o el más alto.'], ['«Π(y) = 1,04𝔼(y) + 0,02CVaR₉₅(−y)»', 'Grupo «Prima»: a = 1,04, b = 0,02 y ρ = CVaR (o VaR).']],
      tools: ['t11-reg'],
      steps: [
        ['𝔼(y) ≈ β₀ + βX por mínimos cuadrados (con o sin log(y)), su precisión R² — Ene 2024, Ene 2025, Ene 2026', 't11-reg', 'El cuadro (frecuencia, factores, y) y «Regresión lineal».'],
        ['VaR(−y) por regresión de cuantiles y la prima con ese VaR — Ene 2024, Ene 2025', 't11-reg', 'Marca «Regresión de cuantiles» con el nivel; cliente y prima en los grupos opcionales.'],
        ['CVaR(−y) integrando los tramos de la regresión cuantílica — Ene 2025 y ejercicio de clase', 't11-reg', 'Marca «CVaR por tramos» con el nivel del CVaR.'],
        ['P(A) por regresión logística (MCO sobre logit y máxima verosimilitud), distribución de −P(A) y caso peor — Jun 2023, Ene 2026', 't11-reg', '«Casos favorables» como última columna, MCO y MV; cliente con «Función de distribución» y «Caso peor».'],
        ['σ(y) por regresión de y² y cuadro (𝔼, σ, CVaR) de una cartera para hallar los recargos — ejercicio de clase', 't11-reg', 'Marca «σ(y) por y²» y pon una fila por grupo de pólizas; el botón lleva la cartera a «Recargos».']
      ]
    }
  ];
  const guideOpen = {};
  for (const P of PRAC) {
    P.top = (h, goTool, curId, pick) => {
      const box = h('div', { class: 'pr-top' });
      box.append(h('div', { class: 'pr-when' }, h('span', { class: 'pr-tm' }, P.temas.map(n => h('span', { class: 'pill', style: { '--tc': `var(--t${n})` } }, 'T' + n))), h('span', { html: '<b>En el examen:</b> ' + P.when })));
      if (P.glos && P.glos.length) {
        const g = h('details', { class: 'pr-guide' }, h('summary', null, 'Cómo pasar el enunciado a la calculadora'),
          h('table', { class: 'gl-t' }, h('tr', null, h('td', null, h('b', null, 'En el enunciado pone…')), h('td', null, h('b', null, 'En la calculadora…'))),
            P.glos.map(([q, a]) => h('tr', null, h('td', { html: q }), h('td', { html: a })))));
        g.open = !!guideOpen[P.id + 'g'];
        g.addEventListener('toggle', () => { guideOpen[P.id + 'g'] = g.open; });
        box.append(g);
      }
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
