"""Batería de enunciados variados (no de examen) para los Prácticos 1, 2 y 3.
Genera casos con otros datos, otras distribuciones y otro nº de datos, los ejecuta en la
calculadora (test/runcases.js) y los compara con cálculos de referencia independientes
(fórmulas cerradas, integración numérica y Monte Carlo propio con numpy).
Uso: python3 test/varied.py [semilla]"""
import json, math, subprocess, sys, os
import numpy as np
from scipy import stats, integrate, optimize
from scipy.special import gamma as G

SEED = int(sys.argv[1]) if len(sys.argv) > 1 else 7
rng = np.random.default_rng(SEED)
ES = lambda x: ('%.10g' % x).replace('.', ',')          # número en formato español para los campos
HERE = os.path.dirname(os.path.abspath(__file__))
cases, refs = [], {}

def add(cid, tool, values, ref):
    cases.append({'id': cid, 'tool': tool, 'values': values}); refs[cid] = ref

# ───────────────────────── Medidas de riesgo de referencia ─────────────────────────
Z = np.linspace(-8.5, 8.5, 340001); PHIZ = stats.norm.pdf(Z); T_TAIL = stats.norm.sf(Z)   # t = IP(cola) = 1 − Φ(z)
def w_of(meas):
    """Pesos w(t) tales que ρ = ∫ Q(1 − t) w(t) dt (t = probabilidad de cola)."""
    typ, par = meas
    t = T_TAIL
    if typ == 'CVaR': return np.where(t < par, 1 / par, 0.0)
    if typ == 'Wang': return np.exp(-par * stats.norm.ppf(t) - par * par / 2)
    if typ == 'DPT': return par * (1 - t) ** (par - 1)
    if typ in ('SW', 'SDPT'):
        # w(t) = ∫_t^1 g′(s)/s ds; con s = Φ(v): ∫_{Φ⁻¹(t)}^{∞} g′(Φ(v)) φ(v)/Φ(v) dv, y Φ⁻¹(t) = −z
        V = Z; ratio = np.exp(stats.norm.logpdf(V) - stats.norm.logcdf(V))
        gpv = np.exp(-par * V - par * par / 2) if typ == 'SW' else par * stats.norm.sf(V) ** (par - 1)
        h = gpv * ratio
        cum = integrate.cumulative_trapezoid(h[::-1], V[::-1], initial=0)[::-1] * -1     # ∫_v^{∞}
        return cum[::-1]                                                                 # evaluado en v = −z
    raise ValueError(typ)
def qz_of(dist):
    """z ↦ cuantil en Φ(z), usando la cola (isf) para z > 0 para no perder precisión."""
    return lambda z: np.where(z < 0, dist.ppf(stats.norm.cdf(np.minimum(z, 0))), dist.isf(stats.norm.sf(np.maximum(z, 0))))
QZ_STD = lambda z: z
def risk_q(qz, meas, f=lambda x: x):
    """Riesgo de f(X) (f no decreciente) con X de cuantil Q(Φ(z)) = qz(z)."""
    typ, par = meas
    if typ == 'VaR': return float(f(qz(np.array(stats.norm.ppf(1 - par)))))
    if typ == 'Expectil':
        xs = f(qz(Z)); w = PHIZ
        E = np.trapezoid(xs * w, Z)
        g = lambda e: e - E - (1 - 2 * par) / par * np.trapezoid(np.maximum(xs - e, 0) * w, Z)
        return optimize.brentq(g, xs.min(), xs.max())
    if typ == 'CVaR':
        z0 = stats.norm.ppf(1 - par)
        val = integrate.quad(lambda z: float(f(qz(np.array(z)))) * stats.norm.pdf(z), z0, 8.3, limit=400, epsabs=0, epsrel=1e-11)[0]
        return val / par
    xs = f(qz(Z))
    return np.trapezoid(xs * w_of(meas) * PHIZ, Z)
def risk_sample(y, meas):
    typ, par = meas
    y = np.sort(y)
    if typ == 'VaR': return np.quantile(y, 1 - par, method='inverted_cdf')
    if typ == 'CVaR': v = np.quantile(y, 1 - par, method='inverted_cdf'); return v + np.mean(np.maximum(y - v, 0)) / par
    raise ValueError
MEAS_UI = {'VaR': ('VaR', 'lvl'), 'CVaR': ('CVaR', 'lvl'), 'Wang': ('Wang', 'a'), 'SW': ('SW', 'a'), 'DPT': ('DPT', 'a'), 'SDPT': ('SDPT', 'a'), 'Expectil': ('Expectil', 'mu')}
def meas_vals(prefix, meas):
    typ, par = meas; nm, fld = MEAS_UI[typ]
    v = {prefix + 'rho': nm}
    v[prefix + fld] = ES(100 * (1 - par)) if fld == 'lvl' else ES(par)
    return v
def rand_meas(allowed):
    typ = allowed[rng.integers(len(allowed))]
    if typ in ('VaR', 'CVaR'): return (typ, float(rng.choice([0.01, 0.025, 0.05, 0.1, 0.2, 0.3])))
    if typ in ('Wang', 'SW'): return (typ, float(rng.choice([0.5, 1, 1.5, 2])))
    if typ in ('DPT', 'SDPT'): return (typ, float(rng.choice([1, 1.5, 2, 3])))
    return ('Expectil', float(rng.choice([0.05, 0.1, 0.2, 0.3, 0.4])))

