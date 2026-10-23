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
- Macro M (PELVE de varias medidas): DPT, DPT espectral, Wang y Wang espectral de la N(0,1) por Monte Carlo (con √6,28) y nivel de confianza del VaR equivalente 1 − ν = Φ(ρ(0,1)). La calculadora de medidas muestra ahora esa columna.
- Macros J, N1, N2, N3 (temas 11–12): regresión lineal por mínimos cuadrados ponderada por frecuencias (ortogonaliza los factores; «Jensen Alfa» = término independiente, «Accuracy (%)» = R²), y versiones logística (logit p), logarítmica (log de la media) y probit (Φ⁻¹(p)); además estiman los betas por máxima verosimilitud con búsqueda aleatoria (125.000 simulaciones, paso 0,02). Datos y resultados en test/fixtures/macros_profesor.json (p. ej. J: betas 1,0006; −0,5005; 2,7661, alfa 0,0079).
- Ejercicios propuestos: mismos tipos que los exámenes + algunos teóricos (landa-cuantiles, cotas con expectiles, PELVE log-normal, regresiones).

## Prioridades pendientes (por frecuencia en exámenes)
1. ~~Tema 8 – recargos~~ **hecho** (herramienta t8-recargos, src/t8.js).
2. **Tema 10 – credibilidad**: gamma-Poisson conjugada, beta–IP(N=0), Bühlmann (h, h̃).
3. Tema 8.4 – diversificación de primas en activos (cartera óptima con activo sin riesgo).
4. Temas 11–12 – logit/cuantiles (requieren datos tabulados).

## Estructura del código (src/)
engine.js (numérica, distribuciones, medidas, FFT/Panjer, MC) · ui.js (formularios declarativos, resultados, navegación lateral) · pickers.js (selectores) · tools.js (temas y herramientas + ejemplos de examen) · home.js (inicio e índice de exámenes) · build.py → dist/Calculadora_Tarificacion_No_Vida.html · test/e2e.js (ejecuta todos los ejemplos).

## Revisión T1–T5 (fórmulas utilizadas)
- En la caja de examen, cada párrafo lleva encima (recuadro azul) la fórmula general que usa y debajo la explicación con los números. `R.uses(...)` deja fórmulas pendientes y el siguiente `R.ans(...)` las muestra (diccionario `FORMULAS` en ui.js; `MK(tipo)` da la clave de la medida). Nada de lista final de fórmulas.
- t3-agregado: segunda prima (a₂, b₂), prima de referencia (reducción a posteriori), umbral de Panjer, relación k₁–k₂, modelo de simulación.
- t5-reaseguro: precio por componentes y párrafo de aditividad (Enero 2014/2015 Ej. 5).
- t3-mixtura: párrafo de simulación (Junio 2025 Ej. 4a).
- Ejemplos nuevos o fusionados: E15-2 (Π₁ y Π₂), E14-3 (Panjer hasta 0,3 + PPVE), E23-3c (cartera de las 3 modalidades), posteriores E26/E25 con prima de referencia.

## Parte 1 del temario (temas 1–8) y material de clase (6 oct. 2026)
- Parte 1 = temas 1–8 (el 9, reaseguro óptimo, no entra). En los exámenes cubre **dos** preguntas prácticas: la de cartera/recargos/reaseguro/inversión (T4, T5, T8; Ej. 1 en 2026 y Junio 2025, Ej. 2 antes) y la de frecuencia × severidad (T1–T3, T7; Ej. 2 en 2026, Ej. 3 antes). Lo de credibilidad/bonus-malus (T10) y regresiones (T11–13) es la parte 2.
- Hoja «Octubre_6.xlsm»: cartera 1.000/5.000/10.000 (𝔼 5/8/12, σ 10/12/25, riesgo 100/200/280), CVaR95 con π exacto, cuatro combinaciones de recargos (k₁ máx; 0), (−1; k₂), (0; k₂ máx), (0,005; k₂), primas por póliza con coeficiente reductor ρ/Σρᵢ y «Suma de primas»; cuota-parte con retención 0,6 y coste 1,01·0,4·𝔼; stop-loss con deducible 165.000 (𝔼 y CVaR cedidos simulados). Ejemplos oct6-cp y oct6-sl en t8-recargos (cuadran al céntimo salvo lo simulado).
- Macro «Sub Riesgos_SL»: VaR, CVaR, Wang, SW, DPT, SDPT de (y − U)⁺ con y normal/uniforme/log-normal/Erlang dada por media y desviación (Erlang con α redondeado; la uniforme tiene errata a = 2𝔼 − σ√3). En la app: grupo «Stop-loss» de la calculadora de medidas (ejemplo oct6-sl), modos «media y desviación» de la uniforme y «Erlang (α redondeado)».
- t8-recargos muestra ahora las tablas de las cuatro combinaciones (cartera y cada póliza, con Σ nᵢΠᵢ), sin reaseguro y con reaseguro.

