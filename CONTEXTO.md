# Contexto acumulado — Calculadora Tarificación no Vida

Objetivo del usuario: **resolver solo los ejercicios prácticos de los exámenes finales** (no ejercicios intermedios ni propuestos). App offline en un único HTML.

## Temario (resumen teórico, 48 págs.)
1 Continuas · 2 Discretas · 3 Compuestas y mixturas · 4 Medidas de riesgo · 5 Reaseguro (págs. 2–17) — **implementados**.
6 Riesgo individual · 7 Riesgo colectivo (Panjer) · 8 Métodos de tarificación (recargos de cartera y póliza, efecto del reaseguro, cartera de valores) · 9 Reaseguro óptimo · 10 Credibilidad (clásica, bayesiana, Bühlmann) · 11 GLM (logit/probit/log) · 12 Regresión de cuantiles · 13 Regresión de expectiles — pendientes.

## Exámenes analizados (13)
Junio 2023–2026, Enero 2014–2020, 2022–2026 (16 convocatorias; 2014–2016 sin soluciones). Estructura habitual:
- Ej. 1: test V/F o «justifique acuerdo» (no se calcula).
- Ej. 2: **cartera de pólizas (tabla nº/coste/desviación/riesgo) → recargos máx./mín. de seguridad y riesgo (T8)**, con medida SWₐ, CVaR, SDPT, expectil…; después reaseguro (T5) y a veces k óptimo (T9) o diversificación de primas en activos (T8.4, Markowitz).
- Ej. 3: frecuencia × severidad (T3/T7): media, σ, CVaR/VaR, prima, IP(pérdida), franquicia, límites, n mínimo.
- Ej. 4: bonus-malus/credibilidad (T10): gamma-Poisson, beta para IP(N=0), grupos con Bayes, Bühlmann.
- Ej. 5 (algunos): regresión logística/cuantílica (T11–12).

## Erratas detectadas en soluciones oficiales
- Junio 2025 Ej. 1: la m oficial (11,5569) no cumple su sistema; la correcta es m = 9,993020806.
- Enero 2019 Ej. 4: (0,78 − 0,739975699)/0,78 = 5,13 %, no 5,41 %.
- Enero 2026 Ej. 2b: la prima usa 𝔼(N) = 2 en lugar de 𝔼(y) = 2000.
- Enero 2023 Ej. 2c: con valores exactos el tratado mixto es algo mejor que el stop-loss puro.
- Valores simulados de referencia: SW₁(N(0,1)) ≈ 1,6036 (exacto 1,5882); SDPT₁ ≈ 0,9062 (exacto 0,9032); CVaR95 N(0,1) en 2019 ≈ 2,0644 (exacto 2,0627).

## Novedades 2014–2016
- Panjer explícito con severidad discreta (2014 Ej. 3), reaseguro por tramos con y normal y VaR70 de la reaseguradora + IP(pérdida de la reaseguradora) (2014/2015 Ej. 5), CVaR(μ) y sensibilidad (2014 Ej. 2a), IP(ganar ≥ ½Π | N ≤ 1) (2016 Ej. 3d).
- El usuario usará la app en ordenador.