# ───────────────────────── PRÁCTICO 2: coste agregado ─────────────────────────
def rand_freq():
    k = rng.integers(7)
    if k == 0: lam = round(float(rng.uniform(0.2, 4)), 2); return {'N_fam': 'poisson', 'N_poisson_p_lam': ES(lam)}, ('pois', lam)
    if k == 1: a, th = round(float(rng.uniform(0.5, 4)), 2), round(float(rng.uniform(0.25, 0.8)), 2); return {'N_fam': 'binneg', 'N_binneg_mode': 'p', 'N_binneg_p_a': ES(a), 'N_binneg_p_th': ES(th)}, ('nb', a, th)
    if k == 2: E = round(float(rng.uniform(0.5, 3)), 2); V = round(E * float(rng.uniform(1.3, 4)), 2); th = E / V; return {'N_fam': 'binneg', 'N_binneg_mode': 'mv', 'N_binneg_mv_E': ES(E), 'N_binneg_mv_V': ES(V)}, ('nb', E * th / (1 - th), th)
    if k == 3: a, b = round(float(rng.uniform(0.5, 5)), 2), round(float(rng.uniform(0.1, 1.5)), 2); return {'N_fam': 'binneg', 'N_binneg_mode': 'pg', 'N_binneg_pg_a': ES(a), 'N_binneg_pg_b': ES(b)}, ('nb', a, 1 / (1 + b))
    if k == 4: th = round(float(rng.uniform(0.3, 0.8)), 2); return {'N_fam': 'geometrica', 'N_geometrica_p_th': ES(th)}, ('nb', 1, th)
    if k == 5: n, p = int(rng.integers(1, 8)), round(float(rng.uniform(0.05, 0.6)), 2); return {'N_fam': 'binomial', 'N_binomial_p_n': str(n), 'N_binomial_p_p': ES(p)}, ('bin', n, p)
    m = int(rng.integers(2, 6)); xs = sorted(rng.choice(range(0, 6), m, replace=False).tolist()); ps = rng.dirichlet(np.ones(m)); ps = np.round(ps, 3); ps[-1] = round(1 - ps[:-1].sum(), 3)
    if ps[-1] <= 0: ps = np.ones(m) / m; ps = np.round(ps, 4); ps[-1] = round(1 - ps[:-1].sum(), 4)
    return {'N_fam': 'tabla', 'N_tx': '; '.join(map(str, xs)), 'N_tp': '; '.join(ES(x) for x in ps)}, ('tab', xs, ps.tolist())
def sample_freq(fr, n):
    if fr[0] == 'pois': return rng.poisson(fr[1], n)
    if fr[0] == 'nb': return rng.negative_binomial(fr[1], fr[2], n)
    if fr[0] == 'bin': return rng.binomial(fr[1], fr[2], n)
    return rng.choice(fr[1], n, p=np.array(fr[2]) / np.sum(fr[2]))
def freq_moments(fr):
    if fr[0] == 'pois': return fr[1], fr[1]
    if fr[0] == 'nb': a, th = fr[1], fr[2]; return a * (1 - th) / th, a * (1 - th) / th ** 2
    if fr[0] == 'bin': return fr[1] * fr[2], fr[1] * fr[2] * (1 - fr[2])
    xs, ps = np.array(fr[1]), np.array(fr[2]); E = (xs * ps).sum(); return E, (xs * xs * ps).sum() - E * E
def rand_sev(allow_mix=True):
    k = rng.integers(10 if allow_mix else 9)
    if k == 0: b = round(float(rng.uniform(50, 2000)), 1); return {'S_fam': 'exponencial', 'S_exponencial_p_b': ES(b)}, stats.expon(scale=b)
    if k == 1: a, b = round(float(rng.uniform(0.6, 5)), 2), round(float(rng.uniform(20, 500)), 1); return {'S_fam': 'gamma', 'S_gamma_mode': 'p', 'S_gamma_p_a': ES(a), 'S_gamma_p_b': ES(b)}, stats.gamma(a, scale=b)
    if k == 2: k2, b = int(rng.integers(2, 5)), round(float(rng.uniform(20, 300)), 1); return {'S_fam': 'gamma', 'S_gamma_mode': 'sum', 'S_gamma_sum_k': str(k2), 'S_gamma_sum_b': ES(b)}, stats.gamma(k2, scale=b)
    if k == 3:
        E, cv = round(float(rng.uniform(50, 2000)), 1), float(rng.uniform(0.2, 1.5)); sd = round(E * cv, 1); s2 = math.log(1 + sd * sd / E / E)
        return {'S_fam': 'lognormal', 'S_lognormal_mode': 'mom', 'S_lognormal_mom_E': ES(E), 'S_lognormal_mom_sd': ES(sd)}, stats.lognorm(s=math.sqrt(s2), scale=math.exp(math.log(E) - s2 / 2))
    if k == 4: m, s = round(float(rng.uniform(200, 2000)), 1), None; s = round(m * float(rng.uniform(0.05, 0.25)), 1); return {'S_fam': 'normal', 'S_normal_p_m': ES(m), 'S_normal_p_s': ES(s)}, stats.norm(m, s)
    if k == 5: a, b = round(float(rng.uniform(2.5, 6)), 2), round(float(rng.uniform(100, 2000)), 1); return {'S_fam': 'pareto', 'S_pareto_mode': 'p', 'S_pareto_p_a': ES(a), 'S_pareto_p_b': ES(b)}, stats.lomax(c=a, scale=b)
    if k == 6: a, b = round(float(rng.uniform(0.8, 3)), 2), round(float(rng.uniform(50, 800)), 1); return {'S_fam': 'weibull', 'S_weibull_p_m': '0', 'S_weibull_p_a': ES(a), 'S_weibull_p_b': ES(b)}, stats.weibull_min(c=a, scale=b)
    if k == 7: a = round(float(rng.uniform(0, 200)), 1); b = round(a + float(rng.uniform(50, 1000)), 1); return {'S_fam': 'uniforme', 'S_uniforme_mode': 'p', 'S_uniforme_p_a': ES(a), 'S_uniforme_p_b': ES(b)}, stats.uniform(a, b - a)
    if k == 8:
        m = int(rng.integers(2, 6)); xs = sorted((rng.choice(range(1, 20), m, replace=False) * 50).tolist()); ps = np.round(rng.dirichlet(np.ones(m)), 3); ps[-1] = round(1 - ps[:-1].sum(), 3)
        if ps[-1] <= 0: ps = np.round(np.ones(m) / m, 4); ps[-1] = round(1 - ps[:-1].sum(), 4)
        return {'S_fam': 'discreta', 'S_dx': '; '.join(map(str, xs)), 'S_dp': '; '.join(ES(x) for x in ps)}, stats.rv_discrete(values=(xs, ps))
    # mixtura de 2–3 log-normales / gammas
    m = int(rng.integers(2, 4)); ps = np.round(rng.dirichlet(np.ones(m) * 2), 3); ps[-1] = round(1 - ps[:-1].sum(), 3)
    rows, comps = [], []
    for i in range(m):
        E = round(float(rng.uniform(10, 1000)), 1); sd = round(E * float(rng.uniform(0.3, 1.2)), 1); fam = ['lognormal', 'gamma'][int(rng.integers(2))]
        rows.append({'nom': 'T%d' % (i + 1), 'p': ES(ps[i]), 'fam': fam, 'E': ES(E), 'sd': ES(sd)})
        if fam == 'lognormal': s2 = math.log(1 + sd * sd / E / E); comps.append(stats.lognorm(s=math.sqrt(s2), scale=math.exp(math.log(E) - s2 / 2)))
        else: comps.append(stats.gamma((E / sd) ** 2, scale=sd * sd / E))
    return {'S_fam': 'mixtura', 'S_mx': rows}, ('mix', comps, ps)
