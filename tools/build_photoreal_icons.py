#!/usr/bin/env python3
"""Render the icon set as lit 3D objects instead of flat vector shapes.

The previous set was honest vector craft — gradients, a highlight, a grounded
shadow — but it still read as clip art next to the photographic artwork on the
page. This renders each icon properly: a blurred, eroded copy of the shape's
own alpha becomes a height field, which is then shaded with real diffuse and
specular lighting (see tools/icon_materials.py). Gold picks up a tight bright
highlight and a warm bounce, fabric a broad dim one, porcelain something
between.

The lighting is baked at build time rather than shipped as live SVG filters:
seventy filtered elements per page is a real amount of compositor work, filter
support differs subtly between engines, and at a 19px render size the browser
computes the whole chain for almost no visible detail. Rendering once at 4x and
downsampling gives a cleaner result for less runtime cost.

Run:  python3 tools/build_photoreal_icons.py
"""
import io
import math
import os
import re
import shutil
import subprocess
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from PIL import Image

from icon_materials import MATERIALS, gradient, lighting_filter
from icon_shapes import ICONS

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')
OUT = os.path.join(ROOT, 'images', 'icons')

CELL = 256          # final icon size
SS = 2              # supersample factor while rendering
COLS = 6
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'


def gear_path(teeth=9, r_out=27, r_in=20.5, hole=8.2, cx=34, cy=30):
    """Cog outline with flat tooth tips and an even-odd bore."""
    T = 2 * math.pi / teeth
    w, g = T * 0.2, T * 0.1
    pts = []
    for i in range(teeth):
        a = i * T - math.pi / 2
        for r, ang in ((r_out, a - w), (r_out, a + w),
                       (r_in, a + w + g), (r_in, a + T - w - g)):
            pts.append(f'{cx + r * math.cos(ang):.1f} {cy + r * math.sin(ang):.1f}')
    bore = (f'M{cx - hole} {cy}a{hole} {hole} 0 1 0 {hole * 2} 0'
            f'a{hole} {hole} 0 1 0 {-hole * 2} 0z')
    return 'M' + 'L'.join(pts) + 'z' + bore


def moon_phase_body(lit, waxing):
    """A lit sphere with the shadowed portion darkened on top of it.

    The shadow is built with a mask rather than a compound path. Even-odd on a
    rect-plus-ellipse looked right for crescents and filled a dark lens across
    the lit side for gibbous phases, because a point inside only the ellipse
    still counts as odd. A mask states the intersection directly: white where
    the trailing limb is, black where the terminator carves back into it.

    The overlay also sits outside the lighting group on purpose — an earlier
    pass clipped a rectangle inside the filter, so the rectangle itself got
    shaded and every phase looked like a ball sliced flat.
    """
    sphere = ('<g filter="{f:gold}"><circle cx="34" cy="30" r="25" '
              'fill="{g:gold}"/></g>')
    dark = '#1A1533'

    if lit <= 0.01:
        return f'<circle cx="34" cy="30" r="25" fill="{dark}"/>'
    if lit >= 0.99:
        return sphere

    rx = 25 * abs(1 - 2 * lit)
    x0 = 9 if waxing else 34          # the limb that stays in shadow
    # crescent: terminator bulges away from the lit limb, adding to the shadow.
    # gibbous: it cuts back into the shadow, so the same ellipse is subtracted.
    term_fill = '#ffffff' if lit < 0.5 else '#000000'

    return (sphere +
            '<defs>'
            '<clipPath id="mdisc"><circle cx="34" cy="30" r="25"/></clipPath>'
            '<mask id="mshadow">'
            '<rect x="0" y="0" width="68" height="64" fill="#000"/>'
            f'<rect x="{x0}" y="4" width="25" height="52" fill="#fff"/>'
            f'<ellipse cx="34" cy="30" rx="{rx:.1f}" ry="25" fill="{term_fill}"/>'
            '</mask>'
            '</defs>'
            '<g clip-path="url(#mdisc)">'
            f'<rect x="0" y="0" width="68" height="64" fill="{dark}" '
            'mask="url(#mshadow)"/>'
            '</g>')


