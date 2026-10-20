/* ════════════════════════════════════════════════════════════════
   INTERFAZ — formularios declarativos, resultados y navegación
   ════════════════════════════════════════════════════════════════ */
'use strict';
const UI = (function () {
  const T = TNV;
  const TEMAS = [];          // {n, title, short, color, desc, formulas:[[t, html]]}
  const TOOLS = [];          // herramientas registradas
  const state = { tema: 0, toolByTema: {}, vals: {}, lastRes: {}, lastEx: {} };

  /* ───────── Utilidades DOM ───────── */
  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (v === undefined || v === null || v === false) continue;
      if (k === 'class') e.className = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else if (k === 'style' && typeof v === 'object') { for (const p in v) { if (p.startsWith('--')) e.style.setProperty(p, v[p]); else e.style[p] = v[p]; } }
      else e.setAttribute(k, v === true ? '' : v);
    }
    for (const k of kids.flat()) if (k !== null && k !== undefined && k !== false) e.append(k.nodeType ? k : document.createTextNode(String(k)));
    return e;
  }
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem('tnv:' + k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem('tnv:' + k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } }
  };

  /* ───────── Fórmulas del temario (para «Fórmulas utilizadas») ───────── */
  const FORMULAS = {
    norm2: 'Tipificación: ỹ = (y − m)/s ∼ N(0, 1); y = m + sỹ (ec. 2)',
    ln67: 'Log-normal: 𝔼(y) = e<sup>m+s²/2</sup>, σ²(y) = (e<sup>s²</sup> − 1)e<sup>2m+s²</sup>; s² = log(σ²/𝔼² + 1), m = log 𝔼 − s²/2 (ec. 6–7)',
    gam12: 'Gamma(α, β): 𝔼 = αβ, σ² = αβ²; suma de k exponenciales de media β = Gamma(k, β) (ec. 12)',
    par17: 'Pareto(α, β): 𝔼 = β/(α − 1), σ² = αβ²/((α − 1)²(α − 2)) (ec. 17)',
    pois: 'Poisson(λ): 𝔼(N) = σ²(N) = λ; IP(N = x) = e<sup>−λ</sup>λ<sup>x</sup>/x!',
    nb24: 'Binomial negativa(α, θ): 𝔼(N) = α(1 − θ)/θ, σ²(N) = α(1 − θ)/θ²; IP(N = x) = Γ(x + α)/(Γ(α)x!)·θ<sup>α</sup>(1 − θ)<sup>x</sup> (ec. 24)',
    pg29: 'λ ∼ Gamma(α, β) y N|λ ∼ Poisson(λ) ⇒ N ∼ BN(α, θ = 1/(1 + β)) (ec. 29)',
    comp26: 'Compuesta: 𝔼(y) = 𝔼(N)𝔼(S), σ²(y) = 𝔼(N)σ²(S) + σ²(N)𝔼(S)² (ec. 26)',
    franq: 'Franquicia d: cada siniestro paga (S − d)<sup>+</sup>; indemnización máxima L: min{S, L}; máxima anual F: min{y, F}',
    tpt: 'Teorema de las probabilidades totales: F<sub>y</sub>(x) = IP(N = 0) + Σ<sub>n≥1</sub> IP(N = n)F<sub>y|N=n</sub>(x)',
    panjer65: 'Panjer: IP(y = 0) = P<sub>N</sub>(IP(S = 0)); IP(y = z) = (1/(1 − cIP(S = 0)))Σ<sub>x=1</sub><sup>z</sup>(c + dx/z)IP(S = x)IP(y = z − x) (ec. 65)',
    var31: 'VaR<sub>1−μ</sub>(−y) = percentil 1 − μ de y (ec. 31)',
    cvar33: 'CVaR<sub>1−μ</sub>(−y) = (1/μ)∫₀<sup>μ</sup>VaR<sub>1−t</sub>(−y)dt = VaR + 𝔼((y − VaR)<sup>+</sup>)/μ (ec. 33)',
    wcvar34: 'WCVaR = Σ kᵢ CVaR<sub>1−μᵢ</sub>, Σkᵢ = 1 (ec. 34)',
    norm44: 'Normal: ρ(−y) = m + ρ<sub>(0,1)</sub>·s (ec. 44)',
    norm45: 'N(0,1): VaR<sub>1−μ</sub> = Φ<sup>−1</sup>(1 − μ), CVaR<sub>1−μ</sub> = φ(Φ<sup>−1</sup>(μ))/μ (ec. 45)',
    ln49: 'Log-normal: VaR<sub>1−μ</sub>(−y) = e<sup>m+sΦ⁻¹(1−μ)</sup>; CVaR<sub>1−μ</sub>(−y) = (e<sup>m+s²/2</sup>/μ)[1 − Φ(Φ<sup>−1</sup>(1 − μ) − s)] (ec. 49)',
    dist35: 'Distorsión: ρ<sub>g</sub> = ∫₀¹VaR<sub>1−t</sub> g′(t)dt; Wang g(t) = Φ(Φ<sup>−1</sup>(t) + a); DPT g(t) = 1 − (1 − t)<sup>a</sup> (ec. 35)',
    spec40: 'Espectral: ρ = ∫₀¹CVaR<sub>1−t</sub> g′(t)dt; SW<sub>a</sub>: g′(t) = exp(−aΦ<sup>−1</sup>(t) − a²/2) (ec. 36, 40)',
    exp43: 'Expectil: 𝔼(y) = x + ((1 − 2μ)/(1 − μ))𝔼((y − x)<sup>+</sup>); 𝔈<sub>μ</sub> = −E<sub>μ</sub>, 0 < μ ≤ 1/2 (ec. 42–43)',
    prima66: 'Principio de prima: Π(y) = (1 + k₁)𝔼(y) + k₂ρ(−y) (ec. 66)',
    trasl: 'Invarianza por traslaciones: ρ(Π − y) = ρ(−y) − Π',
    tcl61: 'Riesgo individual: 𝔼(Y) = Σ𝔼(yⱼ), σ²(Y) = Σσ²(yⱼ) y, por el TCL, Y ≈ normal (ec. 61)',
    mixt27: 'Mixtura: 𝔼(y) = 𝔼(𝔼(y|Λ)), σ²(y) = 𝔼(σ²(y|Λ)) + σ²(𝔼(y|Λ)) (ec. 27)',
    mixt28: 'Índice de mixtura: I = σ²(𝔼(y|Λ))/𝔼(σ²(y|Λ)) (ec. 28)',
    bayes: 'Bayes: IP(tipo j | obs.) = IP(obs. | j)IP(j)/Σᵢ IP(obs. | i)IP(i)',
    rea58: 'Reaseguro: y = y<sub>r</sub> + y<sub>c</sub>; y<sub>c</sub> = Σ aᵢ(y − Uᵢ)<sup>+</sup> (ec. 58–59)',
    comono: 'Comonotonía: 0 ≤ a₁ + … + aₖ ≤ 1 para todo k (pendientes de y<sub>c</sub> e y<sub>r</sub> entre 0 y 1)',
    aditiv: 'Aditividad comonótona y homogeneidad: ρ(−y<sub>c</sub>) = Σ aᵢ ρ(−(y − Uᵢ)<sup>+</sup>)',
    slN: 'Normal: 𝔼((y − U)<sup>+</sup>) = sφ((U − m)/s) + (m − U)(1 − Φ((U − m)/s))',
    cvarslN: 'Normal: CVaR<sub>1−μ</sub>(−(y − U)<sup>+</sup>) = (s/μ)φ(Φ<sup>−1</sup>(μ)) + m − U si VaR ≥ U; 𝔼((y − U)<sup>+</sup>)/μ si VaR < U',
    prima71: 'Prima de la cartera: Π = ρ(−y) − R₀; con reaseguro, ρ(−y) − R₀ + (Π<sub>R</sub> − ρ(−y<sub>c</sub>)) (ec. 71, 75)',
    k73: 'Relación de recargos: k₂ = 1 − R₀/ρ(−y) − (𝔼(y)/ρ(−y))(1 + k₁) (ec. 73)',
    k78: 'Con reaseguro: k̃₂ = (ρ(−y<sub>r</sub>) + Π<sub>R</sub>)/ρ(−y) − R₀/ρ(−y) − (𝔼(y)/ρ(−y))(1 + k̃₁) (ec. 78)',
    k88: 'Por póliza: k₁ igual, k₂<sup>(p)</sup> = k₂·ρ(−y)/Σρ(−yᵢ) (ec. 88)',
    inv80: 'Inversión: B = A<sup>−1</sup>𝔼(r − r₀)/ρ<sub>(0,1)</sub>, M = 1/√(1 − BᵗAB), x = Mσ(y)B/Π, Π* = Π + ρ(R)/(1 + r₀) (ec. 79–83)',
    mc72: 'Monte Carlo (§7.2): simular N; si N > 0 simular S₁…S<sub>N</sub> y sumar; repetir M veces; estimar 𝔼, σ, VaR (percentil) y CVaR (media de la cola)'
  };

  /* ───────── Registro ───────── */
  function tema(t) { TEMAS.push(t); }
  function tool(t) { TOOLS.push(t); }
  const toolById = id => TOOLS.find(t => t.id === id);
  const temaOf = n => TEMAS.find(t => t.n === n);
  const allFields = t => t.groups.flatMap(g => g.fields);

  /* ───────── Valores ───────── */
  function defaults(t) {
    const v = {};
    for (const f of allFields(t)) {
      if (f.type === 'rows') v[f.id] = (f.def || []).map(r => Object.assign({}, r));
      else if (f.type === 'check') v[f.id] = !!f.def;
      else if (f.type !== 'info') v[f.id] = f.def !== undefined ? String(f.def) : '';
    }
    return v;
  }
  function valsOf(t) {
    if (!state.vals[t.id]) {
      const saved = store.get('v:' + t.id);
      state.vals[t.id] = Object.assign(defaults(t), saved || {});
    }
    return state.vals[t.id];
  }
  function save(t) { store.set('v:' + t.id, state.vals[t.id]); }
  // Lector de valores con mensajes de error comprensibles
  function reader(t, raw) {
    const lab = {};
    for (const f of allFields(t)) lab[f.id] = (f.label || f.id).replace(/<[^>]+>/g, '');
    const R = {
      raw,
      n(id, opt) {
        const s = raw[id];
        if ((s === '' || s === undefined) && opt && opt.opt) return null;
        const x = T.parseNum(s);
        if (isNaN(x)) throw new Error(`Revisa el dato «${lab[id] || id}»: «${s === undefined ? '' : s}» no es un número.`);
        if (opt && opt.pos && !(x > 0)) throw new Error(`«${lab[id] || id}» debe ser positivo.`);
        if (opt && opt.prob && !(x > 0 && x < 1)) throw new Error(`«${lab[id] || id}» debe estar entre 0 y 1.`);
        return x;
      },
      nOpt(id) { return R.n(id, { opt: true }); },
      s(id) { return raw[id] === undefined ? '' : String(raw[id]); },
      b(id) { return !!raw[id]; },
      list(id, opt) {
        const s = R.s(id).trim();
        if (!s) { if (opt && opt.opt) return []; throw new Error(`Falta la lista «${lab[id] || id}».`); }
        const out = s.split(/[;|\n\t]+|\s{1,}(?=[\d+−-])/).map(x => x.trim()).filter(Boolean).map(x => { const v = T.parseNum(x); if (isNaN(v)) throw new Error(`«${x}» no es un número en «${lab[id] || id}». Separa los valores con «;».`); return v; });
        return out;
      },
      rows(id) {
        const f = allFields(t).find(x => x.id === id);
        return (raw[id] || []).map((r, i) => {
          const o = {};
          for (const c of f.cols) {
            if (c.type === 'sel' || c.type === 'text') { o[c.id] = r[c.id] !== undefined ? r[c.id] : (c.def || ''); continue; }
            const s = r[c.id];
            if ((s === '' || s === undefined) && c.opt) { o[c.id] = null; continue; }
            const x = T.parseNum(s);
            if (isNaN(x)) throw new Error(`Fila ${i + 1} de «${lab[id]}»: «${c.label}» no es un número.`);
            o[c.id] = x;
          }
          return o;
        });
      }
    };
    return R;
  }

  /* ───────── Constructor de resultados ───────── */
  function result() {
    const r = { tiles: [], blocks: [], steps: [], keys: {}, exam: [], que: [] };
    r.ans = (lab, html) => { r.exam.push({ lab, html }); return r; };   // respuesta de examen (prosa)
    r.explain = html => { r.que.push(html); return r; };                // qué se está calculando
    r.usa = [];
    r.uses = (...keys) => { for (const k of keys) if (FORMULAS[k] && !r.usa.includes(k)) r.usa.push(k); return r; };
    r.tile = (l, v, o) => { r.tiles.push(Object.assign({ l, v }, o || {})); return r; };
    r.step = (title, html) => { r.steps.push({ title, html }); return r; };
    r.table = (title, head, rows, o) => { r.blocks.push(Object.assign({ k: 'table', title, head, rows }, o || {})); return r; };
    r.note = html => { r.blocks.push({ k: 'note', html }); return r; };
    r.warn = html => { r.blocks.push({ k: 'warn', html }); return r; };
    r.html = html => { r.blocks.push({ k: 'html', html }); return r; };
    r.key = (k, v) => { r.keys[k] = v; return r; };
    return r;
  }
  const eq = s => `<div class="eq">${s}</div>`;
  const v = (x, sig) => `<span class="v">${T.fmt(x, sig)}</span>`;

  /* ───────── Render de campos ───────── */
  function renderField(t, f, vals, onChange) {
    if (f.type === 'info') return h('div', { class: 'info', html: typeof f.html === 'function' ? f.html(vals) : f.html, 'data-f': f.id || '' });
    const wrap = h('div', { class: 'fld' + (f.wide ? ' wide' : '') + (f.type === 'check' ? ' chk' : '') + (f.type === 'rows' ? ' rows' : ''), 'data-f': f.id });
    const id = 'f_' + t.id + '_' + f.id;
    if (f.type === 'check') {
      const cb = h('input', { type: 'checkbox', id, onchange: e => { vals[f.id] = e.target.checked; onChange(f); } });
      cb.checked = !!vals[f.id];
      wrap.append(cb, h('label', { for: id, html: f.label }));
      if (f.help) wrap.append(h('div', { class: 'help', html: f.help, style: { gridColumn: '1/-1' } }));
      return wrap;
    }
    if (f.type === 'rows') {
      wrap.append(h('label', { html: f.label }));
      const tbl = h('table');
      const head = h('tr', null, f.cols.map(c => h('th', { html: c.label })), h('th'));
      tbl.append(head);
      const body = h('tbody');
      const draw = () => {
        body.innerHTML = '';
        (vals[f.id] || []).forEach((row, i) => {
          const tr = h('tr');
          for (const c of f.cols) {
            let inp;
            if (c.type === 'sel') {
              inp = h('select', { onchange: e => { row[c.id] = e.target.value; onChange(f); } }, c.opts.map(o => h('option', { value: o[0] }, o[1])));
              inp.value = row[c.id] !== undefined ? row[c.id] : c.def;
            } else {
              inp = h('input', { type: 'text', inputmode: c.type === 'text' ? 'text' : 'decimal', value: row[c.id] !== undefined ? row[c.id] : '', placeholder: c.ph || '', oninput: e => { row[c.id] = e.target.value; onChange(f, true); } });
            }
            tr.append(h('td', { style: c.w ? { width: c.w } : null }, inp));
          }
          tr.append(h('td', null, h('button', { class: 'rm', title: 'Quitar fila', type: 'button', onclick: () => { vals[f.id].splice(i, 1); draw(); onChange(f); } }, '×')));
          body.append(tr);
        });
      };
      draw();
      tbl.append(body);
      wrap.append(tbl, h('button', { class: 'add', type: 'button', onclick: () => { const r = {}; f.cols.forEach(c => r[c.id] = c.def !== undefined ? String(c.def) : ''); vals[f.id].push(r); draw(); onChange(f); } }, '+ añadir fila'));
      if (f.help) wrap.append(h('div', { class: 'help', html: f.help }));
      return wrap;
    }
    wrap.append(h('label', { for: id, html: f.label }));
    if (f.type === 'sel') {
      const s = h('select', { id, onchange: e => { vals[f.id] = e.target.value; onChange(f); } }, f.opts.map(o => h('option', { value: o[0] }, o[1])));
      s.value = vals[f.id];
      if (s.value !== vals[f.id]) { vals[f.id] = f.opts[0][0]; s.value = vals[f.id]; }
      wrap.append(s);
    } else {
      const echo = h('div', { class: 'echo' });
      const inp = h('input', {
        type: 'text', id, value: vals[f.id], placeholder: f.ph || '', inputmode: f.type === 'text' ? 'text' : 'decimal', autocomplete: 'off', spellcheck: 'false',
        oninput: e => { vals[f.id] = e.target.value; upd(); onChange(f, true); },
        onkeydown: e => { if (e.key === 'Enter') { e.preventDefault(); solveCurrent(); } }
      });
      const upd = () => {
        if (f.type !== 'num') return;
        const s = vals[f.id].trim(); const x = T.parseNum(s);
        inp.classList.toggle('bad', s !== '' && isNaN(x));
        const plain = /^[−-]?\d+([.,]\d+)?$/.test(s) && !/^\d{1,3}\.\d{3}$/.test(s);
        echo.innerHTML = (s !== '' && !isNaN(x) && !plain) ? '= ' + T.fmt(x, 12) : '';
      };
      upd();
      wrap.append(inp, echo);
    }
    if (f.help) wrap.append(h('div', { class: 'help', html: f.help }));
    return wrap;
  }
  function refreshVisibility(root, t, vals) {
    for (const f of allFields(t)) {
      if (!f.show) continue;
      const el = root.querySelector(`[data-f="${f.id}"]`);
      if (el) el.style.display = f.show(vals) ? '' : 'none';
    }
    root.querySelectorAll('[data-g]').forEach(g => {
      const grp = t.groups[+g.dataset.g];
      const vis = grp.fields.some(f => !f.show || f.show(vals));
      const gs = grp.show ? grp.show(vals) : true;
      g.style.display = vis && gs ? '' : 'none';
    });
    root.querySelectorAll('.info[data-f]').forEach(el => {
      const f = allFields(t).find(x => x.id === el.dataset.f);
      if (f && typeof f.html === 'function') el.innerHTML = f.html(vals);
    });
  }

  /* ───────── Render de resultados ───────── */
  function renderResult(t, r, ex) {
    const box = h('div');
    if (r.error) { box.append(h('div', { class: 'err', html: '⚠ ' + r.error })); return box; }
    const que = [t.que, ...r.que].filter(Boolean);
    if (que.length) box.append(h('div', { class: 'que' }, h('div', { class: 'que-h' }, 'Qué estás calculando'), ...que.map(q => h('p', { html: q }))));
    if (r.tiles.length) {
      box.append(h('h3', null, 'Resultado'));
      box.append(h('div', { class: 'tiles' }, r.tiles.map(x => h('div', { class: 'tile' + (x.main ? ' main' : '') },
        h('div', { class: 'tl', html: x.l }),
        h('div', { class: 'tv', html: typeof x.v === 'string' ? x.v : (x.pct ? T.fmtPct(x.v) : T.fmt(x.v, x.sig)) }),
        x.hint ? h('div', { class: 'th', html: x.hint }) : null))));
    }
    if (r.exam.length) {
      const body = h('div', { class: 'caja-examen-body' }, r.exam.map(p => h('div', { class: 'ce-p' }, p.lab ? h('span', { class: 'ce-lab', html: p.lab }) : null, h('span', { html: p.html }))));
      if (r.usa && r.usa.length) body.append(h('div', { class: 'ce-forms' }, h('div', { class: 'ce-lab' }, 'Fórmulas utilizadas:'), h('ul', null, r.usa.map(k => h('li', { html: FORMULAS[k] })))));
      box.append(h('div', { class: 'caja-examen' },
        h('div', { class: 'caja-examen-header' }, h('span', null, 'Respuesta de examen — copia esto'),
          h('button', { class: 'ce-copy', type: 'button', onclick: e => copyText(body, e.target) }, 'Copiar respuesta')),
        body));
    }
    if (ex && ex.expect && ex.expect.length) {
      box.append(h('h3', null, 'Comparación con la solución del examen'));
      const rows = ex.expect.map(e => {
        const c = r.keys[e.k];
        let dif = '—', cls = '';
        if (typeof c === 'number' && typeof e.v === 'number' && isFinite(c)) {
          const d = (c - e.v) / (Math.abs(e.v) || 1);
          dif = (Math.abs(d) < 5e-9 ? '0' : (d > 0 ? '+' : '−') + T.fmt(Math.abs(d) * 100, 3)) + ' %';
          cls = Math.abs(d) < 1e-6 ? 'dif-ok' : (Math.abs(d) < 0.02 ? 'dif-mid' : '');
        }
        return h('tr', null, h('td', { html: e.l }), h('td', { class: 'n', html: typeof e.v === 'number' ? T.fmt(e.v) : e.v }), h('td', { class: 'n', html: typeof c === 'number' ? T.fmt(c) : (c || '—') }), h('td', { class: 'n ' + cls, html: dif }), h('td', { html: e.src || '' }));
      });
      box.append(h('div', { class: 'tbl-wrap' }, h('table', { class: 't' }, h('tr', null, ['Magnitud', 'Examen', 'Calculadora', 'Dif.', 'Cómo lo obtuvo el examen'].map(x => h('th', null, x))), rows)));
      if (ex.note) box.append(h('div', { class: 'note', html: ex.note }));
    }
    for (const b of r.blocks.filter(b => b.top)) box.append(renderBlock(b));
    if (r.steps.length) {
      box.append(h('h3', null, 'Procedimiento paso a paso'));
      box.append(h('ol', { class: 'steps' }, r.steps.map(s => h('li', null, h('div', { class: 'st', html: s.title }), h('div', { html: s.html || '' })))));
    }
    for (const b of r.blocks.filter(b => !b.top)) box.append(renderBlock(b));
    box.append(h('div', { class: 'res-actions' },
      h('button', { class: 'btn2', type: 'button', onclick: e => copyText(box, e.target) }, 'Copiar procedimiento'),
      h('button', { class: 'btn2', type: 'button', onclick: () => window.print() }, 'Imprimir')));
    return box;
  }
  function renderBlock(b) {
    if (b.k === 'note') return h('div', { class: 'note', html: b.html });
    if (b.k === 'warn') return h('div', { class: 'warn', html: '⚠ ' + b.html });
    if (b.k === 'html') return h('div', { html: b.html });
    if (b.k === 'table') {
      const d = h('div');
      if (b.title) d.append(h('h3', { html: b.title }));
      const tb = h('table', { class: 't' }, h('tr', null, b.head.map(x => h('th', { html: x }))));
      b.rows.forEach((row, i) => tb.append(h('tr', { class: (b.hl && b.hl(i)) ? 'hl' : '' }, row.map(c => typeof c === 'number' ? h('td', { class: 'n', html: T.fmt(c, b.sig) }) : h('td', { class: (typeof c === 'string' && /^[−\-+]?[\d.,]+( %)?$/.test(c)) ? 'n' : '', html: c === null || c === undefined ? '—' : String(c) })))));
      d.append(h('div', { class: 'tbl-wrap' }, tb));
      return d;
    }
    return h('div');
  }
  function copyText(box, btn) {
    const txt = box.innerText.replace(/Copiar (procedimiento|respuesta)\s*(Imprimir)?\s*/g, '').trim();
    const done = () => { const o = btn.textContent; btn.textContent = '✓ Copiado'; setTimeout(() => btn.textContent = o, 1400); };
    try { navigator.clipboard.writeText(txt).then(done, () => fallback()); } catch (e) { fallback(); }
    function fallback() { const ta = h('textarea'); ta.value = txt; document.body.append(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (e) { } ta.remove(); }
  }

  /* ───────── Vistas (modo aplicación: barra lateral + contenido) ───────── */
  let ROOT, NAV, CRUMB, VIEWS = {};
  const closeDrawer = () => document.body.classList.remove('drawer');
  function navItem(label, opts) {
    return h('button', Object.assign({ type: 'button', class: 'nv' + (opts.on ? ' on' : '') + (opts.cls ? ' ' + opts.cls : ''), onclick: () => { closeDrawer(); opts.go(); } }, opts.style ? { style: opts.style } : {}),
      opts.ico ? h('span', { class: 'nv-ico', html: opts.ico }) : null, h('span', { class: 'nv-t', html: label }), opts.badge ? h('span', { class: 'nv-b' }, opts.badge) : null);
  }
  function renderNav() {
    NAV.innerHTML = '';
    const q = (document.getElementById('q').value || '').trim().toLowerCase();
    if (q) {
      const norm = x => String(x).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/<[^>]+>/g, '');
      const qq = norm(q);
      const hits = [];
      for (const t of TOOLS) {
        if (norm(t.title + ' ' + t.short + ' ' + (t.cuando || '')).includes(qq)) hits.push(navItem(t.title, { ico: `<b>${t.tema}</b>`, style: { '--tc': temaOf(t.tema).color }, go: () => go(t.tema, t.id) }));
        for (const e of (t.examples || [])) if (norm(e.label).includes(qq)) hits.push(navItem(e.label, { ico: '📄', cls: 'nv-ex', style: { '--tc': temaOf(t.tema).color }, go: () => go(t.tema, t.id, e.id) }));
      }
      NAV.append(h('div', { class: 'nv-sec' }, hits.length ? `${hits.length} resultado${hits.length > 1 ? 's' : ''}` : 'Sin resultados'), ...hits.slice(0, 80));
      return;
    }
    NAV.append(navItem('Inicio', { ico: '⌂', on: state.tema === 0, go: () => go(0) }));
    const nEx = TOOLS.reduce((a, t) => a + (t.examples || []).length, 0);
    NAV.append(navItem('Ejercicios de examen', { ico: '📄', on: state.tema === 'ex', badge: String(nEx), go: () => go('ex') }));
    NAV.append(h('div', { class: 'nv-sec' }, 'Temario'));
    for (const tm of [...TEMAS].sort((a, b) => a.n - b.n)) {
      if (tm.off) { NAV.append(h('div', { class: 'nv-grp off' }, h('span', { class: 'nv-num' }, tm.offLabel || ''), h('span', null, 'Próximamente'))); continue; }
      const open = state.tema === tm.n;
      const grp = h('div', { class: 'nv-grp' + (open ? ' open' : ''), style: { '--tc': tm.color } },
        h('button', { type: 'button', class: 'nv-gh', onclick: () => { closeDrawer(); go(tm.n); } }, h('span', { class: 'nv-num' }, tm.n), h('span', { class: 'nv-gt' }, tm.title)));
      const list = h('div', { class: 'nv-tools' });
      for (const t of TOOLS.filter(x => x.tema === tm.n)) list.append(navItem(t.title, { on: open && state.toolByTema[tm.n] === t.id, go: () => go(tm.n, t.id) }));
      grp.append(list);
      NAV.append(grp);
    }
  }
  function setCrumb(parts) { CRUMB.innerHTML = parts.map((p, i) => `<span class="${i === parts.length - 1 ? 'cur' : ''}">${p}</span>`).join('<span class="sep">›</span>'); }
  function go(n, toolId, exId) {
    state.tema = n;
    if (toolId) state.toolByTema[n] = toolId;
    store.set('nav', { tema: n, toolByTema: state.toolByTema });
    if (n === 0) { renderView('home'); setCrumb(['Inicio']); }
    else if (n === 'ex') { renderView('exams'); setCrumb(['Ejercicios de examen']); }
    else renderTema(n, exId);
    renderNav();
    window.scrollTo({ top: 0 });
  }
  function renderView(k) { ROOT.innerHTML = ''; ROOT.append(VIEWS[k](h, go)); }
  let curTool = null, resBox = null;
  function renderTema(n, exId) {
    const tm = temaOf(n);
    ROOT.innerHTML = '';
    const tools = TOOLS.filter(t => t.tema === n);
    const cur = toolById(state.toolByTema[n]) && toolById(state.toolByTema[n]).tema === n ? toolById(state.toolByTema[n]) : tools[0];
    state.toolByTema[n] = cur.id;
    setCrumb([`Tema ${n} · ${tm.title}`, cur.title.replace(/<[^>]+>/g, '')]);
    const wrap = h('div', { style: { '--tc': tm.color } });
    wrap.append(h('div', { class: 'page-h' },
      h('div', { class: 'page-k' }, h('span', { class: 'chip-n' }, 'Tema ' + n), tm.title),
      h('h2', { html: cur.title }), h('p', { html: cur.short })));
    if (tools.length > 1) wrap.append(h('div', { class: 'seg' }, tools.map(t => h('button', { type: 'button', class: 'seg-b' + (t === cur ? ' on' : ''), onclick: () => go(n, t.id), html: t.title }))));
    if (tm.formulas && tm.formulas.length) {
      wrap.append(h('details', { class: 'formulas' }, h('summary', null, 'Fórmulas clave del tema'),
        h('div', { class: 'fgrid' }, tm.formulas.map(f => h('div', { class: 'fitem' }, h('b', null, f[0]), h('div', { class: 'fx', html: f[1] }))))));
    }
    const work = h('div', { class: 'work' });
    const form = renderForm(cur);
    resBox = h('div', { class: 'panel res' });
    work.append(h('div', { class: 'panel form' }, form), resBox);
    wrap.append(work);
    ROOT.append(wrap);
    curTool = cur;
    const ex = exId && cur.examples ? cur.examples.find(e => e.id === exId) : null;
    if (ex) { loadExample(cur, ex); return; }
    if (state.lastRes[cur.id]) { resBox.innerHTML = ''; resBox.append(renderResult(cur, state.lastRes[cur.id], state.lastEx[cur.id])); }
    else resBox.append(h('div', { class: 'res-empty', html: '<div class="big">Introduce los datos y pulsa «Resolver»</div>o carga un ejercicio de examen desde el desplegable para ver cómo se resuelve.' }));
  }
  function renderForm(t) {
    const vals = valsOf(t);
    const root = h('div');
    const top = h('div', { class: 'form-top' });
    if (t.cuando) top.append(h('div', { class: 'cuando', html: '<b>Cuándo usarlo:</b> ' + t.cuando }));
    if (t.examples && t.examples.length) {
      const sel = h('select', { class: 'ex-sel', onchange: e => { const ex = t.examples.find(x => x.id === e.target.value); if (ex) loadExample(t, ex); e.target.value = ''; } },
        h('option', { value: '' }, '📄 Cargar un ejercicio de examen…'), t.examples.map(e => h('option', { value: e.id }, e.label)));
      top.append(sel);
    }
    root.append(top);
    const onChange = (f, typing) => { save(t); if (!typing) refreshVisibility(root, t, vals); };
    t.groups.forEach((g, gi) => {
      const grid = h('div', { class: 'fg' }, g.fields.map(f => renderField(t, f, vals, onChange)));
      let box;
      if (g.optional) { box = h('details', { class: 'opt', 'data-g': gi }, h('summary', null, g.title), grid); if (g.open || (g.openIf && g.openIf(vals))) box.open = true; }
      else box = h('fieldset', { 'data-g': gi }, g.title ? h('legend', null, g.title) : null, grid);
      root.append(box);
    });
    root.append(h('div', { class: 'btns' },
      h('button', { class: 'btn', type: 'button', onclick: solveCurrent }, 'Resolver'),
      h('button', { class: 'btn2', type: 'button', title: 'Volver a los valores por defecto', onclick: () => { state.vals[t.id] = defaults(t); save(t); delete state.lastRes[t.id]; delete state.lastEx[t.id]; go(t.tema, t.id); } }, 'Limpiar')));
    refreshVisibility(root, t, vals);
    return root;
  }
  function loadExample(t, ex) {
    const d = defaults(t);
    const vals = Object.assign(d, JSON.parse(JSON.stringify(ex.values)));
    state.vals[t.id] = vals; save(t);
    state.lastEx[t.id] = ex;
    renderTemaKeep(t);
    solve(t, ex);
  }
  function renderTemaKeep(t) {
    const exs = state.lastEx[t.id];
    delete state.lastRes[t.id];
    renderTema(t.tema);
    state.lastEx[t.id] = exs;
  }
  function solveCurrent() { if (curTool) solve(curTool, state.lastEx[curTool.id]); }
  function solve(t, ex) {
    resBox.classList.add('busy');
    setTimeout(() => {
      let r;
      try { r = t.solve(reader(t, valsOf(t)), { result, eq, v, T }); }
      catch (e) { r = { error: e.message || String(e), tiles: [], steps: [], blocks: [], keys: {} }; if (!e.message) console.error(e); }
      // Si se han cambiado los datos respecto del ejemplo, no mostrar la comparación
      const exOk = ex && JSON.stringify(Object.assign(defaults(t), ex.values)) === JSON.stringify(valsOf(t)) ? ex : null;
      if (!exOk) delete state.lastEx[t.id];
      state.lastRes[t.id] = r;
      resBox.innerHTML = '';
      resBox.append(renderResult(t, r, exOk));
      resBox.classList.remove('busy');
      if (window.innerWidth <= 1000) resBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 20);
  }
  function start(views) {
    VIEWS = views;
    ROOT = document.getElementById('app');
    NAV = document.getElementById('nav');
    CRUMB = document.getElementById('crumb');
    const nav = store.get('nav');
    if (nav) { state.toolByTema = nav.toolByTema || {}; }
    const th = store.get('theme');
    if (th) document.documentElement.setAttribute('data-theme', th);
    document.getElementById('themeBtn').addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const nx = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nx); store.set('theme', nx);
    });
    const pp = document.getElementById('profPi');
    pp.checked = !!store.get('profPi'); T.setProfPi(pp.checked);
    pp.addEventListener('change', () => { T.setProfPi(pp.checked); store.set('profPi', pp.checked); if (curTool && state.tema === curTool.tema && state.lastRes[curTool.id]) solveCurrent(); });
    document.getElementById('menuBtn').addEventListener('click', () => document.body.classList.toggle('drawer'));
    document.getElementById('scrim').addEventListener('click', closeDrawer);
    document.getElementById('q').addEventListener('input', renderNav);
    document.addEventListener('keydown', e => { if (e.key === '/' && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); document.body.classList.add('drawer'); document.getElementById('q').focus(); } });
    const t0 = nav ? nav.tema : 0;
    go(t0 === 'ex' ? 'ex' : (t0 && temaOf(t0) && !temaOf(t0).off ? t0 : 0));
  }
  return { tema, tool, start, go, h, eq, v, result, TOOLS, TEMAS, toolById };
})();