def sample_sev(sv, n):
    if isinstance(sv, tuple):
        comps, ps = sv[1], sv[2]; idx = rng.choice(len(comps), n, p=ps / ps.sum()); out = np.empty(n)
        for i, c in enumerate(comps): k = idx == i; out[k] = c.rvs(size=k.sum(), random_state=rng)
        return out
    return sv.rvs(size=n, random_state=rng)
def qexpect(dist, g):
    """𝔼(g(X)) = ∫ g(Q(Φ(z))) φ(z) dz (integración por cuantiles en una malla fina)."""
    if hasattr(dist, 'xk'): return float((np.vectorize(g)(dist.xk) * dist.pk).sum())
    xs = qz_of(dist)(Z); return float(np.trapezoid(g(xs) * PHIZ, Z))
def sev_moments_pay(sv, d, L):
    """𝔼 y 𝔼² del pago por siniestro min((S − d)⁺, L) por integración (o muestreo grande para mixturas)."""
    if isinstance(sv, tuple):
        tot1 = tot2 = 0
        for c, p in zip(sv[1], sv[2]): e1, e2 = sev_moments_pay(c, d, L); tot1 += p * e1; tot2 += p * e2
        return tot1, tot2
    pay = lambda x: np.minimum(np.maximum(x - d, 0), L)
    return qexpect(sv, pay), qexpect(sv, lambda x: pay(x) ** 2)

NMC = 2_000_000
def agg_sample(fr, sv, d=0, L=math.inf, F=math.inf, n=NMC):
    N = sample_freq(fr, n); tot = int(N.sum()); S = sample_sev(sv, tot)
    P = np.minimum(np.maximum(S - d, 0), L)
    y = np.zeros(n); idx = np.repeat(np.arange(n), N); np.add.at(y, idx, P)
    return np.minimum(y, F)

for i in range(26):
    fv, fr = rand_freq(); sv_vals, sv = rand_sev()
    meas = rand_meas(['VaR', 'CVaR'])
    A, B = round(float(rng.uniform(1, 1.3)), 2), round(float(rng.uniform(0, 0.15)), 3)
    vals = dict(fv); vals.update(sv_vals); vals.update(meas_vals('m_', meas)); vals.update({'A': ES(A), 'B': ES(B)})
    d = L = F = Dg = None
    mod = rng.integers(6)
    smean = (sv[1][0].mean() if isinstance(sv, tuple) else sv.mean())
    if isinstance(sv, tuple): smean = sum(c.mean() * p for c, p in zip(sv[1], sv[2]))
    if mod == 1: d = round(smean * float(rng.uniform(0.1, 0.6)), 1); vals['d'] = ES(d)
    if mod == 2: L = round(smean * float(rng.uniform(1, 2.5)), 1); vals['L'] = ES(L)
    if mod == 3: EN, _ = freq_moments(fr); F = round(EN * smean * float(rng.uniform(1.5, 3)), 1); vals['F'] = ES(F)
    if mod == 4: EN, _ = freq_moments(fr); Dg = round(EN * smean * float(rng.uniform(0.3, 1)), 1); vals['Dg'] = ES(Dg)
    vals['extra'] = 'VaR 90; CVaR 90'
    y = agg_sample(fr, sv, d or 0, L if L else math.inf, F if F else math.inf)
    EN, VN = freq_moments(fr); e1, e2 = sev_moments_pay(sv, d or 0, L if L else math.inf)
    ref = {'E': (EN * e1 if F is None else y.mean(), 'exact' if F is None else 'mc'), 'sd': (math.sqrt(EN * (e2 - e1 * e1) + VN * e1 * e1) if F is None else y.std(), 'exact' if F is None else 'mc'),
           'rho': (risk_sample(y, meas), 'mc'), 'x1': (risk_sample(y, ('VaR', 0.1)), 'mc'), 'x2': (risk_sample(y, ('CVaR', 0.1)), 'mc')}
    Pi = A * ref['E'][0] + B * ref['rho'][0]; ref['prima'] = (Pi, 'mc'); ref['ploss'] = (float((y > Pi).mean()), 'prob')
    if Dg is not None:
        z = np.maximum(y - Dg, 0); ref['Ez'] = (z.mean(), 'mc'); ref['sdz'] = (z.std(), 'mc'); ref['rhoz'] = (risk_sample(z, meas), 'mc')
    add('P2-%02d' % i, 't3-agregado', vals, ref)

# t1-dist: momentos, cuantil y exceso exactos
for i in range(10):
    sv_vals, sv = rand_sev(allow_mix=False)
    if sv_vals['S_fam'] == 'discreta': continue
    vals = {k.replace('S_', 'd_'): v for k, v in sv_vals.items()}
    x, p, s = sv.mean() * 1.2, float(rng.choice([0.9, 0.95, 0.99])), sv.mean() * 0.8
    vals.update({'x': ES(x), 'p': ES(p), 's': ES(s)})
    sl = qexpect(sv, lambda t: np.maximum(t - s, 0))
    add('T1-%02d' % i, 't1-dist', vals, {'E': (sv.mean(), 'exact'), 'sd': (sv.std(), 'exact'), 'F': (sv.cdf(x), 'exact'), 'q': (sv.ppf(p), 'exact'), 'sl': (sl, 'exact')})