## Navegación por ejercicio práctico (oct. 2026)
- La barra lateral se organiza por prácticos del examen (UI.practico en home.js; `UI.goTool(id, ex)` abre una herramienta dentro de su práctico):
  - Parte 1 · Práctico 1 «Cartera» (T4, T5, T6, T8): t8-recargos, t5-reaseguro, t4-medidas, t5-optimo, t4-normal, t4-param. Ej. 1 en 2026, Ej. 2 antes (Ej. 3 en E15; Ej. 5 extra en E14/E15). No sale en J23.
  - Parte 1 · Práctico 2 «Frecuencia × severidad» (T1, T2, T3, T4, T7): t3-agregado, t1-dist, t2-freq, t1-suma, t2-suma. Ej. 2 en 2026, J23 y E15; Ej. 3 en el resto. Sale siempre.
  - Parte 2 · Práctico 3 «Bonus-malus y credibilidad» (T3 + T10): t3-tipos, t3-mixtura; falta el tema 10. Ej. 4 casi siempre.
  - Parte 2 · Práctico 4 «Regresiones» (T11–13): pendiente.
  - «Consultar por tema» queda plegado al final.
- Cada página de práctico: temas, en qué ejercicio sale, guía plegable «¿Qué herramienta uso para cada apartado?», botones de herramientas y, al final, los exámenes de ese práctico.

## Hojas de clase 20 oct. 2026 (Oct_20_I y Oct_20_II)
- Oct_20_I (tema 8, φ con √6,28): cartera 5.000/2.000/2.000/1.000 (𝔼 5/8/10/20, σ 30/50/70/200, riesgo 200/400/800/1.400), CVaR95. Primas por póliza: proporcional al coste (k₂ = 0), al riesgo (k₁ = −1) y **reparto mixto** 0,75·coste + 0,25·riesgo (campo «Reparto mixto» en t8). k₁ = 15 % ⇒ k₂. Reaseguros CP 30 % (PPVE 10 %), SL (y − 81.000)⁺ con 𝔼 = s/√6,28, mixto 0,2y + 0,6(y − 81.000)⁺, y mercado financiero (2 activos, r₀ = 0): pesos, cartera de mercado A⁻¹𝔼(r)/Σ, importes Π·xᵢ, riesgo y nueva prima. Ejemplos oct20-* en t8 (cuadran al céntimo; el SL exacto requiere «2π ≈ 6,28»).
- t8: con ρ(0,1) indicado y medida comonótona aditiva, ρ(−y_c) = a₀ρ(−y) + Σaᵢρ(−(y−Uᵢ)⁺) usando ese ρ(0,1) en la parte proporcional (así E24 y E25 cuadran exactos).
- Oct_20_II (mixturas, tema 3): severidad mezcla leve/grave (prob., media, desviación) → 𝔼, varianza de medias, media de varianzas, índice; coste agregado con N ∈ {0,1,2}: 𝔼(N)σ²(S) y 𝔼(S)²σ²(N); con severidades correlacionadas r: + rσ²(S)𝔼(N(N−1)). Herramienta nueva t3-momentos (Práctico 2), ejemplo oct20-mix.

## Uso en un examen nuevo (oct. 2026)
- Cada práctico tiene la chuleta plegable «Cómo pasar el enunciado a la calculadora» (frase típica → campo), además de «¿Qué herramienta uso para cada apartado?».
- Los campos que siguen con el valor de ejemplo se marcan en amarillo con un aviso encima de «Resolver» (no si se ha cargado un ejemplo de examen). Un campo vacío da «Falta el dato …».
- Cada párrafo de la respuesta de examen tiene su botón ⧉ para copiar sólo ese apartado.
