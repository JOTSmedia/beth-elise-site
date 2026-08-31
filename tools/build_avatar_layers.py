#!/usr/bin/env python3
"""Slice the hero fairy avatar into animatable layers.

The source render is a single flat PNG: wings, body and legs are baked into one
image, with a grey halo and ground shadow left over from the background cutout.
That is why the wings never flapped and the "walk" was a static image sliding
across the screen.

This script produces, all on the SAME 1024x1024 canvas so the runtime can draw
them at identical coordinates and only apply rotation:

    avatar_body.png        figure with the wings lifted off, halo/shadow cleaned
    avatar_wing_left.png   left wing, beats about LEFT_WING_PIVOT
    avatar_wing_right.png  right wing, beats about RIGHT_WING_PIVOT

It also applies the complexion grade (see SKIN_GRADE) so the character reads as
Italian / German / Irish heritage while leaving the facial structure untouched.

Run:  python3 tools/build_avatar_layers.py
"""
import json
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
IMAGES = os.path.join(HERE, '..', 'images')
SRC = os.path.join(IMAGES, 'photorealistic_avatar_transparent.png')

# ── geometry, in source-image pixels ────────────────────────────────────────
# The wings are found by COLOUR, not by polygon. Hand-drawn polygons were tried
# first and could not follow the wing edge without either clipping the wing or
# swallowing an arm. The wings are the only large cool-toned translucent mass in
# the upper half, which separates them cleanly from skin, hair and the dress.
WING_BAND = (60, 520)      # y range searched for baked wing pixels
WING_SPLIT_X = 512         # divides the pair into left / right layers
# Each wing hinges on the keep-out edge, so the seam cannot open as it beats.
LEFT_WING_PIVOT = (404, 300)
RIGHT_WING_PIVOT = (652, 300)

# Generous outline of the character WITHOUT her wings. Cool-toned pixels outside
# this shape, within WING_BAND, are erased — those are the baked wings, which
# the runtime replaces with animated ones. Being generous is safe: leftover wing
# near the shoulders is hidden behind the drawn wings and the body itself.
BODY_KEEPOUT = [
    (398, 22), (662, 22), (656, 200), (634, 275), (665, 430), (712, 570),
    (700, 620), (870, 780), (860, 860), (700, 900), (690, 1015),
    (340, 1015), (352, 900), (330, 620), (312, 530), (352, 430),
    (404, 290), (396, 210),
]

# NOTE: splitting the lower legs onto their own layers was tried and abandoned.
# The dress hem overlaps both legs, so any cut either tore a wedge of skirt away
# with the leg or left a visible seam at the knee. At the size this sprite is
# actually drawn (~53px tall) an articulated leg swing buys a couple of pixels
# and is not worth the artefacts, so the walk is driven by body mechanics
# instead — bob, lean, sway and a footfall settle. A properly articulated walk
# needs the character re-rendered in walk poses as a sprite sheet.

# ── complexion grade ────────────────────────────────────────────────────────
# Applied only to detected skin. Lifts and cools the deep tan toward a
# fair-olive Southern/Northern European range, keeps the warm undertone so it
# never turns grey, and leaves eyes, glasses, hair and clothing alone.
# Per-channel gamma rather than a flat lift: gamma raises shadows and midtones
# hard while leaving 255 fixed, so the highlights on her cheekbones and shoulders
# never clip to flat white the way a lift+gain curve did.
#
# Measured on the source render, skin midtone was rgb(149,93,79) — a deep tan with
# a 70-point red/blue spread. This lands it near rgb(205,172,160) with a ~45-point
# spread, which is the fair Southern/Northern-European range being asked for.
SKIN_GRADE = {
    'gamma': (0.58, 0.50, 0.50),   # R, G, B  (lower = lifted further)
    'lift': 18.0,                  # final flat lift, applied after gamma
}
HAIR_GRADE = {'gamma': (0.94, 0.96, 0.98), 'lift': 6.0}


def load():
    im = Image.open(SRC).convert('RGBA')
    return np.array(im).astype(np.float64)


