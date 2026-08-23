#!/usr/bin/env python3
"""Generate WebP versions of every image the site actually serves.

The homepage was shipping 13.7 MB, 12.9 MB of it images. The dimensions were
never the main problem — most sources are 1024px — the problem was quality:
1024x1024 JPEGs saved at ~900 KB each, and RGBA PNGs at 1.5-2 MB. A few are
also wildly oversized for their slot (logo.png is 1264x848 and renders at
54x36 in the nav, 11.8x more pixels than a 2x display can use).

This writes `<name>.webp` next to each source. The originals stay put: two of
them are build inputs for the avatar and icon pipelines, and they are the
masters if anything needs regenerating at a different size.

Caps are the longest side, chosen as roughly 2x the largest place each image
renders. Canvas artwork keeps its native size and a higher quality, since it
is composited and scaled at runtime rather than shown at a fixed box.

Run:  python3 tools/optimize_images.py
"""
import glob
import os

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
IMAGES = os.path.join(HERE, '..', 'images')

# (filename prefix, longest-side cap, quality)
RULES = [
    # full-bleed section backgrounds
    ('hero-bg',        1600, 78),
    ('footer-bg',      1600, 78),
    ('services-bg',    1600, 78),
    ('notes-by-beth',  1600, 80),
    # the interactive chakra poster is pinned by height and zoomed into
    ('chakra-',        1264, 82),
    # product shots render at ~350px
    ('merch-',          800, 80),
    ('portrait',        800, 82),
    # wordmark; largest use is the 220px footer lockup
    ('logo',            640, 86),
    # artwork drawn into <canvas> and scaled at runtime
    ('avatar_',        1024, 90),
    ('photorealistic', 1024, 90),
    ('crystal',        1024, 90),
    ('icon-',           256, 90),
]
DEFAULT = (1200, 82)

# Masters consumed by the other build scripts and never served to a browser.
# Generating WebP for these produced ~700 KB of files nothing ever requests.
BUILD_ONLY = {
    'crystal_ball_transparent.png',        # -> icon-orb, by build_icons.py
    'photorealistic_avatar_transparent.png',  # -> avatar layers, by build_avatar_layers.py
}


def rule_for(name):
    for prefix, cap, q in RULES:
        if name.startswith(prefix):
            return cap, q
    return DEFAULT


def main():
    sources = sorted(
        p for p in glob.glob(os.path.join(IMAGES, '*'))
        if p.lower().endswith(('.png', '.jpg', '.jpeg'))
    )
    before = after = 0
    converted = 0
    skipped = []
    for src in sources:
        name = os.path.basename(src)
        if name in BUILD_ONLY:
            continue
        cap, quality = rule_for(name)
        im = Image.open(src)

        if max(im.size) > cap:
            scale = cap / max(im.size)
            im = im.resize((round(im.width * scale), round(im.height * scale)),
                           Image.LANCZOS)

        # WebP carries alpha, so transparent sources stay transparent
        im = im.convert('RGBA' if im.mode in ('RGBA', 'LA', 'P') else 'RGB')

        out = os.path.splitext(src)[0] + '.webp'
        im.save(out, 'WEBP', quality=quality, method=6)

        src_kb, out_kb = os.path.getsize(src) / 1024, os.path.getsize(out) / 1024
        # A couple of sources are already small and well-compressed; re-encoding
        # them comes out bigger. Drop those so the site never serves the worse
        # of the two files, and leave the reference pointing at the original.
        if out_kb >= src_kb:
            os.remove(out)
            print(f'  {src_kb:7.0f} KB  kept as-is (webp would be {out_kb:.0f} KB)  {name}')
            skipped.append(name)
            continue

        before += src_kb
        after += out_kb
        converted += 1
        print(f'  {src_kb:7.0f} -> {out_kb:6.0f} KB  ({100 - out_kb / src_kb * 100:4.1f}% off)  {name}')

    print(f'\n  {converted} images   {before / 1024:.1f} MB -> {after / 1024:.1f} MB'
          f'   ({100 - after / before * 100:.1f}% smaller)')
    if skipped:
        print(f'  {len(skipped)} left as originals: {", ".join(skipped)}')


if __name__ == '__main__':
    print('Building WebP images...')
    main()