# t2-freq
for i in range(6):
    fv, fr = rand_freq(); vals = {k.replace('N_', 'f_'): v for k, v in fv.items()}; vals['x'] = '1'
    EN, VN = freq_moments(fr)
    if fr[0] == 'pois': p1 = stats.poisson(fr[1]).pmf(1); p0 = math.exp(-fr[1])
    elif fr[0] == 'nb': p1 = stats.nbinom(fr[1], fr[2]).pmf(1); p0 = stats.nbinom(fr[1], fr[2]).pmf(0)
    elif fr[0] == 'bin': p1 = stats.binom(fr[1], fr[2]).pmf(1); p0 = stats.binom(fr[1], fr[2]).pmf(0)
    else: p1 = sum(p for x, p in zip(fr[1], fr[2]) if x == 1); p0 = sum(p for x, p in zip(fr[1], fr[2]) if x == 0)
    add('T2-%02d' % i, 't2-freq', vals, {'E': (EN, 'exact'), 'V': (VN, 'exact'), 'p0': (p0, 'exact'), 'px': (p1, 'exact')})

# t3-momentos: severidad por tipos y correlación
for i in range(5):
    m = int(rng.integers(2, 5)); ps = np.round(rng.dirichlet(np.ones(m)), 3); ps[-1] = round(1 - ps[:-1].sum(), 3)
    E = np.round(rng.uniform(1, 100, m), 1); sd = np.round(E * rng.uniform(0.2, 2, m), 1)
    fv, fr = rand_freq(); rc = round(float(rng.uniform(0, 0.5)), 2)
    vals = {'sm': 'tipos', 'sev': [{'nom': 'T%d' % j, 'p': ES(ps[j]), 'E': ES(E[j]), 'sd': ES(sd[j])} for j in range(m)], 'rc': ES(rc)}; vals.update(fv)
    ES_ = (ps * E).sum(); Vm = (ps * E * E).sum() - ES_ ** 2; Ev = (ps * sd * sd).sum(); VS = Vm + Ev
    EN, VN = freq_moments(fr); ENN = VN + EN * EN - EN
    add('MOM-%d' % i, 't3-momentos', vals, {'ES': (ES_, 'exact'), 'VS': (VS, 'exact'), 'IS': (Vm / Ev, 'exact'), 'Ey': (EN * ES_, 'exact'), 'Vy': (EN * VS + ES_ ** 2 * VN, 'exact'), 'Vy_r': (EN * VS + rc * VS * ENN + ES_ ** 2 * VN, 'exact')})

# ───────────────────────── PRÁCTICO 1: cartera, recargos, reaseguro, inversión ─────────────────────────
def std_rho(meas):
    return risk_q(QZ_STD, meas)
def normal_layer(m, s, meas, U):
    return risk_q(lambda z: m + s * z, meas, lambda x: np.maximum(x - U, 0))
def normal_SL(m, s, U):
    k = (U - m) / s; return s * stats.norm.pdf(k) + (m - U) * stats.norm.sf(k)
def rand_treaty(m, s):
    k = rng.integers(5)
    U1 = round(m + s * float(rng.uniform(-1, 2)), -2); U2 = round(U1 + s * float(rng.uniform(0.3, 2)), -2)
    if k == 0: a = round(float(rng.uniform(0.1, 0.6)), 2); return '%sy' % ES(a), (a, [])
    if k == 1: return '(y − %s)+' % ES(U1), (0, [(1, U1)])
    if k == 2: a, b = round(float(rng.uniform(0.1, 0.5)), 2), round(float(rng.uniform(0.2, 0.5)), 2); return '%sy + %s(y − %s)+' % (ES(a), ES(b), ES(U1)), (a, [(b, U1)])
    if k == 3: return '(y − %s)+ − (y − %s)+' % (ES(U1), ES(U2)), (0, [(1, U1), (-1, U2)])
    a, b = round(float(rng.uniform(0.6, 0.9)), 2), round(float(rng.uniform(0.2, 0.5)), 2); return '%sy − %s(y − %s)+' % (ES(a), ES(b), ES(U1)), (a, [(-b, U1)])
for i in range(24):
    nr = int(rng.integers(1, 6))
    rows = [{'n': int(rng.integers(5, 50)) * 100, 'E': round(float(rng.uniform(5, 300)), 1)} for _ in range(nr)]
    for r in rows: r['s'] = round(r['E'] * float(rng.uniform(2, 12)), 1); r['r'] = round(r['E'] + r['s'] * float(rng.uniform(1, 4)), 1)
    meas = rand_meas(['VaR', 'CVaR', 'Wang', 'SW', 'DPT', 'SDPT', 'Expectil'])
    if meas[0] == 'DPT' and meas[1] == 1: meas = ('DPT', 2.0)
    m = sum(r['n'] * r['E'] for r in rows); s = math.sqrt(sum(r['n'] * r['s'] ** 2 for r in rows)); sumR = sum(r['n'] * r['r'] for r in rows)
    r01 = std_rho(meas); rho = m + r01 * s
    k1 = round(float(rng.uniform(0, 0.8)) * (rho / m - 1), 4)
    vals = {'src': 'tabla', 'cart': [{'n': str(r['n']), 'E': ES(r['E']), 's': ES(r['s']), 'r': ES(r['r'])} for r in rows], 'R0': '0', 'r01o': '', 'k1': ES(k1)}
    vals.update(meas_vals('m_', meas))
    K = 'exact' if meas[0] in ('VaR', 'CVaR', 'Wang') else 'num'
    ref = {'rho': (rho, K), 'k1max': (rho / m - 1, K), 'k2max': ((rho - m) / rho, K), 'k2g': ((rho - (1 + k1) * m) / rho, K)}
    if sumR >= rho: ref['c'] = (rho / sumR, K)
    if meas[0] != 'Expectil' and rng.random() < 0.7:
        txt, (a0, lay) = rand_treaty(m, s); k1r, k2r = round(float(rng.uniform(0, 0.15)), 3), round(float(rng.uniform(0, 0.1)), 3)
        Eyc = a0 * m + sum(a * normal_SL(m, s, U) for a, U in lay)
        rhoc = a0 * rho + sum(a * normal_layer(m, s, meas, U) for a, U in lay)
        PR = (1 + k1r) * Eyc + k2r * rhoc; Pt = rho + PR - rhoc
        vals.update({'reOn': True, 're': txt, 'reT': 'c', 'k1r': ES(k1r), 'k2r': ES(k2r)})
        ref.update({'Eyc': (Eyc, 'exact'), 'rhoc': (rhoc, 'num'), 'PR': (PR, 'num'), 'primaRe': (Pt, 'num'), 'k1Re': (Pt / m - 1, 'num'), 'k2Re': ((Pt - m) / rho, 'num')})
    else: vals['reOn'] = False
    if meas[0] in ('VaR', 'CVaR', 'Wang', 'SW') and rng.random() < 0.6:
        na = int(rng.integers(1, 4)); mu = np.round(rng.uniform(0.01, 0.09, na), 3); sd = np.round(mu * rng.uniform(1.5, 4, na), 3)
        r0 = round(float(rng.uniform(0, 0.01)), 4); A = np.diag(sd ** 2); corr = []
        for a in range(na):
            for b in range(a + 1, na):
                c = round(float(rng.uniform(-0.3, 0.6)), 2); A[a, b] = A[b, a] = c * sd[a] * sd[b]; corr.append('%d-%d: %s' % (a + 1, b + 1, ES(c)))
        Bv = np.linalg.solve(A, mu - r0) / r01; BAB = Bv @ A @ Bv
        if BAB < 0.95:
            M = 1 / math.sqrt(1 - BAB); x = M * s / rho * Bv; x0 = 1 - x.sum()
            rr = -rho + m + rho * (-r0 * x0 - mu @ x + r01 * math.sqrt(x @ A @ x + (s / rho) ** 2)); Pn = rho + rr / (1 + r0)
            vals.update({'invOn': True, 'r0': ES(r0), 'act': [{'mu': ES(mu[j]), 'sd': ES(sd[j])} for j in range(na)], 'corr': '; '.join(corr)})
            ref.update({'x0': (x0, K), 'x1': (x[0], K), 'rhoR': (rr, 'num'), 'primaInv': (Pn, K)})
        else: vals['invOn'] = False
    else: vals['invOn'] = False
    add('P1-%02d' % i, 't8-recargos', vals, ref)