def figure_mask(a):
    """Tight mask of the actual character: solid core + translucent wings.

    Everything else (grey halo, ground shadow, stray sparkle haze) is dropped.
    """
    A = a[..., 3]
    R, G, B = a[..., 0], a[..., 1], a[..., 2]

    core = A >= 250
    lbl, n = ndimage.label(core)
    if n:
        sizes = ndimage.sum(core, lbl, range(1, n + 1))
        core = lbl == (int(np.argmax(sizes)) + 1)

    # wings are cool and translucent, so they never reach the core threshold
    wing = (A > 45) & (B > R + 14) & (B > 85)

    near = ndimage.binary_dilation(core, iterations=14)
    keep = core | (wing & near)
    keep = ndimage.binary_closing(keep, structure=np.ones((5, 5)), iterations=2)
    keep = ndimage.binary_fill_holes(keep)

    # drop specks
    lbl, n = ndimage.label(keep)
    if n:
        sizes = ndimage.sum(keep, lbl, range(1, n + 1))
        for i, s in enumerate(sizes, start=1):
            if s < 400:
                keep[lbl == i] = False
    return keep


def wing_mask(a, keep, size):
    """Isolate the wings that are painted into the source render.

    Everything cool-toned outside BODY_KEEPOUT within WING_BAND is wing: skin,
    hair, glasses and the dress all sit inside the keep-out, so they are never
    at risk. The same mask both lifts the wings onto their own layer and erases
    them from the body, which guarantees the two halves line up exactly.
    """
    outside = poly_mask(size, BODY_KEEPOUT, feather=0) < 0.5
    band = np.zeros(outside.shape, dtype=bool)
    band[WING_BAND[0]:WING_BAND[1], :] = True

    # Everything left outside the keep-out inside the band IS wing — including
    # the dark membrane edges and sparkle haze. An earlier version only took
    # "cool" pixels and left a dark bruise of wing behind each shoulder.
    wing = keep & outside & band
    wing = ndimage.binary_closing(wing, structure=np.ones((7, 7)))

    lbl, n = ndimage.label(wing)
    if n:
        sizes = ndimage.sum(wing, lbl, range(1, n + 1))
        for i, s in enumerate(sizes, start=1):
            if s < 900:
                wing[lbl == i] = False
    return wing


# Everything below the floor line is ground shadow plus the two shoes; nothing
# else of the figure reaches down there. Colour cannot separate the back shoe
# from the shadow (both are dark and cool — measured within a few points of each
# other), so this cuts by height instead and the runtime redraws the legs.
FLOOR_Y = 885
# The shoe tops and the skirt panel that sits between the ankles survive the
# floor cut. They live in a band that the dress train never enters (the train
# stays right of x=730 at these heights), so the band can go wholesale.
ANKLE_BAND = (820, 885, 340, 730)   # y0, y1, x0, x1

# The dress train sweeps out to roughly (830, 860). Left static it dragged behind
# her legs and read as a tail, so it comes off onto its own layer and the runtime
# swings it with a lag behind her stride. The polygon stays clear of the clutch
# and the hand holding it, which sit above y=615.
TRAIN_REGION = [
    (566, 606), (648, 606), (742, 664), (838, 748), (900, 826),
    (918, 902), (846, 928), (742, 866), (652, 786), (588, 700),
]
TRAIN_PIVOT = (596, 620)   # where the train meets the hip

# Bare legs are stripped from below the skirt opening so the runtime can draw
# and animate them. Cutting the photographed legs out and rotating them was
# tried and always tore, because the skirt panels interleave with both legs.
LEG_CUT_Y = 640


def strip_lower_body(a, keep):
    """Remove the ground shadow, the shoes, and the bare legs below the skirt."""
    R, B = a[..., 0], a[..., 2]

    floor = np.zeros_like(keep)
    floor[FLOOR_Y:, :] = True

    below_skirt = np.zeros_like(keep)
    below_skirt[LEG_CUT_Y:, :] = True
    warm_skin = (R > B + 20) & (R > 60)

    ankle = np.zeros_like(keep)
    y0, y1, x0, x1 = ANKLE_BAND
    ankle[y0:y1, x0:x1] = True

    removed = keep & (floor | ankle | (below_skirt & warm_skin))
    removed = ndimage.binary_closing(removed, structure=np.ones((5, 5)))
    keep[removed] = False
    return int(removed.sum())


def skin_mask(a, keep):
    R, G, B, A = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    mx = np.maximum(np.maximum(R, G), B)
    mn = np.minimum(np.minimum(R, G), B)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0)
    m = keep & (A > 200) & (R > 78) & (R > B + 22) & (R >= G - 4) & (G > B - 6)
    m &= (sat > 0.10) & (sat < 0.68) & (mx > 70)
    m = ndimage.binary_opening(m, structure=np.ones((3, 3)))
    m = ndimage.binary_closing(m, structure=np.ones((5, 5)))
    return m


