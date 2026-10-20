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

## Prioridades pendientes (por frecuencia en exámenes)
1. **Tema 8 – recargos de cartera y por póliza** (aparece en casi todos los Ej. 2): k₂ = 1 − R₀/ρ − 𝔼(1+k₁)/ρ, coeficiente reductor por póliza (p. ej. 0,064890305), recargos máx./mín. por póliza.
2. **Tema 10 – credibilidad**: gamma-Poisson conjugada, beta–IP(N=0), Bühlmann (h, h̃).
3. Tema 8.4 – diversificación de primas en activos (cartera óptima con activo sin riesgo).
4. Temas 11–12 – logit/cuantiles (requieren datos tabulados).

## Estructura del código (src/)
engine.js (numérica, distribuciones, medidas, FFT/Panjer, MC) · ui.js (formularios declarativos, resultados, navegación lateral) · pickers.js (selectores) · tools.js (temas y herramientas + ejemplos de examen) · home.js (inicio e índice de exámenes) · build.py → dist/Calculadora_Tarificacion_No_Vida.html · test/e2e.js (ejecuta todos los ejemplos).