## Macros y ejercicios resueltos del profesor (contexto, no son de examen)
- **El profesor usa 2π ≈ 6,28** en φ (macro B «Cálculo de riesgos», C «Stop-loss cedido»): CVaR90 N(0,1) = 1,755428339, CVaR95 = 2,06323586, 𝔼((y−U)⁺) con s/√6,28. La app tiene el interruptor «Usar 2π ≈ 6,28» en la barra lateral.
- Macro A (distribución compuesta): Monte Carlo; BN parametrizada por media y desviación; log-normal por media y desviación; Erlang por media y varianza; VaR = percentil de la muestra ordenada, CVaR = media de la cola con interpolación.
- Muchas cifras oficiales usan ρ(0,1) simulado (SW₁ ≈ 1,603621301; SDPT₁ ≈ 0,906229677; CVaR95 ≈ 2,064381357 en 2019). El tema 8 admite «ρ(0,1) a usar» para reproducirlas exactamente.
- Tema 8 (resueltos I, ej. 1–4): k₂ = 1 − R₀/ρ − (𝔼/ρ)(1+k₁); por póliza k₂ × ρ(−y)/Σρᵢ; con reaseguro se suma (Π_R − ρ(−y_c))/ρ(−y); inversión: B = A⁻¹𝔼(r−r₀)/ρ(0,1), M = 1/√(1−BᵗAB), x = Mσ(y)B/Π, Π* = Π + ρ(R)/(1+r₀). Verificado: Enero 2020 Ej. 2d se reproduce al céntimo con su ρ(0,1).
- Macro I2_ExpectilN01: tabla simulada (100.000 sim.) de nivel CVaR → coeficiente μ → expectil de la N(0,1) con la ec. (48). Los exámenes interpolan ahí: μ = 0,300035142 → 0,337139093 (Enero 2025), μ = 0,299894279 → 0,337404647 (Junio 2026). Exacto: 𝔈₀,₃ = 0,3371198815.
- Macro I «Cálculo del expectil»: expectil por simulación (algoritmo §4.5.2) de y o de un reaseguro Σaᵢ(y−Uᵢ)⁺; distribuciones normal, log-normal, Erlang, Weibull, Pareto.
- Macro L «PELVE»: ν tal que CVaR₁₋μ = VaR₁₋ν para la normal (la app lo da en la calculadora de medidas).
- Macros K1/K2: regresión de cuantiles y de expectiles por programación lineal (símplex) con frecuencias como pesos — temas 12–13. Datos y solución guardados en test/fixtures/macros_profesor.json (K1 al 70 %: betas 1; −0,5; 2,766; alfa ≈ 0).
- Macros D, E, F (riesgo individual, reaseguro, cartera de valores): mismo cálculo que la herramienta del tema 8. k₁ = (ρ − R₀)/𝔼 − 1, k₂ = 1 − R₀/ρ − 𝔼/ρ (negativos → 0); por póliza β = ρ/Σρᵢ sólo si Σρᵢ ≥ ρ («Riesgo no subaditivo»); reparto proporcional al riesgo; con reaseguro se suma (𝔼(y_c)(1+k₁ʳ) − (1−k₂ʳ)ρ(−y_c))/ρ(−y); 𝔼((y−U)⁺) con √6,28; el riesgo cedido de un stop-loss lo pide por teclado (lo simulaba aparte).
- Macro G (Panjer): discretiza la severidad en unidades de 1 con IP(i−0,5 < S ≤ i+0,5), frecuencia Poisson/BN(por media y desviación)/normal, recursión de Panjer hasta masa 0,9999; VaR/CVaR y principios de prima.
- Macro H (inferencia bayesiana, tema 10): Gamma–Poisson (𝔼 post = (α + Σnᵢ)/(1/β + h), peso de la información a priori), Beta–Binomial y caso discreto (Bayes sobre una tabla de tipos k con IP(N|k)). Base para implementar el tema 10.
- Ejercicios propuestos: mismos tipos que los exámenes + algunos teóricos (landa-cuantiles, cotas con expectiles, PELVE log-normal, regresiones).

## Prioridades pendientes (por frecuencia en exámenes)
1. ~~Tema 8 – recargos~~ **hecho** (herramienta t8-recargos, src/t8.js).
2. **Tema 10 – credibilidad**: gamma-Poisson conjugada, beta–IP(N=0), Bühlmann (h, h̃).
3. Tema 8.4 – diversificación de primas en activos (cartera óptima con activo sin riesgo).
4. Temas 11–12 – logit/cuantiles (requieren datos tabulados).

## Estructura del código (src/)
engine.js (numérica, distribuciones, medidas, FFT/Panjer, MC) · ui.js (formularios declarativos, resultados, navegación lateral) · pickers.js (selectores) · tools.js (temas y herramientas + ejemplos de examen) · home.js (inicio e índice de exámenes) · build.py → dist/Calculadora_Tarificacion_No_Vida.html · test/e2e.js (ejecuta todos los ejemplos).
