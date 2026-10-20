# Calculadora de examen · Tarificación no Vida

Aplicación web offline (un único HTML) para resolver los ejercicios prácticos de los exámenes finales de Tarificación no Vida (UC3M).

- **Usar:** abrir `dist/Calculadora_Tarificacion_No_Vida.html` con doble clic. No necesita internet.
- **Regenerar el HTML:** `python3 build.py`
- **Probar todos los ejemplos de examen:** `NODE_PATH=$(npm root -g) node test/e2e.js` (requiere Playwright)
- **Contexto acumulado** (exámenes analizados, erratas, prioridades): ver `CONTEXTO.md`.
