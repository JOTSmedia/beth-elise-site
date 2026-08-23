"""Material definitions for the rendered icon set.

Each material is a base gradient plus a lighting rig. The rig is what makes the
difference: a blurred, eroded copy of the shape's own alpha becomes a height
field, `feDiffuseLighting` shades it from a key light, and `feSpecularLighting`
adds a highlight from a point light. The result is hard-clipped back to the
original alpha so the silhouette stays crisp — without that final clip the
bevel smears past the edge and everything looks like a smudge.

`bevel` is how far the surface rolls off before the edge, `spec` how tight and
bright the highlight is. Metal gets a tight, bright highlight; fabric gets a
broad dim one; porcelain sits between.
"""

# name -> (gradient stops, bevel radius, blur, specular constant, exponent,
#          specular colour, light x, light y, light z)
MATERIALS = {
    'gold': (
        [(0, '#FFF3BE'), (26, '#EFC050'), (50, '#B8811C'),
         (70, '#8C5D0E'), (86, '#DDAA40'), (100, '#FFEDB4')],
        0.7, 1.7, 1.25, 34, '#FFFCEC', 18, 4, 30),

    'violet': (
        [(0, '#F3DEFF'), (28, '#C98BF5'), (56, '#7A32C4'),
         (78, '#4A177E'), (92, '#6C2BA8'), (100, '#A968E0')],
        0.7, 1.7, 1.1, 30, '#FFF4FF', 18, 4, 30),

    'teal': (
        [(0, '#DFFFFA'), (26, '#7CEDE0'), (54, '#16B4A4'),
         (76, '#0A7268'), (92, '#12A090'), (100, '#63E3D4')],
        0.7, 1.7, 1.2, 34, '#F0FFFD', 18, 4, 30),

    'porcelain': (
        [(0, '#FFFFFF'), (30, '#F4EFFA'), (58, '#D3C7E6'),
         (80, '#A899C4'), (100, '#E4DCF2')],
        0.8, 1.9, 0.9, 26, '#FFFFFF', 20, 5, 32),

    'skin': (
        [(0, '#FFE7D2'), (30, '#F6C9A6'), (58, '#D89B72'),
         (80, '#A96C46'), (100, '#E8B189')],
        0.9, 2.1, 0.55, 18, '#FFF3E6', 20, 6, 34),

    'fabric': (
        [(0, '#E8CCFF'), (30, '#C795F0'), (58, '#8B45CE'),
         (80, '#5A2090'), (100, '#9A5CD6')],
        1.1, 2.6, 0.42, 12, '#FFF0FF', 22, 8, 40),

    'paper': (
        [(0, '#FFFFFF'), (34, '#FBF6EC'), (62, '#E8DCC6'),
         (84, '#C7B396'), (100, '#F2E9D8')],
        0.7, 1.8, 0.5, 16, '#FFFFFF', 20, 6, 34),

    'foliage': (
        [(0, '#D8FFE4'), (26, '#7FE49B'), (54, '#28A85E'),
         (78, '#12643A'), (100, '#5CCB84')],
        0.8, 1.9, 0.8, 24, '#F2FFF6', 20, 5, 32),

    'rose': (
        [(0, '#FFEAF3'), (28, '#F9A8CB'), (56, '#DE4E8E'),
         (80, '#93215A'), (100, '#EC7BAB')],
        0.8, 1.9, 0.85, 24, '#FFF2F8', 20, 5, 32),

    'stone': (
        [(0, '#E2E8F7'), (28, '#A9B6D6'), (56, '#5C6B93'),
         (80, '#2E3856'), (100, '#7C8CB4')],
        0.9, 2.0, 0.7, 22, '#F4F7FF', 20, 5, 32),

    'sand': (
        [(0, '#FFF0CE'), (30, '#F2D398'), (58, '#D0A25C'),
         (82, '#9C6F2E'), (100, '#E8C68A')],
        0.9, 2.1, 0.5, 16, '#FFF8E8', 20, 6, 34),

    'spectral': (
        [(0, '#FFFFFF'), (34, '#F0EBFF'), (64, '#CFC2EE'),
         (86, '#A796D2'), (100, '#E6DEF8')],
        1.0, 2.3, 0.6, 20, '#FFFFFF', 20, 6, 36),

    'glass': (
        [(0, '#FFFFFF'), (24, '#CFF6FF'), (50, '#6FC8E8'),
         (74, '#2A6E9C'), (92, '#4E9CC4'), (100, '#BFEBFB')],
        0.6, 1.5, 1.5, 46, '#FFFFFF', 16, 3, 26),

    'graphite': (
        [(0, '#B9C2D8'), (28, '#6E7994'), (56, '#3A4256'),
         (80, '#1B2030'), (100, '#5A6480')],
        0.8, 1.9, 1.0, 30, '#EAF0FF', 18, 4, 30),
}


def gradient(gid, stops, x1='0.22', y1='0', x2='0.78', y2='1'):
    body = ''.join(f'<stop offset="{o}%" stop-color="{c}"/>' for o, c in stops)
    return (f'<linearGradient id="{gid}" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}">'
            f'{body}</linearGradient>')


def lighting_filter(fid, mat):
    _, bevel, blur, spec_k, spec_n, spec_col, lx, ly, lz = MATERIALS[mat]
    return f'''<filter id="{fid}" x="-25%" y="-25%" width="150%" height="150%">
  <feMorphology in="SourceAlpha" operator="erode" radius="{bevel}" result="core"/>
  <feGaussianBlur in="core" stdDeviation="{blur}" result="h"/>
  <feDiffuseLighting in="h" lighting-color="#ffffff" surfaceScale="3.2"
                     diffuseConstant="1.0" result="d">
    <feDistantLight azimuth="230" elevation="60"/>
  </feDiffuseLighting>
  <feBlend in="SourceGraphic" in2="d" mode="multiply" result="lit"/>
  <feSpecularLighting in="h" lighting-color="{spec_col}" surfaceScale="3.2"
                      specularConstant="{spec_k}" specularExponent="{spec_n}" result="s">
    <fePointLight x="{lx}" y="{ly}" z="{lz}"/>
  </feSpecularLighting>
  <feComposite in="s" in2="SourceAlpha" operator="in" result="sc"/>
  <feComposite in="sc" in2="lit" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="full"/>
  <feComposite in="full" in2="SourceAlpha" operator="in"/>
</filter>'''
