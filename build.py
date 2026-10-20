#!/usr/bin/env python3
"""Genera un único HTML autocontenido (sin internet) a partir de src/."""
import pathlib

root = pathlib.Path(__file__).parent
src = root / 'src'
order = ['engine.js', 'ui.js', 'pickers.js', 'tools.js', 't8.js', 'home.js']
js = '\n'.join((src / f).read_text(encoding='utf-8') for f in order)
js = js.replace('if (typeof module !== \'undefined\') module.exports = TNV;', '')
css = (src / 'style.css').read_text(encoding='utf-8')
html = (src / 'index.html').read_text(encoding='utf-8')
html = html.replace('/*__CSS__*/', css).replace('/*__JS__*/', js)
out = root / 'dist' / 'Calculadora_Tarificacion_No_Vida.html'
out.parent.mkdir(exist_ok=True)
out.write_text(html, encoding='utf-8')
print(out, f'{len(html) / 1024:.0f} KB')