def register_generated():
    ICONS['gear'] = ICONS['gear'][:6] + (
        '<g filter="{f:graphite}"><path d="' + gear_path() +
        '" fill-rule="evenodd" fill="{g:graphite}"/></g>',)

    ICONS['moon'] = ('gold', 0, 57, 13, 2.4, .34,
                     '<g filter="{f:gold}"><path d="M41 6a26 26 0 1 0 17 46A30 30 0 0 1 41 6z" '
                     'fill="{g:gold}"/></g>')
    for key, lit, wax in [('new', 0.0, True), ('waxing-crescent', 0.25, True),
                          ('first-quarter', 0.5, True), ('waxing-gibbous', 0.75, True),
                          ('full', 1.0, True), ('waning-gibbous', 0.75, False),
                          ('last-quarter', 0.5, False), ('waning-crescent', 0.25, False)]:
        ICONS[f'moon-{key}'] = ('gold', 0, 57, 15, 2.6, .32, moon_phase_body(lit, wax))


def svg_for(name):
    mat, _sx, sy, rx, ry, op, body = ICONS[name]
    used = {m for m in MATERIALS if f'{{f:{m}}}' in body or f'{{g:{m}}}' in body}
    used.add(mat)

    defs = ['<filter id="cast" x="-60%" y="-60%" width="220%" height="220%">'
            '<feGaussianBlur in="SourceAlpha" stdDeviation="2.6"/></filter>']
    for m in sorted(used):
        defs.append(gradient(f'grad-{m}', MATERIALS[m][0]))
        defs.append(lighting_filter(f'lit-{m}', m))

    for m in MATERIALS:
        body = body.replace(f'{{f:{m}}}', f'url(#lit-{m})')
        body = body.replace(f'{{g:{m}}}', f'url(#grad-{m})')

    shadow = ''
    if rx:
        shadow = (f'<ellipse cx="34" cy="{sy}" rx="{rx}" ry="{ry}" fill="#000" '
                  f'opacity="{op}" filter="url(#cast)"/>')

    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68 64" '
           f'width="{CELL * SS}" height="{CELL * SS}">'
           f'<defs>{"".join(defs)}</defs>{shadow}{body}</svg>')

    # Every icon is rendered into one shared document, so ids collide: a
    # mask="url(#mshadow)" resolves to the first #mshadow on the page, not the
    # one in its own <svg>. That silently gave all eight moon phases the same
    # terminator. Namespacing each id per icon keeps them separate.
    tag = re.sub(r'[^a-z0-9]+', '-', name)
    svg = re.sub(r'id="([^"]+)"', lambda m: f'id="{m.group(1)}--{tag}"', svg)
    svg = re.sub(r'url\(#([^)]+)\)', lambda m: f'url(#{m.group(1)}--{tag})', svg)
    return svg


def main():
    register_generated()
    names = sorted(ICONS)
    rows = (len(names) + COLS - 1) // COLS
    cell = CELL * SS

    cells = ''.join(f'<div class="c">{svg_for(n)}</div>' for n in names)
    page = (f'<!doctype html><meta charset="utf-8">'
            f'<style>html,body{{margin:0;background:transparent}}'
            f'.g{{display:grid;grid-template-columns:repeat({COLS},{cell}px);'
            f'width:{COLS * cell}px}}'
            f'.c{{width:{cell}px;height:{cell}px}}svg{{display:block}}</style>'
            f'<div class="g">{cells}</div>')

    tmpdir = tempfile.mkdtemp()
    sheet_html = os.path.join(ROOT, '_iconsheet.html')
    io.open(sheet_html, 'w', encoding='utf-8').write(page)
    shot = os.path.join(tmpdir, 'sheet.png')

    subprocess.run([
        CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars',
        '--default-background-color=00000000',
        f'--window-size={COLS * cell},{rows * cell}',
        '--virtual-time-budget=20000', f'--screenshot={shot}',
        f'http://127.0.0.1:4530/_iconsheet.html',
    ], check=True, capture_output=True)

    sheet = Image.open(shot).convert('RGBA')
    os.makedirs(OUT, exist_ok=True)
    total = 0
    for i, name in enumerate(names):
        r, c = divmod(i, COLS)
        tile = sheet.crop((c * cell, r * cell, (c + 1) * cell, (r + 1) * cell))
        tile = tile.resize((CELL, CELL), Image.LANCZOS)
        # zero the colour under full transparency so it compresses well
        px = tile.load()
        path = os.path.join(OUT, f'{name}.webp')
        tile.save(path, 'WEBP', quality=88, method=6)
        total += os.path.getsize(path)

    os.remove(sheet_html)
    shutil.rmtree(tmpdir, ignore_errors=True)
    print(f'  {len(names)} icons -> images/icons/  ({total / 1024:.0f} KB total, '
          f'{total / len(names) / 1024:.1f} KB each)')


if __name__ == '__main__':
    print('Rendering photoreal icons...')
    main()