# t5-reaseguro con y no normal (log-normal o gamma): integración por cuantiles
for i in range(8):
    if rng.random() < 0.5:
        E, sd = round(float(rng.uniform(500, 3000)), 1), None; sd = round(E * float(rng.uniform(0.2, 0.8)), 1); s2 = math.log(1 + sd * sd / E / E); Y = stats.lognorm(s=math.sqrt(s2), scale=math.exp(math.log(E) - s2 / 2))
        yv = {'y_src': 'cont', 'y_c_fam': 'lognormal', 'y_c_lognormal_mode': 'mom', 'y_c_lognormal_mom_E': ES(E), 'y_c_lognormal_mom_sd': ES(sd)}
    else:
        a, b = round(float(rng.uniform(2, 10)), 2), round(float(rng.uniform(50, 400)), 1); Y = stats.gamma(a, scale=b)
        yv = {'y_src': 'cont', 'y_c_fam': 'gamma', 'y_c_gamma_mode': 'p', 'y_c_gamma_p_a': ES(a), 'y_c_gamma_p_b': ES(b)}
    meas = rand_meas(['VaR', 'CVaR', 'Wang', 'SW', 'DPT'])
    if meas[0] == 'DPT' and meas[1] == 1: meas = ('DPT', 2.0)
    m, s = Y.mean(), Y.std(); txt, (a0, lay) = rand_treaty(m, s)
    lay = [(a, max(U, 1.0)) for a, U in lay]; txt = txt  # prioridades positivas
    if any(U <= 1.0 for _, U in lay): continue
    k1r, k2r = round(float(rng.uniform(0, 0.15)), 3), round(float(rng.uniform(0, 0.1)), 3)
    f = lambda x: a0 * x + sum(a * np.maximum(x - U, 0) for a, U in lay)
    rhoY = risk_q(qz_of(Y), meas); Eyc = a0 * m + sum(a * qexpect(Y, lambda t, U=U: np.maximum(t - U, 0)) for a, U in lay)
    rhoc = a0 * rhoY + sum(a * risk_q(qz_of(Y), meas, lambda x, U=U: np.maximum(x - U, 0)) for a, U in lay)
    Pr = (1 + k1r) * Eyc + k2r * rhoc
    vals = dict(yv); vals.update(meas_vals('m_', meas)); vals.update({'R0': '0', 'trs': [{'e': txt, 't': 'c'}], 'k1': ES(k1r), 'k2': ES(k2r)})
    add('R5-%02d' % i, 't5-reaseguro', vals, {'rhoY': (rhoY, 'num'), 'Eyc': (Eyc, 'num'), 'rhoc': (rhoc, 'num'), 'Pr': (Pr, 'num'), 'prima': (rhoY + Pr - rhoc, 'num')})

# t4-medidas sobre distribuciones continuas variadas
for i in range(8):
    sv_vals, sv = rand_sev(allow_mix=False)
    if sv_vals['S_fam'] in ('discreta',): continue
    vals = {k.replace('S_', 'y_c_'): v for k, v in sv_vals.items()}; vals['y_src'] = 'cont'
    ms = [rand_meas(['VaR', 'CVaR', 'Wang', 'SW', 'DPT', 'SDPT', 'Expectil']) for _ in range(3)]
    ms = [x if not (x[0] == 'DPT' and x[1] == 1) else ('DPT', 2.0) for x in ms]
    vals['meds'] = [{'t': x[0], 'p': ES(100 * (1 - x[1])) if x[0] in ('VaR', 'CVaR') else ES(x[1])} for x in ms]
    ref = {'r%d' % (j + 1): (risk_q(qz_of(sv), x), 'num') for j, x in enumerate(ms)}
    add('M4-%02d' % i, 't4-medidas', vals, ref)

# ───────────────────────── PRÁCTICO 3: credibilidad ─────────────────────────
for i in range(10):     # Gamma–Poisson
    a, b = round(float(rng.uniform(0.5, 20)), 2), round(float(rng.uniform(0.02, 3)), 3); h = int(rng.integers(1, 9))
    obs = rng.poisson(a * b * float(rng.uniform(0.3, 2)), h).tolist()
    als, bes = a + sum(obs), b / (1 + h * b); E0, E1 = a * b, als * bes
    tg = round(float(rng.uniform(0.1, 0.7)), 2)
    add('GP-%02d' % i, 't10-cred', {'modo': 'gp', 'ga': ES(a), 'gb': ES(b), 'obs': '; '.join(map(str, obs)), 'tg': ES(tg)},
        {'als': (als, 'exact'), 'bes': (bes, 'exact'), 'E1': (E1, 'exact'), 'red': ((E0 - E1) / E0, 'exact'), 'z': (h * b / (1 + h * b), 'exact'), 'hYears': (math.ceil(tg / (b * (1 - tg)) - 1e-9), 'exact')})
