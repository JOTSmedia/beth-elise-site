#!/usr/bin/env python3
"""Generate the launch-readiness files the site was missing.

There was no favicon file at all, no robots.txt and no sitemap, so the tab
showed a blank page icon and a crawler had nothing to follow.

Favicons come from the iris orb — the same artwork as the aEYE assistant and
the preloader, so the tab icon matches what the visitor sees on arrival. They
are written as PNG rather than WebP: WebP favicons are ignored by some
browsers, and a favicon is the one place where the safest format wins.

Run:  python3 tools/build_site_files.py
"""
import io
import os

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')
IMAGES = os.path.join(ROOT, 'images')

SITE = 'https://bethelisepsychic.com'
PAGES = ['', 'pages/about.html', 'pages/services.html', 'pages/contact.html',
         'pages/merch.html', 'pages/notes-by-beth.html', 'pages/testimonials.html', 'pages/privacy.html', 'pages/terms.html']
# rough editorial priority, highest for the homepage and the booking page
PRIORITY = {'': '1.0', 'pages/contact.html': '0.9', 'pages/services.html': '0.9',
            'pages/about.html': '0.8', 'pages/merch.html': '0.7',
            'pages/notes-by-beth.html': '0.7', 'pages/testimonials.html': '0.6',
            'pages/privacy.html': '0.3', 'pages/terms.html': '0.3'}

ICONS = [('favicon-32.png', 32), ('favicon-180.png', 180),
         ('favicon-192.png', 192), ('favicon-512.png', 512)]


def favicons():
    src = Image.open(os.path.join(IMAGES, 'photorealistic_purple_iris_orb.webp')).convert('RGBA')
    for name, size in ICONS:
        src.resize((size, size), Image.LANCZOS).save(os.path.join(IMAGES, name), 'PNG', optimize=True)
        print(f'  images/{name}  {size}x{size}')


def robots():
    body = (
        '# Beth Elise Psychic Medium\n'
        'User-agent: *\n'
        'Allow: /\n'
        '\n'
        f'Sitemap: {SITE}/sitemap.xml\n'
    )
    io.open(os.path.join(ROOT, 'robots.txt'), 'w', encoding='utf-8').write(body)
    print('  robots.txt')


def sitemap():
    from datetime import date
    today = date.today().isoformat()
    urls = ''.join(
        f'  <url>\n'
        f'    <loc>{SITE}/{p}</loc>\n'
        f'    <lastmod>{today}</lastmod>\n'
        f'    <priority>{PRIORITY[p]}</priority>\n'
        f'  </url>\n'
        for p in PAGES)
    body = ('<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
            f'{urls}</urlset>\n')
    io.open(os.path.join(ROOT, 'sitemap.xml'), 'w', encoding='utf-8').write(body)
    print(f'  sitemap.xml  ({len(PAGES)} urls)')


def manifest():
    body = {
        'name': 'Beth Elise Psychic Medium',
        'short_name': 'Beth Elise',
        'description': 'Psychic readings, Reiki healing and EFT Tapping with Beth Elise.',
        'start_url': '/',
        'display': 'standalone',
        'background_color': '#1F0038',
        'theme_color': '#1F0038',
        'icons': [
            {'src': '/images/favicon-192.png', 'sizes': '192x192', 'type': 'image/png'},
            {'src': '/images/favicon-512.png', 'sizes': '512x512', 'type': 'image/png',
             'purpose': 'any maskable'},
        ],
    }
    import json
    io.open(os.path.join(ROOT, 'site.webmanifest'), 'w', encoding='utf-8').write(
        json.dumps(body, indent=2) + '\n')
    print('  site.webmanifest')


if __name__ == '__main__':
    print('Building site files...')
    favicons()
    robots()
    sitemap()
    manifest()
