#!/usr/bin/env python3
"""Composite the 1200x630 card that social platforms show when the site is shared.

There was no og:image at all. The obvious candidate — logo.png — is a
transparent wordmark, which most platforms flatten onto black or white, so the
script would have sat on a hard rectangle. This lays it over the hero forest
instead, darkened enough for the lettering to hold.

Output is JPEG: it is the format every scraper handles, and the card is
fetched by servers that will not negotiate WebP.

Run:  python3 tools/build_og_image.py
"""
import os

from PIL import Image, ImageEnhance

HERE = os.path.dirname(os.path.abspath(__file__))
IMAGES = os.path.join(HERE, '..', 'images')

W, H = 1200, 630


def main():
    bg = Image.open(os.path.join(IMAGES, 'hero-bg.webp')).convert('RGB')

    # cover-crop to the card ratio rather than squashing the forest
    scale = max(W / bg.width, H / bg.height)
    bg = bg.resize((round(bg.width * scale), round(bg.height * scale)), Image.LANCZOS)
    left, top = (bg.width - W) // 2, (bg.height - H) // 2
    card = bg.crop((left, top, left + W, top + H))

    # knock the forest back so the wordmark reads as the subject
    card = ImageEnhance.Brightness(card).enhance(0.5)
    card = ImageEnhance.Color(card).enhance(0.9)

    # logo.webp is deep purple and disappears into the forest; the light
    # variant is the one that reads against it
    logo = Image.open(os.path.join(IMAGES, 'logo_light.webp')).convert('RGBA')
    target_w = int(W * 0.66)
    logo = logo.resize((target_w, round(logo.height * target_w / logo.width)), Image.LANCZOS)
    card.paste(logo, ((W - logo.width) // 2, (H - logo.height) // 2), logo)

    out = os.path.join(IMAGES, 'og-card.jpg')
    card.save(out, 'JPEG', quality=86, optimize=True, progressive=True)
    print(f'  og-card.jpg  {W}x{H}  {os.path.getsize(out) / 1024:.0f} KB')


if __name__ == '__main__':
    print('Building social share card...')
    main()