for i in range(4):      # Gamma–Poisson con prima (referencia Monte Carlo)
    a, b = round(float(rng.uniform(1, 6)), 2), round(float(rng.uniform(0.05, 0.5)), 3); h = int(rng.integers(1, 5)); obs = rng.poisson(a * b, h).tolist()
    als, bes = a + sum(obs), b / (1 + h * b); sv_vals, sv = rand_sev(allow_mix=False)
    if sv_vals['S_fam'] in ('pareto',): continue
    meas = rand_meas(['VaR', 'CVaR']); A, B = 1.05, 0.05
    vals = {'modo': 'gp', 'ga': ES(a), 'gb': ES(b), 'obs': '; '.join(map(str, obs)), 'prOn': True, 'fq': 'bn', 'A': '1,05', 'B': '0,05'}; vals.update(sv_vals); vals.update(meas_vals('m_', meas))
    y0 = agg_sample(('nb', a, 1 / (1 + b)), sv); y1 = agg_sample(('nb', als, 1 / (1 + bes)), sv)
    P0 = A * y0.mean() + B * risk_sample(y0, meas); P1 = A * y1.mean() + B * risk_sample(y1, meas)
    add('GPP-%d' % i, 't10-cred', vals, {'primaPri': (P0, 'mc'), 'primaPost': (P1, 'mc')})
for i in range(8):      # Betas para IP(N = n)
    lam = round(float(rng.uniform(0.3, 2)), 2); k = int(rng.integers(0, 4)); v = round(float(rng.uniform(1, 10)), 2); h = int(rng.integers(2, 7))
    obs = rng.poisson(lam, h).tolist(); P = stats.poisson(lam)
    rows = [{'n': str(n), 'u': ES(v * P.pmf(n) / (1 - P.pmf(n))), 'v': ES(v)} for n in range(k + 1)]
    post = [(v * P.pmf(n) / (1 - P.pmf(n)) + obs.count(n)) / (v * P.pmf(n) / (1 - P.pmf(n)) + v + h) for n in range(k + 1)]
    al = (1 - sum(post)) / (1 - sum(P.pmf(n) for n in range(k + 1)))
    E1 = sum(n * post[n] for n in range(k + 1)) + al * (lam - sum(n * P.pmf(n) for n in range(k + 1)))
    add('BE-%02d' % i, 't10-cred', {'modo': 'beta', 'noPri': False, 'N_fam': 'poisson', 'N_poisson_p_lam': ES(lam), 'bt': rows, 'obs': '; '.join(map(str, obs))},
        {'alpha': (al, 'exact'), 'E1': (E1, 'exact'), 'red': ((lam - E1) / lam, 'exact'), 'post0': (post[0], 'exact')})
for i in range(6):      # Bühlmann por momentos
    E, Vm, Ev = round(float(rng.uniform(1, 500)), 2), round(float(rng.uniform(1, 2000)), 2), round(float(rng.uniform(1, 5000)), 2); h = int(rng.integers(1, 8))
    obs = np.round(rng.uniform(0, 2 * E, h), 1).tolist(); ht = Ev / Vm; z = h / (h + ht); Eb = z * np.mean(obs) + (1 - z) * E
    add('BU-%02d' % i, 't10-cred', {'modo': 'buhl', 'bE': ES(E), 'bVm': ES(Vm), 'bEv': ES(Ev), 'obs': '; '.join(ES(x) for x in obs)}, {'ht': (ht, 'exact'), 'z': (z, 'exact'), 'Eb': (Eb, 'exact')})
for i in range(8):      # Grupos: Bayes y Bühlmann (2–4 grupos, 2–5 valores)
    ng, nv = int(rng.integers(2, 5)), int(rng.integers(2, 6)); xs = list(range(nv)); W = np.round(rng.dirichlet(np.ones(ng)), 3); W[-1] = round(1 - W[:-1].sum(), 3)
    PS = []
    for g in range(ng):
        p = np.round(rng.dirichlet(np.ones(nv)), 3); p[-1] = round(1 - p[:-1].sum(), 3)
        if p[-1] < 0: p = np.round(np.ones(nv) / nv, 4); p[-1] = round(1 - p[:-1].sum(), 4)
        PS.append(p)
    h = int(rng.integers(1, 5)); obs = rng.integers(0, nv, h).tolist()
    E = [float((p * np.array(xs)).sum()) for p in PS]; V = [float((p * (np.array(xs) - e) ** 2).sum()) for p, e in zip(PS, E)]
    EE = float((W * E).sum()); Ev = float((W * V).sum()); Ve = float((W * (np.array(E) - EE) ** 2).sum())
    lik = np.array([W[g] * np.prod([PS[g][o] for o in obs]) for g in range(ng)])
    if lik.sum() == 0: continue
    post = lik / lik.sum(); Ep = float((post * E).sum()); z = h / (h + Ev / Ve)
    add('GR-%02d' % i, 't3-tipos', {'vals': '; '.join(map(str, xs)), 'tipos': [{'w': ES(W[g]), 'p': '; '.join(ES(x) for x in PS[g])} for g in range(ng)], 'obs': '; '.join(map(str, obs)), 'buOn': True, 'sevc': '1', 'm_rho': 'CVaR', 'm_lvl': '90', 'A': '1', 'B': '0'},
        {'E': (EE, 'exact'), 'post1': (post[0], 'exact'), 'redE': ((EE - Ep) / EE, 'exact'), 'Eb': (z * np.mean(obs) + (1 - z) * EE, 'exact')})
