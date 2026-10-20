/* ════════════════════════════════════════════════════════════════
   INICIO y EJERCICIOS DE EXAMEN
   ════════════════════════════════════════════════════════════════ */
'use strict';
const VIEWS = (function () {
  const INTENTS = [
    { q: 'Frecuencia y severidad: media, desviación, CVaR, prima', a: '«La frecuencia es binomial negativa… la severidad es log-normal…»', tema: 3, tool: 't3-agregado' },
    { q: 'Franquicia o indemnización máxima', a: 'Por siniestro (S − d)⁺, min{S, L} o anual min{y, F}', tema: 3, tool: 't3-agregado' },
    { q: 'Probabilidad de perder dinero o n mínimo de pólizas', a: 'IP(y > Π), k mínimo, cartera de n pólizas independientes', tema: 3, tool: 't3-agregado' },
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
    ['Junio 2026', '1a', 'Recargos de la cartera con 𝔈₀,₃ — ρ(0,1) del expectil', 4, 't4-medidas', 'j26-1a'],
    ['Junio 2026', '1b', 'μ del expectil para recargo máximo del 10 %', 4, 't4-param', 'j26-1b'],
    ['Junio 2026', '2a-b', 'BN + log-normal, prima con CVaR95, riesgo del asegurador', 3, 't3-agregado', 'j26-2ab'],
    ['Junio 2026', '2c', 'Indemnización máxima anual 3000', 3, 't3-agregado', 'j26-2c'],
    ['Junio 2026', '2d', 'Indemnización máxima por siniestro 1200', 3, 't3-agregado', 'j26-2d'],
    ['Junio 2026', '3', 'Bonus-malus gamma-Poisson', 10, null, null],
    ['Enero 2026', '1a', 'Recargos de la cartera — CVaR95 de la N(0,1)', 4, 't4-medidas', 'e26-1a'],
    ['Enero 2026', '1b-c', 'Reaseguro y_r = 0,9y − 0,5(y − 1.700.000)⁺', 5, 't5-reaseguro', 'e26-1'],
    ['Enero 2026', '2a', 'Bonus-malus con distribuciones conjugadas', 10, null, null],
    ['Enero 2026', '2b', 'Prima a priori / a posteriori con CVaR (compuesta)', 3, 't3-agregado', 'e26-2b-pri'],
    ['Enero 2026', '2c', 'Índice de mixtura (BN|λ, λ exponencial)', 3, 't3-mixtura', 'e26-2c'],
    ['Enero 2026', '3', 'Regresión logística y cuantílica', 12, null, null],
    ['Junio 2025', '1', 'Normal: m y s a partir de dos primas; prima con 𝔈₀,₁₅', 4, 't4-normal', 'j25-1'],
    ['Junio 2025', '2a', 'Recargos con SW₁ — ρ(0,1)', 4, 't4-medidas', 'e23-2a'],
    ['Junio 2025', '2b', 'Stop-loss (y − 500.000)⁺ con SW₁', 5, 't5-reaseguro', 'j25-2b'],
    ['Junio 2025', '2c', 'k óptimo del stop-loss', 5, 't5-optimo', 'j25-2c'],
    ['Junio 2025', '3a', 'Poisson + exponencial, CVaR99', 3, 't3-agregado', 'j25-3a'],
    ['Junio 2025', '3b', 'Franquicia 95: probabilidad de no perder', 3, 't3-agregado', 'j25-3b'],
    ['Junio 2025', '4a-b', 'Mixtura exponencial–normal, índice de mixtura', 3, 't3-mixtura', 'j25-4'],
    ['Junio 2025', '4c', 'Credibilidad de Bühlmann', 10, null, null],
    ['Enero 2025', '2a', 'Recargos con CVaR90 — ρ(0,1)', 4, 't4-medidas', 'e25-2a'],
    ['Enero 2025', '2b', 'Reaseguro por tramos 0,2 / 0,6', 5, 't5-reaseguro', 'e25-2b'],
    ['Enero 2025', '2c', 'Expectil 𝔈₀,₃ de la N(0,1)', 4, 't4-medidas', 'e25-2c'],
    ['Enero 2025', '3a, 3c', 'Bonus-malus conjugado y Bühlmann', 10, null, null],
    ['Enero 2025', '3b', 'Primas a priori / a posteriori (Poisson + log-normal)', 3, 't3-agregado', 'e25-3b-pri'],
    ['Enero 2025', '4', 'Regresión lineal y cuantílica', 12, null, null],
    ['Junio 2024', '1a, 2b', 'ρ = 2∫μ·CVaR dμ', 4, 't4-medidas', 'j24-1'],
    ['Junio 2024', '2a', 'Recargos con SW₁ (tabla 2.000/5.000/3.000)', 8, null, null],
    ['Junio 2024', '2c', 'Reaseguro 0,9y − 0,6(y − 2.450.000)⁺', 5, 't5-reaseguro', 'j24-2c'],
    ['Junio 2024', '3', 'BN + suma de exponenciales con franquicia; n mínimo', 3, 't3-agregado', 'j24-3'],
    ['Junio 2024', '4', 'Bonus-malus gamma-Poisson', 10, null, null],
    ['Enero 2024', '2a', 'SDPT₁ de la cartera', 4, 't4-medidas', 'e24-cart'],
    ['Enero 2024', '2b', 'Reaseguro 0,8y − 0,7(y − 2.450.000)⁺', 5, 't5-reaseguro', 'e24-2b'],
    ['Enero 2024', '2c', 'SDPT₁ de un stop-loss sobre dos carteras', 5, 't5-reaseguro', 'e24-2c'],
    ['Enero 2024', '3', 'BN + suma de exponenciales, franquicia 100, 1.800 pólizas', 3, 't3-agregado', 'e24-3'],
    ['Enero 2024', '4', 'Credibilidad de Bühlmann', 10, null, null],
    ['Enero 2024', '5', 'Regresión lineal y cuantílica', 12, null, null],
    ['Junio 2023', '2a-b', 'BN + log-normal, CVaR94, cartera de 10.000 pólizas', 3, 't3-agregado', 'j23-2'],
    ['Junio 2023', '2c', 'Reaseguro por capas (y − 950.000)⁺ − (y − 1.150.000)⁺', 5, 't5-reaseguro', 'j23-2c'],
    ['Junio 2023', '3', 'Dos tipos de asegurados, Bayes y CVaR86', 3, 't3-tipos', 'j23-3'],
    ['Junio 2023', '4', 'Regresión logística', 11, null, null],
    ['Enero 2023', '2a', 'Recargos con SW₁', 8, null, null],
    ['Enero 2023', '2b-c', 'Compara cuota-parte, stop-loss y mixto', 5, 't5-reaseguro', 'e23-2b'],
    ['Enero 2023', '3', 'BN + exponencial: franquicia, límite, k mínimo', 3, 't3-agregado', 'e23-3i'],
    ['Enero 2023', '4', 'Bonus-malus y beta', 10, null, null],
    ['Enero 2022', '2a', 'Recargos de la cartera con CVaR99', 8, null, null],
    ['Enero 2022', '2b', 'Stop-loss (y − 1.550.000)⁺, k₁ = k₂ = 1 %', 5, 't5-reaseguro', 'e22-2b'],
    ['Enero 2022', '2c', 'Algoritmo para el k óptimo del stop-loss', 5, 't5-optimo', 'e22-2c'],
    ['Enero 2022', '3a', 'N ∈ {0,1,2} y severidad normal: distribución del coste', 3, 't3-agregado', 'e22-3a'],
    ['Enero 2022', '3b', 'N ∈ {0,1,2} y severidad exponencial: distribución del coste', 3, 't3-agregado', 'e22-3b'],
    ['Enero 2022', '4a', 'Dos grupos, Bayes tras dos años sin siniestros', 3, 't3-tipos', 'e22-4a'],
    ['Enero 2022', '4b', 'IP(N = 0) beta: distribución a posteriori', 10, null, null],
    ['Enero 2020', '2a', 'SW₁ de la cartera (recargos: tema 8)', 4, 't4-medidas', 'e20-2a'],
    ['Enero 2020', '2b-c', 'Reaseguro 0,1y + 0,5(y − 1.700.000)⁺, comonotonía, k₂ = 4 %', 5, 't5-reaseguro', 'e20-2bc'],
    ['Enero 2020', '2d', 'Diversificación de primas en activos', 8, null, null],
    ['Enero 2020', '3', 'BN(2; 0,6) + log-normal, CVaR90, IP(beneficio = prima)', 3, 't3-agregado', 'e20-3'],
    ['Enero 2020', '4a-b', 'IP(N = 0) beta: a posteriori y recargo', 10, null, null],
    ['Enero 2020', '4c', 'Media, varianza e «índice de mixtura» de N', 3, 't3-mixtura', 'e20-4c'],
    ['Enero 2019', '2a', 'CVaR95 de la cartera (recargos: tema 8)', 4, 't4-medidas', 'e19-2a'],
    ['Enero 2019', '2b', 'Reaseguro 0,5(y − 1.600.000)⁺, k₂ = 4 %', 5, 't5-reaseguro', 'e19-2b'],
    ['Enero 2019', '2c', 'Diversificación de primas en activos', 8, null, null],
    ['Enero 2019', '3', 'Cuadro por grupo con VaR85 (severidad 1000)', 3, 't3-tipos', 'e19-34'],
    ['Enero 2019', '4', 'Bonus-malus: tres años sin siniestros', 3, 't3-tipos', 'e19-34'],
    ['Enero 2018', '2a', 'SW₂ de la cartera (recargos: tema 8)', 4, 't4-medidas', 'e18-2a'],
    ['Enero 2018', '2b', 'Reaseguro 0,7y − 0,4(y − 1,6M)⁺ − 0,3(y − 1,9M)⁺', 5, 't5-reaseguro', 'e18-2b'],
    ['Enero 2018', '2c', 'Diversificación de primas en activos', 8, null, null],
    ['Enero 2018', '3a-b', 'BN + severidad normal, VaR99, IP(ganar | N = 1)', 3, 't3-agregado', 'e18-3ab'],
    ['Enero 2018', '3c', 'N ∈ {0, 3} equiprobables', 3, 't3-agregado', 'e18-3c'],
    ['Enero 2018', '4', 'Poisson–Gamma y beta a posteriori', 10, null, null],
    ['Enero 2017', '2a', 'SW₁ de la cartera (recargos: tema 8)', 4, 't4-medidas', 'e17-2a'],
    ['Enero 2017', '2b', 'Reaseguro 0,7y − 0,4(y − 9.000.000)⁺, k₂ = 90 %', 5, 't5-reaseguro', 'e17-2b'],
    ['Enero 2017', '2c-d', 'Pérdidas de la reaseguradora; diversificación', 8, null, null],
    ['Enero 2017', '3a-b', 'BN(3; 0,5) + exponencial, 0,5CVaR80 + 0,5CVaR90', 3, 't3-agregado', 'e17-3ab'],
    ['Enero 2017', '3c', 'Franquicia de 800', 3, 't3-agregado', 'e17-3c'],
    ['Enero 2017', '4a', 'Cuatro grupos, Bayes con N = 3 y N = 2', 3, 't3-tipos', 'e17-4a'],
    ['Enero 2017', '4b', 'Credibilidad de Bühlmann', 10, null, null],
    ['Enero 2016', '2a', 'Distribución de la cartera y SW₁ (recargos: tema 8)', 4, 't4-medidas', 'e16-2a'],
    ['Enero 2016', '2b', 'Recargos con SW₁', 8, null, null],
    ['Enero 2016', '2c-d', 'Reaseguro 0,7y − 0,2(y − 2.000.000)⁺; pérdidas de la reaseguradora', 5, 't5-reaseguro', 'e16-2cd'],
    ['Enero 2016', '2e', 'Diversificación de primas en activos', 8, null, null],
    ['Enero 2016', '3', 'BN(3; 0,5) + exponencial, CVaR80, ganar ≥ ½ prima, N ≤ 1', 3, 't3-agregado', 'e16-3'],
    ['Enero 2016', '4', 'Poisson–Gamma y beta para IP(N = 0)', 10, null, null],
    ['Enero 2015', '2', 'BN (media 2, varianza 10) + Erlang; VaR90, CVaR90, IP(pérdida)', 3, 't3-agregado', 'e15-2b'],
    ['Enero 2015', '3a', 'SW₁ de la cartera (recargos: tema 8)', 4, 't4-medidas', 'e15-3a'],
    ['Enero 2015', '3b', 'Cuota-parte con retención del 80 %', 5, 't5-reaseguro', 'e15-3b'],
    ['Enero 2015', '3c-d', 'Inversión de primas; stop-loss con PPVE', 8, null, null],
    ['Enero 2015', '4', 'Credibilidad de Bühlmann con tres tipos', 10, null, null],
    ['Enero 2015', '5', 'Reaseguro por tramos, precio y pérdidas de la reaseguradora', 5, 't5-reaseguro', 'e15-5'],
    ['Enero 2014', '2a', 'Distribución de la cartera, CVaR(μ) y sensibilidad', 4, 't4-medidas', 'e14-2a'],
    ['Enero 2014', '2b-c', 'Recargos con CVaR70', 8, null, null],
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
        h('div', { class: 'stat' }, h('b', null, '1–5'), h('span', null, 'temas cubiertos')),
        h('button', { class: 'stat link', type: 'button', onclick: () => go('ex') }, h('b', null, '→'), h('span', null, 'ver ejercicios de examen')))));
    box.append(h('div', { class: 'intents' }, INTENTS.map(it => h('button', { class: 'intent', type: 'button', style: { '--tc': `var(--t${it.tema})` }, onclick: () => go(it.tema, it.tool) },
      h('span', { class: 'intent-n' }, 'T' + it.tema), h('div', { class: 'q' }, it.q), h('div', { class: 'a' }, it.a)))));
    box.append(h('div', { class: 'foot', html: '<b>Sobre los números.</b> Las soluciones oficiales suelen estimar CVaR, medidas espectrales y capas de reaseguro con Monte Carlo en Excel. La calculadora obtiene esos valores de forma exacta (fórmulas cerradas, integración numérica o distribución exacta del coste agregado), así que pueden diferir en torno a un 1 % de los del examen; al cargar un ejercicio verás ambas cifras.<br><b>Formato de los datos.</b> Acepta 0,95 o 0.95; 1.700.000 o 1700000; fracciones como 1/4 y porcentajes como 95 %. Pulsa <b>/</b> para buscar.' }));
    return box;
  }

  let filter = 'todos';
  function examsView(h, go) {
    const box = h('div', { class: 'exams-v' });
    box.append(h('div', { class: 'page-h' }, h('div', { class: 'page-k' }, 'Índice'), h('h2', null, 'Ejercicios de examen'),
      h('p', null, 'Cada convocatoria con sus ejercicios prácticos. Los de los temas 1–5 se abren ya cargados y resueltos; el resto se añadirá con los temas siguientes.')));
    const list = h('div', { class: 'ex-grid' });
    const draw = () => {
      list.innerHTML = '';
      for (const ex of exams) {
        const rows = EXAMS.filter(r => r[0] === ex && (filter === 'todos' || (filter === 'ya' ? r[4] : !r[4])));
        if (!rows.length) continue;
        const n = EXAMS.filter(r => r[0] === ex && r[4]).length, tot = EXAMS.filter(r => r[0] === ex).length;
        list.append(h('div', { class: 'ex-card' },
          h('div', { class: 'ex-h' }, h('b', null, ex), h('span', { class: 'ex-prog' }, h('i', { style: { width: (100 * n / tot) + '%' } })), h('small', null, `${n}/${tot}`)),
          rows.map(([, ej, d, tm, tool, exid]) => h(tool ? 'button' : 'div', { class: 'ex-row' + (tool ? '' : ' off'), type: tool ? 'button' : null, onclick: tool ? () => go(tm, tool, exid) : null },
            h('span', { class: 'ex-ej' }, ej), h('span', { class: 'ex-d', html: d }),
            h('span', { class: 'pill' + (tm <= 5 ? ' t' + tm : ''), style: tm <= 5 ? { '--tc': `var(--t${tm})` } : null }, 'T' + tm),
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
  return { home, exams: examsView };
})();
UI.start(VIEWS);