def hair_mask(a, keep, skin):
    """Brown curls: warm like skin but darker and more saturated."""
    R, G, B, A = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    m = keep & (A > 200) & (~skin) & (R > B + 18) & (R > 55) & (R < 205) & (G < 175)
    m = ndimage.binary_opening(m, structure=np.ones((3, 3)))
    return m


def grade(a, mask, cfg, feather=2.0):
    """Apply a colour grade through a feathered mask."""
    soft = np.array(Image.fromarray((mask * 255).astype(np.uint8))
                    .filter(ImageFilter.GaussianBlur(feather))).astype(np.float64) / 255.0
    soft = soft[..., None]

    out = a.copy()
    rgb = a[..., :3].copy()
    lifted = rgb.copy()
    gamma = cfg.get('gamma')
    if gamma:
        norm = np.clip(lifted / 255.0, 0.0, 1.0)
        for ch in range(3):
            norm[..., ch] = np.power(norm[..., ch], gamma[ch])
        lifted = norm * 255.0
    lifted += cfg.get('lift', 0.0)
    lifted = np.clip(lifted, 0, 255)

    out[..., :3] = rgb * (1 - soft) + lifted * soft
    return out


def poly_mask(size, poly, feather=1.2):
    m = Image.new('L', size, 0)
    ImageDraw.Draw(m).polygon(poly, fill=255)
    if feather:
        m = m.filter(ImageFilter.GaussianBlur(feather))
    return np.array(m).astype(np.float64) / 255.0


def to_image(a):
    """Quantise to RGBA8.

    Fully transparent pixels keep their original RGB otherwise, which PNG cannot
    compress away — that alone was costing ~1.3MB per wing layer. Zeroing the
    colour under alpha=0 lets the empty canvas collapse to almost nothing.
    """
    out = np.clip(a, 0, 255).astype(np.uint8)
    out[..., :3][out[..., 3] == 0] = 0
    return Image.fromarray(out)


def main():
    a = load()
    size = (a.shape[1], a.shape[0])

    keep = figure_mask(a)
    lower_px = strip_lower_body(a, keep)
    a[..., 3] *= keep  # halo, ground shadow, shoes and bare legs gone
    print(f'  lower body    : {lower_px:,} px removed (legs are drawn at runtime)')

    sk = skin_mask(a, keep)
    hr = hair_mask(a, keep, sk)
    a = grade(a, sk, SKIN_GRADE, feather=2.2)
    a = grade(a, hr, HAIR_GRADE, feather=2.0)

    print(f'  figure pixels : {int(keep.sum()):,}')
    print(f'  skin pixels   : {int(sk.sum()):,}')
    print(f'  hair pixels   : {int(hr.sum()):,}')
    wing = wing_mask(a, keep, size)
    print(f'  wing pixels   : {int(wing.sum()):,}')

    def soften(m, r=1.1):
        return np.array(Image.fromarray((m * 255).astype(np.uint8))
                        .filter(ImageFilter.GaussianBlur(r))).astype(np.float64) / 255.0

    wl = wing.copy(); wl[:, WING_SPLIT_X:] = False
    wr = wing.copy(); wr[:, :WING_SPLIT_X] = False

    train = poly_mask(size, TRAIN_REGION, feather=1.6)
    print(f'  train pixels  : {int((train > 0.5).sum()):,}')

    parts = {
        'avatar_wing_left.png': soften(wl),
        'avatar_wing_right.png': soften(wr),
        'avatar_train.png': train,
    }

    body = a.copy()
    for name, m in parts.items():
        layer = a.copy()
        layer[..., 3] *= m
        to_image(layer).save(os.path.join(IMAGES, name))
        body[..., 3] *= (1.0 - m)
        print(f'  wrote {name}')

    to_image(body).save(os.path.join(IMAGES, 'avatar_body.png'))
    print('  wrote avatar_body.png')

    meta = {
        'source': os.path.basename(SRC),
        'canvas': [size[0], size[1]],
        'pivots': {
            'wingLeft': LEFT_WING_PIVOT,
            'wingRight': RIGHT_WING_PIVOT,
            'train': TRAIN_PIVOT,
        },
    }
    with open(os.path.join(IMAGES, 'avatar_layers.json'), 'w') as fh:
        json.dump(meta, fh, indent=2)
    print('  wrote avatar_layers.json')


if __name__ == '__main__':
    print('Building avatar layers...')
    main()