COND = {'poisson': (lambda L: (L, L)), 'exponencial': (lambda L: (L, L * L))}
for i in range(6):      # Mixturas con parámetro continuo + Bühlmann
    cond = ['poisson', 'exponencial'][int(rng.integers(2))]
    if rng.random() < 0.5: a, b = round(float(rng.uniform(1, 8)), 2), round(float(rng.uniform(0.1, 5)), 2); EL, VL = a * b, a * b * b; lv = {'L_fam': 'gamma', 'L_gamma_mode': 'p', 'L_gamma_p_a': ES(a), 'L_gamma_p_b': ES(b)}
    else: lo = round(float(rng.uniform(0.5, 5)), 2); hi = round(lo + float(rng.uniform(0.5, 10)), 2); EL, VL = (lo + hi) / 2, (hi - lo) ** 2 / 12; lv = {'L_fam': 'uniforme', 'L_uniforme_mode': 'p', 'L_uniforme_p_a': ES(lo), 'L_uniforme_p_b': ES(hi)}
    EL2 = VL + EL * EL; Ev = EL if cond == 'poisson' else EL2; Ve = VL; h = int(rng.integers(1, 8)); xb = round(float(rng.uniform(0, 2 * EL)), 2)
    vals = {'cond': cond, 'bh': str(h), 'bxb': ES(xb)}; vals.update(lv)
    z = h / (h + Ev / Ve)
    add('MX-%02d' % i, 't3-mixtura', vals, {'E': (EL, 'exact'), 'V': (Ev + Ve, 'exact'), 'I': (Ve / Ev, 'exact'), 'Eb': (z * xb + (1 - z) * EL, 'exact')})

# ───────────────────────── Preguntas adicionales de examen ─────────────────────────
# Práctico 2: k mínimo, ganar ≥ f·Π, condicionar a N, cartera de n pólizas, n mínimo, segunda prima, prima de referencia
for i in range(10):
    fv, fr = rand_freq(); sv_vals, sv = rand_sev(allow_mix=False)
    if sv_vals['S_fam'] in ('pareto', 'discreta'): continue
    meas = ('CVaR', float(rng.choice([0.05, 0.1]))); A, B = round(float(rng.uniform(1, 1.2)), 2), round(float(rng.uniform(0.02, 0.1)), 3)
    eps, gf, A2, B2, refP = round(float(rng.uniform(0.05, 0.3)), 2), round(float(rng.uniform(0.2, 0.8)), 2), round(float(rng.uniform(1.05, 1.3)), 2), 0.0, None
    n = int(rng.integers(100, 5000)); epsN = round(float(rng.uniform(0.01, 0.1)), 3)
    vals = dict(fv); vals.update(sv_vals); vals.update(meas_vals('m_', meas)); vals.update({'A': ES(A), 'B': ES(B), 'A2': ES(A2), 'B2': '0', 'eps': ES(eps), 'gfrac': ES(gf), 'ncond': '1', 'n': str(n), 'epsN': ES(epsN)})
    y = agg_sample(fr, sv); EN, VN = freq_moments(fr); e1, e2 = sev_moments_pay(sv, 0, math.inf); E = EN * e1; sd = math.sqrt(EN * (e2 - e1 * e1) + VN * e1 * e1)
    rho = risk_sample(y, meas); Pi = A * E + B * rho
    refP = round(Pi * float(rng.uniform(0.8, 1.2)), 2); vals['refP'] = ES(refP)
    r01 = std_rho(meas); mN, sN = n * E, math.sqrt(n) * sd
    ref = {'prima2': (A2 * E, 'exact'), 'ploss2': (float((y > A2 * E).mean()), 'prob'), 'red': ((refP - Pi) / refP, 'mc'),
           'kmin': ((np.quantile(y, 1 - eps) - B * rho) / E - 1, 'mc'), 'pgan': (float((y <= (1 - gf) * Pi).mean()), 'prob'),
           'rhoCart': (mN + r01 * sN, 'mc'), 'plossCart': (float(stats.norm.sf((n * Pi - mN) / sN)), 'prob')}
    if Pi > E:
        ref['nP'] = (math.ceil((sd * stats.norm.ppf(1 - epsN) / (Pi - E)) ** 2 - 1e-9), 'mc'); ref['nR'] = (math.ceil((sd * r01 / (Pi - E)) ** 2 - 1e-9), 'mc')
    # IP(y ≤ (1 − f)Π | N = 1) = F_S((1 − f)Π)
    ref['pcond'] = (float(sv.cdf((1 - gf) * Pi)), 'prob')
    add('P2X-%02d' % i, 't3-agregado', vals, ref)
# Práctico 1: reservas, normal dada, riesgo retenido, tramos, reaseguradora con otra medida
for i in range(8):
    m, s = round(float(rng.uniform(1e5, 5e6)), 0), None; s = round(m * float(rng.uniform(0.02, 0.2)), 0); R0 = round(float(rng.uniform(0, 0.05)) * m, 0)
    meas = rand_meas(['VaR', 'CVaR', 'Wang']); r01 = std_rho(meas); rho = m + r01 * s; P0 = rho - R0
    vals = {'src': 'normal', 'm': ES(m), 's': ES(s), 'sumR': '', 'R0': ES(R0), 'r01o': '', 'k1': ''}; vals.update(meas_vals('m_', meas))
    ref = {'rho': (rho, 'exact'), 'prima': (P0, 'exact'), 'k1max': (P0 / m - 1, 'exact'), 'k2max': ((P0 - m) / rho, 'exact')}
    kind = rng.integers(3); k1r, k2r = round(float(rng.uniform(0, 0.1)), 3), round(float(rng.uniform(0, 0.1)), 3)
    if kind == 0:   # el enunciado da el retenido y_r = a·y − b(y − U)⁺
        a, b = round(float(rng.uniform(0.5, 0.9)), 2), round(float(rng.uniform(0.2, 0.5)), 2); U = round(m + s * float(rng.uniform(-0.5, 1.5)), -2)
        txt = '%sy − %s(y − %s)+' % (ES(a), ES(b), ES(U)); a0, lay = 1 - a, [(b, U)]; vals.update({'reOn': True, 're': txt, 'reT': 'r'})
    elif kind == 1: # tramos de pendiente
        U = round(m + s * float(rng.uniform(-0.5, 1.5)), -2); p1, p2 = round(float(rng.uniform(0.1, 0.4)), 2), round(float(rng.uniform(0.4, 0.8)), 2)
        txt = 'tramos: 0:%s; %s:%s' % (ES(p1), ES(U), ES(p2)); a0, lay = p1, [(p2 - p1, U)]; vals.update({'reOn': True, 're': txt, 'reT': 'c'})
    else:           # reaseguradora con VaR mientras la cedente usa otra medida
        U = round(m + s * float(rng.uniform(-0.5, 1.5)), -2); a = round(float(rng.uniform(0.3, 0.8)), 2)
        txt = '%sy − %s(y − %s)+' % (ES(a), ES(round(a / 2, 2)), ES(U)); a0, lay = a, [(-round(a / 2, 2), U)]; vals.update({'reOn': True, 're': txt, 'reT': 'c', 'mrOn': True, 'mr_rho': 'VaR', 'mr_lvl': '95'})
    vals.update({'k1r': ES(k1r), 'k2r': ES(k2r), 'invOn': False})
    Eyc = a0 * m + sum(a * normal_SL(m, s, U) for a, U in lay); rhoc = a0 * rho + sum(a * normal_layer(m, s, meas, U) for a, U in lay)
    rhocR = rhoc
    if kind == 2: rhocR = risk_q(lambda z: m + s * z, ('VaR', 0.05), lambda x: a0 * x + sum(aa * np.maximum(x - U, 0) for aa, U in lay))
    PR = (1 + k1r) * Eyc + k2r * rhocR; Pt = P0 + PR - rhoc
    ref.update({'Eyc': (Eyc, 'exact'), 'rhoc': (rhoc, 'num'), 'PR': (PR, 'num'), 'primaRe': (Pt, 'num')})
    add('P1X-%02d' % i, 't8-recargos', vals, ref)
