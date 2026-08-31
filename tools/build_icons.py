#!/usr/bin/env python3
"""Cut photoreal icon assets out of the full-size renders.

The site was using OS emoji (🔮, 👁 …) for its pictographic icons, which render
as flat cartoon glyphs and sit badly against the photoreal artwork elsewhere.
Two of those emoji have a real photographic counterpart already in the project,
so they get cut out here for use at icon size:

    crystal_ball_transparent.png        -> icon-orb.png   (replaces 🔮)
    photorealistic_purple_iris_orb.png  -> icon-eye.png   (replaces 👁)

Both sources have their dark studio background baked in despite the filenames,
so the sphere is masked out with a feathered circle rather than trusted alpha.

Run:  python3 tools/build_icons.py
"""
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
IMAGES = os.path.join(HERE, '..', 'images')

# Sphere geometry measured off the source render, not guessed: the widest
# bright run sits at y=440 spanning x 183..840.
ORB = {'src': 'crystal_ball_transparent.png', 'cx': 511, 'cy': 445, 'r': 322}
OUT_SIZE = 256


def circular_cutout(path, cx, cy, r, feather=6.0, out_size=OUT_SIZE):
    im = Image.open(path).convert('RGBA')

    mask = Image.new('L', im.size, 0)
    ImageDraw.Draw(mask).ellipse([cx - r, cy - r, cx + r, cy + r], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(feather))

    arr = np.array(im).astype(np.float64)
    arr[..., 3] = np.minimum(arr[..., 3], np.array(mask).astype(np.float64))
    # zero the colour under full transparency so PNG can compress the surround
    out = np.clip(arr, 0, 255).astype(np.uint8)
    out[..., :3][out[..., 3] == 0] = 0

    cut = Image.fromarray(out).crop((cx - r, cy - r, cx + r, cy + r))
    return cut.resize((out_size, out_size), Image.LANCZOS)


def main():
    orb = circular_cutout(os.path.join(IMAGES, ORB['src']),
                          ORB['cx'], ORB['cy'], ORB['r'])
    orb.save(os.path.join(IMAGES, 'icon-orb.png'))
    print(f"  icon-orb.png   {os.path.getsize(os.path.join(IMAGES, 'icon-orb.png')):>7,} bytes")

    # the iris orb is already cut out; it only needs sizing down
    eye = Image.open(os.path.join(IMAGES, 'photorealistic_purple_iris_orb.png')).convert('RGBA')
    eye = eye.resize((OUT_SIZE, OUT_SIZE), Image.LANCZOS)
    arr = np.array(eye)
    arr[..., :3][arr[..., 3] == 0] = 0
    Image.fromarray(arr).save(os.path.join(IMAGES, 'icon-eye.png'))
    print(f"  icon-eye.png   {os.path.getsize(os.path.join(IMAGES, 'icon-eye.png')):>7,} bytes")


if __name__ == '__main__':
    print('Building photoreal icons...')
    main()
