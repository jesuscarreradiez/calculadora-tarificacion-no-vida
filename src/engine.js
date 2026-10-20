/* ════════════════════════════════════════════════════════════════
   MOTOR NUMÉRICO — Tarificación no Vida
   Todo se calcula en local (sin internet). Convención: las
   distribuciones representan PÉRDIDAS L = y (indemnización), y las
   medidas devuelven ρ(−y), como en el temario y los exámenes.
   ════════════════════════════════════════════════════════════════ */
'use strict';
const TNV = (function () {

  /* ───────── Funciones especiales ───────── */
  const SQ2PI = Math.sqrt(2 * Math.PI);
  const EULER = 0.5772156649015329;
  function phi(x) { return Math.exp(-0.5 * x * x) / SQ2PI; }
  // Razón de Mills R(t) = (1-Φ(t))/φ(t) por fracción continua (t ≥ 3)
  function millsR(t) {
    let f = t;
    const K = t < 4 ? 64 : t < 5 ? 40 : t < 6 ? 24 : 16;
    for (let k = K; k >= 1; k--) f = t + k / f;
    return 1 / f;
  }
  function Phi(x) {
    if (isNaN(x)) return NaN;
    if (x === Infinity) return 1;
    if (x === -Infinity) return 0;
    if (x < -3) return phi(x) * millsR(-x);
    if (x > 3) return 1 - phi(x) * millsR(x);
    const z = x / Math.SQRT2, z2 = z * z;
    let term = z, sum = z;
    for (let n = 1; n < 400; n++) {
      term *= 2 * z2 / (2 * n + 1); sum += term;
      if (Math.abs(term) < 1e-17 * Math.abs(sum)) break;
    }
    const erf = 2 / Math.sqrt(Math.PI) * Math.exp(-z2) * sum;
    return x < 0 ? 0.5 * (1 + erf) : 0.5 * (1 + erf);
  }
  function logPhi(x) {
    if (x < -3) return -0.5 * x * x - Math.log(SQ2PI) + Math.log(millsR(-x));
    return Math.log(Phi(x));
  }
  function PhiInv(p) {
    if (p <= 0) return -Infinity;
    if (p >= 1) return Infinity;
    const a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
    const b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
    const c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
    const d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
    const pl = 0.02425;
    let q, r, x;
    if (p < pl) {
      q = Math.sqrt(-2 * Math.log(p));
      x = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    } else if (p <= 1 - pl) {
      q = p - 0.5; r = q * q;
      x = (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
    } else {
      q = Math.sqrt(-2 * Math.log(1 - p));
      x = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    }
    // refinamiento de Halley (trabajando en la cola más precisa)
    for (let i = 0; i < 2; i++) {
      const e = x <= 0 ? Phi(x) - p : (1 - p) - Phi(-x);
      const u = e * SQ2PI * Math.exp(x * x / 2);
      x = x - u / (1 + x * u / 2);
    }
    return x;
  }
  const LZ = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  function lgamma(x) {
    if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - lgamma(1 - x);
    x -= 1;
    let a = LZ[0];
    const t = x + 7.5;
    for (let i = 1; i < 9; i++) a += LZ[i] / (x + i);
    return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
  }
  function gammaFn(x) {
    if (x < 0.5) return Math.PI / (Math.sin(Math.PI * x) * gammaFn(1 - x));
    return Math.exp(lgamma(x));
  }
  function gser(a, x) {
    let ap = a, sum = 1 / a, del = sum;
    for (let n = 0; n < 100000; n++) {
      ap += 1; del *= x / ap; sum += del;
      if (Math.abs(del) < Math.abs(sum) * 1e-16) break;
    }
    return sum * Math.exp(-x + a * Math.log(x) - lgamma(a));
  }
  function gcf(a, x) {
    const FP = 1e-300;
    let b = x + 1 - a, c = 1 / FP, d = 1 / b, h = d;
    for (let i = 1; i < 100000; i++) {
      const an = -i * (i - a); b += 2;
      d = an * d + b; if (Math.abs(d) < FP) d = FP;
      c = b + an / c; if (Math.abs(c) < FP) c = FP;
      d = 1 / d; const del = d * c; h *= del;
      if (Math.abs(del - 1) < 1e-16) break;
    }
    return Math.exp(-x + a * Math.log(x) - lgamma(a)) * h;
  }
  function gammaP(a, x) { if (x <= 0) return 0; return x < a + 1 ? gser(a, x) : 1 - gcf(a, x); }
  function gammaQ(a, x) { if (x <= 0) return 1; return x < a + 1 ? 1 - gser(a, x) : gcf(a, x); }
  function betacf(x, a, b) {
    const FP = 1e-300, qab = a + b, qap = a + 1, qam = a - 1;
    let c = 1, d = 1 - qab * x / qap;
    if (Math.abs(d) < FP) d = FP;
    d = 1 / d; let h = d;
    for (let m = 1; m < 100000; m++) {
      const m2 = 2 * m;
      let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < FP) d = FP;
      c = 1 + aa / c; if (Math.abs(c) < FP) c = FP;
      d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < FP) d = FP;
      c = 1 + aa / c; if (Math.abs(c) < FP) c = FP;
      d = 1 / d; const del = d * c; h *= del;
      if (Math.abs(del - 1) < 1e-16) break;
    }
    return h;
  }
  function betaI(x, a, b) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? bt * betacf(x, a, b) / a : 1 - bt * betacf(1 - x, b, a) / b;
  }

  /* ───────── Raíces ───────── */
  function bisect(f, a, b, tol = 1e-15, it = 300) {
    let fa = f(a);
    for (let i = 0; i < it; i++) {
      const m = 0.5 * (a + b);
      if (m === a || m === b) break;
      const fm = f(m);
      if ((fm <= 0) === (fa <= 0)) { a = m; fa = fm; } else b = m;
      if (Math.abs(b - a) <= tol * Math.max(1, Math.abs(a) + Math.abs(b))) break;
    }
    return 0.5 * (a + b);
  }
  // Busca x creciente con g(x)=0, g creciente
  function solveIncreasing(g, x0, step) {
    let a = x0, b = x0 + step, ga = g(a), gb = g(b), k = 0;
    while (ga > 0 && k < 200) { b = a; gb = ga; step *= 2; a = a - step; ga = g(a); k++; }
    while (gb < 0 && k < 400) { a = b; ga = gb; step *= 2; b = b + step; gb = g(b); k++; }
    return bisect(g, a, b);
  }

  /* ───────── Cuadratura de Gauss-Legendre en z (u = Φ(z)) ───────── */
  const GLX = [-0.9061798459386640, -0.5384693101056831, 0, 0.5384693101056831, 0.9061798459386640];
  const GLW = [0.2369268850561891, 0.4786286704993665, 0.5688888888888889, 0.4786286704993665, 0.2369268850561891];
  const ZLO = -8.5, ZHI = 8.5;
  function glNodes(lo, hi, h, breaks) {
    const pts = [lo, hi];
    (breaks || []).forEach(b => { if (isFinite(b) && b > lo && b < hi) pts.push(b); });
    pts.sort((x, y) => x - y);
    const Z = [], W = [];
    for (let s = 0; s < pts.length - 1; s++) {
      const a = pts[s], b = pts[s + 1];
      if (b - a < 1e-14) continue;
      const n = Math.max(1, Math.ceil((b - a) / h)), hh = (b - a) / n;
      for (let j = 0; j < n; j++) {
        const c = a + (j + 0.5) * hh;
        for (let k = 0; k < 5; k++) { Z.push(c + 0.5 * hh * GLX[k]); W.push(0.5 * hh * GLW[k]); }
      }
    }
    return { z: Z, w: W };
  }
  let STD_NODES = null;
  function stdNodes() { if (!STD_NODES) STD_NODES = glNodes(ZLO, ZHI, 0.01); return STD_NODES; }

  /* ───────── Distribución discreta genérica (atoms) ───────── */
  function makeDisc(xs0, ps0, meta) {
    let idx = xs0.map((_, i) => i);
    let sorted = true;
    for (let i = 1; i < xs0.length; i++) if (xs0[i] < xs0[i - 1]) { sorted = false; break; }
    if (!sorted) idx.sort((i, j) => xs0[i] - xs0[j]);
    const n = idx.length;
    const xs = new Float64Array(n), ps = new Float64Array(n);
    let tot = 0;
    for (let i = 0; i < n; i++) { xs[i] = xs0[idx[i]]; ps[i] = ps0[idx[i]]; tot += ps[i]; }
    for (let i = 0; i < n; i++) ps[i] /= tot;
    const SP = new Float64Array(n + 1), SX = new Float64Array(n + 1);
    for (let i = n - 1; i >= 0; i--) { SP[i] = SP[i + 1] + ps[i]; SX[i] = SX[i + 1] + ps[i] * xs[i]; }
    const mean = SX[0];
    let v = 0;
    for (let i = 0; i < n; i++) v += ps[i] * (xs[i] - mean) * (xs[i] - mean);
    function firstAbove(x) { let lo = 0, hi = n; while (lo < hi) { const m = (lo + hi) >> 1; if (xs[m] > x) hi = m; else lo = m + 1; } return lo; }
    const D = {
      kind: 'disc', xs, ps, n, mean, var: v, sd: Math.sqrt(v), totalMass: tot,
      meta: meta || {},
      cdf(x) { return 1 - SP[firstAbove(x)]; },
      sf(x) { return SP[firstAbove(x)]; },
      pAt(x) { let s = 0; for (let i = 0; i < n; i++) if (Math.abs(xs[i] - x) <= 1e-12 * Math.max(1, Math.abs(x))) s += ps[i]; return s; },
      q(p) { // cuantil inferior inf{x: F(x) ≥ p}
        if (p <= 0) return xs[0];
        let lo = 0, hi = n - 1;
        while (lo < hi) { const m = (lo + hi) >> 1; if (1 - SP[m + 1] >= p - 1e-12) hi = m; else lo = m + 1; }
        return xs[lo];
      },
      VaR(mu) { return D.q(1 - mu); },
      SL(x) { const k = firstAbove(x); return SX[k] - x * SP[k]; },
      CVaR(mu) { const v = D.VaR(mu); return v + D.SL(v) / mu; },
      CVaRz(s) { return D.CVaR(Phi(s)); },
      distortion(g) { let r = 0; for (let i = 0; i < n; i++) r += xs[i] * (g(SP[i]) - g(SP[i + 1])); return r; },
      entropic(mu) {
        let mx = -Infinity; for (let i = 0; i < n; i++) if (ps[i] > 0) mx = Math.max(mx, mu * xs[i]);
        let s = 0; for (let i = 0; i < n; i++) s += ps[i] * Math.exp(mu * xs[i] - mx);
        return (mx + Math.log(s)) / mu;
      },
      map(f) { const ys = new Array(n); for (let i = 0; i < n; i++) ys[i] = f(xs[i]); return makeDisc(ys, Array.from(ps)); },
      disc() { return D; },
      min: xs[0], max: xs[n - 1]
    };
    return D;
  }

  /* ───────── Distribución continua genérica ───────── */
  function makeCont(o) {
    const D = Object.assign({ kind: 'cont' }, o);
    D.sd = Math.sqrt(o.var);
    const lo = (o.lo !== undefined) ? o.lo : -Infinity, hi = (o.hi !== undefined) ? o.hi : Infinity;
    function bracketInvert(fn, target, decreasing) {
      // fn monótona; busca x con fn(x)=target
      const m = isFinite(o.mean) ? o.mean : (isFinite(lo) ? lo + 1 : 0);
      const s = isFinite(D.sd) && D.sd > 0 ? D.sd : Math.max(1, Math.abs(m));
      const g = decreasing ? (x => target - fn(x)) : (x => fn(x) - target);
      let a = isFinite(lo) ? lo : m - s, b = m + s;
      if (isFinite(hi)) b = Math.min(b, hi);
      let k = 0;
      while (g(a) > 0 && k < 200) { if (isFinite(lo)) { a = lo; break; } a = a - s * Math.pow(2, k); k++; }
      k = 0;
      while (g(b) < 0 && k < 2000) { const nb = isFinite(hi) ? Math.min(hi, b + s * Math.pow(2, k)) : b + s * Math.pow(2, k); if (nb === b) break; b = nb; k++; }
      return bisect(g, a, b, 1e-15, 200);
    }
    D.q = p => {
      if (p <= 0) return lo; if (p >= 1) return hi;
      if (p > 0.5) return D.qs(1 - p);
      return o.qp ? o.qp(p) : bracketInvert(o.cdf, p, false);
    };
    D.qs = s => {
      if (s <= 0) return hi; if (s >= 1) return lo;
      if (o.qs) return o.qs(s);
      if (s >= 0.5) return o.qp ? o.qp(1 - s) : bracketInvert(o.cdf, 1 - s, false);
      return bracketInvert(o.sf, s, true);
    };
    D.qz = z => (z <= 0 ? D.q(Phi(z)) : D.qs(Phi(-z)));
    D.VaR = mu => D.qs(mu);
    D.zOf = x => { const F = o.cdf(x); return F < 0.5 ? PhiInv(F) : -PhiInv(o.sf(x)); };
    let G = null;
    D.grid = () => {
      if (G) return G;
      const N = stdNodes();
      const x = new Array(N.z.length), p = new Array(N.z.length);
      for (let i = 0; i < N.z.length; i++) { x[i] = D.qz(N.z[i]); p[i] = N.w[i] * phi(N.z[i]); }
      G = { z: N.z, w: N.w, x, disc: makeDisc(x, p) };
      return G;
    };
    D.disc = () => D.grid().disc;
    if (!o.SL) D.SL = x => D.grid().disc.SL(x);
    if (o.CVaRz) D.CVaR = mu => o.CVaRz(PhiInv(mu));
    else { D.CVaR = mu => { if (mu >= 1) return o.mean; const v = D.VaR(mu); return v + D.SL(v) / mu; }; D.CVaRz = s => D.CVaR(Phi(s)); }
    // ∫ Q(Φ(z)) k(z) dz con núcleo k (para distorsiones)
    D.kernelInt = k => { const g = D.grid(); let r = 0; for (let i = 0; i < g.z.length; i++) r += g.w[i] * g.x[i] * k(g.z[i]); return r; };
    // E[h(L)] con puntos de quiebre en x (para franquicias y límites)
    D.expect = (h, breaksX) => {
      const bz = (breaksX || []).filter(b => b > lo && b < hi).map(b => D.zOf(b));
      const N = glNodes(ZLO, ZHI, 0.01, bz);
      let r = 0, tw = 0;
      for (let i = 0; i < N.z.length; i++) { const w = N.w[i] * phi(N.z[i]); r += w * h(D.qz(N.z[i])); tw += w; }
      return r / tw;
    };
    D.distortion = g => D.disc().distortion(g);
    D.entropic = mu => D.disc().entropic(mu);
    return D;
  }

  /* ───────── Familias continuas (temario T1) ───────── */
  // El profesor usa 2π ≈ 6,28 en sus macros (φ(x) ≈ e^(−x²/2)/√6,28). Activable para reproducir sus cifras.
  let PROF_PI = false;
  function setProfPi(b) { PROF_PI = !!b; }
  const kPi = () => PROF_PI ? Math.sqrt(2 * Math.PI / 6.28) : 1;
  function normal(m, s) {
    return makeCont({
      fam: 'normal', name: `N(${m}; ${s})`, m, s, mean: m, var: s * s,
      cdf: x => Phi((x - m) / s), sf: x => Phi(-(x - m) / s), pdf: x => phi((x - m) / s) / s,
      qp: p => m + s * PhiInv(p), qs: q => m - s * PhiInv(q),
      SL: x => { const k = (x - m) / s; return s * phi(k) * kPi() + (m - x) * Phi(-k); },
      CVaRz: z => m + s * kPi() * Math.exp(-0.5 * z * z - logPhi(z)) / SQ2PI,
      wang: a => m + a * s,
      entropicClosed: mu => m + mu * s * s / 2,
      sample: r => m + s * r.norm()
    });
  }
  function lognormal(mu, sg) {
    const E = Math.exp(mu + sg * sg / 2);
    return makeCont({
      fam: 'lognormal', mu, sg, mean: E, var: (Math.exp(sg * sg) - 1) * Math.exp(2 * mu + sg * sg), lo: 0,
      cdf: x => x <= 0 ? 0 : Phi((Math.log(x) - mu) / sg), sf: x => x <= 0 ? 1 : Phi(-(Math.log(x) - mu) / sg),
      pdf: x => x <= 0 ? 0 : phi((Math.log(x) - mu) / sg) / (x * sg),
      qp: p => Math.exp(mu + sg * PhiInv(p)), qs: q => Math.exp(mu - sg * PhiInv(q)),
      SL: x => { if (x <= 0) return E - x; const d1 = (mu + sg * sg - Math.log(x)) / sg; return E * Phi(d1) - x * Phi(d1 - sg); },
      CVaRz: z => E * Math.exp(logPhi(z + sg) - logPhi(z)),
      wang: a => Math.exp(mu + sg * a + sg * sg / 2),
      heavy: true,
      sample: r => Math.exp(mu + sg * r.norm())
    });
  }
  function lognormalMoments(E, sd) { const s2 = Math.log(1 + sd * sd / (E * E)); return lognormal(Math.log(E) - s2 / 2, Math.sqrt(s2)); }
  function gammaD(al, be) {
    const D = makeCont({
      fam: 'gamma', al, be, mean: al * be, var: al * be * be, lo: 0,
      cdf: x => gammaP(al, x / be), sf: x => gammaQ(al, x / be),
      pdf: x => x <= 0 ? 0 : Math.exp(-x / be + (al - 1) * Math.log(x) - lgamma(al) - al * Math.log(be)),
      qp: al === 1 ? (p => -be * Math.log1p(-p)) : undefined,
      qs: al === 1 ? (q => -be * Math.log(q)) : undefined,
      SL: x => x <= 0 ? al * be - x : al * be * gammaQ(al + 1, x / be) - x * gammaQ(al, x / be),
      sample: r => be * r.gamma(al)
    });
    return D;
  }
  function wald(m, be) {
    const cdf = x => { if (x <= 0) return 0; const r = Math.sqrt(be / x); return Phi(r * (x / m - 1)) + Math.exp(2 * be / m + logPhi(-r * (x / m + 1))); };
    return makeCont({
      fam: 'wald', m, be, mean: m, var: m * m * m / be, lo: 0, cdf, sf: x => 1 - cdf(x),
      pdf: x => x <= 0 ? 0 : Math.sqrt(be / (2 * Math.PI * x * x * x)) * Math.exp(-be * (x - m) * (x - m) / (2 * m * m * x)),
      sample: r => { const nu = r.norm(), y = nu * nu; const x = m + m * m * y / (2 * be) - (m / (2 * be)) * Math.sqrt(4 * m * be * y + m * m * y * y); return r.u() <= m / (m + x) ? x : m * m / x; }
    });
  }
  function betaD(u, v) {
    return makeCont({
      fam: 'beta', u, v, mean: u / (u + v), var: u * v / ((u + v + 1) * (u + v) * (u + v)), lo: 0, hi: 1,
      cdf: x => betaI(x, u, v), sf: x => 1 - betaI(x, u, v),
      pdf: x => (x <= 0 || x >= 1) ? 0 : Math.exp(lgamma(u + v) - lgamma(u) - lgamma(v) + (u - 1) * Math.log(x) + (v - 1) * Math.log(1 - x)),
      sample: r => { const a = r.gamma(u), b = r.gamma(v); return a / (a + b); }
    });
  }
  function uniform(a, b) {
    return makeCont({
      fam: 'uniforme', a, b, mean: (a + b) / 2, var: (b - a) * (b - a) / 12, lo: a, hi: b,
      cdf: x => x <= a ? 0 : x >= b ? 1 : (x - a) / (b - a), sf: x => x <= a ? 1 : x >= b ? 0 : (b - x) / (b - a),
      pdf: x => (x < a || x > b) ? 0 : 1 / (b - a), qp: p => a + p * (b - a), qs: q => b - q * (b - a),
      SL: x => x <= a ? (a + b) / 2 - x : x >= b ? 0 : (b - x) * (b - x) / (2 * (b - a)),
      sample: r => a + (b - a) * r.u()
    });
  }
  function gumbel(mu, be) {
    return makeCont({
      fam: 'gumbel', mu, be, mean: mu + EULER * be, var: be * be * Math.PI * Math.PI / 6,
      cdf: x => Math.exp(-Math.exp(-(x - mu) / be)), sf: x => -Math.expm1(-Math.exp(-(x - mu) / be)),
      pdf: x => { const t = Math.exp(-(x - mu) / be); return t * Math.exp(-t) / be; },
      qp: p => mu - be * Math.log(-Math.log(p)), qs: q => mu - be * Math.log(-Math.log1p(-q)),
      sample: r => mu - be * Math.log(-Math.log(r.u()))
    });
  }
  function frechet(m, s, al) {
    const mean = al > 1 ? m + s * gammaFn(1 - 1 / al) : Infinity;
    const vr = al > 2 ? s * s * (gammaFn(1 - 2 / al) - Math.pow(gammaFn(1 - 1 / al), 2)) : Infinity;
    return makeCont({
      fam: 'frechet', m, s, al, mean, var: vr, lo: m, heavy: true,
      cdf: x => x <= m ? 0 : Math.exp(-Math.pow((x - m) / s, -al)), sf: x => x <= m ? 1 : -Math.expm1(-Math.pow((x - m) / s, -al)),
      pdf: x => { if (x <= m) return 0; const t = (x - m) / s; return al / s * Math.pow(t, -1 - al) * Math.exp(-Math.pow(t, -al)); },
      qp: p => m + s * Math.pow(-Math.log(p), -1 / al), qs: q => m + s * Math.pow(-Math.log1p(-q), -1 / al),
      sample: r => m + s * Math.pow(-Math.log(r.u()), -1 / al)
    });
  }
  function weibull(m, al, be) {
    return makeCont({
      fam: 'weibull', m, al, be, mean: m + be * gammaFn(1 + 1 / al), var: be * be * (gammaFn(1 + 2 / al) - Math.pow(gammaFn(1 + 1 / al), 2)), lo: m,
      cdf: x => x <= m ? 0 : -Math.expm1(-Math.pow((x - m) / be, al)), sf: x => x <= m ? 1 : Math.exp(-Math.pow((x - m) / be, al)),
      pdf: x => { if (x <= m) return 0; const t = (x - m) / be; return al / be * Math.pow(t, al - 1) * Math.exp(-Math.pow(t, al)); },
      qp: p => m + be * Math.pow(-Math.log1p(-p), 1 / al), qs: q => m + be * Math.pow(-Math.log(q), 1 / al),
      sample: r => m + be * Math.pow(-Math.log(r.u()), 1 / al)
    });
  }
  function pareto(al, be) {
    return makeCont({
      fam: 'pareto', al, be, lo: 0, heavy: true,
      mean: al > 1 ? be / (al - 1) : Infinity,
      var: al > 2 ? al * be * be / ((al - 1) * (al - 1) * (al - 2)) : Infinity,
      cdf: x => x <= 0 ? 0 : 1 - Math.pow(be / (x + be), al), sf: x => x <= 0 ? 1 : Math.pow(be / (x + be), al),
      pdf: x => x < 0 ? 0 : al * Math.pow(be, al) / Math.pow(x + be, al + 1),
      qp: p => be * (Math.pow(1 - p, -1 / al) - 1), qs: q => be * (Math.pow(q, -1 / al) - 1),
      SL: x => al > 1 ? (x <= 0 ? be / (al - 1) - x : Math.pow(be, al) * Math.pow(x + be, 1 - al) / (al - 1)) : Infinity,
      sample: r => be * (Math.pow(r.u(), -1 / al) - 1)
    });
  }
  function gpd(xi, eta) {
    if (Math.abs(xi) < 1e-12) return gammaD(1, eta);
    const hi = xi < 0 ? -eta / xi : Infinity;
    return makeCont({
      fam: 'gpd', xi, eta, lo: 0, hi, heavy: xi > 0,
      mean: xi < 1 ? eta / (1 - xi) : Infinity,
      var: xi < 0.5 ? eta * eta / ((1 - xi) * (1 - xi) * (1 - 2 * xi)) : Infinity,
      cdf: x => x <= 0 ? 0 : x >= hi ? 1 : 1 - Math.pow(1 + xi * x / eta, -1 / xi),
      sf: x => x <= 0 ? 1 : x >= hi ? 0 : Math.pow(1 + xi * x / eta, -1 / xi),
      pdf: x => (x < 0 || x > hi) ? 0 : Math.pow(1 + xi * x / eta, -(1 + xi) / xi) / eta,
      qp: p => eta / xi * (Math.pow(1 - p, -xi) - 1), qs: q => eta / xi * (Math.pow(q, -xi) - 1),
      sample: r => eta / xi * (Math.pow(r.u(), -xi) - 1)
    });
  }
  function student(nu, m, s) {
    m = m || 0; s = s || 1;
    const cdf0 = t => { const x = nu / (nu + t * t); const tail = 0.5 * betaI(x, nu / 2, 0.5); return t >= 0 ? 1 - tail : tail; };
    return makeCont({
      fam: 'student', nu, m, s, heavy: true,
      mean: nu > 1 ? m : NaN, var: nu > 2 ? s * s * nu / (nu - 2) : Infinity,
      cdf: x => cdf0((x - m) / s), sf: x => cdf0(-(x - m) / s),
      pdf: x => { const t = (x - m) / s; return Math.exp(lgamma((nu + 1) / 2) - lgamma(nu / 2)) / Math.sqrt(nu * Math.PI) * Math.pow(1 + t * t / nu, -(nu + 1) / 2) / s; },
      qp: nu === 1 ? (p => m + s * Math.tan(Math.PI * (p - 0.5))) : undefined,
      qs: nu === 1 ? (q => m - s * Math.tan(Math.PI * (q - 0.5))) : undefined,
      sample: r => m + s * r.norm() / Math.sqrt(2 * r.gamma(nu / 2) / nu)
    });
  }
  function constant(c) { const D = makeDisc([c], [1]); D.fam = 'constante'; D.sample = () => c; return D; }
  function discreteTable(xs, ps) {
    const D = makeDisc(xs, ps); D.fam = 'discreta';
    const cum = []; let s = 0; for (let i = 0; i < D.n; i++) { s += D.ps[i]; cum.push(s); }
    D.sample = r => { const u = r.u(); for (let i = 0; i < cum.length; i++) if (u <= cum[i]) return D.xs[i]; return D.xs[D.n - 1]; };
    return D;
  }

  /* ───────── Frecuencias (temario T2) ───────── */
  function freqBuild(o) {
    // tabla de probabilidades hasta masa 1-1e-15
    const pm = []; let s = 0;
    for (let x = 0; x < 2000000; x++) { const p = o.pmf(x); pm.push(p); s += p; if (x > o.mean && 1 - s < 1e-15) break; if (o.nmax !== undefined && x >= o.nmax) break; }
    o.table = pm;
    o.cdf = x => { let c = 0; for (let i = 0; i <= Math.floor(x) && i < pm.length; i++) c += pm[i]; return c; };
    o.disc = () => makeDisc(pm.map((_, i) => i), pm);
    return o;
  }
  function poisson(lam) {
    return freqBuild({
      fam: 'poisson', lam, mean: lam, var: lam, ab: { c: 0, d: lam },
      pmf: x => Math.exp(-lam + x * Math.log(lam) - lgamma(x + 1)),
      pgf: s => Math.exp(lam * (s - 1)),
      pgfC: (a, b) => cexp(lam * (a - 1), lam * b),
      sample: r => r.poisson(lam)
    });
  }
  function negbin(al, th) {
    return freqBuild({
      fam: 'binneg', al, th, mean: al * (1 - th) / th, var: al * (1 - th) / (th * th), ab: { c: 1 - th, d: (1 - th) * (al - 1) },
      pmf: x => Math.exp(lgamma(x + al) - lgamma(al) - lgamma(x + 1) + al * Math.log(th) + x * Math.log1p(-th)),
      pgf: s => Math.pow(th / (1 - (1 - th) * s), al),
      pgfC: (a, b) => { const l = clog(1 - (1 - th) * a, -(1 - th) * b); return cexp(al * (Math.log(th) - l[0]), -al * l[1]); },
      sample: r => r.poisson(r.gamma(al) * (1 - th) / th)
    });
  }
  function binomial(n, p) {
    return freqBuild({
      fam: 'binomial', n, p, mean: n * p, var: n * p * (1 - p), nmax: n, ab: { c: -p / (1 - p), d: (n + 1) * p / (1 - p) },
      pmf: x => x > n ? 0 : Math.exp(lgamma(n + 1) - lgamma(x + 1) - lgamma(n - x + 1) + x * Math.log(p) + (n - x) * Math.log1p(-p)),
      pgf: s => Math.pow(1 - p + p * s, n),
      pgfC: (a, b) => { const l = clog(1 - p + p * a, p * b); return cexp(n * l[0], n * l[1]); },
      sample: r => { let k = 0; for (let i = 0; i < n; i++) if (r.u() < p) k++; return k; }
    });
  }

  // Frecuencia dada por una tabla de valores enteros y probabilidades
  function freqTable(vals, probs) {
    const nmax = Math.max(...vals), pm = new Array(nmax + 1).fill(0);
    vals.forEach((x, i) => { if (x < 0 || Math.round(x) !== x) throw new Error('Los valores de N deben ser enteros no negativos.'); pm[x] += probs[i]; });
    const mean = pm.reduce((a, p, k) => a + p * k, 0), m2 = pm.reduce((a, p, k) => a + p * k * k, 0);
    const cum = []; let c = 0; pm.forEach(p => { c += p; cum.push(c); });
    return freqBuild({
      fam: 'tabla', mean, var: m2 - mean * mean, nmax, pmTab: pm,
      pmf: x => (x >= 0 && x <= nmax && Math.round(x) === x) ? pm[x] : 0,
      pgf: s => pm.reduce((a, p, k) => a + p * Math.pow(s, k), 0),
      pgfC: (a, b) => { let zr = 1, zi = 0, rr = 0, ri = 0; for (let k = 0; k <= nmax; k++) { rr += pm[k] * zr; ri += pm[k] * zi; const t = zr * a - zi * b; zi = zr * b + zi * a; zr = t; } return [rr, ri]; },
      sample: r => { const u = r.u(); for (let k = 0; k <= nmax; k++) if (u <= cum[k]) return k; return nmax; }
    });
  }

  /* ───────── Generador aleatorio con semilla (Monte Carlo reproducible) ───────── */
  function rng(seed) {
    let a = (seed >>> 0) || 1;
    let spare = null;
    const R = {
      u() { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); const v = ((t ^ (t >>> 14)) >>> 0) / 4294967296; return v === 0 ? 1e-12 : v; },
      norm() { if (spare !== null) { const s = spare; spare = null; return s; } const u1 = R.u(), u2 = R.u(); const r = Math.sqrt(-2 * Math.log(u1)); spare = r * Math.sin(2 * Math.PI * u2); return r * Math.cos(2 * Math.PI * u2); },
      gamma(al) {
        if (al < 1) return R.gamma(al + 1) * Math.pow(R.u(), 1 / al);
        const d = al - 1 / 3, c = 1 / Math.sqrt(9 * d);
        for (;;) { let x, v; do { x = R.norm(); v = 1 + c * x; } while (v <= 0); v = v * v * v; const u = R.u(); if (u < 1 - 0.0331 * x * x * x * x) return d * v; if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v; }
      },
      poisson(lam) {
        if (lam <= 0) return 0;
        if (lam < 30) { const L = Math.exp(-lam); let k = 0, p = 1; do { k++; p *= R.u(); } while (p > L); return k - 1; }
        const slam = Math.sqrt(lam), loglam = Math.log(lam), b = 0.931 + 2.53 * slam, aa = -0.059 + 0.02483 * b, inva = 1.1239 + 1.1328 / (b - 3.4), vr = 0.9277 - 3.6224 / (b - 2);
        for (;;) {
          const U = R.u() - 0.5, V = R.u(), us = 0.5 - Math.abs(U), k = Math.floor((2 * aa / us + b) * U + lam + 0.43);
          if (us >= 0.07 && V <= vr) return k;
          if (k < 0 || (us < 0.013 && V > us)) continue;
          if (Math.log(V) + Math.log(inva) - Math.log(aa / (us * us) + b) <= -lam + k * loglam - lgamma(k + 1)) return k;
        }
      }
    };
    return R;
  }

  /* ───────── Medidas de riesgo (temario T4) ─────────
     spec: {type, mu, a, mus, ks}. Todas devuelven ρ(−y) para la pérdida y. */
  function wangG(a) { return t => t <= 0 ? 0 : t >= 1 ? 1 : Phi(PhiInv(t) + a); }
  function spectral(D, kern) {
    // ∫_0^1 CVaR_{1-t}(−y) g'(t) dt con t=Φ(s); kern(s) = g'(Φ(s))·φ(s)
    const N = glNodes(ZLO, ZHI, 0.02);
    let r = 0, tw = 0;
    const C = D.CVaRz ? D.CVaRz : (s => D.CVaR(Phi(s)));
    for (let i = 0; i < N.z.length; i++) { const k = kern(N.z[i]); if (k === 0) continue; r += N.w[i] * k * C(N.z[i]); tw += N.w[i] * k; }
    return r;
  }
  function expectile(D, mu) {
    if (Math.abs(mu - 0.5) < 1e-14) return D.mean;
    const c = (1 - 2 * mu) / mu, m = D.mean;
    const g = z => z - m - c * D.SL(z);
    if (mu < 0.5) { const hi = m + c * D.SL(m); return hi <= m ? m : bisect(g, m, hi, 1e-15, 400); }
    return solveIncreasing(g, m, D.sd || 1);
  }
  function risk(D, sp) {
    const t = sp.type;
    if (t === 'VaR') return D.VaR(sp.mu);
    if (t === 'CVaR') return D.CVaR(sp.mu);
    if (t === 'WCVaR') return sp.mus.reduce((acc, m, i) => acc + sp.ks[i] * D.CVaR(m), 0);
    if (t === 'Media') return D.mean;
    if (t === 'Wang') {
      if (D.wang) return D.wang(sp.a);
      if (D.kind === 'cont') return D.kernelInt(z => phi(z - sp.a));
      return D.distortion(wangG(sp.a));
    }
    if (t === 'DPT') {
      const a = sp.a;
      if (D.kind === 'cont') return D.kernelInt(z => a * Math.pow(Phi(z), a - 1) * phi(z));
      return D.distortion(x => 1 - Math.pow(1 - x, a));
    }
    if (t === 'SW') return spectral(D, s => phi(s + sp.a));
    if (t === 'SDPT') return spectral(D, s => sp.a * Math.pow(Phi(-s), sp.a - 1) * phi(s));
    if (t === 'SPow') return spectral(D, s => sp.a * Math.pow(Phi(s), sp.a - 1) * phi(s));
    if (t === 'Expectil') return expectile(D, sp.mu);
    if (t === 'Entropica') return D.entropicClosed ? D.entropicClosed(sp.mu) : D.entropic(sp.mu);
    if (t === 'SigmaE') return D.sd + D.mean;
    throw new Error('Medida desconocida: ' + t);
  }
  // Notación del temario
  function riskName(sp, arg) {
    arg = arg || '−y';
    const pc = mu => fmtPctLevel(1 - mu);
    switch (sp.type) {
      case 'VaR': return `VaR<sub>${pc(sp.mu)}</sub>(${arg})`;
      case 'CVaR': return `CVaR<sub>${pc(sp.mu)}</sub>(${arg})`;
      case 'WCVaR': return sp.mus.map((m, i) => `${fmt(sp.ks[i], 6)}·CVaR<sub>${fmtPctLevel(1 - m)}</sub>(${arg})`).join(' + ');
      case 'Media': return `𝔼(${arg.replace('−', '')})`;
      case 'Wang': return `W<sub>${fmt(sp.a, 6)}</sub>(${arg})`;
      case 'DPT': return `DPT<sub>${fmt(sp.a, 6)}</sub>(${arg})`;
      case 'SW': return `SW<sub>${fmt(sp.a, 6)}</sub>(${arg})`;
      case 'SDPT': return `SDPT<sub>${fmt(sp.a, 6)}</sub>(${arg})`;
      case 'SPow': return `ρ<sub>t^${fmt(sp.a, 6)}</sub>(${arg})`;
      case 'Expectil': return `𝔈<sub>${fmt(sp.mu, 6)}</sub>(${arg})`;
      case 'Entropica': return `ℰ<sub>${fmt(sp.mu, 6)}</sub>(${arg})`;
      case 'SigmaE': return `ρ<sub>σ</sub>(${arg})`;
    }
    return 'ρ(' + arg + ')';
  }
  function comonotoneAdditive(sp) { return ['VaR', 'CVaR', 'WCVaR', 'Wang', 'DPT', 'SW', 'SDPT', 'SPow', 'Media'].includes(sp.type); }
  function translationInvariant(sp) { return sp.type !== 'Media'; }
  // Valor de la medida para la N(0,1): ρ_(0,1)
  function rhoStd(sp) { return risk(normal(0, 1), sp); }

  /* ───────── Transformación por tramos (reaseguro, T5) ─────────
     f(y) = a0·y + Σ a_i (y − U_i)^+ */
  function plEval(tr, x) { let v = tr.a0 * x; for (const l of tr.layers) if (x > l.U) v += l.a * (x - l.U); return v + (tr.c || 0); }
  function plSlopes(tr) {
    const Us = [...new Set(tr.layers.map(l => l.U))].sort((a, b) => a - b);
    const out = []; let s = tr.a0, from = 0;
    const pts = [0, ...Us.filter(u => u > 0)];
    // pendiente en cada tramo [pts[i], pts[i+1])
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      s = tr.a0 + tr.layers.filter(l => l.U <= a).reduce((acc, l) => acc + l.a, 0);
      out.push({ from: a, to: i + 1 < pts.length ? pts[i + 1] : Infinity, slope: s });
    }
    return out;
  }
  function plComplement(tr) { // y − f(y)
    return { a0: 1 - tr.a0, layers: tr.layers.map(l => ({ a: -l.a, U: l.U })), c: -(tr.c || 0) };
  }
  function transformDist(D, tr) {
    const f = x => plEval(tr, x);
    const slopes = plSlopes(tr);
    const nondecr = slopes.every(s => s.slope >= -1e-12) && tr.a0 >= -1e-12;
    // Para continuas con fórmulas cerradas: E, VaR y CVaR exactos por capas
    if (D.kind === 'cont') {
      const g = D.grid();
      const disc = makeDisc(g.x.map(f), Array.from(g.disc.ps));
      const mean = tr.a0 * D.mean + tr.layers.reduce((acc, l) => acc + l.a * (l.U <= 0 ? D.mean - l.U : D.SL(l.U)), 0) + (tr.c || 0);
      const layerCVaR = (mu, U) => { const v = D.VaR(mu), w = Math.max(v, U); return (w - U) + D.SL(w) / mu; };
      const T = Object.assign({}, disc, {
        kind: 'disc', mean,
        VaR: mu => nondecr ? f(D.VaR(mu)) : disc.VaR(mu),
        CVaR: mu => nondecr ? tr.a0 * D.CVaR(mu) + tr.layers.reduce((acc, l) => acc + l.a * (l.U <= 0 ? D.CVaR(mu) - l.U : layerCVaR(mu, l.U)), 0) + (tr.c || 0) : disc.CVaR(mu),
      });
      T.CVaRz = s => T.CVaR(Phi(s));
      T.SL = x => disc.SL(x) + (mean - disc.mean) * 0; // aproximación por malla
      return T;
    }
    return D.map(f);
  }
  // Riesgo de la capa (y−U)^+ para una distribución
  function layerRisk(D, sp, U) {
    if (U <= 0) return risk(D, sp) - U;
    return risk(transformDist(D, { a0: 0, layers: [{ a: 1, U }] }), sp);
  }

  /* ───────── FFT radix-2 (in situ) ───────── */
  function fft(re, im, inverse) {
    const n = re.length;
    for (let i = 1, j = 0; i < n; i++) {
      let bit = n >> 1;
      for (; j & bit; bit >>= 1) j ^= bit;
      j ^= bit;
      if (i < j) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; }
    }
    for (let len = 2; len <= n; len <<= 1) {
      const ang = 2 * Math.PI / len * (inverse ? 1 : -1), wr = Math.cos(ang), wi = Math.sin(ang), half = len >> 1;
      for (let i = 0; i < n; i += len) {
        let cr = 1, ci = 0;
        for (let k = 0; k < half; k++) {
          const ar = re[i + k + half], ai = im[i + k + half];
          const tr = ar * cr - ai * ci, ti = ar * ci + ai * cr;
          re[i + k + half] = re[i + k] - tr; im[i + k + half] = im[i + k] - ti;
          re[i + k] += tr; im[i + k] += ti;
          const ncr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = ncr;
        }
      }
    }
    if (inverse) for (let i = 0; i < n; i++) { re[i] /= n; im[i] /= n; }
  }
  function cexp(a, b) { const e = Math.exp(a); return [e * Math.cos(b), e * Math.sin(b)]; }
  function clog(a, b) { return [Math.log(Math.hypot(a, b)), Math.atan2(b, a)]; }

  /* ───────── Coste agregado: Panjer (T7) y Monte Carlo ───────── */
  function paymentMoments(S, d, L) {
    d = d || 0; L = (L === undefined || L === null) ? Infinity : L;
    const pay = x => Math.min(Math.max(x - d, 0), L);
    if (d === 0 && !isFinite(L)) return { E: S.mean, V: S.var, P0: S.kind === 'disc' ? S.cdf(0) : (S.cdf ? S.cdf(0) : 0) };
    if (S.kind === 'disc') {
      let e = 0, e2 = 0, p0 = 0;
      for (let i = 0; i < S.n; i++) { const p = pay(S.xs[i]); e += S.ps[i] * p; e2 += S.ps[i] * p * p; if (p === 0) p0 += S.ps[i]; }
      return { E: e, V: e2 - e * e, P0: p0 };
    }
    const br = [d]; if (isFinite(L)) br.push(d + L);
    const e = S.expect(pay, br), e2 = S.expect(x => pay(x) * pay(x), br);
    return { E: e, V: e2 - e * e, P0: S.cdf(d) };
  }
  function compound(o) {
    const N = o.freq, S = o.sev, d = o.d || 0;
    const L = (o.L === undefined || o.L === null) ? Infinity : o.L;
    const F = (o.F === undefined || o.F === null) ? Infinity : o.F;
    const pm = paymentMoments(S, d, L);
    const Ey = N.mean * pm.E, Vy = N.mean * pm.V + N.var * pm.E * pm.E;
    const res = { EN: N.mean, VN: N.var, ES: S.mean, VS: S.var, EP: pm.E, VP: pm.V, P0pay: pm.P0, Ey, Vy, sdy: Math.sqrt(Vy) };
    res.Imix = (N.var * pm.E * pm.E) / (N.mean * pm.V);
    // ── Distribución del agregado: severidad discretizada (paso h) y
    //    composición exacta vía FFT (mismo resultado que la recursión de Panjer, ec. 65)
    const LOG2 = o.log2M || 18, MF0 = 1 << LOG2;
    const FP = x => x < 0 ? 0 : (x >= L ? 1 : S.cdf(x + d));
    const SFP = x => x < 0 ? 1 : (x >= L ? 0 : (S.sf ? S.sf(x + d) : 1 - S.cdf(x + d)));
    let cover = Math.max(Ey + 40 * Math.sqrt(Vy), isFinite(L) ? 4 * L : 0, 1e-9);
    if (isFinite(F)) cover = Math.max(cover, 2.2 * F);
    // Severidad discreta en retícula (múltiplos de una unidad u): rejilla exacta con paso u
    let unit = 0;
    if (S.kind === 'disc') {
      const vals = [];
      for (let i = 0; i < S.n; i++) { const pv = Math.min(Math.max(S.xs[i] - d, 0), L); if (pv > 0 && S.ps[i] > 0) vals.push(pv); }
      if (isFinite(F)) vals.push(F);
      const fg = (a, b) => { while (b > 1e-9 * Math.max(a, 1)) { const t = a % b; a = b; b = t; } return a; };
      if (vals.length && vals.every(v => v > 0)) { unit = vals.reduce((a, b) => fg(Math.max(a, b), Math.min(a, b))); if (!(unit > 0) || vals.some(v => Math.abs(v / unit - Math.round(v / unit)) > 1e-7) || Math.max(...vals) / unit > 1e5) unit = 0; }
    }
    let MFv = MF0;
    if (unit) { MFv = 256; while (MFv < 2 * cover / unit && MFv < (1 << 20)) MFv *= 2; }
    let g = null, h = 0, topMass = 1;
    for (let tries = 0; tries < 12; tries++) {
      h = unit || cover / MFv;
      if (!unit && isFinite(L) && L > 0) { const k = Math.ceil(L / h); h = L / k; }
      const MF = MFv;
      const re = new Float64Array(MF), im = new Float64Array(MF);
      re[0] = FP(h / 2);
      for (let j = 1; j < MF; j++) {
        const lo = (j - 0.5) * h, hi = (j + 0.5) * h;
        let v = FP(lo) < 0.5 ? FP(hi) - FP(lo) : SFP(lo) - SFP(hi);
        re[j] = v > 0 ? v : 0;
        if (lo > L || SFP(hi) < 1e-17) break;
      }
      fft(re, im, false);
      for (let k = 0; k < MF; k++) { const z = N.pgfC(re[k], im[k]); re[k] = z[0]; im[k] = z[1]; }
      fft(re, im, true);
      g = re;
      topMass = 0; for (let j = MF >> 1; j < MF; j++) topMass += Math.max(0, g[j]);
      if (topMass < 1e-11) break;
      if (unit) { if (MFv >= (1 << 21)) break; MFv *= 2; } else cover *= 2;
    }
    const MF = MFv;
    res.unit = unit;
    if (unit) { // probabilidades de la severidad en la retícula (para mostrar la recursión de Panjer)
      const fP = []; for (let j = 0; j <= 60; j++) { const lo = (j - 0.5) * h, hi = (j + 0.5) * h; fP.push(j === 0 ? FP(h / 2) : Math.max(0, FP(hi) - FP(lo))); }
      res.fP = fP;
    }
    let tot = 0; const xs = [], ps = [];
    const top = isFinite(F) ? Math.min(MF - 1, Math.ceil(F / h - 1e-9) - 1) : MF - 1;
    let last = top, acc = 0;
    while (last > 0 && acc + Math.max(0, g[last]) < 1e-14) { acc += Math.max(0, g[last]); last--; }
    for (let j = 0; j <= last; j++) { const p = g[j] > 0 ? g[j] : 0; if (j * h >= F) break; xs.push(j * h); ps.push(p); tot += p; }
    if (isFinite(F)) { xs.push(F); ps.push(Math.max(0, 1 - tot)); }
    res.massTail = topMass;
    res.h = h; res.points = xs.length;
    res.dist = makeDisc(xs, ps);
    res.Py0 = Math.max(0, g[0]);
    // Severidad continua sin límites: el cuantil se interpola dentro de cada celda de la rejilla
    if (S.kind === 'cont' && !isFinite(L) && !isFinite(F)) {
      const Dd = res.dist, cdfAt = k => 1 - (k + 1 < Dd.n ? Dd.sf(Dd.xs[k]) : 0);
      Dd.VaR = mu => {
        const p = 1 - mu, x = Dd.q(p);
        const k = Math.round(x / h);
        if (k <= 0) return x;
        const Fk1 = k - 1 >= 0 ? 1 - Dd.sf((k - 1) * h + h / 2) : 0, pk = Dd.ps[k] !== undefined && Math.abs(Dd.xs[k] - k * h) < 1e-9 * h ? Dd.ps[k] : Dd.pAt(k * h);
        if (!(pk > 0)) return x;
        const xi = k * h - h / 2 + h * Math.min(1, Math.max(0, (p - Fk1) / pk));
        return k === 1 && Fk1 <= res.Py0 + 1e-15 ? Math.max(xi, 0) : xi;
      };
      Dd.CVaR = mu => { const v = Dd.VaR(mu); return v + Dd.SL(v) / mu; };
      Dd.CVaRz = z => Dd.CVaR(Phi(z));
    }
    // ── Monte Carlo opcional ──
    if (o.mc) {
      const R = rng(o.mc.seed || 12345), n = o.mc.n || 100000;
      const ys = new Array(n);
      for (let i = 0; i < n; i++) {
        const k = N.sample(R); let y = 0;
        for (let j = 0; j < k; j++) { const sv = S.sample(R); y += Math.min(Math.max(sv - d, 0), L); }
        ys[i] = Math.min(y, F);
      }
      ys.sort((a, b) => a - b);
      res.mcDist = makeDisc(ys, new Array(n).fill(1 / n));
    }
    return res;
  }

  /* ───────── Utilidades de entrada/salida (formato español) ───────── */
  function normNumTok(t) {
    if (t.includes(',')) return t.replace(/\./g, '').replace(',', '.');
    if ((t.match(/\./g) || []).length > 1) return t.replace(/\./g, '');
    if (/^[1-9]\d{0,2}\.\d{3}$/.test(t)) return t.replace('.', '');   // 950.000 → 950000 (notación española)
    return t;
  }
  function parseNum(str) {
    if (str === null || str === undefined) return NaN;
    let s = String(str).trim();
    if (s === '') return NaN;
    s = s.replace(/[−–]/g, '-').replace(/[×·]/g, '*').replace(/\s+/g, '').replace(/∞|inf(inito)?/i, 'Infinity');
    if (s === 'Infinity') return Infinity;
    let pct = false;
    if (s.endsWith('%')) { pct = true; s = s.slice(0, -1); }
    s = s.replace(/\d[\d.,]*(?:[eE][+-]?\d+)?/g, m => {
      const e = m.match(/[eE][+-]?\d+$/); const base = e ? m.slice(0, -e[0].length) : m;
      return normNumTok(base) + (e ? e[0] : '');
    });
    let i = 0;
    const peek = () => s[i];
    function num() { const m = s.slice(i).match(/^\d*\.?\d+(?:[eE][+-]?\d+)?|^\d+\.(?:[eE][+-]?\d+)?/); if (!m) throw 0; i += m[0].length; return parseFloat(m[0]); }
    function factor() {
      const c = peek();
      if (c === '-') { i++; return -factor(); }
      if (c === '+') { i++; return factor(); }
      let v;
      if (c === '(') { i++; v = expr(); if (peek() !== ')') throw 0; i++; }
      else if (s.slice(i, i + 4) === 'sqrt') { i += 4; if (peek() !== '(') throw 0; i++; v = Math.sqrt(expr()); if (peek() !== ')') throw 0; i++; }
      else if (s.slice(i, i + 3) === 'exp') { i += 3; if (peek() !== '(') throw 0; i++; v = Math.exp(expr()); if (peek() !== ')') throw 0; i++; }
      else if (s.slice(i, i + 2) === 'ln') { i += 2; if (peek() !== '(') throw 0; i++; v = Math.log(expr()); if (peek() !== ')') throw 0; i++; }
      else v = num();
      if (peek() === '^') { i++; v = Math.pow(v, factor()); }
      return v;
    }
    function term() { let v = factor(); while (peek() === '*' || peek() === '/') { const op = s[i++]; const w = factor(); v = op === '*' ? v * w : v / w; } return v; }
    function expr() { let v = term(); while (peek() === '+' || peek() === '-') { const op = s[i++]; const w = term(); v = op === '+' ? v + w : v - w; } return v; }
    try { const v = expr(); if (i !== s.length) return NaN; return pct ? v / 100 : v; } catch (e) { return NaN; }
  }
  // Interpreta "0,8y − 0,7(y − 2.450.000)+", "min(y; 3000)", "(y-U)^+", "max(y-U; 0)"
  function parseTreaty(str) {
    const tm = String(str).trim().match(/^tramos?\s*:?(.*)$/i);
    if (tm) { // "tramos: 0:0,2; 425.000:0,6"  (desde : pendiente de y_c)
      const pairs = tm[1].split(/[;|]/).map(t => t.trim()).filter(Boolean).map(t => { const k = t.lastIndexOf(':'); if (k < 0) throw new Error('Formato de tramos: desde:pendiente; desde:pendiente …'); return [parseNum(t.slice(0, k)), parseNum(t.slice(k + 1))]; });
      if (!pairs.length || pairs.some(p => isNaN(p[0]) || isNaN(p[1]))) throw new Error('Tramos no válidos');
      pairs.sort((a, b) => a[0] - b[0]);
      if (pairs[0][0] !== 0) pairs.unshift([0, 0]);
      const tr = { a0: pairs[0][1], layers: [], c: 0 };
      for (let i = 1; i < pairs.length; i++) tr.layers.push({ a: pairs[i][1] - pairs[i - 1][1], U: pairs[i][0] });
      return tr;
    }
    let s = String(str).replace(/[−–]/g, '-').replace(/\s+/g, '').replace(/^[yY]_?[cr]?'*=/, '').replace(/[*·×]/g, '').toLowerCase();
    s = s.replace(/\)\^\+/g, ')+');
    s = s.replace(/\(y-([\d.,]+)\)\+(?=$|[+-])/g, 'L<$1>');
    s = s.replace(/max\(y-([\d.,]+)[;,]0\)/g, 'L<$1>');
    s = s.replace(/min\(y[;,]([\d.,]+)\)/g, 'M<$1>');
    s = s.replace(/min\(([\d.,]+)[;,]y\)/g, 'M<$1>');
    const terms = s.match(/[+-]?[^+-]+/g) || [];
    const tr = { a0: 0, layers: [], c: 0 };
    const coef = t => { if (t === '' || t === '+') return 1; if (t === '-') return -1; const v = parseNum(t); if (isNaN(v)) throw new Error('Coeficiente no válido: ' + t); return v; };
    for (const t of terms) {
      let m;
      if ((m = t.match(/^([+-]?[\d.,/]*)y$/))) { tr.a0 += coef(m[1]); continue; }
      if ((m = t.match(/^([+-]?[\d.,/]*)L<([\d.,]+)>$/))) { tr.layers.push({ a: coef(m[1]), U: parseNum(m[2]) }); continue; }
      if ((m = t.match(/^([+-]?[\d.,/]*)M<([\d.,]+)>$/))) { const k = coef(m[1]); tr.a0 += k; tr.layers.push({ a: -k, U: parseNum(m[2]) }); continue; }
      throw new Error('No entiendo el término «' + t.replace(/L<(.*?)>/, '(y−$1)+').replace(/M<(.*?)>/, 'min(y;$1)') + '». Ejemplos válidos: 0,3y · (y−1.600.000)+ · 0,7(y−U)+ · min(y; U)');
    }
    if (!terms.length) throw new Error('Escribe el tratado, por ejemplo 0,3y + 0,7(y − 1.600.000)+');
    if (tr.layers.some(l => isNaN(l.U))) throw new Error('Prioridad U no válida');
    return tr;
  }
  function treatyToString(tr, v) {
    v = v || 'y';
    const parts = [];
    if (Math.abs(tr.a0) > 1e-15) parts.push({ c: tr.a0, t: v });
    for (const l of tr.layers) if (Math.abs(l.a) > 1e-15) parts.push({ c: l.a, t: `(${v} − ${fmt(l.U)})<sup>+</sup>` });
    if (!parts.length) return '0';
    return parts.map((p, i) => {
      const sg = p.c < 0 ? '−' : (i ? '+' : '');
      const a = Math.abs(p.c);
      return (i ? ' ' + sg + ' ' : sg) + (Math.abs(a - 1) < 1e-15 ? '' : fmt(a, 10)) + p.t;
    }).join('');
  }

  const NF = {};
  function fmt(x, sig) {
    sig = sig || 10;
    if (x === undefined || x === null || isNaN(x)) return '—';
    if (x === Infinity) return '+∞';
    if (x === -Infinity) return '−∞';
    if (x !== 0 && Math.abs(x) < 1e-6) {
      const e = Math.floor(Math.log10(Math.abs(x)));
      return fmt(x / Math.pow(10, e), Math.min(sig, 8)) + '·10<sup>' + String(e).replace('-', '−') + '</sup>';
    }
    if (!NF[sig]) NF[sig] = new Intl.NumberFormat('es-ES', { maximumSignificantDigits: sig });
    return NF[sig].format(x).replace('-', '−');
  }
  function fmtPlain(x, sig) { return fmt(x, sig).replace(/<sup>(.*?)<\/sup>/g, '^$1'); }
  function fmtPct(x, sig) { return isFinite(x) ? fmt(100 * x, sig || 8) + ' %' : '—'; }
  function fmtPctLevel(l) { return fmt(Math.round(l * 1e10) / 1e8, 8) + '%'; }

  return {
    phi, Phi, PhiInv, logPhi, lgamma, gammaFn, gammaP, gammaQ, betaI, bisect, solveIncreasing, glNodes,
    makeDisc, makeCont, normal, lognormal, lognormalMoments, gammaD, wald, betaD, uniform, gumbel, frechet, weibull, pareto, gpd, student, constant, discreteTable,
    poisson, negbin, binomial, freqTable, rng, setProfPi, profPi: () => PROF_PI,
    risk, riskName, rhoStd, expectile, spectral, wangG, comonotoneAdditive, translationInvariant,
    plEval, plSlopes, plComplement, transformDist, layerRisk,
    paymentMoments, compound, fft,
    parseNum, parseTreaty, treatyToString, fmt, fmtPlain, fmtPct, fmtPctLevel, EULER
  };
})();
if (typeof module !== 'undefined') module.exports = TNV;