# Práctico 3: beta para IP(N ≤ k), clásica, mixtura con σ(y) simulada y años para un descuento
for i in range(4):
    lam = round(float(rng.uniform(0.5, 1.5)), 2); k = int(rng.integers(1, 4)); v = round(float(rng.uniform(1, 5)), 2); h = int(rng.integers(3, 7)); obs = rng.poisson(lam, h).tolist(); P = stats.poisson(lam)
    rows = [{'n': str(n), 'u': ES(v * P.pmf(n) / (1 - P.pmf(n))), 'v': ES(v)} for n in range(k + 1)]
    post = [(v * P.pmf(n) / (1 - P.pmf(n)) + obs.count(n)) / (v * P.pmf(n) / (1 - P.pmf(n)) + v + h) for n in range(k + 1)]
    p, ps, w = sum(P.pmf(n) for n in range(k + 1)), sum(post), sum(1 for o in obs if o <= k)
    if abs(ps - p) < 1e-9: continue
    vg = (w - ps * h) * (1 - p) / (ps - p); ug = p * vg / (1 - p); snk = sum(n * P.pmf(n) for n in range(k + 1)); Eg = ps / p * snk + (1 - ps) / (1 - p) * (lam - snk)
    add('BG-%d' % i, 't10-cred', {'modo': 'beta', 'noPri': False, 'N_fam': 'poisson', 'N_poisson_p_lam': ES(lam), 'bt': rows, 'obs': '; '.join(map(str, obs)), 'grp': True}, {'uG': (ug, 'exact'), 'vG': (vg, 'exact'), 'Eg': (Eg, 'exact')})
for i in range(3):
    m, s, th, be, h, xb = round(float(rng.uniform(1, 100)), 2), None, 0.05, 0.9, int(rng.integers(10, 2000)), None; s = round(m * float(rng.uniform(0.5, 3)), 2); xb = round(m * float(rng.uniform(0.6, 1.4)), 2)
    z = min(1, (m / s) * th * math.sqrt(h) / stats.norm.ppf((1 + be) / 2))
    add('CL-%d' % i, 't10-cred', {'modo': 'clas', 'cm': ES(m), 'cs': ES(s), 'cth': '0,05', 'cbe': '0,9', 'hN': str(h), 'mN': ES(xb)}, {'z': (z, 'exact'), 'va': (z * (xb - m) / m, 'exact')})
for i in range(3):
    mL, sL = round(float(rng.uniform(50, 200)), 1), None; sL = round(mL * float(rng.uniform(0.05, 0.2)), 1); sdy = round(math.sqrt(mL ** 2 + sL ** 2 + mL ** 2 + sL ** 2) * float(rng.uniform(0.98, 1.02)), 2); tg = round(float(rng.uniform(0.1, 0.4)), 2)
    Ve = sL ** 2; Ev2 = sdy ** 2 - Ve
    add('MXS-%d' % i, 't3-mixtura', {'cond': 'exponencial', 'L_fam': 'normal', 'L_normal_p_m': ES(mL), 'L_normal_p_s': ES(sL), 'sdy': ES(sdy), 'bh': '10', 'bxb': '0', 'btg': ES(tg)},
        {'I2': (Ve / Ev2, 'exact'), 'Eb': (mL * (1 - 10 / (10 + Ev2 / Ve)), 'exact'), 'hTarget': (Ev2 / Ve * tg / (1 - tg), 'exact')})

# ───────────────────────── Ejecutar y comparar ─────────────────────────
import tempfile
_td = tempfile.mkdtemp(prefix='tnv_')
inp, outp = os.path.join(_td, 'vcases.json'), os.path.join(_td, 'vout.json')
json.dump(cases, open(inp, 'w'))
env = dict(os.environ, NODE_PATH=subprocess.check_output(['npm', 'root', '-g']).decode().strip())
subprocess.run(['node', os.path.join(HERE, 'runcases.js'), inp, outp], check=True, env=env, timeout=3000)
res = json.load(open(outp))
TOL = {'exact': 2e-6, 'num': 2e-4, 'mc': 0.02, 'prob': 0.006}
bad = n = 0
for r in res['out']:
    ref = refs[r['id']]
    if 'err' in r: print('ERROR', r['id'], r['err']); bad += 1; continue
    if r.get('loose') or r.get('nan'): print('AVISO', r['id'], 'fórmulas sueltas' if r.get('loose') else 'NaN/undefined en la respuesta'); bad += 1
    for k, (v, kind) in ref.items():
        n += 1; got = r['keys'].get(k)
        if got is None: print('FALTA', r['id'], k); bad += 1; continue
        tol = TOL[kind]
        ok = abs(got - v) <= tol if kind == 'prob' else abs(got - v) <= tol * max(1e-9, abs(v)) + (1e-9 if kind != 'mc' else 1e-6 * (1 + abs(v)))
        if kind == 'mc' and not ok and abs(v) < 1e-6: ok = abs(got) < 1e-3
        if not ok: print('DIF  ', r['id'], k, 'app', got, 'ref', v, '(%s)' % kind); bad += 1
print('Casos: %d · comprobaciones: %d · discrepancias: %d · errores JS: %s' % (len(res['out']), n, bad, res['errs'] or 'ninguno'))
